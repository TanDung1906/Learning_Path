import { adminCategoriesSeed } from '@/features/admin/data/adminCategoriesMock';
import { adminLevelsSeed } from '@/features/admin/data/adminLevelsMock';
import {
  CATALOG_COLOR_PALETTE,
  DEFAULT_CATALOG_CHIP_SX,
  LEGACY_CATEGORY_COLOR_BY_DISPLAY_NAME,
  LEGACY_LEVEL_COLOR_BY_DISPLAY_NAME,
  getCatalogColorChipSx,
  normalizeCatalogLabel,
  resolveSeedColorCode,
} from '@/shared/catalog/catalogColorPalette';

const CATEGORY_STORAGE_KEY = 'admin_categories_v1';
const LEVEL_STORAGE_KEY = 'admin_levels_v1';

function hashString(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Chuẩn hóa cấu trúc dữ liệu của một Danh mục (Category).
 */
function normalizeCategory(raw = {}) {
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

/**
 * Chuẩn hóa cấu trúc dữ liệu của một Trình độ (Level).
 */
function normalizeLevel(raw = {}) {
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

/**
 * Đọc danh sách các Danh mục được lưu trữ trong localStorage.
 */
function loadStoredCategories() {
  try {
    const raw = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeCategory) : null;
  } catch {
    return null;
  }
}

/**
 * Đọc danh sách các Trình độ được lưu trữ trong localStorage.
 */
function loadStoredLevels() {
  try {
    const raw = localStorage.getItem(LEVEL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeLevel) : null;
  } catch {
    return null;
  }
}

/**
 * Lấy toàn bộ danh sách Danh mục (ưu tiên dữ liệu từ localStorage, fallback về mock seed).
 */
export function getCatalogCategories() {
  return loadStoredCategories() ?? adminCategoriesSeed.map(normalizeCategory);
}

/**
 * Lấy toàn bộ danh sách Trình độ (ưu tiên dữ liệu từ localStorage, fallback về mock seed).
 */
export function getCatalogLevels() {
  return loadStoredLevels() ?? adminLevelsSeed.map(normalizeLevel);
}

/**
 * Tìm kiếm một Danh mục dựa trên ID, tên hiển thị hoặc mã màu.
 */
function findCategory({ id, displayName, colorCode } = {}) {
  const categories = getCatalogCategories();
  if (colorCode) {
    const match = categories.find((item) => item.colorCode === colorCode);
    if (match) return match;
  }
  if (id != null && id !== '') {
    const match = categories.find((item) => String(item.id) === String(id));
    if (match) return match;
  }
  if (displayName) {
    const key = normalizeCatalogLabel(displayName);
    return categories.find((item) => normalizeCatalogLabel(item.displayName) === key) ?? null;
  }
  return null;
}

/**
 * Tìm kiếm một Trình độ dựa trên ID, tên hiển thị hoặc mã màu.
 */
function findLevel({ id, displayName, colorCode } = {}) {
  const levels = getCatalogLevels();
  if (colorCode) {
    const match = levels.find((item) => item.colorCode === colorCode);
    if (match) return match;
  }
  if (id != null && id !== '') {
    const match = levels.find((item) => String(item.id) === String(id));
    if (match) return match;
  }
  if (displayName) {
    const key = normalizeCatalogLabel(displayName);
    return levels.find((item) => normalizeCatalogLabel(item.displayName) === key) ?? null;
  }
  return null;
}

/**
 * Tìm kiếm mã màu tương ứng cho Danh mục bằng phương án so khớp chuỗi dự phòng (Legacy).
 */
function resolveLegacyCategoryColor(displayName) {
  if (!displayName) return null;
  const key = normalizeCatalogLabel(displayName);
  if (LEGACY_CATEGORY_COLOR_BY_DISPLAY_NAME[key]) {
    return LEGACY_CATEGORY_COLOR_BY_DISPLAY_NAME[key];
  }
  // Fallback to deterministic hashed color
  const hash = hashString(key);
  return CATALOG_COLOR_PALETTE[hash % CATALOG_COLOR_PALETTE.length].code;
}

/**
 * Tìm kiếm mã màu tương ứng cho Trình độ bằng phương án so khớp chuỗi dự phòng (Legacy).
 * Chứa logic khớp tương đối (includes) nếu không tìm thấy trong từ điển khớp tuyệt đối.
 */
function resolveLegacyLevelColor(displayName) {
  if (!displayName) return null;
  const key = normalizeCatalogLabel(displayName);
  
  // 1. Thử so khớp chính xác tuyệt đối trước
  if (LEGACY_LEVEL_COLOR_BY_DISPLAY_NAME[key]) {
    return LEGACY_LEVEL_COLOR_BY_DISPLAY_NAME[key];
  }
  
  // 2. Nếu không khớp tuyệt đối, tiến hành kiểm tra chứa từ khóa (Khớp tương đối/Fuzzy Match)
  if (key.includes('người mới bắt đầu')) return 'lime';
  if (key.includes('cơ bản') || key.includes('sơ cấp')) return 'sky';
  if (key.includes('trung cấp')) return 'amber';
  if (key.includes('cao cấp') || key.includes('nâng cao')) return 'orange';
  
  // Fallback to deterministic hashed color
  const hash = hashString(key);
  return CATALOG_COLOR_PALETTE[hash % CATALOG_COLOR_PALETTE.length].code;
}

/**
 * Phân tích và quyết định mã màu cuối cùng cho một Danh mục.
 */
export function resolveCategoryColorCode({ id, displayName, colorCode } = {}) {
  if (colorCode) return colorCode;
  const item = findCategory({ id, displayName, colorCode });
  if (item?.colorCode) return item.colorCode;
  return resolveLegacyCategoryColor(displayName);
}

/**
 * Phân tích và quyết định mã màu cuối cùng cho một Trình độ.
 */
export function resolveLevelColorCode({ id, displayName, colorCode } = {}) {
  if (colorCode) return colorCode;
  const item = findLevel({ id, displayName, colorCode });
  if (item?.colorCode) return item.colorCode;
  return resolveLegacyLevelColor(displayName);
}

/**
 * Lấy đối tượng style CSS (sx) cho nhãn Danh mục.
 */
export function resolveCategoryChipSx(input = {}, options = {}) {
  const code = resolveCategoryColorCode(input);
  return code ? getCatalogColorChipSx(code, options) : { ...DEFAULT_CATALOG_CHIP_SX };
}

/**
 * Lấy đối tượng style CSS (sx) cho nhãn Trình độ.
 */
export function resolveLevelChipSx(input = {}, options = {}) {
  const code = resolveLevelColorCode(input);
  return code ? getCatalogColorChipSx(code, options) : { ...DEFAULT_CATALOG_CHIP_SX };
}

/**
 * Tổng hợp toàn bộ siêu dữ liệu màu sắc (gồm thông tin danh mục, mã màu, đối tượng CSS sx) cho Danh mục.
 */
export function getCategoryColorMeta(input = {}) {
  const item = findCategory(input);
  const colorCode = resolveCategoryColorCode(input);
  return {
    item,
    colorCode,
    chipSx: resolveCategoryChipSx(input),
  };
}

/**
 * Tổng hợp toàn bộ siêu dữ liệu màu sắc (gồm thông tin trình độ, mã màu, đối tượng CSS sx) cho Trình độ.
 */
export function getLevelColorMeta(input = {}) {
  const item = findLevel(input);
  const colorCode = resolveLevelColorCode(input);
  return {
    item,
    colorCode,
    chipSx: resolveLevelChipSx(input),
  };
}
