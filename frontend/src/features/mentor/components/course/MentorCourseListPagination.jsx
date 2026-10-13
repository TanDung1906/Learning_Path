import AppPagination from '@/shared/ui/AppPagination';

/** Số khóa học mỗi trang — MentorCoursesPage import constant này để slice dữ liệu */
export const MENTOR_COURSE_LIST_PAGE_SIZE = 8;

export default function MentorCourseListPagination(props) {
  return <AppPagination {...props} />;
}
