-- Test_Config chỉ giữ thông tin cơ bản; chi tiết kỹ năng/section nằm ở Test_Config_Section.
-- Idempotent — safe to re-run.

USE [LearningPath_Base];
GO

IF OBJECT_ID(N'dbo.vw_Test_Config_Summary', N'V') IS NOT NULL
    DROP VIEW dbo.vw_Test_Config_Summary;
GO

DECLARE @dropRandomSectionDefault NVARCHAR(256);
SELECT @dropRandomSectionDefault = dc.name
FROM sys.default_constraints dc
INNER JOIN sys.columns c
    ON c.object_id = dc.parent_object_id
   AND c.column_id = dc.parent_column_id
WHERE dc.parent_object_id = OBJECT_ID(N'dbo.Test_Config')
  AND c.name = N'IsRandomSection';
IF @dropRandomSectionDefault IS NOT NULL
    EXEC(N'ALTER TABLE dbo.Test_Config DROP CONSTRAINT [' + @dropRandomSectionDefault + N']');
GO

DECLARE @dropRandomCountDefault NVARCHAR(256);
SELECT @dropRandomCountDefault = dc.name
FROM sys.default_constraints dc
INNER JOIN sys.columns c
    ON c.object_id = dc.parent_object_id
   AND c.column_id = dc.parent_column_id
WHERE dc.parent_object_id = OBJECT_ID(N'dbo.Test_Config')
  AND c.name = N'RandomSectionCount';
IF @dropRandomCountDefault IS NOT NULL
    EXEC(N'ALTER TABLE dbo.Test_Config DROP CONSTRAINT [' + @dropRandomCountDefault + N']');
GO

IF COL_LENGTH('dbo.Test_Config', 'IsRandomSection') IS NOT NULL
    ALTER TABLE dbo.Test_Config DROP COLUMN IsRandomSection;
GO

IF EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name = N'CK_Test_Config_RandomSectionCount'
      AND parent_object_id = OBJECT_ID(N'dbo.Test_Config')
)
    ALTER TABLE dbo.Test_Config DROP CONSTRAINT CK_Test_Config_RandomSectionCount;
GO

IF COL_LENGTH('dbo.Test_Config', 'RandomSectionCount') IS NOT NULL
    ALTER TABLE dbo.Test_Config DROP COLUMN RandomSectionCount;
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
    tc.[DurationMinutes],
    tc.[MaxAttempts],
    tc.[UpdatedBy],
    tc.[UpdatedAt],
    (SELECT COUNT(*) FROM dbo.Test_Config_Section cs WHERE cs.[ConfigId] = tc.[ConfigId]) AS [ConfigSectionCount],
    (SELECT COUNT(*) FROM dbo.Test_Questions_Sections tqs WHERE tqs.[TestId] = t.[TestId]) AS [MaterializedSectionCount],
    (SELECT COUNT(*) FROM dbo.Test_Questions tq
        INNER JOIN dbo.Test_Questions_Sections tqs ON tqs.[SectionId] = tq.[SectionId]
        WHERE tqs.[TestId] = t.[TestId]) AS [MaterializedQuestionCount],
    (SELECT SUM(
        CASE
            WHEN cs.TypeId IN (1, 2) THEN ISNULL(cs.SectionPickCount, 0)
            ELSE ISNULL(cs.QuestionQuantity, 0)
        END
     ) FROM dbo.Test_Config_Section cs WHERE cs.[ConfigId] = tc.[ConfigId]) AS [TotalQuestionQuota]
FROM dbo.Tests t
LEFT JOIN dbo.Test_Pass_Config pc ON pc.[TestId] = t.[TestId]
LEFT JOIN dbo.Test_Config tc ON tc.[TestId] = t.[TestId];
GO

PRINT 'OK: drop-test-config-random-section-columns';
GO
