const { sql } = require('../config/db');

function createRequest(transaction = null) {
  return transaction ? new sql.Request(transaction) : new sql.Request();
}

async function findQuestionPathId(courseId, pathId, transaction = null) {
  const request = createRequest(transaction);
  request.input('courseId', sql.Int, Number(courseId));
  request.input('pathId', sql.Int, Number(pathId));
  const result = await request.query(`
    SELECT TOP 1 qp.Question_Path_Id AS QuestionPathId
    FROM dbo.Questions_Path qp
    INNER JOIN dbo.Question_Bank qb ON qb.BankId = qp.BankId
    WHERE qb.CourseId = @courseId
      AND qp.PathId = @pathId
    ORDER BY qp.Question_Path_Id
  `);
  return result.recordset[0]?.QuestionPathId ?? null;
}

async function pathBelongsToCourse(pathId, courseId, transaction = null) {
  const request = createRequest(transaction);
  request.input('pathId', sql.Int, Number(pathId));
  request.input('courseId', sql.Int, Number(courseId));
  const result = await request.query(`
    SELECT TOP 1 PathId
    FROM dbo.Paths
    WHERE PathId = @pathId AND CourseId = @courseId
  `);
  return result.recordset.length > 0;
}

async function findQuestionBankIdByCourseId(courseId, transaction = null) {
  const request = createRequest(transaction);
  request.input('courseId', sql.Int, Number(courseId));
  const result = await request.query(`
    SELECT TOP 1 BankId
    FROM dbo.Question_Bank
    WHERE CourseId = @courseId
    ORDER BY BankId
  `);
  return result.recordset[0]?.BankId ?? null;
}

async function createQuestionBankForCourse(courseId, transaction = null) {
  const request = createRequest(transaction);
  request.input('courseId', sql.Int, Number(courseId));
  const result = await request.query(`
    INSERT INTO dbo.Question_Bank (
      InstructorId, CourseId, CourseName, CourseDescription, BankDescription, CreatedAt, UpdatedAt, IsPublished
    )
    OUTPUT INSERTED.BankId
    SELECT
      c.InstructorId,
      c.CourseId,
      c.CourseName,
      c.Description,
      NULL,
      GETDATE(),
      GETDATE(),
      c.IsPublished
    FROM dbo.Courses c
    WHERE c.CourseId = @courseId
  `);

  const bankId = result.recordset[0]?.BankId ?? null;
  if (!bankId) {
    const error = new Error('Không tìm thấy khóa học để tạo question bank.');
    error.statusCode = 404;
    throw error;
  }
  return bankId;
}

async function createQuestionPath(bankId, pathId, transaction = null) {
  const request = createRequest(transaction);
  request.input('bankId', sql.Int, Number(bankId));
  request.input('pathId', sql.Int, Number(pathId));
  const result = await request.query(`
    INSERT INTO dbo.Questions_Path (BankId, PathId)
    OUTPUT INSERTED.Question_Path_Id AS QuestionPathId
    VALUES (@bankId, @pathId)
  `);
  return result.recordset[0]?.QuestionPathId ?? null;
}

async function ensureQuestionPathForCourseChapter(courseId, pathId) {
  const parsedCourseId = Number(courseId);
  const parsedPathId = Number(pathId);

  if (!Number.isInteger(parsedCourseId) || parsedCourseId <= 0) {
    const error = new Error('courseId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }
  if (!Number.isInteger(parsedPathId) || parsedPathId <= 0) {
    const error = new Error('pathId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }

  const belongs = await pathBelongsToCourse(parsedPathId, parsedCourseId);
  if (!belongs) {
    const error = new Error('Chương không thuộc khóa học này.');
    error.statusCode = 404;
    throw error;
  }

  const existing = await findQuestionPathId(parsedCourseId, parsedPathId);
  if (existing) return existing;

  const transaction = new sql.Transaction();
  await transaction.begin();

  try {
    const existingInTx = await findQuestionPathId(parsedCourseId, parsedPathId, transaction);
    if (existingInTx) {
      await transaction.commit();
      return existingInTx;
    }

    let bankId = await findQuestionBankIdByCourseId(parsedCourseId, transaction);
    if (!bankId) {
      bankId = await createQuestionBankForCourse(parsedCourseId, transaction);
    }

    const questionPathId = await createQuestionPath(bankId, parsedPathId, transaction);
    if (!questionPathId) {
      const error = new Error('Không thể tạo Questions_Path cho chương này.');
      error.statusCode = 500;
      throw error;
    }

    await transaction.commit();
    return questionPathId;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

const resolveQuestionPathId = async ({ courseId, pathId, questionPathId = null }) => {
  if (questionPathId) {
    const request = new sql.Request();
    request.input('questionPathId', sql.Int, Number(questionPathId));
    request.input('courseId', sql.Int, Number(courseId));
    request.input('pathId', sql.Int, Number(pathId));
    const result = await request.query(`
      SELECT TOP 1 qp.Question_Path_Id AS QuestionPathId
      FROM dbo.Questions_Path qp
      INNER JOIN dbo.Question_Bank qb ON qb.BankId = qp.BankId
      WHERE qp.Question_Path_Id = @questionPathId
        AND qb.CourseId = @courseId
        AND qp.PathId = @pathId
    `);
    if (result.recordset[0]?.QuestionPathId) {
      return result.recordset[0].QuestionPathId;
    }
    const error = new Error('questionPathId không thuộc course/path này.');
    error.statusCode = 400;
    throw error;
  }

  const resolved = await findQuestionPathId(courseId, pathId);
  if (!resolved) {
    const error = new Error('Chưa có Questions_Path cho chương này.');
    error.statusCode = 404;
    throw error;
  }
  return resolved;
};

const questionBelongsToSection = async (questionId, sectionId, transaction = null) => {
  const request = createRequest(transaction);
  request.input('questionId', sql.Int, Number(questionId));
  request.input('sectionId', sql.Int, Number(sectionId));
  const result = await request.query(`
    SELECT TOP 1 QuestionId
    FROM dbo.Questions
    WHERE QuestionId = @questionId AND SectionId = @sectionId
  `);
  return result.recordset.length > 0;
};

const choiceBelongsToQuestion = async (choiceId, questionId, transaction = null) => {
  const request = createRequest(transaction);
  request.input('choiceId', sql.Int, Number(choiceId));
  request.input('questionId', sql.Int, Number(questionId));
  const result = await request.query(`
    SELECT TOP 1 ChoiceId
    FROM dbo.Question_Choices
    WHERE ChoiceId = @choiceId AND QuestionId = @questionId
  `);
  return result.recordset.length > 0;
};

async function getNextSectionOrder(questionPathId, typeId, transaction = null) {
  const request = createRequest(transaction);
  request.input('questionPathId', sql.Int, Number(questionPathId));
  request.input('typeId', sql.Int, Number(typeId));
  const result = await request.query(`
    SELECT ISNULL(MAX([Order]), 0) + 1 AS NextOrder
    FROM dbo.Question_Sections WITH (UPDLOCK, HOLDLOCK)
    WHERE Question_Path_Id = @questionPathId
      AND TypeId = @typeId
  `);
  return Number(result.recordset[0]?.NextOrder) || 1;
}

module.exports = {
  resolveQuestionPathId,
  ensureQuestionPathForCourseChapter,
  findQuestionPathId,
  questionBelongsToSection,
  choiceBelongsToQuestion,
  getNextSectionOrder,
};
