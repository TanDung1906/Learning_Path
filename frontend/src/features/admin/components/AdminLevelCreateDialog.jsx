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
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import AppButton from '@/shared/ui/AppButton';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import { FormFieldSelect, FormFieldText } from '@/features/admin/components/AdminAccountFormFields';
import {
  ADMIN_CATALOG_STATUS_CHIP_SX,
  ADMIN_CATALOG_STATUS_LABELS,
} from '@/features/admin/data/adminCatalogConstants';
import {
  ADMIN_LEVEL_FORM_STATUS_OPTIONS,
  hasLevelFormErrors,
  validateLevelForm,
} from '@/features/admin/utils/adminLevelUtils';
import { PRIMARY, MUTED } from '@/features/mentor/components/course/mentorCourseCreateStyles';

const EMPTY_FORM = {
  displayName: '',
  status: 'ACTIVE',
};

function clearFieldError(setErrors, field) {
  setErrors((prev) => {
    const next = { ...prev };
    delete next[field];
    return next;
  });
}

export default function AdminLevelCreateDialog({
  open,
  onClose,
  onSubmit,
  saving = false,
  existingNames = [],
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setErrors({});
      setConfirmOpen(false);
    }
  }, [open]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearFieldError(setErrors, field);
  };

  const handleCreateClick = () => {
    const validationErrors = validateLevelForm(form, { existingNames });
    if (hasLevelFormErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmCreate = async () => {
    await onSubmit?.({
      displayName: form.displayName.trim(),
      status: form.status,
    });
    setConfirmOpen(false);
  };

  const confirmMessage = [
    `Tạo trình độ "${form.displayName.trim()}"`,
    `Trạng thái: ${ADMIN_CATALOG_STATUS_LABELS[form.status] ?? form.status}`,
  ].join('. ');

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
        <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>Tạo trình độ mới</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Typography sx={{ fontSize: 13, color: MUTED, mb: 2, lineHeight: 1.5 }}>
            Nhập thông tin để thêm trình độ khóa học mới.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <FormFieldText
              label="Tên hiển thị"
              value={form.displayName}
              onChange={(value) => updateField('displayName', value)}
              error={errors.displayName}
              placeholder="Cơ bản"
            />

            <FormFieldSelect
              label="Trạng thái"
              icon={FactCheckOutlinedIcon}
              iconColor="#047857"
              value={form.status}
              options={ADMIN_LEVEL_FORM_STATUS_OPTIONS}
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
            onClick={handleCreateClick}
            sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: '#0E7490' } }}
          >
            Tạo trình độ
          </AppButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => !saving && setConfirmOpen(false)}
        onConfirm={handleConfirmCreate}
        loading={saving}
        title="Xác nhận tạo trình độ?"
        message={confirmMessage}
        confirmLabel="Tạo trình độ"
        cancelLabel="Hủy"
      />
    </>
  );
}
