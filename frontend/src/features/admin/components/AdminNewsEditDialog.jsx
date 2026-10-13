import { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  alpha,
} from '@mui/material';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { useNavigate } from 'react-router-dom';
import AppButton from '@/shared/ui/AppButton';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import Loading from '@/shared/ui/Loading';
import AdminNewsForm from '@/features/admin/components/AdminNewsForm';
import {
  getNewsArticleById,
  updateNewsArticleBasicInfo,
} from '@/features/admin/services/adminNewsService';
import {
  ADMIN_NEWS_FORM_INITIAL,
  hasAdminNewsFormErrors,
  mapArticleToNewsFormStep1,
  validateAdminNewsFormStep1,
} from '@/features/admin/utils/adminNewsFormUtils';
import {
  clearAdminNewsEditDraft,
  isAdminNewsEditDraftForArticle,
  loadAdminNewsEditDraft,
  saveAdminNewsEditDraft,
} from '@/features/admin/utils/adminNewsEditStorage';
import { fetchAdminNewsCategoryFormOptions } from '@/features/admin/utils/adminNewsUtils';
import { toast } from '@/shared/ui/Toast';
import { MUTED, PRIMARY } from '@/features/mentor/components/course/mentorCourseCreateStyles';

const ACTION_BUTTON_SX = {
  height: 40,
  borderRadius: '999px',
  fontWeight: 700,
  fontSize: 13,
  px: 2,
};

export default function AdminNewsEditDialog({
  open,
  articleId,
  onClose,
  onSaved,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(ADMIN_NEWS_FORM_INITIAL);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [navigatingContent, setNavigatingContent] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const busy = saving || navigatingContent;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await fetchAdminNewsCategoryFormOptions();
      if (!cancelled && res.ok) {
        setCategoryOptions(res.options);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open || !articleId) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setErrors({});
      setCancelConfirmOpen(false);

      const draft = isAdminNewsEditDraftForArticle(articleId) ? loadAdminNewsEditDraft() : null;
      if (draft?.step1) {
        if (!cancelled) {
          setForm({ ...ADMIN_NEWS_FORM_INITIAL, ...draft.step1 });
          setContent(draft.content ?? '');
          setLoading(false);
        }
        return;
      }

      const res = await getNewsArticleById(articleId);
      if (cancelled) return;

      if (!res.ok || !res.article) {
        toast.error(res.message ?? 'Không tìm thấy tin tức');
        onClose?.();
        return;
      }

      const step1 = mapArticleToNewsFormStep1(res.article);

      setForm(step1);
      setContent(res.article.content ?? '');
      saveAdminNewsEditDraft({
        articleId: Number(articleId),
        step1,
        content: res.article.content ?? '',
        returnTo: 'dialog',
      });
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [open, articleId, onClose]);

  const validateForm = () => {
    const validationErrors = validateAdminNewsFormStep1(form);
    if (hasAdminNewsFormErrors(validationErrors)) {
      setErrors(validationErrors);
      return false;
    }
    return true;
  };

  const handleCancelClick = () => {
    if (busy || loading) return;
    setCancelConfirmOpen(true);
  };

  /** Chỉ hủy nháp local — không ghi đè DB. */
  const handleConfirmCancel = () => {
    clearAdminNewsEditDraft();
    setCancelConfirmOpen(false);
    onClose?.();
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const res = await updateNewsArticleBasicInfo(articleId, {
        title: form.title.trim(),
        categoryId: form.categoryId,
        status: form.status,
        author: form.author.trim(),
        excerpt: form.excerpt.trim(),
        thumbnail: form.thumbnail.trim(),
      });

      if (!res.ok) {
        toast.error(res.message ?? 'Không thể cập nhật tin tức');
        return;
      }

      clearAdminNewsEditDraft();
      toast.success('Đã lưu thông tin bài viết');
      onSaved?.(res.article);
      onClose?.();
    } catch {
      toast.error('Không thể cập nhật tin tức');
    } finally {
      setSaving(false);
    }
  };

  const handleEditContent = async () => {
    if (!validateForm()) return;

    setNavigatingContent(true);
    try {
      saveAdminNewsEditDraft({
        articleId: Number(articleId),
        step1: form,
        content,
        returnTo: 'dialog',
      });
      onClose?.();
      navigate(`/admin/news/${articleId}/edit/content`);
    } finally {
      setNavigatingContent(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => !busy && !loading && handleCancelClick()}
        maxWidth="md"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(8px)',
              backgroundColor: alpha('#0F172A', 0.35),
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>Chỉnh sửa tin tức</DialogTitle>

        <DialogContent sx={{ pt: 1.5 }}>
          <Typography sx={{ fontSize: 13, color: MUTED, mb: 2, lineHeight: 1.5 }}>
            Cập nhật thông tin cơ bản. Nội dung đã lưu ở bước soạn sẽ được giữ khi quay lại.
          </Typography>

          {loading ? (
            <Box sx={{ py: 4 }}>
              <Loading message="Đang tải tin tức..." />
            </Box>
          ) : (
            <AdminNewsForm
              form={form}
              errors={errors}
              categoryOptions={categoryOptions}
              onChange={(nextForm) => {
                setForm(nextForm);
                setErrors({});
              }}
              disabled={busy}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1, flexWrap: 'wrap' }}>
          <AppButton
            variant="outlined"
            onClick={handleCancelClick}
            disabled={busy || loading}
            sx={ACTION_BUTTON_SX}
          >
            Hủy
          </AppButton>

          <Box sx={{ flex: 1 }} />

          <AppButton
            variant="outlined"
            startIcon={<EditNoteRoundedIcon sx={{ fontSize: 18 }} />}
            onClick={handleEditContent}
            loading={navigatingContent}
            disabled={busy || loading}
            sx={ACTION_BUTTON_SX}
          >
            Sửa nội dung
          </AppButton>

          <AppButton
            loading={saving}
            onClick={handleSave}
            disabled={busy || loading}
            sx={{
              ...ACTION_BUTTON_SX,
              bgcolor: PRIMARY,
              '&:hover': { bgcolor: '#0E7490' },
            }}
          >
            Lưu thay đổi
          </AppButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Hủy chỉnh sửa?"
        message="Các thay đổi chưa lưu trong form sẽ bị bỏ. Bài viết trên hệ thống không bị thay đổi."
        confirmLabel="Hủy chỉnh sửa"
        cancelLabel="Tiếp tục chỉnh sửa"
      />
    </>
  );
}
