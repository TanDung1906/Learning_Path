const coursesModel = require('../Models/coursesModel');
const chapterQuizConfigService = require('../services/chapterQuizConfigService');

function parsePositiveInt(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${label} không hợp lệ.`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

async function assertMentorOwnsCourse(courseId, instructorId) {
  const ownerId = await coursesModel.getCourseInstructorId(courseId);
  if (!ownerId) {
    return { ok: false, status: 404, message: 'Không tìm thấy khóa học.' };
  }
  if (instructorId && Number(ownerId) !== Number(instructorId)) {
    return { ok: false, status: 403, message: 'Bạn không có quyền cập nhật khóa học này.' };
  }
  return { ok: true, ownerId };
}

function handleError(res, error, fallbackMessage) {
  console.error(fallbackMessage, error);
  const statusCode = error.statusCode ?? 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message ?? fallbackMessage,
  });
}

const getChapterQuizConfig = async (req, res) => {
  try {
    const courseId = parsePositiveInt(req.params.courseId, 'courseId');
    const pathId = parsePositiveInt(req.params.pathId, 'pathId');
    const instructorId = req.user?.userId ?? null;

    const ownership = await assertMentorOwnsCourse(courseId, instructorId);
    if (!ownership.ok) {
      // Bỏ qua check quyền ownership để học viên (Student) có thể fetch được cấu hình bài kiểm tra. 
      // Chỉ chặn ở hàm PUT (lưu thiết lập).
      // return res.status(ownership.status).json({ success: false, message: ownership.message });
    }

    const result = await chapterQuizConfigService.getChapterQuizConfig(courseId, pathId);
    if (!result.ok) {
      return res.status(result.status ?? 400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        config: result.config,
        testConfig: result.testConfig ?? null,
        pathMeta: result.pathMeta ?? null,
      },
    });
  } catch (error) {
    return handleError(res, error, 'getChapterQuizConfig error:');
  }
};

const saveChapterQuizConfig = async (req, res) => {
  try {
    const courseId = parsePositiveInt(req.params.courseId, 'courseId');
    const pathId = parsePositiveInt(req.params.pathId, 'pathId');
    const instructorId = req.user?.userId ?? null;
    const config = req.body?.config ?? req.body ?? {};

    const ownership = await assertMentorOwnsCourse(courseId, instructorId);
    if (!ownership.ok) {
      return res.status(ownership.status).json({ success: false, message: ownership.message });
    }

    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: 'Thiếu thông tin mentor (x-user-id).',
      });
    }

    const result = await chapterQuizConfigService.saveChapterQuizConfig(
      courseId,
      pathId,
      config,
      instructorId,
    );

    if (!result.ok) {
      return res.status(result.status ?? 400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã lưu thiết lập kiểm tra cho chương.',
      data: {
        config: result.config,
      },
    });
  } catch (error) {
    return handleError(res, error, 'saveChapterQuizConfig error:');
  }
};

const listChapterQuizConfigsByCourse = async (req, res) => {
  try {
    const courseId = parsePositiveInt(req.params.courseId, 'courseId');
    const instructorId = req.user?.userId ?? null;

    const ownership = await assertMentorOwnsCourse(courseId, instructorId);
    if (!ownership.ok) {
      // Bỏ qua check quyền ownership để học viên (Student) có thể fetch được cấu hình bài kiểm tra.
      // return res.status(ownership.status).json({ success: false, message: ownership.message });
    }

    const result = await chapterQuizConfigService.listChapterQuizConfigsByCourse(courseId);
    return res.status(200).json({
      success: true,
      data: {
        configs: result.configs ?? [],
      },
    });
  } catch (error) {
    return handleError(res, error, 'listChapterQuizConfigsByCourse error:');
  }
};

const getCourseQuizConfig = async (req, res) => {
  try {
    const courseId = parsePositiveInt(req.params.courseId, 'courseId');
    const instructorId = req.user?.userId ?? null;

    await assertMentorOwnsCourse(courseId, instructorId);

    const result = await chapterQuizConfigService.getCourseQuizConfig(courseId);
    if (!result.ok) {
      return res.status(result.status ?? 400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        config: result.config,
        testConfig: result.testConfig ?? null,
        courseMeta: result.courseMeta ?? null,
      },
    });
  } catch (error) {
    return handleError(res, error, 'getCourseQuizConfig error:');
  }
};

const saveCourseQuizConfig = async (req, res) => {
  try {
    const courseId = parsePositiveInt(req.params.courseId, 'courseId');
    const instructorId = req.user?.userId ?? null;
    const config = req.body?.config ?? req.body ?? {};

    const ownership = await assertMentorOwnsCourse(courseId, instructorId);
    if (!ownership.ok) {
      return res.status(ownership.status).json({ success: false, message: ownership.message });
    }

    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: 'Thiếu thông tin mentor (x-user-id).',
      });
    }

    const result = await chapterQuizConfigService.saveCourseQuizConfig(
      courseId,
      config,
      instructorId,
    );

    if (!result.ok) {
      return res.status(result.status ?? 400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã lưu thiết lập kiểm tra toàn khóa.',
      data: {
        config: result.config,
      },
    });
  } catch (error) {
    return handleError(res, error, 'saveCourseQuizConfig error:');
  }
};

module.exports = {
  getChapterQuizConfig,
  saveChapterQuizConfig,
  getCourseQuizConfig,
  saveCourseQuizConfig,
  listChapterQuizConfigsByCourse,
};
