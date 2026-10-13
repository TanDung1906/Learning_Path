import { Box, Typography } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { MUTED, TEXT } from './mentorCourseCreateStyles';
import { formatCourseRating } from '@/features/mentor/utils/mentorCourseUtils';

function getCourseAuthorName(course) {
  return (
    course?.InStructorName
    ?? course?.InstructorName
    ?? course?.instructorName
    ?? '—'
  );
}

function MetricInline({ icon: Icon, label, value, iconColor }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
      <Icon sx={{ fontSize: 16, color: iconColor, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 13, color: MUTED, lineHeight: 1.4 }}>
        {label}:{' '}
        <Box component="span" sx={{ color: TEXT, fontWeight: 700 }}>
          {value}
        </Box>
      </Typography>
    </Box>
  );
}

export default function MentorCourseMetricsInline({ course }) {
  const metrics = [
    {
      icon: PersonOutlineOutlinedIcon,
      label: 'Tác giả',
      value: getCourseAuthorName(course),
      iconColor: '#4338CA',
    },
    {
      icon: StarRoundedIcon,
      label: 'Đánh giá',
      value: formatCourseRating(course),
      iconColor: '#D97706',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: { xs: 1.25, sm: 2, md: 2.5 },
        mt: 1.25,
      }}
    >
      {metrics.map((metric) => (
        <MetricInline key={metric.label} {...metric} />
      ))}
    </Box>
  );
}
