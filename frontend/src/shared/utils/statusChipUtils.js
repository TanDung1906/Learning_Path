import { getCatalogColorChipSx, DEFAULT_CATALOG_CHIP_SX } from "@/shared/catalog/catalogColorPalette";

export function getEnrollmentStatusChip(isEnrolled, progress = 0) {
  if (!isEnrolled) {
    return {
      label: "Chưa đăng ký",
      sx: DEFAULT_CATALOG_CHIP_SX,
    };
  }
  if (progress >= 100) {
    return {
      label: "Hoàn thành",
      sx: getCatalogColorChipSx("emerald"),
    };
  }
  if (progress > 0) {
    return {
      label: "Đang học",
      sx: getCatalogColorChipSx("cyan"),
    };
  }
  return {
    label: "Đã đăng ký",
    sx: getCatalogColorChipSx("lime"),
  };
}

export function getMyCoursesStatusChip(progress = 0) {
  if (progress >= 100) {
    return {
      label: "Hoàn thành",
      sx: getCatalogColorChipSx("emerald"),
    };
  }
  if (progress > 0) {
    return {
      label: "Đang học",
      sx: getCatalogColorChipSx("cyan"),
    };
  }
  return {
    label: "Chưa học",
    sx: DEFAULT_CATALOG_CHIP_SX,
  };
}
