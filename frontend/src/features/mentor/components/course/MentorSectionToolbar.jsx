import { Box, Typography } from '@mui/material';
import { ContentStatusIcon } from './MentorChapterTabs';
import { MUTED } from './mentorCourseCreateStyles';

export function ContentStatusText({ hasContent }) {
  return (
    <Box
      component="span"
      sx={{ color: hasContent ? '#059669' : '#94A3B8', ml: 0.75 }}
    >
      · {hasContent ? 'Đã có nội dung' : 'Chưa có nội dung'}
    </Box>
  );
}

export default function MentorSectionToolbar({ hasContent = false, summary, actions = null, sx }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 0.5,
        px: 2,
        py: 1,
        borderBottom: '1px solid rgba(15,23,42,0.06)',
        bgcolor: '#fff',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 'auto', minWidth: 0 }}>
        <ContentStatusIcon hasContent={hasContent} size={15} />
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: MUTED, lineHeight: 1.4 }}>
          {summary}
          <ContentStatusText hasContent={hasContent} />
        </Typography>
      </Box>
      {actions}
    </Box>
  );
}
