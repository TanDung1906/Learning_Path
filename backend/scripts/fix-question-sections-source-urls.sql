USE [LearningPath_Base];
GO

SET NOCOUNT ON;
SET QUOTED_IDENTIFIER ON;
GO

BEGIN TRANSACTION;

-- Nghe (TypeId = 1): YouTube watch URLs
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=EngW7tLk6R8' WHERE SectionId = 23;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=cKuuxQd0-dI' WHERE SectionId = 24;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=0yK5Loh2c_4' WHERE SectionId = 41;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=8mMURfqgL4s' WHERE SectionId = 42;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=3P9W1j8I0XE' WHERE SectionId = 29;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=9bZkp7q19f0' WHERE SectionId = 30;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=kJQP7kiw5Fk' WHERE SectionId = 47;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=OPf0YbXqDm0' WHERE SectionId = 48;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=RgKAFK5djSk' WHERE SectionId = 35;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=fJ9rUzIMcZQ' WHERE SectionId = 36;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=JGwWNG6dvX8' WHERE SectionId = 53;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.youtube.com/watch?v=2Vv-BfVoq4g' WHERE SectionId = 54;

-- Đọc (TypeId = 2): link HTTPS công khai (UI hiển thị nút "Mở bài đọc")
UPDATE dbo.Question_Sections SET SourceUrl = N'https://learnenglish.britishcouncil.org/skills/reading/b1-reading' WHERE SectionId = 25;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://learnenglish.britishcouncil.org/skills/reading/a2-reading' WHERE SectionId = 26;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.bbc.com/learningenglish/english/course/lower-intermediate/unit-1/session-1' WHERE SectionId = 43;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.bbc.com/learningenglish/english/course/lower-intermediate/unit-2/session-1' WHERE SectionId = 44;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://learnenglish.britishcouncil.org/skills/reading/upper-intermediate' WHERE SectionId = 31;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.bbc.com/learningenglish/english/course/elementary/unit-1/session-1' WHERE SectionId = 32;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://learnenglish.britishcouncil.org/skills/reading/intermediate' WHERE SectionId = 49;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.bbc.com/learningenglish/english/course/intermediate/unit-1/session-1' WHERE SectionId = 50;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://learnenglish.britishcouncil.org/skills/reading/elementary-a2' WHERE SectionId = 37;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.bbc.com/learningenglish/english/course/upper-intermediate/unit-1/session-1' WHERE SectionId = 38;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://learnenglish.britishcouncil.org/skills/reading/pre-intermediate' WHERE SectionId = 55;
UPDATE dbo.Question_Sections SET SourceUrl = N'https://www.bbc.com/learningenglish/english/course/elementary/unit-2/session-1' WHERE SectionId = 56;

COMMIT TRANSACTION;

PRINT 'OK: updated SourceUrl for listening/reading sections';
GO
