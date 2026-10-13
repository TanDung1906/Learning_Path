import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  alpha,
} from '@mui/material';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import AppButton from '@/shared/ui/AppButton';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import { toast } from '@/shared/ui/Toast';
import { FormFieldSelect, FormFieldText } from '@/features/admin/components/AdminAccountFormFields';
import {
  ADMIN_CATALOG_STATUS_CHIP_SX,
  ADMIN_CATALOG_STATUS_LABELS,
} from '@/features/admin/data/adminCatalogConstants';
import {
  ADMIN_CATEGORY_FORM_STATUS_OPTIONS,
  formatCategoryDate,
  hasCategoryFormErrors,
  validateCategoryForm,
} from '@/features/admin/utils/adminCategoryUtils';
import { CategoryNameChip } from '@/shared/catalog/CatalogNameChip';
import { PRIMARY, TEXT, MUTED } from '@/features/mentor/components/course/mentorCourseCreateStyles';

function SummaryField({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: MUTED, mb: 0.25, lineHeight: 1.3 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 500,
          color: TEXT,
          lineHeight: 1.45,
          wordBreak: 'break-word',
        }}
      >
        {value || '—'}
      </Typography>
    </Box>
  );
}

function CategorySummaryCard({ category }) {
  return (
    <Box
      sx={{
        p: 1.25,
        mb: 2,
        borderRadius: '12px',
        bgcolor: 'rgba(15,23,42,0.03)',
        border: '1px solid rgba(15,23,42,0.06)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.25 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            bgcolor: alpha(PRIMARY, 0.12),
            color: PRIMARY,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CategoryOutlinedIcon sx={{ fontSize: 22 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <CategoryNameChip
            label={category.displayName}
            id={category.id}
            colorCode={category.colorCode}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 1.25,
        }}
      >
        <SummaryField
          label="Trạng thái"
          value={ADMIN_CATALOG_STATUS_LABELS[category.status] ?? category.status}
        />
        <SummaryField label="Ngày tạo" value={formatCategoryDate(category.createdAt)} />
      </Box>
    </Box>
  );
}

function buildChangeSummary(category, form) {
  const lines = [];
  if (category.displayName !== form.displayName.trim()) {
    lines.push(`Tên hiển thị: ${category.displayName} → ${form.displayName.trim()}`);
  }
  if (category.status !== form.status) {
    lines.push(
      `Trạng thái: ${ADMIN_CATALOG_STATUS_LABELS[category.status] ?? category.status} → ${ADMIN_CATALOG_STATUS_LABELS[form.status] ?? form.status}`,
    );
  }
  return lines;
}

export default function AdminCategoryEditDialog({
  open,
  onClose,
  category,
  onSubmit,
  saving = false,
  existingNames = [],
}) {
  const [form, setForm] = useState({ displayName: '', status: 'ACTIVE' });
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open && category) {
      setForm({
        displayName: category.displayName ?? '',
        status: category.status ?? 'ACTIVE',
      });
      setErrors({});
      setConfirmOpen(false);
    }
  }, [open, category]);

  const hasChanges = useMemo(() => {
    if (!category) return false;
    return (
      category.displayName !== form.displayName.trim() ||
      category.status !== form.status
    );
  }, [category, form]);

  const changeSummary = useMemo(() => {
    if (!category) return [];
    return buildChangeSummary(category, form);
  }, [category, form]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSaveClick = () => {
    const validationErrors = validateCategoryForm(form, { existingNames });
    if (hasCategoryFormErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    if (!hasChanges) {
      toast.info('Không có thay đổi nào để lưu');
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    await onSubmit?.({
      displayName: form.displayName.trim(),
      status: form.status,
    });
    setConfirmOpen(false);
  };

  if (!category) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={() => !saving && onClose?.()}
        maxWidth="sm"
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
        <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>Chỉnh sửa danh mục</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Typography sx={{ fontSize: 13, color: MUTED, mb: 2, lineHeight: 1.5 }}>
            Cập nhật thông tin danh mục khóa học.
          </Typography>

          <CategorySummaryCard category={category} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <FormFieldText
              label="Tên hiển thị"
              value={form.displayName}
              onChange={(value) => updateField('displayName', value)}
              error={errors.displayName}
            />

            <FormFieldSelect
              label="Trạng thái"
              icon={FactCheckOutlinedIcon}
              iconColor="#047857"
              value={form.status}
              options={ADMIN_CATEGORY_FORM_STATUS_OPTIONS}
              colorMap={ADMIN_CATALOG_STATUS_CHIP_SX}
              onChange={(value) => updateField('status', value)}
              error={errors.status}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <AppButton variant="outlined" onClick={onClose} disabled={saving}>
            Hủy
          </AppButton>
          <AppButton
            loading={saving}
            disabled={!hasChanges}
            onClick={handleSaveClick}
            sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: '#0E7490' } }}
          >
            Lưu thay đổi
          </AppButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => !saving && setConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        loading={saving}
        title="Lưu thay đổi danh mục?"
        message={[
          `Bạn sắp cập nhật danh mục "${category.displayName}".`,
          ...changeSummary,
        ].join(' ')}
        confirmLabel="Lưu thay đổi"
        cancelLabel="Hủy"
      />
    </>
  );
}
