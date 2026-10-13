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
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import AppButton from '@/shared/ui/AppButton';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import {
  FormFieldDate,
  FormFieldPassword,
  FormFieldSelect,
  FormFieldText,
} from '@/features/admin/components/AdminAccountFormFields';
import {
  ADMIN_ACCOUNT_FORM_ROLE_OPTIONS,
  ADMIN_ACCOUNT_FORM_STATUS_OPTIONS,
} from '@/features/admin/data/adminAccountsMock';
import {
  ADMIN_ACCOUNT_ROLE_CHIP_SX,
  ADMIN_ACCOUNT_ROLE_LABELS,
  ADMIN_ACCOUNT_STATUS_CHIP_SX,
  ADMIN_ACCOUNT_STATUS_LABELS,
  hasAccountFormErrors,
  validateAccountForm,
} from '@/features/admin/utils/adminAccountUtils';
import { PRIMARY, MUTED } from '@/features/mentor/components/course/mentorCourseCreateStyles';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  role: 'Student',
  status: 'ACTIVE',
  tempPassword: '',
};

function clearFieldError(setErrors, field) {
  setErrors((prev) => {
    const next = { ...prev };
    delete next[field];
    return next;
  });
}

export default function AdminAccountCreateDialog({
  open,
  onClose,
  onSubmit,
  saving = false,
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
    const validationErrors = validateAccountForm(form, { isEdit: false });
    if (hasAccountFormErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmCreate = async () => {
    await onSubmit?.({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      dateOfBirth: form.dateOfBirth,
      role: form.role,
      status: form.status,
      tempPassword: form.tempPassword,
    });
    setConfirmOpen(false);
  };

  const confirmMessage = [
    `Tạo tài khoản ${form.fullName.trim()} (${form.email.trim()})`,
    `Vai trò: ${ADMIN_ACCOUNT_ROLE_LABELS[form.role] ?? form.role}`,
    `Trạng thái: ${ADMIN_ACCOUNT_STATUS_LABELS[form.status] ?? form.status}`,
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
        <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>Tạo tài khoản mới</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Typography sx={{ fontSize: 13, color: MUTED, mb: 2, lineHeight: 1.5 }}>
            Nhập thông tin cơ bản để tạo tài khoản mới trong hệ thống.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <FormFieldText
              label="Họ và tên"
              value={form.fullName}
              onChange={(value) => updateField('fullName', value)}
              error={errors.fullName}
              placeholder="Nguyễn Văn A"
            />

            <FormFieldText
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => updateField('email', value)}
              error={errors.email}
              placeholder="example@email.com"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <FormFieldDate
                label="Ngày sinh"
                value={form.dateOfBirth}
                onChange={(value) => updateField('dateOfBirth', value)}
                error={errors.dateOfBirth}
              />
              <FormFieldText
                label="Số điện thoại"
                value={form.phone}
                onChange={(value) => updateField('phone', value)}
                error={errors.phone}
                placeholder="0901234567"
                optional
              />
            </Box>

            <FormFieldPassword
              label="Mật khẩu tạm thời"
              value={form.tempPassword}
              onChange={(value) => updateField('tempPassword', value)}
              error={errors.tempPassword}
              placeholder="Nhập mật khẩu ban đầu"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <FormFieldSelect
                label="Vai trò"
                icon={BadgeOutlinedIcon}
                iconColor="#7C3AED"
                value={form.role}
                options={ADMIN_ACCOUNT_FORM_ROLE_OPTIONS}
                colorMap={ADMIN_ACCOUNT_ROLE_CHIP_SX}
                onChange={(value) => updateField('role', value)}
                error={errors.role}
              />
              <FormFieldSelect
                label="Trạng thái"
                icon={FactCheckOutlinedIcon}
                iconColor="#047857"
                value={form.status}
                options={ADMIN_ACCOUNT_FORM_STATUS_OPTIONS}
                colorMap={ADMIN_ACCOUNT_STATUS_CHIP_SX}
                onChange={(value) => updateField('status', value)}
                error={errors.status}
              />
            </Box>
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
            Tạo tài khoản
          </AppButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => !saving && setConfirmOpen(false)}
        onConfirm={handleConfirmCreate}
        loading={saving}
        title="Xác nhận tạo tài khoản?"
        message={confirmMessage}
        confirmLabel="Tạo tài khoản"
        cancelLabel="Hủy"
      />
    </>
  );
}
