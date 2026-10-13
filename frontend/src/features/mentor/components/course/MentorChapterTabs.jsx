import { Box, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { MUTED, PRIMARY, TEXT } from './mentorCourseCreateStyles';
import { TAB_STRIP_BG } from './mentorCourseContentStyles';
import { isPathActive } from '@/features/mentor/utils/mentorCourseContentUtils';

function getTabLabel(path, pathIndex) {
  const prefix = `Chương ${pathIndex + 1}`;
  const name = String(path.PathName ?? '').trim();
  if (!name) return prefix;
  const title = name.length > 22 ? `${name.slice(0, 20)}…` : name;
  return `${prefix} · ${title}`;
}

function ContentStatusIcon({ hasContent, size = 15 }) {
  if (hasContent) {
    return <CheckCircleRoundedIcon sx={{ fontSize: size, color: '#059669', flexShrink: 0 }} />;
  }
  return (
    <RadioButtonUncheckedRoundedIcon sx={{ fontSize: size, color: '#94A3B8', flexShrink: 0 }} />
  );
}

export default function MentorChapterTabs({
  paths = [],
  activeId,
  onChange,
  onAdd,
  disabled = false,
  hasErrorById = {},
  hasContentById = {},
  trailingActions = null,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 0.5,
        px: 0.5,
        pt: 0.75,
        pb: 0,
        bgcolor: TAB_STRIP_BG,
        borderRadius: '12px 12px 0 0',
        border: '1px solid rgba(15,23,42,0.1)',
        borderBottom: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 0.25,
          flex: 1,
          minWidth: 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(15,23,42,0.15)',
            borderRadius: '999px',
          },
        }}
      >
      {paths.map((path, pathIndex) => {
        const isActive = path.tempId === activeId;
        const hasError = Boolean(hasErrorById[path.tempId]);
        const hasContent = Boolean(hasContentById[path.tempId]);
        const published = isPathActive(path);

        return (
          <Box
            key={path.tempId}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(path.tempId)}
            sx={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              minWidth: 0,
              maxWidth: 220,
              height: 36,
              px: 1.25,
              flexShrink: 0,
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: '10px 10px 0 0',
              border: '1px solid',
              borderColor: isActive ? 'rgba(15,23,42,0.1)' : 'transparent',
              borderBottom: isActive ? '1px solid #fff' : '1px solid transparent',
              bgcolor: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              color: isActive ? TEXT : MUTED,
              opacity: published ? 1 : 0.72,
              mb: isActive ? '-1px' : 0,
              zIndex: isActive ? 2 : 1,
              transition: 'background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease',
              '&:hover': {
                bgcolor: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
                color: TEXT,
              },
            }}
          >
            <ContentStatusIcon hasContent={hasContent} size={14} />
            {hasError ? (
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#DC2626',
                  flexShrink: 0,
                }}
              />
            ) : null}
            <Typography
              noWrap
              sx={{
                fontSize: 13,
                fontWeight: isActive ? 700 : 600,
                lineHeight: 1.3,
                minWidth: 0,
              }}
            >
              {getTabLabel(path, pathIndex)}
            </Typography>
            {!published ? (
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#64748B',
                  bgcolor: 'rgba(100,116,139,0.12)',
                  px: 0.6,
                  py: 0.15,
                  borderRadius: '999px',
                  flexShrink: 0,
                  lineHeight: 1.4,
                }}
              >
                Ẩn
              </Typography>
            ) : null}
          </Box>
        );
      })}

      <Box
        component="button"
        type="button"
        onClick={onAdd}
        disabled={disabled}
        aria-label="Thêm chương"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          mb: 0.25,
          ml: 0.25,
          flexShrink: 0,
          border: 'none',
          borderRadius: '8px',
          bgcolor: 'transparent',
          color: MUTED,
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          '&:hover': disabled ? undefined : { bgcolor: 'rgba(15,23,42,0.06)', color: PRIMARY },
        }}
      >
        <AddRoundedIcon sx={{ fontSize: 18 }} />
      </Box>
      </Box>
      {trailingActions ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.35,
            flexShrink: 0,
            pr: 0.35,
            pb: 0.25,
          }}
        >
          {trailingActions}
        </Box>
      ) : null}
    </Box>
  );
}

export { ContentStatusIcon };
