-- Remove manual test pick mode. System only uses auto random from question bank.
--
-- Drops:
--   dbo.Test_Config_Manual_Question
--   dbo.Test_Config.PickMode
--   dbo.Test_Config_Section.SectionPickMode
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

IF OBJECT_ID(N'dbo.Test_Config_Manual_Question', N'U') IS NOT NULL
    DROP TABLE dbo.Test_Config_Manual_Question;
GO

IF EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name = N'CK_Test_Config_PickMode'
      AND parent_object_id = OBJECT_ID(N'dbo.Test_Config')
)
    ALTER TABLE dbo.Test_Config DROP CONSTRAINT CK_Test_Config_PickMode;
GO

IF EXISTS (
    SELECT 1 FROM sys.default_constraints WHERE name = N'DF_Test_Config_PickMode'
)
    ALTER TABLE dbo.Test_Config DROP CONSTRAINT DF_Test_Config_PickMode;
GO

IF COL_LENGTH('dbo.Test_Config', 'PickMode') IS NOT NULL
    ALTER TABLE dbo.Test_Config DROP COLUMN PickMode;
GO

IF EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name = N'CK_Test_ConfigSec_PickMode'
      AND parent_object_id = OBJECT_ID(N'dbo.Test_Config_Section')
)
    ALTER TABLE dbo.Test_Config_Section DROP CONSTRAINT CK_Test_ConfigSec_PickMode;
GO

IF EXISTS (
    SELECT 1 FROM sys.default_constraints WHERE name = N'DF_Test_ConfigSec_Mode'
)
    ALTER TABLE dbo.Test_Config_Section DROP CONSTRAINT DF_Test_ConfigSec_Mode;
GO

IF COL_LENGTH('dbo.Test_Config_Section', 'SectionPickMode') IS NOT NULL
    ALTER TABLE dbo.Test_Config_Section DROP COLUMN SectionPickMode;
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

PRINT 'OK: drop-test-config-manual-mode';
GO
