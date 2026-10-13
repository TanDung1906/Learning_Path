import AppPagination from "@/shared/ui/AppPagination";

/**
 * Wrapper pagination cho trang Danh sach khoa hoc (/courses).
 * Chi config page size o day; logic hien thi nam trong AppPagination.
 */

// So khoa hoc moi trang - CourseListPage import constant nay de slice du lieu
export const COURSE_LIST_PAGE_SIZE = 16;

export default function CourseListPagination(props) {
  return <AppPagination {...props} />;
}
