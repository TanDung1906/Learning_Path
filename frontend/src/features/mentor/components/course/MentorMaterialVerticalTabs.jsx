import { Box, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { ContentStatusIcon } from './MentorChapterTabs';
import { MUTED, PRIMARY, TEXT } from './mentorCourseCreateStyles';
import { BORDER, contentAddButtonSx } from './mentorCourseContentStyles';

const TYPE_SHORT = {
  VIDEO: 'Video',
  TEXT: 'Văn bản',
  DOC: 'Tài liệu',
};

function getMaterialTabLabel(material, materialIndex) {
  const title = String(material.Title ?? '').trim();
  if (title) {
    return title.length > 22 ? `${title.slice(0, 20)}…` : title;
  }
  const typeLabel = TYPE_SHORT[material.MaterialType] ?? 'Học liệu';
  return `${typeLabel} ${materialIndex + 1}`;
}

function getMaterialTypeHint(material) {
  return TYPE_SHORT[material.MaterialType] ?? 'Học liệu';
}

export default function MentorMaterialVerticalTabs({
  materials = [],
  activeId,
  onChange,
  onAdd,
  disabled = false,
  hasErrorById = {},
  hasContentById = {},
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { xs: 132, sm: 148 },
        flexShrink: 0,
        bgcolor: '#F1F5F9',
        borderRight: `1px solid ${BORDER}`,
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 0.75,
          px: 0.65,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.35,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(15,23,42,0.12)',
            borderRadius: '999px',
          },
        }}
      >
        {materials.map((material, materialIndex) => {
          const isActive = material.tempId === activeId;
          const hasError = Boolean(hasErrorById[material.tempId]);
          const hasContent = Boolean(hasContentById[material.tempId]);

          return (
            <Box
              key={material.tempId}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(material.tempId)}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 0.5,
                width: '100%',
                px: 0.85,
                py: 0.75,
                cursor: 'pointer',
                userSelect: 'none',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isActive ? 'rgba(8,145,178,0.22)' : 'transparent',
                borderLeftWidth: isActive ? 3 : 1,
                borderLeftColor: isActive ? PRIMARY : 'transparent',
                bgcolor: isActive ? '#fff' : 'transparent',
                color: isActive ? TEXT : MUTED,
                boxShadow: isActive ? '0 1px 3px rgba(15,23,42,0.06)' : 'none',
                transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                '&:hover': {
                  bgcolor: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                  color: TEXT,
                },
              }}
            >
              <ContentStatusIcon hasContent={hasContent} size={13} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 600,
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {getMaterialTabLabel(material, materialIndex)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 500,
                    color: MUTED,
                    lineHeight: 1.3,
                    mt: 0.2,
                  }}
                >
                  {getMaterialTypeHint(material)}
                  {hasError ? ' · Lỗi' : ''}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ p: 0.75, pt: 0.25, flexShrink: 0 }}>
        <Box
          component="button"
          type="button"
          onClick={onAdd}
          disabled={disabled}
          aria-label="Thêm học liệu"
          sx={{
            ...contentAddButtonSx(),
            width: '100%',
            justifyContent: 'center',
            fontSize: 12,
            py: 0.75,
            px: 0.75,
            cursor: disabled ? 'default' : 'pointer',
            opacity: disabled ? 0.55 : 1,
          }}
        >
          <AddRoundedIcon sx={{ fontSize: 16 }} />
          Thêm học liệu
        </Box>
      </Box>
    </Box>
  );
}
