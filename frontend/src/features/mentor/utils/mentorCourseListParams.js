export const MENTOR_COURSE_LIST_DEFAULTS = {
  q: '',
  status: 'all',
  category: 'all',
  level: 'all',
  sort: 'updated_desc',
  page: 1,
  pageSize: 8,
};

export const MENTOR_COURSE_LIST_PARAM_KEYS = [
  'q',
  'status',
  'category',
  'level',
  'sort',
  'page',
  'pageSize',
];

const VALID_STATUS = new Set(['all', 'published', 'draft']);
const VALID_SORT = new Set([
  'updated_desc',
  'created_desc',
  'students_desc',
  'rating_desc',
  'name_asc',
]);
function parsePage(value) {
  const page = Number.parseInt(value ?? '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parsePageSize(value) {
  const pageSize = Number.parseInt(
    value ?? String(MENTOR_COURSE_LIST_DEFAULTS.pageSize),
    10
  );
  return Number.isFinite(pageSize) && pageSize >= 1 ? pageSize : MENTOR_COURSE_LIST_DEFAULTS.pageSize;
}

export function parseMentorCourseListParams(searchParams) {
  const status = searchParams.get('status') ?? MENTOR_COURSE_LIST_DEFAULTS.status;
  const sort = searchParams.get('sort') ?? MENTOR_COURSE_LIST_DEFAULTS.sort;

  return {
    q: (searchParams.get('q') ?? '').trim(),
    status: VALID_STATUS.has(status) ? status : MENTOR_COURSE_LIST_DEFAULTS.status,
    category: searchParams.get('category') ?? MENTOR_COURSE_LIST_DEFAULTS.category,
    level: searchParams.get('level') ?? MENTOR_COURSE_LIST_DEFAULTS.level,
    sort: VALID_SORT.has(sort) ? sort : MENTOR_COURSE_LIST_DEFAULTS.sort,
    page: parsePage(searchParams.get('page')),
    pageSize: parsePageSize(searchParams.get('pageSize')),
  };
}

export function hasActiveMentorCourseFilters(filters) {
  return (
    Boolean(filters.q) ||
    filters.status !== MENTOR_COURSE_LIST_DEFAULTS.status ||
    filters.category !== MENTOR_COURSE_LIST_DEFAULTS.category ||
    filters.level !== MENTOR_COURSE_LIST_DEFAULTS.level ||
    filters.sort !== MENTOR_COURSE_LIST_DEFAULTS.sort ||
    filters.page !== MENTOR_COURSE_LIST_DEFAULTS.page
  );
}

export function buildMentorCourseListSearchParams(filters, currentSearchParams) {
  const params = new URLSearchParams(currentSearchParams);
  MENTOR_COURSE_LIST_PARAM_KEYS.forEach((key) => params.delete(key));

  const normalized = {
    ...MENTOR_COURSE_LIST_DEFAULTS,
    ...filters,
    q: (filters.q ?? '').trim(),
    page: parsePage(String(filters.page ?? 1)),
    pageSize: parsePageSize(String(filters.pageSize ?? MENTOR_COURSE_LIST_DEFAULTS.pageSize)),
    status: VALID_STATUS.has(filters.status)
      ? filters.status
      : MENTOR_COURSE_LIST_DEFAULTS.status,
    sort: VALID_SORT.has(filters.sort) ? filters.sort : MENTOR_COURSE_LIST_DEFAULTS.sort,
    category: filters.category ?? MENTOR_COURSE_LIST_DEFAULTS.category,
    level: filters.level ?? MENTOR_COURSE_LIST_DEFAULTS.level,
  };

  if (normalized.q) params.set('q', normalized.q);
  if (normalized.status !== MENTOR_COURSE_LIST_DEFAULTS.status) {
    params.set('status', normalized.status);
  }
  if (normalized.category !== MENTOR_COURSE_LIST_DEFAULTS.category) {
    params.set('category', normalized.category);
  }
  if (normalized.level !== MENTOR_COURSE_LIST_DEFAULTS.level) {
    params.set('level', normalized.level);
  }
  if (normalized.sort !== MENTOR_COURSE_LIST_DEFAULTS.sort) {
    params.set('sort', normalized.sort);
  }
  if (normalized.page !== MENTOR_COURSE_LIST_DEFAULTS.page) {
    params.set('page', String(normalized.page));
  }
  if (normalized.pageSize !== MENTOR_COURSE_LIST_DEFAULTS.pageSize) {
    params.set('pageSize', String(normalized.pageSize));
  }

  return params;
}

export function resetMentorCourseListParams(currentSearchParams) {
  const params = new URLSearchParams(currentSearchParams);
  MENTOR_COURSE_LIST_PARAM_KEYS.forEach((key) => params.delete(key));
  return params;
}

/**
 * Build dismissible chips from active filter state.
 * Each chip: { key, type, value, label }
 */
export function buildMentorCourseActiveChips(filters, options = {}) {
  const {
    statusOptions = [],
    categoryOptions = [],
    levelOptions = [],
    sortOptions = [],
  } = options;

  const chips = [];

  if (filters.q) {
    chips.push({
      key: `q:${filters.q}`,
      type: 'q',
      value: filters.q,
      label: `"${filters.q}"`,
    });
  }

  if (filters.status && filters.status !== MENTOR_COURSE_LIST_DEFAULTS.status) {
    chips.push({
      key: `status:${filters.status}`,
      type: 'status',
      value: filters.status,
      label: statusOptions.find((o) => o.value === filters.status)?.label ?? filters.status,
    });
  }

  if (filters.category && filters.category !== MENTOR_COURSE_LIST_DEFAULTS.category) {
    chips.push({
      key: `category:${filters.category}`,
      type: 'category',
      value: filters.category,
      label: categoryOptions.find((o) => String(o.value) === String(filters.category))?.label ?? filters.category,
    });
  }

  if (filters.level && filters.level !== MENTOR_COURSE_LIST_DEFAULTS.level) {
    chips.push({
      key: `level:${filters.level}`,
      type: 'level',
      value: filters.level,
      label: levelOptions.find((o) => String(o.value) === String(filters.level))?.label ?? filters.level,
    });
  }

  if (filters.sort && filters.sort !== MENTOR_COURSE_LIST_DEFAULTS.sort) {
    chips.push({
      key: `sort:${filters.sort}`,
      type: 'sort',
      value: filters.sort,
      label: sortOptions.find((o) => o.value === filters.sort)?.label ?? filters.sort,
    });
  }

  return chips;
}
