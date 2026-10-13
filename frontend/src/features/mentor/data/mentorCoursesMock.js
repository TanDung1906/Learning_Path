/**
 * Mock data for Mentor Courses page.
 * Replace with API responses via mentorCourseService.js
 */

export const mentorCoursesMock = [
  {
    courseId: 1,
    courseName: 'Tiếng Anh Thương Mại & Giao Tiếp Công Sở',
    description:
      'Nắm vững thuật ngữ kinh doanh, cách viết email chuyên nghiệp và văn hóa giao tiếp doanh nghiệp.',
    thumbnail: null,
    categoryId: 1,
    categoryName: 'Giao tiếp',
    levelId: 2,
    levelName: 'Trung cấp',
    instructorId: 3,
    instructorName: 'Mentor Demo',
    rating: 4.7,
    totalLessons: 24,
    totalNodes: 4,
    totalMaterials: 18,
    studentCount: 128,
    status: 'published',
    createdAt: '2025-11-12T08:00:00.000Z',
    updatedAt: '2026-03-18T10:30:00.000Z',
  },
  {
    courseId: 2,
    courseName: 'Tiếng Anh Chuyên Ngành Tài Chính - Ngân Hàng',
    description:
      'Hệ thống từ vựng về thị trường tiền tệ, tín dụng, báo cáo tài chính và nghiệp vụ ngân hàng quốc tế.',
    thumbnail: null,
    categoryId: 2,
    categoryName: 'TOEIC',
    levelId: 3,
    levelName: 'Nâng cao',
    instructorId: 3,
    instructorName: 'Mentor Demo',
    rating: 4.5,
    totalLessons: 32,
    totalNodes: 5,
    totalMaterials: 22,
    studentCount: 86,
    status: 'published',
    createdAt: '2025-10-05T08:00:00.000Z',
    updatedAt: '2026-02-28T14:15:00.000Z',
  },
  {
    courseId: 3,
    courseName: 'Tiếng Anh Giao Tiếp Đời Sống Hàng Ngày',
    description:
      'Luyện tập các tình huống giao tiếp thường nhật: chào hỏi, giới thiệu bản thân, hỏi đường và duy trì hội thoại.',
    thumbnail: null,
    categoryId: 1,
    categoryName: 'Giao tiếp',
    levelId: 1,
    levelName: 'Cơ bản',
    instructorId: 3,
    instructorName: 'Mentor Demo',
    rating: 4.3,
    totalLessons: 16,
    totalNodes: 3,
    totalMaterials: 12,
    studentCount: 54,
    status: 'published',
    createdAt: '2026-01-20T08:00:00.000Z',
    updatedAt: '2026-04-02T09:00:00.000Z',
  },
  {
    courseId: 4,
    courseName: 'Tiếng Anh Đàm Phán & Hợp Đồng Thương Mại',
    description:
      'Ngôn từ thương lượng giá cả, chốt sale và đọc hiểu các điều khoản pháp lý trong hợp đồng kinh tế.',
    thumbnail: null,
    categoryId: 3,
    categoryName: 'IELTS',
    levelId: 3,
    levelName: 'Nâng cao',
    instructorId: 3,
    instructorName: 'Mentor Demo',
    rating: null,
    totalLessons: 17,
    totalNodes: 7,
    totalMaterials: 15,
    studentCount: 0,
    status: 'draft',
    createdAt: '2026-04-10T08:00:00.000Z',
    updatedAt: '2026-04-12T16:45:00.000Z',
  },
  {
    courseId: 5,
    courseName: 'Tiếng Anh Du Lịch & Khám Phá',
    description:
      'Từ vựng và mẫu câu khi đi nước ngoài: sân bay, khách sạn, nhà hàng và xử lý sự cố.',
    thumbnail: null,
    categoryId: 4,
    categoryName: 'Ngữ pháp',
    levelId: 1,
    levelName: 'Cơ bản',
    instructorId: 3,
    instructorName: 'Mentor Demo',
    rating: null,
    totalLessons: 8,
    totalNodes: 4,
    totalMaterials: 6,
    studentCount: 0,
    status: 'draft',
    createdAt: '2026-04-15T08:00:00.000Z',
    updatedAt: '2026-04-15T08:00:00.000Z',
  },
];

/** Shape for a dedicated stats API response */
export const mentorCourseStatsMock = {
  totalCourses: 5,
  publishedCount: 3,
  draftCount: 2,
  totalStudents: 268,
};

export const mentorCourseCreateOptionsMock = {
  categoryOptions: [
    { value: 4, label: 'Ngữ pháp' },
    { value: 3, label: 'IELTS' },
    { value: 1, label: 'Giao tiếp' },
    { value: 2, label: 'TOEIC' },
  ],
  levelOptions: [
    { value: 1, label: 'Cơ bản' },
    { value: 2, label: 'Trung cấp' },
    { value: 3, label: 'Nâng cao' },
  ],
};

export const mentorCourseFilterOptionsMock = {
  statusOptions: [
    { value: 'all', label: 'Tất cả' },
    { value: 'published', label: 'Đã xuất bản' },
    { value: 'draft', label: 'Bản nháp' },
  ],
  // categoryOptions: [
  //   { value: 'all', label: 'Tất cả danh mục' },
  //   { value: '1', label: 'Giao tiếp' },
  //   { value: '2', label: 'TOEIC' },
  //   { value: '3', label: 'IELTS' },
  //   { value: '4', label: 'Ngữ pháp' },
  // ],
  // levelOptions: [
  //   { value: 'all', label: 'Tất cả trình độ' },
  //   { value: '1', label: 'Cơ bản' },
  //   { value: '2', label: 'Trung cấp' },
  //   { value: '3', label: 'Nâng cao' },
  // ],
  sortOptions: [
    { value: 'updated_desc', label: 'Mới cập nhật' },
    { value: 'created_desc', label: 'Mới tạo' },
    { value: 'students_desc', label: 'Nhiều học viên' },
    { value: 'rating_desc', label: 'Đánh giá cao' },
    { value: 'name_asc', label: 'Tên A-Z' },
  ],
  pageSizeOptions: [
    { value: 8, label: '8 / trang' },
    { value: 10, label: '10 / trang' },
  ],
};

/** @deprecated Use mentorCourseStatsMock */
export const courseStatsMock = mentorCourseStatsMock;

/** @deprecated Use mentorCourseFilterOptionsMock */
export const filterOptionsMock = mentorCourseFilterOptionsMock;
