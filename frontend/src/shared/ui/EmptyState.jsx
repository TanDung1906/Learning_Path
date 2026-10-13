import { Box, Typography, alpha, useTheme } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AppButton from "./AppButton";

export default function EmptyState({
  title = "Không có dữ liệu",
  description,
  actionLabel,
  onAction,
  embedded = false,
  variant = "default",
  icon: Icon,
}) {
  const theme = useTheme();
  const isError = variant === "error";
  const accentColor = isError ? theme.palette.error.main : theme.palette.primary.main;
  const DisplayIcon = Icon ?? (isError ? ErrorOutlineRoundedIcon : null);

  return (
    <Box
      sx={{
        textAlign: "center",
        py: embedded || isError ? 4 : 5,
        px: embedded || isError ? 2 : 3,
        ...(embedded || isError
          ? {
              borderRadius: 0,
              border: "none",
              backgroundColor: "transparent",
            }
          : {
              borderRadius: theme.shape.borderRadius,
              backgroundColor: alpha(accentColor, 0.03),
              border: `1px solid ${alpha(accentColor, 0.1)}`,
            }),
      }}
    >
      {DisplayIcon ? (
        <DisplayIcon
          sx={{
            fontSize: 48,
            color: accentColor,
            mb: 1.5,
            opacity: isError ? 1 : 0.65,
          }}
        />
      ) : (
        <Box
          sx={{
            width: 40,
            height: 3,
            borderRadius: 1,
            bgcolor: accentColor,
            mx: "auto",
            mb: 2,
            opacity: 0.5,
          }}
        />
      )}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: isError ? theme.palette.error.main : "text.primary",
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{
            maxWidth: 360,
            mx: "auto",
            mb: actionLabel ? 3 : 0,
            color: isError ? theme.palette.error.main : "text.secondary",
            opacity: isError ? 0.88 : 1,
          }}
        >
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <AppButton variant="outlined" onClick={onAction}>
          {actionLabel}
        </AppButton>
      )}
    </Box>
  );
}
