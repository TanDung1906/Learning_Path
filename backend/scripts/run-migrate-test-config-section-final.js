require('dotenv').config({ override: true });
const fs = require('fs');
const path = require('path');
const { sql, connectDB } = require('../config/db');

async function main() {
  await connectDB();
  const scriptPath = path.join(__dirname, 'migrate-test-config-section-final.sql');
  const raw = fs.readFileSync(scriptPath, 'utf8');
  const batches = raw
    .split(/^\s*GO\s*$/gim)
    .map((batch) => batch.replace(/^\s*USE\s+\[LearningPath_Base\];\s*$/gim, '').trim())
    .filter((batch) => batch && !batch.startsWith('PRINT'));

  for (const batch of batches) {
    await sql.query(batch);
  }

  const cols = await sql.query(`
    SELECT c.name, c.is_nullable
    FROM sys.columns c
    WHERE c.object_id = OBJECT_ID('dbo.Test_Config_Section')
    ORDER BY c.column_id
  `);
  const rows = await sql.query('SELECT * FROM dbo.Test_Config_Section ORDER BY ConfigId, TypeId, ConfigSectionId');
  console.log('Columns:', cols.recordset.map((r) => `${r.name}${r.is_nullable ? '' : '*'}`).join(', '));
  console.log('Rows:', JSON.stringify(rows.recordset, null, 2));
  await sql.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
