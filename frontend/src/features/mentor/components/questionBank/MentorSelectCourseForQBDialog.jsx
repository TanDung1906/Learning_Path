/**
 * =============================================================================
 * MentorSelectCourseForQBDialog — Dialog chọn khóa học để tạo bank mới
 * =============================================================================
 *
 * MỤC ĐÍCH: Hiển thị danh sách khóa học chưa có ngân hàng câu hỏi.
 * LUỒNG: Tìm kiếm → chọn khóa → onSelect(course) → navigate sang trang chi tiết.
 *
 * Chọn khóa học — chọn chương trên trang tạo (mục lục bên phải).
 */
import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AppButton from '@/shared/ui/AppButton';
import SearchBox from '@/shared/ui/SearchBox';
import ThumbnailImage from '@/shared/ui/ThumbnailImage';
const TEXT = '#0F172A';
const MUTED = '#64748B';
const PRIMARY = '#0891B2';
export default function MentorSelectCourseForQBDialog({
  open,
  onClose,
  courses = [],
  onSelect,
}) {
  const theme = useTheme();
  // search: từ khóa tìm kiếm trong dialog
  const [search, setSearch] = useState('');

  // Lọc khóa học theo tên, sắp xếp mới nhất trước
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    // if (!q) return courses;
    return courses
      .filter((c) => c.CourseName?.toLowerCase().includes(q))
      .toSorted((a, b) => {
        return new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
      });
  }, [courses, search]);

  // Handler: chọn khóa → gọi callback parent → đóng dialog
  const handleSelect = (course) => {
    onSelect?.(course);
    setSearch('');
    onClose();
  };

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: alpha('#0F172A', 0.35),
          },
        },
        paper: {
          sx: {
            borderRadius: '28px',
            border: 'none',
            boxShadow: theme.ios18?.shadow?.lg ?? '0 8px 32px rgba(8, 145, 178, 0.08)',
            overflow: 'hidden',
            bgcolor: '#FFFFFF',
          },
        },
      }}
    >
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: '#0F172A', lineHeight: 1.35 }}>
              Chọn khóa học để tạo câu hỏi
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Chọn chương tại mục lục trên trang tạo bank
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              width: 32,
              height: 32,
              bgcolor: alpha('#0F172A', 0.05),
              color: '#64748B',
              flexShrink: 0,
              '&:hover': { bgcolor: alpha('#0F172A', 0.08) },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm khóa học..."
        />
      </Box>

      <DialogContent
        sx={{
          px: 2,
          pt: 0,
          pb: 2.5,
          maxHeight: 400,
          overflowY: 'auto',
        }}
      >
        {filtered.length === 0 ? (
          <Box
            sx={{
              py: 5,
              mx: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
              borderRadius: '20px',
              bgcolor: alpha('#0891B2', 0.04),
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '16px',
                bgcolor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: theme.ios18?.shadow?.sm,
              }}
            >
              <MenuBookOutlinedIcon sx={{ fontSize: 26, color: alpha('#0891B2', 0.45) }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748B', px: 2, textAlign: 'center' }}>
              {search.trim() ? 'Không tìm thấy khóa học phù hợp' : 'Không có khóa học khả dụng'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {filtered.map((course) => (
              <Box
                key={course.CourseId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 1.75,
                  py: 1.5,
                  mx: 0.5,
                  borderRadius: '18px',
                  bgcolor: alpha('#F8FAFC', 0.9),
                  border: `1px solid ${alpha('#0F172A', 0.05)}`,
                  transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    borderColor: alpha('#0891B2', 0.15),
                    boxShadow: theme.ios18?.shadow?.sm,
                  },
                }}
              >
                <ThumbnailImage
                  src={course.Thumbnail}
                  label={course.CourseName}
                  alt={course.CourseName}
                  iconSize={24}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#0F172A',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {course.CourseName}
                  </Typography>
                  {(course.CategoryDisplayName || course.LevelDisplayName) && (
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.25 }}>
                      {[course.CategoryDisplayName, course.LevelDisplayName].join(' · ')}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.25 }}>
                    Create At: {course.CreatedAt}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.25 }}>
                    Update At: {course.UpdatedAt}
                  </Typography>
                </Box>

                <AppButton
                  size="small"
                  onClick={() => handleSelect(course)}
                  sx={{
                    height: 34,
                    px: 2.25,
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: '999px',
                    bgcolor: '#0891B2',
                    color: '#fff',
                    flexShrink: 0,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#0E7490', boxShadow: 'none' },
                  }}
                >
                  Tạo
                </AppButton>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
