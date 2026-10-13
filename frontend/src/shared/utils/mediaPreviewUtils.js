import { resolveVideoEmbed } from '@/shared/utils/videoEmbedUtils';
import { getFileExtension } from '@/shared/utils/materialUploadValidation';

const PREVIEW_HEIGHT = 320;

/**
 * Preview bài nghe: iframe cho mp4 / link embed, audio cho mp3.
 * @returns {{ mode: 'iframe' | 'audio' | null, embedUrl: string | null, height: number }}
 */
export function resolveListeningPreview(sourceUrl, fileName = '') {
  const url = String(sourceUrl ?? '').trim();
  if (!url) {
    return { mode: null, embedUrl: null, height: PREVIEW_HEIGHT };
  }

  const ext = getFileExtension(fileName) || getFileExtension(url);

  if (ext === 'mp4' || /\.mp4(\?|#|$)/i.test(url)) {
    return { mode: 'iframe', embedUrl: url, height: PREVIEW_HEIGHT };
  }

  const videoEmbed = resolveVideoEmbed(url);
  if (videoEmbed.previewType === 'iframe' && videoEmbed.embedUrl) {
    return { mode: 'iframe', embedUrl: videoEmbed.embedUrl, height: PREVIEW_HEIGHT };
  }
  if (videoEmbed.previewType === 'video' && videoEmbed.embedUrl) {
    return { mode: 'iframe', embedUrl: videoEmbed.embedUrl, height: PREVIEW_HEIGHT };
  }

  if (ext === 'mp3' || /\.mp3(\?|#|$)/i.test(url)) {
    return { mode: 'audio', embedUrl: url, height: 48 };
  }

  return { mode: null, embedUrl: null, height: PREVIEW_HEIGHT };
}

export const LISTENING_PREVIEW_HEIGHT = PREVIEW_HEIGHT;
