-- Add Tests.HasPrerequisite (BIT)
--
--   0 = bài test không yêu cầu điều kiện tiên quyết
--   1 = bài test có điều kiện tiên quyết (phải hoàn thành trước khi được phép làm)
--
-- Chi tiết chương tiên quyết lưu ở dbo.Test_Prerequisites (join để check khi HasPrerequisite = 1).
-- UI hiện tại: requiredChapterIds.length > 0 -> HasPrerequisite = 1
--
-- Idempotent — safe to re-run.

USE [LearningPath_Base];
GO

IF OBJECT_ID(N'dbo.vw_Test_Config_Summary', N'V') IS NOT NULL
    DROP VIEW dbo.vw_Test_Config_Summary;
GO

IF COL_LENGTH('dbo.Tests', 'HasPrerequisite') IS NULL
BEGIN
    ALTER TABLE dbo.Tests
    ADD HasPrerequisite BIT NOT NULL
        CONSTRAINT DF_Tests_HasPrerequisite DEFAULT (0);
END
GO

-- Backfill from prerequisite link table when present.
IF OBJECT_ID(N'dbo.Test_Prerequisites', N'U') IS NOT NULL
BEGIN
    UPDATE t
    SET t.HasPrerequisite = 1
    FROM dbo.Tests t
    WHERE EXISTS (
        SELECT 1
        FROM dbo.Test_Prerequisites tp
        WHERE tp.TestId = t.TestId
    );
END
GO

CREATE VIEW dbo.vw_Test_Config_Summary
AS
SELECT
    t.[TestId],
    t.[TestName],
    t.[CourseId],
    t.[PathId],
    t.[TestOrder],
    t.[IsCourseTest],
    t.[HasPrerequisite],
    (SELECT COUNT(*) FROM dbo.Test_Prerequisites tp WHERE tp.[TestId] = t.[TestId]) AS [PrerequisiteCount],
    pc.[MinPassScore],
    tc.[ConfigId],
    tc.[IsRandomSection],
    tc.[RandomSectionCount],
    tc.[DurationMinutes],
    tc.[MaxAttempts],
    (SELECT COUNT(*) FROM dbo.Test_Questions_Sections tqs WHERE tqs.[TestId] = t.[TestId]) AS [MaterializedSectionCount],
    (SELECT COUNT(*) FROM dbo.Test_Questions tq
        INNER JOIN dbo.Test_Questions_Sections tqs ON tqs.[SectionId] = tq.[SectionId]
        WHERE tqs.[TestId] = t.[TestId]) AS [MaterializedQuestionCount],
    (SELECT SUM(cs.[QuestionQuantity]) FROM dbo.Test_Config_Section cs WHERE cs.[ConfigId] = tc.[ConfigId]) AS [TotalQuestionQuota]
FROM dbo.Tests t
LEFT JOIN dbo.Test_Pass_Config pc ON pc.[TestId] = t.[TestId]
LEFT JOIN dbo.Test_Config tc ON tc.[TestId] = t.[TestId];
GO

PRINT 'OK: add-tests-has-prerequisite';
GO
