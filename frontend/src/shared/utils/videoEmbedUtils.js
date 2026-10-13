/**
 * @typedef {'iframe' | 'video'} VideoPreviewType
 * @typedef {{ embedUrl: string | null, previewType: VideoPreviewType | null }} VideoEmbedResult
 */

const DIRECT_VIDEO_EXT_RE = /\.(mp4|webm|mov)(\?|#|$)/i;

function isHttpUrl(value) {
  const url = String(value ?? '').trim();
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isDirectVideoFileUrl(url, pathname = '') {
  return DIRECT_VIDEO_EXT_RE.test(pathname) || DIRECT_VIDEO_EXT_RE.test(url);
}

/**
 * Convert a mentor-pasted video URL into an embeddable preview URL when possible.
 * Direct files (.mp4/.webm/.mov) → previewType `video` (dùng thẻ <video>).
 * YouTube/Vimeo/Drive → previewType `iframe`.
 * @param {string} rawUrl
 * @returns {VideoEmbedResult}
 */
export function resolveVideoEmbed(rawUrl) {
  const url = String(rawUrl ?? '').trim();
  if (!url || !isHttpUrl(url)) {
    return { embedUrl: null, previewType: null };
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    const pathname = parsed.pathname;

    // File video trực tiếp — iframe kém ổn định; caller nên dùng <video>.
    if (isDirectVideoFileUrl(url, pathname)) {
      return { embedUrl: url, previewType: 'video' };
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const fromQuery = parsed.searchParams.get('v');
      if (fromQuery) {
        return {
          embedUrl: `https://www.youtube.com/embed/${fromQuery}`,
          previewType: 'iframe',
        };
      }

      const embedMatch = pathname.match(/^\/embed\/([^/?#]+)/);
      if (embedMatch?.[1]) {
        return {
          embedUrl: `https://www.youtube.com/embed/${embedMatch[1]}`,
          previewType: 'iframe',
        };
      }

      const shortsMatch = pathname.match(/^\/shorts\/([^/?#]+)/);
      if (shortsMatch?.[1]) {
        return {
          embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}`,
          previewType: 'iframe',
        };
      }
    }

    if (host === 'youtu.be') {
      const videoId = pathname.replace(/^\//, '').split('/')[0]?.split('?')[0];
      if (videoId) {
        return {
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          previewType: 'iframe',
        };
      }
    }

    if (host === 'vimeo.com') {
      const videoId = pathname.replace(/^\//, '').split('/')[0];
      if (videoId && /^\d+$/.test(videoId)) {
        return {
          embedUrl: `https://player.vimeo.com/video/${videoId}`,
          previewType: 'iframe',
        };
      }
    }

    if (host === 'player.vimeo.com') {
      const vimeoMatch = pathname.match(/^\/video\/(\d+)/);
      if (vimeoMatch?.[1]) {
        return {
          embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
          previewType: 'iframe',
        };
      }
    }

    if (host === 'drive.google.com') {
      // Không dùng Google Drive preview (entity ngoài hệ thống).
      return { embedUrl: null, previewType: null };
    }

    return { embedUrl: null, previewType: null };
  } catch {
    return { embedUrl: null, previewType: null };
  }
}

/** Kích thước preview video trong tab mode (compact). */
export const COMPACT_VIDEO_PREVIEW_MAX_WIDTH = 494; // 380 + 30%
export const COMPACT_VIDEO_PREVIEW_HEIGHT = 260; // 200 + 30%

/**
 * Lấy tiêu đề video từ YouTube / Vimeo qua oEmbed (dùng khi dán link).
 * @param {string} rawUrl
 * @returns {Promise<string | null>}
 */
export async function fetchVideoTitle(rawUrl) {
  const url = String(rawUrl ?? '').trim();
  if (!url || !isHttpUrl(url)) return null;

  const { embedUrl } = resolveVideoEmbed(url);
  if (!embedUrl) return null;

  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    let oembedUrl = null;

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtu.be'
    ) {
      oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    } else if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
    }

    if (!oembedUrl) return null;

    const response = await fetch(oembedUrl);
    if (!response.ok) return null;

    const data = await response.json();
    const title = String(data?.title ?? '').trim();
    return title || null;
  } catch {
    return null;
  }
}
