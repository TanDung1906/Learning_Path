import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { fetchTextMaterialHtml } from '@/features/mentor/services/materialUploadService';
import { TEST_DIVIDER, TEST_MUTED, TEST_TEXT } from './testTheme';

const RICH_CONTENT_SX = {
  fontSize: 15,
  lineHeight: 1.8,
  color: TEST_TEXT,
  wordBreak: 'break-word',
  '& p': { margin: '0 0 8px' },
  '& ul, & ol': { paddingLeft: '1.5rem', marginBottom: '8px' },
  '& li': { marginBottom: '4px' },
  '& img': { maxWidth: '100%', height: 'auto', borderRadius: '8px' },
  '& i, & em': { fontStyle: 'italic' },
  '& b, & strong': { fontWeight: 700 },
  '& u': { textDecoration: 'underline' },
};

function isHtmlReadingSource(url = '') {
  const normalized = String(url).trim().toLowerCase();
  return normalized.includes('.html') || normalized.includes('/raw/upload/');
}

export default function TestReadingContent({ readingUrl, title = 'Bài đọc' }) {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const url = String(readingUrl ?? '').trim();

    if (!url) {
      setHtml('');
      setError('');
      setLoading(false);
      return undefined;
    }

    if (!isHtmlReadingSource(url)) {
      setHtml('');
      setError('');
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError('');

    fetchTextMaterialHtml(url)
      .then((content) => {
        if (cancelled) return;
        if (!content) {
          setHtml('');
          setError('Không tải được nội dung bài đọc.');
          return;
        }
        setHtml(content);
      })
      .catch(() => {
        if (!cancelled) {
          setHtml('');
          setError('Không tải được nội dung bài đọc.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [readingUrl]);

  if (!readingUrl) return null;

  if (!isHtmlReadingSource(readingUrl)) {
    return (
      <Box
        component="a"
        href={readingUrl}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ fontSize: 13, color: '#0891B2', fontWeight: 600 }}
      >
        Mở bài đọc
      </Box>
    );
  }

  return (
    <Box>
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
          <CircularProgress size={18} />
          <Typography sx={{ fontSize: 13, color: TEST_MUTED }}>
            Đang tải bài đọc...
          </Typography>
        </Box>
      )}

      {error && (
        <Typography sx={{ fontSize: 13, color: '#DC2626', fontWeight: 600 }}>
          {error}
        </Typography>
      )}

      {html && (
        <Box
          sx={{
            borderRadius: '10px',
            bgcolor: '#F8FAFC',
            border: `1px solid ${TEST_DIVIDER}`,
            px: 2,
            py: 1.5,
            maxHeight: 420,
            overflowY: 'auto',
          }}
        >
          <Box
            sx={RICH_CONTENT_SX}
            dangerouslySetInnerHTML={{ __html: html }}
            aria-label={title}
          />
        </Box>
      )}
    </Box>
  );
}
