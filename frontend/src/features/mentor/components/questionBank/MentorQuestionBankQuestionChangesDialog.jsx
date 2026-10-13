import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AppButton from '@/shared/ui/AppButton';
import { MUTED, TEXT } from '@/features/mentor/components/course/mentorCourseCreateStyles';

/**
 * =============================================================================
 * MentorQuestionBankQuestionChangesDialog — So sánh Old vs New question
 * =============================================================================
 *
 * MỤC ĐÍCH: Hiển thị song song câu hỏi cũ và mới khi user sửa câu đã lưu DB.
 * LUỒNG: User có thể "Khôi phục" về bản cũ hoặc "Đóng" giữ bản mới.
 */

function QuestionPreviewChoices({ options = [] }) {
  const filledOptions = options.filter((item) => String(item?.OptionText ?? '').trim());

  if (filledOptions.length === 0) {
    return (
      <Typography sx={{ fontSize: 12, color: MUTED, fontStyle: 'italic' }}>
        Chưa có đáp án
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.65 }}>
      {filledOptions.map((option, index) => (
        <Box
          key={option.tempId ?? option.ChoiceId ?? index}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 0.75,
            px: 1,
            py: 0.75,
            borderRadius: '10px',
            bgcolor: option.IsCorrect ? 'rgba(4,120,87,0.08)' : '#fff',
            border: `1px solid ${option.IsCorrect ? 'rgba(4,120,87,0.22)' : 'rgba(15,23,42,0.08)'}`,
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: MUTED, minWidth: 18 }}>
            {String.fromCharCode(65 + index)}.
          </Typography>
          <Typography sx={{ fontSize: 13, color: TEXT, lineHeight: 1.45, flex: 1 }}>
            {option.OptionText}
          </Typography>
          {option.IsCorrect ? (
            <CheckRoundedIcon sx={{ fontSize: 16, color: '#047857', flexShrink: 0, mt: 0.1 }} />
          ) : null}
        </Box>
      ))}
    </Box>
  );
}

function QuestionPreviewPanel({ title, question, accentColor = '#64748B' }) {
  const questionText = String(question?.QuestionText ?? '').trim() || 'Chưa có nội dung';

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 1.5,
        borderRadius: '16px',
        bgcolor: '#fff',
        border: '1px solid rgba(15,23,42,0.08)',
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          color: accentColor,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography sx={{ fontSize: 14, fontWeight: 600, color: TEXT, lineHeight: 1.55, mb: 1.25 }}>
        {questionText}
      </Typography>

      <Typography sx={{ fontSize: 11, fontWeight: 700, color: MUTED, mb: 0.75, textTransform: 'uppercase' }}>
        Các lựa chọn
      </Typography>
      <QuestionPreviewChoices options={question?.Options} />
    </Box>
  );
}

export default function MentorQuestionBankQuestionChangesDialog({
  open,
  onClose,
  onRestore,
  questionIndex = 0,
  oldQuestion = null,
  newQuestion = null,
}) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: alpha('#0F172A', 0.35),
          },
        },
        paper: {
          sx: {
            borderRadius: '24px',
            boxShadow: theme.ios18?.shadow?.lg ?? '0 8px 32px rgba(15,23,42,0.12)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1.5,
          pb: 1,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: TEXT, lineHeight: 1.35 }}>
            So sánh thay đổi câu hỏi
          </Typography>
          <Typography sx={{ fontSize: 13, color: MUTED, mt: 0.35, fontWeight: 500 }}>
            Câu {questionIndex + 1}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Đóng"
          sx={{
            width: 32,
            height: 32,
            bgcolor: alpha('#0F172A', 0.05),
            color: MUTED,
            flexShrink: 0,
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0.5, pb: 2.5 }}>
        {/* Hai cột: Old Question | New Question */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.5,
          }}
        >
          <QuestionPreviewPanel title="Old Question" question={oldQuestion} accentColor="#64748B" />
          <QuestionPreviewPanel title="New Question" question={newQuestion} accentColor="#D97706" />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <AppButton
            onClick={onRestore}
            disabled={!oldQuestion}
            sx={{
              height: 40,
              px: 2.5,
              fontSize: 13,
              fontWeight: 700,
              borderRadius: '999px',
              bgcolor: '#047857',
              color: '#fff',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#065F46', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: 'rgba(15,23,42,0.12)', color: MUTED },
            }}
          >
            Khôi phục
          </AppButton>
          <AppButton
            onClick={onClose}
            sx={{
              height: 40,
              px: 2.5,
              fontSize: 13,
              fontWeight: 700,
              borderRadius: '999px',
              bgcolor: '#F59E0B',
              color: '#fff',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#D97706', boxShadow: 'none' },
            }}
          >
            Đóng
          </AppButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
