/**
 * Mock detail payloads for Mentor course detail page.
 * Replace via fetchMentorCourseDetail(courseId) in mentorCourseService.js
 */

/** Khóa demo đầy đủ: 9 chương, mỗi chương 2–3 bài */
const course1Paths = [
  {
    PathId: 1,
    PathName: 'Khởi động & Làm quen thuật ngữ',
    Description:
      'Nắm vững từ vựng nền tảng và các mẫu câu giao tiếp cơ bản trong môi trường công sở quốc tế.',
    nodes: [
      {
        NodeId: 1,
        NodeName: 'Chào hỏi và giới thiệu bản thân',
        NodeOrder: 1,
        Description: 'Luyện các cụm từ chào hỏi, giới thiệu bản thân và hỏi thăm đồng nghiệp.',
        materials: [
          {
            MaterialId: 1,
            MaterialType: 'VIDEO',
            Title: 'Video bài giảng: Chào hỏi công sở',
            MaterialUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            MaterialOrder: 1,
          },
          {
            MaterialId: 2,
            MaterialType: 'TEXT',
            Title: 'Mẫu câu chào hỏi thường dùng',
            MaterialOrder: 2,
            Content:
              '<p>Good morning, everyone. Nice to meet you. My name is Alex and I work in the marketing department. How are you today?</p>',
          },
          {
            MaterialId: 3,
            MaterialType: 'DOC',
            Title: 'Tài liệu PDF: 50 từ vựng cốt lõi',
            MaterialOrder: 3,
            SourceType: 'upload',
            FileName: '50-core-vocabulary.pdf',
            MaterialUrl: null,
          },
          {
            MaterialId: 4,
            MaterialType: 'TEST',
            Title: 'Bài kiểm tra: Trắc nghiệm từ vựng chào hỏi',
            MaterialOrder: 4,
          },
        ],
      },
      {
        NodeId: 2,
        NodeName: 'Thuật ngữ kinh doanh cơ bản',
        NodeOrder: 2,
        Description: 'Làm quen các thuật ngữ thường gặp trong email, cuộc họp và báo cáo.',
        materials: [
          {
            MaterialId: 5,
            MaterialType: 'VIDEO',
            Title: 'Video: Thuật ngữ văn phòng hàng ngày',
            MaterialUrl: 'https://www.youtube.com/watch?v=example-office',
            MaterialOrder: 1,
          },
          {
            MaterialId: 6,
            MaterialType: 'TEXT',
            Title: 'Deadline, agenda và follow-up',
            MaterialOrder: 2,
            Content:
              '<p>Please find the agenda attached. Let us follow up on the action items after the meeting. The deadline for this task is Friday.</p>',
          },
          {
            MaterialId: 7,
            MaterialType: 'DOC',
            Title: 'Tài liệu: Bảng thuật ngữ kinh doanh A-Z',
            MaterialOrder: 3,
            SourceType: 'link',
            MaterialUrl: 'https://example.com/business-glossary.pdf',
          },
          {
            MaterialId: 8,
            MaterialType: 'TEST',
            Title: 'Bài kiểm tra: Ghép thuật ngữ với định nghĩa',
            MaterialOrder: 4,
          },
        ],
      },
    ],
  },
  {
    PathId: 2,
    PathName: 'Kỹ năng viết Email chuyên nghiệp',
    Description:
      'Ứng dụng từ vựng vào email công việc: cấu trúc chuẩn, tone phù hợp và cách xử lý tình huống nhạy cảm.',
    nodes: [
      {
        NodeId: 3,
        NodeName: 'Cấu trúc email chuẩn doanh nghiệp',
        NodeOrder: 1,
        Description: 'Subject line, opening, body, closing và cách ký tên chuyên nghiệp.',
        materials: [
          {
            MaterialId: 9,
            MaterialType: 'VIDEO',
            Title: 'Video: Cấu trúc Email chuẩn',
            MaterialUrl: 'https://www.youtube.com/watch?v=example-email',
            MaterialOrder: 1,
          },
          {
            MaterialId: 10,
            MaterialType: 'TEXT',
            Title: 'Mẫu email xin phép nghỉ và báo cáo tiến độ',
            MaterialOrder: 2,
            Content:
              '<p>Dear Mr. Smith, I am writing to request leave on Monday. Please find my progress report attached. Best regards, Alex.</p>',
          },
          {
            MaterialId: 11,
            MaterialType: 'DOC',
            Title: 'Tài liệu: Checklist email chuyên nghiệp',
            MaterialOrder: 3,
            SourceType: 'upload',
            FileName: 'professional-email-checklist.docx',
            MaterialUrl: null,
          },
          {
            MaterialId: 12,
            MaterialType: 'TEST',
            Title: 'Bài kiểm tra: Sắp xếp đoạn email đúng thứ tự',
            MaterialOrder: 4,
          },
        ],
      },
      {
        NodeId: 4,
        NodeName: 'Thực hành soạn email báo cáo',
        NodeOrder: 2,
        Description: 'Viết email cập nhật dự án, đề xuất giải pháp và phản hồi phản hồi từ sếp.',
        materials: [
          {
            MaterialId: 13,
            MaterialType: 'VIDEO',
            Title: 'Video: Demo soạn email báo cáo tuần',
            MaterialUrl: 'https://www.youtube.com/watch?v=example-report',
            MaterialOrder: 1,
          },
          {
            MaterialId: 14,
            MaterialType: 'TEXT',
            Title: 'Cách diễn đạt kết quả và đề xuất hành động',
            MaterialOrder: 2,
            Content:
              '<p>This week we completed phase one ahead of schedule. I recommend scheduling a review meeting next Tuesday to discuss the next milestone.</p>',
          },
          {
            MaterialId: 15,
            MaterialType: 'DOC',
            Title: 'Tài liệu: Mẫu email báo cáo tuần',
            MaterialOrder: 3,
            SourceType: 'link',
            MaterialUrl: 'https://example.com/weekly-report-template.docx',
          },
          {
            MaterialId: 16,
            MaterialType: 'TEST',
            Title: 'Bài kiểm tra: Soạn Email báo cáo tiến độ dự án',
            MaterialOrder: 4,
          },
        ],
      },
    ],
  },
  {
    PathId: 3,
    PathName: 'Thuyết trình và họp hành công sở',
    PathOrder: 3,
    Description:
      'Kỹ năng mở đầu, trình bày ý chính, trả lời Q&A và tóm tắt cuộc họp bằng tiếng Anh chuyên nghiệp.',
    nodes: [
      {
        NodeId: 5,
        NodeName: 'Mở đầu và giới thiệu nội dung thuyết trình',
        NodeOrder: 1,
        Description: 'Opening, agenda overview và chuyển ý mượt mà giữa các phần.',
        materials: [
          {
            MaterialId: 17,
            MaterialType: 'VIDEO',
            Title: 'Video: Cấu trúc bài thuyết trình 5 phút',
            MaterialOrder: 1,
          },
          {
            MaterialId: 18,
            MaterialType: 'TEXT',
            Title: 'Cụm từ mở đầu và chuyển slide',
            MaterialOrder: 2,
            Content: '<p>Today I would like to walk you through our quarterly results. Let me start with the key highlights.</p>',
          },
        ],
      },
      {
        NodeId: 6,
        NodeName: 'Trình bày biểu đồ và số liệu',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 19,
            MaterialType: 'TEXT',
            Title: 'Diễn giải xu hướng tăng/giảm',
            MaterialOrder: 1,
            Content: '<p>As you can see from the chart, revenue grew by 12% compared to last quarter.</p>',
          },
        ],
      },
      {
        NodeId: 7,
        NodeName: 'Tóm tắt cuộc họp và action items',
        NodeOrder: 3,
        materials: [
          {
            MaterialId: 20,
            MaterialType: 'DOC',
            Title: 'Mẫu biên bản họp (Meeting minutes)',
            MaterialOrder: 1,
            SourceType: 'upload',
            FileName: 'meeting-minutes-template.docx',
          },
        ],
      },
    ],
  },
  {
    PathId: 4,
    PathName: 'Đàm phán và thương lượng cơ bản',
    PathOrder: 4,
    Description: 'Ngôn từ đề xuất, phản đối lịch sự, thỏa hiệp và chốt thỏa thuận.',
    nodes: [
      {
        NodeId: 8,
        NodeName: 'Đưa ra đề xuất và counter-offer',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 21,
            MaterialType: 'VIDEO',
            Title: 'Video: Cách đàm phán giá trong B2B',
            MaterialOrder: 1,
          },
        ],
      },
      {
        NodeId: 9,
        NodeName: 'Xử lý từ chối và phản đối',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 22,
            MaterialType: 'TEXT',
            Title: 'Mẫu câu từ chối lịch sự',
            MaterialOrder: 1,
            Content: '<p>I understand your concern. However, we need to consider the budget constraints.</p>',
          },
        ],
      },
    ],
  },
  {
    PathId: 5,
    PathName: 'Điện thoại và hội nghị trực tuyến',
    PathOrder: 5,
    Description: 'Gọi điện công việc, để lại tin nhắn, tham gia Zoom/Teams và xử lý sự cố kỹ thuật.',
    nodes: [
      {
        NodeId: 10,
        NodeName: 'Gọi điện và chuyển máy nội bộ',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 23,
            MaterialType: 'TEXT',
            Title: 'Script gọi điện xin gặp người phụ trách',
            MaterialOrder: 1,
            Content: '<p>Good afternoon. May I speak with Ms. Johnson, please? I am calling regarding the contract renewal.</p>',
          },
        ],
      },
      {
        NodeId: 11,
        NodeName: 'Tham gia và điều hành cuộc họp online',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 24,
            MaterialType: 'VIDEO',
            Title: 'Video: Etiquette trên Zoom/Teams',
            MaterialOrder: 1,
          },
        ],
      },
      {
        NodeId: 12,
        NodeName: 'Ghi chú và follow-up sau cuộc gọi',
        NodeOrder: 3,
        materials: [],
      },
    ],
  },
  {
    PathId: 6,
    PathName: 'Văn hóa làm việc quốc tế',
    PathOrder: 6,
    Description: 'Khác biệt văn hóa Mỹ – Anh – Á, giao tiếp đa văn hóa và tránh hiểu lầm.',
    nodes: [
      {
        NodeId: 13,
        NodeName: 'Small talk trong môi trường đa quốc gia',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 25,
            MaterialType: 'TEXT',
            Title: 'Chủ đề an toàn cho small talk',
            MaterialOrder: 1,
            Content: '<p>How was your weekend? Did you get a chance to try the new café near the office?</p>',
          },
        ],
      },
      {
        NodeId: 14,
        NodeName: 'Phong cách giao tiếp trực tiếp vs gián tiếp',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 26,
            MaterialType: 'DOC',
            Title: 'Tài liệu: Văn hóa làm việc theo vùng',
            MaterialOrder: 1,
            SourceType: 'link',
            MaterialUrl: 'https://example.com/cross-cultural-workplace.pdf',
          },
        ],
      },
    ],
  },
  {
    PathId: 7,
    PathName: 'Báo cáo và thuyết minh số liệu',
    PathOrder: 7,
    Description: 'Viết executive summary, mô tả KPI và trình bày kết quả kinh doanh.',
    nodes: [
      {
        NodeId: 15,
        NodeName: 'Executive summary ngắn gọn',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 27,
            MaterialType: 'TEXT',
            Title: 'Cấu trúc báo cáo một trang',
            MaterialOrder: 1,
            Content: '<p>Executive Summary: This report outlines Q1 performance and recommends three priority actions.</p>',
          },
        ],
      },
      {
        NodeId: 16,
        NodeName: 'Diễn giải KPI và ROI',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 28,
            MaterialType: 'TEST',
            Title: 'Bài kiểm tra: Thuật ngữ báo cáo tài chính',
            MaterialOrder: 1,
          },
        ],
      },
    ],
  },
  {
    PathId: 8,
    PathName: 'Phản hồi và coaching nội bộ',
    PathOrder: 8,
    Description: 'Đưa nhận feedback, performance review và động viên đồng nghiệp.',
    nodes: [
      {
        NodeId: 17,
        NodeName: 'Đưa feedback mang tính xây dựng',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 29,
            MaterialType: 'VIDEO',
            Title: 'Video: Sandwich feedback method',
            MaterialOrder: 1,
          },
        ],
      },
      {
        NodeId: 18,
        NodeName: 'Nhận phản hồi và lập kế hoạch cải thiện',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 30,
            MaterialType: 'TEXT',
            Title: 'Mẫu câu phản hồi tích cực',
            MaterialOrder: 1,
            Content: '<p>Thank you for the feedback. I will focus on improving my presentation skills this month.</p>',
          },
        ],
      },
      {
        NodeId: 19,
        NodeName: 'Thực hành role-play review cuối kỳ',
        NodeOrder: 3,
        materials: [],
      },
    ],
  },
  {
    PathId: 9,
    PathName: 'Tổng kết và luyện tập tích hợp',
    PathOrder: 9,
    Description: 'Ôn tập toàn khóa, mô phỏng tình huống thực tế và chuẩn bị chứng chỉ nội bộ.',
    nodes: [
      {
        NodeId: 20,
        NodeName: 'Ôn tập từ vựng và mẫu câu trọng tâm',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 31,
            MaterialType: 'DOC',
            Title: 'Flashcard 200 thuật ngữ thương mại',
            MaterialOrder: 1,
            SourceType: 'upload',
            FileName: 'business-english-flashcards.pdf',
          },
        ],
      },
      {
        NodeId: 21,
        NodeName: 'Mô phỏng họp ban giám đốc',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 32,
            MaterialType: 'TEST',
            Title: 'Bài thi tổng hợp cuối khóa',
            MaterialOrder: 1,
          },
        ],
      },
    ],
  },
];

const course3Paths = [
  {
    PathId: 10,
    PathName: 'Giao tiếp hàng ngày',
    Description: null,
    nodes: [
      {
        NodeId: 20,
        NodeName: 'Chào hỏi và làm quen',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 30,
            MaterialType: 'VIDEO',
            Title: 'Video: Hello & Nice to meet you',
            MaterialOrder: 1,
          },
          {
            MaterialId: 31,
            MaterialType: 'TEXT',
            Title: 'Mẫu hội thoại cơ bản',
            MaterialOrder: 2,
            Content: '<p>Hi! How are you today?</p>',
          },
        ],
      },
    ],
  },
];

const course4Paths = [
  {
    PathId: 20,
    PathName: 'Nền tảng đàm phán thương mại',
    PathOrder: 1,
    Description: 'Nguyên tắc BATNA, mục tiêu đàm phán và từ vựng mở đầu cuộc họp.',
    nodes: [
      {
        NodeId: 40,
        NodeName: 'Mở đầu cuộc đàm phán chuyên nghiệp',
        NodeOrder: 1,
        Description: 'Ice-breaker, thiết lập agenda và xác nhận mục tiêu hai bên.',
        materials: [
          {
            MaterialId: 401,
            MaterialType: 'VIDEO',
            Title: 'Video: Opening a B2B negotiation',
            MaterialOrder: 1,
          },
          {
            MaterialId: 402,
            MaterialType: 'TEXT',
            Title: 'Mẫu câu mở đầu và thiết lập khung đàm phán',
            MaterialOrder: 2,
            Content:
              '<p>Thank you for meeting with us today. Our goal is to reach a mutually beneficial agreement on pricing and delivery terms.</p>',
          },
        ],
      },
      {
        NodeId: 41,
        NodeName: 'BATNA và điểm rút lui (walk-away point)',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 403,
            MaterialType: 'DOC',
            Title: 'Tài liệu: Chuẩn bị trước khi vào phòng đàm phán',
            MaterialOrder: 1,
            SourceType: 'upload',
            FileName: 'negotiation-prep-checklist.pdf',
          },
        ],
      },
      {
        NodeId: 42,
        NodeName: 'Thực hành role-play mở đầu',
        NodeOrder: 3,
        materials: [],
      },
    ],
  },
  {
    PathId: 21,
    PathName: 'Thương lượng giá và chiết khấu',
    PathOrder: 2,
    Description: 'Đề xuất giá, counter-offer, bundle deal và điều kiện thanh toán.',
    nodes: [
      {
        NodeId: 43,
        NodeName: 'Đưa ra báo giá và giải thích giá trị',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 404,
            MaterialType: 'TEXT',
            Title: 'Cụm từ justify pricing',
            MaterialOrder: 1,
            Content:
              '<p>Given the quality and after-sales support we provide, our unit price reflects long-term value rather than upfront cost alone.</p>',
          },
        ],
      },
      {
        NodeId: 44,
        NodeName: 'Counter-offer và thỏa hiệp số lượng',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 405,
            MaterialType: 'VIDEO',
            Title: 'Video: Volume discount negotiation',
            MaterialOrder: 1,
          },
        ],
      },
    ],
  },
  {
    PathId: 22,
    PathName: 'Điều khoản thanh toán & giao hàng',
    PathOrder: 3,
    Description: 'Incoterms, payment terms (NET 30, LC), penalty và force majeure cơ bản.',
    nodes: [
      {
        NodeId: 45,
        NodeName: 'Thuật ngữ thanh toán quốc tế',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 406,
            MaterialType: 'TEXT',
            Title: 'NET 30, LC và advance payment',
            MaterialOrder: 1,
            Content:
              '<p>We propose payment terms of NET 30 days upon delivery. Alternatively, we can discuss a letter of credit for the first order.</p>',
          },
        ],
      },
      {
        NodeId: 46,
        NodeName: 'Thời hạn giao hàng và penalty clause',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 407,
            MaterialType: 'DOC',
            Title: 'Mẫu điều khoản giao hàng (Delivery schedule)',
            MaterialOrder: 1,
            SourceType: 'link',
            MaterialUrl: 'https://example.com/delivery-terms-template.docx',
          },
        ],
      },
      {
        NodeId: 47,
        NodeName: 'Thương lượng Incoterms FOB/CIF',
        NodeOrder: 3,
        materials: [],
      },
    ],
  },
  {
    PathId: 23,
    PathName: 'Đọc hiểu hợp đồng thương mại',
    PathOrder: 4,
    Description: 'Cấu trúc hợp đồng mua bán, parties, recitals và definitions.',
    nodes: [
      {
        NodeId: 48,
        NodeName: 'Phần mở đầu và định nghĩa thuật ngữ',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 408,
            MaterialType: 'TEXT',
            Title: 'WHEREAS, Party A, Party B trong hợp đồng',
            MaterialOrder: 1,
            Content:
              '<p>WHEREAS Party A desires to purchase and Party B desires to sell the Products under the terms set forth herein...</p>',
          },
        ],
      },
      {
        NodeId: 49,
        NodeName: 'Scope of work và obligations',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 409,
            MaterialType: 'DOC',
            Title: 'Sample SPA – Sales Purchase Agreement (excerpt)',
            MaterialOrder: 1,
            SourceType: 'upload',
            FileName: 'spa-sample-excerpt.pdf',
          },
        ],
      },
    ],
  },
  {
    PathId: 24,
    PathName: 'Điều khoản pháp lý thường gặp',
    PathOrder: 5,
    Description: 'Bảo mật, IP, warranty, limitation of liability và termination.',
    nodes: [
      {
        NodeId: 50,
        NodeName: 'Confidentiality & NDA trong hợp đồng',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 410,
            MaterialType: 'TEXT',
            Title: 'Điều khoản bảo mật mẫu',
            MaterialOrder: 1,
            Content:
              '<p>Each party agrees to keep confidential all proprietary information disclosed during the term of this Agreement.</p>',
          },
        ],
      },
      {
        NodeId: 51,
        NodeName: 'Warranty và limitation of liability',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 411,
            MaterialType: 'VIDEO',
            Title: 'Video: Reading liability caps in contracts',
            MaterialOrder: 1,
          },
        ],
      },
      {
        NodeId: 52,
        NodeName: 'Termination và notice period',
        NodeOrder: 3,
        materials: [],
      },
    ],
  },
  {
    PathId: 25,
    PathName: 'Giải quyết tranh chấp',
    PathOrder: 6,
    Description: 'Mediation, arbitration, governing law và jurisdiction.',
    nodes: [
      {
        NodeId: 53,
        NodeName: 'Thương lượng cấp cao khi đ deadlock',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 412,
            MaterialType: 'TEXT',
            Title: 'Escalation và mediation clause',
            MaterialOrder: 1,
            Content:
              '<p>Any dispute shall first be resolved through good-faith negotiation. If unresolved within 30 days, the parties agree to mediation.</p>',
          },
        ],
      },
      {
        NodeId: 54,
        NodeName: 'Arbitration vs litigation',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 413,
            MaterialType: 'DOC',
            Title: 'So sánh trọng tài thương mại quốc tế',
            MaterialOrder: 1,
            SourceType: 'link',
            MaterialUrl: 'https://example.com/arbitration-overview.pdf',
          },
        ],
      },
    ],
  },
  {
    PathId: 26,
    PathName: 'Chốt deal và ký kết',
    PathOrder: 7,
    Description: 'Closing language, signing ceremony và post-contract follow-up.',
    nodes: [
      {
        NodeId: 55,
        NodeName: 'Ngôn từ chốt thỏa thuận (closing the deal)',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 414,
            MaterialType: 'TEXT',
            Title: 'Mẫu câu chốt và xác nhận bằng văn bản',
            MaterialOrder: 1,
            Content:
              '<p>We are pleased to confirm our agreement. Please find the draft contract attached for your review and signature.</p>',
          },
        ],
      },
      {
        NodeId: 56,
        NodeName: 'Tổng kết và bài luyện tập cuối khóa',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 415,
            MaterialType: 'TEST',
            Title: 'Bài kiểm tra: Thuật ngữ hợp đồng & đàm phán',
            MaterialOrder: 1,
          },
        ],
      },
    ],
  },
];

const course5Paths = [
  {
    PathId: 30,
    PathName: 'Sân bay & làm thủ tục',
    PathOrder: 1,
    Description: 'Check-in, security, boarding và xử lý hành lý thất lạc.',
    nodes: [
      {
        NodeId: 60,
        NodeName: 'Check-in và chọn ghế',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 501,
            MaterialType: 'VIDEO',
            Title: 'Video: At the airport counter',
            MaterialOrder: 1,
          },
        ],
      },
      {
        NodeId: 61,
        NodeName: 'Qua an ninh và lên máy bay',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 502,
            MaterialType: 'TEXT',
            Title: 'Mẫu hội thoại tại cửa lên máy bay',
            MaterialOrder: 1,
            Content: '<p>May I see your boarding pass, please? Your seat is 12A. Enjoy your flight!</p>',
          },
        ],
      },
    ],
  },
  {
    PathId: 31,
    PathName: 'Khách sạn & lưu trú',
    PathOrder: 2,
    Description: 'Đặt phòng, check-in/out và yêu cầu dịch vụ.',
    nodes: [
      {
        NodeId: 62,
        NodeName: 'Check-in khách sạn',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 503,
            MaterialType: 'TEXT',
            Title: 'I have a reservation under the name...',
            MaterialOrder: 1,
            Content: '<p>I have a reservation under Nguyen. Could I have a room with a city view, please?</p>',
          },
        ],
      },
      {
        NodeId: 63,
        NodeName: 'Báo sự cố và yêu cầu đổi phòng',
        NodeOrder: 2,
        materials: [],
      },
    ],
  },
  {
    PathId: 32,
    PathName: 'Nhà hàng & ẩm thực',
    PathOrder: 3,
    Description: 'Đặt bàn, gọi món, dị ứng thực phẩm và thanh toán.',
    nodes: [
      {
        NodeId: 64,
        NodeName: 'Đặt bàn và gọi món',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 504,
            MaterialType: 'VIDEO',
            Title: 'Video: Ordering at a restaurant',
            MaterialOrder: 1,
          },
        ],
      },
      {
        NodeId: 65,
        NodeName: 'Thông báo dị ứng và yêu cầu đặc biệt',
        NodeOrder: 2,
        materials: [
          {
            MaterialId: 505,
            MaterialType: 'TEXT',
            Title: 'I am allergic to peanuts',
            MaterialOrder: 1,
            Content: '<p>I am allergic to shellfish. Could you recommend something without seafood?</p>',
          },
        ],
      },
    ],
  },
  {
    PathId: 33,
    PathName: 'Hỏi đường & di chuyển',
    PathOrder: 4,
    Description: 'Taxi, tàu điện, mua vé và xử lý lạc đường.',
    nodes: [
      {
        NodeId: 66,
        NodeName: 'Hỏi đường đến địa điểm',
        NodeOrder: 1,
        materials: [
          {
            MaterialId: 506,
            MaterialType: 'TEXT',
            Title: 'Excuse me, how do I get to...?',
            MaterialOrder: 1,
            Content: '<p>Excuse me, how do I get to the central station? Is it within walking distance?</p>',
          },
        ],
      },
      {
        NodeId: 67,
        NodeName: 'Mua vé và hỏi lịch trình',
        NodeOrder: 2,
        materials: [],
      },
    ],
  },
];

/** @type {Record<number, object>} */
export const mentorCourseDetailById = {
  1: {
    CourseId: 1,
    CourseName: 'Tiếng Anh Thương Mại & Giao Tiếp Công Sở',
    Description:
      'Nắm vững thuật ngữ kinh doanh, cách viết email chuyên nghiệp và văn hóa giao tiếp doanh nghiệp.',
    Thumbnail: null,
    CategoryId: 1,
    CategoryName: 'Giao tiếp',
    LevelId: 2,
    LevelName: 'Trung cấp',
    InstructorId: 3,
    InstructorName: 'Mentor Demo',
    Rating: 4.7,
    TotalLessons: 21,
    TotalNodes: 9,
    TotalMaterials: 32,
    StudentCount: 128,
    IsPublished: true,
    CreatedAt: '2025-11-12T08:00:00.000Z',
    UpdatedAt: '2026-03-18T10:30:00.000Z',
    paths: course1Paths,
  },
  2: {
    CourseId: 2,
    CourseName: 'Tiếng Anh Chuyên Ngành Tài Chính - Ngân Hàng',
    Description:
      'Hệ thống từ vựng về thị trường tiền tệ, tín dụng, báo cáo tài chính và nghiệp vụ ngân hàng quốc tế.',
    Thumbnail: null,
    CategoryId: 2,
    CategoryName: 'TOEIC',
    LevelId: 3,
    LevelName: 'Nâng cao',
    InstructorId: 3,
    InstructorName: 'Mentor Demo',
    Rating: 4.5,
    TotalLessons: 32,
    StudentCount: 86,
    IsPublished: true,
    CreatedAt: '2025-10-05T08:00:00.000Z',
    UpdatedAt: '2026-02-28T14:15:00.000Z',
    paths: [],
  },
  3: {
    CourseId: 3,
    CourseName: 'Tiếng Anh Giao Tiếp Đời Sống Hàng Ngày',
    Description:
      'Luyện tập các tình huống giao tiếp thường nhật: chào hỏi, giới thiệu bản thân, hỏi đường và duy trì hội thoại.',
    Thumbnail: null,
    CategoryId: 1,
    CategoryName: 'Giao tiếp',
    LevelId: 1,
    LevelName: 'Cơ bản',
    InstructorId: 3,
    InstructorName: 'Mentor Demo',
    Rating: 4.3,
    TotalLessons: 16,
    StudentCount: 54,
    IsPublished: true,
    CreatedAt: '2026-01-20T08:00:00.000Z',
    UpdatedAt: '2026-04-02T09:00:00.000Z',
    paths: course3Paths,
  },
  4: {
    CourseId: 4,
    CourseName: 'Tiếng Anh Đàm Phán & Hợp Đồng Thương Mại',
    Description:
      'Ngôn từ thương lượng giá cả, chốt sale và đọc hiểu các điều khoản pháp lý trong hợp đồng kinh tế.',
    Thumbnail: null,
    CategoryId: 3,
    CategoryName: 'IELTS',
    LevelId: 3,
    LevelName: 'Nâng cao',
    InstructorId: 3,
    InstructorName: 'Mentor Demo',
    Rating: null,
    TotalLessons: 17,
    TotalNodes: 7,
    TotalMaterials: 15,
    StudentCount: 0,
    IsPublished: false,
    CreatedAt: '2026-04-10T08:00:00.000Z',
    UpdatedAt: '2026-04-12T16:45:00.000Z',
    paths: course4Paths,
  },
  5: {
    CourseId: 5,
    CourseName: 'Tiếng Anh Du Lịch & Khám Phá',
    Description:
      'Từ vựng và mẫu câu khi đi nước ngoài: sân bay, khách sạn, nhà hàng và xử lý sự cố.',
    Thumbnail: null,
    CategoryId: 4,
    CategoryName: 'Ngữ pháp',
    LevelId: 1,
    LevelName: 'Cơ bản',
    InstructorId: 3,
    InstructorName: 'Mentor Demo',
    Rating: null,
    TotalLessons: 8,
    TotalNodes: 4,
    TotalMaterials: 6,
    StudentCount: 0,
    IsPublished: false,
    CreatedAt: '2026-04-15T08:00:00.000Z',
    UpdatedAt: '2026-04-15T08:00:00.000Z',
    paths: course5Paths,
  },
};
