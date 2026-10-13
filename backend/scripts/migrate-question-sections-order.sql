/*
  Chuẩn hóa [Order] trong dbo.Question_Sections:
  - Trong cùng (Question_Path_Id, TypeId), [Order] phải duy nhất và tăng 1, 2, 3...
  - Thêm UNIQUE INDEX (Question_Path_Id, TypeId, [Order])
*/

SET NOCOUNT ON;

BEGIN TRANSACTION;

;WITH ranked AS (
    SELECT
        qs.SectionId,
        ROW_NUMBER() OVER (
            PARTITION BY qs.Question_Path_Id, qs.TypeId
            ORDER BY qs.[Order], qs.SectionId
        ) AS NewOrder
    FROM dbo.Question_Sections qs
)
UPDATE qs
SET qs.[Order] = r.NewOrder
FROM dbo.Question_Sections qs
INNER JOIN ranked r ON r.SectionId = qs.SectionId;

IF EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'UQ_Question_Sections_Path_Type_Order'
      AND object_id = OBJECT_ID(N'dbo.Question_Sections')
)
BEGIN
    DROP INDEX UQ_Question_Sections_Path_Type_Order ON dbo.Question_Sections;
END

CREATE UNIQUE INDEX UQ_Question_Sections_Path_Type_Order
ON dbo.Question_Sections (Question_Path_Id, TypeId, [Order]);

COMMIT TRANSACTION;
