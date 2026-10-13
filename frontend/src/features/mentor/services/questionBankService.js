/**
 * =============================================================================
 * questionBankService.js — API client cho ngân hàng câu hỏi
 * =============================================================================
 *
 * MỤC ĐÍCH: Tập trung mọi lời gọi REST API liên quan question bank.
 *
 * CÁC NHÓM HÀM CHÍNH:
 *   - fetchChapterSections / fetchSectionQuestions: TẢI dữ liệu
 *   - getChapterQuestionBankActiveStats / getCourseQuestionBankActiveStats: THỐNG KÊ
 *   - saveQuestionBankSection: LƯU section (insert/update/delete questions, choices)
 *   - ensureQuestionPathForChapter: đảm bảo bản ghi Questions_Path tồn tại
 *
 * Question bank service — API client.
 */

import axios from 'axios';
import { isQuestionBankDeleteOnlyPayload, serializeQuestionBankSavePayload } from '@/features/mentor/utils/questionBankApiMappers';
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '') + '/api';

const TODO = 'Question bank API chưa được implement.';

// ===== TẢI DỮ LIỆU =====

/** Tải danh sách section của một chương (path) trong khóa học. */
export async function fetchChapterSections(courseId, pathId) {
  try {
    const { data: payload } = await axios.get(
      `${API_BASE}/question-bank/courses/${encodeURIComponent(courseId)}/paths/${encodeURIComponent(pathId)}/sections`,
    );

    if (payload.success === false) {
      return {
        ok: false,
        message: payload.message ?? 'Không tải được danh sách section.',
        sections: [],
      };
    }

    return {
      ok: true,
      questionPathId: payload.data?.questionPathId ?? null,
      sections: payload.data?.sections ?? [],
    };
  } catch (error) {
    console.error('fetchChapterSections error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Lỗi kết nối khi tải section.',
      sections: [],
    };
  }
}

/** Tải danh sách câu hỏi của một section (theo SectionId). */
export async function fetchSectionQuestions(sectionId, { courseId, pathId } = {}) {
  try {
    const params = {};
    if (courseId) params.courseId = String(courseId);
    if (pathId) params.pathId = String(pathId);

    const { data: payload } = await axios.get(
      `${API_BASE}/question-bank/sections/${encodeURIComponent(sectionId)}/questions`,
      { params },
    );

    if (payload.success === false) {
      return {
        ok: false,
        message: payload.message ?? 'Không tải được câu hỏi.',
        questions: [],
      };
    }

    return {
      ok: true,
      questions: payload.data?.questions ?? [],
    };
  } catch (error) {
    console.error('fetchSectionQuestions error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Lỗi kết nối khi tải câu hỏi.',
      questions: [],
    };
  }
}

// ===== THỐNG KÊ =====

const emptyStats = {
  ok: true,
  hasBank: false,
  questionCountBySkill: {
    LISTENING: 0,
    READING: 0,
    VOCABULARY: 0,
  },
  listeningSectionGroups: [],
  readingSectionGroups: [],
  vocabularySectionGroups: [],
  totalActive: 0,
};

function mapSectionGroups(groups = []) {
  return (groups ?? []).map((group) => ({
    sectionTempId: group.sectionTempId,
    sectionTitle: group.sectionTitle ?? 'Section',
    availableCount: Math.max(0, Number(group.availableCount ?? 0)),
    isUseForTest: group.isUseForTest !== false,
  }));
}

function mapChapterActiveStatsPayload(payload = {}) {
  const questionCountBySkill = {
    LISTENING: Number(payload.questionCountBySkill?.LISTENING) || 0,
    READING: Number(payload.questionCountBySkill?.READING) || 0,
    VOCABULARY: Number(payload.questionCountBySkill?.VOCABULARY ?? payload.questionCountBySkill?.WRITING) || 0,
  };
  const totalActive = Number(payload.totalActive);
  const resolvedTotal = Number.isFinite(totalActive)
    ? totalActive
    : Object.values(questionCountBySkill).reduce((sum, count) => sum + count, 0);

  return {
    ok: true,
    hasBank: Boolean(payload.hasBank),
    questionCountBySkill,
    listeningSectionGroups: mapSectionGroups(payload.listeningSectionGroups),
    readingSectionGroups: mapSectionGroups(payload.readingSectionGroups),
    vocabularySectionGroups: mapSectionGroups(
      payload.vocabularySectionGroups ?? payload.writingSectionGroups,
    ),
    totalActive: resolvedTotal,
    questionPathId: payload.questionPathId ?? null,
  };
}

function mapCourseActiveStatsPayload(payload = {}) {
  const chapters = (payload.chapters ?? []).map((chapter) => ({
    PathId: chapter.PathId,
    PathName: chapter.PathName,
    Order: chapter.Order,
    hasBank: Boolean(chapter.hasBank),
    questionCountBySkill: {
      LISTENING: Number(chapter.questionCountBySkill?.LISTENING) || 0,
      READING: Number(chapter.questionCountBySkill?.READING) || 0,
      VOCABULARY: Number(chapter.questionCountBySkill?.VOCABULARY ?? chapter.questionCountBySkill?.WRITING) || 0,
    },
    totalActive: Number(chapter.totalActive) || 0,
    listeningSectionGroups: mapSectionGroups(chapter.listeningSectionGroups),
    readingSectionGroups: mapSectionGroups(chapter.readingSectionGroups),
    vocabularySectionGroups: mapSectionGroups(
      chapter.vocabularySectionGroups ?? chapter.writingSectionGroups,
    ),
  }));

  const questionCountBySkill = {
    LISTENING: Number(payload.questionCountBySkill?.LISTENING) || 0,
    READING: Number(payload.questionCountBySkill?.READING) || 0,
    VOCABULARY: Number(payload.questionCountBySkill?.VOCABULARY ?? payload.questionCountBySkill?.WRITING) || 0,
  };

  return {
    ok: true,
    hasBank: Boolean(payload.hasBank),
    bankCount: Number(payload.bankCount) || chapters.filter((chapter) => chapter.hasBank).length,
    chapters,
    questionCountBySkill,
    totalActive: Number(payload.totalActive) || 0,
  };
}

export function invalidateQuestionBankListCache() {}

/** Thống kê câu hỏi active theo chương (dùng cho quiz config). */
export async function getChapterQuestionBankActiveStats(courseId, pathId) {
  try {
    const { data: payload } = await axios.get(
      `${API_BASE}/question-bank/courses/${encodeURIComponent(courseId)}/paths/${encodeURIComponent(pathId)}/active-stats`,
    );

    if (payload.success === false) {
      return {
        ...emptyStats,
        ok: false,
        message: payload.message ?? 'Không tải được thống kê ngân hàng câu hỏi.',
      };
    }

    return mapChapterActiveStatsPayload(payload.data ?? {});
  } catch (error) {
    console.error('getChapterQuestionBankActiveStats error:', error);
    return {
      ...emptyStats,
      ok: false,
      message: error.response?.data?.message ?? 'Lỗi kết nối khi tải thống kê ngân hàng câu hỏi.',
    };
  }
}

/** Thống kê câu hỏi active toàn khóa học (tổng hợp tất cả chương). */
export async function getCourseQuestionBankActiveStats(courseId) {
  try {
    const { data: payload } = await axios.get(
      `${API_BASE}/question-bank/courses/${encodeURIComponent(courseId)}/active-stats`,
    );

    if (payload.success === false) {
      return {
        ok: false,
        message: payload.message ?? 'Không tải được thống kê ngân hàng câu hỏi toàn khóa.',
        hasBank: false,
        bankCount: 0,
        chapters: [],
        questionCountBySkill: emptyStats.questionCountBySkill,
        totalActive: 0,
      };
    }

    return mapCourseActiveStatsPayload(payload.data ?? {});
  } catch (error) {
    console.error('getCourseQuestionBankActiveStats error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Lỗi kết nối khi tải thống kê ngân hàng câu hỏi toàn khóa.',
      hasBank: false,
      bankCount: 0,
      chapters: [],
      questionCountBySkill: emptyStats.questionCountBySkill,
      totalActive: 0,
    };
  }
}

// ===== STUB — API chưa implement =====

export async function getQuestionBanks() {
  return { ok: true, banks: [] };
}

export async function fetchPathQuestionBank() {
  return { ok: false, message: TODO };
}

export async function fetchBankPathList() {
  return { ok: false, message: TODO, bank: null, paths: [] };
}

export async function fetchQuestionBankById() {
  return { ok: false, message: TODO };
}

export async function getQuestionBankById() {
  return { ok: false, message: TODO };
}

export async function setChapterQuestionPublic() {
  return { ok: false, message: TODO };
}

export async function deleteChapterQuestion() {
  return { ok: false, message: TODO };
}

export async function setAllChapterQuestionsPublic() {
  return { ok: false, message: TODO };
}

export async function findQuestionBankByChapter() {
  return { ok: false, message: TODO };
}

export async function getQuestionBankByChapter() {
  return { ok: false, message: TODO };
}

export async function getQuestionBanksByCourse() {
  return { ok: true, banks: [] };
}

export async function getQuestionBanksByScope(_courseId, _scope, _chapterId = null) {
  return { ok: true, banks: [] };
}

export async function getQuestionBanksForQuiz() {
  return { ok: true, banks: [] };
}

export async function getCourseChapterBankStats() {
  return {
    ok: true,
    chapterBankCount: 0,
    chaptersWithQuestions: 0,
    questionCountBySkill: emptyStats.questionCountBySkill,
    totalQuestions: 0,
    banks: [],
  };
}

export async function getQuestionBankListSummaries() {
  return { ok: true, items: [] };
}

export async function createQuestionBank() {
  return { ok: false, message: TODO };
}

export async function updatePathQuestions() {
  return { ok: false, message: TODO };
}

// ===== LƯU DỮ LIỆU =====

/** Đảm bảo bản ghi Questions_Path tồn tại trước khi lưu section mới. */
export async function ensureQuestionPathForChapter(courseId, pathId) {
  try {
    const { data } = await axios.post(
      `${API_BASE}/question-bank/courses/${encodeURIComponent(courseId)}/paths/${encodeURIComponent(pathId)}/question-path/ensure`,
      {},
      { headers: { 'Content-Type': 'application/json' } },
    );

    if (data?.success === false) {
      return {
        ok: false,
        message: data.message ?? 'Không thể kiểm tra Questions_Path.',
      };
    }

    return {
      ok: true,
      questionPathId: data?.data?.questionPathId ?? null,
      created: Boolean(data?.data?.created),
      message: data?.message ?? 'Đã kiểm tra Questions_Path.',
    };
  } catch (error) {
    console.error('ensureQuestionPathForChapter error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Không thể kiểm tra Questions_Path.',
    };
  }
}

/**
 * Lưu thay đổi section lên server.
 * Luồng: serialize payload → ensure question path → delete questions →
 *         update source URL → update section → update/insert/delete questions & choices → insert section
 */
export async function saveQuestionBankSection(savePayload) {
  try {
    let body;
    try {
      body = serializeQuestionBankSavePayload(savePayload);
    } catch (serializationError) {
      return {
        ok: false,
        message: serializationError.message ?? 'Payload lưu section không hợp lệ.',
      };
    }

    const context = body?.context ?? {};
    const sectionId = context.sectionId ?? null;
    const { courseId, pathId } = context;
    const questionIdMap = [];
    const choiceIdMap = [];
    let savedSourceUrl = null;
    let resolvedQuestionPathId = context.questionPathId ?? null;

    if (courseId && pathId && !isQuestionBankDeleteOnlyPayload(body)) {
      const ensureResult = await ensureQuestionPathForChapter(courseId, pathId);
      if (!ensureResult.ok) {
        return ensureResult;
      }
      resolvedQuestionPathId = ensureResult.questionPathId ?? resolvedQuestionPathId;
      body.context = {
        ...body.context,
        questionPathId: resolvedQuestionPathId,
      };
    }

    for (const item of body.questionsDelete ?? []) {
      const questionId = item.questionId;
      const targetSectionId = item.sectionId ?? sectionId;
      const { data } = await axios.delete(
        `${API_BASE}/question-bank/questions/${encodeURIComponent(questionId)}`,
        {
          data: {
            sectionId: targetSectionId,
            courseId,
            pathId,
          },
        },
      );
      if (data?.success === false) {
        return { ok: false, message: data.message ?? 'Không thể xóa question.' };
      }
    }

    if (body.sectionSourceUpdate?.sectionId) {
      const sourceResult = await updateQuestionBankSectionSourceUrl(
        body.sectionSourceUpdate.sectionId,
        body.sectionSourceUpdate.SourceUrl,
        { courseId, pathId },
      );
      if (!sourceResult.ok) {
        return sourceResult;
      }
      savedSourceUrl = sourceResult.sourceUrl ?? null;
    }

    if (body.sectionUpdate?.set && sectionId) {
      const { data } = await axios.put(
        `${API_BASE}/question-bank/sections/${encodeURIComponent(sectionId)}`,
        {
          context: { courseId, pathId, sectionId },
          sectionUpdate: body.sectionUpdate,
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (data?.success === false) {
        return { ok: false, message: data.message ?? 'Không thể cập nhật section.' };
      }
      savedSourceUrl = data?.data?.sourceUrl ?? savedSourceUrl;
    }

    for (const item of body.questionsUpdate ?? []) {
      const targetSectionId = item.sectionId ?? sectionId;
      const hasQuestionPatch =
        Object.keys(item.set ?? {}).length > 0
        || item.Order != null
        || item.order != null;

      if (hasQuestionPatch) {
        const { data } = await axios.put(
          `${API_BASE}/question-bank/questions/${encodeURIComponent(item.questionId)}`,
          {
            sectionId: targetSectionId,
            courseId,
            pathId,
            set: item.set ?? {},
            order: item.Order ?? item.order ?? null,
          },
          { headers: { 'Content-Type': 'application/json' } },
        );
        if (data?.success === false) {
          return { ok: false, message: data.message ?? 'Không thể cập nhật question.' };
        }
      }

      for (const choiceUpdate of item.choicesUpdate ?? []) {
        const { data } = await axios.put(
          `${API_BASE}/question-bank/choices/${encodeURIComponent(choiceUpdate.choiceId)}`,
          {
            questionId: choiceUpdate.questionId ?? item.questionId,
            sectionId: targetSectionId,
            courseId,
            pathId,
            set: choiceUpdate.set ?? {},
          },
          { headers: { 'Content-Type': 'application/json' } },
        );
        if (data?.success === false) {
          return { ok: false, message: data.message ?? 'Không thể cập nhật choice.' };
        }
      }

      for (const choiceDelete of item.choicesDelete ?? []) {
        const { data } = await axios.delete(
          `${API_BASE}/question-bank/choices/${encodeURIComponent(choiceDelete.choiceId)}`,
          {
            data: {
              questionId: choiceDelete.questionId ?? item.questionId,
              sectionId: targetSectionId,
              courseId,
              pathId,
            },
          },
        );
        if (data?.success === false) {
          return { ok: false, message: data.message ?? 'Không thể xóa choice.' };
        }
      }

      for (const choiceInsert of item.choicesInsert ?? []) {
        const { data } = await axios.post(
          `${API_BASE}/question-bank/questions/${encodeURIComponent(item.questionId)}/choices`,
          {
            sectionId: targetSectionId,
            courseId,
            pathId,
            data: choiceInsert.data ?? {},
            clientRef: choiceInsert.clientRef ?? null,
          },
          { headers: { 'Content-Type': 'application/json' } },
        );
        if (data?.success === false) {
          return { ok: false, message: data.message ?? 'Không thể tạo choice.' };
        }
        if (data?.data?.clientRef && data?.data?.choiceId) {
          choiceIdMap.push({
            clientRef: data.data.clientRef,
            choiceId: data.data.choiceId,
            questionId: data.data.questionId ?? item.questionId,
          });
        }
      }
    }

    for (const item of body.questionsInsert ?? []) {
      const targetSectionId = item.sectionId ?? sectionId;
      const { data } = await axios.post(
        `${API_BASE}/question-bank/sections/${encodeURIComponent(targetSectionId)}/questions`,
        {
          courseId,
          pathId,
          order: item.Order ?? item.order ?? 1,
          data: item.data ?? {},
          choicesInsert: item.choicesInsert ?? [],
          clientRef: item.clientRef ?? null,
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (data?.success === false) {
        return { ok: false, message: data.message ?? 'Không thể tạo question.' };
      }
      if (data?.data?.clientRef && data?.data?.questionId) {
        questionIdMap.push({
          clientRef: data.data.clientRef,
          questionId: data.data.questionId,
        });
      }
      if (Array.isArray(data?.data?.choiceIdMap)) {
        choiceIdMap.push(...data.data.choiceIdMap);
      }
    }

    if (body.sectionInsert?.data) {
      const url = `${API_BASE}/question-bank/courses/${encodeURIComponent(courseId)}/paths/${encodeURIComponent(pathId)}/sections`;
      const { data } = await axios.post(
        url,
        body,
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (data?.success === false) {
        return { ok: false, message: data.message ?? 'Không thể tạo section.' };
      }
      return {
        ok: true,
        sectionId: data?.data?.sectionId ?? sectionId ?? null,
        questionPathId: resolvedQuestionPathId,
        questionIdMap: data?.data?.questionIdMap ?? questionIdMap,
        choiceIdMap: data?.data?.choiceIdMap ?? choiceIdMap,
        sourceUrl: data?.data?.sourceUrl ?? savedSourceUrl,
        sectionOrder: data?.data?.sectionOrder ?? null,
        message: data?.message ?? 'Đã cập nhật section.',
      };
    }

    return {
      ok: true,
      sectionId: sectionId ?? null,
      questionPathId: resolvedQuestionPathId,
      questionIdMap,
      choiceIdMap,
      sourceUrl: savedSourceUrl,
      message: 'Đã cập nhật section.',
    };
  } catch (error) {
    console.error('saveQuestionBankSection error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Không thể cập nhật section.',
    };
  }
}

/** Cập nhật URL nguồn (audio/reading) của section. */
export async function updateQuestionBankSectionSourceUrl(
  sectionId,
  sourceUrl,
  { courseId, pathId } = {},
) {
  try {
    const { data } = await axios.patch(
      `${API_BASE}/question-bank/sections/${encodeURIComponent(sectionId)}/source-url`,
      {
        sourceUrl: sourceUrl ?? null,
        courseId: courseId != null ? Number(courseId) : null,
        pathId: pathId != null ? Number(pathId) : null,
      },
    );

    if (data?.success === false) {
      return {
        ok: false,
        message: data.message ?? 'Không thể cập nhật URL đề bài.',
      };
    }

    return {
      ok: true,
      sectionId: data?.data?.sectionId ?? sectionId,
      sourceUrl: data?.data?.sourceUrl ?? sourceUrl ?? null,
      message: data?.message ?? 'Đã cập nhật URL đề bài.',
    };
  } catch (error) {
    console.error('updateQuestionBankSectionSourceUrl error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Không thể cập nhật URL đề bài.',
    };
  }
}

/** Bật/tắt isUseForTest cho một câu hỏi. */
export async function updateQuestionUseForTest(questionId, isUseForTest) {
  try {
    const { data } = await axios.patch(
      `${API_BASE}/question-bank/questions/${encodeURIComponent(questionId)}/use-for-test`,
      { isUseForTest: Boolean(isUseForTest) },
      { headers: { 'Content-Type': 'application/json' } },
    );

    if (data?.success === false) {
      return {
        ok: false,
        message: data.message ?? 'Không thể cập nhật trạng thái câu hỏi.',
      };
    }

    return {
      ok: true,
      questionId: data?.data?.questionId ?? questionId,
      isUseForTest: data?.data?.isUseForTest ?? Boolean(isUseForTest),
      message: data?.message ?? 'Đã cập nhật trạng thái câu hỏi.',
    };
  } catch (error) {
    console.error('updateQuestionUseForTest error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Không thể cập nhật trạng thái câu hỏi.',
    };
  }
}

// ===== STUB tiếp — fetch courses/chapters =====

export async function updateQuestionBank() {
  return { ok: false, message: TODO };
}

export async function fetchCoursesForQB() {
  return { ok: true, courses: [] };
}

export async function fetchCourseForQB() {
  return { ok: false, message: TODO };
}

export async function fetchCourseContentOutlineForQB() {
  return { ok: true, chapters: [] };
}

export async function fetchChaptersForCourse() {
  return { ok: true, chapters: [] };
}

export const getCourseChapters = fetchChaptersForCourse;

export async function fetchChaptersWithoutQuestionBank() {
  return { ok: true, chapters: [] };
}

export async function fetchCoursesWithChaptersMissingBank() {
  return { ok: true, courses: [] };
}

export async function fetchCoursesWithoutQuestionBank() {
  return fetchCoursesWithChaptersMissingBank();
}
