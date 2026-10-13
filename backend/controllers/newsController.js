const NewsModel = require('../Models/newsModel');
const { saveNewsThumbnailFromDataUrl } = require('../middlewares/newsThumbnailMiddleware');
const { isAdminRequest } = require('../middlewares/authMiddleware');
const { enrichNewsRecord } = require('../utils/newsThumbnailResolver');

const ALLOWED_SORT = new Set(['newest', 'oldest', 'title_asc', 'title_desc']);
const ALLOWED_STATUS = new Set(['DRAFT', 'PUBLISHED', 'HIDDEN']);

function normalizeSort(sort) {
  const value = String(sort || 'newest').trim().toLowerCase();
  return ALLOWED_SORT.has(value) ? value : 'newest';
}

/**
 * Public chỉ được xem PUBLISHED.
 * Admin: status=all → null (mọi status); status hợp lệ → filter; thiếu → all.
 */
function resolveListStatusFilter(rawStatus, isAdmin) {
  if (!isAdmin) {
    return 'PUBLISHED';
  }
  if (rawStatus === 'all' || rawStatus === '' || rawStatus == null) {
    return null;
  }
  const upper = String(rawStatus).trim().toUpperCase();
  if (ALLOWED_STATUS.has(upper)) {
    return upper;
  }
  return null;
}

const newsController = {
  /**
   * GET /api/news
   * Public: chỉ PUBLISHED.
   * Admin (auth + role): status=all | DRAFT | PUBLISHED | HIDDEN + sort.
   * Query: ?status=&categoryId=&search=&page=&pageSize=&sort=
   */
  getNewsList: async (req, res) => {
    try {
      const { status, categoryId, search, page, pageSize, sort } = req.query;
      const isAdmin = await isAdminRequest(req);
      const filterStatus = resolveListStatusFilter(status, isAdmin);

      // Non-admin không được hỏi status khác PUBLISHED qua query (im lặng force PUBLISHED)
      if (!isAdmin && status && String(status).toUpperCase() !== 'PUBLISHED' && status !== 'all') {
        // vẫn trả PUBLISHED — không 403 để tránh dò status
      }

      const result = await NewsModel.getNewsList({
        status: filterStatus,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        search: search || '',
        page: parseInt(page, 10) || 1,
        pageSize: Math.min(parseInt(pageSize, 10) || 10, 50),
        sort: normalizeSort(sort),
      });

      return res.json({
        success: true,
        data: result.data.map(enrichNewsRecord),
        total: result.total,
        page: parseInt(page, 10) || 1,
        pageSize: Math.min(parseInt(pageSize, 10) || 10, 50),
      });
    } catch (err) {
      console.error('[GetNewsList Error]', err.message);
      return res.status(500).json({
        success: false,
        message: 'Không thể lấy danh sách bài viết.',
      });
    }
  },

  /**
   * GET /api/news/:id
   * Public: chỉ bài PUBLISHED. Admin: mọi status.
   */
  getNewsById: async (req, res) => {
    try {
      const newsId = parseInt(req.params.id, 10);
      if (isNaN(newsId)) {
        return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ.' });
      }

      const news = await NewsModel.getNewsById(newsId);
      if (!news) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
      }

      if (news.status !== 'PUBLISHED') {
        const isAdmin = await isAdminRequest(req);
        if (!isAdmin) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy bài viết hoặc bài viết chưa được công bố.',
          });
        }
      }

      return res.json({ success: true, data: enrichNewsRecord(news) });
    } catch (err) {
      console.error('[GetNewsById Error]', err.message);
      return res.status(500).json({
        success: false,
        message: 'Không thể lấy chi tiết bài viết.',
      });
    }
  },

  /**
   * POST /api/news
   * Tạo bài viết mới (Admin only — middleware)
   */
  createNews: async (req, res) => {
    try {
      const { title, categoryId, status, author, excerpt, content, thumbnail, publishedAt } = req.body;
      const createdBy = req.user?.userId || null;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Tiêu đề bài viết không được để trống.' });
      }

      const safeStatus = ALLOWED_STATUS.has(String(status || '').toUpperCase())
        ? String(status).toUpperCase()
        : 'DRAFT';

      // Tạo bài viết trước để có newsId
      const newsId = await NewsModel.createNews({
        title: title.trim(),
        categoryId: categoryId || null,
        status: safeStatus,
        author: author || null,
        excerpt: excerpt || null,
        content: content || null,
        thumbnail: null,
        publishedAt: publishedAt || (safeStatus === 'PUBLISHED' ? new Date() : null),
        createdBy,
      });

      // Xử lý thumbnail: upload Cloudinary và lưu secure URL vào DB
      let thumbnailPath = thumbnail || null;
      if (thumbnail) {
        try {
          const saved = await saveNewsThumbnailFromDataUrl(thumbnail, newsId);
          if (saved) thumbnailPath = saved;
        } catch (thumbErr) {
          console.error('[CreateNews Thumbnail Error]', thumbErr.message);
          return res.status(thumbErr.statusCode || 400).json({
            success: false,
            message: thumbErr.message || 'Không thể lưu ảnh thumbnail.',
          });
        }
      }

      if (thumbnailPath !== null) {
        await NewsModel.updateNews(newsId, {
          thumbnail: thumbnailPath,
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Tạo bài viết thành công.',
        data: { newsId },
      });
    } catch (err) {
      console.error('[CreateNews Error]', err.message);
      return res.status(500).json({
        success: false,
        message: 'Không thể tạo bài viết.',
      });
    }
  },

  /**
   * PUT /api/news/:id
   * Cập nhật bài viết (Admin only — middleware)
   */
  updateNews: async (req, res) => {
    try {
      const newsId = parseInt(req.params.id, 10);
      if (isNaN(newsId)) {
        return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ.' });
      }

      const existing = await NewsModel.getNewsById(newsId);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
      }

      const { title, categoryId, status, author, excerpt, content, thumbnail, publishedAt } = req.body;

      if (title !== undefined && !title.trim()) {
        return res.status(400).json({ success: false, message: 'Tiêu đề bài viết không được để trống.' });
      }

      let nextStatus = existing.status;
      if (status !== undefined) {
        const upper = String(status).toUpperCase();
        if (!ALLOWED_STATUS.has(upper)) {
          return res.status(400).json({ success: false, message: 'Trạng thái bài viết không hợp lệ.' });
        }
        nextStatus = upper;
      }

      // Xử lý thumbnail: upload Cloudinary và lưu secure URL vào DB
      let thumbnailPath = thumbnail !== undefined ? thumbnail : existing.thumbnail;
      if (thumbnail !== undefined) {
        const trimmedThumbnail = String(thumbnail ?? '').trim();
        if (!trimmedThumbnail) {
          thumbnailPath = null;
        } else {
          try {
            const saved = await saveNewsThumbnailFromDataUrl(trimmedThumbnail, newsId, {
              replaceExisting: true,
              previousThumbnail: existing.thumbnail,
            });
            if (saved) thumbnailPath = saved;
          } catch (thumbErr) {
            return res.status(400).json({
              success: false,
              message: thumbErr.message || 'Thumbnail không hợp lệ.',
            });
          }
        }
      }

      let nextPublishedAt =
        publishedAt !== undefined ? publishedAt : existing.publishedAt;
      if (status !== undefined) {
        if (nextStatus === 'PUBLISHED') {
          nextPublishedAt =
            publishedAt !== undefined && publishedAt
              ? publishedAt
              : existing.publishedAt || new Date();
        } else if (publishedAt === null || (publishedAt === undefined && nextStatus !== 'PUBLISHED')) {
          // Unpublish / hide: clear publishedAt only when client sends null or status leaves PUBLISHED without explicit date
          if (nextStatus !== 'PUBLISHED' && publishedAt === null) {
            nextPublishedAt = null;
          } else if (nextStatus !== 'PUBLISHED' && publishedAt === undefined) {
            // Keep historical publishedAt when hiding (useful for re-publish)
            nextPublishedAt = existing.publishedAt;
          }
        }
      }

      await NewsModel.updateNews(newsId, {
        title: title !== undefined ? title.trim() : existing.title,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        status: nextStatus,
        author: author !== undefined ? author : existing.author,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        content: content !== undefined ? content : existing.content,
        thumbnail: thumbnailPath,
        publishedAt: nextPublishedAt,
      });

      return res.json({ success: true, message: 'Cập nhật bài viết thành công.' });
    } catch (err) {
      console.error('[UpdateNews Error]', err.message);
      return res.status(500).json({
        success: false,
        message: 'Không thể cập nhật bài viết.',
      });
    }
  },

  /**
   * DELETE /api/news/:id
   * Xóa bài viết (Admin only — middleware)
   */
  deleteNews: async (req, res) => {
    try {
      const newsId = parseInt(req.params.id, 10);
      if (isNaN(newsId)) {
        return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ.' });
      }

      const existing = await NewsModel.getNewsById(newsId);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
      }

      await NewsModel.deleteNews(newsId);

      return res.json({ success: true, message: 'Xóa bài viết thành công.' });
    } catch (err) {
      console.error('[DeleteNews Error]', err.message);
      return res.status(500).json({
        success: false,
        message: 'Không thể xóa bài viết.',
      });
    }
  },
};

module.exports = newsController;
