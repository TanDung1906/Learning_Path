import { useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import { useNavigate } from 'react-router-dom';
import AppButton from '@/shared/ui/AppButton';
import EmptyState from '@/shared/ui/EmptyState';
import MentorCourseContentOutline from './MentorCourseContentOutline';
import MentorCardSectionTitle from './MentorCardSectionTitle';
import MentorChapterCardMenu from './MentorChapterCardMenu';
import MentorChapterQuizSetupDialog from './MentorChapterQuizSetupDialog';
import {
  CARD_SECTION_META_SX,
  CREATE_CARD_SX,
  DETAIL_SECTION_HEADER_SX,
  DETAIL_TOOLBAR_WRAP_SX,
  MUTED,
} from './mentorCourseCreateStyles';
import { countMaterialsInPath, getCoursePaths } from '../../utils/mentorCourseContentUtils';
import {
  QUIZ_SETUP_SCOPE_CHAPTER,
  QUIZ_SETUP_SCOPE_COURSE,
} from '@/features/mentor/utils/mentorChapterQuizConfigUtils';

export default function MentorCourseContentTab({ course }) {
  const navigate = useNavigate();
  const [quizDialog, setQuizDialog] = useState(null);

  const paths = getCoursePaths(course);
  const courseId = course.CourseId;
  const courseName = course.CourseName ?? '';

  const materialCount = paths.reduce((sum, path) => sum + countMaterialsInPath(path), 0);

  const handleCourseQuizSetup = useCallback(() => {
    setQuizDialog({ scope: QUIZ_SETUP_SCOPE_COURSE });
  }, []);

  const handleChapterQuizSetup = useCallback((path, pathIndex) => {
    setQuizDialog({
      scope: QUIZ_SETUP_SCOPE_CHAPTER,
      chapterId: path.pathId ?? path.PathId,
      chapterTitle: path.PathName ?? path.pathName ?? '',
      chapterIndex: pathIndex,
    });
  }, []);

  const handleCloseQuizDialog = useCallback(() => {
    setQuizDialog(null);
  }, []);

  return (
    <Box sx={CREATE_CARD_SX}>
      <Box sx={DETAIL_SECTION_HEADER_SX}>
        <MentorCardSectionTitle
          title="Nội dung khóa học"
          mb={0.35}
          action={(
            <AppButton
              variant="contained"
              onClick={() => navigate(`/mentor/courses/${courseId}/content/edit`)}
              sx={{
                height: 34,
                borderRadius: '999px',
                fontSize: 12,
                fontWeight: 600,
                px: 1.5,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
              }}
            >
              Xây nội dung
            </AppButton>
          )}
        />

        <Typography sx={CARD_SECTION_META_SX}>
          {paths.length} chương · {course.TotalLessons ?? 0} bài học ·{' '}
          {materialCount ?? 0} học liệu
        </Typography>
      </Box>

      {paths.length === 0 ? (
        <EmptyState
          embedded
          icon={AutoStoriesOutlinedIcon}
          title="Khóa học chưa có nội dung"
          description="Thêm chương, bài học và học liệu để hoàn thiện khóa học."
          actionLabel="Xây nội dung"
          onAction={() => navigate(`/mentor/courses/${courseId}/content/edit`)}
        />
      ) : (
        <>
          <Box sx={{ ...DETAIL_TOOLBAR_WRAP_SX, mb: 2 }}>
            <MentorChapterCardMenu
              variant="courseButton"
              onQuizSetup={handleCourseQuizSetup}
            />
            <Typography sx={{ fontSize: 12, color: MUTED, mt: 1.15, lineHeight: 1.55 }}>
              Random câu hỏi từ ngân hàng các chương để tạo bài kiểm tra tổng kết toàn khóa.
            </Typography>
          </Box>

          <MentorCourseContentOutline
            paths={paths}
            onChapterQuizSetup={handleChapterQuizSetup}
          />
        </>
      )}

      <MentorChapterQuizSetupDialog
        open={Boolean(quizDialog)}
        onClose={handleCloseQuizDialog}
        scope={quizDialog?.scope ?? QUIZ_SETUP_SCOPE_CHAPTER}
        courseId={courseId}
        courseTitle={courseName}
        chapterId={quizDialog?.chapterId}
        chapterTitle={quizDialog?.chapterTitle ?? ''}
        chapterIndex={quizDialog?.chapterIndex ?? 0}
        paths={paths}
      />
    </Box>
  );
}
