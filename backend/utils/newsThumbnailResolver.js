const fs = require('fs');
const path = require('path');

const NEWS_UPLOAD_PREFIX = '/uploads/news/';
const UPLOAD_DIR = path.join(__dirname, '../uploads/news');

/** Ảnh mặc định cho bài seed (khi DB chưa có Thumbnail). */
const DEFAULT_THUMBNAILS_BY_ID = {
  1: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=480&fit=crop',
  2: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=480&fit=crop',
  3: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=480&fit=crop',
  5: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=480&fit=crop',
  7: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=480&fit=crop',
  8: 'https://images.unsplash.com/photo-1456513080460-8c8f964d8719?w=800&h=480&fit=crop',
  9: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=480&fit=crop',
  11: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=480&fit=crop',
  12: 'https://images.unsplash.com/photo-1478737270239-2f02ba77cc67?w=800&h=480&fit=crop',
};

function normalizeThumbnailValue(thumbnail) {
  return String(thumbnail ?? '').trim().replace(/\\/g, '/');
}

function isLocalNewsThumbnail(thumbnail) {
  const value = normalizeThumbnailValue(thumbnail).toLowerCase();
  return value.startsWith(NEWS_UPLOAD_PREFIX) || value.startsWith('uploads/news/');
}

function localNewsThumbnailExists(thumbnail) {
  const value = normalizeThumbnailValue(thumbnail);
  if (!isLocalNewsThumbnail(value)) return true;

  const fileName = path.basename(value);
  return fs.existsSync(path.join(UPLOAD_DIR, fileName));
}

function resolveNewsThumbnail(thumbnail, newsId) {
  const trimmed = normalizeThumbnailValue(thumbnail);
  if (trimmed && localNewsThumbnailExists(trimmed)) {
    if (trimmed.toLowerCase().startsWith('uploads/news/')) {
      return `/${trimmed}`;
    }
    return trimmed;
  }

  if (trimmed && !isLocalNewsThumbnail(trimmed)) {
    return trimmed;
  }

  return DEFAULT_THUMBNAILS_BY_ID[Number(newsId)] || null;
}

function enrichNewsRecord(record = {}) {
  if (!record || record.newsId == null) return record;
  return {
    ...record,
    thumbnail: resolveNewsThumbnail(record.thumbnail, record.newsId),
  };
}

module.exports = {
  DEFAULT_THUMBNAILS_BY_ID,
  enrichNewsRecord,
  isLocalNewsThumbnail,
  localNewsThumbnailExists,
  resolveNewsThumbnail,
};
