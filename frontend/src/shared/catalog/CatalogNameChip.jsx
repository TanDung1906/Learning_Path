import { Chip } from '@mui/material';
import { resolveCategoryChipSx, resolveLevelChipSx } from '@/shared/catalog/catalogRegistry';

export const CATALOG_NAME_CHIP_SX = {
  borderRadius: '999px',
  height: 24,
  fontSize: 12,
  fontWeight: 700,
  '& .MuiChip-label': { px: 1.2, fontWeight: 700 },
};

export function CategoryNameChip({ label, id, colorCode, sx = {} }) {
  const chipSx = resolveCategoryChipSx({ id, displayName: label, colorCode });
  return (
    <Chip
      size="small"
      label={label}
      sx={{ ...CATALOG_NAME_CHIP_SX, ...chipSx, ...sx }}
    />
  );
}

export function LevelNameChip({ label, id, colorCode, sx = {} }) {
  const chipSx = resolveLevelChipSx({ id, displayName: label, colorCode });
  return (
    <Chip
      size="small"
      label={label}
      sx={{ ...CATALOG_NAME_CHIP_SX, ...chipSx, ...sx }}
    />
  );
}
