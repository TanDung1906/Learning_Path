import { Alert, Box, InputBase, Typography } from '@mui/material';
import { MENTOR_COURSE_DESCRIPTION_MAX, MENTOR_COURSE_NAME_MAX } from '@/features/mentor/utils/mentorCourseFormUtils';
import { contentFieldSx, contentInputInnerSx } from './mentorCourseContentStyles';
import { MUTED, SECTION_TITLE_SX, TEXT } from './mentorCourseCreateStyles';

function FormField({
  label,
  name,
  value,
  error,
  onChange,
  placeholder,
  disabled,
  multiline = false,
  rows = 4,
  type = 'text',
  selectOptions = [],
  maxLength,
  showCharCount = false,
}) {
  const isSelect = type === 'select';
  const charCount = String(value ?? '').length;

  return (
    <Box sx={{ mb: 2.5, '&:last-of-type': { mb: 0 } }}>
      <Typography sx={{ fontSize: 11, fontWeight: 500, color: MUTED, mb: 0.4, lineHeight: 1.2 }}>
        {label}
      </Typography>

      {isSelect ? (
        <Box sx={contentFieldSx(Boolean(error))}>
          <Box
            component="select"
            name={name}
            value={value ?? ''}
            onChange={onChange}
            disabled={disabled}
            sx={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 13.5,
              fontWeight: 600,
              color: TEXT,
              p: 0,
              lineHeight: 1.4,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <option value="">{placeholder || 'Chọn...'}</option>
            {(selectOptions ?? []).map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </Box>
        </Box>
      ) : multiline ? (
        <Box sx={contentFieldSx(Boolean(error))}>
          <InputBase
            name={name}
            value={value ?? ''}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            fullWidth
            multiline
            minRows={rows}
            inputProps={maxLength ? { maxLength } : undefined}
            sx={{ ...contentInputInnerSx, alignItems: 'flex-start', py: 0.25 }}
          />
        </Box>
      ) : (
        <Box sx={contentFieldSx(Boolean(error))}>
          <InputBase
            name={name}
            value={value ?? ''}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            fullWidth
            inputProps={maxLength ? { maxLength } : undefined}
            sx={contentInputInnerSx}
          />
        </Box>
      )}

      {showCharCount && maxLength && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
            mt: 0.5,
          }}
        >
          {charCount >= maxLength ? (
            <Typography sx={{ fontSize: 11, color: '#DC2626', lineHeight: 1.3, flex: 1 }}>
              Đã đạt giới hạn tối đa {maxLength} ký tự.
            </Typography>
          ) : (
            <Box sx={{ flex: 1 }} />
          )}
          <Typography
            sx={{
              fontSize: 11,
              color: charCount >= maxLength ? '#DC2626' : MUTED,
              lineHeight: 1.3,
              flexShrink: 0,
            }}
          >
            {charCount}/{maxLength}
          </Typography>
        </Box>
      )}

      {error && (
        <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.5, lineHeight: 1.3 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default function MentorCourseBasicInfoForm({
  form,
  errors = {},
  onChange,
  disabled = false,
  categoryOptions = [],
  levelOptions = [],
  optionsLoading = false,
  lockCategoryAndLevel = false,
}) {
  return (
    <Box>
      <Typography sx={{ ...SECTION_TITLE_SX, fontSize: 14, fontWeight: 600, mb: 2 }}>
        Thông tin cơ bản
      </Typography>

      {lockCategoryAndLevel && (
        <Alert severity="info" sx={{ mb: 2, fontSize: 13 }}>
          Khóa học đã có học viên đăng ký. Bạn chỉ có thể chỉnh sửa tên và mô tả.
        </Alert>
      )}

      <FormField
        label="Tên khóa học"
        name="CourseName"
        value={form.CourseName}
        error={errors.CourseName}
        onChange={onChange}
        disabled={disabled}
        maxLength={MENTOR_COURSE_NAME_MAX}
        showCharCount
        placeholder="Ví dụ: Tiếng Anh Giao Tiếp Đời Sống Hàng Ngày"
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 0, sm: 2 },
        }}
      >
        <FormField
          label="Danh mục"
          name="CategoryId"
          value={form.CategoryId}
          error={errors.CategoryId}
          onChange={onChange}
          disabled={disabled || optionsLoading || lockCategoryAndLevel}
          type="select"
          selectOptions={categoryOptions}
          placeholder={optionsLoading ? 'Đang tải...' : 'Chọn danh mục'}
        />
        <FormField
          label="Trình độ"
          name="LevelId"
          value={form.LevelId}
          error={errors.LevelId}
          onChange={onChange}
          disabled={disabled || optionsLoading || lockCategoryAndLevel}
          type="select"
          selectOptions={levelOptions}
          placeholder={optionsLoading ? 'Đang tải...' : 'Chọn trình độ'}
        />
      </Box>

      <FormField
        label="Mô tả khóa học"
        name="Description"
        value={form.Description}
        error={errors.Description}
        onChange={onChange}
        disabled={disabled}
        multiline
        rows={4}
        maxLength={MENTOR_COURSE_DESCRIPTION_MAX}
        showCharCount
        placeholder="Mô tả ngắn gọn nội dung, mục tiêu và đối tượng phù hợp của khóa học."
      />
    </Box>
  );
}
