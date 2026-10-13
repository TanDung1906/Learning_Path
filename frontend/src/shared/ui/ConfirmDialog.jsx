import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import AppButton from "./AppButton";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  confirmVariant = "contained",
  loading = false,
  destructive = false,
}) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: alpha("#0F172A", 0.35),
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <AppButton variant="text" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </AppButton>
        <AppButton
          variant={destructive ? "contained" : confirmVariant}
          loading={loading}
          onClick={onConfirm}
          sx={
            destructive
              ? {
                  background: theme.palette.error.main,
                  "&:hover": { background: theme.palette.error.dark },
                }
              : undefined
          }
        >
          {confirmLabel}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
