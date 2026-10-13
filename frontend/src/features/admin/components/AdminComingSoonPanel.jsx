import { Box, Typography, alpha } from '@mui/material';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';

export default function AdminComingSoonPanel({
  message = 'Trang này sẽ được triển khai trong giai đoạn tiếp theo.',
}) {
  return (
    <Box
      sx={{
        py: 5,
        px: 3,
        textAlign: 'center',
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: `1px solid ${alpha('#0F172A', 0.08)}`,
      }}
    >
      <ConstructionOutlinedIcon sx={{ fontSize: 40, color: '#94A3B8', mb: 1.5 }} />
      <Typography sx={{ fontSize: 15, color: '#64748B', lineHeight: 1.55, maxWidth: 420, mx: 'auto' }}>
        {message}
      </Typography>
    </Box>
  );
}
