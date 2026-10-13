import { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { contentInputSx } from '@/features/mentor/components/course/mentorCourseContentStyles';
import { PRIMARY, TEXT, MUTED } from '@/features/mentor/components/course/mentorCourseCreateStyles';

function getMenuPaperSx(theme) {
  return {
    mt: 0.75,
    borderRadius: '12px',
    boxShadow: theme.ios18?.shadow?.md ?? '0 8px 24px rgba(15,23,42,0.10)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    overflow: 'hidden',
    minWidth: 180,
  };
}

export function FormFieldText({
  label,
  value,
  onChange,
  error = '',
  placeholder = '',
  type = 'text',
  optional = false,
}) {
  return (
    <Box>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: MUTED, mb: 0.5, lineHeight: 1.35 }}>
        {label}
        {optional ? (
          <Box
            component="span"
            sx={{ fontSize: 10.5, fontWeight: 500, color: '#94A3B8', ml: 0.5 }}
          >
            (tùy chọn)
          </Box>
        ) : null}
      </Typography>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        fullWidth
        sx={{
          ...contentInputSx(Boolean(error)),
          fontSize: 14,
          fontWeight: 500,
          color: TEXT,
          px: 1.25,
          py: 0.75,
          minHeight: 40,
        }}
      />
      {error ? (
        <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.5 }}>{error}</Typography>
      ) : null}
    </Box>
  );
}

export function FormFieldDate({
  label,
  value,
  onChange,
  error = '',
  optional = false,
}) {
  return (
    <Box>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: MUTED, mb: 0.5, lineHeight: 1.35 }}>
        {label}
        {optional ? (
          <Box
            component="span"
            sx={{ fontSize: 10.5, fontWeight: 500, color: '#94A3B8', ml: 0.5 }}
          >
            (tùy chọn)
          </Box>
        ) : null}
      </Typography>
      <Box
        component="input"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          ...contentInputSx(Boolean(error)),
          display: 'block',
          width: '100%',
          boxSizing: 'border-box',
          fontSize: 14,
          fontWeight: 500,
          color: TEXT,
          fontFamily: 'inherit',
          px: 1.25,
          py: 0.75,
          minHeight: 40,
          cursor: 'pointer',
          '&::-webkit-calendar-picker-indicator': {
            cursor: 'pointer',
            opacity: 0.65,
          },
        }}
      />
      {error ? (
        <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.5 }}>{error}</Typography>
      ) : null}
    </Box>
  );
}

export function FormFieldPassword({
  label,
  value,
  onChange,
  error = '',
  placeholder = '',
}) {
  const [show, setShow] = useState(false);

  return (
    <Box>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: MUTED, mb: 0.5 }}>{label}</Typography>
      <Box
        sx={{
          ...contentInputSx(Boolean(error)),
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 0.5,
          minHeight: 40,
        }}
      >
        <InputBase
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          fullWidth
          sx={{ fontSize: 14, fontWeight: 500, color: TEXT, px: 0.75 }}
        />
        <IconButton
          size="small"
          aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          onClick={() => setShow((prev) => !prev)}
          sx={{ color: '#94A3B8' }}
        >
          {show ? (
            <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
          ) : (
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>
      {error ? (
        <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.5 }}>{error}</Typography>
      ) : null}
    </Box>
  );
}

export function FormFieldSelect({
  label,
  icon: Icon,
  iconColor = '#94A3B8',
  value,
  options,
  onChange,
  error = '',
  colorMap = {},
  disabledOptions = [],
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const selected = options.find((option) => option.value === value);
  const selectedColors = colorMap[value];
  const triggerIconColor = selectedColors?.color ?? iconColor;

  return (
    <Box>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: MUTED, mb: 0.5 }}>{label}</Typography>
      <Box
        component="button"
        type="button"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          ...contentInputSx(Boolean(error)),
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          cursor: 'pointer',
          font: 'inherit',
          textAlign: 'left',
          width: '100%',
          ...(selectedColors && {
            bgcolor: selectedColors.bgcolor,
            borderColor: selectedColors.border?.replace(/^1px solid /, '') ?? alpha(selectedColors.color, 0.22),
          }),
          ...(open && {
            borderColor: error ? '#DC2626' : (selectedColors?.color ?? PRIMARY),
          }),
        }}
      >
        {Icon ? <Icon sx={{ fontSize: 16, color: triggerIconColor, flexShrink: 0 }} /> : null}
        <Typography
          component="span"
          sx={{
            flex: 1,
            fontSize: 13,
            fontWeight: selectedColors ? 700 : 500,
            color: selectedColors?.color ?? TEXT,
            lineHeight: 1.4,
          }}
        >
          {selected?.label ?? 'Chọn...'}
        </Typography>
        <KeyboardArrowDownRoundedIcon
          sx={{
            fontSize: 20,
            color: '#94A3B8',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
      </Box>
      {error ? (
        <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.5 }}>{error}</Typography>
      ) : null}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { ...getMenuPaperSx(theme), minWidth: anchorEl?.offsetWidth ?? 180 } },
          list: { dense: true, sx: { py: 0.5 } },
        }}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          const optionColors = colorMap[option.value];
          const isDisabled = disabledOptions.includes(option.value);
          return (
            <MenuItem
              key={option.value}
              selected={isSelected}
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return;
                onChange(option.value);
                setAnchorEl(null);
              }}
              sx={{
                borderRadius: '8px',
                mx: 0.5,
                my: 0.25,
                minHeight: 34,
                py: 0.5,
                px: 1.25,
                gap: 0.75,
                fontSize: 13,
                fontWeight: isSelected ? 700 : 500,
                color: optionColors?.color ?? (isSelected ? theme.palette.primary.main : theme.palette.text.primary),
                bgcolor: isSelected
                  ? (optionColors?.bgcolor ?? alpha(theme.palette.primary.main, 0.08))
                  : 'transparent',
                '&.Mui-selected': {
                  bgcolor: optionColors?.bgcolor ?? alpha(theme.palette.primary.main, 0.08),
                  '&:hover': {
                    bgcolor: optionColors?.bgcolor ?? alpha(theme.palette.primary.main, 0.1),
                  },
                },
                '&:hover': {
                  bgcolor: optionColors?.bgcolor ?? alpha(theme.palette.primary.main, 0.06),
                },
                ...(isDisabled && {
                  opacity: 0.45,
                  cursor: 'not-allowed',
                  '&:hover': { bgcolor: 'transparent' },
                }),
              }}
            >
              {optionColors ? (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: optionColors.color,
                    flexShrink: 0,
                  }}
                />
              ) : null}
              <Typography component="span" sx={{ flex: 1, fontSize: 13, fontWeight: 'inherit' }}>
                {option.label}
              </Typography>
              {isSelected ? (
                <CheckRoundedIcon
                  sx={{ fontSize: 16, color: optionColors?.color ?? 'primary.main', ml: 1 }}
                />
              ) : (
                <Box sx={{ width: 16, ml: 1, flexShrink: 0 }} />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
