import { Box } from '@mui/material';
import AppButton from '@/shared/ui/AppButton';
import { PRIMARY } from './mentorCourseCreateStyles';

export default function MentorCourseReviewActions({
  onCreate,
  creating = false,
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <AppButton
        onClick={onCreate}
        loading={creating}
        sx={{
          height: 44,
          borderRadius: '999px',
          fontWeight: 700,
          bgcolor: PRIMARY,
          '&:hover': { bgcolor: '#0E7490' },
        }}
      >
        Tạo khóa học
      </AppButton>
    </Box>
  );
}
