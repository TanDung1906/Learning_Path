-- Delete all test-related data (keeps tables/schema).
-- Idempotent — safe to re-run.

USE [LearningPath_Base];
GO

SET NOCOUNT ON;
SET QUOTED_IDENTIFIER ON;
GO

DELETE FROM dbo.Test_Attempt_Answers;
DELETE FROM dbo.Test_Attempts;
DELETE FROM dbo.Test_Question_Choices;
DELETE FROM dbo.Test_Questions;
DELETE FROM dbo.Test_Questions_Sections;
DELETE FROM dbo.Test_Config_Section;
DELETE FROM dbo.Test_Config;
DELETE FROM dbo.Test_Pass_Config;
DELETE FROM dbo.Test_Prerequisites;
DELETE FROM dbo.Tests;

PRINT 'OK: delete-all-test-data';
GO
