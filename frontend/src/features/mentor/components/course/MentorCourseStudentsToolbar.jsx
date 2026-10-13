import { useMemo, useState } from 'react';
import {
  alpha,
  Box,
  Chip,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import {
  COURSE_STUDENT_SORT_OPTIONS,
  COURSE_STUDENT_STATUS_OPTIONS,
} from '@/features/mentor/data/mentorCourseStudentsMock';
import { MUTED, PRIMARY, TEXT } from './mentorCourseCreateStyles';
import { underlineFieldSx } from '@/shared/ui/UnderlineFieldPopup';

const ICON = '#94A3B8';
const DEFAULT_SORT = 'progress_desc';

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

function UnderlineSearchField({ value, onChange, placeholder }) {
  return (
    <Box
      sx={{
        flex: { xs: '1 1 100%', sm: '1 1 240px' },
        minWidth: { sm: 200 },
        maxWidth: { sm: 360 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          ...underlineFieldSx,
        }}
      >
        <SearchRoundedIcon sx={{ fontSize: 16, color: ICON, flexShrink: 0 }} />
        <InputBase
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          fullWidth
          sx={{
            fontSize: 13.5,
            fontWeight: 600,
            color: TEXT,
            lineHeight: 1.4,
            flex: 1,
            '& .MuiInputBase-input': { p: 0 },
            '& .MuiInputBase-input::placeholder': {
              color: MUTED,
              opacity: 0.7,
              fontWeight: 500,
            },
          }}
        />
        {value ? (
          <Typography
            component="button"
            type="button"
            onClick={() => onChange('')}
            sx={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: 600,
              color: PRIMARY,
              p: 0,
              flexShrink: 0,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Xóa
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}

function UnderlineFilterTrigger({
  ariaLabel,
  icon: Icon,
  value,
  hasValue,
  onClick,
  open,
  iconColor = ICON,
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-haspopup="listbox"
      aria-expanded={open}
      sx={{
        border: 'none',
        bgcolor: 'transparent',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        p: 0,
        minWidth: 130,
        maxWidth: 190,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          pb: '4px',
          borderBottom: `1px solid ${
            open || hasValue ? PRIMARY : 'rgba(8,145,178,0.18)'
          }`,
          transition: 'border-color 0.2s ease',
        }}
      >
        <Icon sx={{ fontSize: 15, color: iconColor, flexShrink: 0 }} />
        <Typography
          component="span"
          noWrap
          sx={{
            flex: 1,
            fontSize: 13.5,
            fontWeight: hasValue ? 600 : 500,
            color: hasValue ? TEXT : MUTED,
            lineHeight: 1.4,
          }}
        >
          {value}
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
    </Box>
  );
}

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
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
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
        color: PRIMARY,
        border: '1px solid rgba(8,145,178,0.16)',
        '& .MuiChip-deleteIcon': {
          fontSize: 15,
          color: '#94A3B8',
          '&:hover': { color: PRIMARY },
        },
      }}
    />
  );
}

export default function MentorCourseStudentsToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  showReset,
  onReset,
  resultCount,
}) {
  const theme = useTheme();
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [sortAnchor, setSortAnchor] = useState(null);

  const statusLabel =
    COURSE_STUDENT_STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? 'Tất cả';
  const sortLabel =
    COURSE_STUDENT_SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Tiến độ cao nhất';

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (search.trim()) {
      chips.push({
        key: 'q',
        label: `"${search.trim()}"`,
        onDelete: () => onSearchChange(''),
      });
    }
    if (statusFilter !== 'all') {
      chips.push({
        key: 'status',
        label: statusLabel,
        onDelete: () => onStatusChange('all'),
      });
    }
    if (sortBy !== DEFAULT_SORT) {
      chips.push({
        key: 'sort',
        label: sortLabel,
        onDelete: () => onSortChange(DEFAULT_SORT),
      });
    }
    return chips;
  }, [search, statusFilter, sortBy, statusLabel, sortLabel, onSearchChange, onStatusChange, onSortChange]);

  return (
    <Box
      sx={{
        mb: 2.5,
        pb: activeFilterChips.length || showReset ? 1.5 : 2,
        borderBottom: '1px solid rgba(15,23,42,0.08)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <UnderlineSearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Tìm học viên theo tên hoặc email..."
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2 }, flex: 1, minWidth: 0 }}>
          <UnderlineFilterTrigger
            ariaLabel="Trạng thái"
            icon={FactCheckOutlinedIcon}
            value={statusLabel}
            hasValue={statusFilter !== 'all'}
            open={Boolean(statusAnchor)}
            onClick={(event) => setStatusAnchor(event.currentTarget)}
            iconColor="#047857"
          />
          <UnderlineFilterTrigger
            ariaLabel="Sắp xếp"
            icon={SortOutlinedIcon}
            value={sortLabel}
            hasValue={sortBy !== DEFAULT_SORT}
            open={Boolean(sortAnchor)}
            onClick={(event) => setSortAnchor(event.currentTarget)}
            iconColor="#7C3AED"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, ml: { sm: 'auto' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.25 }}>
            <PersonOutlineOutlinedIcon sx={{ fontSize: 14, color: PRIMARY }} />
            <Typography
              variant="caption"
              sx={{ color: MUTED, fontWeight: 500, whiteSpace: 'nowrap', fontSize: 12 }}
            >
              {typeof resultCount === 'number' ? `${resultCount} học viên` : '— học viên'}
            </Typography>
          </Box>
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

      <FilterMenu
        anchorEl={statusAnchor}
        open={Boolean(statusAnchor)}
        onClose={() => setStatusAnchor(null)}
        options={COURSE_STUDENT_STATUS_OPTIONS}
        value={statusFilter}
        onSelect={onStatusChange}
      />
      <FilterMenu
        anchorEl={sortAnchor}
        open={Boolean(sortAnchor)}
        onClose={() => setSortAnchor(null)}
        options={COURSE_STUDENT_SORT_OPTIONS}
        value={sortBy}
        onSelect={onSortChange}
      />

      {activeFilterChips.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.625, mt: 1.25 }}>
          {activeFilterChips.map((chip) => (
            <ActiveFilterChip key={chip.key} label={chip.label} onDelete={chip.onDelete} />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
