import { buildCreateCourseStep1Payload } from './mentorCourseFormUtils';
import { sanitizePathsForStorage, stripNonLearningMaterials } from './mentorCourseContentUtils';

export const MENTOR_COURSE_CREATE_STORAGE_KEY = 'mentor_course_create_draft';

function isLegacyStep1Payload(data) {
  return Boolean(data && !data.course && ('CourseName' in data || 'InstructorId' in data));
}

export function normalizeCreateCourseDraft(data) {
  if (!data) return null;

  if (isLegacyStep1Payload(data)) {
    return {
      course: data,
      paths: [],
    };
  }

  return {
    course: data.course ?? null,
    paths: stripNonLearningMaterials(data.paths ?? []),
    meta: {
      contentDraftSaved: Boolean(data.meta?.contentDraftSaved),
    },
  };
}

export function saveCreateCourseDraft(draft) {
  const normalized = normalizeCreateCourseDraft(draft);
  sessionStorage.setItem(MENTOR_COURSE_CREATE_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function loadCreateCourseDraft() {
  try {
    const raw = sessionStorage.getItem(MENTOR_COURSE_CREATE_STORAGE_KEY);
    if (!raw) return null;
    return normalizeCreateCourseDraft(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveCreateCourseStep1ToStorage(form, instructorId) {
  const course = buildCreateCourseStep1Payload(form, instructorId);
  const existing = loadCreateCourseDraft();
  return saveCreateCourseDraft({
    course,
    paths: existing?.paths ?? [],
  });
}

export function loadCreateCourseStep1FromStorage() {
  const draft = loadCreateCourseDraft();
  return draft?.course ?? null;
}

export function saveCreateCourseContentToStorage(course, paths, meta = {}) {
  const existing = loadCreateCourseDraft();
  return saveCreateCourseDraft({
    course,
    paths: sanitizePathsForStorage(paths),
    meta: {
      ...(existing?.meta ?? {}),
      ...meta,
      contentDraftSaved: true,
    },
  });
}

export function clearCreateCourseDraft() {
  sessionStorage.removeItem(MENTOR_COURSE_CREATE_STORAGE_KEY);
}

/** Xóa snapshot nội dung (step 2) nhưng giữ thông tin khóa học step 1 trong session. */
export function discardCreateCourseContentFromStorage() {
  const existing = loadCreateCourseDraft();
  if (!existing?.course) {
    clearCreateCourseDraft();
    return null;
  }
  return saveCreateCourseDraft({
    course: existing.course,
    paths: [],
    meta: {
      contentDraftSaved: false,
    },
  });
}

export function formFromStep1Payload(payload) {
  const course = payload?.course ?? payload;
  if (!course) return null;

  return {
    CourseName: course.CourseName ?? '',
    Description: course.Description ?? '',
    CategoryId: course.CategoryId ?? '',
    LevelId: course.LevelId ?? '',
    Thumbnail: course.Thumbnail ?? '',
    IsPublished: Boolean(course.IsPublished),
  };
}
