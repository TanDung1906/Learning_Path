import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { getRoleDefaultPath } from '@/features/auth/utils/authUtils';

/**
 * Minimal "403 – Unauthorized" page.
 * Shown when an authenticated user tries to access a route
 * that their role does not permit.
 */
export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
        bgcolor: '#FAFAFA',
      }}
    >
      <BlockOutlinedIcon sx={{ fontSize: 64, color: '#EF4444', mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#0F172A' }}>
        403 — Không có quyền truy cập
      </Typography>
      <Typography sx={{ fontSize: 15, color: '#64748B', mb: 3, maxWidth: 420 }}>
        Bạn không có quyền truy cập trang này. Vui lòng quay lại trang chủ hoặc liên hệ quản trị viên.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(getRoleDefaultPath())}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          px: 3,
          py: 1,
          borderRadius: '10px',
          bgcolor: '#0891B2',
          '&:hover': { bgcolor: '#0E7490' },
        }}
      >
        Về trang chủ
      </Button>
    </Box>
  );
}
