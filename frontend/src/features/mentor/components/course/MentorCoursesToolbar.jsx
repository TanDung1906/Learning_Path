import { useEffect, useMemo, useState } from 'react';
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
} from '@mui/material';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { mentorCourseFilterOptionsMock } from '@/features/mentor/data/mentorCoursesMock';
import { MENTOR_COURSE_LIST_DEFAULTS } from '@/features/mentor/utils/mentorCourseListParams';
import {
  fetchCourseCategories,
  fetchCourseLevels
} from '../../services/mentorCourseService'
const MUTED = '#64748B';
const ICON = '#94A3B8';

function getMenuPaperSx(theme) {
  return {
    mt: 0.75,
    borderRadius: '12px',
    boxShadow: theme.ios18?.shadow?.md,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    overflow: 'hidden',
    minWidth: 168,
  };
}
//-----Trigger Filter-------------
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
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        minWidth: 118,
        maxWidth: 180,
        height: 34,
        px: 1.25,
        pr: 0.75,
        border: `1px solid ${hasValue
          ? alpha(theme.palette.primary.main, 0.22)
          : alpha(theme.palette.primary.main, 0.1)
          }`,
        borderRadius: theme.ios18?.radius?.pill ?? 9999,
        bgcolor: alpha(theme.palette.primary.main, 0.04),
        color: hasValue ? theme.palette.text.primary : MUTED,
        fontSize: 13,
        fontWeight: hasValue ? 600 : 500,
        lineHeight: '20px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: `all 0.2s ${theme.ios18?.transition}`,
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.06),
          borderColor: alpha(theme.palette.primary.main, 0.22),
        },
        ...(open && {
          bgcolor: '#fff',
          borderColor: theme.palette.primary.main,
        }),
      }}
    >
      <Icon sx={{ fontSize: 15, color: iconColor, flexShrink: 0 }} />
      <Typography
        component="span"
        noWrap
        sx={{ flex: 1, fontSize: 13, fontWeight: 'inherit', color: 'inherit', textAlign: 'left' }}
      >
        {label}
      </Typography>
      <KeyboardArrowDownRoundedIcon
        sx={{
          fontSize: 18,
          color: ICON,
          flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s ease',
        }}
      />
    </Box>
  );
}
//----Menu Filter-----------------
function FilterMenu({ anchorEl, open, onClose, options, value, onSelect }) {
  const theme = useTheme();
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: { sx: getMenuPaperSx(theme) },
        list: { dense: true, sx: { py: 0.5 } },
      }}
    >
      {options.map((option) => {
        const selected = String(option.value) === String(value);
        return (
          <MenuItem
            key={option.value}
            selected={selected}
            onClick={() => { onSelect(option.value); onClose(); }}
            sx={{
              borderRadius: '8px',
              mx: 0.5,
              my: 0.25,
              minHeight: 34,
              py: 0.5,
              px: 1.25,
              fontSize: 13,
              fontWeight: selected ? 600 : 500,
              color: selected ? theme.palette.primary.main : theme.palette.text.primary,
              bgcolor: selected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
              },
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.06) },
            }}
          >
            <Typography component="span" sx={{ flex: 1, fontSize: 13, fontWeight: 'inherit' }}>
              {option.label}
            </Typography>
            {selected ? (
              <CheckRoundedIcon sx={{ fontSize: 16, color: 'primary.main', ml: 1 }} />
            ) : (
              <Box sx={{ width: 16, ml: 1, flexShrink: 0 }} />
            )}
          </MenuItem>
        );
      })}
    </Menu>
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
        borderRadius: '99px',
        bgcolor: 'rgba(8,145,178,0.08)',
        color: '#0891B2',
        border: '1px solid rgba(8,145,178,0.16)',
        '& .MuiChip-deleteIcon': {
          fontSize: 15,
          color: '#94A3B8',
          '&:hover': { color: '#0891B2' },
        },
      }}
    />
  );
}

export default function MentorCoursesToolbar({
  keyword = '',
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  levelFilter,
  onLevelChange,
  sortBy,
  onSortChange,
  totalCount = 0,
  showReset = false,
  onReset,
  onRemoveFilterChip,
  statusOptions = mentorCourseFilterOptionsMock.statusOptions,
  sortOptions = mentorCourseFilterOptionsMock.sortOptions,
}) {
  const theme = useTheme();
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [levelAnchor, setLevelAnchor] = useState(null);
  const [sortAnchor, setSortAnchor] = useState(null);

  const [categoryOptions, setCategoryOptions] = useState([
    { value: 'all', label: 'Tất cả danh mục' },
  ]);

  const [levelOptions, setLevelOptions] = useState([
    { value: 'all', label: 'Tất cả Level' }
  ])


  useEffect(() => {
    const getData = async () => {
      try {
        //Category
        const cate = await fetchCourseCategories();

        const categories = cate.categories.map((category) => ({
          value: String(category.value),
          label: category.label,
        }));

        setCategoryOptions([
          { value: 'all', label: 'Tất cả danh mục' },
          ...categories,
        ]);
        //---------------
        //Level
        const level = await fetchCourseLevels();

        const rs = level.levels.map((lv) => ({
          value: String(lv.value),
          label: lv.label,
        }));

        setLevelOptions([
          { value: 'all', label: 'Tất cả Levels' },
          ...rs,
        ])

      } catch (error) {
        console.error(error.message);
      }
    };
    getData();
  }, []);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (keyword.trim()) {
      chips.push({
        key: `q:${keyword}`,
        type: 'q',
        label: `"${keyword.trim()}"`,
      });
    }

    if (statusFilter !== MENTOR_COURSE_LIST_DEFAULTS.status) {
      const selectedStatus = statusOptions.find(
        (option) => String(option.value) === String(statusFilter)
      );
      chips.push({
        key: 'status',
        type: 'status',
        label: selectedStatus?.label ?? statusFilter,
      });
    }

    if (categoryFilter !== MENTOR_COURSE_LIST_DEFAULTS.category) {
      const selectedCategory = categoryOptions.find(
        (option) => String(option.value) === String(categoryFilter)
      );
      chips.push({
        key: 'category',
        type: 'category',
        label: selectedCategory?.label ?? categoryFilter,
      });
    }

    if (levelFilter !== MENTOR_COURSE_LIST_DEFAULTS.level) {
      const selectedLevel = levelOptions.find(
        (option) => String(option.value) === String(levelFilter)
      );
      chips.push({
        key: 'level',
        type: 'level',
        label: selectedLevel?.label ?? levelFilter,
      });
    }

    if (sortBy !== MENTOR_COURSE_LIST_DEFAULTS.sort) {
      const selectedSort = sortOptions.find((option) => option.value === sortBy);
      chips.push({
        key: 'sort',
        type: 'sort',
        label: selectedSort?.label ?? sortBy,
      });
    }

    return chips;
  }, [
    keyword,
    statusFilter,
    categoryFilter,
    levelFilter,
    sortBy,
    statusOptions,
    categoryOptions,
    levelOptions,
    sortOptions,
  ]);

  const statusLabel = statusOptions.find((o) => o.value === statusFilter)?.label ?? 'Trạng thái';
  const categoryLabel = categoryOptions.find((o) => o.value === categoryFilter)?.label ?? 'Danh mục';
  const levelLabel = levelOptions.find((o) => o.value === levelFilter)?.label ?? 'Trình độ';
  const sortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? 'Sắp xếp';


  return (
    <Box
      sx={{
        mb: 3,
        pb: activeFilterChips.length ? 1.5 : 2,
        borderBottom: '1px solid rgba(15,23,42,0.08)',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, flex: 1, minWidth: 0 }}>
          {/* COURSES'S STATUS (ISPUBLISHED) */}
          <FilterTrigger
            icon={FactCheckOutlinedIcon}
            label={statusLabel}
            hasValue={statusFilter !== 'all'}
            open={Boolean(statusAnchor)}
            onClick={(e) => setStatusAnchor(e.currentTarget)}
            iconColor="#047857"
          />
          {/* COURSE'S CATEGORY */}
          <FilterTrigger
            icon={CategoryOutlinedIcon}
            label={categoryLabel}
            hasValue={categoryFilter !== 'all'}
            open={Boolean(categoryAnchor)}
            onClick={(e) => setCategoryAnchor(e.currentTarget)}
            iconColor="#EA580C"
          />
          {/* COURES'S LEVEL */}
          <FilterTrigger
            icon={SchoolOutlinedIcon}
            label={levelLabel}
            hasValue={levelFilter !== 'all'}
            open={Boolean(levelAnchor)}
            onClick={(e) => setLevelAnchor(e.currentTarget)}
            iconColor="#2563EB"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.5 }}>
            <MenuBookOutlinedIcon sx={{ fontSize: 14, color: '#0891B2' }} />
            <Typography
              variant="caption"
              sx={{ color: MUTED, fontWeight: 500, whiteSpace: 'nowrap', fontSize: 12 }}
            >
              {totalCount} khóa học
            </Typography>
          </Box>
          <FilterTrigger
            icon={SortOutlinedIcon}
            label={sortLabel}
            hasValue={sortBy !== MENTOR_COURSE_LIST_DEFAULTS.sort}
            open={Boolean(sortAnchor)}
            onClick={(e) => setSortAnchor(e.currentTarget)}
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
                  '&:hover': {
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

      {/* Status (Drafted or IsPUblished) */}
      <FilterMenu
        anchorEl={statusAnchor}
        open={Boolean(statusAnchor)}
        onClose={() => setStatusAnchor(null)}
        options={statusOptions}
        value={statusFilter}
        onSelect={onStatusChange}
      />
      {/* Category */}
      <FilterMenu
        anchorEl={categoryAnchor}
        open={Boolean(categoryAnchor)}
        onClose={() => setCategoryAnchor(null)}
        options={categoryOptions}
        value={categoryFilter}
        onSelect={onCategoryChange}
      />
      {/* Level */}
      <FilterMenu
        anchorEl={levelAnchor}
        open={Boolean(levelAnchor)}
        onClose={() => setLevelAnchor(null)}
        options={levelOptions}
        value={levelFilter}
        onSelect={onLevelChange}
      />
      {/* Sort */}
      <FilterMenu
        anchorEl={sortAnchor}
        open={Boolean(sortAnchor)}
        onClose={() => setSortAnchor(null)}
        options={sortOptions}
        value={sortBy}
        onSelect={onSortChange}
      />

      {activeFilterChips.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.625, mt: 1 }}>
          {activeFilterChips.map((chip) => (
            <ActiveFilterChip
              key={chip.key}
              label={chip.label}
              onDelete={() => onRemoveFilterChip?.(chip)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
