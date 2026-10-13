import { Box } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AppButton from '@/shared/ui/AppButton';
import { PRIMARY } from './mentorCourseCreateStyles';

export const COURSE_CONTENT_MOBILE_FOOTER_ID = 'course-content-mobile-footer-actions';

const BUTTON_SX = {
  height: 42,
  borderRadius: '999px',
  fontWeight: 700,
  fontSize: 14,
  whiteSpace: 'nowrap',
};

export default function MentorCourseContentFooterActions({
  onBack,
  onSaveDraft,
  onPrimary,
  primaryLabel,
  primaryEndIcon,
  backDisabled = false,
  saveDraftDisabled = false,
  primaryDisabled = false,
  saveDraftLoading = false,
  primaryLoading = false,
  primaryColor = PRIMARY,
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        <AppButton
          variant="outlined"
          startIcon={
            <ArrowBackRoundedIcon sx={{ fontSize: 18, display: { xs: 'none', sm: 'inline-flex' } }} />
          }
          onClick={onBack}
          disabled={backDisabled}
          sx={{
            ...BUTTON_SX,
            flex: 1,
            minWidth: 0,
            px: { xs: 1.25, sm: 2 },
          }}
        >
          Quay lại
        </AppButton>
        <AppButton
          variant="outlined"
          onClick={onSaveDraft}
          loading={saveDraftLoading}
          disabled={saveDraftDisabled}
          sx={{
            ...BUTTON_SX,
            flex: 1,
            minWidth: 0,
            px: { xs: 1.25, sm: 2 },
          }}
        >
          Lưu nháp
        </AppButton>
      </Box>
      <AppButton
        onClick={onPrimary}
        loading={primaryLoading}
        endIcon={primaryEndIcon}
        disabled={primaryDisabled}
        fullWidth
        sx={{
          ...BUTTON_SX,
          bgcolor: primaryColor,
          '&:hover': { bgcolor: '#0E7490' },
        }}
      >
        {primaryLabel}
      </AppButton>
    </Box>
  );
}
