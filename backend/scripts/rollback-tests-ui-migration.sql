-- Rollback UI migration experiments on dbo.Tests / dbo.Test_Config
-- Run in SSMS if migrate-tests-one-per-chapter.sql caused issues.
-- Safe to re-run (idempotent drops).

USE [LearningPath_Base];
GO

IF EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Tests') AND name = N'UQ_Tests_PathId_ChapterQuiz'
)
    DROP INDEX UQ_Tests_PathId_ChapterQuiz ON dbo.Tests;
GO

IF EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Tests') AND name = N'UQ_Tests_CourseId_CourseQuiz'
)
    DROP INDEX UQ_Tests_CourseId_CourseQuiz ON dbo.Tests;
GO

IF EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Tests') AND name = N'UQ_Tests_ChapterQuizPathKey'
)
    DROP INDEX UQ_Tests_ChapterQuizPathKey ON dbo.Tests;
GO

IF EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Tests') AND name = N'UQ_Tests_CourseQuizCourseKey'
)
    DROP INDEX UQ_Tests_CourseQuizCourseKey ON dbo.Tests;
GO

IF COL_LENGTH('dbo.Tests', 'ChapterQuizPathKey') IS NOT NULL
BEGIN
    ALTER TABLE dbo.Tests DROP COLUMN ChapterQuizPathKey;
END
GO

IF COL_LENGTH('dbo.Tests', 'CourseQuizCourseKey') IS NOT NULL
BEGIN
    ALTER TABLE dbo.Tests DROP COLUMN CourseQuizCourseKey;
END
GO

IF EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name = N'CK_Tests_Scope' AND parent_object_id = OBJECT_ID(N'dbo.Tests')
)
    ALTER TABLE dbo.Tests DROP CONSTRAINT CK_Tests_Scope;
GO

IF EXISTS (
    SELECT 1 FROM sys.default_constraints WHERE name = N'DF_Tests_IsCourseTest'
)
    ALTER TABLE dbo.Tests DROP CONSTRAINT DF_Tests_IsCourseTest;
GO

IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Tests')
      AND name = N'IsCourseTest'
      AND is_nullable = 0
)
BEGIN
    ALTER TABLE dbo.Tests ALTER COLUMN IsCourseTest BIT NULL;
END
GO

-- Shuffle columns: use drop-test-config-shuffle-columns.sql (do not restore defaults here).

PRINT 'OK: rollback-tests-ui-migration';
GO
