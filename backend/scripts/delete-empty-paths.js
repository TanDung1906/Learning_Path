/**
 * Delete empty course content:
 * 1) Path_Nodes (lessons) with no Node_Materials
 * 2) Paths (chapters) with no Path_Nodes
 *
 * Usage: node scripts/delete-empty-paths.js [--dry-run]
 */
require('dotenv').config({ override: true });
const { sql, connectDB } = require('../config/db');

const dryRun = process.argv.includes('--dry-run');

async function listEmptyNodes(transaction) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  const result = await request.query(`
    SELECT
      pn.NodeId,
      pn.PathId,
      pn.NodeName,
      pn.NodeOrder,
      p.CourseId,
      p.PathName
    FROM dbo.Path_Nodes pn
    INNER JOIN dbo.Paths p ON p.PathId = pn.PathId
    WHERE NOT EXISTS (
      SELECT 1
      FROM dbo.Node_Materials nm
      WHERE nm.NodeId = pn.NodeId
        AND nm.MaterialType IN ('VIDEO', 'TEXT', 'DOC')
    )
    ORDER BY p.CourseId, p.[Order], pn.NodeOrder, pn.NodeId
  `);
  return result.recordset;
}

async function deleteNodeRow(nodeId, transaction) {
  const request = new sql.Request(transaction);
  request.input('nodeId', sql.Int, nodeId);
  await request.query(`
    DELETE FROM dbo.User_Nodes WHERE NodeId = @nodeId;
    DELETE FROM dbo.Node_Materials WHERE NodeId = @nodeId;
    DELETE FROM dbo.Path_Nodes WHERE NodeId = @nodeId;
  `);
}

async function listEmptyPaths(transaction) {
  const request = transaction ? new sql.Request(transaction) : new sql.Request();
  const result = await request.query(`
    SELECT
      p.PathId,
      p.CourseId,
      p.PathName,
      p.[Order]
    FROM dbo.Paths p
    WHERE NOT EXISTS (
      SELECT 1 FROM dbo.Path_Nodes pn WHERE pn.PathId = p.PathId
    )
    ORDER BY p.CourseId, p.[Order], p.PathId
  `);
  return result.recordset;
}

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
  await request.query(`DELETE FROM dbo.Paths WHERE PathId = @pathId`);
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

  const emptyNodes = await listEmptyNodes();
  const emptyPaths = await listEmptyPaths();

  if (emptyNodes.length === 0 && emptyPaths.length === 0) {
    console.log('Không có bài học/chương trống nào cần xóa.');
    await sql.close();
    return;
  }

  if (emptyNodes.length > 0) {
    console.log(`Tìm thấy ${emptyNodes.length} bài học không có học liệu (VIDEO/TEXT/DOC):`);
    emptyNodes.forEach((row) => {
      console.log(
        `  - NodeId=${row.NodeId}, PathId=${row.PathId}, CourseId=${row.CourseId}, "${row.NodeName}" (chương "${row.PathName}")`,
      );
    });
  } else {
    console.log('Không có bài học nào không có học liệu.');
  }

  if (emptyPaths.length > 0) {
    console.log(`Tìm thấy ${emptyPaths.length} chương không có bài học:`);
    emptyPaths.forEach((row) => {
      console.log(`  - PathId=${row.PathId}, CourseId=${row.CourseId}, "${row.PathName}"`);
    });
  } else {
    console.log('Không có chương nào không có bài học.');
  }

  if (dryRun) {
    console.log('\nDry run — không xóa gì.');
    await sql.close();
    return;
  }

  const transaction = new sql.Transaction();
  await transaction.begin();
  try {
    const affectedCourses = new Set();

    for (const row of emptyNodes) {
      await deleteNodeRow(row.NodeId, transaction);
      affectedCourses.add(row.CourseId);
    }

    // Sau khi xóa bài học trống, kiểm tra lại chương trống trong cùng transaction.
    const pathsAfterNodeCleanup = await listEmptyPaths(transaction);
    for (const row of pathsAfterNodeCleanup) {
      await deleteTestDataForPath(row.PathId, transaction);
      await deleteQuestionBankForPath(row.PathId, transaction);
      await deletePathRow(row.PathId, transaction);
      affectedCourses.add(row.CourseId);
    }

    for (const courseId of affectedCourses) {
      await recalculateCourseTotalLessons(courseId, transaction);
    }

    await transaction.commit();
    console.log(`\nĐã xóa ${emptyNodes.length} bài học và ${pathsAfterNodeCleanup.length} chương.`);
  } catch (error) {
    await transaction.rollback();
    throw error;
  } finally {
    await sql.close();
  }
}

main().catch((error) => {
  console.error('Lỗi:', error.message);
  process.exit(1);
});
