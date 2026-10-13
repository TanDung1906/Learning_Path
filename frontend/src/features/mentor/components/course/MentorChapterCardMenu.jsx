import { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import AppButton from '@/shared/ui/AppButton';
import { ICON_BTN_SX } from './mentorCourseContentStyles';
import { PRIMARY } from './mentorCourseCreateStyles';

function getMenuPaperSx(theme) {
  return {
    mt: 0.5,
    minWidth: 196,
    borderRadius: '12px',
    border: '1px solid rgba(15,23,42,0.08)',
    boxShadow: '0 8px 24px rgba(15,23,42,0.10)',
    bgcolor: '#fff',
    '& .MuiList-root': { py: 0.5 },
  };
}

export default function MentorChapterCardMenu({
  disabled = false,
  quizSetupDisabled = false,
  quizSetupDisabledReason = '',
  variant = 'chapter',
  onQuizSetup,
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isCourseVariant = variant === 'course';
  const isButtonVariant = variant === 'button' || variant === 'courseButton' || variant === 'chapterButton';
  const buttonLabel =
    variant === 'courseButton'
      ? 'Thiết lập bài kiểm tra toàn khóa'
      : variant === 'chapterButton'
        ? 'Thiết lập bài kiểm tra chương'
        : 'Thêm bài test';
  const menuLabel = isCourseVariant ? 'Thiết lập kiểm tra toàn khóa' : 'Thiết lập kiểm tra';
  const ariaLabel = isCourseVariant ? 'Tùy chọn khóa học' : 'Tùy chọn chương';

  const handleQuizSetup = () => {
    handleClose();
    onQuizSetup?.();
  };

  const handleQuizSetupClick = (event) => {
    event.stopPropagation();
    if (disabled || quizSetupDisabled) return;
    onQuizSetup?.();
  };

  if (isButtonVariant) {
    const isCourseButton = variant === 'courseButton';
    const quizButton = (
      <AppButton
        variant={isCourseButton ? 'contained' : 'outlined'}
        fullWidth={isCourseButton}
        onClick={handleQuizSetupClick}
        disabled={disabled || quizSetupDisabled}
        startIcon={
          <QuizRoundedIcon sx={{ fontSize: isCourseButton ? 20 : 15 }} />
        }
        sx={
          isCourseButton
            ? {
                width: '100%',
                minHeight: 48,
                px: 2,
                py: 1.25,
                fontSize: 14,
                fontWeight: 800,
                borderRadius: '14px',
                bgcolor: '#7C3AED',
                color: '#fff',
                boxShadow: '0 8px 20px rgba(124,58,237,0.22)',
                whiteSpace: 'normal',
                lineHeight: 1.35,
                textAlign: 'left',
                justifyContent: 'flex-start',
                '&:hover': {
                  bgcolor: '#6D28D9',
                  boxShadow: '0 10px 24px rgba(124,58,237,0.28)',
                },
                '& .MuiButton-startIcon': {
                  mr: 1.25,
                  ml: 0,
                },
              }
            : variant === 'chapterButton'
              ? {
                  flexShrink: 0,
                  width: { xs: '100%', sm: 'auto' },
                  height: 32,
                  minHeight: 32,
                  px: 1.25,
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: '999px',
                  borderColor: 'rgba(124,58,237,0.28)',
                  color: '#7C3AED',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.25,
                  '&:hover': {
                    borderColor: '#7C3AED',
                    bgcolor: 'rgba(124,58,237,0.06)',
                  },
                }
              : {
                flexShrink: 0,
                height: 28,
                minHeight: 28,
                minWidth: 0,
                px: 1,
                fontSize: 11.5,
                fontWeight: 700,
                borderRadius: '999px',
                borderColor: 'rgba(124,58,237,0.28)',
                color: '#7C3AED',
                whiteSpace: 'nowrap',
                lineHeight: 1.25,
                '&:hover': {
                  borderColor: '#7C3AED',
                  bgcolor: 'rgba(124,58,237,0.06)',
                },
              }
        }
      >
        {buttonLabel}
      </AppButton>
    );

    return quizSetupDisabled && quizSetupDisabledReason ? (
      <Tooltip title={quizSetupDisabledReason}>
        <span>{quizButton}</span>
      </Tooltip>
    ) : (
      quizButton
    );
  }

  const handleOpen = (event) => {
    event.stopPropagation();
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const menuButton = (
    <IconButton
      size="small"
      onClick={handleOpen}
      disabled={disabled}
      aria-label={ariaLabel}
      sx={ICON_BTN_SX}
    >
      <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
    </IconButton>
  );

  return (
    <>
      {quizSetupDisabled && quizSetupDisabledReason ? (
        <Tooltip title={quizSetupDisabledReason}>
          <span>{menuButton}</span>
        </Tooltip>
      ) : (
        menuButton
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: { sx: getMenuPaperSx(theme) },
          list: { dense: true, sx: { py: 0.5 } },
        }}
      >
        <MenuItem
          onClick={handleQuizSetup}
          disabled={quizSetupDisabled}
          sx={{
            borderRadius: '8px',
            mx: 0.5,
            my: 0.25,
            minHeight: 36,
            py: 0.75,
            px: 1.25,
            gap: 1,
            fontSize: 13,
            fontWeight: 500,
            '&:hover': { bgcolor: alpha(PRIMARY, 0.06) },
          }}
        >
          <QuizRoundedIcon sx={{ fontSize: 18, color: '#7C3AED' }} />
          <Typography component="span" sx={{ fontSize: 13, fontWeight: 500 }}>
            {menuLabel}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
