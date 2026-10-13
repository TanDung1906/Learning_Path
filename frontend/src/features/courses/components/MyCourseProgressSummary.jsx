import { Box, Chip, LinearProgress, Typography, alpha } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";

const MUTED = "#64748B";
const TEXT = "#0F172A";
const PRIMARY = "#0891B2";

const STATUS_CONFIG = {
  completed: {
    label: "Hoàn thành",
    color: "#047857",
    bgcolor: "rgba(4,120,87,0.10)",
    Icon: CheckCircleOutlineOutlinedIcon,
  },
  learning: {
    label: "Đang học",
    color: PRIMARY,
    bgcolor: "rgba(8,145,178,0.10)",
    Icon: PlayCircleOutlineOutlinedIcon,
  },
  not_started: {
    label: "Chưa học",
    color: MUTED,
    bgcolor: "rgba(100,116,139,0.08)",
    Icon: RadioButtonUncheckedOutlinedIcon,
  },
};

function ModuleItem({ module }) {
  const config = STATUS_CONFIG[module.status] ?? STATUS_CONFIG.not_started;
  const Icon = config.Icon;
  const progress =
    module.totalLessons > 0
      ? Math.round((module.completedLessons / module.totalLessons) * 100)
      : 0;

  return (
    <Box sx={{ py: 1.25 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 0.75 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, minWidth: 0, flex: 1 }}>
          <Icon sx={{ fontSize: 16, color: config.color, mt: 0.15, flexShrink: 0 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEXT, lineHeight: 1.4 }}>
              {module.title}
            </Typography>
            <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>
              {module.status === "completed" && "Hoàn thành "}
              {module.status === "learning" && "Đang học "}
              {module.status === "not_started" && "Chưa học "}
              {module.completedLessons}/{module.totalLessons} bài
            </Typography>
          </Box>
        </Box>
        <Chip
          label={config.label}
          size="small"
          sx={{
            height: 22,
            fontSize: 10.5,
            fontWeight: 600,
            borderRadius: "99px",
            bgcolor: config.bgcolor,
            color: config.color,
            flexShrink: 0,
          }}
        />
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 4,
          borderRadius: 99,
          bgcolor: "rgba(100,116,139,0.10)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 99,
            bgcolor: module.status === "completed" ? "#16A34A" : module.status === "learning" ? PRIMARY : "#CBD5E1",
          },
        }}
      />
    </Box>
  );
}

export default function MyCourseProgressSummary({ course }) {
  const modules = course?.modules ?? [];
  const currentLesson = course?.currentLessonDetail;
  const recentLessons = course?.recentLessons ?? [];

  if (modules.length === 0 && !currentLesson) {
    return (
      <Typography sx={{ fontSize: 13, color: MUTED }}>
        Chưa có dữ liệu tiến độ chi tiết.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: { xs: 2, md: 3 },
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: MUTED, mb: 0.5, textTransform: "uppercase", letterSpacing: "0.03em" }}>
          Tiến độ theo chương
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {modules.map((mod, index) => (
            <Box
              key={mod.id}
              sx={{
                borderBottom: index < modules.length - 1 ? `1px solid ${alpha(PRIMARY, 0.08)}` : "none",
              }}
            >
              <ModuleItem module={mod} />
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        {currentLesson && (
          <Box
            sx={{
              p: 1.75,
              mb: recentLessons.length > 0 ? 2 : 0,
              borderRadius: "12px",
              bgcolor: "rgba(8,145,178,0.04)",
              border: `1px solid ${alpha(PRIMARY, 0.08)}`,
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: PRIMARY, mb: 0.75 }}>
              Đang học hiện tại
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEXT, mb: 0.25 }}>
              {currentLesson.lesson} · {currentLesson.title}
            </Typography>
            <Typography sx={{ fontSize: 12, color: MUTED }}>
              {currentLesson.stage}
            </Typography>
          </Box>
        )}

        {recentLessons.length > 0 && (
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: MUTED, mb: 1, textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Bài học gần đây
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {recentLessons.slice(0, 5).map((lesson) => (
                <Box
                  key={lesson.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 0.5,
                  }}
                >
                  {lesson.isCompleted ? (
                    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 15, color: "#16A34A" }} />
                  ) : (
                    <PlayCircleOutlineOutlinedIcon sx={{ fontSize: 15, color: PRIMARY }} />
                  )}
                  <Typography sx={{ fontSize: 12.5, color: TEXT, fontWeight: lesson.isCurrent ? 600 : 500 }}>
                    {lesson.label}
                    {lesson.isCurrent && (
                      <Typography component="span" sx={{ fontSize: 11, color: PRIMARY, ml: 0.75 }}>
                        (hiện tại)
                      </Typography>
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
