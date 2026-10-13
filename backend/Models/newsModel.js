const { sql } = require('../config/db');

const SORT_SQL = {
  newest: 'COALESCE(n.[PublishedAt], n.[CreatedAt]) DESC, n.[NewsId] DESC',
  oldest: 'COALESCE(n.[PublishedAt], n.[CreatedAt]) ASC, n.[NewsId] ASC',
  title_asc: 'n.[Title] ASC, n.[NewsId] DESC',
  title_desc: 'n.[Title] DESC, n.[NewsId] DESC',
};

function resolveOrderBy(sort) {
  return SORT_SQL[sort] || SORT_SQL.newest;
}

const NewsModel = {
  /**
   * Lấy danh sách bài viết (có phân trang + filter + sort)
   * @param {string|null} status — null = không filter status (admin all)
   */
  async getNewsList({ status, categoryId, search, page = 1, pageSize = 10, sort = 'newest' }) {
    const offset = (page - 1) * pageSize;

    let whereClauses = ['1=1'];
    const inputs = [];

    if (status) {
      whereClauses.push('n.Status = @status');
      inputs.push({ name: 'status', type: sql.VarChar(20), value: status });
    }
    // Nếu status là null/undefined, không thêm WHERE cho Status (lấy tất cả)

    if (categoryId) {
      whereClauses.push('n.CategoryId = @categoryId');
      inputs.push({ name: 'categoryId', type: sql.Int, value: parseInt(categoryId, 10) });
    }

    if (search) {
      whereClauses.push('(n.Title LIKE @search OR n.Excerpt LIKE @search)');
      inputs.push({ name: 'search', type: sql.NVarChar(260), value: `%${search}%` });
    }

    const whereSQL = whereClauses.join(' AND ');
    const orderBySQL = resolveOrderBy(sort);

    const countReq = new sql.Request();
    inputs.forEach(({ name, type, value }) => countReq.input(name, type, value));
    const countResult = await countReq.query(`
      SELECT COUNT(*) AS total
      FROM [dbo].[News] n
      WHERE ${whereSQL}
    `);
    const total = countResult.recordset[0].total;

    const dataReq = new sql.Request();
    inputs.forEach(({ name, type, value }) => dataReq.input(name, type, value));
    dataReq.input('offset', sql.Int, offset);
    dataReq.input('pageSize', sql.Int, pageSize);

    const dataResult = await dataReq.query(`
      SELECT
        n.[NewsId] AS newsId,
        n.[Title] AS title,
        n.[CategoryId] AS categoryId,
        c.[DisplayName] AS categoryName,
        n.[Status] AS status,
        n.[Author] AS author,
        n.[Excerpt] AS excerpt,
        n.[Thumbnail] AS thumbnail,
        n.[PublishedAt] AS publishedAt,
        n.[UpdatedAt] AS updatedAt,
        n.[CreatedAt] AS createdAt,
        n.[CreatedBy] AS createdBy,
        u.[FullName] AS createdByName
      FROM [dbo].[News] n
      LEFT JOIN [dbo].[Categories] c ON c.[CategoryId] = n.[CategoryId]
      LEFT JOIN [dbo].[Users] u ON u.[UserId] = n.[CreatedBy]
      WHERE ${whereSQL}
      ORDER BY ${orderBySQL}
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `);

    return { data: dataResult.recordset, total };
  },

  /**
   * Lấy chi tiết bài viết theo ID
   */
  async getNewsById(newsId) {
    const req = new sql.Request();
    req.input('newsId', sql.Int, newsId);
    const result = await req.query(`
      SELECT
        n.[NewsId] AS newsId,
        n.[Title] AS title,
        n.[CategoryId] AS categoryId,
        c.[DisplayName] AS categoryName,
        n.[Status] AS status,
        n.[Author] AS author,
        n.[Excerpt] AS excerpt,
        n.[Content] AS content,
        n.[Thumbnail] AS thumbnail,
        n.[PublishedAt] AS publishedAt,
        n.[UpdatedAt] AS updatedAt,
        n.[CreatedAt] AS createdAt,
        n.[CreatedBy] AS createdBy,
        u.[FullName] AS createdByName
      FROM [dbo].[News] n
      LEFT JOIN [dbo].[Categories] c ON c.[CategoryId] = n.[CategoryId]
      LEFT JOIN [dbo].[Users] u ON u.[UserId] = n.[CreatedBy]
      WHERE n.[NewsId] = @newsId
    `);
    return result.recordset[0] || null;
  },

  /**
   * Tạo bài viết mới
   */
  async createNews({ title, categoryId, status, author, excerpt, content, thumbnail, publishedAt, createdBy }) {
    const req = new sql.Request();
    req.input('title', sql.NVarChar(255), title);
    req.input('categoryId', sql.Int, categoryId || null);
    req.input('status', sql.VarChar(20), status || 'DRAFT');
    req.input('author', sql.NVarChar(100), author || null);
    req.input('excerpt', sql.NVarChar(500), excerpt || null);
    req.input('content', sql.NVarChar(sql.MAX), content || null);
    req.input('thumbnail', sql.NVarChar(500), thumbnail || null);
    req.input('publishedAt', sql.DateTime, publishedAt || null);
    req.input('createdBy', sql.Int, createdBy || null);

    const result = await req.query(`
      INSERT INTO [dbo].[News] ([Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [CreatedBy])
      OUTPUT INSERTED.[NewsId]
      VALUES (@title, @categoryId, @status, @author, @excerpt, @content, @thumbnail, @publishedAt, @createdBy)
    `);
    return result.recordset[0].NewsId;
  },

  /**
   * Cập nhật bài viết — hỗ trợ partial update (chỉ truyền các field cần update)
   */
  async updateNews(newsId, fields = {}) {
    const allowedFields = ['title', 'categoryId', 'status', 'author', 'excerpt', 'content', 'thumbnail', 'publishedAt'];
    const setClauses = [];
    const req = new sql.Request();
    req.input('newsId', sql.Int, newsId);

    for (const field of allowedFields) {
      if (field in fields) {
        const value = fields[field];
        setClauses.push(`[${field.charAt(0).toUpperCase() + field.slice(1)}] = @${field}`);

        switch (field) {
          case 'categoryId':
            req.input(field, sql.Int, value || null);
            break;
          case 'publishedAt':
            req.input(field, sql.DateTime, value || null);
            break;
          case 'content':
            req.input(field, sql.NVarChar(sql.MAX), value || null);
            break;
          case 'title':
            req.input(field, sql.NVarChar(255), value);
            break;
          case 'author':
            req.input(field, sql.NVarChar(100), value || null);
            break;
          case 'excerpt':
            req.input(field, sql.NVarChar(500), value || null);
            break;
          case 'thumbnail':
            req.input(field, sql.NVarChar(500), value || null);
            break;
          case 'status':
            req.input(field, sql.VarChar(20), value || 'DRAFT');
            break;
          default:
            req.input(field, sql.NVarChar(255), value);
        }
      }
    }

    if (setClauses.length === 0) return;

    setClauses.push('[UpdatedAt] = GETDATE()');

    await req.query(`
      UPDATE [dbo].[News]
      SET ${setClauses.join(',\n          ')}
      WHERE [NewsId] = @newsId
    `);
  },

  /**
   * Xóa bài viết
   */
  async deleteNews(newsId) {
    const req = new sql.Request();
    req.input('newsId', sql.Int, newsId);
    await req.query('DELETE FROM [dbo].[News] WHERE [NewsId] = @newsId');
  },
};

module.exports = NewsModel;
