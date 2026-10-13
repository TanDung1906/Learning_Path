const { sql } = require('../config/db');
const chapterQuizConfigModel = require('../Models/chapterQuizConfigModel');
const questionBankModel = require('../Models/questionBankModel');
const {
  TYPE_ID_TO_SKILL,
  mapSkillTypeToTypeId,
} = require('../utils/sectionSkillType');

const SKILL_LISTENING = 'LISTENING';
const SKILL_READING = 'READING';
const SKILL_VOCABULARY = 'VOCABULARY';

const TYPE_ID_VOCABULARY = 3;

function isSkillSectionRandomPick(part) {
  return part === SKILL_LISTENING || part === SKILL_READING;
}

function getPartConfig(config, part) {
  return (config?.questionConfigs ?? []).find((entry) => entry.part === part) ?? {};
}

function getSectionCountForPart(config, part) {
  const item = getPartConfig(config, part);
  return Math.max(0, Number(item.sectionCount ?? 0) || 0);
}

function getSectionQuestionCountsForPart(config, part) {
  const item = getPartConfig(config, part);
  return Array.isArray(item.sectionQuestionCounts) ? item.sectionQuestionCounts : [];
}

function getRequiredChapterIds(config) {
  return (config?.requiredChapterIds ?? []).map(String).filter(Boolean);
}

function hasConfiguredQuizSources(config) {
  const listening = getSectionCountForPart(config, SKILL_LISTENING);
  const reading = getSectionCountForPart(config, SKILL_READING);
  const vocabulary = getSectionQuestionCountsForPart(config, SKILL_VOCABULARY)
    .reduce((sum, entry) => sum + Math.max(0, Number(entry.questionCount ?? 0) || 0), 0);
  return listening > 0 || reading > 0 || vocabulary > 0;
}

function getSkillGroupsFromBankStats(bankStats, part) {
  if (part === SKILL_LISTENING) return bankStats?.listeningSectionGroups ?? [];
  if (part === SKILL_READING) return bankStats?.readingSectionGroups ?? [];
  if (part === SKILL_VOCABULARY) return bankStats?.vocabularySectionGroups ?? [];
  return [];
}

function getInTestGroups(groups = []) {
  return (groups ?? []).filter((group) => group.isUseForTest !== false);
}

function parseSectionIdFromTempId(sectionTempId) {
  const match = String(sectionTempId ?? '').match(/^section_(\d+)$/);
  return match ? Number(match[1]) : null;
}

function toSectionTempId(sectionId) {
  return sectionId != null ? `section_${sectionId}` : null;
}

function findGroupBySectionId(groups, sectionId, pathId = null) {
  const tempId = pathId != null
    ? buildCourseSectionTempId(pathId, toSectionTempId(sectionId))
    : toSectionTempId(sectionId);
  return (groups ?? []).find((item) => String(item.sectionTempId) === String(tempId)) ?? null;
}

function buildSectionRowsFromConfig(config, bankStats) {
  const rows = [];

  [SKILL_LISTENING, SKILL_READING].forEach((part) => {
    const sectionCount = getSectionCountForPart(config, part);
    if (sectionCount <= 0) return;

    const inTestGroups = getInTestGroups(getSkillGroupsFromBankStats(bankStats, part));
    if (inTestGroups.length === 0) {
      throw new Error(`Chưa có section ${part} dùng trong bài kiểm tra.`);
    }
    if (sectionCount > inTestGroups.length) {
      throw new Error(
        `Phần ${part} hiện chỉ có ${inTestGroups.length} section, không thể lấy ${sectionCount} section.`,
      );
    }

    rows.push({
      TypeId: mapSkillTypeToTypeId(part),
      QuestionQuantity: sectionCount,
      BankSectionId: null,
    });
  });

  const vocabularyGroups = getSkillGroupsFromBankStats(bankStats, SKILL_VOCABULARY);
  getSectionQuestionCountsForPart(config, SKILL_VOCABULARY).forEach((entry) => {
    const questionCount = Math.max(0, Number(entry.questionCount ?? 0) || 0);
    if (questionCount <= 0) return;

    const parsed = parseCourseSectionTempId(entry.sectionTempId);
    const bankSectionId = parsed.sectionId;
    if (!bankSectionId) {
      throw new Error('Section từ vựng/ngữ pháp không hợp lệ.');
    }

    const group = getInTestGroups(vocabularyGroups).find(
      (item) => String(item.sectionTempId) === String(entry.sectionTempId)
        || (
          parsed.pathId == null
          && parseSectionIdFromTempId(item.sectionTempId) === bankSectionId
        ),
    );
    if (!group) {
      throw new Error(`Section từ vựng/ngữ pháp (${entry.sectionTempId}) không còn dùng trong bài kiểm tra.`);
    }
    if (questionCount > (group.availableCount ?? 0)) {
      throw new Error(
        `Section "${group.sectionTitle}" chỉ có ${group.availableCount ?? 0} câu, không đủ để lấy ${questionCount} câu.`,
      );
    }

    rows.push({
      TypeId: TYPE_ID_VOCABULARY,
      QuestionQuantity: questionCount,
      BankSectionId: bankSectionId,
      PathId: parsed.pathId,
    });
  });

  return rows;
}

const COURSE_QUIZ_CHAPTER_ID = '__course__';

function getSelectedChapterIds(config = {}) {
  return (config?.selectedChapterIds ?? []).map(String).filter(Boolean);
}

function buildCourseSectionTempId(pathId, sectionTempId) {
  const base = String(sectionTempId ?? '');
  if (!base) return '';
  if (base.includes('::')) return base;
  return `${pathId}::${base}`;
}

function parseCourseSectionTempId(sectionTempId) {
  const raw = String(sectionTempId ?? '');
  const composite = raw.match(/^(\d+)::section_(\d+)$/);
  if (composite) {
    return {
      pathId: Number(composite[1]),
      sectionId: Number(composite[2]),
    };
  }
  return {
    pathId: null,
    sectionId: parseSectionIdFromTempId(raw),
  };
}

function aggregateCourseBankStats(courseStats = {}, selectedChapterIds = []) {
  const selected = new Set(selectedChapterIds.map(String));
  const chapters = (courseStats.chapters ?? []).filter(
    (chapter) => selected.has(String(chapter.PathId)),
  );

  const listeningSectionGroups = [];
  const readingSectionGroups = [];
  const vocabularySectionGroups = [];

  chapters.forEach((chapter) => {
    (chapter.listeningSectionGroups ?? []).forEach((group) => {
      listeningSectionGroups.push({
        ...group,
        sectionTempId: buildCourseSectionTempId(chapter.PathId, group.sectionTempId),
        sectionTitle: `${chapter.PathName} · ${group.sectionTitle}`,
      });
    });
    (chapter.readingSectionGroups ?? []).forEach((group) => {
      readingSectionGroups.push({
        ...group,
        sectionTempId: buildCourseSectionTempId(chapter.PathId, group.sectionTempId),
        sectionTitle: `${chapter.PathName} · ${group.sectionTitle}`,
      });
    });
    (chapter.vocabularySectionGroups ?? []).forEach((group) => {
      vocabularySectionGroups.push({
        ...group,
        sectionTempId: buildCourseSectionTempId(chapter.PathId, group.sectionTempId),
        sectionTitle: `${chapter.PathName} · ${group.sectionTitle}`,
      });
    });
  });

  const questionCountBySkill = {
    LISTENING: 0,
    READING: 0,
    VOCABULARY: 0,
  };

  chapters.forEach((chapter) => {
    questionCountBySkill.LISTENING += chapter.questionCountBySkill?.LISTENING ?? 0;
    questionCountBySkill.READING += chapter.questionCountBySkill?.READING ?? 0;
    questionCountBySkill.VOCABULARY += chapter.questionCountBySkill?.VOCABULARY ?? 0;
  });

  const totalActive = Object.values(questionCountBySkill).reduce((sum, count) => sum + count, 0);

  return {
    hasBank: chapters.length > 0,
    bankCount: chapters.length,
    chapters,
    questionCountBySkill,
    totalActive,
    listeningSectionGroups,
    readingSectionGroups,
    vocabularySectionGroups,
  };
}

function mapCourseBundleToClientConfig(bundle, bankStats = null) {
  if (!bundle?.test) return null;

  const selectedChapterIds = bundle.selectedChapterIds ?? [];

  const base = mapBundleToClientConfig(
    {
      ...bundle,
      pathId: COURSE_QUIZ_CHAPTER_ID,
      requiredChapterIds: selectedChapterIds,
    },
    bankStats,
  );

  if (!base) return null;

  return {
    ...base,
    chapterId: COURSE_QUIZ_CHAPTER_ID,
    selectedChapterIds,
    requiredChapterIds: selectedChapterIds,
  };
}

function mapTestConfigFromBundle(bundle) {
  if (!bundle?.test) return null;

  const { config, passConfig } = bundle;
  if (!config && !passConfig) return null;

  return {
    timeLimitMinutes: config?.DurationMinutes != null
      ? Number(config.DurationMinutes)
      : null,
    maxAttempts: config?.MaxAttempts != null
      ? Number(config.MaxAttempts)
      : null,
    passingScore: passConfig?.MinPassScore != null
      ? Number(passConfig.MinPassScore)
      : null,
  };
}

function mapBundleToClientConfig(bundle, bankStats = null) {
  if (!bundle?.test) return null;

  const questionConfigs = [
    { part: SKILL_LISTENING, sectionCount: 0, sectionQuestionCounts: [] },
    { part: SKILL_READING, sectionCount: 0, sectionQuestionCounts: [] },
    { part: SKILL_VOCABULARY, sectionCount: 0, sectionQuestionCounts: [] },
  ];

  (bundle.configSections ?? []).forEach((row) => {
    const skill = TYPE_ID_TO_SKILL[row.TypeId] ?? SKILL_VOCABULARY;
    const partConfig = questionConfigs.find((entry) => entry.part === skill);
    if (!partConfig) return;

    if (isSkillSectionRandomPick(skill)) {
      partConfig.sectionCount = Math.max(
        partConfig.sectionCount,
        Number(row.QuestionQuantity) || 0,
      );
      return;
    }

    const vocabularyGroups = getSkillGroupsFromBankStats(bankStats, SKILL_VOCABULARY);
    const group = row.PathId != null
      ? findGroupBySectionId(
        vocabularyGroups,
        row.BankSectionId,
        row.PathId,
      )
      : findGroupBySectionId(vocabularyGroups, row.BankSectionId);

    const sectionTempId = row.PathId != null
      ? buildCourseSectionTempId(row.PathId, toSectionTempId(row.BankSectionId))
      : (toSectionTempId(row.BankSectionId)
        ?? (group?.sectionTempId ?? `section_${row.BankSectionId}`));

    partConfig.sectionQuestionCounts.push({
      sectionTempId,
      questionCount: Number(row.QuestionQuantity) || 0,
    });
  });

  return {
    id: bundle.test.TestId,
    courseId: bundle.courseId,
    chapterId: String(bundle.pathId),
    title: bundle.test.TestName ?? '',
    enabled: Boolean(bundle.test.IsActive),
    timeLimitMinutes: Number(bundle.config?.DurationMinutes ?? 15),
    passingScore: Number(bundle.passConfig?.MinPassScore ?? 70),
    maxAttempts: Number(bundle.config?.MaxAttempts ?? 3),
    requiredChapterIds: bundle.requiredChapterIds ?? [],
    questionConfigs,
    updatedAt: bundle.config?.UpdatedAt
      ? new Date(bundle.config.UpdatedAt).toISOString()
      : null,
  };
}

async function validateCourseSavePayload(courseId, config) {
  const courseMeta = await chapterQuizConfigModel.getCourseMeta(courseId);
  if (!courseMeta) {
    return { ok: false, status: 404, message: 'Không tìm thấy khóa học.' };
  }

  const courseStats = await questionBankModel.getCourseQuestionBankActiveStats(courseId);
  const selectedChapterIds = getSelectedChapterIds(config);
  const bankStats = aggregateCourseBankStats(courseStats, selectedChapterIds);

  if (!bankStats?.hasBank) {
    return { ok: false, status: 400, message: 'Khóa học chưa có ngân hàng câu hỏi phù hợp.' };
  }

  const title = String(config?.title ?? '').trim();
  if (!title) {
    return { ok: false, status: 400, message: 'Vui lòng nhập tên bài kiểm tra.' };
  }

  const timeLimitMinutes = Number(config?.timeLimitMinutes ?? 0);
  if (!Number.isFinite(timeLimitMinutes) || timeLimitMinutes <= 0) {
    return { ok: false, status: 400, message: 'Thời gian làm bài phải lớn hơn 0.' };
  }

  const passingScore = Number(config?.passingScore ?? 0);
  if (!Number.isFinite(passingScore) || passingScore < 0 || passingScore > 100) {
    return { ok: false, status: 400, message: 'Điểm đạt phải từ 0 đến 100.' };
  }

  const maxAttempts = Number(config?.maxAttempts ?? 0);
  if (!Number.isFinite(maxAttempts) || maxAttempts < 1) {
    return { ok: false, status: 400, message: 'Số lần làm lại phải ít nhất 1.' };
  }

  if (config?.enabled && selectedChapterIds.length === 0) {
    return {
      ok: false,
      status: 400,
      message: 'Vui lòng chọn ít nhất một chương khi bật kiểm tra toàn khóa.',
    };
  }

  if (config?.enabled && !hasConfiguredQuizSources(config)) {
    return {
      ok: false,
      status: 400,
      message: 'Vui lòng cấu hình ít nhất 1 section hoặc câu hỏi khi bật kiểm tra.',
    };
  }

  let sectionRows = [];
  if (config?.enabled) {
    try {
      sectionRows = buildSectionRowsFromConfig(config, bankStats);
    } catch (error) {
      return { ok: false, status: 400, message: error.message };
    }

    if (sectionRows.length === 0) {
      return {
        ok: false,
        status: 400,
        message: 'Vui lòng cấu hình ít nhất 1 section hoặc câu hỏi khi bật kiểm tra.',
      };
    }
  }

  const prerequisiteTestIds = [];
  for (const requiredPathId of selectedChapterIds) {
    const prerequisiteTestId = await chapterQuizConfigModel.getTestIdByPathId(requiredPathId);
    if (prerequisiteTestId) {
      prerequisiteTestIds.push(prerequisiteTestId);
    }
  }

  return {
    ok: true,
    courseMeta,
    bankStats,
    sectionRows,
    selectedChapterIds,
    prerequisiteTestIds,
    testConfigRow: {
      DurationMinutes: timeLimitMinutes,
      MaxAttempts: maxAttempts,
    },
    passConfigRow: {
      MinPassScore: passingScore,
    },
    testRow: {
      TestName: title,
      TestOrder: 0,
      IsActive: Boolean(config?.enabled),
      HasPrerequisite: prerequisiteTestIds.length > 0,
    },
  };
}

async function validateSavePayload(courseId, pathId, config) {
  const pathMeta = await chapterQuizConfigModel.getPathMeta(courseId, pathId);
  if (!pathMeta) {
    return { ok: false, status: 404, message: 'Không tìm thấy chương.' };
  }

  const bankStats = await questionBankModel.getChapterQuestionBankActiveStats(courseId, pathId);
  if (!bankStats?.hasBank) {
    return { ok: false, status: 400, message: 'Chương chưa có ngân hàng câu hỏi.' };
  }

  const title = String(config?.title ?? '').trim();
  if (!title) {
    return { ok: false, status: 400, message: 'Vui lòng nhập tên bài kiểm tra.' };
  }

  const timeLimitMinutes = Number(config?.timeLimitMinutes ?? 0);
  if (!Number.isFinite(timeLimitMinutes) || timeLimitMinutes <= 0) {
    return { ok: false, status: 400, message: 'Thời gian làm bài phải lớn hơn 0.' };
  }

  const passingScore = Number(config?.passingScore ?? 0);
  if (!Number.isFinite(passingScore) || passingScore < 0 || passingScore > 100) {
    return { ok: false, status: 400, message: 'Điểm đạt phải từ 0 đến 100.' };
  }

  const maxAttempts = Number(config?.maxAttempts ?? 0);
  if (!Number.isFinite(maxAttempts) || maxAttempts < 1) {
    return { ok: false, status: 400, message: 'Số lần làm lại phải ít nhất 1.' };
  }

  if (config?.enabled && !hasConfiguredQuizSources(config)) {
    return {
      ok: false,
      status: 400,
      message: 'Vui lòng cấu hình ít nhất 1 section hoặc câu hỏi khi bật kiểm tra.',
    };
  }

  let sectionRows = [];
  if (config?.enabled) {
    try {
      sectionRows = buildSectionRowsFromConfig(config, bankStats);
    } catch (error) {
      return { ok: false, status: 400, message: error.message };
    }

    if (sectionRows.length === 0) {
      return {
        ok: false,
        status: 400,
        message: 'Vui lòng cấu hình ít nhất 1 section hoặc câu hỏi khi bật kiểm tra.',
      };
    }
  }

  const requiredChapterIds = getRequiredChapterIds(config);
  const prerequisiteTestIds = [];
  for (const requiredPathId of requiredChapterIds) {
    const prerequisiteTestId = await chapterQuizConfigModel.getTestIdByPathId(requiredPathId);
    if (!prerequisiteTestId) {
      return {
        ok: false,
        status: 400,
        message: `Chương tiên quyết (PathId=${requiredPathId}) chưa có bài kiểm tra.`,
      };
    }
    prerequisiteTestIds.push(prerequisiteTestId);
  }

  return {
    ok: true,
    pathMeta,
    bankStats,
    sectionRows,
    prerequisiteTestIds,
    testConfigRow: {
      DurationMinutes: timeLimitMinutes,
      MaxAttempts: maxAttempts,
    },
    passConfigRow: {
      MinPassScore: passingScore,
    },
    testRow: {
      TestName: title,
      TestOrder: Number(pathMeta.PathOrder ?? 0),
      IsActive: Boolean(config?.enabled),
      HasPrerequisite: prerequisiteTestIds.length > 0,
    },
  };
}

async function getChapterQuizConfig(courseId, pathId) {
  const pathMeta = await chapterQuizConfigModel.getPathMeta(courseId, pathId);
  if (!pathMeta) {
    return { ok: false, status: 404, message: 'Không tìm thấy chương.' };
  }

  const bundle = await chapterQuizConfigModel.getChapterQuizConfigBundle(courseId, pathId);
  const testConfig = mapTestConfigFromBundle(bundle);
  if (!bundle) {
    return {
      ok: true,
      config: null,
      testConfig,
      pathMeta,
    };
  }

  const bankStats = await questionBankModel.getChapterQuestionBankActiveStats(courseId, pathId);

  return {
    ok: true,
    config: mapBundleToClientConfig(bundle, bankStats),
    testConfig,
    pathMeta,
  };
}

async function saveChapterQuizConfig(courseId, pathId, config, updatedBy) {
  const validation = await validateSavePayload(courseId, pathId, config);
  if (!validation.ok) return validation;

  const transaction = new sql.Transaction();
  await transaction.begin();

  try {
    const existingTest = await chapterQuizConfigModel.getChapterTestByPathId(pathId, transaction);
    let testId = existingTest?.TestId ?? null;

    if (testId) {
      await chapterQuizConfigModel.updateTestRow(transaction, testId, validation.testRow);
    } else {
      testId = await chapterQuizConfigModel.getNextTestId(transaction);
      await chapterQuizConfigModel.insertTestRow(transaction, {
        TestId: testId,
        PathId: Number(pathId),
        CourseId: Number(courseId),
        InstructorId: Number(validation.pathMeta.InstructorId),
        IsCourseTest: false,
        ...validation.testRow,
      });
    }

    const configId = await chapterQuizConfigModel.upsertTestConfig(transaction, testId, {
      ...validation.testConfigRow,
      UpdatedBy: Number(updatedBy),
    });

    if (config?.enabled) {
      await chapterQuizConfigModel.replaceTestConfigSections(
        transaction,
        configId,
        validation.sectionRows,
      );
    } else {
      await chapterQuizConfigModel.replaceTestConfigSections(transaction, configId, []);
    }

    await chapterQuizConfigModel.upsertPassConfig(transaction, testId, {
      ...validation.passConfigRow,
      UpdatedBy: Number(updatedBy),
    });

    await chapterQuizConfigModel.replaceTestPrerequisites(
      transaction,
      testId,
      validation.prerequisiteTestIds,
    );

    await transaction.commit();

    const saved = await chapterQuizConfigModel.getChapterQuizConfigBundle(courseId, pathId);
    return {
      ok: true,
      config: mapBundleToClientConfig(saved, validation.bankStats),
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function getCourseQuizConfig(courseId) {
  const courseMeta = await chapterQuizConfigModel.getCourseMeta(courseId);
  if (!courseMeta) {
    return { ok: false, status: 404, message: 'Không tìm thấy khóa học.' };
  }

  const bundle = await chapterQuizConfigModel.getCourseQuizConfigBundle(courseId);
  const testConfig = mapTestConfigFromBundle(bundle);
  if (!bundle) {
    return {
      ok: true,
      config: null,
      testConfig,
      courseMeta,
    };
  }

  const courseStats = await questionBankModel.getCourseQuestionBankActiveStats(courseId);
  const bankStats = aggregateCourseBankStats(
    courseStats,
    bundle.selectedChapterIds ?? [],
  );

  return {
    ok: true,
    config: mapCourseBundleToClientConfig(bundle, bankStats),
    testConfig,
    courseMeta,
  };
}

async function saveCourseQuizConfig(courseId, config, updatedBy) {
  const validation = await validateCourseSavePayload(courseId, config);
  if (!validation.ok) return validation;

  const transaction = new sql.Transaction();
  await transaction.begin();

  try {
    const existingTest = await chapterQuizConfigModel.getCourseTestByCourseId(courseId, transaction);
    let testId = existingTest?.TestId ?? null;

    if (testId) {
      await chapterQuizConfigModel.updateTestRow(transaction, testId, validation.testRow);
    } else {
      testId = await chapterQuizConfigModel.getNextTestId(transaction);
      await chapterQuizConfigModel.insertTestRow(transaction, {
        TestId: testId,
        PathId: null,
        CourseId: Number(courseId),
        InstructorId: Number(validation.courseMeta.InstructorId),
        IsCourseTest: true,
        ...validation.testRow,
      });
    }

    const configId = await chapterQuizConfigModel.upsertTestConfig(transaction, testId, {
      ...validation.testConfigRow,
      UpdatedBy: Number(updatedBy),
    });

    if (config?.enabled) {
      await chapterQuizConfigModel.replaceTestConfigSections(
        transaction,
        configId,
        validation.sectionRows,
      );
    } else {
      await chapterQuizConfigModel.replaceTestConfigSections(transaction, configId, []);
    }

    await chapterQuizConfigModel.replaceTestCourseChapters(
      transaction,
      testId,
      validation.selectedChapterIds,
    );

    await chapterQuizConfigModel.upsertPassConfig(transaction, testId, {
      ...validation.passConfigRow,
      UpdatedBy: Number(updatedBy),
    });

    await chapterQuizConfigModel.replaceTestPrerequisites(
      transaction,
      testId,
      validation.prerequisiteTestIds ?? [],
    );

    await transaction.commit();

    const saved = await chapterQuizConfigModel.getCourseQuizConfigBundle(courseId);
    return {
      ok: true,
      config: mapCourseBundleToClientConfig(saved, validation.bankStats),
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function listChapterQuizConfigsByCourse(courseId) {
  const { sql } = require('../config/db');
  const request = new sql.Request();
  request.input('courseId', sql.Int, Number(courseId));
  const result = await request.query(`
    SELECT t.TestId, t.PathId
    FROM dbo.Tests t
    WHERE t.CourseId = @courseId
      AND ISNULL(t.IsCourseTest, 0) = 0
      AND t.PathId IS NOT NULL
    ORDER BY t.TestOrder, t.PathId
  `);

  const configs = [];
  for (const row of result.recordset) {
    const bundle = await chapterQuizConfigModel.getChapterQuizConfigBundle(
      courseId,
      row.PathId,
    );
    if (bundle) {
      const bankStats = await questionBankModel.getChapterQuestionBankActiveStats(
        courseId,
        row.PathId,
      );
      configs.push(mapBundleToClientConfig(bundle, bankStats));
    }
  }
  return { ok: true, configs };
}

module.exports = {
  getChapterQuizConfig,
  saveChapterQuizConfig,
  getCourseQuizConfig,
  saveCourseQuizConfig,
  listChapterQuizConfigsByCourse,
  mapBundleToClientConfig,
  mapCourseBundleToClientConfig,
  buildSectionRowsFromConfig,
  aggregateCourseBankStats,
};
