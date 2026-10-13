import { HEADER_HEIGHT } from '@/shared/layout/MainLayout';
import { MUTED, PRIMARY, TEXT } from './mentorCourseCreateStyles';

export const BORDER = 'rgba(15,23,42,0.08)';
export const BORDER_STRONG = 'rgba(15,23,42,0.12)';

/** Accent colors — dùng cho line/icon/focus, không tô nền block. */
export const CHAPTER_THEME = {
  color: PRIMARY,
  bg: 'transparent',
  border: BORDER,
  focus: 'rgba(8,145,178,0.35)',
  accent: PRIMARY,
};

export const LESSON_THEME = {
  color: '#475569',
  bg: 'transparent',
  border: BORDER,
  focus: 'rgba(71,85,105,0.25)',
  accent: '#94A3B8',
  headerBg: 'rgba(241,245,249,0.95)',
};

export const MATERIAL_SECTION_THEME = {
  color: MUTED,
  bg: 'transparent',
  border: BORDER,
  focus: 'rgba(100,116,139,0.25)',
  accent: '#CBD5E1',
};

export const MATERIAL_TYPE_THEME = {
  VIDEO: { color: '#E11D48', soft: 'transparent', border: BORDER, bg: '#FFFFFF' },
  TEXT: { color: PRIMARY, soft: 'transparent', border: BORDER, bg: '#FFFFFF' },
  DOC: { color: '#2563EB', soft: 'transparent', border: BORDER, bg: '#FFFFFF' },
  TEST: { color: '#7C3AED', soft: 'transparent', border: BORDER, bg: '#FFFFFF' },
};

export const CONTENT_FIELD_LABEL_SX = {
  fontSize: 12,
  fontWeight: 500,
  color: MUTED,
  mb: 0.4,
  lineHeight: 1.25,
};

export const CONTENT_SECTION_LABEL_SX = {
  fontSize: 12,
  fontWeight: 700,
  color: MUTED,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  mb: 1.25,
  mt: 0.5,
  lineHeight: 1.3,
};

export const CONTENT_CARD_META_SX = {
  fontSize: 13,
  fontWeight: 500,
  color: MUTED,
  lineHeight: 1.35,
};

export const CONTENT_CARD_TITLE_SX = {
  fontSize: 15,
  fontWeight: 600,
  color: TEXT,
  lineHeight: 1.35,
};

function underlineBorderColor(hasError, accent = PRIMARY) {
  return hasError ? '#DC2626' : 'rgba(8,145,178,0.18)';
}

export const contentInputInnerSx = {
  fontSize: 14,
  fontWeight: 600,
  color: TEXT,
  lineHeight: 1.45,
  width: '100%',
  '& .MuiInputBase-input': {
    p: 0,
    height: 'auto',
  },
  '& .MuiInputBase-inputMultiline': {
    p: 0,
  },
  '& .MuiInputBase-input::placeholder': {
    color: MUTED,
    opacity: 0.7,
    fontWeight: 500,
  },
};

export function contentFieldSx(hasError = false, theme = CHAPTER_THEME) {
  const accent = theme?.color ?? PRIMARY;
  return {
    pb: '4px',
    width: '100%',
    boxSizing: 'border-box',
    borderBottom: `1px solid ${underlineBorderColor(hasError, accent)}`,
    transition: 'border-color 0.2s ease',
    '&:focus-within': {
      borderBottomColor: hasError ? '#DC2626' : accent,
    },
  };
}

export function contentInputSx(hasError = false, theme = CHAPTER_THEME) {
  const accent = theme?.color ?? PRIMARY;
  return {
    ...contentInputInnerSx,
    display: 'block',
    pb: '4px',
    borderRadius: 0,
    border: 'none',
    borderBottom: `1px solid ${underlineBorderColor(hasError, accent)}`,
    bgcolor: 'transparent',
    minHeight: 'unset',
    px: 0,
    py: 0,
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    '&.Mui-focused': {
      borderBottomColor: hasError ? '#DC2626' : accent,
    },
    '&:focus-within': {
      borderBottomColor: hasError ? '#DC2626' : accent,
    },
  };
}

export function contentMultilineInputSx(hasError = false, theme = CHAPTER_THEME) {
  return {
    ...contentInputSx(hasError, theme),
    alignItems: 'flex-start',
    py: 0.25,
  };
}

export const TEST_ADD_QUESTION_THEME = {
  color: '#059669',
  bg: 'transparent',
  border: BORDER,
  focus: 'rgba(5,150,105,0.22)',
};

export const TEST_ADD_SECTION_THEME = {
  color: '#7C3AED',
  bg: 'transparent',
  border: BORDER,
  focus: 'rgba(124,58,237,0.22)',
};

export function contentAddButtonSx(_theme = CHAPTER_THEME) {
  return {
    border: `1px dashed ${BORDER_STRONG}`,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'inherit',
    color: MUTED,
    px: 1.5,
    py: 0.85,
    borderRadius: '10px',
    bgcolor: 'transparent',
    transition: 'color 0.15s, border-color 0.15s, background-color 0.15s',
    '&:hover': {
      color: PRIMARY,
      borderColor: 'rgba(8,145,178,0.35)',
      bgcolor: 'rgba(8,145,178,0.03)',
    },
  };
}

export const CONTENT_DIVIDER_SX = {
  borderBottom: `1px solid ${BORDER}`,
};

export function contentNestedSx(_theme = LESSON_THEME) {
  return {
    pl: { xs: 1.25, sm: 2 },
    ml: { xs: 0.5, sm: 0.75 },
  };
}

export const BUILDER_PANEL_SX = {
  bgcolor: '#fff',
  borderRadius: '14px',
  border: `1px solid ${BORDER}`,
  boxShadow: 'none',
};

export const TAB_STRIP_BG = '#E8EDF3';

/** Chiều cao dải tab chương (sticky) — offset cho thanh nội dung bên dưới. */
export const BUILDER_CHAPTER_TAB_STRIP_HEIGHT = 40;

/** Chiều cao thanh tổng kết chương (sticky) — offset cho tab bài/học liệu. */
export const BUILDER_CHAPTER_BAR_HEIGHT = 44;

/** Chiều cao rail tab bài học + toolbar (sticky). */
export const BUILDER_LESSON_RAIL_HEIGHT = 72;

/** Chiều cao khối pinned tab học liệu + toolbar. */
export const BUILDER_MATERIAL_PINNED_HEIGHT = 68;

/** Sticky offsets — chỉ tab học liệu sticky khi scroll. */
export const BUILDER_STICKY_MATERIAL_TABS_ONLY_TOP = HEADER_HEIGHT;

/** Chiều cao dải tab học liệu. */
export const BUILDER_MATERIAL_TAB_STRIP_HEIGHT = 36;

/** @deprecated — các thanh khác không còn sticky xếp chồng. */
export const BUILDER_STICKY_CHAPTER_TABS_TOP = HEADER_HEIGHT;
export const BUILDER_STICKY_ACTION_BAR_TOP =
  HEADER_HEIGHT + BUILDER_CHAPTER_TAB_STRIP_HEIGHT;
export const BUILDER_STICKY_LESSON_RAIL_TOP =
  HEADER_HEIGHT + BUILDER_CHAPTER_TAB_STRIP_HEIGHT + BUILDER_CHAPTER_BAR_HEIGHT;
export const BUILDER_STICKY_MATERIAL_PINNED_TOP =
  BUILDER_STICKY_LESSON_RAIL_TOP + BUILDER_LESSON_RAIL_HEIGHT;

/** scroll-margin-top khi focus / cuộn tới section trong builder. */
export const BUILDER_SCROLL_MARGIN_TOP = BUILDER_STICKY_MATERIAL_TABS_ONLY_TOP + 12;
export const BUILDER_SCROLL_MARGIN_MATERIAL =
  BUILDER_STICKY_MATERIAL_TABS_ONLY_TOP +
  BUILDER_MATERIAL_TAB_STRIP_HEIGHT +
  BUILDER_CHAPTER_BAR_HEIGHT +
  12;

/** Sticky rail tab học liệu + toolbar tóm tắt. */
export function materialPinnedRailStickySx(
  top = BUILDER_STICKY_MATERIAL_TABS_ONLY_TOP,
  zIndex = 30,
) {
  return {
    position: 'sticky',
    top,
    zIndex,
    width: '100%',
    bgcolor: '#fff',
    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
    boxSizing: 'border-box',
  };
}

/** Full-bleed trong vùng body có px:2 — tránh khe trắng khi dùng mx âm. */
export function breakoutBodyPaddingSx(padding = 2) {
  return (theme) => ({
    mx: -padding,
    width: `calc(100% + ${theme.spacing(padding * 2)})`,
    maxWidth: 'none',
    boxSizing: 'border-box',
  });
}

/** Sticky tab strip — `top` offset for nested strips inside scroll container. */
export function tabStripStickySx(top = BUILDER_STICKY_MATERIAL_TABS_ONLY_TOP, zIndex = 12) {
  return {
    position: 'sticky',
    top,
    zIndex,
    bgcolor: TAB_STRIP_BG,
    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
    width: '100%',
  };
}

/** Khối pinned (tab + toolbar) trong section collapsible. */
export function pinnedTabStickySx(top = BUILDER_STICKY_ACTION_BAR_TOP, zIndex = 18) {
  return {
    position: 'sticky',
    top,
    zIndex,
    alignSelf: 'flex-start',
    width: '100%',
    bgcolor: '#fff',
    boxShadow: '0 4px 12px rgba(15,23,42,0.04)',
  };
}

/** @deprecated — không dùng nền header màu nữa */
export const CHAPTER_HEADER_BG = 'transparent';

export function chapterCardSx(_expanded = true) {
  return {
    bgcolor: '#fff',
    borderRadius: '14px',
    border: `1px solid ${BORDER}`,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      bgcolor: CHAPTER_THEME.accent,
      borderRadius: '14px 14px 0 0',
    },
  };
}

export function lessonBlockSx() {
  return {
    bgcolor: '#fff',
    borderRadius: '12px',
    border: `1px solid ${BORDER}`,
    mb: 2,
    overflow: 'hidden',
  };
}

export function lessonHeaderSx(expanded = true) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    px: 1.75,
    py: 1.1,
    bgcolor: LESSON_THEME.headerBg,
    borderBottom: expanded ? `1px solid ${BORDER}` : 'none',
  };
}

export function lessonBodySx() {
  return {
    px: 1.75,
    py: 2,
    pb: 1.75,
    bgcolor: '#fff',
  };
}

export function materialRowSx(isDragOver = false) {
  return {
    py: 2,
    px: { xs: 0, sm: 0.25 },
    borderTop: `1px solid ${BORDER}`,
    borderBottom: isDragOver ? `2px solid ${PRIMARY}` : 'none',
    opacity: 1,
    transition: 'border-color 0.15s ease, opacity 0.15s ease',
    '&:first-of-type': { borderTop: 'none', pt: 1.5 },
  };
}

export const ICON_BTN_SX = {
  color: MUTED,
  p: 0.5,
  '&:hover': { color: TEXT, bgcolor: 'rgba(15,23,42,0.04)' },
};

export const DELETE_ICON_BTN_SX = {
  color: MUTED,
  p: 0.5,
  '&:hover': { color: '#DC2626', bgcolor: 'rgba(220,38,38,0.05)' },
};

export const DELETE_NEW_PATH_BTN_SX = {
  minHeight: 36,
  px: 1.75,
  py: 0.75,
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.2,
  color: '#DC2626',
  border: '1.5px solid #DC2626',
  borderRadius: '10px',
  flexShrink: 0,
  boxShadow: 'none',
  '&:hover': {
    color: '#B91C1C',
    borderColor: '#B91C1C',
    bgcolor: 'rgba(220,38,38,0.06)',
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    color: 'rgba(220,38,38,0.45)',
    borderColor: 'rgba(220,38,38,0.35)',
  },
};

export function scopedEditorBarSx(dirty = false) {
  return {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    mb: 1.5,
    p: 1.25,
    borderRadius: '12px',
    bgcolor: dirty ? 'rgba(245,158,11,0.08)' : 'rgba(15,23,42,0.03)',
    border: `1px solid ${dirty ? 'rgba(245,158,11,0.22)' : 'rgba(15,23,42,0.06)'}`,
  };
}

export function scopedRestoreButtonSx(dirty = false) {
  return {
    height: 36,
    px: 2,
    fontSize: 13,
    fontWeight: 700,
    borderRadius: '999px',
    boxShadow: 'none',
    flexShrink: 0,
    bgcolor: 'transparent',
    color: dirty ? '#92400E' : MUTED,
    border: `1px solid ${dirty ? 'rgba(245,158,11,0.35)' : 'rgba(15,23,42,0.08)'}`,
    '&:hover': dirty
      ? { bgcolor: 'rgba(245,158,11,0.10)', boxShadow: 'none' }
      : { bgcolor: 'rgba(15,23,42,0.04)', boxShadow: 'none' },
    '&.Mui-disabled': {
      bgcolor: 'transparent',
      color: MUTED,
      borderColor: 'rgba(15,23,42,0.06)',
      opacity: 0.72,
    },
  };
}

export function scopedUpdateButtonSx(dirty = false) {
  return {
    height: 36,
    px: 2,
    fontSize: 13,
    fontWeight: 700,
    borderRadius: '999px',
    boxShadow: 'none',
    flexShrink: 0,
    ...(dirty
      ? {
        bgcolor: PRIMARY,
        color: '#fff',
        '&:hover': { bgcolor: '#0E7490', boxShadow: 'none' },
      }
      : {
        bgcolor: 'rgba(15,23,42,0.06)',
        color: MUTED,
        border: '1px solid rgba(15,23,42,0.08)',
        '&:hover': { bgcolor: 'rgba(15,23,42,0.09)', boxShadow: 'none' },
      }),
    '&.Mui-disabled': {
      bgcolor: 'rgba(15,23,42,0.06)',
      color: MUTED,
      opacity: 0.72,
    },
  };
}
