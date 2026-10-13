/**
 * Apply drop-test-config-random-section-columns.sql via Node (no sqlcmd required).
 */
require('dotenv').config({ override: true });
const fs = require('fs');
const path = require('path');
const { sql, connectDB } = require('../config/db');

async function main() {
  await connectDB();
  const scriptPath = path.join(__dirname, 'drop-test-config-random-section-columns.sql');
  const raw = fs.readFileSync(scriptPath, 'utf8');
  const batches = raw
    .split(/^\s*GO\s*$/gim)
    .map((batch) => batch.replace(/^\s*USE\s+\[LearningPath_Base\];\s*$/gim, '').trim())
    .filter((batch) => batch && !batch.startsWith('PRINT'));

  for (const batch of batches) {
    await sql.query(batch);
  }

  const cols = await sql.query(`
    SELECT c.name
    FROM sys.columns c
    WHERE c.object_id = OBJECT_ID('dbo.Test_Config')
    ORDER BY c.column_id
  `);
  console.log('Test_Config columns:', cols.recordset.map((r) => r.name).join(', '));
  await sql.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
