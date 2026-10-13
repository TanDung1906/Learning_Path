-- Test_Config_Section — schema cuối:
--   TypeId 1/2 (Nghe/Đọc): QuestionQuantity = số section lấy, BankSectionId = NULL
--   TypeId 3 (Từ vựng/Ngữ pháp): BankSectionId = section ngân hàng, QuestionQuantity = số câu
-- Idempotent — safe to re-run.

USE [LearningPath_Base];
GO

IF COL_LENGTH('dbo.Test_Config_Section', 'TypeId') IS NULL
    ALTER TABLE dbo.Test_Config_Section ADD TypeId INT NULL;
GO

IF COL_LENGTH('dbo.Test_Config_Section', 'BankSectionId') IS NULL
    ALTER TABLE dbo.Test_Config_Section ADD BankSectionId INT NULL;
GO

IF COL_LENGTH('dbo.Test_Config_Section', 'SectionPickCount') IS NOT NULL
BEGIN
    EXEC(N'
    UPDATE dbo.Test_Config_Section
    SET QuestionQuantity = SectionPickCount
    WHERE TypeId IN (1, 2)
      AND SectionPickCount IS NOT NULL;
    ALTER TABLE dbo.Test_Config_Section DROP COLUMN SectionPickCount;
    ');
END
GO

IF COL_LENGTH('dbo.Test_Config_Section', 'SectionName') IS NOT NULL
BEGIN
    EXEC(N'
    UPDATE cs
    SET
        TypeId = COALESCE(cs.TypeId, qs.TypeId, 3),
        BankSectionId = qs.SectionId,
        QuestionQuantity = COALESCE(cs.QuestionQuantity, 0)
    FROM dbo.Test_Config_Section cs
    INNER JOIN dbo.Question_Sections qs
        ON qs.TypeId = 3
       AND (
            LTRIM(RTRIM(COALESCE(qs.Title, N''''))) = LTRIM(RTRIM(COALESCE(cs.SectionName, N'''')))
         OR LTRIM(RTRIM(COALESCE(qs.SectionName, N''''))) = LTRIM(RTRIM(COALESCE(cs.SectionName, N'''')))
       )
    WHERE cs.SectionName IS NOT NULL
      AND LTRIM(RTRIM(cs.SectionName)) <> N'''';
    ALTER TABLE dbo.Test_Config_Section DROP COLUMN SectionName;
    ');
END
GO

IF EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Test_Config_Section')
      AND name = N'UQ_Test_ConfigSec_Config_Type_Order'
)
    DROP INDEX UQ_Test_ConfigSec_Config_Type_Order ON dbo.Test_Config_Section;
GO

IF COL_LENGTH('dbo.Test_Config_Section', 'SectionOrder') IS NOT NULL
    ALTER TABLE dbo.Test_Config_Section DROP COLUMN SectionOrder;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = N'FK_Test_Config_Section_BankSection'
)
AND COL_LENGTH('dbo.Test_Config_Section', 'BankSectionId') IS NOT NULL
BEGIN
    ALTER TABLE dbo.Test_Config_Section WITH NOCHECK
        ADD CONSTRAINT FK_Test_Config_Section_BankSection
        FOREIGN KEY (BankSectionId) REFERENCES dbo.Question_Sections (SectionId);
    ALTER TABLE dbo.Test_Config_Section CHECK CONSTRAINT FK_Test_Config_Section_BankSection;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Test_Config_Section')
      AND name = N'UQ_Test_ConfigSec_Config_Bank'
)
BEGIN
    CREATE UNIQUE INDEX UQ_Test_ConfigSec_Config_Bank
        ON dbo.Test_Config_Section (ConfigId, BankSectionId)
        WHERE BankSectionId IS NOT NULL;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Test_Config_Section')
      AND name = N'UQ_Test_ConfigSec_Config_Type'
)
BEGIN
    CREATE UNIQUE INDEX UQ_Test_ConfigSec_Config_Type
        ON dbo.Test_Config_Section (ConfigId, TypeId)
        WHERE BankSectionId IS NULL;
END
GO

IF EXISTS (
    SELECT 1 FROM dbo.Test_Config_Section WHERE TypeId IS NULL
)
    RAISERROR(N'Còn row Test_Config_Section chưa có TypeId.', 16, 1);
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Test_Config_Section WHERE TypeId IS NULL
)
AND EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Test_Config_Section')
      AND name = N'TypeId'
      AND is_nullable = 1
)
    ALTER TABLE dbo.Test_Config_Section ALTER COLUMN TypeId INT NOT NULL;
GO

IF OBJECT_ID(N'dbo.vw_Test_Config_Summary', N'V') IS NOT NULL
    DROP VIEW dbo.vw_Test_Config_Summary;
GO

CREATE VIEW dbo.vw_Test_Config_Summary
AS
SELECT
    t.[TestId],
    t.[TestName],
    t.[CourseId],
    t.[PathId],
    t.[TestOrder],
    t.[IsCourseTest],
    t.[HasPrerequisite],
    (SELECT COUNT(*) FROM dbo.Test_Prerequisites tp WHERE tp.[TestId] = t.[TestId]) AS [PrerequisiteCount],
    pc.[MinPassScore],
    tc.[ConfigId],
    tc.[DurationMinutes],
    tc.[MaxAttempts],
    tc.[UpdatedBy],
    tc.[UpdatedAt],
    (SELECT COUNT(*) FROM dbo.Test_Config_Section cs WHERE cs.[ConfigId] = tc.[ConfigId]) AS [ConfigSectionCount],
    (SELECT COUNT(*) FROM dbo.Test_Questions_Sections tqs WHERE tqs.[TestId] = t.[TestId]) AS [MaterializedSectionCount],
    (SELECT COUNT(*) FROM dbo.Test_Questions tq
        INNER JOIN dbo.Test_Questions_Sections tqs ON tqs.[SectionId] = tq.[SectionId]
        WHERE tqs.[TestId] = t.[TestId]) AS [MaterializedQuestionCount],
    (SELECT SUM(ISNULL(cs.QuestionQuantity, 0))
     FROM dbo.Test_Config_Section cs WHERE cs.[ConfigId] = tc.[ConfigId]) AS [TotalQuestionQuota]
FROM dbo.Tests t
LEFT JOIN dbo.Test_Pass_Config pc ON pc.[TestId] = t.[TestId]
LEFT JOIN dbo.Test_Config tc ON tc.[TestId] = t.[TestId];
GO

PRINT 'OK: migrate-test-config-section-final';
GO
