import {
  Dialog,
  DialogContent,
  Typography,
  alpha,
  Box,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import AppButton from '@/shared/ui/AppButton';
import { MUTED, PRIMARY, TEXT } from './mentorCourseCreateStyles';

export default function MentorCourseCreateSuccessDialog({
  open,
  courseId,
  isPublished = false,
  onManageContent,
  onCreateQuestionBank,
  onBackToList,
}) {
  const subtitle = isPublished
    ? 'Khóa học đã được xuất bản thành công.'
    : 'Khóa học đã được lưu dưới dạng bản nháp.';

  return (
    <Dialog
      open={open}
      onClose={onBackToList}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: alpha('#0F172A', 0.35),
          },
        },
      }}
    >
      <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, py: { xs: 3, sm: 3.5 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 2.5 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'rgba(5,150,105,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 32, color: '#059669' }} />
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em', mb: 0.75 }}>
            Tạo khóa học thành công!
          </Typography>
          <Typography sx={{ fontSize: 14, color: MUTED, lineHeight: 1.6, maxWidth: 400 }}>
            {subtitle}
            <br />
            Bạn muốn làm gì tiếp theo?
          </Typography>
          {courseId != null && (
            <Typography sx={{ fontSize: 12, color: MUTED, mt: 1 }}>
              Mã khóa học: <Box component="span" sx={{ fontWeight: 700, color: TEXT }}>#{courseId}</Box>
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <AppButton
            startIcon={<MenuBookOutlinedIcon />}
            onClick={onManageContent}
            disabled={courseId == null}
            sx={{
              height: 46,
              borderRadius: '12px',
              fontWeight: 700,
              justifyContent: 'flex-start',
              px: 2,
              bgcolor: PRIMARY,
              '&:hover': { bgcolor: '#0E7490' },
            }}
          >
            Quản lý nội dung khóa học
          </AppButton>

          <AppButton
            variant="outlined"
            startIcon={<QuizOutlinedIcon />}
            onClick={onCreateQuestionBank}
            disabled={courseId == null}
            sx={{
              height: 46,
              borderRadius: '12px',
              fontWeight: 700,
              justifyContent: 'flex-start',
              px: 2,
            }}
          >
            Tạo ngân hàng câu hỏi
          </AppButton>

          <AppButton
            variant="text"
            startIcon={<ListAltRoundedIcon />}
            onClick={onBackToList}
            sx={{
              height: 42,
              borderRadius: '12px',
              fontWeight: 600,
              justifyContent: 'flex-start',
              px: 2,
              color: MUTED,
              '&:hover': { color: TEXT, bgcolor: 'rgba(15,23,42,0.04)' },
            }}
          >
            Quay lại danh sách khóa học
          </AppButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
