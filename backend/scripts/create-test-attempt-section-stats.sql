-- Thống kê section/chương theo từng lượt làm bài (phục vụ đề xuất câu hỏi bài test toàn khóa)
IF OBJECT_ID(N'dbo.Test_Attempt_Section_Stats', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Test_Attempt_Section_Stats (
        AttemptSectionStatId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        AttemptId            INT NOT NULL,
        CourseId             INT NOT NULL,
        PathId               INT NOT NULL,
        TypeId               INT NOT NULL,
        SkillType            VARCHAR(20) NOT NULL,
        SectionId            INT NOT NULL,
        SectionTitle         NVARCHAR(255) NULL,
        CorrectCount         INT NOT NULL CONSTRAINT DF_TestAttemptSectionStats_Correct DEFAULT (0),
        WrongCount           INT NOT NULL CONSTRAINT DF_TestAttemptSectionStats_Wrong DEFAULT (0),
        TotalCount           INT NOT NULL CONSTRAINT DF_TestAttemptSectionStats_Total DEFAULT (0),
        CreatedAt            DATETIME2 NOT NULL CONSTRAINT DF_TestAttemptSectionStats_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_TestAttemptSectionStats_Attempt
            FOREIGN KEY (AttemptId) REFERENCES dbo.Test_Attempts(AttemptId)
    );

    CREATE INDEX IX_TestAttemptSectionStats_Attempt
        ON dbo.Test_Attempt_Section_Stats (AttemptId);

    CREATE INDEX IX_TestAttemptSectionStats_Recommendation
        ON dbo.Test_Attempt_Section_Stats (AttemptId, PathId, TypeId, SectionId);
END;
