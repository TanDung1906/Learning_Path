import { Box, Checkbox, Collapse, IconButton, InputBase, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { MUTED, TEXT } from './mentorCourseCreateStyles';
import {
  createTestTempId,
  TEST_QUESTION_OPTION_TEXT_MAX,
  TEST_QUESTION_TEXT_MAX,
} from '@/features/mentor/utils/mentorTestContentUtils';

export default function MentorQuestionTypeFields({
  question,
  errors = {},
  accentColor,
  disabled = false,
  onChange,
  collapsibleChoices = false,
  choicesExpanded = false,
  onChoicesExpandedChange,
  questionIndex = 0,
}) {
  const handleFieldChange = (patch) => onChange({ ...question, ...patch });

  const options = question.Options ?? [];

  const updateOptions = (nextOptions) => {
    handleFieldChange({
      Options: nextOptions,
    });
  };

  const handleOptionTextChange = (optionTempId, value) => {
    updateOptions(
      options.map((option) =>
        option.tempId === optionTempId
          ? { ...option, OptionText: value.slice(0, TEST_QUESTION_OPTION_TEXT_MAX) }
          : option,
      ),
    );
  };

  const handleCorrectToggle = (optionTempId) => {
    const target = options.find((option) => option.tempId === optionTempId);
    if (!target) return;

    const nextIsCorrect = !target.IsCorrect;
    if (!nextIsCorrect && options.filter((option) => option.IsCorrect).length <= 1) {
      return;
    }

    updateOptions(
      options.map((option) =>
        option.tempId === optionTempId
          ? { ...option, IsCorrect: nextIsCorrect }
          : option,
      ),
    );
  };

  const handleAddOption = () => {
    updateOptions([
      ...options,
      { tempId: createTestTempId('option'), OptionText: '', IsCorrect: false },
    ]);
  };

  const handleRemoveOption = (optionTempId) => {
    if (options.length <= 2) return;
    updateOptions(options.filter((option) => option.tempId !== optionTempId));
  };

  const questionTextLength = String(question.QuestionText ?? '').length;
  const isQuestionTextAtMax = questionTextLength >= TEST_QUESTION_TEXT_MAX;
  const questionTextBorderError = Boolean(errors.QuestionText) || isQuestionTextAtMax;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.35 }}>
      {/* Question text */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.35, minWidth: 0 }}>
        {collapsibleChoices ? (
          <Typography
            component="span"
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: MUTED,
              flexShrink: 0,
              lineHeight: 1.5,
              whiteSpace: 'nowrap',
              pt: 0.35,
            }}
          >
            Câu {questionIndex + 1} :
          </Typography>
        ) : null}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <InputBase
            value={question.QuestionText ?? ''}
            onChange={(event) =>
              handleFieldChange({
                QuestionText: event.target.value.slice(0, TEST_QUESTION_TEXT_MAX),
              })
            }
            disabled={disabled}
            placeholder="Nhập nội dung câu hỏi..."
            fullWidth
            multiline
            minRows={2}
            maxRows={8}
            inputProps={{ maxLength: TEST_QUESTION_TEXT_MAX }}
            sx={{
              fontSize: collapsibleChoices ? 14 : 13.5,
              fontWeight: collapsibleChoices ? 600 : 400,
              color: TEXT,
              lineHeight: 1.55,
              alignItems: 'flex-start',
              px: collapsibleChoices ? 0.85 : 0.25,
              py: collapsibleChoices ? 0.75 : 0.25,
              width: '100%',
              borderRadius: collapsibleChoices ? '10px' : 0,
              border: collapsibleChoices
                ? `1px solid ${questionTextBorderError ? '#DC2626' : 'rgba(15,23,42,0.1)'}`
                : 'none',
              borderBottom: collapsibleChoices
                ? undefined
                : `1.5px solid ${questionTextBorderError ? '#DC2626' : 'rgba(15,23,42,0.1)'}`,
              bgcolor: isQuestionTextAtMax
                ? 'rgba(220,38,38,0.04)'
                : collapsibleChoices
                  ? '#fff'
                  : 'transparent',
              '& .MuiInputBase-input': {
                resize: 'vertical',
              },
              '&:focus-within': {
                borderColor: questionTextBorderError ? '#DC2626' : accentColor,
                ...(collapsibleChoices
                  ? {
                    boxShadow: `0 0 0 2px ${questionTextBorderError ? 'rgba(220,38,38,0.12)' : 'rgba(8,145,178,0.12)'}`,
                  }
                  : { borderBottomColor: questionTextBorderError ? '#DC2626' : accentColor }),
              },
            }}
          />
          {isQuestionTextAtMax ? (
            <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.3 }}>
              Chỉ cho phép 250 ký tự
            </Typography>
          ) : errors.QuestionText ? (
            <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.3 }}>
              {errors.QuestionText}
            </Typography>
          ) : null}
        </Box>

        {collapsibleChoices ? (
          <IconButton
            size="small"
            onClick={() => onChoicesExpandedChange?.(!choicesExpanded)}
            disabled={disabled}
            aria-label={choicesExpanded ? 'Thu gọn đáp án' : 'Mở đáp án'}
            aria-expanded={choicesExpanded}
            sx={{
              flexShrink: 0,
              mt: 0.15,
              color: 'rgba(15,23,42,0.45)',
              '&:hover': { color: accentColor, bgcolor: 'rgba(15,23,42,0.06)' },
            }}
          >
            {choicesExpanded ? (
              <KeyboardArrowUpRoundedIcon sx={{ fontSize: 22 }} />
            ) : (
              <KeyboardArrowDownRoundedIcon sx={{ fontSize: 22 }} />
            )}
          </IconButton>
        ) : null}
      </Box>

      {errors._correctOption ? (
        <Typography sx={{ fontSize: 11, color: '#DC2626', mt: -0.5, mb: 0.25 }}>
          {errors._correctOption}
        </Typography>
      ) : null}

      {/* Answer options */}
      <Collapse in={!collapsibleChoices || choicesExpanded} timeout="auto" unmountOnExit={false}>
        <Box>
        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 700,
            color: MUTED,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 0.65,
          }}
        >
          Đáp án (có thể chọn nhiều đáp án đúng)
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.15 }}>
          {options.map((option, index) => {
            const optionErrors = errors.Options?.[option.tempId] ?? {};
            const isCorrect = Boolean(option.IsCorrect);
            const letter = String.fromCharCode(65 + index);
            const optionTextLength = String(option.OptionText ?? '').length;
            const isOptionTextAtMax = optionTextLength >= TEST_QUESTION_OPTION_TEXT_MAX;
            const optionTextBorderError = Boolean(optionErrors.OptionText) || isOptionTextAtMax;

            return (
              <Box
                key={option.tempId}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 0.4,
                  px: 0.35,
                  py: 0.15,
                  borderRadius: '8px',
                  bgcolor: isCorrect ? 'rgba(22,163,74,0.05)' : 'transparent',
                  transition: 'background-color 0.12s',
                }}
              >
                <Checkbox
                  checked={isCorrect}
                  onChange={() => handleCorrectToggle(option.tempId)}
                  disabled={disabled}
                  size="small"
                  sx={{
                    p: 0.35,
                    flexShrink: 0,
                    mt: 0.1,
                    color: 'rgba(15,23,42,0.2)',
                    '&.Mui-checked': { color: accentColor },
                  }}
                  inputProps={{ 'aria-label': `Đáp án đúng ${letter}` }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <InputBase
                    value={option.OptionText ?? ''}
                    onChange={(event) => handleOptionTextChange(option.tempId, event.target.value)}
                    disabled={disabled}
                    placeholder={`Đáp án ${letter}`}
                    fullWidth
                    inputProps={{ maxLength: TEST_QUESTION_OPTION_TEXT_MAX }}
                    sx={{
                      fontSize: 13,
                      color: TEXT,
                      px: 0.5,
                      py: 0.35,
                      borderRadius: '8px',
                      border: `1px solid ${
                        optionTextBorderError
                          ? '#DC2626'
                          : isCorrect
                            ? 'rgba(22,163,74,0.35)'
                            : 'rgba(15,23,42,0.08)'
                      }`,
                      bgcolor: isOptionTextAtMax ? 'rgba(220,38,38,0.04)' : 'transparent',
                      '&:focus-within': {
                        borderColor: optionTextBorderError ? '#DC2626' : accentColor,
                        boxShadow: optionTextBorderError
                          ? '0 0 0 2px rgba(220,38,38,0.12)'
                          : `0 0 0 2px rgba(8,145,178,0.12)`,
                      },
                    }}
                  />
                  {isOptionTextAtMax ? (
                    <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.3 }}>
                      Chỉ cho phép 250 ký tự
                    </Typography>
                  ) : optionErrors.OptionText ? (
                    <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.3 }}>
                      {optionErrors.OptionText}
                    </Typography>
                  ) : null}
                </Box>
                {options.length > 2 ? (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveOption(option.tempId)}
                    disabled={disabled}
                    aria-label="Xóa đáp án"
                    sx={{
                      p: 0.3,
                      flexShrink: 0,
                      mt: 0.1,
                      color: 'rgba(15,23,42,0.2)',
                      '&:hover': { color: '#DC2626', bgcolor: 'rgba(220,38,38,0.06)' },
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                ) : (
                  <Box sx={{ width: 24, flexShrink: 0 }} />
                )}
              </Box>
            );
          })}
        </Box>

        {errors._options ? (
          <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.4 }}>{errors._options}</Typography>
        ) : null}

        <Box
          component="button"
          type="button"
          onClick={handleAddOption}
          disabled={disabled}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.35,
            mt: 0.85,
            px: 0.65,
            py: 0.4,
            border: 'none',
            background: 'none',
            borderRadius: '8px',
            cursor: disabled ? 'default' : 'pointer',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'inherit',
            color: '#64748B',
            opacity: disabled ? 0.5 : 1,
            '&:hover': disabled ? undefined : { bgcolor: 'rgba(15,23,42,0.06)' },
          }}
        >
          <AddRoundedIcon sx={{ fontSize: 14 }} />
          Thêm đáp án
        </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
