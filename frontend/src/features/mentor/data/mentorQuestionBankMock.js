/**
 * Mock data cho Ngân hàng câu hỏi của Mentor.
 * Replace bằng API khi backend sẵn sàng.
 *
 * CẤU TRÚC:
 *   - mentorQuestionBankMock: danh sách khóa học demo
 *   - mentorCourseChaptersOutlineMock: mục lục chương theo courseId
 *   - mentorCourseChapterBanksMock: bank theo chương
 *   - mentorQuestionBankFilterOptionsMock: options cho toolbar lọc
 */

export const mentorQuestionBankMock = [
  {
    CourseId: 1,
    CourseName: 'Tiếng Anh Thương Mại & Giao Tiếp Công Sở',
    Description:
      'Nắm vững thuật ngữ kinh doanh, cách viết email chuyên nghiệp và văn hóa giao tiếp doanh nghiệp.',
    IsPublished: 1,
    CategoryDisplayName: 'Tiếng Anh thương mại',
    LevelDisplayName: 'Trung cấp',
    totalQuestionCount: 85,
    publishedQuestionCount: 60,
    draftQuestionCount: 25,
    chapterWithQuestionCount: 3,
    quizCount: 4,
    CourseUpdateAt: '2026-03-18T10:30:00.000Z',
  },
  {
    CourseId: 2,
    CourseName: 'IELTS Band 6.5 – Luyện thi Toàn diện',
    Description:
      'Chiến lược làm bài 4 kỹ năng Listening, Reading, Writing, Speaking nhắm mục tiêu band 6.5+.',
    IsPublished: 1,
    CategoryDisplayName: 'Luyện thi',
    LevelDisplayName: 'Nâng cao',
    totalQuestionCount: 120,
    publishedQuestionCount: 95,
    draftQuestionCount: 25,
    chapterWithQuestionCount: 5,
    quizCount: 8,
    CourseUpdateAt: '2026-04-02T14:15:00.000Z',
  },
  {
    CourseId: 3,
    CourseName: 'Tiếng Anh Giao Tiếp Đời Sống Hằng Ngày',
    Description:
      'Luyện tập các tình huống giao tiếp thường nhật như mua sắm, hỏi đường, nhà hàng, du lịch.',
    IsPublished: 1,
    CategoryDisplayName: 'Giao tiếp',
    LevelDisplayName: 'Cơ bản',
    totalQuestionCount: 64,
    publishedQuestionCount: 64,
    draftQuestionCount: 0,
    chapterWithQuestionCount: 4,
    quizCount: 5,
    CourseUpdateAt: '2026-02-10T09:00:00.000Z',
  },
];

/** Map mock course → item cho MentorQuestionBankList. */
export function mapQuestionBankMockToListItems(items = mentorQuestionBankMock) {
  return items.map((item) => ({
    CourseId: item.CourseId,
    CourseName: item.CourseName,
    CourseDescription: item.Description,
    IsPublished: Boolean(item.IsPublished),
    TotalQuestion: item.totalQuestionCount ?? 0,
    TotalQuestionIsPublic: item.publishedQuestionCount ?? 0,
    TotalDraftQuestion: item.draftQuestionCount ?? 0,
    ChapterWithQuestionCount: item.chapterWithQuestionCount ?? 0,
    QuizCount: item.quizCount ?? 0,
    UpdatedAt: item.CourseUpdateAt,
    Thumbnail: null,
  }));
}

/** Mục lục chương demo cho editor (cột phải) — cùng shape với GET .../chapters. */
export const mentorCourseChaptersOutlineMock = {
  1: [
    {
      PathId: 1,
      PathName: 'Khởi động & Làm quen thuật ngữ',
      Order: 1,
      Nodes: [{ NodeId: 101, NodeName: 'Chào hỏi công sở', NodeOrder: 1 }],
    },
    {
      PathId: 2,
      PathName: 'Kỹ năng viết Email chuyên nghiệp',
      Order: 2,
      Nodes: [{ NodeId: 201, NodeName: 'Cấu trúc email', NodeOrder: 1 }],
    },
  ],
  3: [
    {
      PathId: 1,
      PathName: 'Chào hỏi & Giới thiệu bản thân',
      Order: 1,
      Nodes: [{ NodeId: 301, NodeName: 'Hello & Hi', NodeOrder: 1 }],
    },
    {
      PathId: 2,
      PathName: 'Mua sắm & Hỏi giá',
      Order: 2,
      Nodes: [{ NodeId: 302, NodeName: 'How much is it?', NodeOrder: 1 }],
    },
    {
      PathId: 3,
      PathName: 'Nhà hàng & Gọi món',
      Order: 3,
      Nodes: [{ NodeId: 303, NodeName: 'Can I have the menu?', NodeOrder: 1 }],
    },
  ],
};

/** Bank theo chương — demo MentorCourseQuestionsPage. */
export const mentorCourseChapterBanksMock = {
  3: [
    {
      id: 3001,
      chapterId: 1,
      chapterTitle: 'Chào hỏi & Giới thiệu bản thân',
      title: 'Chào hỏi & Giới thiệu bản thân',
      totalQuestionCount: 15,
      updatedAt: '2026-04-01T10:00:00.000Z',
    },
    {
      id: 3002,
      chapterId: 2,
      chapterTitle: 'Mua sắm & Hỏi giá',
      title: 'Mua sắm & Hỏi giá',
      totalQuestionCount: 18,
      updatedAt: '2026-03-28T14:30:00.000Z',
    },
  ],
};

export function getMockChapterBanksForCourse(courseId) {
  return mentorCourseChapterBanksMock[Number(courseId)] ?? [];
}

export function getMockCourseFromQuestionBank(courseId) {
  return mentorQuestionBankMock.find((item) => String(item.CourseId) === String(courseId)) ?? null;
}

export function getMockChaptersForCourse(courseId) {
  return mentorCourseChaptersOutlineMock[Number(courseId)] ?? [];
}

export const mentorQuestionBankFilterOptionsMock = {
  statusOptions: [
    { value: 'all', label: 'Tất cả' },
    { value: 'published', label: 'Đã xuất bản' },
    { value: 'draft', label: 'Bản nháp' },
  ],
  questionStatusOptions: [
    { value: 'all', label: 'Tất cả câu hỏi' },
    { value: 'has_draft', label: 'Có câu hỏi nháp' },
    { value: 'all_published', label: 'Xuất bản hết' },
    { value: 'empty', label: 'Chưa có câu hỏi' },
  ],
  sortOptions: [
    { value: 'updated_desc', label: 'Mới cập nhật' },
    { value: 'name_asc', label: 'Tên A-Z' },
    { value: 'questions_desc', label: 'Nhiều câu hỏi nhất' },
  ],
};
