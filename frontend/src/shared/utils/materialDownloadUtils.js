import { getFileExtension } from '@/shared/utils/materialUploadValidation';
import { getMentorMaterialDownloadHref } from '@/features/mentor/services/materialUploadService';

function sanitizeDownloadFileName(name) {
  const cleaned = String(name ?? 'tai-lieu')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .trim();
  return cleaned || 'tai-lieu';
}

export function resolveMaterialDownloadFileName(fileName, url, fallback = 'tai-lieu') {
  const fromName = String(fileName ?? '').trim();
  if (fromName) return sanitizeDownloadFileName(fromName);

  const ext = getFileExtension(url);
  const base = sanitizeDownloadFileName(fallback);
  return ext ? `${base}.${ext}` : base;
}

function isCloudinaryUrl(url) {
  return /res\.cloudinary\.com/i.test(String(url ?? ''));
}

/** Kích hoạt tải file ngay — backend trả Content-Disposition: attachment. */
function triggerImmediateFileDownload(href, fileName = '') {
  const anchor = document.createElement('a');
  anchor.href = href;
  if (fileName) anchor.download = fileName;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function triggerAnchorDownload(href, fileName) {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = fileName;
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function triggerBlobDownload(blob, fileName) {
  const objectUrl = URL.createObjectURL(blob);
  try {
    triggerAnchorDownload(objectUrl, fileName);
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}

export function downloadMaterial({
  url,
  file,
  fileName,
  fallbackTitle = 'tai-lieu',
} = {}) {
  if (file instanceof Blob) {
    const name = resolveMaterialDownloadFileName(
      fileName || (file instanceof File ? file.name : ''),
      '',
      fallbackTitle,
    );
    triggerBlobDownload(file, name);
    return { ok: true, instant: true };
  }

  const raw = String(url ?? '').trim();
  if (!raw) return { ok: false, reason: 'missing-url' };

  const name = resolveMaterialDownloadFileName(fileName, raw, fallbackTitle);

  if (isCloudinaryUrl(raw)) {
    triggerImmediateFileDownload(
      getMentorMaterialDownloadHref({ url: raw, fileName: name }),
      name,
    );
    return { ok: true, instant: true };
  }

  if (/^https?:\/\//i.test(raw)) {
    triggerImmediateFileDownload(raw);
    return { ok: true, instant: true };
  }

  triggerAnchorDownload(raw, name);
  return { ok: true, instant: true };
}
