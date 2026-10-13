-- Xóa toàn bộ dữ liệu question bank và bài test.
-- Giữ nguyên Courses, Paths, Path_Nodes, Users, học liệu, v.v.

USE [LearningPath_Base];
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
SET QUOTED_IDENTIFIER ON;
GO

BEGIN TRANSACTION;

-- --- Test attempts & stats ---
DELETE FROM dbo.Test_Attempt_Answers;
DELETE FROM dbo.Test_Attempt_Section_Stats;
DELETE FROM dbo.Test_Attempts;

-- --- Test config (phụ thuộc Question_Sections qua BankSectionId) ---
DELETE FROM dbo.Test_Config_Section;
DELETE FROM dbo.Test_Course_Chapters;
DELETE FROM dbo.Test_Prerequisites;
DELETE FROM dbo.Test_Pass_Config;
DELETE FROM dbo.Test_Config;
DELETE FROM dbo.Tests;

-- --- Question bank ---
DELETE FROM dbo.Question_Choices;
DELETE FROM dbo.Questions;
DELETE FROM dbo.Question_Sections;
DELETE FROM dbo.Questions_Path;
DELETE FROM dbo.Question_Bank;

COMMIT TRANSACTION;

PRINT 'OK: deleted all question bank and test data';
GO
