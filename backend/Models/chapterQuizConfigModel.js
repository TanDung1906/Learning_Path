const { sql } = require('../config/db');

async function getPathMeta(courseId, pathId, transaction = null) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  request.input('courseId', sql.Int, Number(courseId));
  request.input('pathId', sql.Int, Number(pathId));
  const result = await request.query(`
    SELECT TOP 1
      p.PathId,
      p.PathName,
      p.[Order] AS PathOrder,
      p.CourseId,
      c.InstructorId
    FROM dbo.Paths p
    INNER JOIN dbo.Courses c ON c.CourseId = p.CourseId
    WHERE p.PathId = @pathId
      AND p.CourseId = @courseId
  `);
  return result.recordset[0] ?? null;
}

async function getChapterTestByPathId(pathId, transaction = null) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  request.input('pathId', sql.Int, Number(pathId));
  const result = await request.query(`
    SELECT TOP 1
      t.TestId,
      t.PathId,
      t.CourseId,
      t.InstructorId,
      t.IsCourseTest,
      t.TestName,
      t.TestOrder,
      t.IsActive,
      t.HasPrerequisite
    FROM dbo.Tests t
    WHERE t.PathId = @pathId
      AND ISNULL(t.IsCourseTest, 0) = 0
  `);
  return result.recordset[0] ?? null;
}

async function getTestIdByPathId(pathId, transaction = null) {
  const row = await getChapterTestByPathId(pathId, transaction);
  return row?.TestId ?? null;
}

async function getNextTestId(transaction) {
  const request = new sql.Request(transaction);
  const result = await request.query(`
    SELECT ISNULL(MAX(TestId), 0) + 1 AS NextTestId
    FROM dbo.Tests WITH (UPDLOCK, HOLDLOCK)
  `);
  return Number(result.recordset[0]?.NextTestId ?? 1);
}

async function getNextPassConfigId(transaction) {
  const request = new sql.Request(transaction);
  const result = await request.query(`
    SELECT ISNULL(MAX(Test_Pass_Config_Id), 0) + 1 AS NextId
    FROM dbo.Test_Pass_Config WITH (UPDLOCK, HOLDLOCK)
  `);
  return Number(result.recordset[0]?.NextId ?? 1);
}

async function insertTestRow(transaction, row) {
  const request = new sql.Request(transaction);
  request.input('testId', sql.Int, row.TestId);
  request.input('pathId', sql.Int, row.PathId ?? null);
  request.input('courseId', sql.Int, row.CourseId);
  request.input('instructorId', sql.Int, row.InstructorId);
  request.input('isCourseTest', sql.Bit, row.IsCourseTest ? 1 : 0);
  request.input('testName', sql.NVarChar(200), row.TestName);
  request.input('testOrder', sql.Int, row.TestOrder);
  request.input('isActive', sql.Bit, row.IsActive ? 1 : 0);
  request.input('hasPrerequisite', sql.Bit, row.HasPrerequisite ? 1 : 0);
  await request.query(`
    INSERT INTO dbo.Tests (
      TestId, PathId, CourseId, InstructorId, IsCourseTest,
      TestName, TestOrder, IsActive, HasPrerequisite
    )
    VALUES (
      @testId, @pathId, @courseId, @instructorId, @isCourseTest,
      @testName, @testOrder, @isActive, @hasPrerequisite
    )
  `);
  return row.TestId;
}

async function updateTestRow(transaction, testId, row) {
  const request = new sql.Request(transaction);
  request.input('testId', sql.Int, testId);
  request.input('testName', sql.NVarChar(200), row.TestName);
  request.input('testOrder', sql.Int, row.TestOrder);
  request.input('isActive', sql.Bit, row.IsActive ? 1 : 0);
  request.input('hasPrerequisite', sql.Bit, row.HasPrerequisite ? 1 : 0);
  await request.query(`
    UPDATE dbo.Tests
    SET TestName = @testName,
        TestOrder = @testOrder,
        IsActive = @isActive,
        HasPrerequisite = @hasPrerequisite
    WHERE TestId = @testId
  `);
}

async function getTestConfigByTestId(testId, transaction = null) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  request.input('testId', sql.Int, Number(testId));
  const result = await request.query(`
    SELECT TOP 1 *
    FROM dbo.Test_Config
    WHERE TestId = @testId
  `);
  return result.recordset[0] ?? null;
}

async function upsertTestConfig(transaction, testId, row) {
  const existing = await getTestConfigByTestId(testId, transaction);
  const request = new sql.Request(transaction);
  request.input('testId', sql.Int, testId);
  request.input('durationMinutes', sql.Int, row.DurationMinutes);
  request.input('maxAttempts', sql.Int, row.MaxAttempts);
  request.input('updatedBy', sql.Int, row.UpdatedBy);

  if (existing) {
    await request.query(`
      UPDATE dbo.Test_Config
      SET DurationMinutes = @durationMinutes,
          MaxAttempts = @maxAttempts,
          UpdatedBy = @updatedBy,
          UpdatedAt = GETDATE()
      WHERE TestId = @testId
    `);
    return existing.ConfigId;
  }

  const insertResult = await request.query(`
    INSERT INTO dbo.Test_Config (
      TestId, DurationMinutes, MaxAttempts, UpdatedBy, UpdatedAt
    )
    OUTPUT INSERTED.ConfigId
    VALUES (
      @testId, @durationMinutes, @maxAttempts, @updatedBy, GETDATE()
    )
  `);
  return insertResult.recordset[0].ConfigId;
}

async function replaceTestConfigSections(transaction, configId, rows = []) {
  const request = new sql.Request(transaction);
  request.input('configId', sql.Int, Number(configId));
  await request.query(`
    DELETE FROM dbo.Test_Config_Section
    WHERE ConfigId = @configId
  `);

  for (const row of rows) {
    const insertRequest = new sql.Request(transaction);
    insertRequest.input('configId', sql.Int, Number(configId));
    insertRequest.input('typeId', sql.Int, Number(row.TypeId));
    insertRequest.input('questionQuantity', sql.Int, row.QuestionQuantity ?? null);
    insertRequest.input('bankSectionId', sql.Int, row.BankSectionId ?? null);
    insertRequest.input('pathId', sql.Int, row.PathId ?? null);
    await insertRequest.query(`
      INSERT INTO dbo.Test_Config_Section (
        ConfigId, TypeId, QuestionQuantity, BankSectionId, PathId
      )
      VALUES (
        @configId, @typeId, @questionQuantity, @bankSectionId, @pathId
      )
    `);
  }
}

async function getTestConfigSections(configId, transaction = null) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  request.input('configId', sql.Int, Number(configId));
  const result = await request.query(`
    SELECT
      cs.ConfigSectionId,
      cs.ConfigId,
      cs.TypeId,
      cs.QuestionQuantity,
      cs.BankSectionId,
      cs.PathId
    FROM dbo.Test_Config_Section cs
    WHERE cs.ConfigId = @configId
    ORDER BY cs.TypeId, cs.BankSectionId, cs.ConfigSectionId
  `);
  return result.recordset;
}

async function getPassConfigByTestId(testId, transaction = null) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  request.input('testId', sql.Int, Number(testId));
  const result = await request.query(`
    SELECT TOP 1 *
    FROM dbo.Test_Pass_Config
    WHERE TestId = @testId
  `);
  return result.recordset[0] ?? null;
}

async function upsertPassConfig(transaction, testId, row) {
  const existing = await getPassConfigByTestId(testId, transaction);
  const request = new sql.Request(transaction);

  if (existing) {
    request.input('testId', sql.Int, testId);
    request.input('minPassScore', sql.Decimal(5, 2), row.MinPassScore);
    request.input('updatedBy', sql.Int, row.UpdatedBy);
    await request.query(`
      UPDATE dbo.Test_Pass_Config
      SET MinPassScore = @minPassScore,
          UpdatedBy = @updatedBy,
          UpdatedAt = GETDATE()
      WHERE TestId = @testId
    `);
    return existing.Test_Pass_Config_Id;
  }

  const passConfigId = await getNextPassConfigId(transaction);
  request.input('passConfigId', sql.Int, passConfigId);
  request.input('testId', sql.Int, testId);
  request.input('minPassScore', sql.Decimal(5, 2), row.MinPassScore);
  request.input('updatedBy', sql.Int, row.UpdatedBy);
  await request.query(`
    INSERT INTO dbo.Test_Pass_Config (
      Test_Pass_Config_Id, TestId, MinPassScore, AllowReviewAfterPass, UpdatedBy, UpdatedAt
    )
    VALUES (@passConfigId, @testId, @minPassScore, 0, @updatedBy, GETDATE())
  `);
  return passConfigId;
}

async function replaceTestPrerequisites(transaction, testId, prerequisiteTestIds = []) {
  const request = new sql.Request(transaction);
  request.input('testId', sql.Int, Number(testId));
  await request.query(`
    DELETE FROM dbo.Test_Prerequisites
    WHERE TestId = @testId
  `);

  for (const prerequisiteTestId of prerequisiteTestIds) {
    const insertRequest = new sql.Request(transaction);
    insertRequest.input('testId', sql.Int, Number(testId));
    insertRequest.input('prerequisiteTestId', sql.Int, Number(prerequisiteTestId));
    await insertRequest.query(`
      INSERT INTO dbo.Test_Prerequisites (TestId, PrerequisiteTestId)
      VALUES (@testId, @prerequisiteTestId)
    `);
  }
}

async function getPrerequisitePathIds(testId, transaction = null) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  request.input('testId', sql.Int, Number(testId));
  const result = await request.query(`
    SELECT pre.PathId
    FROM dbo.Test_Prerequisites tp
    INNER JOIN dbo.Tests pre ON pre.TestId = tp.PrerequisiteTestId
    WHERE tp.TestId = @testId
      AND pre.PathId IS NOT NULL
    ORDER BY pre.TestOrder, pre.PathId
  `);
  return result.recordset.map((row) => String(row.PathId));
}

async function getCourseMeta(courseId, transaction = null) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  request.input('courseId', sql.Int, Number(courseId));
  const result = await request.query(`
    SELECT TOP 1
      c.CourseId,
      c.CourseName,
      c.InstructorId
    FROM dbo.Courses c
    WHERE c.CourseId = @courseId
  `);
  return result.recordset[0] ?? null;
}

async function getCourseTestByCourseId(courseId, transaction = null) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  request.input('courseId', sql.Int, Number(courseId));
  const result = await request.query(`
    SELECT TOP 1
      t.TestId,
      t.PathId,
      t.CourseId,
      t.InstructorId,
      t.IsCourseTest,
      t.TestName,
      t.TestOrder,
      t.IsActive,
      t.HasPrerequisite
    FROM dbo.Tests t
    WHERE t.CourseId = @courseId
      AND ISNULL(t.IsCourseTest, 0) = 1
  `);
  return result.recordset[0] ?? null;
}

async function getCourseChapterIds(testId, transaction = null) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  request.input('testId', sql.Int, Number(testId));
  const result = await request.query(`
    SELECT PathId
    FROM dbo.Test_Course_Chapters
    WHERE TestId = @testId
    ORDER BY PathId
  `);
  return result.recordset.map((row) => String(row.PathId));
}

async function replaceTestCourseChapters(transaction, testId, pathIds = []) {
  const request = new sql.Request(transaction);
  request.input('testId', sql.Int, Number(testId));
  await request.query(`
    DELETE FROM dbo.Test_Course_Chapters
    WHERE TestId = @testId
  `);

  for (const pathId of pathIds) {
    const insertRequest = new sql.Request(transaction);
    insertRequest.input('testId', sql.Int, Number(testId));
    insertRequest.input('pathId', sql.Int, Number(pathId));
    await insertRequest.query(`
      INSERT INTO dbo.Test_Course_Chapters (TestId, PathId)
      VALUES (@testId, @pathId)
    `);
  }
}

async function getCourseQuizConfigBundle(courseId) {
  const test = await getCourseTestByCourseId(courseId);
  if (!test) return null;

  const config = await getTestConfigByTestId(test.TestId);
  const passConfig = await getPassConfigByTestId(test.TestId);
  const configSections = config
    ? await getTestConfigSections(config.ConfigId)
    : [];
  const selectedChapterIds = await getCourseChapterIds(test.TestId);
  const requiredChapterIds = await getPrerequisitePathIds(test.TestId);

  return {
    test,
    config,
    passConfig,
    configSections,
    selectedChapterIds,
    requiredChapterIds,
    courseId: Number(courseId),
    pathId: null,
  };
}

async function getChapterQuizConfigBundle(courseId, pathId) {
  const test = await getChapterTestByPathId(pathId);
  if (!test) return null;

  const config = await getTestConfigByTestId(test.TestId);
  const passConfig = await getPassConfigByTestId(test.TestId);
  const configSections = config
    ? await getTestConfigSections(config.ConfigId)
    : [];
  const requiredChapterIds = await getPrerequisitePathIds(test.TestId);

  return {
    test,
    config,
    passConfig,
    configSections,
    requiredChapterIds,
    courseId: Number(courseId),
    pathId: Number(pathId),
  };
}

module.exports = {
  getPathMeta,
  getCourseMeta,
  getChapterTestByPathId,
  getCourseTestByCourseId,
  getTestIdByPathId,
  getNextTestId,
  insertTestRow,
  updateTestRow,
  getTestConfigByTestId,
  upsertTestConfig,
  replaceTestConfigSections,
  getTestConfigSections,
  getPassConfigByTestId,
  upsertPassConfig,
  replaceTestPrerequisites,
  replaceTestCourseChapters,
  getCourseChapterIds,
  getPrerequisitePathIds,
  getChapterQuizConfigBundle,
  getCourseQuizConfigBundle,
};
