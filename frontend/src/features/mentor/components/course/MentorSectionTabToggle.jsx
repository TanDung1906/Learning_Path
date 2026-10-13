import { Box, Typography } from '@mui/material';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { MUTED, TEXT } from './mentorCourseCreateStyles';

export default function MentorSectionTabToggle({ label, expanded = true, onToggle, sx }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={expanded ? `Thu gọn ${label}` : `Mở rộng ${label}`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.15,
        flexShrink: 0,
        height: 30,
        px: 0.5,
        mb: 0.2,
        border: 'none',
        borderRadius: 0,
        bgcolor: 'transparent',
        color: MUTED,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'color 0.15s ease',
        '&:hover': {
          color: TEXT,
        },
        ...sx,
      }}
    >
      {expanded ? (
        <ExpandLessRoundedIcon sx={{ fontSize: 16 }} />
      ) : (
        <ExpandMoreRoundedIcon sx={{ fontSize: 16 }} />
      )}
      <Typography
        sx={{
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
