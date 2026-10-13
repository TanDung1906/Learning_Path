export const CREATE_CARD_SX = {
  bgcolor: '#FFFFFF',
  borderRadius: '14px',
  border: '1px solid rgba(15,23,42,0.08)',
  boxShadow: 'none',
  p: { xs: 2.25, sm: 3 },
};

/** Nền & viền dùng chung cho panel Nội dung / Học viên. */
export const SURFACE = '#FFFFFF';
export const SURFACE_SUBTLE = '#F8FAFC';
export const BORDER_SUBTLE = 'rgba(15,23,42,0.06)';
export const BORDER_DEFAULT = 'rgba(15,23,42,0.08)';

export const DETAIL_SECTION_HEADER_SX = {
  mb: 2,
};

export const DETAIL_PANEL_SX = {
  borderRadius: '14px',
  border: `1px solid ${BORDER_DEFAULT}`,
  overflow: 'hidden',
  bgcolor: SURFACE,
};

export const DETAIL_PANEL_HEADER_SX = {
  bgcolor: SURFACE_SUBTLE,
  borderBottom: `1px solid ${BORDER_SUBTLE}`,
};

export const DETAIL_NESTED_BLOCK_SX = {
  bgcolor: SURFACE_SUBTLE,
  borderRadius: '10px',
  border: `1px solid ${BORDER_SUBTLE}`,
};

export const DETAIL_TOOLBAR_WRAP_SX = {
  borderRadius: '14px',
  border: `1px solid ${BORDER_DEFAULT}`,
  bgcolor: SURFACE,
  p: { xs: 1.25, sm: 1.5 },
  mb: 2,
};

export const PRIMARY = '#0891B2';
export const TEXT = '#0F172A';
export const MUTED = '#64748B';

export const SECTION_TITLE_SX = {
  fontSize: 13,
  fontWeight: 600,
  color: TEXT,
  lineHeight: '20px',
  minHeight: 20,
  mb: 1.5,
};

/** Tiêu đề trang mentor (h1) — nhẹ hơn 800/28px cũ. */
export const PAGE_TITLE_SX = {
  fontSize: { xs: 20, sm: 22 },
  fontWeight: 700,
  color: TEXT,
  letterSpacing: '-0.01em',
  lineHeight: 1.35,
};

export const PAGE_DESCRIPTION_SX = {
  fontSize: 13,
  color: MUTED,
  lineHeight: 1.55,
  maxWidth: 720,
};

/** Tiêu đề card trong tab detail / review. */
export const CARD_SECTION_TITLE_SX = {
  fontSize: 14,
  fontWeight: 600,
  color: TEXT,
  lineHeight: 1.4,
};

export const CARD_SECTION_META_SX = {
  fontSize: 13,
  color: MUTED,
  lineHeight: 1.45,
};

/** Tên khóa học / ngân hàng câu hỏi ở header detail. */
export const DETAIL_ENTITY_TITLE_SX = {
  fontSize: { xs: 18, sm: 20 },
  fontWeight: 700,
  color: TEXT,
  lineHeight: 1.35,
  letterSpacing: '-0.01em',
};

/** Tiêu đề trang ngân hàng câu hỏi (tên chương/bộ câu hỏi). */
export const QUESTION_BANK_TITLE_SX = {
  fontSize: { xs: 16, sm: 17 },
  fontWeight: 600,
  color: TEXT,
  lineHeight: 1.4,
};

export const BREADCRUMB_LINK_SX = {
  fontSize: 13,
  color: MUTED,
  fontWeight: 500,
  maxWidth: { xs: 140, sm: 200 },
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  verticalAlign: 'bottom',
};

export const COURSE_THUMBNAIL_ASPECT = 4 / 3;
