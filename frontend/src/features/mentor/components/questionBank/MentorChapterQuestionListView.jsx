/**
 * =============================================================================
 * MentorChapterQuestionListView — Danh sách câu hỏi theo chương
 * =============================================================================
 *
 * MỤC ĐÍCH: Xem/sửa/xóa/bật public câu hỏi của một chương (view riêng).
 * LUỒNG: Lọc theo kỹ năng → thao tác từng câu hoặc hàng loạt.
 *
 * Quản lý câu hỏi theo chương — xem, sửa, xóa, public/private.
 */
import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HeadphonesRoundedIcon from '@mui/icons-material/HeadphonesRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import AppButton from '@/shared/ui/AppButton';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import EmptyState from '@/shared/ui/EmptyState';
import { formatChapterDisplayLabel } from '@/features/mentor/utils/mentorCourseUtils';
import {
  TEST_SKILL_CHIP_COLORS,
  TEST_SKILL_LABELS,
  TEST_SKILL_LISTENING,
  TEST_SKILL_READING,
  TEST_SKILL_VOCABULARY,
  isQuestionBankVocabularySkill,
  QUESTION_BANK_SKILLS,
} from '@/features/mentor/utils/mentorTestContentUtils';
import { MUTED, PRIMARY, TEXT } from '@/features/mentor/components/course/mentorCourseCreateStyles';
import { toast } from '@/shared/ui/Toast';

const SKILL_FILTER_ALL = 'ALL';

const SKILL_META = {
  [TEST_SKILL_LISTENING]: { icon: HeadphonesRoundedIcon, label: TEST_SKILL_LABELS[TEST_SKILL_LISTENING] },
  [TEST_SKILL_READING]: { icon: MenuBookRoundedIcon, label: TEST_SKILL_LABELS[TEST_SKILL_READING] },
  [TEST_SKILL_VOCABULARY]: { icon: EditNoteRoundedIcon, label: TEST_SKILL_LABELS[TEST_SKILL_VOCABULARY] },
};

function StatPill({ label, value, accent = PRIMARY }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: '14px',
        bgcolor: '#fff',
        border: `1px solid ${alpha('#0F172A', 0.07)}`,
        minWidth: 88,
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: MUTED, mb: 0.25 }}>{label}</Typography>
      <Typography sx={{ fontSize: 20, fontWeight: 800, color: accent, lineHeight: 1.1 }}>{value}</Typography>
    </Box>
  );
}

function SkillChip({ skillType }) {
  const theme = TEST_SKILL_CHIP_COLORS[skillType] ?? { color: MUTED, bg: 'rgba(100,116,139,0.12)' };
  return (
    <Chip
      size="small"
      label={TEST_SKILL_LABELS[skillType] ?? skillType}
      sx={{
        height: 24,
        fontSize: 11,
        fontWeight: 700,
        bgcolor: theme.bg,
        color: theme.color,
        border: `1px solid ${alpha(theme.color, 0.2)}`,
      }}
    />
  );
}

function QuestionDetailDialog({ open, question, onClose }) {
  if (!question) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '20px' } },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Chi tiết câu hỏi #{question.QuestionId}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
          <SkillChip skillType={question.SkillType} />
          <Chip size="small" label={`Thứ tự ${question.Order}`} sx={{ height: 24, fontSize: 11, fontWeight: 600 }} />
        </Box>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: TEXT, mb: 2, lineHeight: 1.55 }}>
          {question.Title}
        </Typography>
        {question.URL ? (
          <Typography sx={{ fontSize: 13, color: MUTED, mb: 2, wordBreak: 'break-all' }}>
            Audio/URL: {question.URL}
          </Typography>
        ) : null}
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: TEXT, mb: 1 }}>Đáp án</Typography>
        {(question.Choices ?? []).map((choice) => (
          <Box
            key={choice.ChoiceId ?? choice.Order}
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              py: 0.55,
              fontSize: 14,
              color: choice.IsTrue ? '#047857' : TEXT,
              fontWeight: choice.IsTrue ? 700 : 400,
            }}
          >
            <span>{choice.IsTrue ? '✓' : '○'}</span>
            <span>{choice.Title}</span>
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <AppButton variant="outlined" onClick={onClose} sx={{ borderRadius: '999px' }}>
          Đóng
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}

function QuestionCard({
  question,
  busy,
  toggling,
  onDetail,
  onEdit,
  onDelete,
  onTogglePublic,
}) {
  const theme = useTheme();
  const skillTheme = TEST_SKILL_CHIP_COLORS[question.SkillType] ?? { color: PRIMARY, bg: alpha(PRIMARY, 0.1) };
  const choiceCount = (question.Choices ?? []).filter((c) => String(c.Title ?? '').trim()).length;

  return (
    <Box
      sx={{
        position: 'relative',
        pl: 2,
        pr: 1.75,
        py: 1.5,
        borderRadius: '18px',
        bgcolor: '#fff',
        border: `1px solid ${alpha('#0F172A', 0.08)}`,
        boxShadow: theme.ios18?.shadow?.sm ?? 'none',
        overflow: 'hidden',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:hover': {
          borderColor: alpha(skillTheme.color, 0.28),
          boxShadow: theme.ios18?.shadow?.md ?? `0 4px 20px ${alpha('#0F172A', 0.06)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 12,
          bottom: 12,
          width: 3,
          borderRadius: '999px',
          bgcolor: skillTheme.color,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 1.25, md: 1.5 },
          alignItems: { md: 'center' },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center', mb: 0.75 }}>
            <SkillChip skillType={question.SkillType} />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: MUTED }}>
              #{question.QuestionId} · Câu {question.Order}
            </Typography>
            {choiceCount > 0 ? (
              <Typography sx={{ fontSize: 11, color: MUTED }}>{choiceCount} đáp án</Typography>
            ) : null}
          </Box>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: TEXT,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {question.Title}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, md: 1 },
            flexShrink: 0,
            alignSelf: { xs: 'stretch', md: 'center' },
            justifyContent: { xs: 'space-between', md: 'flex-end' },
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.25,
              py: 0.5,
              borderRadius: '999px',
              bgcolor: question.isActive ? 'rgba(4,120,87,0.08)' : 'rgba(100,116,139,0.08)',
              border: `1px solid ${question.isActive ? 'rgba(4,120,87,0.2)' : alpha('#0F172A', 0.08)}`,
            }}
          >
            {question.isActive ? (
              <PublicOutlinedIcon sx={{ fontSize: 16, color: '#047857' }} />
            ) : (
              <LockOutlinedIcon sx={{ fontSize: 16, color: MUTED }} />
            )}
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: question.isActive ? '#047857' : MUTED }}>
              {question.isActive ? 'Public' : 'Private'}
            </Typography>
            <Switch
              size="small"
              checked={question.isActive}
              disabled={busy || toggling}
              onChange={() => onTogglePublic(question, !question.isActive)}
              sx={{
                ml: -0.25,
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#047857' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#047857' },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <Tooltip title="Xem chi tiết">
              <span>
                <IconButton size="small" disabled={busy} onClick={() => onDetail(question)}>
                  <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <span>
                <IconButton size="small" disabled={busy} onClick={() => onEdit(question)}>
                  <EditOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Xóa">
              <span>
                <IconButton
                  size="small"
                  disabled={busy}
                  onClick={() => onDelete(question)}
                  sx={{ color: '#DC2626' }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function MentorChapterQuestionListView({
  bankId,
  courseId,
  chapterId,
  chapterTitle,
  chapterDisplayLabel = '',
  courseName,
  courseCategory = '',
  questions = [],
  onBack,
  onReload,
  onEditQuestion,
  onAddQuestion,
}) {
  const theme = useTheme();
  // busyId: QuestionId đang xử lý (toggle/delete)
  const [busyId, setBusyId] = useState(null);
  // bulkBusy: đang thực hiện thao tác hàng loạt
  const [bulkBusy, setBulkBusy] = useState(false);
  // detailQuestion: câu hỏi đang xem chi tiết trong dialog
  const [detailQuestion, setDetailQuestion] = useState(null);
  // deleteTarget: câu hỏi chờ xác nhận xóa
  const [deleteTarget, setDeleteTarget] = useState(null);
  // skillFilter: bộ lọc kỹ năng (ALL | LISTENING | READING | VOCABULARY)
  const [skillFilter, setSkillFilter] = useState(SKILL_FILTER_ALL);
  const [bulkAnchor, setBulkAnchor] = useState(null);

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.TypeId - b.TypeId || a.Order - b.Order),
    [questions],
  );

  const stats = useMemo(() => {
    const bySkill = {
      [TEST_SKILL_LISTENING]: 0,
      [TEST_SKILL_READING]: 0,
      [TEST_SKILL_VOCABULARY]: 0,
    };
    let publicCount = 0;
    sortedQuestions.forEach((q) => {
      if (q.SkillType) bySkill[q.SkillType] = (bySkill[q.SkillType] ?? 0) + 1;
      if (q.isActive !== false) publicCount += 1;
    });
    return {
      total: sortedQuestions.length,
      publicCount,
      privateCount: sortedQuestions.length - publicCount,
      bySkill,
    };
  }, [sortedQuestions]);

  const filteredQuestions = useMemo(() => {
    if (skillFilter === SKILL_FILTER_ALL) return sortedQuestions;
    return sortedQuestions.filter((q) => q.SkillType === skillFilter);
  }, [skillFilter, sortedQuestions]);

  const heading =
    chapterDisplayLabel ||
    formatChapterDisplayLabel({ title: chapterTitle, pathId: chapterId });

  const runToggle = async (question, isPublic) => {
    setBusyId(question.QuestionId);
    try {
      toast.info('Logic public/private câu hỏi sẽ được implement lại.');
      void isPublic;
      onReload?.();
    } finally {
      setBusyId(null);
    }
  };

  const runBulk = async (isPublic) => {
    setBulkAnchor(null);
    setBulkBusy(true);
    try {
      toast.info('Logic public/private hàng loạt sẽ được implement lại.');
      void isPublic;
      onReload?.();
    } finally {
      setBulkBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.QuestionId);
    try {
      toast.info('Logic xóa câu hỏi sẽ được implement lại.');
      setDeleteTarget(null);
      onReload?.();
    } finally {
      setBusyId(null);
    }
  };

  const busy = bulkBusy || busyId != null;

  const filterOptions = [
    { value: SKILL_FILTER_ALL, label: 'Tất cả', count: stats.total },
    ...Object.entries(SKILL_META).map(([skill, meta]) => ({
      value: skill,
      label: meta.label,
      count: stats.bySkill[skill] ?? 0,
    })),
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 1280, mx: 'auto' }}>
      <Box sx={{ mb: 2 }}>
        <AppButton
          variant="text"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={onBack}
          sx={{
            height: 36,
            px: 0.5,
            color: MUTED,
            fontWeight: 600,
            fontSize: 13,
            '&:hover': { bgcolor: 'transparent', color: PRIMARY },
          }}
        >
          Quay lại
        </AppButton>
      </Box>

      <Box
        sx={{
          mb: 2.5,
          p: { xs: 2, sm: 2.5 },
          borderRadius: '22px',
          background: `linear-gradient(135deg, ${alpha(PRIMARY, 0.09)} 0%, ${alpha('#7C3AED', 0.05)} 55%, #fff 100%)`,
          border: `1px solid ${alpha(PRIMARY, 0.14)}`,
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: PRIMARY, mb: 0.75, letterSpacing: '0.02em' }}>
          QUẢN LÝ CÂU HỎI
        </Typography>
        <Typography sx={{ fontSize: { xs: 22, sm: 26 }, fontWeight: 800, color: TEXT, lineHeight: 1.3, mb: 0.5 }}>
          {heading}
        </Typography>
        <Typography sx={{ fontSize: 14, color: MUTED, mb: 2 }}>
          {courseName}
          {courseCategory ? ` · ${courseCategory}` : ''}
          {bankId ? ` · Bank #${bankId}` : ''}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <StatPill label="Tổng câu" value={stats.total} />
          <StatPill label="Public" value={stats.publicCount} accent="#047857" />
          <StatPill label="Private" value={stats.privateCount} accent={MUTED} />
          {Object.entries(SKILL_META).map(([skill, meta]) => (
            <StatPill
              key={skill}
              label={meta.label}
              value={stats.bySkill[skill] ?? 0}
              accent={TEST_SKILL_CHIP_COLORS[skill]?.color ?? PRIMARY}
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          position: 'sticky',
          top: 72,
          zIndex: 3,
          mb: 2,
          py: 1.25,
          px: { xs: 0, sm: 0.5 },
          bgcolor: alpha('#F8FAFC', 0.92),
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: `1px solid ${alpha('#0F172A', 0.06)}`,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
          gap: 1.25,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, px: { xs: 1, sm: 1.25 } }}>
          {filterOptions.map((opt) => {
            const selected = skillFilter === opt.value;
            return (
              <Box
                key={opt.value}
                component="button"
                type="button"
                onClick={() => setSkillFilter(opt.value)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  height: 34,
                  px: 1.25,
                  borderRadius: '999px',
                  border: `1px solid ${selected ? alpha(PRIMARY, 0.35) : alpha('#0F172A', 0.08)}`,
                  bgcolor: selected ? alpha(PRIMARY, 0.1) : '#fff',
                  color: selected ? PRIMARY : TEXT,
                  fontSize: 13,
                  fontWeight: selected ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: alpha(PRIMARY, 0.3) },
                }}
              >
                {opt.label}
                <Box
                  component="span"
                  sx={{
                    minWidth: 20,
                    height: 20,
                    px: 0.5,
                    borderRadius: '999px',
                    bgcolor: selected ? alpha(PRIMARY, 0.15) : alpha('#0F172A', 0.06),
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {opt.count}
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, px: { xs: 1, sm: 1.25 }, justifyContent: 'flex-end' }}>
          <AppButton
            variant="outlined"
            disabled={busy || sortedQuestions.length === 0}
            endIcon={<MoreHorizRoundedIcon />}
            onClick={(e) => setBulkAnchor(e.currentTarget)}
            sx={{ height: 38, borderRadius: '999px', fontSize: 13 }}
          >
            Thao tác hàng loạt
          </AppButton>
          {onAddQuestion ? (
            <AppButton
              startIcon={<AddRoundedIcon />}
              onClick={onAddQuestion}
              sx={{
                height: 38,
                borderRadius: '999px',
                bgcolor: PRIMARY,
                color: '#fff',
                fontWeight: 700,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#0E7490', boxShadow: 'none' },
              }}
            >
              Thêm câu hỏi
            </AppButton>
          ) : null}
        </Box>
      </Box>

      <Menu
        anchorEl={bulkAnchor}
        open={Boolean(bulkAnchor)}
        onClose={() => setBulkAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              borderRadius: '14px',
              minWidth: 200,
              boxShadow: theme.ios18?.shadow?.md,
            },
          },
        }}
      >
        <MenuItem disabled={busy} onClick={() => runBulk(true)}>
          <PublicOutlinedIcon sx={{ fontSize: 18, mr: 1, color: '#047857' }} />
          Bật public toàn bộ
        </MenuItem>
        <MenuItem disabled={busy} onClick={() => runBulk(false)}>
          <LockOutlinedIcon sx={{ fontSize: 18, mr: 1, color: MUTED }} />
          Chuyển toàn bộ sang private
        </MenuItem>
      </Menu>

      {filteredQuestions.length === 0 ? (
        <EmptyState
          icon={QuizOutlinedIcon}
          title={sortedQuestions.length === 0 ? 'Chưa có câu hỏi' : 'Không có câu hỏi trong bộ lọc này'}
          description={
            sortedQuestions.length === 0
              ? 'Thêm câu hỏi đầu tiên cho chương này.'
              : 'Thử chọn kỹ năng khác hoặc xem tất cả câu hỏi.'
          }
          actionLabel={sortedQuestions.length === 0 && onAddQuestion ? 'Thêm câu hỏi' : undefined}
          onAction={sortedQuestions.length === 0 ? onAddQuestion : undefined}
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.QuestionId}
              question={question}
              busy={busy}
              toggling={busyId === question.QuestionId}
              onDetail={setDetailQuestion}
              onEdit={onEditQuestion}
              onDelete={setDeleteTarget}
              onTogglePublic={runToggle}
            />
          ))}
        </Box>
      )}

      <QuestionDetailDialog
        open={Boolean(detailQuestion)}
        question={detailQuestion}
        onClose={() => setDetailQuestion(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Xóa câu hỏi"
        message={`Xóa câu hỏi "${deleteTarget?.Title ?? ''}"? Hành động không thể hoàn tác.`}
        confirmLabel="Xóa"
        destructive
        loading={busyId === deleteTarget?.QuestionId}
      />
    </Box>
  );
}
