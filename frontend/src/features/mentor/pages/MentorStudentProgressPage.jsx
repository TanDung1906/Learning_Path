import { Box, Typography, alpha } from '@mui/material';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import MentorPageShell from '@/features/mentor/components/MentorPageShell';

export default function MentorStudentProgressPage() {
  return (
    <MentorPageShell
      title="Tiến độ học viên"
      description="Theo dõi tiến độ học tập của học viên trong các khóa học."
    >
      <Box
        sx={{
          py: 6,
          px: 3,
          textAlign: 'center',
          borderRadius: 3,
          bgcolor: '#FFFFFF',
          border: `1px solid ${alpha('#0891B2', 0.12)}`,
        }}
      >
        <InsightsRoundedIcon sx={{ fontSize: 48, color: '#0891B2', opacity: 0.35, mb: 1.5 }} />
        <Typography sx={{ fontSize: 15, color: '#64748B' }}>
          Bảng theo dõi tiến độ học viên sẽ được hiển thị tại đây.
        </Typography>
      </Box>
    </MentorPageShell>
  );
}
