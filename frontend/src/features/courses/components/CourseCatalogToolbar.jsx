import { useState } from "react";
import {
  alpha,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const MUTED = "#64748B";
const ICON = "#94A3B8";

function getMenuPaperSx(theme) {
  return {
    mt: 0.75,
    borderRadius: "12px",
    boxShadow: theme.ios18?.shadow?.md,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    overflow: "hidden",
    minWidth: 168,
  };
}

function FilterTrigger({ icon: Icon, label, hasValue, onClick, open, iconColor = ICON }) {
  const theme = useTheme();

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-haspopup="listbox"
      aria-expanded={open}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        minWidth: 118,
        maxWidth: 156,
        height: 34,
        px: 1.25,
        pr: 0.75,
        border: `1px solid ${
          hasValue
            ? alpha(theme.palette.primary.main, 0.22)
            : alpha(theme.palette.primary.main, 0.1)
        }`,
        borderRadius: theme.ios18?.radius?.pill ?? 9999,
        bgcolor: alpha(theme.palette.primary.main, 0.04),
        color: hasValue ? theme.palette.text.primary : MUTED,
        fontSize: 13,
        fontWeight: hasValue ? 600 : 500,
        lineHeight: "20px",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: `all 0.2s ${theme.ios18?.transition}`,
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.06),
          borderColor: alpha(theme.palette.primary.main, 0.22),
        },
        ...(open && {
          bgcolor: "#fff",
          borderColor: theme.palette.primary.main,
        }),
      }}
    >
      <Icon sx={{ fontSize: 15, color: iconColor, flexShrink: 0 }} />
      <Typography
        component="span"
        noWrap
        sx={{ flex: 1, fontSize: 13, fontWeight: "inherit", color: "inherit", textAlign: "left" }}
      >
        {label}
      </Typography>
      <KeyboardArrowDownRoundedIcon
        sx={{
          fontSize: 18,
          color: ICON,
          flexShrink: 0,
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.2s ease",
        }}
      />
    </Box>
  );
}

function FilterMenuItem({ selected, label, onClick }) {
  const theme = useTheme();
  return (
    <MenuItem
      selected={selected}
      onClick={onClick}
      sx={{
        borderRadius: "8px",
        mx: 0.5,
        my: 0.25,
        minHeight: 34,
        py: 0.5,
        px: 1.25,
        fontSize: 13,
        fontWeight: selected ? 600 : 500,
        color: selected ? theme.palette.primary.main : theme.palette.text.primary,
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.08) : "transparent",
        "&.Mui-selected": {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) },
        },
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.06),
        },
      }}
    >
      <Typography component="span" sx={{ flex: 1, fontSize: 13, fontWeight: "inherit" }}>
        {label}
      </Typography>
      {selected ? (
        <CheckRoundedIcon sx={{ fontSize: 16, color: "primary.main", ml: 1 }} />
      ) : (
        <Box sx={{ width: 16, ml: 1, flexShrink: 0 }} />
      )}
    </MenuItem>
  );
}

function CompactMultiSelect({
  icon,
  value = [],
  onChange,
  options,
  placeholder,
  iconColor = ICON,
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const hasValue = value.length > 0;

  let label = placeholder;
  if (value.length === 1) {
    label = options.find((opt) => opt.value === value[0])?.label ?? value[0];
  } else if (value.length > 1) {
    label = `${value.length} mục`;
  }

  const toggleValue = (optionValue) => {
    const next = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];
    onChange({ target: { value: next } });
  };

  return (
    <>
      <FilterTrigger
        icon={icon}
        label={label}
        hasValue={hasValue}
        open={open}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        iconColor={iconColor}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: { sx: getMenuPaperSx(theme) },
          list: { dense: true, sx: { py: 0.5 } },
        }}
      >
        {options.map((opt) => (
          <FilterMenuItem
            key={opt.value}
            selected={value.includes(opt.value)}
            label={opt.label}
            onClick={() => toggleValue(opt.value)}
          />
        ))}
      </Menu>
    </>
  );
}

function CompactSingleSelect({
  icon,
  value = "",
  onChange,
  options,
  placeholder,
  iconColor = ICON,
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const hasValue = Boolean(value);
  const label = hasValue
    ? options.find((opt) => opt.value === value)?.label ?? value
    : placeholder;

  const selectValue = (optionValue) => {
    const next = value === optionValue ? "" : optionValue;
    onChange({ target: { value: next ? [next] : [] } });
    setAnchorEl(null);
  };

  return (
    <>
      <FilterTrigger
        icon={icon}
        label={label}
        hasValue={hasValue}
        open={open}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        iconColor={iconColor}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: { sx: getMenuPaperSx(theme) },
          list: { dense: true, sx: { py: 0.5 } },
        }}
      >
        {options.map((opt) => (
          <FilterMenuItem
            key={opt.value}
            selected={value === opt.value}
            label={opt.label}
            onClick={() => selectValue(opt.value)}
          />
        ))}
      </Menu>
    </>
  );
}

function CompactSelect({ icon, value, onChange, options, iconColor = ICON }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <>
      <FilterTrigger
        icon={icon}
        label={selectedOption?.label ?? options[0]?.label}
        hasValue
        open={open}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        iconColor={iconColor}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: { sx: getMenuPaperSx(theme) },
          list: { dense: true, sx: { py: 0.5 } },
        }}
      >
        {options.map((opt) => (
          <FilterMenuItem
            key={opt.value}
            selected={value === opt.value}
            label={opt.label}
            onClick={() => {
              onChange({ target: { value: opt.value } });
              setAnchorEl(null);
            }}
          />
        ))}
      </Menu>
    </>
  );
}

function ActiveFilterChip({ label, onDelete }) {
  return (
    <Chip
      label={label}
      size="small"
      onDelete={onDelete}
      sx={{
        height: 24,
        fontSize: 11.5,
        fontWeight: 600,
        borderRadius: "99px",
        bgcolor: "rgba(8,145,178,0.08)",
        color: "#0891B2",
        border: "1px solid rgba(8,145,178,0.16)",
        "& .MuiChip-deleteIcon": {
          fontSize: 15,
          color: "#94A3B8",
          "&:hover": { color: "#0891B2" },
        },
      }}
    />
  );
}

export default function CourseCatalogToolbar({
  categories = [],
  onCategoriesChange,
  categoryOptions = [],
  levels = [],
  onLevelsChange,
  levelOptions = [],
  statuses = [],
  onStatusesChange,
  statusOptions = [],
  sortBy,
  onSortChange,
  sortOptions = [],
  totalCount = 0,
  activeFilterChips = [],
  onRemoveFilterChip,
  showReset = false,
  onReset,
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 3,
        pb: activeFilterChips.length ? 1.5 : 2,
        borderBottom: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, flex: 1, minWidth: 0 }}>
          <CompactMultiSelect
            icon={CategoryOutlinedIcon}
            value={categories}
            onChange={onCategoriesChange}
            options={categoryOptions}
            placeholder="Danh mục"
            iconColor="#EA580C"
          />
          <CompactMultiSelect
            icon={SchoolOutlinedIcon}
            value={levels}
            onChange={onLevelsChange}
            options={levelOptions}
            placeholder="Trình độ"
            iconColor="#2563EB"
          />
          <CompactSingleSelect
            icon={FactCheckOutlinedIcon}
            value={statuses[0] ?? ""}
            onChange={onStatusesChange}
            options={statusOptions}
            placeholder="Trạng thái"
            iconColor="#047857"
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 0.5 }}>
            <MenuBookOutlinedIcon sx={{ fontSize: 14, color: "#0891B2" }} />
            <Typography
              variant="caption"
              sx={{ color: MUTED, fontWeight: 500, whiteSpace: "nowrap", fontSize: 12 }}
            >
              {totalCount} khóa học
            </Typography>
          </Box>
          <CompactSelect
            icon={SortOutlinedIcon}
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            iconColor="#7C3AED"
          />
          {showReset ? (
            <Tooltip title="Đặt lại bộ lọc">
              <IconButton
                size="small"
                aria-label="Đặt lại bộ lọc"
                onClick={onReset}
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: theme.ios18?.radius?.pill ?? 9999,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.22)}`,
                  color: theme.palette.error.main,
                  "&:hover": {
                    color: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                    borderColor: alpha(theme.palette.error.main, 0.35),
                  },
                }}
              >
                <RestartAltIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>
      </Box>

      {activeFilterChips.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.625, mt: 1 }}>
          {activeFilterChips.map((chip) => (
            <ActiveFilterChip
              key={chip.key}
              label={chip.label}
              onDelete={() => onRemoveFilterChip?.(chip)}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
