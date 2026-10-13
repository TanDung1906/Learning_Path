import { Box, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { ContentStatusIcon } from './MentorChapterTabs';
import { MUTED, PRIMARY, TEXT } from './mentorCourseCreateStyles';
import { TAB_STRIP_BG } from './mentorCourseContentStyles';

function getLessonTabLabel(node, nodeIndex) {
  const prefix = `Bài ${nodeIndex + 1}`;
  const name = String(node.NodeName ?? node.nodeName ?? '').trim();
  if (!name) return prefix;
  const title = name.length > 20 ? `${name.slice(0, 18)}…` : name;
  return `${prefix} · ${title}`;
}

export default function MentorLessonTabs({
  nodes = [],
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
        width: '100%',
        px: 0.5,
        pt: 0.65,
        pb: 0,
        bgcolor: TAB_STRIP_BG,
        borderRadius: '10px 10px 0 0',
        border: '1px solid rgba(15,23,42,0.08)',
        borderBottom: 'none',
        boxSizing: 'border-box',
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
          '&::-webkit-scrollbar': { height: 5 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(15,23,42,0.12)',
            borderRadius: '999px',
          },
        }}
      >
      {nodes.map((node, nodeIndex) => {
        const isActive = node.tempId === activeId;
        const hasError = Boolean(hasErrorById[node.tempId]);
        const hasContent = Boolean(hasContentById[node.tempId]);

        return (
          <Box
            key={node.tempId}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(node.tempId)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.45,
              minWidth: 0,
              maxWidth: 180,
              height: 32,
              px: 1.1,
              flexShrink: 0,
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: '8px 8px 0 0',
              border: '1px solid',
              borderColor: isActive ? 'rgba(15,23,42,0.08)' : 'transparent',
              borderBottom: isActive ? '1px solid #fff' : '1px solid transparent',
              bgcolor: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              color: isActive ? TEXT : MUTED,
              mb: isActive ? '-1px' : 0,
              zIndex: isActive ? 2 : 1,
              transition: 'background-color 0.15s ease, color 0.15s ease',
              '&:hover': {
                bgcolor: isActive ? '#fff' : 'rgba(255,255,255,0.82)',
                color: TEXT,
              },
            }}
          >
            <ContentStatusIcon hasContent={hasContent} size={13} />
            {hasError ? (
              <Box
                sx={{
                  width: 5,
                  height: 5,
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
              {getLessonTabLabel(node, nodeIndex)}
            </Typography>
          </Box>
        );
      })}

      <Box
        component="button"
        type="button"
        onClick={onAdd}
        disabled={disabled}
        aria-label="Thêm bài học"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          mb: 0.2,
          ml: 0.2,
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
        <AddRoundedIcon sx={{ fontSize: 16 }} />
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
            pb: 0.15,
          }}
        >
          {trailingActions}
        </Box>
      ) : null}
    </Box>
  );
}
