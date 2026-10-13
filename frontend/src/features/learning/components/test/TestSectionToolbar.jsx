import { Box, Typography } from '@mui/material';
import { TEST_MUTED } from './testTheme';

export default function TestSectionToolbar({
  title,
  groupLabel,
  groupMeta,
  statusLabel = 'Đang làm',
  accentColor,
  accentBg,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        mb: 2,
        px: 0.25,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: { xs: 18, md: 20 },
            fontWeight: 800,
            color: accentColor,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: 13, color: TEST_MUTED, mt: 0.25 }}>
          {groupLabel}
          {groupMeta ? ` · ${groupMeta}` : ''}
        </Typography>
      </Box>

      <Box
        sx={{
          px: 1.5,
          py: 0.75,
          borderRadius: '999px',
          bgcolor: accentBg,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: accentColor }}>
          {statusLabel}
        </Typography>
      </Box>
    </Box>
  );
}
