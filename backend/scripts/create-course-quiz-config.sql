-- Bài kiểm tra toàn khóa: Tests.IsCourseTest = 1, PathId = NULL
-- Chương được chọn: Test_Course_Chapters
-- Section từ vựng đa chương: Test_Config_Section.PathId

IF OBJECT_ID(N'dbo.Test_Course_Chapters', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Test_Course_Chapters (
        TestId INT NOT NULL,
        PathId INT NOT NULL,
        CONSTRAINT PK_Test_Course_Chapters PRIMARY KEY (TestId, PathId),
        CONSTRAINT FK_Test_Course_Chapters_Test
            FOREIGN KEY (TestId) REFERENCES dbo.Tests(TestId)
    );

    CREATE INDEX IX_Test_Course_Chapters_PathId
        ON dbo.Test_Course_Chapters (PathId);
END;

IF COL_LENGTH('dbo.Test_Config_Section', 'PathId') IS NULL
BEGIN
    ALTER TABLE dbo.Test_Config_Section
    ADD PathId INT NULL;
END;
