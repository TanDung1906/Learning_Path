import { useEffect, useMemo, useState } from 'react';
import { Box, Fade, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { SIDEBAR_WIDTH } from '@/shared/layout/Sidebar';

const FOOTER_GAP = 16;
const DEFAULT_AVOID_SELECTORS = ['#app-site-footer'];

function resolveDefaultBottom(bottom, isMobile) {
  if (typeof bottom === 'number') return bottom;
  if (bottom && typeof bottom === 'object') {
    return isMobile ? (bottom.xs ?? bottom.sm ?? 24) : (bottom.sm ?? bottom.xs ?? 24);
  }
  return 24;
}

function getAvoidBottomOffset(selectors, gap = FOOTER_GAP) {
  let maxOffset = 0;

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') return;

      const rect = element.getBoundingClientRect();
      if (rect.height <= 0) return;

      const intersectsViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!intersectsViewport) return;

      maxOffset = Math.max(maxOffset, window.innerHeight - rect.top + gap);
    });
  });

  return maxOffset;
}

export default function ScrollToTopButton({
  threshold = 280,
  leftOffset = SIDEBAR_WIDTH,
  bottom = { xs: 24, sm: 24 },
  avoidSelectors = DEFAULT_AVOID_SELECTORS,
  ariaLabel = 'Về đầu trang',
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultBottom = useMemo(() => resolveDefaultBottom(bottom, isMobile), [bottom, isMobile]);
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(defaultBottom);

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY > threshold);
      const avoidOffset = getAvoidBottomOffset(avoidSelectors);
      setBottomOffset(Math.max(defaultBottom, avoidOffset));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    const observers = avoidSelectors.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector)).map((element) => {
        const observer = new ResizeObserver(update);
        observer.observe(element);
        return observer;
      }),
    );

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [threshold, defaultBottom, avoidSelectors]);

  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Fade in={visible}>
      <Box
        sx={{
          position: 'fixed',
          left: {
            xs: `calc(${leftOffset}px + 16px)`,
            sm: `calc(${leftOffset}px + 24px)`,
          },
          bottom: `${bottomOffset}px`,
          zIndex: theme.zIndex.speedDial,
          transition: 'bottom 0.2s ease',
        }}
      >
        <Tooltip title={ariaLabel} placement="right" arrow>
          <IconButton
            onClick={handleClick}
            aria-label={ariaLabel}
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#fff',
              border: '1px solid rgba(15,23,42,0.1)',
              boxShadow: '0 2px 8px rgba(15,23,42,0.08)',
              color: '#64748B',
              '&:hover': {
                bgcolor: '#F8FAFC',
                color: '#0F172A',
                borderColor: 'rgba(15,23,42,0.16)',
              },
            }}
          >
            <KeyboardArrowUpRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Fade>
  );
}
