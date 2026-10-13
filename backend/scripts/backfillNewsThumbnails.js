/**
 * Backfill Thumbnail cho bài viết seed (chạy một lần):
 *   node scripts/backfillNewsThumbnails.js
 */
const { sql, connectDB } = require('../config/db');
const { DEFAULT_THUMBNAILS_BY_ID, localNewsThumbnailExists } = require('../utils/newsThumbnailResolver');

async function backfillNewsThumbnails() {
  await connectDB();

  const result = await new sql.Request().query(`
    SELECT [NewsId] AS newsId, [Thumbnail] AS thumbnail
    FROM [dbo].[News]
  `);

  let updated = 0;
  for (const row of result.recordset) {
    const newsId = row.newsId;
    const current = String(row.thumbnail ?? '').trim();
    const fallback = DEFAULT_THUMBNAILS_BY_ID[Number(newsId)];

    let nextThumbnail = current;

    if (current && !localNewsThumbnailExists(current)) {
      nextThumbnail = fallback || null;
    } else if (!current && fallback) {
      nextThumbnail = fallback;
    }

    if (nextThumbnail === current) continue;

    const req = new sql.Request();
    req.input('newsId', sql.Int, newsId);
    req.input('thumbnail', sql.NVarChar(500), nextThumbnail || null);
    await req.query(`
      UPDATE [dbo].[News]
      SET [Thumbnail] = @thumbnail, [UpdatedAt] = GETDATE()
      WHERE [NewsId] = @newsId
    `);
    updated += 1;
    console.log(`News #${newsId}: ${current || '(empty)'} -> ${nextThumbnail || '(empty)'}`);
  }

  console.log(`Done. Updated ${updated} article(s).`);
  process.exit(0);
}

backfillNewsThumbnails().catch((err) => {
  console.error('Backfill failed:', err.message);
  process.exit(1);
});
