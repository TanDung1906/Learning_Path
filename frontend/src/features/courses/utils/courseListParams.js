export const COURSE_LIST_DEFAULTS = {
  categories: [],
  levels: [],
  statuses: [],
  sort: "newest",
  page: 1,
  keyword: "",
};

export const COURSE_LIST_PARAM_KEYS = [
  "keyword",
  "category",
  "level",
  "status",
  "sort",
  "page",
];

/** Query param lưu URL đầy đủ trang danh sách khóa học (pathname + search) */
export const COURSE_FROM_PARAM = "from";

function isCourseListPath(path) {
  return path === "/courses" || path === "/my-courses";
}

function resolveFromUrl(searchParams) {
  const from = searchParams.get(COURSE_FROM_PARAM);
  if (!from || !from.startsWith("/")) return null;
  const pathOnly = from.split("?")[0];
  if (!isCourseListPath(pathOnly)) return null;
  return from;
}

function appendListParamsToDetail(params, searchParams) {
  const filters = parseCourseListParams(searchParams);
  const listParams = buildCourseListSearchParams(filters, new URLSearchParams());
  listParams.forEach((value, key) => {
    params.append(key, value);
  });
}

/** Đường dẫn /courses — ưu tiên param `from` nếu có */
export function buildCourseListPath(searchParams) {
  const from = resolveFromUrl(searchParams);
  if (from) return from;

  const filters = parseCourseListParams(searchParams);
  const params = buildCourseListSearchParams(filters, new URLSearchParams());
  const qs = params.toString();
  return qs ? `/courses?${qs}` : "/courses";
}

/**
 * Đường dẫn /courses/:id
 * - Giữ bộ lọc list trong query
 * - Thêm `from` = URL đầy đủ trang list nếu truyền fromUrl
 */
export function buildCourseDetailPath(courseId, searchParams, fromUrl) {
  const params = new URLSearchParams();

  appendListParamsToDetail(params, searchParams);

  const resolvedFrom =
    fromUrl && isCourseListPath(fromUrl.split("?")[0])
      ? fromUrl
      : resolveFromUrl(searchParams);

  if (resolvedFrom) {
    params.set(COURSE_FROM_PARAM, resolvedFrom);
  }

  const qs = params.toString();
  const base = `/courses/${courseId}`;
  return qs ? `${base}?${qs}` : base;
}

const VALID_STATUSES = new Set(["enrolled", "not_enrolled"]);
const VALID_SORT = new Set(["newest", "popular", "progress"]);

function parsePage(value) {
  const page = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parseMultiValues(searchParams, key, validSet) {
  const fromAll = searchParams
    .getAll(key)
    .map((value) => value.trim())
    .filter((value) => validSet ? validSet.has(value) : value !== "");

  if (fromAll.length > 0) {
    return [...new Set(fromAll)];
  }

  const single = searchParams.get(key);
  if (single && single !== "all" && (validSet ? validSet.has(single) : true)) {
    return [single];
  }

  return [];
}

export function parseCourseListParams(searchParams) {
  const sort = searchParams.get("sort");
  return {
    categories: parseMultiValues(searchParams, "category", null),
    levels: parseMultiValues(searchParams, "level", null),
    statuses: parseMultiValues(searchParams, "status", VALID_STATUSES).slice(0, 1),
    sort: VALID_SORT.has(sort) ? sort : COURSE_LIST_DEFAULTS.sort,
    page: parsePage(searchParams.get("page")),
    keyword: (searchParams.get("keyword") ?? "").trim(),
  };
}

export function hasActiveCourseFilters(filters) {
  return (
    Boolean(filters.keyword) ||
    filters.categories.length > 0 ||
    filters.levels.length > 0 ||
    filters.statuses.length > 0 ||
    filters.sort !== COURSE_LIST_DEFAULTS.sort ||
    filters.page !== COURSE_LIST_DEFAULTS.page
  );
}

export function buildCourseListSearchParams(filters, currentSearchParams) {
  const params = new URLSearchParams(currentSearchParams);
  COURSE_LIST_PARAM_KEYS.forEach((key) => params.delete(key));

  const normalized = {
    ...COURSE_LIST_DEFAULTS,
    ...filters,
    categories: [...new Set(filters.categories ?? [])].filter((value) => value !== ""),
    levels: [...new Set(filters.levels ?? [])].filter((value) => value !== ""),
    statuses: [...new Set(filters.statuses ?? [])]
      .filter((value) => VALID_STATUSES.has(value))
      .slice(0, 1),
    keyword: (filters.keyword ?? "").trim(),
    page: parsePage(String(filters.page ?? 1)),
    sort: VALID_SORT.has(filters.sort) ? filters.sort : COURSE_LIST_DEFAULTS.sort,
  };

  if (normalized.keyword) params.set("keyword", normalized.keyword);
  normalized.categories.forEach((value) => params.append("category", value));
  normalized.levels.forEach((value) => params.append("level", value));
  normalized.statuses.forEach((value) => params.append("status", value));
  if (normalized.sort !== COURSE_LIST_DEFAULTS.sort) {
    params.set("sort", normalized.sort);
  }
  if (normalized.page !== COURSE_LIST_DEFAULTS.page) {
    params.set("page", String(normalized.page));
  }

  return params;
}

export function resetCourseListParams(currentSearchParams) {
  const params = new URLSearchParams(currentSearchParams);
  COURSE_LIST_PARAM_KEYS.forEach((key) => params.delete(key));
  return params;
}

export const STATUS_FILTER_LABELS = {
  enrolled: "Đã đăng ký",
  not_enrolled: "Chưa đăng ký",
};

export const MY_COURSE_STATUS_LABELS = {
  learning: "Đang học",
  completed: "Hoàn thành",
  not_started: "Chưa bắt đầu",
};

export function hasActiveFilterSelections(filters) {
  return (
    Boolean(filters.keyword) ||
    filters.categories.length > 0 ||
    filters.levels.length > 0 ||
    filters.statuses.length > 0
  );
}

export function buildActiveFilterChips(filters, statusLabels = STATUS_FILTER_LABELS, categoriesList = [], levelsList = []) {
  const chips = [];

  if (filters.keyword) {
    chips.push({
      key: `keyword:${filters.keyword}`,
      type: "keyword",
      value: filters.keyword,
      label: filters.keyword,
    });
  }

  filters.categories.forEach((value) => {
    const matchedCategory = categoriesList.find((cat) => String(cat.value) === String(value));
    const categoryName = matchedCategory ? matchedCategory.label : value;
    chips.push({
      key: `category:${value}`,
      type: "category",
      value,
      // Temporarily use ID or generic label. CourseListPage or a context can provide the real display name if needed.
      label: `Danh mục: ${categoryName}`,
    });
  });

  filters.levels.forEach((value) => {
    const matchedLevel = levelsList.find((lvl) => String(lvl.value) === String(value));
    const levelName = matchedLevel ? matchedLevel.label : value;
    chips.push({
      key: `level:${value}`,
      type: "level",
      value,
      label: `Trình độ: ${levelName}`,
    });
  });

  filters.statuses.forEach((value) => {
    chips.push({
      key: `status:${value}`,
      type: "status",
      value,
      label: statusLabels[value] ?? value,
    });
  });

  return chips;
}
