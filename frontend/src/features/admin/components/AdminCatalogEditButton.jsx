import { Box, IconButton, Tooltip, alpha } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { PRIMARY, MUTED } from '@/features/mentor/components/course/mentorCourseCreateStyles';

export default function AdminCatalogEditButton({
  onClick,
  ariaLabel,
  title = 'Chỉnh sửa',
  bare = false,
}) {
  const button = (
    <Tooltip title={title}>
      <IconButton
        size="small"
        aria-label={ariaLabel}
        onClick={onClick}
        sx={{
          width: 34,
          height: 34,
          borderRadius: '10px',
          border: '1px solid rgba(15,23,42,0.08)',
          color: MUTED,
          '&:hover': {
            color: PRIMARY,
            bgcolor: alpha(PRIMARY, 0.06),
            borderColor: alpha(PRIMARY, 0.2),
          },
        }}
      >
        <EditOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );

  if (bare) return button;

  return (
    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
      {button}
    </Box>
  );
}
