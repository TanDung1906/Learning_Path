-- Test_Config_Section: cấu hình kỹ năng độc lập ngân hàng câu hỏi.
--   TypeId 1/2 (Nghe/Đọc): SectionPickCount = số section random lấy
--   TypeId 3 (Từ vựng/Ngữ pháp): SectionName + QuestionQuantity
-- Idempotent — safe to re-run.

USE [LearningPath_Base];
GO

IF COL_LENGTH('dbo.Test_Config_Section', 'TypeId') IS NULL
    ALTER TABLE dbo.Test_Config_Section ADD TypeId INT NULL;
GO

IF COL_LENGTH('dbo.Test_Config_Section', 'SectionName') IS NULL
    ALTER TABLE dbo.Test_Config_Section ADD SectionName NVARCHAR(200) NULL;
GO

IF COL_LENGTH('dbo.Test_Config_Section', 'SectionPickCount') IS NULL
    ALTER TABLE dbo.Test_Config_Section ADD SectionPickCount INT NULL;
GO

IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Test_Config_Section')
      AND name = N'QuestionQuantity'
      AND is_nullable = 0
)
    ALTER TABLE dbo.Test_Config_Section ALTER COLUMN QuestionQuantity INT NULL;
GO

IF COL_LENGTH('dbo.Test_Config_Section', 'BankSectionId') IS NOT NULL
BEGIN
    EXEC(N'
    UPDATE cs
    SET
        TypeId = qs.TypeId,
        SectionName = CASE
            WHEN qs.TypeId = 3 THEN COALESCE(NULLIF(LTRIM(RTRIM(qs.Title)), N''''), qs.SectionName)
            ELSE NULL
        END,
        SectionPickCount = CASE
            WHEN qs.TypeId IN (1, 2) THEN cs.QuestionQuantity
            ELSE NULL
        END,
        QuestionQuantity = CASE
            WHEN qs.TypeId = 3 THEN cs.QuestionQuantity
            ELSE NULL
        END
    FROM dbo.Test_Config_Section cs
    INNER JOIN dbo.Question_Sections qs ON qs.SectionId = cs.BankSectionId
    WHERE cs.BankSectionId IS NOT NULL;

    DECLARE @fkName NVARCHAR(256);
    SELECT @fkName = fk.name
    FROM sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
    INNER JOIN sys.columns c ON c.object_id = fkc.parent_object_id AND c.column_id = fkc.parent_column_id
    WHERE fk.parent_object_id = OBJECT_ID(N''dbo.Test_Config_Section'')
      AND c.name = N''BankSectionId'';

    IF @fkName IS NOT NULL
        EXEC(N''ALTER TABLE dbo.Test_Config_Section DROP CONSTRAINT ['' + @fkName + N'']'');

    IF EXISTS (
        SELECT 1 FROM sys.indexes
        WHERE object_id = OBJECT_ID(N''dbo.Test_Config_Section'')
          AND name = N''UQ_Test_ConfigSec_Config_Bank''
    )
        ALTER TABLE dbo.Test_Config_Section DROP CONSTRAINT UQ_Test_ConfigSec_Config_Bank;

    IF EXISTS (
        SELECT 1 FROM sys.indexes
        WHERE object_id = OBJECT_ID(N''dbo.Test_Config_Section'')
          AND name = N''IX_Test_Config_Section_BankSectionId''
    )
        DROP INDEX IX_Test_Config_Section_BankSectionId ON dbo.Test_Config_Section;

    ALTER TABLE dbo.Test_Config_Section DROP COLUMN BankSectionId;
    ');
END
GO

-- Dữ liệu cũ không migrate được (BankSectionId đã mất): xóa row mồ côi.
DELETE FROM dbo.Test_Config_Section
WHERE TypeId IS NULL
  AND SectionPickCount IS NULL
  AND (SectionName IS NULL OR LTRIM(RTRIM(SectionName)) = N'');
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Test_Config_Section')
      AND name = N'UQ_Test_ConfigSec_Config_Type_Order'
)
BEGIN
    CREATE UNIQUE INDEX UQ_Test_ConfigSec_Config_Type_Order
        ON dbo.Test_Config_Section (ConfigId, TypeId, SectionOrder);
END
GO

IF EXISTS (
    SELECT 1 FROM dbo.Test_Config_Section WHERE TypeId IS NULL
)
    RAISERROR(N'Còn row Test_Config_Section chưa có TypeId — cần xử lý thủ công trước khi ALTER NOT NULL.', 16, 1);
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
BEGIN
    IF EXISTS (
        SELECT 1 FROM sys.indexes
        WHERE object_id = OBJECT_ID(N'dbo.Test_Config_Section')
          AND name = N'UQ_Test_ConfigSec_Config_Type_Order'
    )
        DROP INDEX UQ_Test_ConfigSec_Config_Type_Order ON dbo.Test_Config_Section;

    ALTER TABLE dbo.Test_Config_Section ALTER COLUMN TypeId INT NOT NULL;

    CREATE UNIQUE INDEX UQ_Test_ConfigSec_Config_Type_Order
        ON dbo.Test_Config_Section (ConfigId, TypeId, SectionOrder);
END
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
    (SELECT SUM(
        CASE
            WHEN cs.TypeId IN (1, 2) THEN ISNULL(cs.SectionPickCount, 0)
            ELSE ISNULL(cs.QuestionQuantity, 0)
        END
     ) FROM dbo.Test_Config_Section cs WHERE cs.[ConfigId] = tc.[ConfigId]) AS [TotalQuestionQuota]
FROM dbo.Tests t
LEFT JOIN dbo.Test_Pass_Config pc ON pc.[TestId] = t.[TestId]
LEFT JOIN dbo.Test_Config tc ON tc.[TestId] = t.[TestId];
GO

PRINT 'OK: migrate-test-config-section-decouple-bank';
GO
