import {
  Avatar,
  Box,
  Chip,
  LinearProgress,
  Typography,
  alpha,
} from '@mui/material';
import { PRIMARY, TEXT, MUTED, SURFACE_SUBTLE, BORDER_SUBTLE } from './mentorCourseCreateStyles';
import {
  STUDENT_STATUS_CHIP_SX,
  STUDENT_STATUS_LABELS,
  STUDENT_TABLE_GRID_COLUMNS,
  getStudentProgressColor,
  formatStudentDate,
  formatStudentDateTime,
  getStudentInitials,
} from '@/features/mentor/utils/mentorCourseStudentsUtils';

const PILL_CHIP_SX = {
  borderRadius: '999px',
  height: 24,
  fontSize: 12,
  fontWeight: 700,
  '& .MuiChip-label': { px: 1.2, fontWeight: 700 },
};

const VALUE_SX = {
  fontSize: 13,
  fontWeight: 600,
  color: TEXT,
  lineHeight: 1.45,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

function MobileField({ label, value }) {
  return (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: MUTED, mb: 0.25 }}>
        {label}
      </Typography>
      <Typography sx={VALUE_SX}>{value}</Typography>
    </Box>
  );
}

function DesktopValue({ value }) {
  return (
    <Typography sx={{ ...VALUE_SX, display: { xs: 'none', md: 'block' } }}>
      {value}
    </Typography>
  );
}

export default function MentorCourseStudentRow({ student }) {
  const statusSx = STUDENT_STATUS_CHIP_SX[student.status] ?? STUDENT_STATUS_CHIP_SX.not_started;
  const progressColor = getStudentProgressColor(student.progressPercentage);
  const progressValue = Math.min(100, Math.max(0, student.progressPercentage ?? 0));

  const currentLesson =
    student.currentLessonName ??
    (student.status === 'not_started' ? '—' : 'Chưa xác định');

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: STUDENT_TABLE_GRID_COLUMNS,
        },
        alignItems: { xs: 'stretch', md: 'center' },
        gap: { xs: 1.25, md: 2 },
        px: { xs: 2, sm: 2.25 },
        py: { xs: 2, md: 1.75 },
        borderBottom: `1px solid ${BORDER_SUBTLE}`,
        bgcolor: '#FFFFFF',
        transition: 'background-color 0.15s ease',
        '&:hover': { bgcolor: SURFACE_SUBTLE },
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {/* Học viên */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
        <Avatar
          src={student.avatarUrl || undefined}
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(PRIMARY, 0.12),
            color: PRIMARY,
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {getStudentInitials(student.fullName)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: TEXT,
              lineHeight: 1.35,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {student.fullName}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: MUTED,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {student.email}
          </Typography>
        </Box>
      </Box>

      {/* Trạng thái */}
      <Box>
        <Typography
          sx={{ display: { xs: 'block', md: 'none' }, fontSize: 11, fontWeight: 600, color: MUTED, mb: 0.5 }}
        >
          Trạng thái
        </Typography>
        <Chip
          size="small"
          label={STUDENT_STATUS_LABELS[student.status] ?? student.status}
          sx={{ ...PILL_CHIP_SX, ...statusSx }}
        />
      </Box>

      {/* Tiến độ */}
      <Box sx={{ minWidth: 0 }}>
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 0.5,
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: MUTED }}>Tiến độ</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: TEXT }}>
            {progressValue}%
          </Typography>
        </Box>
        <Typography
          sx={{
            display: { xs: 'none', md: 'block' },
            fontSize: 13,
            fontWeight: 700,
            color: TEXT,
            mb: 0.5,
          }}
        >
          {progressValue}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: 6,
            borderRadius: '999px',
            bgcolor: 'rgba(15,23,42,0.06)',
            '& .MuiLinearProgress-bar': {
              borderRadius: '999px',
              bgcolor: progressColor,
            },
          }}
        />
      </Box>

      {/* Bài học hiện tại */}
      <Box sx={{ minWidth: 0 }}>
        <MobileField label="Bài học hiện tại" value={currentLesson} />
        <DesktopValue value={currentLesson} />
      </Box>

      {/* Lần học gần nhất */}
      <Box sx={{ minWidth: 0 }}>
        <MobileField
          label="Lần học gần nhất"
          value={formatStudentDateTime(student.lastAccessedAt)}
        />
        <DesktopValue value={formatStudentDateTime(student.lastAccessedAt)} />
      </Box>

      {/* Ngày đăng ký */}
      <Box sx={{ minWidth: 0 }}>
        <MobileField
          label="Ngày đăng ký"
          value={formatStudentDate(student.enrollmentDate)}
        />
        <DesktopValue value={formatStudentDate(student.enrollmentDate)} />
      </Box>
    </Box>
  );
}
