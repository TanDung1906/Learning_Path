import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import AppButton from "@/shared/ui/AppButton";
import { getEnrollmentStatusChip } from "@/shared/utils/statusChipUtils";

export default function StudentCourseCard({
  course,
  onViewDetail,
  onEnroll,
  onContinueLearning,
}) {
  const theme = useTheme();
  const {
    courseName,
    description,
    totalNodes,
    totalMaterials,
    progressPercentage,
    isEnrolled,
  } = course;

  const statusChip = getEnrollmentStatusChip(isEnrolled, progressPercentage);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        boxShadow: theme.ios18?.shadow?.sm,
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          p: 2.25,
          "&:last-child": { pb: 2.25 },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.35 }}>
            {courseName}
          </Typography>
          <Chip
            label={statusChip.label}
            size="small"
            sx={{ fontWeight: 600, flexShrink: 0, ...statusChip.sx }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 42,
          }}
        >
          {description}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Typography variant="caption" color="text.secondary">
            Chương: {totalNodes}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Học liệu: {totalMaterials} mục
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
            <Typography variant="caption" color="text.secondary">
              Tiến độ
            </Typography>
            <Typography variant="caption" fontWeight={700} color="primary.main">
              {progressPercentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(Math.max(progressPercentage, 0), 100)}
            sx={{
              height: 6,
              borderRadius: 99,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "& .MuiLinearProgress-bar": {
                borderRadius: 99,
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            mt: "auto",
            pt: 0.5,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1,
          }}
        >
          <AppButton
            variant="outlined"
            onClick={() => onViewDetail?.(course)}
          >
            Xem chi tiết
          </AppButton>

          {isEnrolled ? (
            <AppButton onClick={() => onContinueLearning?.(course)}>
              Tiếp tục học
            </AppButton>
          ) : (
            <AppButton variant="contained" onClick={() => onEnroll?.(course)}>
              Đăng ký
            </AppButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
