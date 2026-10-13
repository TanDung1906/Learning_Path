/**
 * =============================================================================
 * MentorQuestionBankBuilderPanel — Editor câu hỏi (cột giữa workspace)
 * =============================================================================
 *
 * MỤC ĐÍCH: Tab bài/section, filter useForTest, nút Lưu, MentorTestSectionCard.
 * LUỒNG: Chọn section → sửa trong TestSectionCard → onSectionChange → parent state.
 *
 * Editor câu hỏi — cột giữa workspace question bank.
 */
import { useEffect, useState } from 'react';
import { Box, Typography, alpha } from '@mui/material'; import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AppButton from '@/shared/ui/AppButton';
import MentorTestSectionCard from '@/features/mentor/components/course/MentorTestSectionCard';
import MentorQuestionBankDeletedQuestionsDialog from '@/features/mentor/components/questionBank/MentorQuestionBankDeletedQuestionsDialog';
import { CREATE_CARD_SX, MUTED, PRIMARY, TEXT } from '@/features/mentor/components/course/mentorCourseCreateStyles';
import {
  SCORING_MODE_AUTO,
  TEST_SKILL_CHIP_COLORS,
  getFilledTestQuestions,
  getQuestionBankSectionTabLabel,
  getSectionDeletedQuestions,
  isQuestionBankVocabularySkill,
  restoreDeletedQuestionToSection,
  SECTION_USE_FOR_TEST_FILTER,
} from '@/features/mentor/utils/mentorTestContentUtils'; import {
  getSectionDisplayQuestionCount,
  hasSectionUnsavedChanges,
} from '@/features/mentor/utils/questionBankApiMappers';
import {
  getListeningReadingTestSectionCountLabel,
  getVocabularySectionTestUsage,
} from '@/features/mentor/utils/mentorChapterQuizConfigUtils';

function BaiTab({
  label,
  selected,
  disabled,
  accentColor,
  hasContent = false,
  isDirty = false,
  testUsageLabel = null,
  inTest = false,
  onClick,
}) {
  const StatusIcon = hasContent ? CheckCircleOutlineRoundedIcon : RadioButtonUncheckedRoundedIcon;
  const statusColor = hasContent ? '#047857' : alpha(MUTED, 0.85);

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={
        isDirty
          ? 'Có thay đổi chưa cập nhật'
          : hasContent
            ? 'Đã có câu hỏi'
            : 'Chưa có câu hỏi'
      }
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.25,
        py: 0.55,
        borderRadius: '999px',
        border: selected
          ? `1px solid ${alpha(accentColor, 0.4)}`
          : isDirty
            ? '1px solid rgba(245,158,11,0.45)'
            : '1px solid rgba(15,23,42,0.1)',
        bgcolor: selected ? alpha(accentColor, 0.1) : isDirty ? 'rgba(245,158,11,0.08)' : '#fff',
        color: selected ? accentColor : isDirty ? '#B45309' : TEXT,
        fontSize: 12,
        fontWeight: selected ? 700 : 600,
        fontFamily: 'inherit',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        maxWidth: { xs: '100%', sm: 220 },
        overflow: 'hidden',
        transition: 'background-color 0.15s, border-color 0.15s',
        '&:hover': disabled ? undefined : { bgcolor: selected ? alpha(accentColor, 0.14) : 'rgba(15,23,42,0.04)' },
      }}
    >
      <StatusIcon sx={{ fontSize: 15, color: statusColor, flexShrink: 0 }} />
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
        {label}
      </Box>
      {inTest && testUsageLabel ? (
        <Box
          component="span"
          sx={{
            flexShrink: 0,
            px: 0.65,
            py: 0.1,
            borderRadius: '999px',
            bgcolor: 'rgba(5,150,105,0.12)',
            color: '#047857',
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
          }}
        >
          {testUsageLabel}
        </Box>
      ) : null}
      {isDirty ? (
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: '#F59E0B',
            flexShrink: 0,
          }}
        />
      ) : null}
    </Box>
  );
}

const SECTION_USE_FOR_TEST_FILTER_OPTIONS = [
  { value: SECTION_USE_FOR_TEST_FILTER.ALL, label: 'Tất cả', countKey: 'all' },
  { value: SECTION_USE_FOR_TEST_FILTER.IN_TEST, label: 'Dùng trong test', countKey: 'inTest' },
  { value: SECTION_USE_FOR_TEST_FILTER.NOT_IN_TEST, label: 'Không dùng trong test', countKey: 'notInTest' },
];

function SectionUseForTestFilterRow({ value, counts, onChange, disabled = false }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5, opacity: disabled ? 0.55 : 1 }}>
      {SECTION_USE_FOR_TEST_FILTER_OPTIONS.map((option) => {
        const selected = value === option.value;
        const count = counts?.[option.countKey] ?? 0;

        return (
          <Box
            key={option.value}
            component="button"
            type="button"
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              onChange?.(option.value);
            }}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              height: 32,
              px: 1.1,
              borderRadius: '999px',
              border: `1px solid ${selected ? alpha(PRIMARY, 0.35) : alpha('#0F172A', 0.08)}`,
              bgcolor: selected ? alpha(PRIMARY, 0.1) : '#fff',
              color: selected ? PRIMARY : TEXT,
              fontSize: 12,
              fontWeight: selected ? 700 : 500,
              fontFamily: 'inherit',
              cursor: disabled ? 'default' : 'pointer',
              transition: 'all 0.15s',
              '&:hover': disabled ? undefined : { borderColor: alpha(PRIMARY, 0.3) },
            }}
          >
            <Box component="span">{option.label}</Box>
            <Box
              component="span"
              sx={{
                minWidth: 18,
                height: 18,
                px: 0.5,
                borderRadius: '999px',
                bgcolor: selected ? alpha(PRIMARY, 0.16) : alpha('#0F172A', 0.06),
                color: selected ? PRIMARY : MUTED,
                fontSize: 11,
                fontWeight: 700,
                lineHeight: '18px',
                textAlign: 'center',
              }}
            >
              {count}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default function MentorQuestionBankBuilderPanel({
  sections = [],
  activeSkill,
  activeSection,
  activeSectionIndex = 0,
  activeSectionId = '',
  skillSections = [],
  skillSectionsAllCount = 0,
  sectionUseForTestFilter = SECTION_USE_FOR_TEST_FILTER.ALL,
  sectionUseForTestCounts = { all: 0, inTest: 0, notInTest: 0 },
  onSectionUseForTestFilterChange,
  sectionUseForTestFilterDisabled = false,
  sectionErrors = {},
  sectionBaselines = {},
  sectionSourceBaselines = {},
  activeSectionDirty = false,
  updatingSection = false,
  questionCount = 0,
  disabled = false,
  emptyHint = null,
  publishedHint = null,
  coursePublished = false,
  chapterQuizConfig = null,
  persistedQuestionIds = null,
  onSectionSelect,
  onAddBai,
  onSectionChange,
  onQuestionsFullyRestored,
  onUpdateSection,
  onRegisterSectionControls,
}) {
  // deletedDialogOpen: mở dialog danh sách câu hỏi đã xóa tạm
  const [deletedDialogOpen, setDeletedDialogOpen] = useState(false);
  const accentColor = TEST_SKILL_CHIP_COLORS[activeSkill]?.color ?? PRIMARY;
  const isVocabularySkill = isQuestionBankVocabularySkill(activeSkill);
  const addLabel = isVocabularySkill ? 'Thêm nhóm câu hỏi' : 'Thêm bài';
  const countLabel = isVocabularySkill ? 'nhóm' : 'bài';
  const listeningReadingTestLabel = getListeningReadingTestSectionCountLabel(activeSkill, chapterQuizConfig);
  const deletedQuestions = getSectionDeletedQuestions(activeSection);
  const deletedSectionLabel = activeSection
    ? getQuestionBankSectionTabLabel(activeSection, sections)
    : '';

  // Handler: khôi phục câu hỏi đã xóa tạm trong section
  const handleRestoreDeletedQuestion = (question) => {
    if (!activeSection || !question) return;
    const prevDeletedCount = deletedQuestions.length;
    const nextSection = restoreDeletedQuestionToSection(activeSection, question);
    const nextDeletedCount = getSectionDeletedQuestions(nextSection).length;

    if (prevDeletedCount > 0 && nextDeletedCount === 0) {
      onQuestionsFullyRestored?.(activeSection.tempId, nextSection);
      return;
    }

    onSectionChange?.(activeSection.tempId, nextSection);
  };

  useEffect(() => {
    if (deletedDialogOpen && deletedQuestions.length === 0) {
      setDeletedDialogOpen(false);
    }
  }, [deletedDialogOpen, deletedQuestions.length]);

  return (
    <Box id="question-bank-builder-root" sx={{ minWidth: 0, width: '100%' }}>
      <Box sx={{ ...CREATE_CARD_SX, mb: { xs: 2, lg: 0 } }}>
        {/* Cảnh báo khi khóa học đã xuất bản */}
        {publishedHint ? (
          <Typography
            sx={{
              fontSize: 13,
              color: '#92400E',
              mb: 2,
              p: 1.25,
              borderRadius: '10px',
              bgcolor: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.18)',
              lineHeight: 1.55,
            }}
          >
            {publishedHint}
          </Typography>
        ) : null}

        {emptyHint ? (
          <Typography
            sx={{
              fontSize: 13,
              color: MUTED,
              mb: 2,
              p: 1.25,
              borderRadius: '10px',
              bgcolor: 'rgba(15,23,42,0.04)',
              lineHeight: 1.5,
            }}
          >
            {emptyHint}
          </Typography>
        ) : null}

        <Box id="qb-questions" sx={{ opacity: disabled ? 0.6 : 1, scrollMarginTop: 24 }}>
          <Box sx={{ pointerEvents: disabled ? 'none' : 'auto' }}>
            {/* Bộ lọc section theo "dùng trong test" */}
            {skillSectionsAllCount > 0 ? (
              <SectionUseForTestFilterRow
                value={sectionUseForTestFilter}
                counts={sectionUseForTestCounts}
                onChange={onSectionUseForTestFilterChange}
                disabled={sectionUseForTestFilterDisabled}
              />
            ) : null}

            {skillSections.length === 0 && skillSectionsAllCount > 0 ? (
              <Box
                sx={{
                  py: 3,
                  px: 2,
                  mb: 2,
                  textAlign: 'center',
                  borderRadius: '12px',
                  bgcolor: 'rgba(15,23,42,0.03)',
                  border: '1px dashed rgba(15,23,42,0.12)',
                }}
              >
                <Typography sx={{ fontSize: 13, color: MUTED, lineHeight: 1.55 }}>
                  Không có section nào khớp bộ lọc hiện tại.
                </Typography>
              </Box>
            ) : null}

            {listeningReadingTestLabel ? (
              <Box
                sx={{
                  mb: 1.5,
                  px: 1.25,
                  py: 0.85,
                  borderRadius: '10px',
                  bgcolor: 'rgba(5,150,105,0.08)',
                  border: '1px solid rgba(5,150,105,0.16)',
                }}
              >
                <Typography sx={{ fontSize: 12, color: '#047857', fontWeight: 600, lineHeight: 1.45 }}>
                  {listeningReadingTestLabel}
                </Typography>
              </Box>
            ) : null}

            {activeSection ? (
              <>
                {/* Tab chọn bài/section trong kỹ năng hiện tại */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75, mb: 2 }}>
                  {skillSections.map((section) => {
                    const sectionTestUsage = isVocabularySkill
                      ? getVocabularySectionTestUsage(section.tempId, chapterQuizConfig)
                      : { inTest: false, label: null };

                    return (
                      <BaiTab
                        key={section.tempId}
                        label={getQuestionBankSectionTabLabel(section, sections)}
                        hasContent={
                          getSectionDisplayQuestionCount(section) > 0
                          || getFilledTestQuestions(section?.Questions).length > 0
                        }
                        isDirty={hasSectionUnsavedChanges(section, sectionBaselines, sectionSourceBaselines)}
                        selected={section.tempId === activeSectionId}
                        disabled={disabled}
                        accentColor={accentColor}
                        inTest={sectionTestUsage.inTest}
                        testUsageLabel={sectionTestUsage.label}
                        onClick={() => onSectionSelect?.(section.tempId)}
                      />
                    );
                  })}
                  <Box
                    component="button"
                    type="button"
                    onClick={onAddBai}
                    disabled={disabled}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.35,
                      px: 1,
                      py: 0.55,
                      borderRadius: '999px',
                      border: '1px dashed rgba(15,23,42,0.18)',
                      bgcolor: 'transparent',
                      color: MUTED,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      cursor: disabled ? 'default' : 'pointer',
                      opacity: disabled ? 0.55 : 1,
                      '&:hover': disabled ? undefined : { bgcolor: 'rgba(15,23,42,0.04)', color: TEXT },
                    }}
                  >
                    <AddRoundedIcon sx={{ fontSize: 15 }} />
                    {addLabel}
                  </Box>
                  {skillSections.length > 0 && (
                    <Typography sx={{ fontSize: 11, color: MUTED, ml: { xs: 0, sm: 0.25 } }}>
                      {skillSections.length} {countLabel}
                    </Typography>
                  )}
                </Box>

                {/* Thanh trạng thái dirty + nút Lưu / Xem câu đã xóa */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    mb: 1.5,
                    p: 1.25,
                    borderRadius: '12px',
                    bgcolor: activeSectionDirty ? 'rgba(245,158,11,0.08)' : 'rgba(15,23,42,0.03)',
                    border: `1px solid ${activeSectionDirty ? 'rgba(245,158,11,0.22)' : 'rgba(15,23,42,0.06)'}`,
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: activeSectionDirty ? '#92400E' : MUTED, lineHeight: 1.5 }}>
                    {activeSectionDirty
                      ? 'Section này có thay đổi chưa lưu. Cập nhật trước khi chuyển sang bài/kỹ năng khác.'
                      : 'Section đã đồng bộ. Bạn có thể chuyển sang phần khác.'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flexShrink: 0 }}>
                    {deletedQuestions.length > 0 ? (
                      <AppButton
                        onClick={() => setDeletedDialogOpen(true)}
                        sx={{
                          height: 36,
                          px: 2,
                          fontSize: 13,
                          fontWeight: 700,
                          borderRadius: '999px',
                          bgcolor: '#F59E0B',
                          color: '#fff',
                          boxShadow: 'none',
                          '&:hover': { bgcolor: '#D97706', boxShadow: 'none' },
                        }}
                      >
                        Những câu hỏi đã xóa
                      </AppButton>
                    ) : null}
                    <AppButton
                      startIcon={<SaveOutlinedIcon />}
                      onClick={onUpdateSection}
                      disabled={disabled || updatingSection || !activeSectionDirty}
                      sx={{
                        height: 36,
                        px: 2,
                        fontSize: 13,
                        fontWeight: 700,
                        borderRadius: '999px',
                        bgcolor: PRIMARY,
                        color: '#fff',
                        boxShadow: 'none',
                        flexShrink: 0,
                        '&:hover': { bgcolor: '#0E7490', boxShadow: 'none' },
                        '&.Mui-disabled': { bgcolor: 'rgba(15,23,42,0.12)', color: MUTED },
                      }}
                    >
                      {updatingSection ? 'Đang cập nhật...' : 'Cập nhật section'}
                    </AppButton>
                  </Box>
                </Box>

                <MentorQuestionBankDeletedQuestionsDialog
                  open={deletedDialogOpen}
                  onClose={() => setDeletedDialogOpen(false)}
                  deletedQuestions={deletedQuestions}
                  sectionLabel={deletedSectionLabel}
                  onRestoreQuestion={handleRestoreDeletedQuestion}
                />

                <Box id={`qb-section-${activeSection.tempId}`} sx={{ scrollMarginTop: 24, minWidth: 0 }}>
                  {isVocabularySkill ? (() => {
                    const activeSectionTestUsage = getVocabularySectionTestUsage(
                      activeSection.tempId,
                      chapterQuizConfig,
                    );
                    if (!activeSectionTestUsage.inTest) return null;
                    return (
                      <Box
                        sx={{
                          mb: 1.25,
                          px: 1.25,
                          py: 0.85,
                          borderRadius: '10px',
                          bgcolor: 'rgba(5,150,105,0.08)',
                          border: '1px solid rgba(5,150,105,0.16)',
                        }}
                      >
                        <Typography sx={{ fontSize: 12, color: '#047857', fontWeight: 600, lineHeight: 1.45 }}>
                          Section này dùng trong bài kiểm tra · {activeSectionTestUsage.label}
                        </Typography>
                      </Box>
                    );
                  })() : null}
                  {/*____Card thêm đề bài + câu hỏi */}
                  <MentorTestSectionCard
                    section={activeSection}
                    index={activeSectionIndex}
                    errors={sectionErrors[activeSection.tempId] ?? {}}
                    accentColor={accentColor}
                    disabled={disabled}
                    scoringMode={SCORING_MODE_AUTO}
                    totalScore={100}
                    questionCountAll={questionCount}
                    lockSkillType
                    questionBankMode
                    allSections={sections}
                    coursePublished={coursePublished}
                    chapterQuizConfig={chapterQuizConfig}
                    persistedQuestionIds={persistedQuestionIds}
                    defaultExpanded
                    onChange={(nextSection) => onSectionChange(activeSection.tempId, nextSection)}
                    onRegisterSectionControls={onRegisterSectionControls}
                  />
                </Box>
              </>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
