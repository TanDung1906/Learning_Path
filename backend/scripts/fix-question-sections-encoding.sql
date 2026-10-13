USE [LearningPath_Base];
GO

SET NOCOUNT ON;
SET QUOTED_IDENTIFIER ON;
GO

BEGIN TRANSACTION;

-- Chương 1 (PathId = 1)
UPDATE dbo.Question_Sections SET SectionName = N'Nghe - Email công việc', Title = N'Nghe - Email công việc' WHERE SectionId = 23;
UPDATE dbo.Question_Sections SET SectionName = N'Nghe - Họp nhóm', Title = N'Nghe - Họp nhóm' WHERE SectionId = 24;
UPDATE dbo.Question_Sections SET SectionName = N'Đọc - Thư mời họp', Title = N'Đọc - Thư mời họp' WHERE SectionId = 25;
UPDATE dbo.Question_Sections SET SectionName = N'Đọc - Email follow-up', Title = N'Đọc - Email follow-up' WHERE SectionId = 26;
UPDATE dbo.Question_Sections SET SectionName = N'Từ vựng Email & Meetings', Title = N'Từ vựng Email & Meetings' WHERE SectionId = 27;
UPDATE dbo.Question_Sections SET SectionName = N'Ngữ pháp Email & Meetings', Title = N'Ngữ pháp Email & Meetings' WHERE SectionId = 28;

-- Chương 2 (PathId = 2)
UPDATE dbo.Question_Sections SET SectionName = N'Nghe - Mở đầu thuyết trình', Title = N'Nghe - Mở đầu thuyết trình' WHERE SectionId = 29;
UPDATE dbo.Question_Sections SET SectionName = N'Nghe - Q&A sau thuyết trình', Title = N'Nghe - Q&A sau thuyết trình' WHERE SectionId = 30;
UPDATE dbo.Question_Sections SET SectionName = N'Đọc - Cấu trúc slide', Title = N'Đọc - Cấu trúc slide' WHERE SectionId = 31;
UPDATE dbo.Question_Sections SET SectionName = N'Đọc - Feedback thuyết trình', Title = N'Đọc - Feedback thuyết trình' WHERE SectionId = 32;
UPDATE dbo.Question_Sections SET SectionName = N'Từ vựng Presentations', Title = N'Từ vựng Presentations' WHERE SectionId = 33;
UPDATE dbo.Question_Sections SET SectionName = N'Ngữ pháp Presentations', Title = N'Ngữ pháp Presentations' WHERE SectionId = 34;

-- Chương 3 (PathId = 12)
UPDATE dbo.Question_Sections SET SectionName = N'Nghe - Gọi điện khách hàng', Title = N'Nghe - Gọi điện khách hàng' WHERE SectionId = 35;
UPDATE dbo.Question_Sections SET SectionName = N'Nghe - Đàm phán hợp đồng', Title = N'Nghe - Đàm phán hợp đồng' WHERE SectionId = 36;
UPDATE dbo.Question_Sections SET SectionName = N'Đọc - Điều khoản hợp đồng', Title = N'Đọc - Điều khoản hợp đồng' WHERE SectionId = 37;
UPDATE dbo.Question_Sections SET SectionName = N'Đọc - Báo cáo kinh doanh', Title = N'Đọc - Báo cáo kinh doanh' WHERE SectionId = 38;
UPDATE dbo.Question_Sections SET SectionName = N'Từ vựng Business Communication', Title = N'Từ vựng Business Communication' WHERE SectionId = 39;
UPDATE dbo.Question_Sections SET SectionName = N'Ngữ pháp Business Communication', Title = N'Ngữ pháp Business Communication' WHERE SectionId = 40;

UPDATE dbo.Question_Bank
SET BankDescription = N'Question bank seed cho khóa học 1'
WHERE CourseId = 1;

COMMIT TRANSACTION;

PRINT 'OK: fixed Question_Sections encoding';
GO
