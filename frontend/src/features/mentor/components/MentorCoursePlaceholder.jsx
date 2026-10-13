import { Box, Typography, alpha } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@/shared/ui/PageTitle';
import AppButton from '@/shared/ui/AppButton';

export default function MentorCoursePlaceholder({ title, description }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', maxWidth: 720, mx: 'auto' }}>
      <PageTitle
        title={title}
        subtitle={description}
        action={
          <AppButton
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate('/mentor/courses')}
            sx={{ fontSize: 13 }}
          >
            Quay lại
          </AppButton>
        }
      />
      <Box
        sx={{
          py: 5,
          px: 3,
          textAlign: 'center',
          borderRadius: '20px',
          bgcolor: '#FFFFFF',
          border: `1px solid ${alpha('#0F172A', 0.08)}`,
        }}
      >
        <Typography sx={{ fontSize: 15, color: '#64748B' }}>
          Trang này sẽ được triển khai trong giai đoạn tiếp theo.
        </Typography>
      </Box>
    </Box>
  );
}
