/**
 * Delete PathId=11 and related test + question bank data.
 * Usage: node scripts/delete-path-11.js
 */
require('dotenv').config({ override: true });
const { sql, connectDB } = require('../config/db');

const PATH_ID = 11;
const COURSE_ID = 1;

async function deleteTestDataForPath(pathId, transaction) {
  const request = new sql.Request(transaction);
  request.input('pathId', sql.Int, pathId);

  await request.query(`
    DECLARE @TestIds TABLE (TestId INT PRIMARY KEY);
    INSERT INTO @TestIds (TestId)
    SELECT TestId FROM dbo.Tests WHERE PathId = @pathId;

    DELETE taa
    FROM dbo.Test_Attempt_Answers taa
    INNER JOIN dbo.Test_Attempts ta ON ta.AttemptId = taa.AttemptId
    INNER JOIN @TestIds t ON t.TestId = ta.TestId;

    DELETE ta
    FROM dbo.Test_Attempts ta
    INNER JOIN @TestIds t ON t.TestId = ta.TestId;

    DELETE tqc
    FROM dbo.Test_Question_Choices tqc
    INNER JOIN dbo.Test_Questions tq ON tq.QuestionId = tqc.QuestionId
    INNER JOIN dbo.Test_Questions_Sections tqs ON tqs.SectionId = tq.SectionId
    INNER JOIN @TestIds t ON t.TestId = tqs.TestId;

    DELETE tq
    FROM dbo.Test_Questions tq
    INNER JOIN dbo.Test_Questions_Sections tqs ON tqs.SectionId = tq.SectionId
    INNER JOIN @TestIds t ON t.TestId = tqs.TestId;

    DELETE tqs
    FROM dbo.Test_Questions_Sections tqs
    INNER JOIN @TestIds t ON t.TestId = tqs.TestId;

    DELETE tcs
    FROM dbo.Test_Config_Section tcs
    INNER JOIN dbo.Test_Config tc ON tc.ConfigId = tcs.ConfigId
    INNER JOIN @TestIds t ON t.TestId = tc.TestId;

    DELETE tc
    FROM dbo.Test_Config tc
    INNER JOIN @TestIds t ON t.TestId = tc.TestId;

    DELETE tpc
    FROM dbo.Test_Pass_Config tpc
    INNER JOIN @TestIds t ON t.TestId = tpc.TestId;

    DELETE tp
    FROM dbo.Test_Prerequisites tp
    WHERE tp.TestId IN (SELECT TestId FROM @TestIds)
       OR tp.PrerequisiteTestId IN (SELECT TestId FROM @TestIds);

    DELETE FROM dbo.Tests WHERE PathId = @pathId;
  `);
}

async function deleteQuestionBankForPath(pathId, transaction) {
  const request = new sql.Request(transaction);
  request.input('pathId', sql.Int, pathId);

  await request.query(`
    DECLARE @QuestionPathIds TABLE (QuestionPathId INT PRIMARY KEY);
    INSERT INTO @QuestionPathIds (QuestionPathId)
    SELECT Question_Path_Id FROM dbo.Questions_Path WHERE PathId = @pathId;

    DELETE qc
    FROM dbo.Question_Choices qc
    INNER JOIN dbo.Questions q ON q.QuestionId = qc.QuestionId
    INNER JOIN dbo.Question_Sections qs ON qs.SectionId = q.SectionId
    INNER JOIN @QuestionPathIds qp ON qp.QuestionPathId = qs.Question_Path_Id;

    DELETE q
    FROM dbo.Questions q
    INNER JOIN dbo.Question_Sections qs ON qs.SectionId = q.SectionId
    INNER JOIN @QuestionPathIds qp ON qp.QuestionPathId = qs.Question_Path_Id;

    DELETE qs
    FROM dbo.Question_Sections qs
    INNER JOIN @QuestionPathIds qp ON qp.QuestionPathId = qs.Question_Path_Id;

    DELETE FROM dbo.Questions_Path WHERE PathId = @pathId;
  `);
}

async function deletePathRow(pathId, transaction) {
  const request = new sql.Request(transaction);
  request.input('pathId', sql.Int, pathId);
  await request.query(`
    DELETE un
    FROM dbo.User_Nodes un
    INNER JOIN dbo.Path_Nodes pn ON pn.NodeId = un.NodeId
    WHERE pn.PathId = @pathId;

    DELETE nm
    FROM dbo.Node_Materials nm
    INNER JOIN dbo.Path_Nodes pn ON pn.NodeId = nm.NodeId
    WHERE pn.PathId = @pathId;

    DELETE FROM dbo.Path_Nodes WHERE PathId = @pathId;
    DELETE FROM dbo.Paths WHERE PathId = @pathId;
  `);
}

async function recalculateCourseTotalLessons(courseId, transaction) {
  const request = new sql.Request(transaction);
  request.input('courseId', sql.Int, courseId);
  await request.query(`
    UPDATE c
    SET TotalLessons = (
      SELECT COUNT(*)
      FROM dbo.Path_Nodes pn
      INNER JOIN dbo.Paths p ON p.PathId = pn.PathId
      WHERE p.CourseId = @courseId
    )
    FROM dbo.Courses c
    WHERE c.CourseId = @courseId
  `);
}

async function main() {
  await connectDB();

  const check = await sql.query(`
    SELECT PathId, PathName, CourseId FROM dbo.Paths WHERE PathId = ${PATH_ID}
  `);
  if (check.recordset.length === 0) {
    console.log(`PathId=${PATH_ID} không tồn tại.`);
    await sql.close();
    return;
  }

  console.log(`Đang xóa PathId=${PATH_ID}:`, check.recordset[0]);

  const transaction = new sql.Transaction();
  await transaction.begin();
  try {
    await deleteTestDataForPath(PATH_ID, transaction);
    await deleteQuestionBankForPath(PATH_ID, transaction);
    await deletePathRow(PATH_ID, transaction);
    await recalculateCourseTotalLessons(COURSE_ID, transaction);
    await transaction.commit();
    console.log(`✅ Đã xóa PathId=${PATH_ID} và toàn bộ dữ liệu liên quan.`);
  } catch (error) {
    await transaction.rollback();
    throw error;
  } finally {
    await sql.close();
  }
}

main().catch((error) => {
  console.error('❌', error.message);
  process.exit(1);
});
