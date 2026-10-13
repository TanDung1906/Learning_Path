/**
 * =============================================================================
 * MentorTestQuestionBankSelector — Gợi ý tạo bank cho quiz chương
 * =============================================================================
 *
 * MỤC ĐÍCH: Hiển thị trong form tạo quiz khi chương chưa có ngân hàng câu hỏi.
 * LUỒNG: Link "Tạo bank cho chương" → /mentor/question-banks/:courseId/:chapterId
 *
 * Chọn / hiển thị bank chương cho Quiz — UI only, chưa gắn API.
 */
import { Box, Typography, alpha } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import { Link as RouterLink } from 'react-router-dom';
import AppButton from '@/shared/ui/AppButton';
import { MUTED, PRIMARY, TEXT } from '@/features/mentor/components/course/mentorCourseCreateStyles';

import { buildQuestionBankChapterManagePath } from '@/features/mentor/utils/mentorQuestionBankListParams';

function buildManageUrl(courseId, chapterId) {
  return buildQuestionBankChapterManagePath(courseId, chapterId);
}

export default function MentorTestQuestionBankSelector({
  courseId,
  chapterId = null,
  error,
}) {
  if (!courseId) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: '14px',
          bgcolor: alpha(PRIMARY, 0.04),
          border: `1px dashed ${alpha(PRIMARY, 0.2)}`,
        }}
      >
        <Typography sx={{ fontSize: 13, color: MUTED, lineHeight: 1.55 }}>
          Lưu khóa học trước, sau đó gắn quiz chương với ngân hàng câu hỏi của chương đó.
        </Typography>
      </Box>
    );
  }

  if (chapterId == null || chapterId === '') {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: '14px',
          bgcolor: alpha('#7C3AED', 0.04),
          border: `1px dashed ${alpha('#7C3AED', 0.2)}`,
        }}
      >
        <Typography sx={{ fontSize: 13, color: MUTED, lineHeight: 1.55 }}>
          Lưu chương trước khi gắn quiz. Quiz chương lấy câu hỏi từ bank của chương tương ứng.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: '14px',
        border: '1px dashed rgba(15,23,42,0.12)',
        bgcolor: '#fff',
        textAlign: 'center',
      }}
    >
      <QuizOutlinedIcon sx={{ fontSize: 36, color: '#CBD5E1', mb: 1 }} />
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: TEXT, mb: 0.5 }}>
        Chương chưa có ngân hàng câu hỏi
      </Typography>
      <Typography sx={{ fontSize: 13, color: MUTED, mb: 2, lineHeight: 1.5 }}>
        Mỗi chương có một bank riêng. Tạo bank cho chương này trước khi thêm quiz.
      </Typography>
      <AppButton
        component={RouterLink}
        to={buildManageUrl(courseId, chapterId)}
        startIcon={<AddRoundedIcon />}
        sx={{
          height: 36,
          px: 2,
          fontSize: 13,
          fontWeight: 600,
          borderRadius: '999px',
          bgcolor: PRIMARY,
          color: '#fff',
          boxShadow: 'none',
          '&:hover': { bgcolor: '#0E7490', boxShadow: 'none' },
        }}
      >
        Tạo bank cho chương
      </AppButton>
      {error && (
        <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 1.25 }}>{error}</Typography>
      )}
    </Box>
  );
}
