import { Box, Typography, alpha } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { TEST_DIVIDER, TEST_MUTED } from './testTheme';

function getGroupProgress(group, answers = {}) {
  const questions = group?.questions ?? [];
  const total = questions.length;
  const answered = questions.filter((q) => (answers[q.tempId] ?? []).length > 0).length;
  return { answered, total, isComplete: total > 0 && answered === total };
}

export default function TestSectionNav({
  groups = [],
  activeIndex = 0,
  answers = {},
  accentColor,
  accentBg,
  onSelect,
}) {
  if (!groups.length) return null;

  return (
    <Box
      component="nav"
      aria-label="Chuyển section"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        mb: 2,
      }}
    >
      {groups.map((group, index) => {
        const isActive = index === activeIndex;
        const { isComplete } = getGroupProgress(group, answers);
        const label = String(index + 1);

        return (
          <Box
            key={group.groupId ?? `section_${index}`}
            component="button"
            type="button"
            onClick={() => onSelect(index)}
            aria-current={isActive ? 'true' : undefined}
            title={group.displayName ?? `Section ${index + 1}`}
            sx={{
              width: 56,
              height: 56,
              borderRadius: '14px',
              border: `2px solid ${isActive ? accentColor : TEST_DIVIDER}`,
              bgcolor: isActive ? accentBg : '#fff',
              color: isActive ? accentColor : TEST_MUTED,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.25,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'border-color 0.15s, background-color 0.15s, transform 0.1s',
              position: 'relative',
              '&:hover': {
                borderColor: accentColor,
                bgcolor: isActive ? accentBg : alpha(accentColor, 0.06),
              },
              '&:active': {
                transform: 'scale(0.97)',
              },
            }}
          >
            {isComplete ? (
              <CheckRoundedIcon sx={{ fontSize: 22, color: accentColor }} />
            ) : (
              <Typography sx={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>
                {label}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
