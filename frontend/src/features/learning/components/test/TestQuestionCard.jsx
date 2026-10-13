import {
  Box,
  Checkbox,
  Radio,
  FormControlLabel,
  Typography,
  alpha,
} from '@mui/material';
import {
  TEST_DIVIDER,
  TEST_MUTED,
  TEST_PRIMARY,
  TEST_TEXT,
} from './testTheme';

export default function TestQuestionCard({
  question,
  selectedOptionTempIds = [],
  onChange,
  contextMeta = null,
}) {
    const isMultiple = question.isMultipleChoice; 

  const handleToggle = (optionTempId) => {
   const current = selectedOptionTempIds ?? [];
    let next;
    
    if (isMultiple) {
      // Logic dành cho Checkbox (chọn nhiều)
      next = current.includes(optionTempId)
        ? current.filter((id) => id !== optionTempId)
        : [...current, optionTempId];
    } else {
      // Logic dành cho Radio (chỉ chọn 1, ghi đè mảng)
      next = [optionTempId];
    }
    
    onChange(question.tempId, next);
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '14px',
        border: `1px solid ${TEST_DIVIDER}`,
        px: { xs: 2, md: 2.5 },
        py: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.5 }}>
        <Box
          sx={{
            minWidth: 28,
            height: 28,
            borderRadius: '8px',
            bgcolor: alpha(TEST_PRIMARY, 0.08),
            color: TEST_PRIMARY,
            fontWeight: 800,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {question.order}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {contextMeta && (
            <Typography sx={{ fontSize: 12.5, color: TEST_MUTED, mb: 0.5, lineHeight: 1.4 }}>
              {contextMeta}
            </Typography>
          )}
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: TEST_TEXT, lineHeight: 1.55 }}>
            {question.questionText}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: { xs: 0, md: 4.5 } }}>
        {(question.options ?? []).map((option) => {
          const checked = selectedOptionTempIds.includes(option.tempId);

          return (
            <Box
              key={option.tempId}
              sx={{
                borderRadius: '10px',
                border: `1px solid ${checked ? alpha(TEST_PRIMARY, 0.35) : TEST_DIVIDER}`,
                bgcolor: checked ? alpha(TEST_PRIMARY, 0.04) : 'transparent',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
            >
              <FormControlLabel
                control={
                  isMultiple ? (
                    <Checkbox
                      checked={checked}
                      onChange={() => handleToggle(option.tempId)}
                      sx={{ color: TEST_MUTED, '&.Mui-checked': { color: TEST_PRIMARY } }}
                    />
                  ) : (
                    <Radio
                      checked={checked}
                      onChange={() => handleToggle(option.tempId)}
                      sx={{ color: TEST_MUTED, '&.Mui-checked': { color: TEST_PRIMARY } }}
                    />
                  )
                }
                label={option.optionText}
                sx={{
                  m: 0,
                  px: 1,
                  py: 0.25,
                  width: '100%',
                  alignItems: 'flex-start',
                  '& .MuiFormControlLabel-label': {
                    fontSize: 14,
                    color: TEST_TEXT,
                    lineHeight: 1.5,
                    pt: 0.75,
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
