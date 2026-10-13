import { Box, Typography, alpha, useTheme } from '@mui/material';

export default function MentorCourseStatCard({ label, value, icon: Icon }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2.25,
        borderRadius: '20px',
        bgcolor: '#FFFFFF',
        border: `1px solid ${alpha('#0F172A', 0.08)}`,
        boxShadow: theme.ios18?.shadow?.sm ?? '0 1px 2px rgba(15,23,42,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.75,
        minHeight: 88,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '14px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 22 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, color: '#64748B', fontWeight: 500, mb: 0.25 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
