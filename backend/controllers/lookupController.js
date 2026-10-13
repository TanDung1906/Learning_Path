const { sql } = require('../config/db');

const getCategories = async (_req, res) => {
  try {
    const result = await new sql.Request().query(`
      SELECT CategoryId AS categoryId, DisplayName AS displayName
      FROM Categories
      WHERE IsActive = 1
      ORDER BY DisplayName
    `);

    return res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('[GetCategories Error]', err.message);
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách danh mục.',
    });
  }
};

const getLevels = async (_req, res) => {
  try {
    const result = await new sql.Request().query(`
      SELECT LevelId AS levelId, DisplayName AS displayName
      FROM Levels
      WHERE IsActive = 1
      ORDER BY SortOrder ASC
    `);

    return res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('[GetLevels Error]', err.message);
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách trình độ.',
    });
  }
};

module.exports = { getCategories, getLevels };
