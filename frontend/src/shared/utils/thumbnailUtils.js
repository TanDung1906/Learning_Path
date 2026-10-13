import { getApiOrigin } from '@/shared/utils/apiOrigin';

const INVALID_THUMBNAIL_MARKERS = new Set([
  '',
  'CHƯA FIX LỖI ẢNH',
  'null',
  'undefined',
]);

function isServerStaticPath(pathname) {
  return pathname.startsWith('/uploads/') || pathname.startsWith('/assets/');
}

function fixBrokenApiUploadUrl(value) {
  if (!value.includes('/api/uploads/') && !value.includes('/api/assets/')) {
    return value;
  }
  return value.replace('/api/uploads/', '/uploads/').replace('/api/assets/', '/assets/');
}

export function sanitizeThumbnail(thumbnail) {
  let value = String(thumbnail ?? '').trim();
  value = value.replace(/\\/g, '/');
  if (!value || INVALID_THUMBNAIL_MARKERS.has(value)) return '';
  return value;
}

/** Chuẩn hóa thumbnail trước khi gửi API news (path server hoặc URL ngoài). */
export function normalizeNewsThumbnailForApi(thumbnail) {
  const value = sanitizeThumbnail(thumbnail);
  if (!value) return null;

  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const url = new URL(value);
      const pathname = url.pathname.replace(/\/+/g, '/');
      if (pathname.toLowerCase().startsWith('/uploads/news/')) {
        return pathname;
      }
      if (url.hostname.endsWith('cloudinary.com')) {
        return value;
      }
    } catch {
      // keep external URL
    }
    return value;
  }

  if (value.toLowerCase().startsWith('uploads/news/')) {
    return `/${value}`;
  }

  return value;
}

export function resolveThumbnailUrl(thumbnail, cacheKey) {
  const value = sanitizeThumbnail(thumbnail);
  if (!value) return '';

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:image') ||
    value.startsWith('blob:')
  ) {
    return fixBrokenApiUploadUrl(value);
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`;

  // Dev: phục vụ ảnh qua Vite proxy (cùng origin với localhost:5173)
  if (import.meta.env.DEV && isServerStaticPath(normalizedPath)) {
    let url = normalizedPath;
    if (cacheKey != null && cacheKey !== '') {
      url = `${url}?v=${encodeURIComponent(String(cacheKey))}`;
    }
    return url;
  }

  const baseUrl = getApiOrigin();
  let url = `${baseUrl}${normalizedPath}`;
  if (cacheKey != null && cacheKey !== '') {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}v=${encodeURIComponent(String(cacheKey))}`;
  }
  return url;
}
