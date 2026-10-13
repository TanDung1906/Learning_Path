-- DO NOT RUN until backend API saves quiz config to DB.
--
-- Current app state (2026-07):
--   MentorChapterQuizSetupDialog -> chapterQuizConfigService -> localStorage only
--   Key: mentor_chapter_quiz_configs_v1 / {courseId}_{chapterId}
--   Course quiz uses chapterId = "__course__"
--
-- dbcd.sql Tests* tables are NOT wired to the UI yet.
-- Running constraints here broke DB without changing app behavior.
--
-- When implementing API, map UI config like this:
--   Tests              : 1 row per chapter quiz OR 1 course quiz per course
--                        HasPrerequisite = 1 when Test_Prerequisites has rows
--   Test_Prerequisites : TestId -> PrerequisiteTestId (join check khi HasPrerequisite = 1)
--   Test_Config        : DurationMinutes, MaxAttempts, UpdatedBy, UpdatedAt
--   Test_Pass_Config   : MinPassScore (= passingScore)
--   Test_Config_Section : TypeId + QuestionQuantity (Nghe/Đọc: số section; Từ vựng/Ngữ pháp: số câu) + BankSectionId (chỉ TypeId=3)
--       Không tham chiếu Question_Sections — ngân hàng câu hỏi độc lập, resolve lúc runtime.
--
-- Until then use rollback-tests-ui-migration.sql to undo partial runs.

PRINT 'migrate-tests-one-per-chapter.sql is disabled. See file header.';
GO
