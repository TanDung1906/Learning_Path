/**
 * Extended course detail mocks for student CourseDetailPage.
 * TODO: replace with fetchCourseDetail(courseId) when backend is ready.
 */

export const EXTRA_COURSE_DETAILS = {
  18: {
    id: 18,
    title: 'IELTS Listening: Chiến lược làm bài & Luyện đề',
    shortDescription:
      'Nắm vững chiến lược làm bài IELTS Listening từ Section 1 đến Section 4, luyện nghe đa dạng giọng Anh-Anh/Anh-Mỹ và làm quen format đề thi thực tế Band 6.5–7.5.',
    thumbnail:
      'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=900&q=80',
    category: 'IELTS',
    level: 'Nâng cao',
    instructor: 'Trần Quốc Huy',
    isEnrolled: false,
    progress: 0,
    lessonCount: 14,
    stageCount: 4,
    materialCount: 22,
    duration: '11 giờ',
    updatedAt: '26/05/2026',
    rating: 4.8,
    reviewCount: 287,
    studentCount: 8934,
    isFree: true,
    prerequisites: [
      { id: 8, title: 'Ngữ pháp tiếng Anh từ cơ bản đến nâng cao' },
      { id: 3, title: 'Luyện viết IELTS Task 2' },
    ],
    outcomes: [
      'Nhận diện dạng câu hỏi thường gặp: form completion, map, multiple choice, matching',
      'Luyện kỹ năng dự đoán từ khóa và paraphrase trước khi nghe',
      'Xử lý bẫy số, tên riêng và đồng nghĩa trong Section 3–4',
      'Quản lý thời gian và kiểm tra đáp án hiệu quả trong phòng thi',
      'Làm quen 4 full test listening mô phỏng đề thi thật',
    ],
    modules: [
      {
        id: 1,
        title: 'Làm quen format & chiến lược cơ bản',
        lessonCount: 3,
        materialCount: 5,
        lessons: [
          {
            id: 1,
            title: 'Tổng quan IELTS Listening & cách chấm điểm',
            type: 'video',
            duration: '12 phút',
            isPreview: true,
            isCompleted: false,
          },
          {
            id: 2,
            title: 'Kỹ thuật đọc trước câu hỏi (previewing)',
            type: 'video',
            duration: '16 phút',
            isPreview: false,
            isCompleted: false,
          },
          {
            id: 3,
            title: 'Từ vựng chủ đề thường gặp Section 1–2',
            type: 'article',
            duration: '14 phút',
            isPreview: false,
            isCompleted: false,
          },
        ],
      },
      {
        id: 2,
        title: 'Section 1 & 2 — Hội thoại & monologue ngắn',
        lessonCount: 4,
        materialCount: 6,
        lessons: [
          {
            id: 4,
            title: 'Form completion: điền thông tin cá nhân',
            type: 'video',
            duration: '18 phút',
            isPreview: true,
            isCompleted: false,
          },
          {
            id: 5,
            title: 'Map & plan labelling trong bối cảnh du lịch',
            type: 'video',
            duration: '20 phút',
            isPreview: false,
            isCompleted: false,
          },
          {
            id: 6,
            title: 'Multiple choice — bẫy paraphrase thường gặp',
            type: 'article',
            duration: '15 phút',
            isPreview: false,
            isCompleted: false,
          },
          {
            id: 7,
            title: 'Mini-test Section 1 & 2',
            type: 'article',
            duration: '22 phút',
            isPreview: false,
            isCompleted: false,
          },
        ],
      },
      {
        id: 3,
        title: 'Section 3 & 4 — Hội thoại học thuật & bài giảng',
        lessonCount: 4,
        materialCount: 6,
        lessons: [
          {
            id: 8,
            title: 'Matching speakers với quan điểm',
            type: 'video',
            duration: '19 phút',
            isPreview: false,
            isCompleted: false,
          },
          {
            id: 9,
            title: 'Note completion trong bài giảng học thuật',
            type: 'video',
            duration: '21 phút',
            isPreview: false,
            isCompleted: false,
          },
          {
            id: 10,
            title: 'Theo dõi luồng ý & tín hiệu chuyển ý (signposting)',
            type: 'article',
            duration: '13 phút',
            isPreview: false,
            isCompleted: false,
          },
          {
            id: 11,
            title: 'Mini-test Section 3 & 4',
            type: 'article',
            duration: '25 phút',
            isPreview: false,
            isCompleted: false,
          },
        ],
      },
      {
        id: 4,
        title: 'Luyện đề full test & chữa chi tiết',
        lessonCount: 3,
        materialCount: 5,
        lessons: [
          {
            id: 12,
            title: 'Full Test 1 — làm bài có hướng dẫn thời gian',
            type: 'video',
            duration: '35 phút',
            isPreview: false,
            isCompleted: false,
          },
          {
            id: 13,
            title: 'Chữa đề & phân tích lỗi sai phổ biến',
            type: 'video',
            duration: '28 phút',
            isPreview: false,
            isCompleted: false,
          },
          {
            id: 14,
            title: 'Full Test 2 + checklist ôn tập trước thi',
            type: 'article',
            duration: '40 phút',
            isPreview: false,
            isCompleted: false,
          },
        ],
      },
    ],
  },
};

export function getExtraCourseDetail(courseId) {
  return EXTRA_COURSE_DETAILS[Number(courseId)] ?? null;
}
