export const ADMIN_CATALOG_LIST_PAGE_SIZE = 10;

export const ADMIN_CATALOG_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
];

export const ADMIN_CATALOG_FORM_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
];

export const ADMIN_CATALOG_STATUS_LABELS = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngừng hoạt động',
};

export const ADMIN_CATALOG_STATUS_CHIP_SX = {
  ACTIVE: {
    bgcolor: 'rgba(4,120,87,0.12)',
    color: '#047857',
    border: '1px solid rgba(4,120,87,0.24)',
  },
  INACTIVE: {
    bgcolor: 'rgba(100,116,139,0.12)',
    color: '#64748B',
    border: '1px solid rgba(100,116,139,0.24)',
  },
};

export const ADMIN_CATEGORY_SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'name_asc', label: 'Tên A-Z' },
];

export const ADMIN_LEVEL_SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'name_asc', label: 'Tên A-Z' },
];
