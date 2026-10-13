import { Box, CircularProgress, Typography, alpha, useTheme } from "@mui/material";

export default function Loading({
  message = "Đang tải...",
  fullScreen = false,
  size = 40,
}) {
  const theme = useTheme();

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <CircularProgress
        size={size}
        thickness={3.5}
        sx={{
          color: theme.palette.primary.main,
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      {message && (
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1300,
          background: alpha(theme.palette.background.default, 0.85),
          backdropFilter: "blur(12px)",
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      {content}
    </Box>
  );
}
