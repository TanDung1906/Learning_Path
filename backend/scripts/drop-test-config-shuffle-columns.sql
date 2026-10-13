-- Remove shuffle feature from Test_Config (aligned with UI: no shuffle questions/answers).
-- App does not read these columns yet; safe when Test_Config is empty or unused.
-- Idempotent — safe to re-run.

USE [LearningPath_Base];
GO

IF OBJECT_ID(N'dbo.vw_Test_Config_Summary', N'V') IS NOT NULL
    DROP VIEW dbo.vw_Test_Config_Summary;
GO

IF EXISTS (
    SELECT 1 FROM sys.default_constraints WHERE name = N'DF_Test_Config_ShuffleQ'
)
    ALTER TABLE dbo.Test_Config DROP CONSTRAINT DF_Test_Config_ShuffleQ;
GO

IF EXISTS (
    SELECT 1 FROM sys.default_constraints WHERE name = N'DF_Test_Config_ShuffleC'
)
    ALTER TABLE dbo.Test_Config DROP CONSTRAINT DF_Test_Config_ShuffleC;
GO

IF COL_LENGTH('dbo.Test_Config', 'ShuffleQuestions') IS NOT NULL
    ALTER TABLE dbo.Test_Config DROP COLUMN ShuffleQuestions;
GO

IF COL_LENGTH('dbo.Test_Config', 'ShuffleChoices') IS NOT NULL
    ALTER TABLE dbo.Test_Config DROP COLUMN ShuffleChoices;
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

PRINT 'OK: drop-test-config-shuffle-columns';
GO
