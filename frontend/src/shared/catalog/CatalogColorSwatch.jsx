import { Box, Typography } from '@mui/material';
import { getCatalogColorChipSx } from '@/shared/catalog/catalogColorPalette';

export default function CatalogColorSwatch({ colorCode, label, size = 14 }) {
  const chipSx = getCatalogColorChipSx(colorCode);
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          bgcolor: chipSx.color,
          boxShadow: `0 0 0 2px ${chipSx.bgcolor}`,
          flexShrink: 0,
        }}
      />
      {label ? (
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: chipSx.color }}>{label}</Typography>
      ) : null}
    </Box>
  );
}
