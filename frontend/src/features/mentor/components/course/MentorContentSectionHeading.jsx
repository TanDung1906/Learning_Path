import { Box, InputBase, Typography } from '@mui/material';
import { CONTENT_SHORT_DESCRIPTION_MAX } from '@/features/mentor/utils/mentorCourseContentUtils';
import { MUTED, TEXT } from './mentorCourseCreateStyles';
import {
  CONTENT_CARD_META_SX,
  CONTENT_CARD_TITLE_SX,
  CONTENT_FIELD_LABEL_SX,
  contentFieldSx,
  contentInputInnerSx,
} from './mentorCourseContentStyles';

export function ContentFieldLabel({ children, sx }) {
  return (
    <Typography sx={{ ...CONTENT_FIELD_LABEL_SX, ...sx }}>
      {children}
    </Typography>
  );
}

export function ContentShortDescriptionField({
  label = 'Mô tả ngắn',
  value,
  onChange,
  disabled = false,
  theme,
  placeholder = 'Mô tả ngắn (tuỳ chọn)',
  maxLength = CONTENT_SHORT_DESCRIPTION_MAX,
  labelSx,
  containerSx,
}) {
  const charCount = String(value ?? '').length;

  const handleChange = (event) => {
    const next = event.target.value.slice(0, maxLength);
    if (next === event.target.value) {
      onChange(event);
      return;
    }
    onChange({ ...event, target: { ...event.target, value: next } });
  };

  return (
    <Box sx={containerSx}>
      <ContentFieldLabel sx={labelSx}>{label}</ContentFieldLabel>
      <Box sx={contentFieldSx(false, theme)}>
        <InputBase
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          fullWidth
          multiline
          minRows={2}
          inputProps={{ maxLength }}
          sx={{ ...contentInputInnerSx, alignItems: 'flex-start', py: 0.25 }}
        />
      </Box>
      <Typography
        sx={{
          fontSize: 11,
          color: charCount >= maxLength ? '#DC2626' : MUTED,
          mt: 0.35,
          lineHeight: 1.3,
          textAlign: 'right',
        }}
      >
        {charCount}/{maxLength}
      </Typography>
    </Box>
  );
}

export default function MentorContentSectionHeading({
  Icon,
  meta,
  title,
  theme,
  action,
  compact = false,
}) {
  const iconFontSize = compact ? 18 : 20;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
      {Icon ? (
        <Icon sx={{ fontSize: iconFontSize, color: theme?.color ?? MUTED, flexShrink: 0 }} />
      ) : null}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {meta && (
          <Typography sx={{ ...CONTENT_CARD_META_SX, fontSize: compact ? 11 : 12 }}>
            {meta}
          </Typography>
        )}
        <Typography
          sx={{
            ...CONTENT_CARD_TITLE_SX,
            fontSize: compact ? 14 : 15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
      </Box>

      {action}
    </Box>
  );
}

export function MentorContentBlockHeading({ Icon, label, theme, sx }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1, ...sx }}>
      <Icon sx={{ fontSize: 18, color: theme?.color ?? MUTED, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: TEXT, lineHeight: 1.35 }}>
        {label}
      </Typography>
    </Box>
  );
}
