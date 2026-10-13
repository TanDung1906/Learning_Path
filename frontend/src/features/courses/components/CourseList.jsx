import { Box, Grid } from "@mui/material";
import CourseCard from "./CourseCard";
import Loading from "@/shared/ui/Loading";
import EmptyState from "@/shared/ui/EmptyState";

export default function CourseList({
  courses = [],
  loading = false,
  emptyTitle = "Chưa có khóa học",
  emptyDescription = "Hãy quay lại sau hoặc thử bộ lọc khác.",
  onEnroll,
  onCourseClick,
  columns = { xs: 12, sm: 6, md: 4 },
}) {
  if (loading) {
    return <Loading message="Đang tải khóa học..." />;
  }

  if (!courses.length) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <Grid container spacing={2.5}>
      {courses.map((course) => (
        <Grid key={course.id ?? course.title} size={columns}>
          <CourseCard
            course={course}
            onEnroll={onEnroll}
            onClick={onCourseClick ? () => onCourseClick(course) : undefined}
          />
        </Grid>
      ))}
    </Grid>
  );
}
