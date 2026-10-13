-- Paths.IsActive: 1 = hiển thị cho học viên, 0 = ẩn
IF COL_LENGTH('dbo.Paths', 'IsActive') IS NULL
BEGIN
    ALTER TABLE dbo.Paths
    ADD IsActive BIT NOT NULL
        CONSTRAINT DF_Paths_IsActive DEFAULT (1);
END
GO

UPDATE dbo.Paths
SET IsActive = 1
WHERE IsActive IS NULL;
GO
