import { IconButton, Tooltip } from "@mui/material";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";

const SAVED = "#F59E0B";
const DEFAULT = "#94A3B8";

export default function CourseBookmarkButton({
  isSaved = false,
  onToggle,
  size = "small",
  iconSize = 20,
}) {
  return (
    <Tooltip title={isSaved ? "Đã lưu" : "Lưu khóa học"}>
      <IconButton
        size={size}
        aria-label={isSaved ? "Đã lưu" : "Lưu khóa học"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle?.();
        }}
        sx={{
          width: 32,
          height: 32,
          p: 0.5,
          color: isSaved ? SAVED : DEFAULT,
          bgcolor: "transparent",
          transition: "color 0.2s ease",
          "&:hover": {
            bgcolor: "transparent",
            color: SAVED,
          },
        }}
      >
        {isSaved ? (
          <BookmarkRoundedIcon sx={{ fontSize: iconSize, color: "inherit" }} />
        ) : (
          <BookmarkBorderRoundedIcon sx={{ fontSize: iconSize, color: "inherit" }} />
        )}
      </IconButton>
    </Tooltip>
  );
}
