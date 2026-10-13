import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, InputBase, Typography } from '@mui/material';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  COURSE_THUMBNAIL_ASPECT,
  CREATE_CARD_SX,
  MUTED,
  PRIMARY,
  TEXT,
} from './mentorCourseCreateStyles';
import { contentFieldSx, contentInputInnerSx } from './mentorCourseContentStyles';
import MentorCardSectionTitle from './MentorCardSectionTitle';
import MentorCourseImageBox from './MentorCourseImageBox';
import AppButton from '@/shared/ui/AppButton';
import ThumbnailImage from '@/shared/ui/ThumbnailImage';
import { toast } from '@/shared/ui/Toast';
import { underlineFieldSx as valueUnderlineSx } from '@/shared/ui/UnderlineFieldPopup';
import { getUser } from '@/features/auth/utils/authUtils';
import {
  fetchCourseCategories,
  fetchCourseLevels,
  updateCourseBasicInfo,
} from '@/features/mentor/services/mentorCourseService';
import {
  buildCreateCourseStep1Payload,
  MENTOR_COURSE_DESCRIPTION_MAX,
  MENTOR_COURSE_FORM_INITIAL,
  MENTOR_COURSE_NAME_MAX,
  validateMentorCourseForm,
} from '@/features/mentor/utils/mentorCourseFormUtils';
import {
  courseDetailToEditCourse,
  courseDetailToEditForm,
} from '@/features/mentor/utils/mentorCourseEditStorage';
import { formatMentorCourseDate, countCourseStudents } from '@/features/mentor/utils/mentorCourseUtils';
import { resolveCategoryChipSx, resolveLevelChipSx } from '@/shared/catalog/catalogRegistry';

const FIELD_COLORS = {
  title: '#0E7490',
  description: MUTED,
  instructor: '#4338CA',
  created: '#B45309',
  updated: '#0369A1',
};

function chipSxToColor(chipSx) {
  return chipSx.color ?? MUTED;
}

function InfoRow({ label, value, icon: Icon, iconColor, valueSx, rootSx, children }) {
  const accent = iconColor ?? MUTED;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
        py: 1.4,
        ...rootSx,
      }}
    >
      <Icon sx={{ fontSize: 16, color: accent, flexShrink: 0, mt: 0.25 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 11, color: MUTED, fontWeight: 500, mb: 0.4, lineHeight: 1.2 }}>
          {label}
        </Typography>
        {children ?? (
          <Box sx={valueUnderlineSx}>
            <Typography
              sx={{
                fontSize: 13.5,
                fontWeight: 600,
                color: TEXT,
                lineHeight: 1.4,
                wordBreak: 'break-word',
                ...valueSx,
              }}
            >
              {value ?? '—'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function InlineInput({ name, value, onChange, disabled, placeholder, multiline, rows, maxLength, error }) {
  return (
    <Box>
      <Box sx={contentFieldSx(Boolean(error))}>
        <InputBase
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          fullWidth
          multiline={multiline}
          minRows={multiline ? rows : undefined}
          inputProps={maxLength ? { maxLength } : undefined}
          sx={multiline ? { ...contentInputInnerSx, alignItems: 'flex-start', py: 0.25 } : contentInputInnerSx}
        />
      </Box>
      {error ? (
        <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.5, lineHeight: 1.3 }}>{error}</Typography>
      ) : null}
    </Box>
  );
}

function InlineSelect({ name, value, onChange, disabled, placeholder, options, error }) {
  return (
    <Box>
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
          {(options ?? []).map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </Box>
      </Box>
      {error ? (
        <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.5, lineHeight: 1.3 }}>{error}</Typography>
      ) : null}
    </Box>
  );
}

export default function MentorCourseOverviewTab({ course, onCourseUpdated }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(MENTOR_COURSE_FORM_INITIAL);
  const [formErrors, setFormErrors] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const hasStudents = countCourseStudents(course) > 0;
  const validationOptions = useMemo(
    () => ({
      skipCategoryLevel: hasStudents,
      skipThumbnail: hasStudents,
    }),
    [hasStudents],
  );

  const categoryColor = chipSxToColor(
    resolveCategoryChipSx({
      id: course.CategoryId,
      displayName: course.CategoryDisplayName,
    }),
  );
  const levelColor = chipSxToColor(
    resolveLevelChipSx({
      id: course.LevelId,
      displayName: course.LevelDisplayName,
    }),
  );

  const syncFormFromCourse = useCallback(() => {
    setForm(courseDetailToEditForm(course));
    setFormErrors({});
  }, [course]);

  const loadFormOptions = useCallback(async () => {
    if (optionsLoaded) return;
    setOptionsLoading(true);
    try {
      const [categoryResult, levelResult] = await Promise.all([
        fetchCourseCategories(),
        fetchCourseLevels(),
      ]);
      if (categoryResult.ok) setCategoryOptions(categoryResult.categories);
      if (levelResult.ok) setLevelOptions(levelResult.levels);
      setOptionsLoaded(true);
    } finally {
      setOptionsLoading(false);
    }
  }, [optionsLoaded]);

  useEffect(() => {
    if (!editing) return;
    syncFormFromCourse();
    loadFormOptions();
  }, [editing, syncFormFromCourse, loadFormOptions]);

  const handleStartEdit = () => {
    syncFormFromCourse();
    setEditing(true);
    loadFormOptions();
  };

  const handleCancelEdit = () => {
    syncFormFromCourse();
    setEditing(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if (hasStudents && (name === 'CategoryId' || name === 'LevelId' || name === 'Thumbnail')) {
      return;
    }
    setForm((prev) => ({ ...prev, [name]: name === 'IsPublished' ? Boolean(value) : value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const fieldErrors = validateMentorCourseForm(form, validationOptions);
    if (Object.keys(fieldErrors).length > 0) {
      setFormErrors(fieldErrors);
      return;
    }

    const instructorId = getUser()?.userId;
    if (!instructorId) {
      toast.error('Không xác định được mentor. Vui lòng đăng nhập lại.');
      return;
    }

    const courseId = course.CourseId ?? course.courseId;
    const baseCourse = courseDetailToEditCourse(course);
    const payload = buildCreateCourseStep1Payload(form, instructorId);
    const nextCourse = {
      ...baseCourse,
      ...payload,
      CourseId: Number(courseId),
    };

    if (hasStudents) {
      nextCourse.CategoryId = baseCourse.CategoryId ?? nextCourse.CategoryId;
      nextCourse.LevelId = baseCourse.LevelId ?? nextCourse.LevelId;
      nextCourse.Thumbnail = baseCourse.Thumbnail ?? nextCourse.Thumbnail;
    }

    setSaving(true);
    try {
      const result = await updateCourseBasicInfo(courseId, nextCourse);
      if (!result.ok) {
        toast.error(result.message || 'Không thể cập nhật thông tin khóa học.');
        return;
      }
      toast.success('Đã cập nhật thông tin khóa học.');
      setEditing(false);
      onCourseUpdated?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSave} sx={CREATE_CARD_SX}>
      <MentorCardSectionTitle
        title="Thông tin khóa học"
        action={
          !editing ? (
            <AppButton
              variant="outlined"
              startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={handleStartEdit}
              sx={{
                height: 34,
                borderRadius: '999px',
                fontSize: 12,
                fontWeight: 600,
                px: 1.5,
                flexShrink: 0,
              }}
            >
              Chỉnh sửa
            </AppButton>
          ) : null
        }
      />

      {editing && hasStudents ? (
        <Alert severity="info" sx={{ mb: 2, fontSize: 13 }}>
          Khóa học đã có học viên đăng ký. Bạn chỉ có thể chỉnh sửa tên và mô tả.
        </Alert>
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '220px minmax(0, 1fr)' },
          gap: 2.5,
          alignItems: 'start',
        }}
      >
        {editing ? (
          <MentorCourseImageBox
            compact
            value={form.Thumbnail}
            error={formErrors.Thumbnail}
            onChange={handleFormChange}
            disabled={saving || hasStudents}
          />
        ) : (
          <ThumbnailImage
            src={course.Thumbnail}
            label={course.CourseName}
            alt={course.CourseName}
            cacheKey={course.CourseUpdateAt ?? course.UpdatedAt ?? course.CourseCreateAt}
            iconSize={40}
            sx={{
              width: '100%',
              aspectRatio: String(COURSE_THUMBNAIL_ASPECT),
              borderRadius: '16px',
              border: '1px solid rgba(15,23,42,0.08)',
            }}
          />
        )}

        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1.4fr) minmax(0, 1fr)' },
              columnGap: 2,
            }}
          >
            <InfoRow
              label="Tên khóa học"
              value={course.CourseName}
              icon={MenuBookOutlinedIcon}
              iconColor={FIELD_COLORS.title}
              valueSx={{ fontSize: 14, fontWeight: 700, color: PRIMARY }}
            >
              {editing ? (
                <InlineInput
                  name="CourseName"
                  value={form.CourseName}
                  onChange={handleFormChange}
                  disabled={saving}
                  placeholder="Tên khóa học"
                  maxLength={MENTOR_COURSE_NAME_MAX}
                  error={formErrors.CourseName}
                />
              ) : null}
            </InfoRow>
            <InfoRow
              label="Giảng viên"
              value={course.InStructorName}
              icon={PersonOutlineOutlinedIcon}
              iconColor={FIELD_COLORS.instructor}
            />
            <InfoRow
              label="Danh mục"
              value={course.CategoryDisplayName}
              icon={CategoryOutlinedIcon}
              iconColor={categoryColor}
            >
              {editing ? (
                <InlineSelect
                  name="CategoryId"
                  value={form.CategoryId}
                  onChange={handleFormChange}
                  disabled={saving || optionsLoading || hasStudents}
                  options={categoryOptions}
                  placeholder={optionsLoading ? 'Đang tải...' : 'Chọn danh mục'}
                  error={formErrors.CategoryId}
                />
              ) : null}
            </InfoRow>
            <InfoRow
              label="Trình độ"
              value={course.LevelDisplayName}
              icon={SignalCellularAltOutlinedIcon}
              iconColor={levelColor}
            >
              {editing ? (
                <InlineSelect
                  name="LevelId"
                  value={form.LevelId}
                  onChange={handleFormChange}
                  disabled={saving || optionsLoading || hasStudents}
                  options={levelOptions}
                  placeholder={optionsLoading ? 'Đang tải...' : 'Chọn trình độ'}
                  error={formErrors.LevelId}
                />
              ) : null}
            </InfoRow>
            <InfoRow
              label="Ngày tạo"
              value={formatMentorCourseDate(course.CourseCreateAt)}
              icon={EventOutlinedIcon}
              iconColor={FIELD_COLORS.created}
            />
            <InfoRow
              label="Cập nhật gần nhất"
              value={formatMentorCourseDate(course.CourseUpdateAt)}
              icon={UpdateOutlinedIcon}
              iconColor={FIELD_COLORS.updated}
            />
          </Box>

          <InfoRow
            label="Mô tả"
            value={course.Description || '—'}
            icon={DescriptionOutlinedIcon}
            iconColor={FIELD_COLORS.description}
            valueSx={{ fontWeight: 500, color: 'rgba(15,23,42,0.82)' }}
          >
            {editing ? (
              <InlineInput
                name="Description"
                value={form.Description}
                onChange={handleFormChange}
                disabled={saving}
                multiline
                rows={4}
                maxLength={MENTOR_COURSE_DESCRIPTION_MAX}
                placeholder="Mô tả khóa học"
                error={formErrors.Description}
              />
            ) : null}
          </InfoRow>
        </Box>
      </Box>

      {editing ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            gap: 1.25,
            mt: 2.5,
            pt: 2,
            borderTop: '1px solid rgba(15,23,42,0.08)',
          }}
        >
          <AppButton
            type="button"
            variant="outlined"
            onClick={handleCancelEdit}
            disabled={saving}
            sx={{ minWidth: 100, height: 44, borderRadius: '999px', fontWeight: 700 }}
          >
            Hủy
          </AppButton>
          <AppButton
            type="submit"
            loading={saving}
            endIcon={!saving ? <SaveRoundedIcon /> : undefined}
            sx={{
              minWidth: 120,
              height: 44,
              borderRadius: '999px',
              fontWeight: 700,
              bgcolor: PRIMARY,
              '&:hover': { bgcolor: '#0E7490' },
            }}
          >
            Lưu
          </AppButton>
        </Box>
      ) : null}
    </Box>
  );
}
