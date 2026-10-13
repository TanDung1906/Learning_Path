/**
 * Service làm bài kiểm tra của học viên.
 *
 * Vai trò: cầu nối giữa UI (CourseTestPage) và backend test API.
 * Một phần logic cũ vẫn dùng localStorage (lịch sử/prerequisite phía client);
 * luồng chính (meta / start / submit) đã gọi API thật.
 *
 * API backend:
 *   GET  /api/courses/:courseId/tests/:scope/meta?chapterId=
 *   POST /api/courses/:courseId/tests/:scope/start
 *   POST /api/courses/:courseId/tests/attempts/:attemptId/submit
 *   GET  /api/courses/:courseId/tests/attempts/:attemptId/section-stats
 *
 * scope:
 *   - 'chapter' → bài kiểm tra cuối chương (cần chapterId)
 *   - 'final'   → bài kiểm tra toàn khóa
 */
import { getUser } from '@/features/auth/utils/authUtils';
import {
  getChapterQuizConfig,
  getCourseQuizConfig,
  getChapterQuizConfigsByCourse,
} from '@/features/mentor/services/chapterQuizConfigService';
import {
  COURSE_QUIZ_CHAPTER_ID,
  getChapterQuizConfigTotal,
  getRequiredChapterIdsFromConfig,
  evaluateQuizPrerequisites,
  getConfiguredSkillTypes,
} from '@/features/mentor/utils/mentorChapterQuizConfigUtils';
import { normalizeTestPaper } from '@/features/learning/utils/courseTestPaperUtils';
import {
  createDemoTestMeta,
  createDemoTestPaper,
  DEMO_ANSWER_KEY,
} from '@/features/learning/data/courseTestMock';
import axios from 'axios';

// ─── HTTP client ─────────────────────────────────────────────────────────────

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '') + '/api';

/** Header gửi kèm mọi request; backend đọc x-user-id để biết học viên. */
function getAuthHeaders() {
  const userId = getUser()?.userId;
  const headers = { 'Content-Type': 'application/json' };
  if (userId) headers['x-user-id'] = String(userId);
  return headers;
}

// ─── localStorage (legacy / phụ trợ UI) ──────────────────────────────────────
// Dùng cho đếm lượt làm & kiểm tra prerequisite phía client khi chưa có đủ data từ API.

const ATTEMPTS_STORAGE_KEY = 'student_test_attempts_v1';
const SESSIONS_STORAGE_KEY = 'student_test_sessions_v1';

/** Bật true để bỏ qua giới hạn số lần làm bài ở phía client. */
export const BYPASS_ATTEMPT_LIMIT = false;

function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadMap(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveMap(key, map) {
  try {
    localStorage.setItem(key, JSON.stringify(map));
  } catch {
    // ignore quota / private mode
  }
}

/** Khóa phạm vi thi: 'final' hoặc id chương. */
function getScopeKey(scope, chapterId) {
  return scope === 'final' ? 'final' : String(chapterId ?? '');
}

function getAttemptHistoryKey(userId, courseId, scope, chapterId) {
  return `${userId}_${courseId}_${getScopeKey(scope, chapterId)}`;
}

function getAttemptHistory(userId, courseId, scope, chapterId) {
  const map = loadMap(ATTEMPTS_STORAGE_KEY);
  return map[getAttemptHistoryKey(userId, courseId, scope, chapterId)] ?? [];
}

function saveAttemptRecord(userId, courseId, scope, chapterId, record) {
  const map = loadMap(ATTEMPTS_STORAGE_KEY);
  const key = getAttemptHistoryKey(userId, courseId, scope, chapterId);
  const history = map[key] ?? [];
  map[key] = [...history, record];
  saveMap(ATTEMPTS_STORAGE_KEY, map);
}

function saveSession(attemptId, session) {
  const map = loadMap(SESSIONS_STORAGE_KEY);
  map[attemptId] = session;
  saveMap(SESSIONS_STORAGE_KEY, map);
}

function getSession(attemptId) {
  const map = loadMap(SESSIONS_STORAGE_KEY);
  return map[attemptId] ?? null;
}

// ─── Config mentor ───────────────────────────────────────────────────────────

/**
 * Tải cấu hình bài test do mentor thiết lập (Test_Config trên backend).
 * scope 'final' → getCourseQuizConfig; scope 'chapter' → getChapterQuizConfig.
 */
async function loadQuizConfig(courseId, scope, chapterId, meta = {}) {
  if (scope === 'final') {
    return getCourseQuizConfig(courseId, { courseTitle: meta.courseTitle ?? '' });
  }
  return getChapterQuizConfig(courseId, chapterId, {
    chapterTitle: meta.chapterTitle ?? '',
    chapterIndex: meta.chapterIndex ?? 0,
  });
}

/** Kiểm tra localStorage: học viên đã đạt bài test chương prerequisite chưa. */
function hasPassedChapterQuiz(userId, courseId, chapterId) {
  const history = getAttemptHistory(userId, courseId, 'chapter', chapterId);
  return history.some((item) => item.status === 'submitted' && item.passed);
}

/**
 * Đánh giá điều kiện mở bài test (các chương prerequisite phải đạt quiz chương).
 * Dùng config mentor + lịch sử local; backend cũng check lại khi start.
 */
async function resolvePrerequisiteStatus(courseId, config) {
  const requiredChapterIds = getRequiredChapterIdsFromConfig(config);
  if (requiredChapterIds.length === 0) {
    return { ok: true, blockers: [] };
  }

  const userId = getUser()?.userId;
  const configsRes = await getChapterQuizConfigsByCourse(courseId);
  const configByChapterId = new Map(
    (configsRes.ok ? configsRes.configs : [])
      .filter((item) => String(item?.chapterId) !== COURSE_QUIZ_CHAPTER_ID)
      .map((item) => [String(item.chapterId), item]),
  );

  return evaluateQuizPrerequisites(requiredChapterIds, (requiredChapterId) => {
    const chapterConfig = configByChapterId.get(String(requiredChapterId)) ?? {};
    return {
      chapterTitle: chapterConfig.title ?? `Chương ${requiredChapterId}`,
      quizTitle: chapterConfig.title ?? 'Bài kiểm tra chương',
      quizEnabled: Boolean(chapterConfig.enabled),
      passed: userId ? hasPassedChapterQuiz(userId, courseId, requiredChapterId) : false,
    };
  });
}

/** Ghép config mentor thành object meta hiển thị trên màn intro (fallback phía client). */
function buildMetaFromConfig(config, scope, extras = {}) {
  const userId = getUser()?.userId;
  const history = getAttemptHistory(
    userId,
    extras.courseId,
    scope,
    extras.chapterId,
  );
  const submittedCount = history.filter((item) => item.status === 'submitted').length;
  const maxAttempts = Number(config.maxAttempts) || 3;
  const totalQuestions =
    extras.totalQuestions ?? getChapterQuizConfigTotal(config);

  return {
    title: config.title,
    scope,
    courseId: extras.courseId,
    chapterId: extras.chapterId ?? null,
    chapterTitle: extras.chapterTitle ?? null,
    timeLimitMinutes: Number(config.timeLimitMinutes) || 15,
    passingScore: Number(config.passingScore) || 70,
    maxAttempts,
    totalQuestions,
    attemptsUsed: submittedCount,
    remainingAttempts: Math.max(0, maxAttempts - submittedCount),
    enabled: Boolean(config.enabled),
    isDemo: Boolean(extras.isDemo),
  };
}

/** Đáp án mẫu cho bộ đề demo (không dùng khi làm bài thật qua API). */
function buildDemoGradingQuestions(paper) {
  return (paper?.sections ?? []).flatMap((section) =>
    (section.questions ?? []).map((question) => ({
      tempId: question.tempId,
      score: 1,
      correctOptionTempIds: DEMO_ANSWER_KEY[question.tempId] ?? [],
      questionText: question.questionText,
      skillType: section.skillType,
    })),
  );
}

/**
 * Bổ sung meta từ API bằng thông tin config mentor (skills, tổng câu, title).
 * Gọi sau getTestMeta / startTestAttempt để UI có đủ field hiển thị.
 */
function enrichMetaWithConfig(meta = {}, config = {}, paper = null) {
  const configuredSkills = getConfiguredSkillTypes(config);
  const resolvedSkills = configuredSkills.length > 0
    ? configuredSkills
    : (meta.skills ?? []);
  const totalQuestions = paper?.totalQuestions
    ?? meta.totalQuestions
    ?? getChapterQuizConfigTotal(config);

  return {
    ...meta,
    skills: resolvedSkills,
    totalQuestions,
    title: config?.title || meta.title,
  };
}

// ─── API công khai ─────────────────────────────────────────────────────────────

/**
 * Màn intro bài test — tải meta trước khi học viên bấm「Bắt đầu làm bài」.
 *
 * Luồng:
 *   1. loadQuizConfig (mentor API) — thời gian, điểm pass, số lần làm...
 *   2. GET .../tests/:scope/meta — lịch sử, prerequisite, attemptsUsed (backend)
 *   3. enrichMetaWithConfig — gộp hai nguồn cho UI
 *
 * @returns {{ ok: boolean, meta?: object, message?: string }}
 */
export async function getTestMeta(courseId, scope, chapterId, meta = {}) {
  try {
    const configRes = await loadQuizConfig(courseId, scope, chapterId, meta);
    const url = `${API_BASE}/courses/${courseId}/tests/${scope}/meta`;
    const { data } = await axios.get(url, { params: { chapterId }, headers: getAuthHeaders() });

    if (!data?.ok) return data;

    return {
      ...data,
      meta: configRes.ok
        ? enrichMetaWithConfig(data.meta, configRes.config)
        : data.meta,
    };
  } catch (error) {
    console.error('getTestMeta error:', error);
    return { ok: false, message: 'Không tải được thông tin bài kiểm tra.' };
  }
}

/**
 * Bấm「Bắt đầu làm bài」— tạo attempt mới và nhận đề random từ backend.
 *
 * Luồng:
 *   1. loadQuizConfig — config mentor
 *   2. POST .../tests/:scope/start
 *      Backend: check prerequisite → lấy stats lần trước (final) → random đề → INSERT Test_Attempts
 *   3. normalizeTestPaper — chuẩn hóa shape đề cho UI
 *   4. getTestMeta + enrichMetaWithConfig — meta đầy đủ cho màn làm bài
 *
 * @param {string} scope - 'chapter' | 'final'
 * @returns {{ ok, meta, attempt: { attemptId, expiresAt, ... }, paper }}
 */
export async function startTestAttempt(courseId, scope, chapterId, meta = {}) {
  try {
    let body = { chapterId };
    const configResult = await loadQuizConfig(courseId, scope, chapterId, meta);
    const config = configResult.ok ? configResult.config : null;

    if (scope === 'final') {
      const finalConfig = config || {};
      body.timeLimitMinutes = finalConfig.timeLimitMinutes || 45;
      body.sources = finalConfig.sources || [];
    }

    const url = `${API_BASE}/courses/${courseId}/tests/${scope}/start`;
    const { data } = await axios.post(url, body, { headers: getAuthHeaders() });

    if (!data.ok) return data;

    const paper = data.paper ? normalizeTestPaper(data.paper) : null;

    const metaRes = await getTestMeta(courseId, scope, chapterId, meta);
    const resolvedMeta = enrichMetaWithConfig(
      metaRes.ok ? metaRes.meta : data.meta,
      config,
      paper,
    );

    return {
      ok: true,
      meta: resolvedMeta,
      attempt: {
        attemptId: data.attempt.attemptId,
        expiresAt: data.attempt.expiresAt,
        timeLimitMinutes: resolvedMeta?.timeLimitMinutes || body.timeLimitMinutes,
        status: 'in_progress',
      },
      paper,
    };
  } catch (error) {
    console.error('startTestAttempt error:', error);
    return { ok: false, message: error.response?.data?.message || 'Lỗi khi tạo đề thi mới.' };
  }
}

/**
 * Nộp bài — gửi đáp án xuống backend chấm điểm.
 *
 * Backend lưu Test_Attempt_Answers, Test_Attempt_Section_Stats, cập nhật IsPass.
 *
 * @param {object} options.scope - 'chapter' | 'final'
 * @param {object[]} options.paperSections - metadata section/câu đã random (cho thống kê)
 */
export async function submitTestAttempt(
  courseId,
  chapterId,
  attemptId,
  answers,
  timeSpentSeconds,
  totalQuestions,
  options = {},
) {
  try {
    const url = `${API_BASE}/courses/${courseId}/tests/attempts/${attemptId}/submit`;
    const { data } = await axios.post(
      url,
      {
        answers,
        timeSpentSeconds,
        chapterId,
        totalQuestions,
        scope: options.scope ?? 'chapter',
        paperSections: options.paperSections ?? [],
      },
      { headers: getAuthHeaders() },
    );
    return data;
  } catch (error) {
    console.error('submitTestAttempt error:', error);
    return { ok: false, message: 'Lỗi khi nộp bài.' };
  }
}

/**
 * Thống kê đúng/sai theo section của một lần làm bài (dialog「Xem chi tiết」trên intro).
 * Dữ liệu từ bảng Test_Attempt_Section_Stats.
 */
export async function fetchAttemptSectionStats(courseId, attemptId) {
  try {
    const url = `${API_BASE}/courses/${courseId}/tests/attempts/${attemptId}/section-stats`;
    const { data } = await axios.get(url, { headers: getAuthHeaders() });
    return data;
  } catch (error) {
    console.error('fetchAttemptSectionStats error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Không tải được thống kê lần làm bài.',
    };
  }
}
