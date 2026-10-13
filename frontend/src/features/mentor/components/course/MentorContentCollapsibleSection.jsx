import { Box, Collapse, IconButton, Typography } from '@mui/material';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { CONTENT_SECTION_LABEL_SX, ICON_BTN_SX, pinnedTabStickySx } from './mentorCourseContentStyles';
import { MUTED } from './mentorCourseCreateStyles';

export default function MentorContentCollapsibleSection({
  label,
  meta = null,
  expanded = true,
  onToggle,
  hideHeader = false,
  pinned = null,
  pinSticky = true,
  pinnedSx,
  pinnedStickyTop,
  pinnedZIndex = 18,
  children,
  sx,
  bodySx,
}) {
  return (
    <Box sx={{ mt: 2.5, '&:first-of-type': { mt: 0 }, ...sx }}>
      {!hideHeader ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            mb: pinned || expanded ? 0 : 0,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={onToggle}
          role="button"
          aria-expanded={expanded}
        >
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            sx={ICON_BTN_SX}
            aria-label={expanded ? `Thu gọn ${label}` : `Mở rộng ${label}`}
          >
            {expanded ? (
              <ExpandLessRoundedIcon sx={{ fontSize: 18 }} />
            ) : (
              <ExpandMoreRoundedIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
          <Typography sx={{ ...CONTENT_SECTION_LABEL_SX, mt: 0, mb: 0, flex: 1 }}>
            {label}
          </Typography>
          {meta ? (
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: MUTED, flexShrink: 0, pr: 0.5 }}>
              {meta}
            </Typography>
          ) : null}
        </Box>
      ) : null}

      {pinned ? (
        <Box
          sx={{
            mt: 1,
            ...pinnedSx,
            ...(pinSticky ? pinnedTabStickySx(pinnedStickyTop, pinnedZIndex) : {}),
          }}
        >
          {pinned}
        </Box>
      ) : null}

      <Collapse in={expanded}>
        <Box sx={{ mt: pinned ? 0 : 1, ...bodySx }}>{children}</Box>
      </Collapse>
    </Box>
  );
}
