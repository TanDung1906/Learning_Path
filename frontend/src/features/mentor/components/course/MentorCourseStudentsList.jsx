import { Box, Typography } from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import EmptyState from '@/shared/ui/EmptyState';
import Loading from '@/shared/ui/Loading';
import MentorCourseStudentRow from './MentorCourseStudentRow';
import { MUTED, DETAIL_PANEL_SX, DETAIL_PANEL_HEADER_SX } from './mentorCourseCreateStyles';
import {
  STUDENT_TABLE_GRID_COLUMNS,
  STUDENT_TABLE_HEADERS,
} from '@/features/mentor/utils/mentorCourseStudentsUtils';

const TABLE_ROW_SX = {
  display: { xs: 'none', md: 'grid' },
  gridTemplateColumns: STUDENT_TABLE_GRID_COLUMNS,
  gap: 2,
  px: 2.25,
  alignItems: 'center',
};

function ListHeader() {
  return (
    <Box
      sx={{
        ...TABLE_ROW_SX,
        py: 1.25,
        ...DETAIL_PANEL_HEADER_SX,
      }}
    >
      {STUDENT_TABLE_HEADERS.map((label) => (
        <Typography
          key={label}
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: MUTED,
          }}
        >
          {label}
        </Typography>
      ))}
    </Box>
  );
}

export default function MentorCourseStudentsList({
  students,
  loading,
  hasAnyStudents,
  isFiltered,
  onClearFilters,
}) {
  if (loading) {
    return <Loading message="Đang tải danh sách học viên..." />;
  }

  if (!hasAnyStudents) {
    return (
      <EmptyState
        embedded
        icon={GroupsOutlinedIcon}
        title="Chưa có học viên nào"
        description="Khi học viên đăng ký khóa học, danh sách và tiến độ sẽ hiển thị tại đây."
      />
    );
  }

  if (students.length === 0 && isFiltered) {
    return (
      <EmptyState
        embedded
        icon={SearchOffOutlinedIcon}
        title="Không tìm thấy học viên phù hợp"
        description="Thử thay đổi từ khóa hoặc bộ lọc."
        actionLabel="Xóa bộ lọc"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <Box sx={DETAIL_PANEL_SX}>
      <ListHeader />
      {students.map((student) => (
        <MentorCourseStudentRow
          key={student.userId}
          student={student}
        />
      ))}
    </Box>
  );
}
