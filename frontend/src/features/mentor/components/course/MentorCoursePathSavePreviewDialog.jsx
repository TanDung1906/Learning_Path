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
import { MUTED, TEXT } from '@/features/mentor/components/course/mentorCourseCreateStyles';

function SummaryChip({ label, count, color = 'default' }) {
  if (count == null || count === 0) return null;
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

export default function MentorCoursePathSavePreviewDialog({
  open,
  payload,
  loading = false,
  onClose,
  onConfirm,
}) {
  const theme = useTheme();
  const displayPayload = payload?.preview ?? payload ?? {};
  const jsonText = JSON.stringify(displayPayload, null, 2);
  const summary = displayPayload?.summary ?? payload?.summary ?? {};
  const context = displayPayload?.context ?? payload?.context ?? {};
  const apiCallCount = displayPayload?.apiCalls?.length ?? 0;
  const saveScope = payload?.saveScope ?? 'path';
  const dialogTitle = saveScope === 'material'
    ? 'Payload cập nhật học liệu (API / DB)'
    : saveScope === 'node'
      ? 'Payload cập nhật bài học (API / DB)'
      : 'Payload cập nhật path (API / DB)';

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
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{dialogTitle}</DialogTitle>
      <DialogContent sx={{ pt: 0.5 }}>
        {context.pathName || context.nodeName || context.materialTitle ? (
          <Typography sx={{ fontSize: 13, color: TEXT, mb: 1, lineHeight: 1.5 }}>
            {saveScope === 'material'
              ? 'Học liệu đang cập nhật'
              : saveScope === 'node'
                ? 'Bài học đang cập nhật'
                : 'Chương đang cập nhật'}
            :
            {' '}
            <strong>
              {saveScope === 'material'
                ? (context.materialTitle || context.materialTempId || 'Học liệu')
                : saveScope === 'node'
                  ? (context.nodeName || context.nodeTempId || 'Bài học')
                  : `${context.pathOrder ? `Chương ${context.pathOrder} — ` : ''}${context.pathName}`}
            </strong>
          </Typography>
        ) : null}

        <Typography sx={{ fontSize: 13, color: MUTED, mb: 1, lineHeight: 1.5 }}>
          Chỉ các thay đổi so với snapshot mới có trong JSON bên dưới.
          {apiCallCount > 0 ? (
            <>
              {' '}
              Sẽ gọi
              {' '}
              <strong>{apiCallCount}</strong>
              {' '}
              REST request tương ứng (xem mảng
              {' '}
              <strong>apiCalls</strong>
              ).
            </>
          ) : null}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.25 }}>
          <SummaryChip label="Path insert" count={summary.pathInsert} color="info" />
          <SummaryChip label="Path update" count={summary.pathUpdate} color="info" />
          <SummaryChip label="Bài học thêm" count={summary.nodesInsert} color="success" />
          <SummaryChip label="Bài học sửa" count={summary.nodesUpdate} color="success" />
          <SummaryChip label="Bài học xóa" count={summary.nodesDelete} color="error" />
          <SummaryChip label="Học liệu thêm" count={summary.materialsInsert} color="warning" />
          <SummaryChip label="Học liệu sửa" count={summary.materialsUpdate} color="warning" />
          <SummaryChip label="Học liệu xóa" count={summary.materialsDelete} color="error" />
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
            maxHeight: 'min(60vh, 520px)',
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
