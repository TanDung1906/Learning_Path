import { formatAccountDate } from '@/features/admin/utils/adminAccountUtils';
import {
  ADMIN_CATALOG_FORM_STATUS_OPTIONS,
} from '@/features/admin/data/adminCatalogConstants';
import { createCatalogListParams } from '@/features/admin/utils/adminCatalogListParams';

export const ADMIN_LEVEL_TABLE_GRID_COLUMNS =
  'minmax(180px, 1.2fr) minmax(110px, 0.65fr) minmax(100px, 0.55fr) minmax(48px, auto)';

export const ADMIN_LEVEL_TABLE_HEADERS = [
  'Tên hiển thị',
  'Trạng thái',
  'Ngày tạo',
  'Hành động',
];

export const levelListParams = createCatalogListParams({
  q: '',
  status: 'all',
  sort: 'newest',
  page: 1,
});

export const ADMIN_LEVEL_LIST_DEFAULTS = levelListParams.DEFAULTS;
export const ADMIN_LEVEL_LIST_PAGE_SIZE = levelListParams.PAGE_SIZE;
export const parseAdminLevelListParams = levelListParams.parse.bind(levelListParams);
export const buildAdminLevelListSearchParams = levelListParams.build.bind(levelListParams);
export const resetAdminLevelListParams = levelListParams.reset.bind(levelListParams);
export const hasActiveAdminLevelFilters = levelListParams.hasActiveFilters.bind(levelListParams);
export const buildAdminLevelActiveChips = levelListParams.buildActiveChips.bind(levelListParams);
export const paginateLevels = levelListParams.paginate.bind(levelListParams);

import { resolveSeedColorCode } from '@/shared/catalog/catalogColorPalette';

export function normalizeLevel(raw = {}) {
  const id = raw.id;
  return {
    id,
    levelName: raw.levelName ?? '',
    displayName: raw.displayName ?? '',
    sortOrder: Number(raw.sortOrder) || 0,
    colorCode: raw.colorCode ?? resolveSeedColorCode('level', id) ?? null,
    status: raw.status ?? 'ACTIVE',
    createdAt: raw.createdAt ?? null,
  };
}

export function filterAndSortLevels(levels = [], query = {}) {
  const { q = '', status = 'all', sort = 'newest' } = query;
  const keyword = q.trim().toLowerCase();

  let result = levels.filter((item) => {
    if (status !== 'all' && item.status !== status) return false;
    if (keyword && !item.displayName?.toLowerCase().includes(keyword)) return false;
    return true;
  });

  result = [...result].sort((a, b) => {
    if (sort === 'name_asc') {
      return a.displayName.localeCompare(b.displayName, 'vi');
    }
    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
  });

  return result;
}

function normalizeDisplayName(value = '') {
  return String(value).trim().toLowerCase();
}

export function validateLevelForm(values = {}, { existingNames = [] } = {}) {
  const errors = {};
  const displayName = String(values.displayName ?? '').trim();
  const status = values.status;

  if (!displayName) {
    errors.displayName = 'Vui lòng nhập tên hiển thị';
  } else if (existingNames.includes(normalizeDisplayName(displayName))) {
    errors.displayName = 'Tên trình độ đã tồn tại';
  }
  if (!status) errors.status = 'Vui lòng chọn trạng thái';

  return errors;
}

export function hasLevelFormErrors(errors = {}) {
  return Object.keys(errors).length > 0;
}

export function formatLevelDate(value) {
  return formatAccountDate(value);
}

export { ADMIN_CATALOG_FORM_STATUS_OPTIONS as ADMIN_LEVEL_FORM_STATUS_OPTIONS };
