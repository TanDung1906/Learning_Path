DECLARE @BankId INT = (SELECT TOP 1 BankId FROM dbo.Question_Bank WHERE CourseId = 1);
DECLARE @Q_pad23_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (23, N'[Email & Meetings] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_pad23_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_6, N'The topic was sports', 4, 0);
DECLARE @Q_pad23_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (23, N'[Email & Meetings] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_pad23_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_7, N'The topic was sports', 4, 0);
DECLARE @Q_pad23_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (23, N'[Email & Meetings] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_pad23_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_8, N'The topic was sports', 4, 0);
DECLARE @Q_pad23_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (23, N'[Email & Meetings] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_pad23_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_9, N'The topic was sports', 4, 0);
DECLARE @Q_pad23_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (23, N'[Email & Meetings] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_pad23_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad23_10, N'The topic was sports', 4, 0);
DECLARE @Q_pad24_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (24, N'[Email & Meetings] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_pad24_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_6, N'The topic was sports', 4, 0);
DECLARE @Q_pad24_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (24, N'[Email & Meetings] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_pad24_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_7, N'The topic was sports', 4, 0);
DECLARE @Q_pad24_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (24, N'[Email & Meetings] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_pad24_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_8, N'The topic was sports', 4, 0);
DECLARE @Q_pad24_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (24, N'[Email & Meetings] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_pad24_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_9, N'The topic was sports', 4, 0);
DECLARE @Q_pad24_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (24, N'[Email & Meetings] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_pad24_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad24_10, N'The topic was sports', 4, 0);
DECLARE @Q_pad25_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (25, N'[Email & Meetings] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_pad25_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_6, N'Delete the document', 4, 0);
DECLARE @Q_pad25_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (25, N'[Email & Meetings] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_pad25_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_7, N'Delete the document', 4, 0);
DECLARE @Q_pad25_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (25, N'[Email & Meetings] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_pad25_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_8, N'Delete the document', 4, 0);
DECLARE @Q_pad25_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (25, N'[Email & Meetings] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_pad25_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_9, N'Delete the document', 4, 0);
DECLARE @Q_pad25_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (25, N'[Email & Meetings] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_pad25_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad25_10, N'Delete the document', 4, 0);
DECLARE @Q_pad26_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (26, N'[Email & Meetings] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_pad26_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_6, N'Delete the document', 4, 0);
DECLARE @Q_pad26_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (26, N'[Email & Meetings] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_pad26_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_7, N'Delete the document', 4, 0);
DECLARE @Q_pad26_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (26, N'[Email & Meetings] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_pad26_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_8, N'Delete the document', 4, 0);
DECLARE @Q_pad26_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (26, N'[Email & Meetings] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_pad26_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_9, N'Delete the document', 4, 0);
DECLARE @Q_pad26_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (26, N'[Email & Meetings] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_pad26_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad26_10, N'Delete the document', 4, 0);
DECLARE @Q_pad27_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (27, N'[Email & Meetings] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_pad27_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad27_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (27, N'[Email & Meetings] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_pad27_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad27_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (27, N'[Email & Meetings] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_pad27_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad27_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (27, N'[Email & Meetings] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_pad27_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad27_10, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad28_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (28, N'[Email & Meetings] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_pad28_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad28_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (28, N'[Email & Meetings] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_pad28_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad28_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (28, N'[Email & Meetings] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_pad28_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad28_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (28, N'[Email & Meetings] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_pad28_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad28_10, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad29_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (29, N'[Presentations] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_pad29_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_6, N'The topic was sports', 4, 0);
DECLARE @Q_pad29_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (29, N'[Presentations] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_pad29_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_7, N'The topic was sports', 4, 0);
DECLARE @Q_pad29_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (29, N'[Presentations] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_pad29_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_8, N'The topic was sports', 4, 0);
DECLARE @Q_pad29_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (29, N'[Presentations] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_pad29_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_9, N'The topic was sports', 4, 0);
DECLARE @Q_pad29_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (29, N'[Presentations] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_pad29_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad29_10, N'The topic was sports', 4, 0);
DECLARE @Q_pad30_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (30, N'[Presentations] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_pad30_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_6, N'The topic was sports', 4, 0);
DECLARE @Q_pad30_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (30, N'[Presentations] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_pad30_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_7, N'The topic was sports', 4, 0);
DECLARE @Q_pad30_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (30, N'[Presentations] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_pad30_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_8, N'The topic was sports', 4, 0);
DECLARE @Q_pad30_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (30, N'[Presentations] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_pad30_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_9, N'The topic was sports', 4, 0);
DECLARE @Q_pad30_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (30, N'[Presentations] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_pad30_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad30_10, N'The topic was sports', 4, 0);
DECLARE @Q_pad31_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (31, N'[Presentations] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_pad31_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_6, N'Delete the document', 4, 0);
DECLARE @Q_pad31_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (31, N'[Presentations] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_pad31_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_7, N'Delete the document', 4, 0);
DECLARE @Q_pad31_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (31, N'[Presentations] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_pad31_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_8, N'Delete the document', 4, 0);
DECLARE @Q_pad31_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (31, N'[Presentations] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_pad31_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_9, N'Delete the document', 4, 0);
DECLARE @Q_pad31_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (31, N'[Presentations] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_pad31_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad31_10, N'Delete the document', 4, 0);
DECLARE @Q_pad32_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (32, N'[Presentations] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_pad32_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_6, N'Delete the document', 4, 0);
DECLARE @Q_pad32_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (32, N'[Presentations] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_pad32_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_7, N'Delete the document', 4, 0);
DECLARE @Q_pad32_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (32, N'[Presentations] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_pad32_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_8, N'Delete the document', 4, 0);
DECLARE @Q_pad32_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (32, N'[Presentations] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_pad32_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_9, N'Delete the document', 4, 0);
DECLARE @Q_pad32_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (32, N'[Presentations] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_pad32_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad32_10, N'Delete the document', 4, 0);
DECLARE @Q_pad33_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (33, N'[Presentations] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_pad33_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad33_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (33, N'[Presentations] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_pad33_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad33_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (33, N'[Presentations] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_pad33_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad33_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (33, N'[Presentations] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_pad33_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad33_10, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad34_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (34, N'[Presentations] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_pad34_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad34_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (34, N'[Presentations] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_pad34_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad34_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (34, N'[Presentations] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_pad34_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad34_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (34, N'[Presentations] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_pad34_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad34_10, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad35_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (35, N'[Business Communication] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_pad35_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_6, N'The topic was sports', 4, 0);
DECLARE @Q_pad35_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (35, N'[Business Communication] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_pad35_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_7, N'The topic was sports', 4, 0);
DECLARE @Q_pad35_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (35, N'[Business Communication] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_pad35_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_8, N'The topic was sports', 4, 0);
DECLARE @Q_pad35_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (35, N'[Business Communication] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_pad35_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_9, N'The topic was sports', 4, 0);
DECLARE @Q_pad35_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (35, N'[Business Communication] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_pad35_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad35_10, N'The topic was sports', 4, 0);
DECLARE @Q_pad36_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (36, N'[Business Communication] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_pad36_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_6, N'The topic was sports', 4, 0);
DECLARE @Q_pad36_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (36, N'[Business Communication] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_pad36_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_7, N'The topic was sports', 4, 0);
DECLARE @Q_pad36_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (36, N'[Business Communication] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_pad36_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_8, N'The topic was sports', 4, 0);
DECLARE @Q_pad36_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (36, N'[Business Communication] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_pad36_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_9, N'The topic was sports', 4, 0);
DECLARE @Q_pad36_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (36, N'[Business Communication] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_pad36_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad36_10, N'The topic was sports', 4, 0);
DECLARE @Q_pad37_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (37, N'[Business Communication] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_pad37_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_6, N'Delete the document', 4, 0);
DECLARE @Q_pad37_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (37, N'[Business Communication] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_pad37_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_7, N'Delete the document', 4, 0);
DECLARE @Q_pad37_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (37, N'[Business Communication] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_pad37_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_8, N'Delete the document', 4, 0);
DECLARE @Q_pad37_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (37, N'[Business Communication] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_pad37_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_9, N'Delete the document', 4, 0);
DECLARE @Q_pad37_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (37, N'[Business Communication] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_pad37_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad37_10, N'Delete the document', 4, 0);
DECLARE @Q_pad38_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (38, N'[Business Communication] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_pad38_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_6, N'Delete the document', 4, 0);
DECLARE @Q_pad38_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (38, N'[Business Communication] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_pad38_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_7, N'Delete the document', 4, 0);
DECLARE @Q_pad38_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (38, N'[Business Communication] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_pad38_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_8, N'Delete the document', 4, 0);
DECLARE @Q_pad38_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (38, N'[Business Communication] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_pad38_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_9, N'Delete the document', 4, 0);
DECLARE @Q_pad38_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (38, N'[Business Communication] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_pad38_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad38_10, N'Delete the document', 4, 0);
DECLARE @Q_pad39_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (39, N'[Business Communication] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_pad39_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad39_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (39, N'[Business Communication] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_pad39_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad39_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (39, N'[Business Communication] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_pad39_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad39_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (39, N'[Business Communication] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_pad39_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad39_10, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad40_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (40, N'[Business Communication] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_pad40_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad40_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (40, N'[Business Communication] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_pad40_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad40_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (40, N'[Business Communication] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_pad40_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_pad40_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (40, N'[Business Communication] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_pad40_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_pad40_10, N'Unrelated phrase', 4, 0);
DECLARE @QP_1 INT;
SELECT @QP_1 = qp.Question_Path_Id
FROM dbo.Questions_Path qp WHERE qp.BankId = @BankId AND qp.PathId = 1;
DECLARE @S_1_7 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Nghe - Lịch họp tuần', N'Nghe - Lịch họp tuần', 1, 7, NULL, 1
);
SET @S_1_7 = SCOPE_IDENTITY();
DECLARE @Q_new1_7_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_7, N'[Email & Meetings] Listening extra Q1: What is the main point?', 1, 1, 1);
SET @Q_new1_7_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_1, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_1, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_1, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_1, N'The topic was sports', 4, 0);
DECLARE @Q_new1_7_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_7, N'[Email & Meetings] Listening extra Q2: What is the main point?', 1, 1, 2);
SET @Q_new1_7_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_2, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_2, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_2, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_2, N'The topic was sports', 4, 0);
DECLARE @Q_new1_7_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_7, N'[Email & Meetings] Listening extra Q3: What is the main point?', 1, 1, 3);
SET @Q_new1_7_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_3, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_3, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_3, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_3, N'The topic was sports', 4, 0);
DECLARE @Q_new1_7_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_7, N'[Email & Meetings] Listening extra Q4: What is the main point?', 1, 1, 4);
SET @Q_new1_7_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_4, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_4, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_4, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_4, N'The topic was sports', 4, 0);
DECLARE @Q_new1_7_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_7, N'[Email & Meetings] Listening extra Q5: What is the main point?', 1, 1, 5);
SET @Q_new1_7_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_5, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_5, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_5, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_5, N'The topic was sports', 4, 0);
DECLARE @Q_new1_7_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_7, N'[Email & Meetings] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_new1_7_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_6, N'The topic was sports', 4, 0);
DECLARE @Q_new1_7_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_7, N'[Email & Meetings] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_new1_7_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_7, N'The topic was sports', 4, 0);
DECLARE @Q_new1_7_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_7, N'[Email & Meetings] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_new1_7_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_8, N'The topic was sports', 4, 0);
DECLARE @Q_new1_7_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_7, N'[Email & Meetings] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_new1_7_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_9, N'The topic was sports', 4, 0);
DECLARE @Q_new1_7_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_7, N'[Email & Meetings] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_new1_7_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_7_10, N'The topic was sports', 4, 0);
DECLARE @S_1_8 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Nghe - Xác nhận địa điểm', N'Nghe - Xác nhận địa điểm', 1, 8, NULL, 1
);
SET @S_1_8 = SCOPE_IDENTITY();
DECLARE @Q_new1_8_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_8, N'[Email & Meetings] Listening extra Q1: What is the main point?', 1, 1, 1);
SET @Q_new1_8_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_1, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_1, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_1, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_1, N'The topic was sports', 4, 0);
DECLARE @Q_new1_8_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_8, N'[Email & Meetings] Listening extra Q2: What is the main point?', 1, 1, 2);
SET @Q_new1_8_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_2, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_2, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_2, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_2, N'The topic was sports', 4, 0);
DECLARE @Q_new1_8_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_8, N'[Email & Meetings] Listening extra Q3: What is the main point?', 1, 1, 3);
SET @Q_new1_8_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_3, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_3, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_3, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_3, N'The topic was sports', 4, 0);
DECLARE @Q_new1_8_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_8, N'[Email & Meetings] Listening extra Q4: What is the main point?', 1, 1, 4);
SET @Q_new1_8_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_4, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_4, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_4, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_4, N'The topic was sports', 4, 0);
DECLARE @Q_new1_8_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_8, N'[Email & Meetings] Listening extra Q5: What is the main point?', 1, 1, 5);
SET @Q_new1_8_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_5, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_5, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_5, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_5, N'The topic was sports', 4, 0);
DECLARE @Q_new1_8_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_8, N'[Email & Meetings] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_new1_8_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_6, N'The topic was sports', 4, 0);
DECLARE @Q_new1_8_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_8, N'[Email & Meetings] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_new1_8_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_7, N'The topic was sports', 4, 0);
DECLARE @Q_new1_8_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_8, N'[Email & Meetings] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_new1_8_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_8, N'The topic was sports', 4, 0);
DECLARE @Q_new1_8_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_8, N'[Email & Meetings] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_new1_8_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_9, N'The topic was sports', 4, 0);
DECLARE @Q_new1_8_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_8, N'[Email & Meetings] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_new1_8_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_8_10, N'The topic was sports', 4, 0);
DECLARE @S_1_9 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Đọc - Nội quy phòng họp', N'Đọc - Nội quy phòng họp', 2, 9, NULL, 1
);
SET @S_1_9 = SCOPE_IDENTITY();
DECLARE @Q_new1_9_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_9, N'[Email & Meetings] Reading extra Q1: According to the passage, what should you do?', 1, 1, 1);
SET @Q_new1_9_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_1, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_1, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_1, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_1, N'Delete the document', 4, 0);
DECLARE @Q_new1_9_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_9, N'[Email & Meetings] Reading extra Q2: According to the passage, what should you do?', 1, 1, 2);
SET @Q_new1_9_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_2, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_2, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_2, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_2, N'Delete the document', 4, 0);
DECLARE @Q_new1_9_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_9, N'[Email & Meetings] Reading extra Q3: According to the passage, what should you do?', 1, 1, 3);
SET @Q_new1_9_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_3, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_3, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_3, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_3, N'Delete the document', 4, 0);
DECLARE @Q_new1_9_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_9, N'[Email & Meetings] Reading extra Q4: According to the passage, what should you do?', 1, 1, 4);
SET @Q_new1_9_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_4, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_4, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_4, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_4, N'Delete the document', 4, 0);
DECLARE @Q_new1_9_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_9, N'[Email & Meetings] Reading extra Q5: According to the passage, what should you do?', 1, 1, 5);
SET @Q_new1_9_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_5, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_5, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_5, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_5, N'Delete the document', 4, 0);
DECLARE @Q_new1_9_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_9, N'[Email & Meetings] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_new1_9_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_6, N'Delete the document', 4, 0);
DECLARE @Q_new1_9_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_9, N'[Email & Meetings] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_new1_9_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_7, N'Delete the document', 4, 0);
DECLARE @Q_new1_9_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_9, N'[Email & Meetings] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_new1_9_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_8, N'Delete the document', 4, 0);
DECLARE @Q_new1_9_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_9, N'[Email & Meetings] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_new1_9_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_9, N'Delete the document', 4, 0);
DECLARE @Q_new1_9_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_9, N'[Email & Meetings] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_new1_9_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_9_10, N'Delete the document', 4, 0);
DECLARE @S_1_10 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Đọc - Thông báo thay đổi lịch', N'Đọc - Thông báo thay đổi lịch', 2, 10, NULL, 1
);
SET @S_1_10 = SCOPE_IDENTITY();
DECLARE @Q_new1_10_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_10, N'[Email & Meetings] Reading extra Q1: According to the passage, what should you do?', 1, 1, 1);
SET @Q_new1_10_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_1, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_1, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_1, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_1, N'Delete the document', 4, 0);
DECLARE @Q_new1_10_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_10, N'[Email & Meetings] Reading extra Q2: According to the passage, what should you do?', 1, 1, 2);
SET @Q_new1_10_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_2, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_2, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_2, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_2, N'Delete the document', 4, 0);
DECLARE @Q_new1_10_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_10, N'[Email & Meetings] Reading extra Q3: According to the passage, what should you do?', 1, 1, 3);
SET @Q_new1_10_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_3, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_3, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_3, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_3, N'Delete the document', 4, 0);
DECLARE @Q_new1_10_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_10, N'[Email & Meetings] Reading extra Q4: According to the passage, what should you do?', 1, 1, 4);
SET @Q_new1_10_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_4, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_4, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_4, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_4, N'Delete the document', 4, 0);
DECLARE @Q_new1_10_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_10, N'[Email & Meetings] Reading extra Q5: According to the passage, what should you do?', 1, 1, 5);
SET @Q_new1_10_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_5, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_5, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_5, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_5, N'Delete the document', 4, 0);
DECLARE @Q_new1_10_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_10, N'[Email & Meetings] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_new1_10_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_6, N'Delete the document', 4, 0);
DECLARE @Q_new1_10_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_10, N'[Email & Meetings] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_new1_10_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_7, N'Delete the document', 4, 0);
DECLARE @Q_new1_10_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_10, N'[Email & Meetings] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_new1_10_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_8, N'Delete the document', 4, 0);
DECLARE @Q_new1_10_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_10, N'[Email & Meetings] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_new1_10_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_9, N'Delete the document', 4, 0);
DECLARE @Q_new1_10_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_10, N'[Email & Meetings] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_new1_10_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_10_10, N'Delete the document', 4, 0);
DECLARE @S_1_11 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Từ vựng - Họp trực tuyến', N'Từ vựng - Họp trực tuyến', 3, 11, NULL, 1
);
SET @S_1_11 = SCOPE_IDENTITY();
DECLARE @Q_new1_11_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_11, N'[Email & Meetings] Vocabulary/Grammar extra Q1: Choose the best answer.', 1, 1, 1);
SET @Q_new1_11_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_1, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_1, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_1, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_1, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_11_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_11, N'[Email & Meetings] Vocabulary/Grammar extra Q2: Choose the best answer.', 1, 1, 2);
SET @Q_new1_11_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_2, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_2, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_2, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_2, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_11_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_11, N'[Email & Meetings] Vocabulary/Grammar extra Q3: Choose the best answer.', 1, 1, 3);
SET @Q_new1_11_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_3, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_3, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_3, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_3, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_11_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_11, N'[Email & Meetings] Vocabulary/Grammar extra Q4: Choose the best answer.', 1, 1, 4);
SET @Q_new1_11_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_4, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_4, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_4, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_4, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_11_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_11, N'[Email & Meetings] Vocabulary/Grammar extra Q5: Choose the best answer.', 1, 1, 5);
SET @Q_new1_11_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_5, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_5, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_5, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_5, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_11_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_11, N'[Email & Meetings] Vocabulary/Grammar extra Q6: Choose the best answer.', 1, 1, 6);
SET @Q_new1_11_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_6, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_6, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_6, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_6, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_11_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_11, N'[Email & Meetings] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_new1_11_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_11_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_11, N'[Email & Meetings] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_new1_11_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_11_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_11, N'[Email & Meetings] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_new1_11_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_11_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_11, N'[Email & Meetings] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_new1_11_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_11_10, N'Unrelated phrase', 4, 0);
DECLARE @S_1_12 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_1, N'Ngữ pháp - Email trang trọng', N'Ngữ pháp - Email trang trọng', 3, 12, NULL, 1
);
SET @S_1_12 = SCOPE_IDENTITY();
DECLARE @Q_new1_12_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_12, N'[Email & Meetings] Vocabulary/Grammar extra Q1: Choose the best answer.', 1, 1, 1);
SET @Q_new1_12_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_1, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_1, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_1, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_1, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_12_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_12, N'[Email & Meetings] Vocabulary/Grammar extra Q2: Choose the best answer.', 1, 1, 2);
SET @Q_new1_12_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_2, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_2, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_2, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_2, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_12_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_12, N'[Email & Meetings] Vocabulary/Grammar extra Q3: Choose the best answer.', 1, 1, 3);
SET @Q_new1_12_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_3, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_3, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_3, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_3, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_12_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_12, N'[Email & Meetings] Vocabulary/Grammar extra Q4: Choose the best answer.', 1, 1, 4);
SET @Q_new1_12_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_4, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_4, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_4, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_4, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_12_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_12, N'[Email & Meetings] Vocabulary/Grammar extra Q5: Choose the best answer.', 1, 1, 5);
SET @Q_new1_12_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_5, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_5, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_5, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_5, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_12_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_12, N'[Email & Meetings] Vocabulary/Grammar extra Q6: Choose the best answer.', 1, 1, 6);
SET @Q_new1_12_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_6, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_6, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_6, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_6, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_12_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_12, N'[Email & Meetings] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_new1_12_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_12_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_12, N'[Email & Meetings] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_new1_12_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_12_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_12, N'[Email & Meetings] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_new1_12_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_new1_12_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_1_12, N'[Email & Meetings] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_new1_12_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new1_12_10, N'Unrelated phrase', 4, 0);
DECLARE @QP_2 INT;
SELECT @QP_2 = qp.Question_Path_Id
FROM dbo.Questions_Path qp WHERE qp.BankId = @BankId AND qp.PathId = 2;
DECLARE @S_2_7 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Nghe - Giới thiệu diễn giả', N'Nghe - Giới thiệu diễn giả', 1, 7, NULL, 1
);
SET @S_2_7 = SCOPE_IDENTITY();
DECLARE @Q_new2_7_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_7, N'[Presentations] Listening extra Q1: What is the main point?', 1, 1, 1);
SET @Q_new2_7_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_1, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_1, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_1, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_1, N'The topic was sports', 4, 0);
DECLARE @Q_new2_7_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_7, N'[Presentations] Listening extra Q2: What is the main point?', 1, 1, 2);
SET @Q_new2_7_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_2, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_2, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_2, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_2, N'The topic was sports', 4, 0);
DECLARE @Q_new2_7_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_7, N'[Presentations] Listening extra Q3: What is the main point?', 1, 1, 3);
SET @Q_new2_7_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_3, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_3, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_3, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_3, N'The topic was sports', 4, 0);
DECLARE @Q_new2_7_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_7, N'[Presentations] Listening extra Q4: What is the main point?', 1, 1, 4);
SET @Q_new2_7_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_4, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_4, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_4, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_4, N'The topic was sports', 4, 0);
DECLARE @Q_new2_7_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_7, N'[Presentations] Listening extra Q5: What is the main point?', 1, 1, 5);
SET @Q_new2_7_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_5, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_5, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_5, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_5, N'The topic was sports', 4, 0);
DECLARE @Q_new2_7_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_7, N'[Presentations] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_new2_7_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_6, N'The topic was sports', 4, 0);
DECLARE @Q_new2_7_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_7, N'[Presentations] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_new2_7_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_7, N'The topic was sports', 4, 0);
DECLARE @Q_new2_7_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_7, N'[Presentations] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_new2_7_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_8, N'The topic was sports', 4, 0);
DECLARE @Q_new2_7_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_7, N'[Presentations] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_new2_7_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_9, N'The topic was sports', 4, 0);
DECLARE @Q_new2_7_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_7, N'[Presentations] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_new2_7_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_7_10, N'The topic was sports', 4, 0);
DECLARE @S_2_8 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Nghe - Tóm tắt kết luận', N'Nghe - Tóm tắt kết luận', 1, 8, NULL, 1
);
SET @S_2_8 = SCOPE_IDENTITY();
DECLARE @Q_new2_8_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_8, N'[Presentations] Listening extra Q1: What is the main point?', 1, 1, 1);
SET @Q_new2_8_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_1, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_1, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_1, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_1, N'The topic was sports', 4, 0);
DECLARE @Q_new2_8_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_8, N'[Presentations] Listening extra Q2: What is the main point?', 1, 1, 2);
SET @Q_new2_8_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_2, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_2, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_2, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_2, N'The topic was sports', 4, 0);
DECLARE @Q_new2_8_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_8, N'[Presentations] Listening extra Q3: What is the main point?', 1, 1, 3);
SET @Q_new2_8_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_3, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_3, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_3, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_3, N'The topic was sports', 4, 0);
DECLARE @Q_new2_8_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_8, N'[Presentations] Listening extra Q4: What is the main point?', 1, 1, 4);
SET @Q_new2_8_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_4, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_4, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_4, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_4, N'The topic was sports', 4, 0);
DECLARE @Q_new2_8_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_8, N'[Presentations] Listening extra Q5: What is the main point?', 1, 1, 5);
SET @Q_new2_8_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_5, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_5, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_5, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_5, N'The topic was sports', 4, 0);
DECLARE @Q_new2_8_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_8, N'[Presentations] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_new2_8_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_6, N'The topic was sports', 4, 0);
DECLARE @Q_new2_8_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_8, N'[Presentations] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_new2_8_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_7, N'The topic was sports', 4, 0);
DECLARE @Q_new2_8_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_8, N'[Presentations] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_new2_8_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_8, N'The topic was sports', 4, 0);
DECLARE @Q_new2_8_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_8, N'[Presentations] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_new2_8_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_9, N'The topic was sports', 4, 0);
DECLARE @Q_new2_8_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_8, N'[Presentations] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_new2_8_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_8_10, N'The topic was sports', 4, 0);
DECLARE @S_2_9 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Đọc - Hướng dẫn thuyết trình', N'Đọc - Hướng dẫn thuyết trình', 2, 9, NULL, 1
);
SET @S_2_9 = SCOPE_IDENTITY();
DECLARE @Q_new2_9_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_9, N'[Presentations] Reading extra Q1: According to the passage, what should you do?', 1, 1, 1);
SET @Q_new2_9_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_1, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_1, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_1, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_1, N'Delete the document', 4, 0);
DECLARE @Q_new2_9_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_9, N'[Presentations] Reading extra Q2: According to the passage, what should you do?', 1, 1, 2);
SET @Q_new2_9_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_2, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_2, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_2, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_2, N'Delete the document', 4, 0);
DECLARE @Q_new2_9_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_9, N'[Presentations] Reading extra Q3: According to the passage, what should you do?', 1, 1, 3);
SET @Q_new2_9_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_3, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_3, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_3, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_3, N'Delete the document', 4, 0);
DECLARE @Q_new2_9_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_9, N'[Presentations] Reading extra Q4: According to the passage, what should you do?', 1, 1, 4);
SET @Q_new2_9_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_4, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_4, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_4, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_4, N'Delete the document', 4, 0);
DECLARE @Q_new2_9_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_9, N'[Presentations] Reading extra Q5: According to the passage, what should you do?', 1, 1, 5);
SET @Q_new2_9_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_5, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_5, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_5, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_5, N'Delete the document', 4, 0);
DECLARE @Q_new2_9_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_9, N'[Presentations] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_new2_9_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_6, N'Delete the document', 4, 0);
DECLARE @Q_new2_9_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_9, N'[Presentations] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_new2_9_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_7, N'Delete the document', 4, 0);
DECLARE @Q_new2_9_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_9, N'[Presentations] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_new2_9_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_8, N'Delete the document', 4, 0);
DECLARE @Q_new2_9_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_9, N'[Presentations] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_new2_9_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_9, N'Delete the document', 4, 0);
DECLARE @Q_new2_9_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_9, N'[Presentations] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_new2_9_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_9_10, N'Delete the document', 4, 0);
DECLARE @S_2_10 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Đọc - Mẫu slide báo cáo', N'Đọc - Mẫu slide báo cáo', 2, 10, NULL, 1
);
SET @S_2_10 = SCOPE_IDENTITY();
DECLARE @Q_new2_10_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_10, N'[Presentations] Reading extra Q1: According to the passage, what should you do?', 1, 1, 1);
SET @Q_new2_10_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_1, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_1, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_1, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_1, N'Delete the document', 4, 0);
DECLARE @Q_new2_10_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_10, N'[Presentations] Reading extra Q2: According to the passage, what should you do?', 1, 1, 2);
SET @Q_new2_10_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_2, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_2, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_2, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_2, N'Delete the document', 4, 0);
DECLARE @Q_new2_10_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_10, N'[Presentations] Reading extra Q3: According to the passage, what should you do?', 1, 1, 3);
SET @Q_new2_10_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_3, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_3, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_3, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_3, N'Delete the document', 4, 0);
DECLARE @Q_new2_10_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_10, N'[Presentations] Reading extra Q4: According to the passage, what should you do?', 1, 1, 4);
SET @Q_new2_10_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_4, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_4, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_4, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_4, N'Delete the document', 4, 0);
DECLARE @Q_new2_10_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_10, N'[Presentations] Reading extra Q5: According to the passage, what should you do?', 1, 1, 5);
SET @Q_new2_10_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_5, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_5, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_5, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_5, N'Delete the document', 4, 0);
DECLARE @Q_new2_10_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_10, N'[Presentations] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_new2_10_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_6, N'Delete the document', 4, 0);
DECLARE @Q_new2_10_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_10, N'[Presentations] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_new2_10_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_7, N'Delete the document', 4, 0);
DECLARE @Q_new2_10_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_10, N'[Presentations] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_new2_10_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_8, N'Delete the document', 4, 0);
DECLARE @Q_new2_10_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_10, N'[Presentations] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_new2_10_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_9, N'Delete the document', 4, 0);
DECLARE @Q_new2_10_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_10, N'[Presentations] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_new2_10_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_10_10, N'Delete the document', 4, 0);
DECLARE @S_2_11 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Từ vựng - Visual aids', N'Từ vựng - Visual aids', 3, 11, NULL, 1
);
SET @S_2_11 = SCOPE_IDENTITY();
DECLARE @Q_new2_11_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_11, N'[Presentations] Vocabulary/Grammar extra Q1: Choose the best answer.', 1, 1, 1);
SET @Q_new2_11_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_1, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_1, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_1, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_1, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_11_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_11, N'[Presentations] Vocabulary/Grammar extra Q2: Choose the best answer.', 1, 1, 2);
SET @Q_new2_11_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_2, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_2, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_2, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_2, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_11_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_11, N'[Presentations] Vocabulary/Grammar extra Q3: Choose the best answer.', 1, 1, 3);
SET @Q_new2_11_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_3, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_3, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_3, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_3, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_11_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_11, N'[Presentations] Vocabulary/Grammar extra Q4: Choose the best answer.', 1, 1, 4);
SET @Q_new2_11_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_4, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_4, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_4, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_4, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_11_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_11, N'[Presentations] Vocabulary/Grammar extra Q5: Choose the best answer.', 1, 1, 5);
SET @Q_new2_11_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_5, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_5, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_5, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_5, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_11_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_11, N'[Presentations] Vocabulary/Grammar extra Q6: Choose the best answer.', 1, 1, 6);
SET @Q_new2_11_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_6, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_6, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_6, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_6, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_11_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_11, N'[Presentations] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_new2_11_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_11_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_11, N'[Presentations] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_new2_11_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_11_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_11, N'[Presentations] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_new2_11_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_11_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_11, N'[Presentations] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_new2_11_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_11_10, N'Unrelated phrase', 4, 0);
DECLARE @S_2_12 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_2, N'Ngữ pháp - Thì trong thuyết trình', N'Ngữ pháp - Thì trong thuyết trình', 3, 12, NULL, 1
);
SET @S_2_12 = SCOPE_IDENTITY();
DECLARE @Q_new2_12_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_12, N'[Presentations] Vocabulary/Grammar extra Q1: Choose the best answer.', 1, 1, 1);
SET @Q_new2_12_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_1, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_1, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_1, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_1, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_12_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_12, N'[Presentations] Vocabulary/Grammar extra Q2: Choose the best answer.', 1, 1, 2);
SET @Q_new2_12_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_2, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_2, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_2, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_2, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_12_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_12, N'[Presentations] Vocabulary/Grammar extra Q3: Choose the best answer.', 1, 1, 3);
SET @Q_new2_12_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_3, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_3, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_3, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_3, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_12_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_12, N'[Presentations] Vocabulary/Grammar extra Q4: Choose the best answer.', 1, 1, 4);
SET @Q_new2_12_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_4, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_4, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_4, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_4, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_12_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_12, N'[Presentations] Vocabulary/Grammar extra Q5: Choose the best answer.', 1, 1, 5);
SET @Q_new2_12_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_5, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_5, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_5, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_5, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_12_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_12, N'[Presentations] Vocabulary/Grammar extra Q6: Choose the best answer.', 1, 1, 6);
SET @Q_new2_12_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_6, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_6, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_6, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_6, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_12_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_12, N'[Presentations] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_new2_12_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_12_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_12, N'[Presentations] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_new2_12_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_12_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_12, N'[Presentations] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_new2_12_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_new2_12_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_2_12, N'[Presentations] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_new2_12_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new2_12_10, N'Unrelated phrase', 4, 0);
DECLARE @QP_12 INT;
SELECT @QP_12 = qp.Question_Path_Id
FROM dbo.Questions_Path qp WHERE qp.BankId = @BankId AND qp.PathId = 12;
DECLARE @S_12_7 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Nghe - Chăm sóc khách hàng', N'Nghe - Chăm sóc khách hàng', 1, 7, NULL, 1
);
SET @S_12_7 = SCOPE_IDENTITY();
DECLARE @Q_new12_7_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_7, N'[Business Communication] Listening extra Q1: What is the main point?', 1, 1, 1);
SET @Q_new12_7_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_1, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_1, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_1, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_1, N'The topic was sports', 4, 0);
DECLARE @Q_new12_7_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_7, N'[Business Communication] Listening extra Q2: What is the main point?', 1, 1, 2);
SET @Q_new12_7_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_2, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_2, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_2, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_2, N'The topic was sports', 4, 0);
DECLARE @Q_new12_7_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_7, N'[Business Communication] Listening extra Q3: What is the main point?', 1, 1, 3);
SET @Q_new12_7_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_3, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_3, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_3, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_3, N'The topic was sports', 4, 0);
DECLARE @Q_new12_7_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_7, N'[Business Communication] Listening extra Q4: What is the main point?', 1, 1, 4);
SET @Q_new12_7_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_4, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_4, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_4, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_4, N'The topic was sports', 4, 0);
DECLARE @Q_new12_7_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_7, N'[Business Communication] Listening extra Q5: What is the main point?', 1, 1, 5);
SET @Q_new12_7_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_5, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_5, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_5, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_5, N'The topic was sports', 4, 0);
DECLARE @Q_new12_7_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_7, N'[Business Communication] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_new12_7_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_6, N'The topic was sports', 4, 0);
DECLARE @Q_new12_7_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_7, N'[Business Communication] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_new12_7_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_7, N'The topic was sports', 4, 0);
DECLARE @Q_new12_7_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_7, N'[Business Communication] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_new12_7_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_8, N'The topic was sports', 4, 0);
DECLARE @Q_new12_7_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_7, N'[Business Communication] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_new12_7_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_9, N'The topic was sports', 4, 0);
DECLARE @Q_new12_7_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_7, N'[Business Communication] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_new12_7_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_7_10, N'The topic was sports', 4, 0);
DECLARE @S_12_8 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Nghe - Xử lý khiếu nại', N'Nghe - Xử lý khiếu nại', 1, 8, NULL, 1
);
SET @S_12_8 = SCOPE_IDENTITY();
DECLARE @Q_new12_8_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_8, N'[Business Communication] Listening extra Q1: What is the main point?', 1, 1, 1);
SET @Q_new12_8_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_1, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_1, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_1, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_1, N'The topic was sports', 4, 0);
DECLARE @Q_new12_8_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_8, N'[Business Communication] Listening extra Q2: What is the main point?', 1, 1, 2);
SET @Q_new12_8_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_2, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_2, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_2, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_2, N'The topic was sports', 4, 0);
DECLARE @Q_new12_8_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_8, N'[Business Communication] Listening extra Q3: What is the main point?', 1, 1, 3);
SET @Q_new12_8_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_3, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_3, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_3, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_3, N'The topic was sports', 4, 0);
DECLARE @Q_new12_8_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_8, N'[Business Communication] Listening extra Q4: What is the main point?', 1, 1, 4);
SET @Q_new12_8_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_4, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_4, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_4, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_4, N'The topic was sports', 4, 0);
DECLARE @Q_new12_8_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_8, N'[Business Communication] Listening extra Q5: What is the main point?', 1, 1, 5);
SET @Q_new12_8_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_5, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_5, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_5, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_5, N'The topic was sports', 4, 0);
DECLARE @Q_new12_8_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_8, N'[Business Communication] Listening extra Q6: What is the main point?', 1, 1, 6);
SET @Q_new12_8_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_6, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_6, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_6, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_6, N'The topic was sports', 4, 0);
DECLARE @Q_new12_8_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_8, N'[Business Communication] Listening extra Q7: What is the main point?', 1, 1, 7);
SET @Q_new12_8_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_7, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_7, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_7, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_7, N'The topic was sports', 4, 0);
DECLARE @Q_new12_8_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_8, N'[Business Communication] Listening extra Q8: What is the main point?', 1, 1, 8);
SET @Q_new12_8_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_8, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_8, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_8, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_8, N'The topic was sports', 4, 0);
DECLARE @Q_new12_8_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_8, N'[Business Communication] Listening extra Q9: What is the main point?', 1, 1, 9);
SET @Q_new12_8_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_9, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_9, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_9, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_9, N'The topic was sports', 4, 0);
DECLARE @Q_new12_8_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_8, N'[Business Communication] Listening extra Q10: What is the main point?', 1, 1, 10);
SET @Q_new12_8_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_10, N'The schedule was confirmed', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_10, N'They cancelled everything', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_10, N'Nobody attended', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_8_10, N'The topic was sports', 4, 0);
DECLARE @S_12_9 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Đọc - Chính sách bảo mật', N'Đọc - Chính sách bảo mật', 2, 9, NULL, 1
);
SET @S_12_9 = SCOPE_IDENTITY();
DECLARE @Q_new12_9_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_9, N'[Business Communication] Reading extra Q1: According to the passage, what should you do?', 1, 1, 1);
SET @Q_new12_9_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_1, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_1, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_1, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_1, N'Delete the document', 4, 0);
DECLARE @Q_new12_9_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_9, N'[Business Communication] Reading extra Q2: According to the passage, what should you do?', 1, 1, 2);
SET @Q_new12_9_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_2, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_2, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_2, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_2, N'Delete the document', 4, 0);
DECLARE @Q_new12_9_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_9, N'[Business Communication] Reading extra Q3: According to the passage, what should you do?', 1, 1, 3);
SET @Q_new12_9_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_3, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_3, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_3, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_3, N'Delete the document', 4, 0);
DECLARE @Q_new12_9_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_9, N'[Business Communication] Reading extra Q4: According to the passage, what should you do?', 1, 1, 4);
SET @Q_new12_9_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_4, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_4, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_4, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_4, N'Delete the document', 4, 0);
DECLARE @Q_new12_9_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_9, N'[Business Communication] Reading extra Q5: According to the passage, what should you do?', 1, 1, 5);
SET @Q_new12_9_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_5, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_5, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_5, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_5, N'Delete the document', 4, 0);
DECLARE @Q_new12_9_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_9, N'[Business Communication] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_new12_9_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_6, N'Delete the document', 4, 0);
DECLARE @Q_new12_9_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_9, N'[Business Communication] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_new12_9_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_7, N'Delete the document', 4, 0);
DECLARE @Q_new12_9_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_9, N'[Business Communication] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_new12_9_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_8, N'Delete the document', 4, 0);
DECLARE @Q_new12_9_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_9, N'[Business Communication] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_new12_9_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_9, N'Delete the document', 4, 0);
DECLARE @Q_new12_9_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_9, N'[Business Communication] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_new12_9_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_9_10, N'Delete the document', 4, 0);
DECLARE @S_12_10 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Đọc - Báo giá dịch vụ', N'Đọc - Báo giá dịch vụ', 2, 10, NULL, 1
);
SET @S_12_10 = SCOPE_IDENTITY();
DECLARE @Q_new12_10_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_10, N'[Business Communication] Reading extra Q1: According to the passage, what should you do?', 1, 1, 1);
SET @Q_new12_10_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_1, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_1, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_1, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_1, N'Delete the document', 4, 0);
DECLARE @Q_new12_10_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_10, N'[Business Communication] Reading extra Q2: According to the passage, what should you do?', 1, 1, 2);
SET @Q_new12_10_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_2, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_2, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_2, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_2, N'Delete the document', 4, 0);
DECLARE @Q_new12_10_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_10, N'[Business Communication] Reading extra Q3: According to the passage, what should you do?', 1, 1, 3);
SET @Q_new12_10_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_3, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_3, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_3, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_3, N'Delete the document', 4, 0);
DECLARE @Q_new12_10_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_10, N'[Business Communication] Reading extra Q4: According to the passage, what should you do?', 1, 1, 4);
SET @Q_new12_10_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_4, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_4, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_4, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_4, N'Delete the document', 4, 0);
DECLARE @Q_new12_10_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_10, N'[Business Communication] Reading extra Q5: According to the passage, what should you do?', 1, 1, 5);
SET @Q_new12_10_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_5, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_5, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_5, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_5, N'Delete the document', 4, 0);
DECLARE @Q_new12_10_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_10, N'[Business Communication] Reading extra Q6: According to the passage, what should you do?', 1, 1, 6);
SET @Q_new12_10_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_6, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_6, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_6, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_6, N'Delete the document', 4, 0);
DECLARE @Q_new12_10_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_10, N'[Business Communication] Reading extra Q7: According to the passage, what should you do?', 1, 1, 7);
SET @Q_new12_10_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_7, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_7, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_7, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_7, N'Delete the document', 4, 0);
DECLARE @Q_new12_10_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_10, N'[Business Communication] Reading extra Q8: According to the passage, what should you do?', 1, 1, 8);
SET @Q_new12_10_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_8, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_8, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_8, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_8, N'Delete the document', 4, 0);
DECLARE @Q_new12_10_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_10, N'[Business Communication] Reading extra Q9: According to the passage, what should you do?', 1, 1, 9);
SET @Q_new12_10_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_9, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_9, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_9, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_9, N'Delete the document', 4, 0);
DECLARE @Q_new12_10_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_10, N'[Business Communication] Reading extra Q10: According to the passage, what should you do?', 1, 1, 10);
SET @Q_new12_10_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_10, N'Follow the written instructions', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_10, N'Ignore the deadline', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_10, N'Skip the meeting', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_10_10, N'Delete the document', 4, 0);
DECLARE @S_12_11 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Từ vựng - Hợp đồng thương mại', N'Từ vựng - Hợp đồng thương mại', 3, 11, NULL, 1
);
SET @S_12_11 = SCOPE_IDENTITY();
DECLARE @Q_new12_11_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_11, N'[Business Communication] Vocabulary/Grammar extra Q1: Choose the best answer.', 1, 1, 1);
SET @Q_new12_11_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_1, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_1, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_1, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_1, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_11_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_11, N'[Business Communication] Vocabulary/Grammar extra Q2: Choose the best answer.', 1, 1, 2);
SET @Q_new12_11_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_2, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_2, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_2, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_2, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_11_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_11, N'[Business Communication] Vocabulary/Grammar extra Q3: Choose the best answer.', 1, 1, 3);
SET @Q_new12_11_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_3, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_3, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_3, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_3, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_11_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_11, N'[Business Communication] Vocabulary/Grammar extra Q4: Choose the best answer.', 1, 1, 4);
SET @Q_new12_11_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_4, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_4, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_4, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_4, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_11_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_11, N'[Business Communication] Vocabulary/Grammar extra Q5: Choose the best answer.', 1, 1, 5);
SET @Q_new12_11_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_5, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_5, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_5, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_5, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_11_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_11, N'[Business Communication] Vocabulary/Grammar extra Q6: Choose the best answer.', 1, 1, 6);
SET @Q_new12_11_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_6, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_6, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_6, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_6, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_11_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_11, N'[Business Communication] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_new12_11_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_11_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_11, N'[Business Communication] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_new12_11_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_11_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_11, N'[Business Communication] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_new12_11_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_11_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_11, N'[Business Communication] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_new12_11_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_11_10, N'Unrelated phrase', 4, 0);
DECLARE @S_12_12 INT;
INSERT INTO dbo.Question_Sections (
  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
) VALUES (
  @QP_12, N'Ngữ pháp - Điều kiện trong hợp đồng', N'Ngữ pháp - Điều kiện trong hợp đồng', 3, 12, NULL, 1
);
SET @S_12_12 = SCOPE_IDENTITY();
DECLARE @Q_new12_12_1 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_12, N'[Business Communication] Vocabulary/Grammar extra Q1: Choose the best answer.', 1, 1, 1);
SET @Q_new12_12_1 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_1, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_1, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_1, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_1, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_12_2 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_12, N'[Business Communication] Vocabulary/Grammar extra Q2: Choose the best answer.', 1, 1, 2);
SET @Q_new12_12_2 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_2, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_2, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_2, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_2, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_12_3 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_12, N'[Business Communication] Vocabulary/Grammar extra Q3: Choose the best answer.', 1, 1, 3);
SET @Q_new12_12_3 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_3, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_3, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_3, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_3, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_12_4 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_12, N'[Business Communication] Vocabulary/Grammar extra Q4: Choose the best answer.', 1, 1, 4);
SET @Q_new12_12_4 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_4, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_4, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_4, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_4, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_12_5 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_12, N'[Business Communication] Vocabulary/Grammar extra Q5: Choose the best answer.', 1, 1, 5);
SET @Q_new12_12_5 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_5, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_5, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_5, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_5, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_12_6 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_12, N'[Business Communication] Vocabulary/Grammar extra Q6: Choose the best answer.', 1, 1, 6);
SET @Q_new12_12_6 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_6, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_6, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_6, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_6, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_12_7 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_12, N'[Business Communication] Vocabulary/Grammar extra Q7: Choose the best answer.', 1, 1, 7);
SET @Q_new12_12_7 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_7, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_7, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_7, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_7, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_12_8 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_12, N'[Business Communication] Vocabulary/Grammar extra Q8: Choose the best answer.', 1, 1, 8);
SET @Q_new12_12_8 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_8, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_8, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_8, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_8, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_12_9 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_12, N'[Business Communication] Vocabulary/Grammar extra Q9: Choose the best answer.', 1, 1, 9);
SET @Q_new12_12_9 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_9, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_9, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_9, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_9, N'Unrelated phrase', 4, 0);
DECLARE @Q_new12_12_10 INT;
INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])
VALUES (@S_12_12, N'[Business Communication] Vocabulary/Grammar extra Q10: Choose the best answer.', 1, 1, 10);
SET @Q_new12_12_10 = SCOPE_IDENTITY();
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_10, N'Correct business expression', 1, 1);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_10, N'Wrong collocation', 2, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_10, N'Informal slang only', 3, 0);
INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
VALUES (@Q_new12_12_10, N'Unrelated phrase', 4, 0);