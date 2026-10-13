import { Box, Typography } from "@mui/material";

const MUTED = "#64748B";
const TEXT = "#0F172A";
const DIVIDER = "rgba(8,145,178,0.18)";

function SummaryItem({ label, value }) {
  return (
    <Box
      sx={{
        minWidth: 100,
        flex: "1 1 120px",
        pb: "6px",
        borderBottom: `1px solid ${DIVIDER}`,
      }}
    >
      <Typography sx={{ fontSize: 12, color: MUTED, fontWeight: 500, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 15, color: TEXT, fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function MyCourseLearningSummary({
  learningCount = 0,
  completedCount = 0,
  avgProgress = 0,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: { xs: 2, sm: 3 },
        mb: 3,
      }}
    >
      <SummaryItem label="Đang học" value={learningCount} />
      <SummaryItem label="Hoàn thành" value={completedCount} />
      <SummaryItem label="Tiến độ trung bình" value={`${avgProgress}%`} />
    </Box>
  );
}
