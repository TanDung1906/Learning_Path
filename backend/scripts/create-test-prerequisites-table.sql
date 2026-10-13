-- Test prerequisites: which chapter/course tests must be passed before attempting another test.
--
-- Model (each Path has at most one chapter test in dbo.Tests):
--   Tests.HasPrerequisite    = 1 khi bài test có điều kiện tiên quyết
--   Test_Prerequisites       = danh sách bài test phải hoàn thành trước (join để check)
--       TestId             = bài test đích (vd. path 3)
--       PrerequisiteTestId = bài test tiên quyết (vd. test path 1, path 2)
--
-- Runtime check:
--   HasPrerequisite = 0  -> được phép làm
--   HasPrerequisite = 1  -> join Test_Prerequisites, tất cả PrerequisiteTestId phải đã pass
--
-- UI mapping (localStorage requiredChapterIds):
--   requiredChapterIds -> resolve PathId -> PrerequisiteTestId via Tests.PathId
--   requiredChapterIds.length > 0 -> HasPrerequisite = 1
--
-- Idempotent — safe to re-run.

USE [LearningPath_Base];
GO

IF OBJECT_ID(N'dbo.vw_Test_Config_Summary', N'V') IS NOT NULL
    DROP VIEW dbo.vw_Test_Config_Summary;
GO

IF OBJECT_ID(N'dbo.vw_Test_Prerequisite_Summary', N'V') IS NOT NULL
    DROP VIEW dbo.vw_Test_Prerequisite_Summary;
GO

IF EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name = N'CK_Tests_PrerequisiteMatchMode'
      AND parent_object_id = OBJECT_ID(N'dbo.Tests')
)
    ALTER TABLE dbo.Tests DROP CONSTRAINT CK_Tests_PrerequisiteMatchMode;
GO

DECLARE @dfPrerequisiteMatchMode sysname;
SELECT @dfPrerequisiteMatchMode = dc.name
FROM sys.default_constraints dc
INNER JOIN sys.columns c
    ON c.object_id = dc.parent_object_id
   AND c.column_id = dc.parent_column_id
WHERE dc.parent_object_id = OBJECT_ID(N'dbo.Tests')
  AND c.name = N'PrerequisiteMatchMode';

IF @dfPrerequisiteMatchMode IS NOT NULL
    EXEC(N'ALTER TABLE dbo.Tests DROP CONSTRAINT [' + @dfPrerequisiteMatchMode + N']');
GO

IF COL_LENGTH('dbo.Tests', 'PrerequisiteMatchMode') IS NOT NULL
    ALTER TABLE dbo.Tests DROP COLUMN PrerequisiteMatchMode;
GO

IF OBJECT_ID(N'dbo.Test_Prerequisites', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Test_Prerequisites
    (
        TestId              INT NOT NULL,
        PrerequisiteTestId  INT NOT NULL,
        CONSTRAINT PK_Test_Prerequisites PRIMARY KEY (TestId, PrerequisiteTestId),
        CONSTRAINT CK_Test_Prerequisites_NotSelf CHECK (TestId <> PrerequisiteTestId),
        CONSTRAINT FK_Test_Prerequisites_Test
            FOREIGN KEY (TestId) REFERENCES dbo.Tests (TestId) ON DELETE CASCADE,
        CONSTRAINT FK_Test_Prerequisites_PrerequisiteTest
            FOREIGN KEY (PrerequisiteTestId) REFERENCES dbo.Tests (TestId)
    );
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Test_Prerequisites')
      AND name = N'IX_Test_Prerequisites_PrerequisiteTestId'
)
BEGIN
    CREATE INDEX IX_Test_Prerequisites_PrerequisiteTestId
        ON dbo.Test_Prerequisites (PrerequisiteTestId);
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Tests')
      AND name = N'UQ_Tests_PathId_ChapterQuiz'
)
BEGIN
    SET QUOTED_IDENTIFIER ON;
    CREATE UNIQUE INDEX UQ_Tests_PathId_ChapterQuiz
        ON dbo.Tests (PathId)
        WHERE PathId IS NOT NULL AND IsCourseTest = 0;
END
GO

UPDATE t
SET t.HasPrerequisite = CASE
    WHEN EXISTS (SELECT 1 FROM dbo.Test_Prerequisites tp WHERE tp.TestId = t.TestId) THEN 1
    ELSE 0
END
FROM dbo.Tests t;
GO

CREATE VIEW dbo.vw_Test_Prerequisite_Summary
AS
SELECT
    tp.[TestId],
    t.[TestName] AS [TestName],
    t.[PathId] AS [PathId],
    t.[CourseId] AS [CourseId],
    t.[HasPrerequisite],
    tp.[PrerequisiteTestId],
    pre.[TestName] AS [PrerequisiteTestName],
    pre.[PathId] AS [PrerequisitePathId],
    pre.[TestOrder] AS [PrerequisiteTestOrder]
FROM dbo.Test_Prerequisites tp
INNER JOIN dbo.Tests t ON t.[TestId] = tp.[TestId]
INNER JOIN dbo.Tests pre ON pre.[TestId] = tp.[PrerequisiteTestId];
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

PRINT 'OK: create-test-prerequisites-table';
GO
