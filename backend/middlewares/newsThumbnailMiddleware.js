const fs = require('fs');
const path = require('path');
const {
  deleteCloudinaryAssetByUrl,
  isCloudinaryDeliveryUrl,
  uploadNewsThumbnailBuffer,
} = require('../services/cloudinaryService');

const MAX_THUMBNAIL_FILE_SIZE = 5 * 1024 * 1024;
const DATA_URL_PATTERN = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/i;
const NEWS_UPLOAD_PREFIX = '/uploads/news/';

function createThumbnailError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseThumbnailDataUrl(dataUrl) {
  const match = String(dataUrl).trim().match(DATA_URL_PATTERN);
  if (!match) return null;

  const rawExt = match[1].toLowerCase();
  return {
    ext: rawExt === 'jpeg' ? 'jpg' : rawExt,
    base64Data: match[2],
  };
}

function normalizeNewsThumbnailInput(value) {
  let trimmed = String(value ?? '').trim();
  if (!trimmed) return '';

  trimmed = trimmed.replace(/\\/g, '/');

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      const pathname = url.pathname.replace(/\/+/g, '/');
      if (pathname.toLowerCase().startsWith(NEWS_UPLOAD_PREFIX)) {
        return pathname;
      }
    } catch {
      // keep external URL as-is
    }
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith('uploads/news/')) {
    return `/${trimmed}`;
  }
  if (lower.startsWith(NEWS_UPLOAD_PREFIX)) {
    return trimmed;
  }

  return trimmed;
}

/** Validate data URL thumbnail; skip nếu đã là URL hoặc path. */
function validateNewsThumbnailDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return null;
  }

  const trimmed = normalizeNewsThumbnailInput(dataUrl);
  if (!trimmed) return null;

  if (trimmed.toLowerCase().startsWith(NEWS_UPLOAD_PREFIX)) {
    const uploadDir = path.join(__dirname, '../uploads/news');
    const fileName = path.basename(trimmed);
    const diskPath = path.join(uploadDir, fileName);
    if (fs.existsSync(diskPath)) {
      return { existingPath: trimmed };
    }
    throw createThumbnailError('File ảnh thumbnail không tồn tại trên server. Vui lòng tải lại ảnh.');
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return { existingUrl: trimmed };
  }

  const parsed = parseThumbnailDataUrl(trimmed);
  if (!parsed) {
    throw createThumbnailError('Thumbnail không đúng định dạng ảnh base64.');
  }

  if (!parsed.base64Data) {
    throw createThumbnailError('Dữ liệu ảnh thumbnail không hợp lệ.');
  }

  const buffer = Buffer.from(parsed.base64Data, 'base64');

  if (buffer.length > MAX_THUMBNAIL_FILE_SIZE) {
    throw createThumbnailError('Ảnh đại diện không được vượt quá 5MB.');
  }

  return { buffer, ext: parsed.ext };
}

function deleteOldLocalNewsThumbnails(uploadDir, newsId) {
  if (!fs.existsSync(uploadDir)) return;
  const prefix = `news_thumb_${newsId}`;
  for (const file of fs.readdirSync(uploadDir)) {
    if (file === prefix || file.startsWith(`${prefix}.`) || file.startsWith(`${prefix}_`)) {
      fs.unlinkSync(path.join(uploadDir, file));
    }
  }
}

const saveNewsThumbnailFromDataUrl = async (dataUrl, newsId, options = {}) => {
  const { replaceExisting = false, previousThumbnail = null } = options;
  const validated = validateNewsThumbnailDataUrl(dataUrl);
  if (!validated) return null;
  if (validated.existingUrl) return validated.existingUrl;
  if (validated.existingPath) return validated.existingPath;

  const { buffer, ext } = validated;
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0 || !ext) {
    throw createThumbnailError('Dữ liệu ảnh thumbnail không hợp lệ.');
  }

  const cloudinaryUrl = await uploadNewsThumbnailBuffer(buffer, { newsId, ext });

  if (replaceExisting) {
    if (previousThumbnail && isCloudinaryDeliveryUrl(previousThumbnail)) {
      await deleteCloudinaryAssetByUrl(previousThumbnail);
    }
    deleteOldLocalNewsThumbnails(path.join(__dirname, '../uploads/news'), newsId);
  }

  return cloudinaryUrl;
};

module.exports = {
  MAX_THUMBNAIL_FILE_SIZE,
  normalizeNewsThumbnailInput,
  validateNewsThumbnailDataUrl,
  saveNewsThumbnailFromDataUrl,
};
