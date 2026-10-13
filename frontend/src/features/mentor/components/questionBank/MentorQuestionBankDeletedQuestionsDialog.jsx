import { useState } from 'react';
import {
  Box,
  Chip,
  Collapse,
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
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AppButton from '@/shared/ui/AppButton';
import EmptyState from '@/shared/ui/EmptyState';
import { MUTED, TEXT } from '@/features/mentor/components/course/mentorCourseCreateStyles';

/**
 * =============================================================================
 * MentorQuestionBankDeletedQuestionsDialog — Dialog câu hỏi đã xóa tạm
 * =============================================================================
 *
 * MỤC ĐÍCH: Liệt kê câu hỏi đã xóa trong phiên chỉnh sửa (chưa lưu API).
 * LUỒNG: User bấm "Khôi phục" → onRestoreQuestion(question) → parent cập nhật section.
 */

function truncateText(text, max = 120) {
  const trimmed = String(text ?? '').trim();
  if (!trimmed) return 'Chưa có nội dung';
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function DeletedQuestionChoices({ options = [] }) {
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

function DeletedQuestionRow({ question, index, onRestore }) {
  const [expanded, setExpanded] = useState(false);
  const optionCount = (question.Options ?? []).filter((item) =>
    String(item?.OptionText ?? '').trim(),
  ).length;

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: '14px',
        bgcolor: '#FFFBEB',
        border: '1px solid rgba(245,158,11,0.22)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '8px',
            bgcolor: 'rgba(245,158,11,0.14)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            mt: 0.1,
          }}
        >
          <DeleteOutlineRoundedIcon sx={{ fontSize: 16, color: '#D97706' }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>
              Câu đã xóa #{index + 1}
            </Typography>
            {question.QuestionId ? (
              <Chip
                size="small"
                label={`ID ${question.QuestionId}`}
                sx={{
                  height: 22,
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: 'rgba(15,23,42,0.06)',
                  color: MUTED,
                }}
              />
            ) : null}
          </Box>

          <Typography sx={{ fontSize: 14, fontWeight: 600, color: TEXT, lineHeight: 1.55, mb: 0.5 }}>
            {truncateText(question.QuestionText)}
          </Typography>

          <Typography sx={{ fontSize: 12, color: MUTED }}>
            {optionCount > 0 ? `${optionCount} đáp án` : 'Chưa có đáp án'}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            flexShrink: 0,
            alignItems: 'stretch',
          }}
        >
          <AppButton
            variant="outlined"
            onClick={() => setExpanded((prev) => !prev)}
            sx={{
              height: 34,
              px: 1.5,
              fontSize: 12,
              fontWeight: 600,
              borderRadius: '999px',
              color: TEXT,
              borderColor: 'rgba(15,23,42,0.22)',
              bgcolor: '#fff',
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                bgcolor: 'rgba(15,23,42,0.04)',
                borderColor: 'rgba(15,23,42,0.35)',
                boxShadow: 'none',
              },
            }}
          >
            {expanded ? 'Thu gọn' : 'Xem chi tiết'}
          </AppButton>
          <AppButton
            onClick={() => onRestore?.(question)}
            sx={{
              height: 34,
              px: 1.5,
              fontSize: 12,
              fontWeight: 700,
              borderRadius: '999px',
              bgcolor: '#047857',
              color: '#fff',
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#065F46', boxShadow: 'none' },
            }}
          >
            Khôi phục
          </AppButton>
        </Box>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            mt: 1.25,
            pt: 1.25,
            borderTop: '1px solid rgba(245,158,11,0.18)',
            pl: 4.5,
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: MUTED, mb: 0.75, textTransform: 'uppercase' }}>
            {question.hadContentChanges ? 'Old Question' : 'Đáp án'}
          </Typography>
          {question.hadContentChanges ? (
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: TEXT, lineHeight: 1.55, mb: 1 }}>
              {truncateText(question.QuestionText, 500)}
            </Typography>
          ) : null}
          <DeletedQuestionChoices options={question.Options} />
        </Box>
      </Collapse>
    </Box>
  );
}

export default function MentorQuestionBankDeletedQuestionsDialog({
  open,
  onClose,
  deletedQuestions = [],
  sectionLabel = '',
  onRestoreQuestion,
}) {
  const theme = useTheme();
  const count = deletedQuestions.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: TEXT, lineHeight: 1.35 }}>
            Những câu hỏi đã xóa
          </Typography>
          {sectionLabel ? (
            <Typography sx={{ fontSize: 13, color: MUTED, mt: 0.35, fontWeight: 500 }}>
              {sectionLabel} · {count} câu
            </Typography>
          ) : (
            <Typography sx={{ fontSize: 13, color: MUTED, mt: 0.35, fontWeight: 500 }}>
              {count} câu hỏi
            </Typography>
          )}
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
        {count === 0 ? (
          <EmptyState
            embedded
            title="Chưa có câu hỏi nào bị xóa"
            description="Các câu hỏi bạn xóa trong phiên chỉnh sửa này sẽ hiển thị tại đây."
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {deletedQuestions.map((question, index) => (
              <DeletedQuestionRow
                key={question.tempId ?? index}
                question={question}
                index={index}
                onRestore={onRestoreQuestion}
              />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
