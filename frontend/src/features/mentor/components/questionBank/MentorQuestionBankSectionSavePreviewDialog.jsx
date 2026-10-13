import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import AppButton from '@/shared/ui/AppButton';
import { ContentFieldLabel } from '@/features/mentor/components/course/MentorContentSectionHeading';
import { MUTED, TEXT } from '@/features/mentor/components/course/mentorCourseCreateStyles';
import { isHtmlContentEmpty } from '@/features/mentor/utils/mentorCourseContentUtils';

/**
 * =============================================================================
 * MentorQuestionBankSectionSavePreviewDialog — Preview payload trước khi lưu
 * =============================================================================
 *
 * MỤC ĐÍCH: Hiển thị JSON payload sẽ gửi API + tóm tắt số thao tác insert/update/delete.
 * LUỒNG: User xem preview → bấm "Lưu thay đổi" → onConfirm() → parent gọi API.
 */

const PREVIEW_CONTENT_SX = {
  minHeight: 120,
  maxHeight: 'min(40vh, 360px)',
  overflow: 'auto',
  p: 2,
  borderRadius: '14px',
  bgcolor: '#fff',
  border: '1px solid rgba(15,23,42,0.08)',
  fontSize: 14,
  lineHeight: 1.65,
  color: TEXT,
  '& p': { m: 0, mb: 1 },
  '& ul, & ol': { pl: 2.5, my: 1 },
  '& li': { mb: 0.35 },
  '& strong, & b': { fontWeight: 700 },
  '& em, & i': { fontStyle: 'italic' },
  '& u': { textDecoration: 'underline' },
};

function SummaryChip({ label, count, color = 'default' }) {
  if (!count) return null;
  return (
    <Chip
      size="small"
      label={`${label}: ${count}`}
      color={color}
      variant="outlined"
      sx={{ fontWeight: 600, fontSize: 11 }}
    />
  );
}

export default function MentorQuestionBankSectionSavePreviewDialog({
  open,
  payload,
  readingTextHtml = null,
  loading = false,
  onClose,
  onConfirm,
}) {
  const theme = useTheme();
  const jsonText = JSON.stringify(payload ?? {}, null, 2);
  const summary = payload?.summary ?? {};
  const showReadingText = !isHtmlContentEmpty(readingTextHtml);

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
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Payload lưu section (API / DB)</DialogTitle>
      <DialogContent sx={{ pt: 0.5 }}>
        {/* Preview HTML bài đọc (Reading) nếu có */}
        {showReadingText ? (
          <Box sx={{ mb: 1.5 }}>
            <ContentFieldLabel sx={{ mb: 0.75, fontSize: 12, fontWeight: 700, color: '#64748B' }}>
              Nội dung văn bản
            </ContentFieldLabel>
            <Box
              sx={PREVIEW_CONTENT_SX}
              dangerouslySetInnerHTML={{ __html: readingTextHtml }}
            />
          </Box>
        ) : null}

        <Typography sx={{ fontSize: 13, color: MUTED, mb: 1, lineHeight: 1.5 }}>
          Mỗi block map trực tiếp 1 REST call theo id:
          {' '}
          <strong>
            DELETE question → PATCH section source → PUT section → PUT question → PUT choice → POST/DELETE choice → POST question → POST section
          </strong>
          .
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.25 }}>
          <SummaryChip label="UPDATE source URL" count={summary.sectionSourceUpdate} color="info" />
          <SummaryChip label="INSERT section" count={summary.sectionInsert} color="success" />
          <SummaryChip label="UPDATE section" count={summary.sectionUpdate} color="info" />
          <SummaryChip label="INSERT questions" count={summary.questionsInsert} color="success" />
          <SummaryChip label="UPDATE questions" count={summary.questionsUpdate} color="warning" />
          <SummaryChip label="DELETE questions" count={summary.questionsDelete} color="error" />
          <SummaryChip label="INSERT choices" count={summary.choicesInsert} color="success" />
          <SummaryChip label="UPDATE choices" count={summary.choicesUpdate} color="warning" />
          <SummaryChip label="DELETE choices" count={summary.choicesDelete} color="error" />
        </Box>
        <Typography
          component="pre"
          sx={{
            m: 0,
            p: 1.5,
            borderRadius: '12px',
            bgcolor: 'rgba(15,23,42,0.04)',
            border: '1px solid rgba(15,23,42,0.08)',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: 12,
            lineHeight: 1.55,
            color: '#0F172A',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: showReadingText ? 'min(36vh, 320px)' : 'min(60vh, 520px)',
            overflow: 'auto',
          }}
        >
          {jsonText}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <AppButton variant="text" onClick={onClose} disabled={loading}>
          Hủy
        </AppButton>
        <AppButton
          type="button"
          loading={loading}
          disabled={loading}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (loading) return;
            onConfirm?.();
          }}
          sx={{
            background: theme.palette.primary.main,
            '&:hover': { background: theme.palette.primary.dark },
          }}
        >
          Lưu thay đổi
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
