import { Box, alpha } from '@mui/material';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import MentorCourseRow from './MentorCourseRow';
import EmptyState from '@/shared/ui/EmptyState';
import Loading from '@/shared/ui/Loading';

export default function MentorCourseList({
  courses,
  loading = false,
  hasAnyCourses = true,
  showReset = false,
  onReset,
  onCreateCourse,
}) {
  if (loading) {
    return <Loading message="Đang tải danh sách khóa học..." />;
  }

  if (courses.length === 0) {
    return (
      <Box
        sx={{
          borderRadius: '20px',
          bgcolor: '#FFFFFF',
          border: `1px solid ${alpha('#0F172A', 0.08)}`,
        }}
      >
        <EmptyState
          embedded
          icon={MenuBookRoundedIcon}
          title={hasAnyCourses ? 'Không tìm thấy khóa học phù hợp' : 'Bạn chưa có khóa học nào'}
          description={
            hasAnyCourses
              ? 'Thử thay đổi từ khóa hoặc bộ lọc.'
              : 'Tạo khóa học đầu tiên để bắt đầu xây dựng nội dung học tập.'
          }
          actionLabel={hasAnyCourses && showReset ? 'Xóa bộ lọc' : !hasAnyCourses ? 'Tạo khóa học' : undefined}
          onAction={hasAnyCourses && showReset ? onReset : !hasAnyCourses ? onCreateCourse : undefined}
        />
      </Box>
    );
  }

  //console.log("adsfadsf" + courses.map((c) => console.log(c)));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {courses.map((course) => (
        <MentorCourseRow key={course.CourseId} course={course} />
      ))}
    </Box>
  );
}
