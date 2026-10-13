/**
 * Cấu hình Quiz/Test theo chương và kiểm tra toàn khóa — lưu qua API mentor.
 */
import axios from 'axios';
import { getUser } from '@/features/auth/utils/authUtils';
import {
  getDefaultChapterQuizConfig,
  getDefaultCourseQuizConfig,
  mergeQuizConfigFromApi,
  COURSE_QUIZ_CHAPTER_ID,
} from '@/features/mentor/utils/mentorChapterQuizConfigUtils';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '') + '/api';
const STORAGE_KEY = 'mentor_chapter_quiz_configs_v1';

function getAuthHeaders() {
  const userId = getUser()?.userId;
  const headers = { 'Content-Type': 'application/json' };
  if (userId) headers['x-user-id'] = String(userId);
  return headers;
}

function configKey(courseId, chapterId) {
  return `${courseId}_${chapterId}`;
}

function loadAllConfigs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllConfigs(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // storage full or unavailable
  }
}

export async function getChapterQuizConfig(courseId, chapterId, meta = {}) {
  if (courseId == null || chapterId == null) {
    return {
      ok: false,
      message: 'Thiếu thông tin khóa học hoặc chương',
    };
  }

  try {
    const { data: payload } = await axios.get(
      `${API_BASE}/mentor/courses/${encodeURIComponent(courseId)}/paths/${encodeURIComponent(chapterId)}/chapter-quiz-config`,
      { headers: getAuthHeaders() },
    );

    if (payload.success === false) {
      return {
        ok: false,
        message: payload.message ?? 'Không tải được thiết lập kiểm tra.',
      };
    }

    const stored = payload.data?.config;
    const testConfig = payload.data?.testConfig ?? null;
    const defaults = getDefaultChapterQuizConfig({
      courseId,
      chapterId,
      chapterTitle: meta.chapterTitle,
      chapterIndex: meta.chapterIndex,
    });

    return {
      ok: true,
      config: mergeQuizConfigFromApi(stored, testConfig, defaults),
    };
  } catch (error) {
    console.error('getChapterQuizConfig error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Lỗi kết nối khi tải thiết lập kiểm tra.',
    };
  }
}

export async function saveChapterQuizConfig(config) {
  if (config?.courseId == null || config?.chapterId == null) {
    return { ok: false, message: 'Thiếu thông tin khóa học hoặc chương' };
  }

  try {
    const { data: payload } = await axios.put(
      `${API_BASE}/mentor/courses/${encodeURIComponent(config.courseId)}/paths/${encodeURIComponent(config.chapterId)}/chapter-quiz-config`,
      { config },
      { headers: getAuthHeaders() },
    );

    if (payload.success === false) {
      return {
        ok: false,
        message: payload.message ?? 'Không thể lưu thiết lập',
      };
    }

    return {
      ok: true,
      config: payload.data?.config ?? config,
    };
  } catch (error) {
    console.error('saveChapterQuizConfig error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Lỗi kết nối khi lưu thiết lập kiểm tra.',
    };
  }
}

export async function getCourseQuizConfig(courseId, meta = {}) {
  if (courseId == null) {
    return {
      ok: false,
      message: 'Thiếu thông tin khóa học',
    };
  }

  try {
    const { data: payload } = await axios.get(
      `${API_BASE}/mentor/courses/${encodeURIComponent(courseId)}/course-quiz-config`,
      { headers: getAuthHeaders() },
    );

    if (payload.success === false) {
      return {
        ok: false,
        message: payload.message ?? 'Không tải được thiết lập kiểm tra toàn khóa.',
      };
    }

    const stored = payload.data?.config;
    const testConfig = payload.data?.testConfig ?? null;
    const defaults = getDefaultCourseQuizConfig({
      courseId,
      courseTitle: meta.courseTitle,
    });

    return {
      ok: true,
      config: mergeQuizConfigFromApi(stored, testConfig, defaults),
    };
  } catch (error) {
    console.error('getCourseQuizConfig error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Lỗi kết nối khi tải thiết lập kiểm tra toàn khóa.',
    };
  }
}

export async function saveCourseQuizConfig(config) {
  if (config?.courseId == null) {
    return { ok: false, message: 'Thiếu thông tin khóa học' };
  }

  try {
    const { data: payload } = await axios.put(
      `${API_BASE}/mentor/courses/${encodeURIComponent(config.courseId)}/course-quiz-config`,
      { config },
      { headers: getAuthHeaders() },
    );

    if (payload.success === false) {
      return {
        ok: false,
        message: payload.message ?? 'Không thể lưu thiết lập kiểm tra toàn khóa',
      };
    }

    return {
      ok: true,
      config: payload.data?.config ?? config,
    };
  } catch (error) {
    console.error('saveCourseQuizConfig error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Lỗi kết nối khi lưu thiết lập kiểm tra toàn khóa.',
    };
  }
}

export async function getChapterQuizConfigsByCourse(courseId) {
  try {
    const { data: payload } = await axios.get(
      `${API_BASE}/mentor/courses/${encodeURIComponent(courseId)}/chapter-quiz-configs`,
      { headers: getAuthHeaders() },
    );

    if (payload.success === false) {
      return {
        ok: false,
        message: payload.message ?? 'Không tải được danh sách thiết lập kiểm tra.',
        configs: [],
      };
    }

    return {
      ok: true,
      configs: payload.data?.configs ?? [],
    };
  } catch (error) {
    console.error('getChapterQuizConfigsByCourse error:', error);
    return {
      ok: false,
      message: error.response?.data?.message ?? 'Lỗi kết nối khi tải danh sách thiết lập.',
      configs: [],
    };
  }
}
