/**
 * Mock enrolled + saved courses for student MyCoursesListPage.
 * TODO: replace with getMyCoursesApi when backend returns full progress tree.
 */

export const MOCK_ENROLLED_COURSES = [
  {
    courseId: 1,
    courseName: 'Tiếng Anh Thương Mại & Giao Tiếp Công Sở',
    category: 'Giao tiếp',
    level: 'Trung cấp',
    instructor: 'Nguyễn Minh An',
    totalLessons: 8,
    totalNodes: 2,
    totalMaterials: 5,
    progressPercentage: 40,
    enrollmentStatus: 'learning',
    currentStage: 1,
    currentLesson: 3,
    lastActivity: '2 ngày trước',
    lastActivityOrder: 2,
    thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    modules: [
      { id: 1, title: 'Chặng 1: Nền tảng từ vựng', completedLessons: 3, totalLessons: 3, status: 'completed' },
      { id: 2, title: 'Chặng 2: Email & giao tiếp', completedLessons: 1, totalLessons: 4, status: 'learning' },
    ],
    currentLessonDetail: {
      stage: 'Chặng 2: Email & giao tiếp',
      lesson: 'Bài 3',
      title: 'Cấu trúc email chuyên nghiệp',
    },
    recentLessons: [
      { id: 1, label: 'Bài 2 · Từ vựng cốt lõi công sở', isCompleted: true },
      { id: 2, label: 'Bài 3 · Cấu trúc email chuyên nghiệp', isCompleted: false, isCurrent: true },
    ],
  },
  {
    courseId: 3,
    courseName: 'Luyện viết IELTS Task 2',
    category: 'IELTS',
    level: 'Nâng cao',
    instructor: 'Trần Quốc Huy',
    totalLessons: 16,
    totalNodes: 6,
    totalMaterials: 20,
    progressPercentage: 75,
    enrollmentStatus: 'learning',
    currentStage: 4,
    currentLesson: 11,
    lastActivity: 'Hôm qua',
    lastActivityOrder: 1,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf93a163b78?w=800&q=80',
    modules: [
      { id: 1, title: 'Chặng 1: Nền tảng', completedLessons: 3, totalLessons: 3, status: 'completed' },
      { id: 2, title: 'Chặng 2: Kỹ năng chính', completedLessons: 4, totalLessons: 4, status: 'completed' },
      { id: 3, title: 'Chặng 3: Luyện đề nâng cao', completedLessons: 2, totalLessons: 5, status: 'learning' },
      { id: 4, title: 'Chặng 4: Ôn tập tổng hợp', completedLessons: 0, totalLessons: 4, status: 'not_started' },
    ],
    currentLessonDetail: {
      stage: 'Chặng 3: Luyện đề nâng cao',
      lesson: 'Bài 11',
      title: 'Phân tích đề bài phức tạp',
    },
    recentLessons: [
      { id: 1, label: 'Bài 9 · Mở bài hiệu quả', isCompleted: true },
      { id: 2, label: 'Bài 10 · Thân bài logic', isCompleted: true },
      { id: 3, label: 'Bài 11 · Phân tích đề bài phức tạp', isCompleted: false, isCurrent: true },
    ],
  },
  {
    courseId: 8,
    courseName: 'Ngữ pháp tiếng Anh từ cơ bản đến nâng cao',
    category: 'Ngữ pháp',
    level: 'Cơ bản',
    instructor: 'Lê Thu Hà',
    totalLessons: 9,
    totalNodes: 3,
    totalMaterials: 8,
    progressPercentage: 100,
    enrollmentStatus: 'completed',
    lastActivity: '5 ngày trước',
    lastActivityOrder: 5,
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    modules: [
      { id: 1, title: 'Chương 1: Thì cơ bản', completedLessons: 3, totalLessons: 3, status: 'completed' },
      { id: 2, title: 'Chương 2: Câu phức & điều kiện', completedLessons: 3, totalLessons: 3, status: 'completed' },
    ],
    currentLessonDetail: null,
    recentLessons: [
      { id: 1, label: 'Bài 7 · Mệnh đề quan hệ', isCompleted: true },
      { id: 2, label: 'Bài 8 · Câu điều kiện loại 1 và 2', isCompleted: true },
      { id: 3, label: 'Bài 9 · Bài kiểm tra cuối khóa', isCompleted: true },
    ],
  },
  {
    courseId: 11,
    courseName: 'Phát âm chuẩn giọng Mỹ - Anh',
    category: 'Phát âm',
    level: 'Trung cấp',
    instructor: 'Phạm Văn Đức',
    totalLessons: 13,
    totalNodes: 5,
    totalMaterials: 15,
    progressPercentage: 55,
    enrollmentStatus: 'learning',
    currentStage: 2,
    currentLesson: 7,
    lastActivity: '3 ngày trước',
    lastActivityOrder: 3,
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    modules: [
      { id: 1, title: 'Chương 1: Nguyên âm', completedLessons: 4, totalLessons: 4, status: 'completed' },
      { id: 2, title: 'Chương 2: Phụ âm & liên kết âm', completedLessons: 2, totalLessons: 5, status: 'learning' },
    ],
    currentLessonDetail: {
      stage: 'Chương 2: Phụ âm & liên kết âm',
      lesson: 'Bài 7',
      title: 'Kỹ thuật liên kết âm tự nhiên',
    },
    recentLessons: [
      { id: 1, label: 'Bài 5 · Luyện âm /æ/, /ʌ/, /ɑ:/', isCompleted: true },
      { id: 2, label: 'Bài 6 · Âm /θ/ và /ð/', isCompleted: true },
      { id: 3, label: 'Bài 7 · Kỹ thuật liên kết âm tự nhiên', isCompleted: false, isCurrent: true },
    ],
  },
];

export const MOCK_SAVED_CATALOG = [
  {
    courseId: 2,
    courseName: 'Tiếng Anh Chuyên Ngành Tài Chính - Ngân Hàng',
    category: 'Giao tiếp',
    level: 'Trung cấp',
    instructor: 'Mentor Demo',
    totalLessons: 12,
    totalNodes: 4,
    totalMaterials: 12,
    progressPercentage: 0,
    enrollmentStatus: 'none',
    savedAtOrder: 1,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },
  {
    courseId: 4,
    courseName: 'TOEIC Listening & Reading 750+',
    category: 'TOEIC',
    level: 'Trung cấp',
    instructor: 'Mentor Demo',
    totalLessons: 20,
    totalNodes: 5,
    totalMaterials: 18,
    progressPercentage: 0,
    enrollmentStatus: 'none',
    savedAtOrder: 2,
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
  },
  {
    courseId: 6,
    courseName: 'Phát âm chuẩn & Intonation',
    category: 'Phát âm',
    level: 'Trung cấp',
    instructor: 'Đỗ Khánh Vy',
    totalLessons: 10,
    totalNodes: 3,
    totalMaterials: 9,
    progressPercentage: 0,
    enrollmentStatus: 'none',
    savedAtOrder: 3,
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
  },
  {
    courseId: 7,
    courseName: 'IELTS Speaking Part 2 & 3',
    category: 'IELTS',
    level: 'Trung cấp',
    instructor: 'Mentor Demo',
    totalLessons: 11,
    totalNodes: 4,
    totalMaterials: 14,
    progressPercentage: 0,
    enrollmentStatus: 'none',
    savedAtOrder: 4,
    thumbnail: null,
  },
];

const ENROLLED_IDS = new Set(MOCK_ENROLLED_COURSES.map((c) => c.courseId));

function mapApiCourse(c) {
  return {
    courseId: c.CourseId ?? c.courseId,
    courseName: c.CourseName ?? c.courseName,
    description: c.Description ?? c.description ?? '',
    thumbnail: c.Thumbnail ?? c.thumbnail ?? null,
    category: c.Category ?? c.category ?? 'Giao tiếp',
    level: c.Level ?? c.level ?? 'Cơ bản',
    instructor: c.Instructor ?? c.instructor ?? '',
    totalLessons: c.TotalLessons ?? c.totalLessons ?? 0,
    rating: c.Rating ?? c.rating ?? 4.5,
    progressPercentage: c.ProgressPercentage ?? c.progressPercentage ?? 0,
    enrollmentStatus:
      (c.ProgressPercentage ?? c.progressPercentage ?? 0) >= 100 ? 'completed' : 'learning',
    lastActivityOrder: 99,
    modules: [],
    currentLessonDetail: null,
    recentLessons: [],
  };
}

/**
 * Build my-courses list: enrolled mock + saved catalog filtered by savedIds.
 */
export function getMyCoursesMock({ savedIds, isSaved }) {
  const enrolled = MOCK_ENROLLED_COURSES.map((course) => ({
    ...course,
    isSaved: isSaved(course.courseId),
  }));

  const savedOnly = MOCK_SAVED_CATALOG.filter(
    (course) => savedIds.has(course.courseId) && !ENROLLED_IDS.has(course.courseId),
  ).map((course) => ({ ...course, isSaved: true }));

  return [...enrolled, ...savedOnly];
}

/**
 * Prefer API courses when available; otherwise fall back to mock list.
 */
export function resolveMyCoursesList({ apiCourses, savedIds, isSaved }) {
  if (Array.isArray(apiCourses) && apiCourses.length > 0) {
    const enrolled = apiCourses.map(mapApiCourse).map((course) => ({
      ...course,
      isSaved: isSaved(course.courseId),
    }));
    const enrolledIds = new Set(enrolled.map((c) => c.courseId));
    const savedOnly = MOCK_SAVED_CATALOG.filter(
      (course) => savedIds.has(course.courseId) && !enrolledIds.has(course.courseId),
    ).map((course) => ({ ...course, isSaved: true }));
    return [...enrolled, ...savedOnly];
  }

  return getMyCoursesMock({ savedIds, isSaved });
}
