/**
 * =============================================================================
 * MentorFinalTestConfigEditor — Cấu hình bài kiểm tra cuối khóa
 * =============================================================================
 *
 * MỤC ĐÍCH: Nhập số câu hỏi random theo kỹ năng cho bài test cuối khóa.
 * LUỒNG: User nhập số → onChange(config) → parent lưu cấu hình.
 *
 * Cấu hình bài kiểm tra cuối khóa — UI only, stats = 0.
 */
import { Box, InputBase, Typography, alpha } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import {
  TEST_SKILL_QB_LABELS,
  TEST_SKILL_LISTENING,
  TEST_SKILL_READING,
  TEST_SKILL_VOCABULARY,
  getFinalTestConfigTotal,
} from '@/features/mentor/utils/mentorTestContentUtils';
import { MUTED, PRIMARY, TEXT } from '@/features/mentor/components/course/mentorCourseCreateStyles';

const SKILL_FIELDS = [
  { key: 'listeningCount', skill: TEST_SKILL_LISTENING, color: '#7C3AED' },
  { key: 'readingCount', skill: TEST_SKILL_READING, color: '#0891B2' },
  { key: 'vocabularyCount', skill: TEST_SKILL_VOCABULARY, color: '#EA580C' },
];

const inputSx = (hasError) => ({
  fontSize: 13,
  color: TEXT,
  px: 1,
  py: 0.65,
  borderRadius: '10px',
  border: `1px solid ${hasError ? '#DC2626' : 'rgba(15,23,42,0.12)'}`,
  bgcolor: '#fff',
  width: '100%',
  maxWidth: 88,
  '&:focus-within': { borderColor: hasError ? '#DC2626' : PRIMARY },
});

export default function MentorFinalTestConfigEditor({
  config = {},
  errors = {},
  disabled = false,
  onChange,
}) {
  const stats = {
    ok: true,
    chaptersWithQuestions: 0,
    questionCountBySkill: {
      [TEST_SKILL_LISTENING]: 0,
      [TEST_SKILL_READING]: 0,
      [TEST_SKILL_VOCABULARY]: 0,
    },
  };
  const loading = false;

  const total = getFinalTestConfigTotal(config);

  // Handler: cập nhật số câu theo kỹ năng (đảm bảo >= 0)
  const handleFieldChange = (key, rawValue) => {
    const value = Math.max(0, Number.parseInt(String(rawValue), 10) || 0);
    onChange?.({ ...config, [key]: value });
  };

  return (
    <Box>
      <Box
        sx={{
          p: 1.5,
          mb: 1.5,
          borderRadius: '14px',
          bgcolor: alpha('#7C3AED', 0.05),
          border: `1px solid ${alpha('#7C3AED', 0.12)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
          <AutoAwesomeRoundedIcon sx={{ fontSize: 20, color: '#7C3AED' }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEXT }}>
            Bài kiểm tra cuối khóa
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: 1.55 }}>
          Hệ thống random câu hỏi từ ngân hàng của từng chương theo cấu hình bên dưới.
        </Typography>
      </Box>

      {loading ? (
        <Typography sx={{ fontSize: 13, color: MUTED, mb: 1.5 }}>Đang tải thống kê bank chương...</Typography>
      ) : stats ? (
        <Typography sx={{ fontSize: 12, color: MUTED, mb: 1.5, lineHeight: 1.5 }}>
          {stats.chapterBankCount} bank chương · {stats.totalQuestions} câu có sẵn
        </Typography>
      ) : null}

      {errors._banks && (
        <Typography sx={{ fontSize: 12, color: '#DC2626', mb: 1 }}>{errors._banks}</Typography>
      )}
      {errors._total && (
        <Typography sx={{ fontSize: 12, color: '#DC2626', mb: 1 }}>{errors._total}</Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.1 }}>
        {SKILL_FIELDS.map(({ key, skill, color }) => {
          const available = stats?.questionCountBySkill?.[skill] ?? 0;
          const fieldError = errors[key];
          return (
            <Box
              key={key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                p: 1.1,
                borderRadius: '12px',
                bgcolor: '#fff',
                border: `1px solid ${fieldError ? 'rgba(220,38,38,0.35)' : 'rgba(15,23,42,0.08)'}`,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: color }}>
                  {TEST_SKILL_QB_LABELS[skill]}
                </Typography>
                <Typography sx={{ fontSize: 11, color: MUTED, mt: 0.15 }}>
                  Có sẵn: {available} câu
                </Typography>
              </Box>
              <InputBase
                type="number"
                inputProps={{ min: 0 }}
                value={config[key] ?? 0}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                disabled={disabled}
                sx={inputSx(Boolean(fieldError))}
              />
              {fieldError && (
                <Typography sx={{ fontSize: 11, color: '#DC2626', maxWidth: 140 }}>{fieldError}</Typography>
              )}
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          mt: 1.25,
          p: 1,
          borderRadius: '10px',
          bgcolor: 'rgba(15,23,42,0.04)',
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: TEXT }}>
          Tổng: {total} câu hỏi
        </Typography>
        <Typography sx={{ fontSize: 11, color: MUTED, mt: 0.25 }}>
          Mỗi lần làm bài sẽ random câu từ bank các chương.
        </Typography>
      </Box>
    </Box>
  );
}
