import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  Typography,
  alpha,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import AppButton from "./AppButton";

const PRIMARY = "#0891B2";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const DIVIDER = "rgba(8,145,178,0.08)";

export const underlineFieldSx = {
  pb: "4px",
  borderBottom: "1px solid rgba(8,145,178,0.18)",
  transition: "border-color 0.2s ease",
  "&:focus-within": { borderBottomColor: PRIMARY },
};

function PopupField({
  field,
  value,
  error,
  onChange,
  disabled,
  passwordVisible,
  onTogglePassword,
}) {
  const isPassword = field.type === "password";
  const canToggle = isPassword && onTogglePassword;

  return (
    <Box sx={{ mb: 2.25 }}>
      <Typography sx={{ fontSize: 11, color: MUTED, fontWeight: 500, mb: 0.4, lineHeight: 1.2 }}>
        {field.label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          ...underlineFieldSx,
          borderBottomColor: error ? "#DC2626" : "rgba(8,145,178,0.18)",
          "&:focus-within": { borderBottomColor: error ? "#DC2626" : PRIMARY },
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <InputBase
          name={field.name}
          value={value}
          onChange={onChange}
          type={isPassword ? (passwordVisible ? "text" : "password") : (field.type ?? "text")}
          placeholder={field.placeholder}
          disabled={disabled}
          fullWidth
          autoComplete={isPassword ? "new-password" : "off"}
          sx={{
            fontSize: 13.5,
            fontWeight: 600,
            color: TEXT,
            lineHeight: 1.4,
            flex: 1,
            "& .MuiInputBase-input": {
              p: 0,
              height: "auto",
            },
            "& .MuiInputBase-input::placeholder": {
              color: MUTED,
              opacity: 0.7,
              fontWeight: 500,
            },
          }}
        />
        {canToggle && (
          <IconButton
            size="small"
            onClick={() => onTogglePassword(field.name)}
            disabled={disabled}
            aria-label={passwordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            sx={{ p: 0.25, color: MUTED, "&:hover": { color: PRIMARY, bgcolor: "transparent" } }}
          >
            {passwordVisible ? (
              <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
            ) : (
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        )}
      </Box>
      {error && (
        <Typography sx={{ fontSize: 11, color: "#DC2626", mt: 0.5, lineHeight: 1.3 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default function UnderlineFieldPopup({
  open,
  onClose,
  title,
  titleIcon: TitleIcon,
  description,
  fields = [],
  form = {},
  errors = {},
  onChange,
  passwordVisibility,
  onTogglePassword,
  submitLabel = "Lưu",
  cancelLabel = "Hủy",
  onSubmit,
  loading = false,
  submitIcon,
}) {
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
      PaperProps={{
        sx: {
          borderRadius: "16px",
          border: `1px solid ${DIVIDER}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: 17,
          pb: 0.5,
          pr: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {TitleIcon && <TitleIcon sx={{ fontSize: 20, color: PRIMARY }} />}
          {title}
        </Box>
        <IconButton size="small" onClick={onClose} disabled={loading} sx={{ color: MUTED }}>
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        {description && (
          <Typography sx={{ fontSize: 13, color: MUTED, mb: 2, lineHeight: 1.5 }}>
            {description}
          </Typography>
        )}
        {fields.map((field) => (
          <PopupField
            key={field.name}
            field={field}
            value={form[field.name] ?? ""}
            error={errors[field.name]}
            onChange={onChange}
            disabled={loading}
            passwordVisible={passwordVisibility?.[field.name]}
            onTogglePassword={field.type === "password" ? onTogglePassword : undefined}
          />
        ))}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
        <AppButton variant="outlined" onClick={onClose} disabled={loading} sx={{ minWidth: 88 }}>
          {cancelLabel}
        </AppButton>
        <AppButton
          variant="contained"
          startIcon={submitIcon}
          onClick={onSubmit}
          loading={loading}
        >
          {submitLabel}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
