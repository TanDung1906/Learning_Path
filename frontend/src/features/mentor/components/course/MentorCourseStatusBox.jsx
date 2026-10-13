import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { CREATE_CARD_SX, MUTED, PRIMARY, TEXT } from './mentorCourseCreateStyles';

export default function MentorCourseStatusBox({ isPublished, onChange, disabled }) {
  const value = isPublished ? 'published' : 'draft';

  const handleChange = (event) => {
    onChange?.({
      target: {
        name: 'IsPublished',
        value: event.target.value === 'published',
        type: 'radio',
      },
    });
  };

  return (
    <Box sx={CREATE_CARD_SX}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <FactCheckOutlinedIcon sx={{ fontSize: 18, color: '#047857' }} />
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEXT }}>
          Trạng thái
        </Typography>
      </Box>

      <RadioGroup value={value} onChange={handleChange} sx={{ gap: 0.25 }}>
        <FormControlLabel
          value="draft"
          disabled={disabled}
          control={
            <Radio
              size="small"
              sx={{ color: MUTED, '&.Mui-checked': { color: PRIMARY } }}
            />
          }
          label={
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: TEXT }}>
              Lưu bản nháp
            </Typography>
          }
          sx={{ mx: 0 }}
        />
        <FormControlLabel
          value="published"
          disabled={disabled}
          control={
            <Radio
              size="small"
              sx={{ color: MUTED, '&.Mui-checked': { color: '#047857' } }}
            />
          }
          label={
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: TEXT }}>
              Xuất bản ngay
            </Typography>
          }
          sx={{ mx: 0 }}
        />
      </RadioGroup>
    </Box>
  );
}
