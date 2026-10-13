/**
 * Student news service — gọi backend thật, chỉ lấy bài PUBLISHED.
 */
import { apiGetNewsList, apiGetNewsById } from './newsApiClient';

/**
 * Chuyển đổi dữ liệu từ backend snake_case sang camelCase frontend
 */
function normalizeArticle(raw = {}) {
  return {
    id: raw.newsId,
    title: raw.title ?? '',
    category: raw.categoryName ?? raw.category ?? '',
    categoryId: raw.categoryId ?? null,
    status: raw.status ?? 'DRAFT',
    author: raw.author ?? '',
    excerpt: raw.excerpt ?? '',
    content: raw.content ?? '',
    thumbnail: raw.thumbnail ?? null,
    publishedAt: raw.publishedAt ?? null,
    updatedAt: raw.updatedAt ?? null,
    createdByName: raw.createdByName ?? '',
  };
}

export async function fetchPublishedNewsArticles({
  page = 1,
  pageSize = 10,
  categoryId,
  search,
  sort = 'newest',
} = {}) {
  const result = await apiGetNewsList({
    status: 'PUBLISHED',
    categoryId,
    search,
    page,
    pageSize,
    sort,
  });

  if (!result.ok) {
    return { ok: false, articles: [], total: 0, message: result.message ?? 'Không tải được tin tức.' };
  }

  const articles = (result.data || []).map(normalizeArticle);

  return {
    ok: true,
    articles,
    total: result.total ?? articles.length,
    page: result.page ?? page,
    pageSize: result.pageSize ?? pageSize,
  };
}

export async function fetchPublishedNewsArticleById(id) {
  const result = await apiGetNewsById(id);
  if (!result.ok) {
    return { ok: false, article: null, message: result.message ?? 'Không tìm thấy tin tức.' };
  }

  const article = normalizeArticle(result.data);

  if (article.status !== 'PUBLISHED') {
    return { ok: false, article: null, message: 'Không tìm thấy tin tức hoặc bài viết chưa được công bố.' };
  }

  return { ok: true, article };
}

export async function fetchFeaturedNewsArticles(limit = 3) {
  const result = await fetchPublishedNewsArticles({ page: 1, pageSize: 50 });
  if (!result.ok) {
    return { ok: false, articles: [] };
  }
  const sorted = [...result.articles].sort(
    (a, b) =>
      new Date(b.publishedAt || b.updatedAt || 0).getTime()
      - new Date(a.publishedAt || a.updatedAt || 0).getTime(),
  );
  return { ok: true, articles: sorted.slice(0, limit) };
}
