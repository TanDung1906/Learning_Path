-- Path_Nodes.IsActive: 1 = hiển thị cho học viên, 0 = ẩn
IF COL_LENGTH('dbo.Path_Nodes', 'IsActive') IS NULL
BEGIN
    ALTER TABLE dbo.Path_Nodes
    ADD IsActive BIT NOT NULL
        CONSTRAINT DF_Path_Nodes_IsActive DEFAULT (1);
END
GO

UPDATE dbo.Path_Nodes
SET IsActive = 1
WHERE IsActive IS NULL;
GO
