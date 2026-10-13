/**
 * MentorCreateCoursePage  ─  Bước 1: Tạo thông tin cơ bản khóa học
 *
 * Props: không có (page component, route: /mentor/courses/create)
 *
 * State nội bộ:
 *   form  { courseName, description, categoryId, levelId, thumbnail, isFree }
 *
 * ── Fetch data ───────────────────────────────────────────────────────────
 *   useEffect: gọi fetchCourseCategories() + fetchCourseLevels() khi mount
 *
 *   GET /api/categories
 *   Response: { success: true, categories: [{ categoryId, displayName }] }
 *
 *   GET /api/levels
 *   Response: { success: true, levels: [{ levelId, displayName }] }
 *
 * ── API call (lưu bản nháp) ──────────────────────────────────────────────
 *   saveCreateCourseStep1(form, user.userId)
 *
 *   TODO: POST /api/mentor/courses/draft
 *   Request JSON:
 *   {
 *     courseName:  string,
 *     description: string,
 *     categoryId:  number,
 *     levelId:     number,
 *     thumbnail:   string | null,
 *     isFree:      boolean
 *   }
 *   Response JSON: { success: true, courseId: number }
 *
 *   Sau khi lưu → navigate('/mentor/courses/create/content')
 */
import { useEffect, useMemo, useState } from 'react';
import { Box, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate } from 'react-router-dom';
import AppButton from '@/shared/ui/AppButton';
import { toast } from '@/shared/ui/Toast';
import MentorCourseCreateForm from '@/features/mentor/components/course/MentorCourseCreateForm';
import MentorCourseCreateStepIndicator from '@/features/mentor/components/course/MentorCourseCreateStepIndicator';
import MentorCourseLeaveDialog from '@/features/mentor/components/course/MentorCourseLeaveDialog';
import { useMentorCourseLeaveGuard } from '@/features/mentor/hooks/useMentorCourseLeaveGuard';
import {
  fetchCourseCategories,
  fetchCourseLevels,
  fetchMentorCourses,
  saveCreateCourseStep1,
} from '@/features/mentor/services/mentorCourseService';
import { getUser } from '@/features/auth/utils/authUtils';
import {
  formFromStep1Payload,
  loadCreateCourseStep1FromStorage,
} from '@/features/mentor/utils/mentorCourseCreateStorage';
import {
  MENTOR_COURSE_FORM_INITIAL,
  findDuplicateMentorCourse,
  isMentorCourseFormDirty,
  validateMentorCourseForm,
} from '@/features/mentor/utils/mentorCourseFormUtils';

function LeaveAwareBreadcrumbLink({ to, children, onNavigate, sx }) {
  return (
    <MuiLink
      component="button"
      type="button"
      underline="hover"
      onClick={() => onNavigate(to)}
      sx={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        font: 'inherit',
        p: 0,
        ...sx,
      }}
    >
      {children}
    </MuiLink>
  );
}

export default function MentorCreateCoursePage() {
  const navigate = useNavigate();
  //   export const MENTOR_COURSE_FORM_INITIAL = {
  //   CourseName: '',
  //   Description: '',
  //   CategoryId: '',
  //   LevelId: '',
  //   Thumbnail: '',
  //   IsPublished: false,
  // };
  const [form, setForm] = useState(MENTOR_COURSE_FORM_INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const instructorId = getUser()?.userId ?? null;
  const isDirty = useMemo(() => isMentorCourseFormDirty(form), [form]);

  const {
    dialogOpen,
    saving,
    requestLeave,
    handleStay,
    handleDiscard,
    handleSaveDraft,
  } = useMentorCourseLeaveGuard({ isDirty, form, instructorId });

  useEffect(() => {
    const saved = loadCreateCourseStep1FromStorage();
    const restored = formFromStep1Payload(saved);
    if (restored) setForm(restored);
  }, []);
  //fetch Category & Level
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setOptionsLoading(true);
      const [categoryResult, levelResult] = await Promise.all([
        fetchCourseCategories(),
        fetchCourseLevels(),
      ]);

      if (cancelled) return;

      if (categoryResult.ok) {
        setCategoryOptions(categoryResult.categories);
      } else {
        toast.error(categoryResult.message || 'Không thể tải danh mục khóa học.');
      }

      if (levelResult.ok) {
        setLevelOptions(levelResult.levels);
      } else {
        toast.error(levelResult.message || 'Không thể tải trình độ khóa học.');
      }

      setOptionsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  //console.log(levelOptions);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'IsPublished' ? Boolean(value) : value,
    }));

    if (errors[name] || (
      (name === 'CourseName' || name === 'CategoryId' || name === 'LevelId')
      && (errors.CourseName || errors.CategoryId || errors.LevelId)
    )) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        if (name === 'CourseName' || name === 'CategoryId' || name === 'LevelId') {
          delete next.CourseName;
          delete next.CategoryId;
          delete next.LevelId;
        }
        return next;
      });
    }
  };

  const handleNext = async () => {
    const validationErrors = validateMentorCourseForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!instructorId) {
      toast.error('Không xác định được mentor. Vui lòng đăng nhập lại.');
      return;
    }

    setSubmitting(true);
    try {
      const coursesResult = await fetchMentorCourses();
      if (!coursesResult.ok) {
        toast.error(coursesResult.message || 'Không thể kiểm tra khóa học hiện có.');
        return;
      }

      const duplicate = findDuplicateMentorCourse(form, coursesResult.courses ?? []);
      if (duplicate) {
        const message = 'Bạn đã có khóa học trùng tên, thể loại và trình độ.';
        setErrors({
          CourseName: message,
          CategoryId: message,
          LevelId: message,
        });
        toast.error(message);
        return;
      }

      const result = await saveCreateCourseStep1(form, instructorId);
      if (!result.ok) {
        return;
      }
      navigate('/mentor/courses/create/content');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleNext();
  };

  // Button (Hủy, Tiếp theo)
  const formFooter = (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: 1.25,
        pt: 0.5,
      }}
    >
      {/* Button Hủy */}
      <AppButton
        variant="outlined"
        onClick={() => requestLeave('/mentor/courses')}
        disabled={submitting || saving}
        sx={{ minWidth: 100, height: 44, borderRadius: '999px', fontWeight: 700 }}
      >
        Hủy
      </AppButton>
      {/* Button Tiếp theo */}
      <AppButton
        type="submit"
        loading={submitting}
        endIcon={!submitting ? <ArrowForwardRoundedIcon /> : undefined}
        sx={{
          minWidth: 128,
          height: 44,
          borderRadius: '999px',
          fontWeight: 700,
          bgcolor: '#0891B2',
          '&:hover': { bgcolor: '#0E7490' },
        }}
      >
        Tiếp theo
      </AppButton>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 1080, mx: 'auto' }}>
      <Breadcrumbs
        separator="/"
        sx={{ mb: 2, '& .MuiBreadcrumbs-separator': { color: '#64748B', mx: 0.5 } }}
      >
        <LeaveAwareBreadcrumbLink
          to="/home"
          onNavigate={requestLeave}
          sx={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}
        >
          Trang chủ
        </LeaveAwareBreadcrumbLink>
        <LeaveAwareBreadcrumbLink
          to="/mentor/courses"
          onNavigate={requestLeave}
          sx={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}
        >
          Khóa học của tôi
        </LeaveAwareBreadcrumbLink>
        <Typography sx={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>
          Tạo khóa học
        </Typography>
      </Breadcrumbs>

      <MentorCourseCreateStepIndicator currentStep={1} />

      <MentorCourseCreateForm
        //   STATE form = MENTOR_COURSE_FORM_INITIAL = {
        //   CourseName: '',
        //   Description: '',
        //   CategoryId: '',
        //   LevelId: '',
        //   Thumbnail: '',
        //   IsPublished: false,
        // };
        form={form}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        disabled={submitting}
        categoryOptions={categoryOptions}
        levelOptions={levelOptions}
        optionsLoading={optionsLoading}
        footer={formFooter}
      />
      {/* Modal appear when click Cancel (Create Course Process) */}
      <MentorCourseLeaveDialog
        open={dialogOpen}
        onStay={handleStay}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraft}
        saving={saving}
      />
    </Box>
  );
}
