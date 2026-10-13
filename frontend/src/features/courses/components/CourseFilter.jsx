import { Box, Chip, Typography, alpha, useTheme } from "@mui/material";

export default function CourseFilter({
  levels = ["Tất cả", "Cơ bản", "Trung cấp", "Nâng cao"],
  categories = [],
  selectedLevel = "Tất cả",
  selectedCategory = "Tất cả",
  onLevelChange,
  onCategoryChange,
}) {
  const theme = useTheme();

  const chipSx = (active) => ({
    fontWeight: 500,
    fontSize: 13,
    borderRadius: theme.ios18?.radius?.pill,
    transition: `background-color 0.2s ${theme.ios18?.transition}, color 0.2s`,
    ...(active
      ? {
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          border: "none",
          "&:hover": { backgroundColor: theme.palette.primary.dark },
        }
      : {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          color: "text.secondary",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
        }),
  });

  const renderGroup = (label, options, selected, onChange) => (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 1,
          fontWeight: 600,
          color: "text.secondary",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {options.map((opt) => (
          <Chip
            key={opt}
            label={opt}
            onClick={() => onChange?.(opt)}
            sx={chipSx(selected === opt)}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: theme.ios18?.shadow?.sm,
      }}
    >
      {renderGroup("Cấp độ", levels, selectedLevel, onLevelChange)}
      {categories.length > 0 &&
        renderGroup("Danh mục", ["Tất cả", ...categories], selectedCategory, onCategoryChange)}
    </Box>
  );
}
