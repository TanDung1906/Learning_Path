DECLARE @BankId INT;
SELECT @BankId = BankId FROM dbo.Question_Bank WHERE CourseId = 1;
IF @BankId IS NULL
BEGIN
  INSERT INTO dbo.Question_Bank (
    InstructorId, CourseId, CourseName, CourseDescription, BankDescription, CreatedAt, UpdatedAt, IsPublished
  )
  SELECT
    c.InstructorId, c.CourseId, c.CourseName, c.Description,
    N'Question bank seed for course 1', GETDATE(), GETDATE(), ISNULL(c.IsPublished, 1)
  FROM dbo.Courses c WHERE c.CourseId = 1;
  SET @BankId = SCOPE_IDENTITY();
END;
DECLARE @QP_1 INT;
SELECT @QP_1 = qp.Question_Path_Id
FROM dbo.Questions_Path qp WHERE qp.BankId = @BankId AND qp.PathId = 1;
IF @QP_1 IS NULL
BEGIN
  INSERT INTO dbo.Questions_Path (BankId, PathId, IsActive) VALUES (@BankId, 1, 1);
  SET @QP_1 = SCOPE_IDENTITY();
END;
DECLARE @S_1_1 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Nghe - Email công việc', N'Nghe - Email công việc', 1, 1, NULL, 1
);
SET @S_1_1 = SCOPE_IDENTITY();
DECLARE @Q_1_1_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_1, N'What does the speaker want the listener to do?', 1, 1, 1);
SET @Q_1_1_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_1, N'Reply by Friday', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_1, N'Cancel the meeting', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_1, N'Book a flight', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_1, N'Send an invoice', 4, 0);
DECLARE @Q_1_1_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_1, N'When is the meeting scheduled?', 1, 1, 2);
SET @Q_1_1_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_2, N'Monday at 9 AM', 1, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_2, N'Tuesday at 2 PM', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_2, N'Wednesday at 10 AM', 3, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_2, N'Friday at 4 PM', 4, 0);
DECLARE @Q_1_1_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_1, N'Who sent the email?', 1, 1, 3);
SET @Q_1_1_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_3, N'The project manager', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_3, N'The HR director', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_3, N'A client', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_3, N'The IT team', 4, 0);
DECLARE @Q_1_1_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_1, N'What attachment is mentioned?', 1, 1, 4);
SET @Q_1_1_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_4, N'Project timeline', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_4, N'Salary slip', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_4, N'Flight ticket', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_4, N'Menu', 4, 0);
DECLARE @Q_1_1_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_1, N'The tone of the email is best described as ___.', 1, 1, 5);
SET @Q_1_1_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_5, N'Professional and polite', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_5, N'Angry', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_5, N'Casual and informal', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_1_5, N'Humorous', 4, 0);
DECLARE @S_1_2 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Nghe - Họp nhóm', N'Nghe - Họp nhóm', 1, 2, NULL, 1
);
SET @S_1_2 = SCOPE_IDENTITY();
DECLARE @Q_1_2_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_2, N'What is the main topic of the meeting?', 1, 1, 1);
SET @Q_1_2_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_1, N'Q2 budget review', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_1, N'Office relocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_1, N'Holiday schedule', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_1, N'New hiring', 4, 0);
DECLARE @Q_1_2_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_2, N'How many people will attend?', 1, 1, 2);
SET @Q_1_2_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_2, N'Five', 1, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_2, N'Eight', 2, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_2, N'Ten', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_2, N'Twelve', 4, 0);
DECLARE @Q_1_2_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_2, N'Where will they meet?', 1, 1, 3);
SET @Q_1_2_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_3, N'Conference Room B', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_3, N'Cafeteria', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_3, N'Online only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_3, N'Reception', 4, 0);
DECLARE @Q_1_2_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_2, N'What should participants prepare?', 1, 1, 4);
SET @Q_1_2_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_4, N'Sales figures', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_4, N'Lunch orders', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_4, N'Passports', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_4, N'Uniforms', 4, 0);
DECLARE @Q_1_2_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_2, N'The meeting will end at ___.', 1, 1, 5);
SET @Q_1_2_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_5, N'11:30 AM', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_5, N'9:00 AM', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_5, N'1:00 PM', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_2_5, N'5:00 PM', 4, 0);
DECLARE @S_1_3 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Đọc - Thư mời họp', N'Đọc - Thư mời họp', 2, 3, NULL, 1
);
SET @S_1_3 = SCOPE_IDENTITY();
DECLARE @Q_1_3_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_3, N'The meeting invitation is for ___.', 1, 1, 1);
SET @Q_1_3_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_1, N'a quarterly review', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_1, N'a birthday party', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_1, N'a product launch only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_1, N'a training exam', 4, 0);
DECLARE @Q_1_3_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_3, N'Attendees are asked to confirm by ___.', 1, 1, 2);
SET @Q_1_3_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_2, N'email', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_2, N'phone call only', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_2, N'fax', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_2, N'postal mail', 4, 0);
DECLARE @Q_1_3_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_3, N'The dress code is ___.', 1, 1, 3);
SET @Q_1_3_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_3, N'business casual', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_3, N'sportswear', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_3, N'uniform required', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_3, N'not mentioned', 4, 0);
DECLARE @Q_1_3_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_3, N'Parking is available ___.', 1, 1, 4);
SET @Q_1_3_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_4, N'behind the building', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_4, N'not available', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_4, N'only for managers', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_4, N'on the roof', 4, 0);
DECLARE @Q_1_3_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_3, N'Lunch will be ___.', 1, 1, 5);
SET @Q_1_3_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_5, N'provided', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_5, N'not provided', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_5, N'paid separately only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_3_5, N'cancelled', 4, 0);
DECLARE @S_1_4 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Đọc - Email follow-up', N'Đọc - Email follow-up', 2, 4, NULL, 1
);
SET @S_1_4 = SCOPE_IDENTITY();
DECLARE @Q_1_4_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_4, N'The writer follows up about ___.', 1, 1, 1);
SET @Q_1_4_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_1, N'a delayed report', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_1, N'a wedding invitation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_1, N'a gym membership', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_1, N'a movie ticket', 4, 0);
DECLARE @Q_1_4_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_4, N'The deadline was originally ___.', 1, 1, 2);
SET @Q_1_4_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_2, N'last Monday', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_2, N'next year', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_2, N'yesterday evening', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_2, N'two months ago', 4, 0);
DECLARE @Q_1_4_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_4, N'The reader should contact ___.', 1, 1, 3);
SET @Q_1_4_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_3, N'Sarah in Finance', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_3, N'the security guard', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_3, N'the cafeteria', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_3, N'no one', 4, 0);
DECLARE @Q_1_4_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_4, N'The email suggests a call if ___.', 1, 1, 4);
SET @Q_1_4_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_4, N'there are issues', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_4, N'the weather is bad', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_4, N'it is lunchtime', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_4, N'the office is closed', 4, 0);
DECLARE @Q_1_4_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_4, N'The closing phrase is ___.', 1, 1, 5);
SET @Q_1_4_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_5, N'Best regards', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_5, N'See you never', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_5, N'No reply needed', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_4_5, N'Over and out', 4, 0);
DECLARE @S_1_5 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Từ vựng Email & Meetings', N'Từ vựng Email & Meetings', 3, 5, NULL, 1
);
SET @S_1_5 = SCOPE_IDENTITY();
DECLARE @Q_1_5_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_5, N'"Agenda" means ___.', 1, 1, 1);
SET @Q_1_5_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_1, N'a list of meeting topics', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_1, N'a type of chair', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_1, N'an email address', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_1, N'a lunch menu', 4, 0);
DECLARE @Q_1_5_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_5, N'Choose the synonym of "postpone".', 1, 1, 2);
SET @Q_1_5_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_2, N'delay', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_2, N'confirm', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_2, N'attend', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_2, N'approve', 4, 0);
DECLARE @Q_1_5_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_5, N'"Attendee" refers to ___.', 1, 1, 3);
SET @Q_1_5_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_3, N'a person who joins a meeting', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_3, N'a meeting room', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_3, N'a calendar app', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_3, N'a printer', 4, 0);
DECLARE @Q_1_5_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_5, N'"Minutes" in a meeting context are ___.', 1, 1, 4);
SET @Q_1_5_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_4, N'written notes of what was discussed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_4, N'60 seconds', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_4, N'small coins', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_4, N'coffee breaks', 4, 0);
DECLARE @Q_1_5_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_5, N'"RSVP" means you should ___.', 1, 1, 5);
SET @Q_1_5_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_5, N'respond to an invitation', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_5, N'bring food only', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_5, N'leave early', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_5, N'ignore the invite', 4, 0);
DECLARE @Q_1_5_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_5, N'"Follow up" means ___.', 1, 1, 6);
SET @Q_1_5_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_6, N'contact again about a previous matter', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_6, N'run before others', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_6, N'close a file', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_5_6, N'delete an email', 4, 0);
DECLARE @S_1_6 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Ngữ pháp Email & Meetings', N'Ngữ pháp Email & Meetings', 3, 6, NULL, 1
);
SET @S_1_6 = SCOPE_IDENTITY();
DECLARE @Q_1_6_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_6, N'I look forward ___ hearing from you.', 1, 1, 1);
SET @Q_1_6_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_1, N'to', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_1, N'for', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_1, N'at', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_1, N'on', 4, 0);
DECLARE @Q_1_6_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_6, N'We ___ the meeting yesterday.', 1, 1, 2);
SET @Q_1_6_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_2, N'had', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_2, N'have', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_2, N'having', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_2, N'has', 4, 0);
DECLARE @Q_1_6_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_6, N'Could you please ___ me the report?', 1, 1, 3);
SET @Q_1_6_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_3, N'send', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_3, N'sending', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_3, N'sent', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_3, N'sends', 4, 0);
DECLARE @Q_1_6_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_6, N'She has worked here ___ 2020.', 1, 1, 4);
SET @Q_1_6_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_4, N'since', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_4, N'for', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_4, N'during', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_4, N'by', 4, 0);
DECLARE @Q_1_6_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_6, N'The presentation ___ by Tom tomorrow.', 1, 1, 5);
SET @Q_1_6_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_5, N'will be given', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_5, N'gives', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_5, N'gave', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_5, N'giving', 4, 0);
DECLARE @Q_1_6_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_6, N'Would you mind ___ the door?', 1, 1, 6);
SET @Q_1_6_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_6, N'closing', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_6, N'close', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_6, N'to close', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_1_6_6, N'closed', 4, 0);
DECLARE @QP_2 INT;
SELECT @QP_2 = qp.Question_Path_Id
FROM dbo.Questions_Path qp WHERE qp.BankId = @BankId AND qp.PathId = 2;
IF @QP_2 IS NULL
BEGIN
  INSERT INTO dbo.Questions_Path (BankId, PathId, IsActive) VALUES (@BankId, 2, 1);
  SET @QP_2 = SCOPE_IDENTITY();
END;
DECLARE @S_2_1 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Nghe - Mở đầu thuyết trình', N'Nghe - Mở đầu thuyết trình', 1, 1, NULL, 1
);
SET @S_2_1 = SCOPE_IDENTITY();
DECLARE @Q_2_1_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_1, N'What is the presentation about?', 1, 1, 1);
SET @Q_2_1_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_1, N'Market trends', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_1, N'Cooking recipes', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_1, N'Sports results', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_1, N'Weather forecast', 4, 0);
DECLARE @Q_2_1_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_1, N'How long will the talk last?', 1, 1, 2);
SET @Q_2_1_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_2, N'20 minutes', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_2, N'2 hours', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_2, N'5 minutes', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_2, N'All day', 4, 0);
DECLARE @Q_2_1_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_1, N'The speaker asks the audience to ___.', 1, 1, 3);
SET @Q_2_1_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_3, N'hold questions until the end', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_3, N'leave immediately', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_3, N'turn off the lights', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_3, N'sing a song', 4, 0);
DECLARE @Q_2_1_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_1, N'Which slide is shown first?', 1, 1, 4);
SET @Q_2_1_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_4, N'Title slide', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_4, N'Conclusion', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_4, N'References', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_4, N'Blank page', 4, 0);
DECLARE @Q_2_1_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_1, N'The speaker works in ___.', 1, 1, 5);
SET @Q_2_1_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_5, N'the marketing department', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_5, N'the kitchen', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_5, N'the garage', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_1_5, N'the library', 4, 0);
DECLARE @S_2_2 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Nghe - Q&A sau thuyết trình', N'Nghe - Q&A sau thuyết trình', 1, 2, NULL, 1
);
SET @S_2_2 = SCOPE_IDENTITY();
DECLARE @Q_2_2_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_2, N'The first question is about ___.', 1, 1, 1);
SET @Q_2_2_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_1, N'pricing strategy', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_1, N'holiday plans', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_1, N'office plants', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_1, N'parking fees', 4, 0);
DECLARE @Q_2_2_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_2, N'The speaker does not know the answer to ___.', 1, 1, 2);
SET @Q_2_2_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_2, N'the exact launch date', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_2, N'their own name', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_2, N'the company name', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_2, N'the room number', 4, 0);
DECLARE @Q_2_2_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_2, N'Audience members should raise ___.', 1, 1, 3);
SET @Q_2_2_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_3, N'their hand', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_3, N'their voice only', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_3, N'the table', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_3, N'the projector', 4, 0);
DECLARE @Q_2_2_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_2, N'The Q&A session lasts ___.', 1, 1, 4);
SET @Q_2_2_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_4, N'10 minutes', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_4, N'2 seconds', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_4, N'3 hours', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_4, N'all week', 4, 0);
DECLARE @Q_2_2_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_2, N'Slides are available ___.', 1, 1, 5);
SET @Q_2_2_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_5, N'after the session by email', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_5, N'never', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_5, N'only on paper', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_2_5, N'only in person at HQ', 4, 0);
DECLARE @S_2_3 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Đọc - Cấu trúc slide', N'Đọc - Cấu trúc slide', 2, 3, NULL, 1
);
SET @S_2_3 = SCOPE_IDENTITY();
DECLARE @Q_2_3_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_3, N'A good presentation should start with ___.', 1, 1, 1);
SET @Q_2_3_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_1, N'a clear objective', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_1, N'a long joke', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_1, N'personal gossip', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_1, N'silent slides', 4, 0);
DECLARE @Q_2_3_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_3, N'Bullet points should be ___.', 1, 1, 2);
SET @Q_2_3_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_2, N'short and clear', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_2, N'as long as possible', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_2, N'written in red only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_2, N'avoided always', 4, 0);
DECLARE @Q_2_3_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_3, N'The conclusion should ___.', 1, 1, 3);
SET @Q_2_3_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_3, N'summarize key points', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_3, N'introduce new topics', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_3, N'ignore the audience', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_3, N'repeat the title only', 4, 0);
DECLARE @Q_2_3_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_3, N'Charts are used to ___.', 1, 1, 4);
SET @Q_2_3_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_4, N'show data visually', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_4, N'decorate the room', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_4, N'replace the speaker', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_4, N'hide information', 4, 0);
DECLARE @Q_2_3_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_3, N'Font size should be ___.', 1, 1, 5);
SET @Q_2_3_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_5, N'readable from the back', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_5, N'tiny', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_5, N'invisible', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_3_5, N'random', 4, 0);
DECLARE @S_2_4 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Đọc - Feedback thuyết trình', N'Đọc - Feedback thuyết trình', 2, 4, NULL, 1
);
SET @S_2_4 = SCOPE_IDENTITY();
DECLARE @Q_2_4_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_4, N'The reviewer praises the ___.', 1, 1, 1);
SET @Q_2_4_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_1, N'clear structure', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_1, N'lack of preparation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_1, N'excessive length', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_1, N'poor visuals', 4, 0);
DECLARE @Q_2_4_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_4, N'One suggestion is to ___.', 1, 1, 2);
SET @Q_2_4_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_2, N'speak more slowly', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_2, N'remove all slides', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_2, N'avoid eye contact', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_2, N'skip the introduction', 4, 0);
DECLARE @Q_2_4_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_4, N'The presenter should practice ___.', 1, 1, 3);
SET @Q_2_4_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_3, N'more before the next talk', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_3, N'less', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_3, N'only at night', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_3, N'never again', 4, 0);
DECLARE @Q_2_4_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_4, N'Body language was described as ___.', 1, 1, 4);
SET @Q_2_4_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_4, N'confident', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_4, N'nervous throughout', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_4, N'absent', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_4, N'distracting only', 4, 0);
DECLARE @Q_2_4_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_4, N'Overall rating was ___.', 1, 1, 5);
SET @Q_2_4_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_5, N'positive', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_5, N'failed', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_5, N'not given', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_4_5, N'cancelled', 4, 0);
DECLARE @S_2_5 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Từ vựng Presentations', N'Từ vựng Presentations', 3, 5, NULL, 1
);
SET @S_2_5 = SCOPE_IDENTITY();
DECLARE @Q_2_5_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_5, N'"Slide deck" means ___.', 1, 1, 1);
SET @Q_2_5_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_1, N'a set of presentation slides', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_1, N'a wooden box', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_1, N'a type of shoe', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_1, N'a computer virus', 4, 0);
DECLARE @Q_2_5_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_5, N'"Key takeaway" refers to ___.', 1, 1, 2);
SET @Q_2_5_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_2, N'the main point to remember', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_2, N'a stolen item', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_2, N'a keyboard shortcut', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_2, N'a lunch break', 4, 0);
DECLARE @Q_2_5_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_5, N'"Audience" means ___.', 1, 1, 3);
SET @Q_2_5_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_3, N'people listening to a talk', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_3, N'a type of microphone', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_3, N'a projector brand', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_3, N'a meeting room', 4, 0);
DECLARE @Q_2_5_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_5, N'"Handout" is ___.', 1, 1, 4);
SET @Q_2_5_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_4, N'printed material given to listeners', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_4, N'a wave goodbye', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_4, N'a type of vote', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_4, N'an online chat', 4, 0);
DECLARE @Q_2_5_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_5, N'"Q&A" stands for ___.', 1, 1, 5);
SET @Q_2_5_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_5, N'Question and Answer', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_5, N'Quick and Angry', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_5, N'Quality Assurance only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_5, N'Quiet Area', 4, 0);
DECLARE @Q_2_5_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_5, N'"Outline" means ___.', 1, 1, 6);
SET @Q_2_5_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_6, N'a summary plan of the talk', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_6, N'the outer edge of a circle', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_6, N'a final grade', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_5_6, N'a type of font', 4, 0);
DECLARE @S_2_6 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Ngữ pháp Presentations', N'Ngữ pháp Presentations', 3, 6, NULL, 1
);
SET @S_2_6 = SCOPE_IDENTITY();
DECLARE @Q_2_6_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_6, N'Today, I ___ going to talk about sales.', 1, 1, 1);
SET @Q_2_6_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_1, N'am', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_1, N'is', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_1, N'are', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_1, N'be', 4, 0);
DECLARE @Q_2_6_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_6, N'The data ___ shown on the next slide.', 1, 1, 2);
SET @Q_2_6_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_2, N'will be', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_2, N'was being', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_2, N'has', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_2, N'have', 4, 0);
DECLARE @Q_2_6_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_6, N'If I ___ more time, I would add more examples.', 1, 1, 3);
SET @Q_2_6_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_3, N'had', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_3, N'have', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_3, N'has', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_3, N'having', 4, 0);
DECLARE @Q_2_6_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_6, N'She suggested ___ the introduction shorter.', 1, 1, 4);
SET @Q_2_6_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_4, N'making', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_4, N'make', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_4, N'to make', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_4, N'made', 4, 0);
DECLARE @Q_2_6_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_6, N'There ___ many questions after the talk.', 1, 1, 5);
SET @Q_2_6_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_5, N'were', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_5, N'was', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_5, N'is', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_5, N'be', 4, 0);
DECLARE @Q_2_6_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_6, N'We have finished, ___ we?', 1, 1, 6);
SET @Q_2_6_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_6, N'haven''t', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_6, N'hasn''t', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_6, N'don''t', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_2_6_6, N'doesn''t', 4, 0);
DECLARE @QP_12 INT;
SELECT @QP_12 = qp.Question_Path_Id
FROM dbo.Questions_Path qp WHERE qp.BankId = @BankId AND qp.PathId = 12;
IF @QP_12 IS NULL
BEGIN
  INSERT INTO dbo.Questions_Path (BankId, PathId, IsActive) VALUES (@BankId, 12, 1);
  SET @QP_12 = SCOPE_IDENTITY();
END;
DECLARE @S_12_1 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Nghe - Gọi điện khách hàng', N'Nghe - Gọi điện khách hàng', 1, 1, NULL, 1
);
SET @S_12_1 = SCOPE_IDENTITY();
DECLARE @Q_12_1_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_1, N'The caller wants to ___.', 1, 1, 1);
SET @Q_12_1_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_1, N'schedule a product demo', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_1, N'order pizza', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_1, N'book a vacation', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_1, N'report a fire', 4, 0);
DECLARE @Q_12_1_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_1, N'The best time to call back is ___.', 1, 1, 2);
SET @Q_12_1_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_2, N'tomorrow afternoon', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_2, N'never', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_2, N'last week', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_2, N'midnight', 4, 0);
DECLARE @Q_12_1_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_1, N'The customer company is in ___.', 1, 1, 3);
SET @Q_12_1_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_3, N'the healthcare sector', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_3, N'professional sports', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_3, N'fashion design only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_3, N'agriculture only', 4, 0);
DECLARE @Q_12_1_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_1, N'The agent promises to ___.', 1, 1, 4);
SET @Q_12_1_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_4, N'send a calendar invite', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_4, N'ignore the request', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_4, N'delete the account', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_4, N'close the branch', 4, 0);
DECLARE @Q_12_1_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_1, N'The call ends with ___.', 1, 1, 5);
SET @Q_12_1_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_5, N'thanks and goodbye', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_5, N'an argument', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_5, N'silence only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_1_5, N'a song', 4, 0);
DECLARE @S_12_2 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Nghe - Đàm phán hợp đồng', N'Nghe - Đàm phán hợp đồng', 1, 2, NULL, 1
);
SET @S_12_2 = SCOPE_IDENTITY();
DECLARE @Q_12_2_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_2, N'Both sides disagree about ___.', 1, 1, 1);
SET @Q_12_2_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_1, N'payment terms', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_1, N'the weather', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_1, N'office color', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_1, N'lunch menu', 4, 0);
DECLARE @Q_12_2_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_2, N'The contract length discussed is ___.', 1, 1, 2);
SET @Q_12_2_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_2, N'12 months', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_2, N'12 days', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_2, N'12 hours', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_2, N'12 weeks only', 4, 0);
DECLARE @Q_12_2_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_2, N'They agree to meet ___.', 1, 1, 3);
SET @Q_12_2_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_3, N'next Tuesday', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_3, N'last year', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_3, N'never', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_3, N'without notice', 4, 0);
DECLARE @Q_12_2_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_2, N'Legal review will take ___.', 1, 1, 4);
SET @Q_12_2_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_4, N'about a week', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_4, N'one minute', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_4, N'ten years', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_4, N'no time', 4, 0);
DECLARE @Q_12_2_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_2, N'The negotiation tone is ___.', 1, 1, 5);
SET @Q_12_2_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_5, N'professional', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_5, N'hostile throughout', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_5, N'silent', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_2_5, N'comedic only', 4, 0);
DECLARE @S_12_3 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Đọc - Điều khoản hợp đồng', N'Đọc - Điều khoản hợp đồng', 2, 3, NULL, 1
);
SET @S_12_3 = SCOPE_IDENTITY();
DECLARE @Q_12_3_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_3, N'Payment is due within ___.', 1, 1, 1);
SET @Q_12_3_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_1, N'30 days', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_1, N'30 minutes', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_1, N'30 years', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_1, N'30 seconds', 4, 0);
DECLARE @Q_12_3_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_3, N'Either party may terminate with ___.', 1, 1, 2);
SET @Q_12_3_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_2, N'30 days notice', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_2, N'no notice ever', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_2, N'a verbal shout', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_2, N'a lottery', 4, 0);
DECLARE @Q_12_3_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_3, N'Confidential information must be ___.', 1, 1, 3);
SET @Q_12_3_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_3, N'protected', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_3, N'posted online', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_3, N'sold', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_3, N'ignored', 4, 0);
DECLARE @Q_12_3_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_3, N'Disputes will be resolved through ___.', 1, 1, 4);
SET @Q_12_3_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_4, N'arbitration', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_4, N'social media polls', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_4, N'coin toss only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_4, N'public debate', 4, 0);
DECLARE @Q_12_3_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_3, N'The contract starts on ___.', 1, 1, 5);
SET @Q_12_3_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_5, N'the signing date', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_5, N'a random date', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_5, N'never', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_3_5, N'yesterday only', 4, 0);
DECLARE @S_12_4 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Đọc - Báo cáo kinh doanh', N'Đọc - Báo cáo kinh doanh', 2, 4, NULL, 1
);
SET @S_12_4 = SCOPE_IDENTITY();
DECLARE @Q_12_4_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_4, N'Revenue increased by ___.', 1, 1, 1);
SET @Q_12_4_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_1, N'15%', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_1, N'1500%', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_1, N'0.1%', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_1, N'none', 4, 0);
DECLARE @Q_12_4_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_4, N'The main growth driver was ___.', 1, 1, 2);
SET @Q_12_4_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_2, N'new markets', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_2, N'office plants', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_2, N'shorter lunches', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_2, N'fewer employees', 4, 0);
DECLARE @Q_12_4_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_4, N'Costs were controlled by ___.', 1, 1, 3);
SET @Q_12_4_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_3, N'better budgeting', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_3, N'ignoring invoices', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_3, N'closing all branches', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_3, N'removing all staff', 4, 0);
DECLARE @Q_12_4_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_4, N'The CEO recommends ___.', 1, 1, 4);
SET @Q_12_4_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_4, N'continued investment', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_4, N'shutting down', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_4, N'no changes ever', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_4, N'random cuts', 4, 0);
DECLARE @Q_12_4_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_4, N'Next quarter focus is on ___.', 1, 1, 5);
SET @Q_12_4_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_5, N'customer retention', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_5, N'holiday parties only', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_5, N'renaming products', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_4_5, N'deleting data', 4, 0);
DECLARE @S_12_5 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Từ vựng Business Communication', N'Từ vựng Business Communication', 3, 5, NULL, 1
);
SET @S_12_5 = SCOPE_IDENTITY();
DECLARE @Q_12_5_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_5, N'"Negotiate" means ___.', 1, 1, 1);
SET @Q_12_5_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_1, N'discuss to reach agreement', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_1, N'run quickly', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_1, N'write poetry', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_1, N'cancel a trip', 4, 0);
DECLARE @Q_12_5_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_5, N'"Invoice" is ___.', 1, 1, 2);
SET @Q_12_5_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_2, N'a bill for payment', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_2, N'a meeting room', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_2, N'a job title', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_2, N'a type of chair', 4, 0);
DECLARE @Q_12_5_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_5, N'"Stakeholder" refers to ___.', 1, 1, 3);
SET @Q_12_5_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_3, N'someone with interest in a project', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_3, N'a kitchen tool', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_3, N'a fence post', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_3, N'a sports referee', 4, 0);
DECLARE @Q_12_5_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_5, N'"Deadline" means ___.', 1, 1, 4);
SET @Q_12_5_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_4, N'the final date to complete something', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_4, N'a line on the floor', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_4, N'a lunch break', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_4, N'a holiday', 4, 0);
DECLARE @Q_12_5_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_5, N'"Proposal" is ___.', 1, 1, 5);
SET @Q_12_5_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_5, N'a formal plan or offer', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_5, N'a type of dessert', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_5, N'an email signature', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_5, N'a printer error', 4, 0);
DECLARE @Q_12_5_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_5, N'"Compliance" means ___.', 1, 1, 6);
SET @Q_12_5_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_6, N'following rules and regulations', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_6, N'ignoring policies', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_6, N'celebrating only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_5_6, N'running away', 4, 0);
DECLARE @S_12_6 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Ngữ pháp Business Communication', N'Ngữ pháp Business Communication', 3, 6, NULL, 1
);
SET @S_12_6 = SCOPE_IDENTITY();
DECLARE @Q_12_6_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_6, N'The report ___ submitted last Friday.', 1, 1, 1);
SET @Q_12_6_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_1, N'was', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_1, N'were', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_1, N'be', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_1, N'being', 4, 0);
DECLARE @Q_12_6_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_6, N'We need to ___ the contract carefully.', 1, 1, 2);
SET @Q_12_6_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_2, N'review', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_2, N'reviewing', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_2, N'reviewed', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_2, N'reviews', 4, 0);
DECLARE @Q_12_6_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_6, N'Neither the manager nor the staff ___ present.', 1, 1, 3);
SET @Q_12_6_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_3, N'was', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_3, N'were', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_3, N'are', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_3, N'be', 4, 0);
DECLARE @Q_12_6_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_6, N'By next month, we ___ the project.', 1, 1, 4);
SET @Q_12_6_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_4, N'will have completed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_4, N'complete', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_4, N'completed', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_4, N'completing', 4, 0);
DECLARE @Q_12_6_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_6, N'He asked whether we ___ the terms.', 1, 1, 5);
SET @Q_12_6_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_5, N'accepted', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_5, N'accept', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_5, N'accepting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_5, N'accepts', 4, 0);
DECLARE @Q_12_6_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_6, N'The client insisted on ___ a discount.', 1, 1, 6);
SET @Q_12_6_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_6, N'getting', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_6, N'get', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_6, N'got', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_12_6_6, N'gets', 4, 0);