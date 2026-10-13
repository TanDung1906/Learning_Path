import { Typography } from '@mui/material';
import { CARD_SECTION_META_SX } from './mentorCourseCreateStyles';

export default function MentorCourseStudentsSummary({ stats, loading = false }) {
  const meta = loading
    ? 'Đang tải thống kê...'
    : `${stats.totalStudents ?? 0} học viên · ${stats.learningCount ?? 0} đang học · ${stats.completedCount ?? 0} hoàn thành · Tiến độ TB ${stats.averageProgress ?? 0}%`;

  return <Typography sx={CARD_SECTION_META_SX}>{meta}</Typography>;
}
