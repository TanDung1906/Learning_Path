import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  alpha,
} from '@mui/material';
import AppButton from '@/shared/ui/AppButton';

export default function MentorChapterDraftDialog({
  open,
  onCancel,
  onSaveDraft,
  saving = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
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
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Khóa học này chưa lưu nháp</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Bạn cần lưu nháp khóa học trước. Nội dung chương hiện tại sẽ được lưu cùng bản nháp và
          bạn vẫn ở lại trang này.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <AppButton variant="outlined" onClick={onCancel} disabled={saving}>
          Hủy
        </AppButton>
        <AppButton
          loading={saving}
          onClick={onSaveDraft}
          sx={{
            bgcolor: '#0891B2',
            '&:hover': { bgcolor: '#0E7490' },
          }}
        >
          Lưu nháp
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
