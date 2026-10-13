import { Box, InputBase, Typography } from '@mui/material';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import { ContentFieldLabel } from './MentorContentSectionHeading';
import { MUTED, TEXT } from './mentorCourseCreateStyles';
import { MATERIAL_TYPE_THEME, contentMultilineInputSx } from './mentorCourseContentStyles';
import MentorTestQuestionBankSelector from '@/features/mentor/components/questionBank/MentorTestQuestionBankSelector';
import MentorFinalTestConfigEditor from '@/features/mentor/components/questionBank/MentorFinalTestConfigEditor';
import {
  SCORING_MODE_AUTO,
  TEST_SOURCE_CHAPTER_QUIZ,
  TEST_SOURCE_COURSE_FINAL,
  calculateAutoQuestionScore,
  computeMaterialTestSummary,
  DEFAULT_TEST_TOTAL_SCORE,
  formatScoreValue,
  getFinalTestConfigTotal,
  getQuestionCount,
  inferTestSource,
} from '@/features/mentor/utils/mentorTestContentUtils';

const fieldLabelSx = { mb: 0.4 };

function SummaryPill({ children, color = MUTED, bgcolor = 'rgba(15,23,42,0.05)' }) {
  return (
    <Typography
      component="span"
      sx={{
        fontSize: 11,
        fontWeight: 600,
        color,
        px: 1,
        py: 0.35,
        borderRadius: '999px',
        bgcolor,
      }}
    >
      {children}
    </Typography>
  );
}
function TestSourceButton({ label, selected, disabled, accentColor, onSelect }) {
  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={onSelect}
      sx={{
        flex: 1,
        minHeight: 40,
        border: 'none',
        borderRadius: '10px',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 13,
        fontWeight: selected ? 700 : 600,
        fontFamily: 'inherit',
        color: selected ? accentColor : MUTED,
        bgcolor: selected ? `${accentColor}18` : 'transparent',
        transition: 'background-color 0.15s, color 0.15s',
        opacity: disabled ? 0.6 : 1,
        px: 1,
        '&:hover': disabled
          ? {}
          : {
              bgcolor: selected ? `${accentColor}22` : 'rgba(15,23,42,0.04)',
              color: selected ? accentColor : TEXT,
            },
      }}
    >
      {label}
    </Box>
  );
}

export default function MentorTestMaterialEditor({
  material,
  errors = {},
  onChange,
  disabled = false,
  courseId = null,
  chapterId = null,
}) {
  const theme = MATERIAL_TYPE_THEME.TEST;
  const accentColor = theme.color;
  const sections = material.Sections ?? [];
  const totalScore = DEFAULT_TEST_TOTAL_SCORE;
  const testSource = inferTestSource({ testSource: material.TestSource });
  const isChapterQuiz = testSource === TEST_SOURCE_CHAPTER_QUIZ;
  const isCourseFinal = testSource === TEST_SOURCE_COURSE_FINAL;
  const { sectionCount } = computeMaterialTestSummary(sections);
  const questionCount = isCourseFinal
    ? getFinalTestConfigTotal(material.FinalTestConfig ?? {})
    : getQuestionCount(sections);
  const perQuestionScore = calculateAutoQuestionScore(totalScore, questionCount);
  const hasBank = Boolean(material.QuestionBankId);

  const handleTestSourceChange = (nextSource) => {
    if (nextSource === TEST_SOURCE_COURSE_FINAL) {
      onChange(material.tempId, {
        TestSource: TEST_SOURCE_COURSE_FINAL,
        QuestionBankId: null,
        QuestionBankTitle: null,
        Sections: [],
        ScoringMode: SCORING_MODE_AUTO,
      });
      return;
    }
    onChange(material.tempId, {
      TestSource: TEST_SOURCE_CHAPTER_QUIZ,
    });
  };

  const handleBankChange = (patch) => {
    if (!patch) {
      onChange(material.tempId, {
        QuestionBankId: null,
        QuestionBankTitle: null,
        Sections: [],
      });
      return;
    }
    onChange(material.tempId, patch);
  };

  const handleFinalConfigChange = (nextConfig) => {
    onChange(material.tempId, {
      FinalTestConfig: nextConfig,
      Sections: [],
      QuestionBankId: null,
      QuestionBankTitle: null,
    });
  };

  const renderScoreSummary = () => {
    if (isCourseFinal) {
      if (questionCount <= 0) {
        return (
          <Typography sx={{ fontSize: 12, color: MUTED }}>
            Cấu hình số câu random từ bank các chương.
          </Typography>
        );
      }
      return (
        <SummaryPill>
          Random {questionCount} câu · mỗi câu {formatScoreValue(perQuestionScore)} điểm
        </SummaryPill>
      );
    }

    if (!hasBank || questionCount === 0) {
      return (
        <Typography sx={{ fontSize: 12, color: MUTED }}>
          Gắn bank chương để xem tổng số câu và điểm.
        </Typography>
      );
    }

    return (
      <SummaryPill>
        Tổng {questionCount} câu · mỗi câu {formatScoreValue(perQuestionScore)} điểm
      </SummaryPill>
    );
  };

  const showConfigPanel =
    courseId && (isCourseFinal || (isChapterQuiz && hasBank && questionCount > 0));

  return (
    <Box
      sx={{
        mt: 1.25,
        ml: { xs: 0, sm: 0.25 },
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: '16px',
        border: '1px solid rgba(15,23,42,0.08)',
        bgcolor: '#F8FAFC',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${accentColor}18`,
            color: accentColor,
            flexShrink: 0,
          }}
        >
          <QuizRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.3 }}>
            Cấu hình bài kiểm tra
          </Typography>
          <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>
            Quiz chương dùng bank chương · Cuối khóa random từ bank các chương.
          </Typography>
        </Box>
        {isChapterQuiz && hasBank && sectionCount > 0 ? (
          <SummaryPill>{sectionCount} bài · {questionCount} câu</SummaryPill>
        ) : null}
        {isCourseFinal && questionCount > 0 ? (
          <SummaryPill>{questionCount} câu random</SummaryPill>
        ) : null}
      </Box>

      {courseId && (
        <Box sx={{ mb: 1.5 }}>
          <ContentFieldLabel sx={fieldLabelSx}>Loại bài kiểm tra</ContentFieldLabel>
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              p: 0.5,
              borderRadius: '12px',
              bgcolor: '#fff',
              border: '1px solid rgba(15,23,42,0.08)',
            }}
          >
            <TestSourceButton
              label="Quiz chương"
              selected={isChapterQuiz}
              disabled={disabled}
              accentColor={accentColor}
              onSelect={() => handleTestSourceChange(TEST_SOURCE_CHAPTER_QUIZ)}
            />
            <TestSourceButton
              label="Kiểm tra cuối khóa"
              selected={isCourseFinal}
              disabled={disabled}
              accentColor={accentColor}
              onSelect={() => handleTestSourceChange(TEST_SOURCE_COURSE_FINAL)}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ mb: 1.5 }}>
        {isChapterQuiz ? (
          <MentorTestQuestionBankSelector
            courseId={courseId}
            chapterId={chapterId}
            value={material.QuestionBankId}
            onChange={handleBankChange}
            disabled={disabled}
            error={errors.QuestionBankId}
          />
        ) : (
          <MentorFinalTestConfigEditor
            courseId={courseId}
            config={material.FinalTestConfig ?? {}}
            errors={errors.FinalTestConfig ?? {}}
            disabled={disabled}
            onChange={handleFinalConfigChange}
          />
        )}
      </Box>

      {showConfigPanel && (
        <>
          <Box sx={{ mb: 1.5, p: 1, borderRadius: '12px', bgcolor: '#fff', border: '1px solid rgba(15,23,42,0.06)' }}>
            {renderScoreSummary()}
          </Box>

          <Box sx={{ mb: 0 }}>
            <ContentFieldLabel sx={fieldLabelSx}>Mô tả bài kiểm tra</ContentFieldLabel>
            <InputBase
              value={material.Description ?? ''}
              onChange={(event) => onChange(material.tempId, { Description: event.target.value })}
              disabled={disabled}
              placeholder="Mô tả ngắn cho bài kiểm tra (tuỳ chọn)"
              fullWidth
              multiline
              minRows={2}
              sx={contentMultilineInputSx(false, { color: accentColor })}
            />
          </Box>
        </>
      )}

      {errors._sections && (
        <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 1 }}>{errors._sections}</Typography>
      )}
    </Box>
  );
}
