import { Box, Typography } from "@mui/material";

export default function PageTitle({ title, subtitle, action, sx }) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
        ...sx,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            color: "text.primary",
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.5, maxWidth: 560 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
