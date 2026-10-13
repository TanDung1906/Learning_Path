/**
 * MentorCoursesPage  ─  Trang danh sách khóa học của Mentor
 *
 * Props: không có (page component, route: /mentor/courses)
 *
 * URL params (useSearchParams):
 *   q        : string  — tìm theo tên khóa học
 *   status   : string  — "all" | "published" | "draft"
 *   category : string
 *   level    : string
 *   sort     : string  — "newest" | "oldest" | "name_asc"
 *   page     : number
 *
 * ── Fetch data ───────────────────────────────────────────────────────────
 *   useEffect: gọi fetchMentorCourses(query) khi mount hoặc filter thay đổi
 *
 *   GET /api/mentor/courses?q=&status=&category=&level=&sort=&page=
 *   Header: x-user-id: "<mentorId>"
 *
 *   Response JSON:
 *   {
 *     success: true,
 *     courses: [
 *       {
 *         courseId, courseName, description, category, level,
 *         thumbnail, isPublished, createdAt, updatedAt,
 *         chapterCount, lessonCount, materialCount,
 *         studentCount, rating
 *       }
 *     ],
 *     total: number
 *   }
 */
import { useEffect, useMemo, useState } from 'react';
import { Box, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AppButton from '@/shared/ui/AppButton';
import MentorCoursesToolbar from '@/features/mentor/components/course/MentorCoursesToolbar';
import MentorCourseList from '@/features/mentor/components/course/MentorCourseList';
import MentorCourseListPagination, {
  MENTOR_COURSE_LIST_PAGE_SIZE,
} from '@/features/mentor/components/course/MentorCourseListPagination';
import { fetchMentorCourses } from '@/features/mentor/services/mentorCourseService';
import {
  filterAndSortMentorCourses,
  paginateMentorCourses,
} from '@/features/mentor/utils/mentorCourseUtils';
import {
  buildMentorCourseListSearchParams,
  hasActiveMentorCourseFilters,
  parseMentorCourseListParams,
  resetMentorCourseListParams,
} from '@/features/mentor/utils/mentorCourseListParams';

const PAGE_SIZE = MENTOR_COURSE_LIST_PAGE_SIZE;

export default function MentorCoursesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL is the single source of truth for all filter/search/sort/pagination state
  const queryState = useMemo(
    () => parseMentorCourseListParams(searchParams),
    [searchParams]
  );

  const showReset = hasActiveMentorCourseFilters(queryState);

  // TODO: replace mock with real API call — fetchMentorCourses(queryState)
  useEffect(() => {
    let isMounted = true;

    const loadMentorCourses = async () => {
      try {
        setLoading(true);

        // console.log("START FETCH MENTOR COURSES");

        const res = await fetchMentorCourses();

        if (!isMounted) return;

        if (!res.ok) {
          console.error(res.message || "Không lấy được khóa học mentor");
          setCourses([]);
          return;
        }

        setCourses(Array.isArray(res.courses) ? res.courses : []);
      } catch (error) {
        console.error("LOAD MENTOR COURSES ERROR:", error);

        if (isMounted) {
          setCourses([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMentorCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateQuery = (patch) => {
    const next = buildMentorCourseListSearchParams(
      { ...queryState, ...patch },
      searchParams
    );
    setSearchParams(next, { replace: true });
  };

  //Filter Courses
  const filteredCourses = useMemo(
    () => filterAndSortMentorCourses(courses, queryState),
    [courses, queryState]
  );

  const pagination = useMemo(
    () => paginateMentorCourses(filteredCourses, queryState.page, PAGE_SIZE),
    [filteredCourses, queryState.page]
  );

  // Auto-correct page if it exceeds totalPages after filtering
  useEffect(() => {
    if (!loading && queryState.page !== pagination.page) {
      updateQuery({ page: pagination.page });
    }
  }, [loading, queryState.page, pagination.page]);

  const handleCreateCourse = () => navigate('/mentor/courses/create');
  const handleStatusChange = (v) => updateQuery({ status: v, page: 1 });
  const handleCategoryChange = (v) => updateQuery({ category: v, page: 1 });
  const handleLevelChange = (v) => updateQuery({ level: v, page: 1 });
  const handleSortChange = (v) => updateQuery({ sort: v, page: 1 });
  const handlePageChange = (page) => {
    updateQuery({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleResetFilters = () =>
    setSearchParams(resetMentorCourseListParams(searchParams), { replace: true });

  const handleRemoveFilterChip = ({ type }) => {
    const defaults = {
      q: '',
      status: 'all',
      category: 'all',
      level: 'all',
      sort: 'updated_desc',
    };
    if (type in defaults) updateQuery({ [type]: defaults[type], page: 1 });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1280, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 2 },
          mb: 2.5,
        }}
      >
        <Breadcrumbs
          separator="/"
          sx={{ '& .MuiBreadcrumbs-separator': { color: '#64748B', mx: 0.5 } }}
        >
          <MuiLink
            component={Link}
            to="/home"
            underline="hover"
            sx={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}
          >
            Trang chủ
          </MuiLink>
          <Typography sx={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>
            Khóa học của tôi
          </Typography>
        </Breadcrumbs>

        <AppButton
          startIcon={<AddRoundedIcon />}
          onClick={handleCreateCourse}
          sx={{
            height: 44,
            px: 2.5,
            fontSize: 14,
            fontWeight: 700,
            borderRadius: '999px',
            bgcolor: '#0891B2',
            color: '#fff',
            flexShrink: 0,
            width: { xs: '100%', sm: 'auto' },
            alignSelf: { xs: 'stretch', sm: 'auto' },
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#0E7490',
              boxShadow: 'none',
            },
          }}
        >
          Tạo khóa học
        </AppButton>
      </Box>

      <MentorCoursesToolbar
        keyword={queryState.q}
        statusFilter={queryState.status}
        onStatusChange={handleStatusChange}
        categoryFilter={queryState.category}
        onCategoryChange={handleCategoryChange}
        levelFilter={queryState.level}
        onLevelChange={handleLevelChange}
        sortBy={queryState.sort}
        onSortChange={handleSortChange}
        totalCount={filteredCourses.length}
        showReset={showReset}
        onReset={handleResetFilters}
        onRemoveFilterChip={handleRemoveFilterChip}
      />

      <MentorCourseList
        courses={pagination.items}
        loading={loading}
        hasAnyCourses={courses.length > 0}
        showReset={showReset}
        onReset={handleResetFilters}
        onCreateCourse={handleCreateCourse}
      />

      {!loading && pagination.totalPages > 1 && (
        <>
          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'center', color: '#64748B', mt: 3, fontSize: 12 }}
          >
            Hiển thị {pagination.rangeStart}–{pagination.rangeEnd} trong tổng số{' '}
            {pagination.totalItems} khóa học
          </Typography>
          <MentorCourseListPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
}
