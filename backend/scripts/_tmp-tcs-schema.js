require('dotenv').config({ override: true });
const { sql, connectDB } = require('../config/db');
(async () => {
  await connectDB();
  const r = await sql.query(`
    SELECT c.name, t.name AS dataType
    FROM sys.columns c
    JOIN sys.types t ON c.user_type_id = t.user_type_id
    WHERE c.object_id = OBJECT_ID('dbo.Test_Config_Section')
    ORDER BY c.column_id;

    SELECT cs.*, qs.TypeId, qs.SectionName, qs.Title
    FROM dbo.Test_Config_Section cs
    LEFT JOIN dbo.Question_Sections qs ON qs.SectionId = cs.BankSectionId;
  `);
  console.log(JSON.stringify(r.recordsets, null, 2));
  await sql.close();
})();
