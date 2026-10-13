import { formatAccountDate } from '@/features/admin/utils/adminAccountUtils';
import {
  ADMIN_CATALOG_FORM_STATUS_OPTIONS,
} from '@/features/admin/data/adminCatalogConstants';
import { createCatalogListParams } from '@/features/admin/utils/adminCatalogListParams';

export const ADMIN_CATEGORY_TABLE_GRID_COLUMNS =
  'minmax(180px, 1.2fr) minmax(110px, 0.65fr) minmax(100px, 0.55fr) minmax(48px, auto)';

export const ADMIN_CATEGORY_TABLE_HEADERS = [
  'Tên hiển thị',
  'Trạng thái',
  'Ngày tạo',
  'Hành động',
];

export const categoryListParams = createCatalogListParams({
  q: '',
  status: 'all',
  sort: 'newest',
  page: 1,
});

export const ADMIN_CATEGORY_LIST_DEFAULTS = categoryListParams.DEFAULTS;
export const ADMIN_CATEGORY_LIST_PAGE_SIZE = categoryListParams.PAGE_SIZE;
export const parseAdminCategoryListParams = categoryListParams.parse.bind(categoryListParams);
export const buildAdminCategoryListSearchParams = categoryListParams.build.bind(categoryListParams);
export const resetAdminCategoryListParams = categoryListParams.reset.bind(categoryListParams);
export const hasActiveAdminCategoryFilters = categoryListParams.hasActiveFilters.bind(categoryListParams);
export const buildAdminCategoryActiveChips = categoryListParams.buildActiveChips.bind(categoryListParams);
export const paginateCategories = categoryListParams.paginate.bind(categoryListParams);

import { resolveSeedColorCode } from '@/shared/catalog/catalogColorPalette';

export function normalizeCategory(raw = {}) {
  const id = raw.id;
  return {
    id,
    categoryName: raw.categoryName ?? '',
    displayName: raw.displayName ?? '',
    colorCode: raw.colorCode ?? resolveSeedColorCode('category', id) ?? null,
    status: raw.status ?? 'ACTIVE',
    createdAt: raw.createdAt ?? null,
  };
}

export function filterAndSortCategories(categories = [], query = {}) {
  const { q = '', status = 'all', sort = 'newest' } = query;
  const keyword = q.trim().toLowerCase();

  let result = categories.filter((item) => {
    if (status !== 'all' && item.status !== status) return false;
    if (keyword && !item.displayName?.toLowerCase().includes(keyword)) return false;
    return true;
  });

  result = [...result].sort((a, b) => {
    if (sort === 'name_asc') {
      return a.displayName.localeCompare(b.displayName, 'vi');
    }
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();
    return dateB - dateA;
  });

  return result;
}

function normalizeDisplayName(value = '') {
  return String(value).trim().toLowerCase();
}

export function validateCategoryForm(values = {}, { existingNames = [] } = {}) {
  const errors = {};
  const displayName = String(values.displayName ?? '').trim();
  const status = values.status;

  if (!displayName) {
    errors.displayName = 'Vui lòng nhập tên hiển thị';
  } else if (existingNames.includes(normalizeDisplayName(displayName))) {
    errors.displayName = 'Tên danh mục đã tồn tại';
  }
  if (!status) errors.status = 'Vui lòng chọn trạng thái';

  return errors;
}

export function hasCategoryFormErrors(errors = {}) {
  return Object.keys(errors).length > 0;
}

export function formatCategoryDate(value) {
  return formatAccountDate(value);
}

export { ADMIN_CATALOG_FORM_STATUS_OPTIONS as ADMIN_CATEGORY_FORM_STATUS_OPTIONS };
