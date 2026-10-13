import { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import UnderlineFieldPopup from "@/shared/ui/UnderlineFieldPopup";

const EMPTY_FORM = {
  _currPass: "",
  _newPass: "",
  _confPass: "",
};

const PASSWORD_FIELDS = [
  {
    name: "_currPass",
    label: "Mật khẩu hiện tại",
    placeholder: "Nhập mật khẩu hiện tại",
    type: "password",
  },
  {
    name: "_newPass",
    label: "Mật khẩu mới",
    placeholder: "Nhập mật khẩu mới",
    type: "password",
  },
  {
    name: "_confPass",
    label: "Xác nhận mật khẩu mới",
    placeholder: "Nhập lại mật khẩu mới",
    type: "password",
  },
];

function validatePasswordForm(form) {
  const errors = {};
  if (!form._currPass.trim()) errors._currPass = "Vui lòng nhập mật khẩu hiện tại";
  if (!form._newPass.trim()) errors._newPass = "Vui lòng nhập mật khẩu mới";
  else if (form._newPass.length < 6) errors._newPass = "Mật khẩu mới tối thiểu 6 ký tự";
  if (!form._confPass.trim()) errors._confPass = "Vui lòng xác nhận mật khẩu mới";
  else if (form._confPass !== form._newPass) errors._confPass = "Mật khẩu xác nhận không khớp";
  return errors;
}

export default function ChangePasswordDialog({ open, onClose, onSubmit, loading = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState({
    _currPass: false,
    _newPass: false,
    _confPass: false,
  });

  const resetState = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setPasswordVisibility({ _currPass: false, _newPass: false, _confPass: false });
  };

  const handleClose = () => {
    resetState();
    onClose?.();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTogglePassword = (name) => {
    setPasswordVisibility((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async () => {
    const nextErrors = validatePasswordForm(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    if (onSubmit) {
      const result = await onSubmit(form);
      if (result === false) return;
      handleClose();
      return;
    }

    const userRaw = localStorage.getItem("user");
    const currentUser = userRaw ? JSON.parse(userRaw) : null;
    if (!currentUser?.userId) {
      setErrors({ current: "Không tìm thấy phiên đăng nhập" });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.userId
        },
        body: JSON.stringify({
          currentPassword: form._currPass,
          newPassword: form._newPass
        })
      });

      const data = await response.json();
      if (data.success) {
        alert("Đổi mật khẩu thành công!");
        handleClose();
      } else {
        setErrors({ _currPass: data.message });
      }
    } catch (err) {
      console.error(err);
      setErrors({ _currPass: "Lỗi kết nối đến server" });
    }
  };

  return (
    <UnderlineFieldPopup
      open={open}
      onClose={handleClose}
      title="Đổi mật khẩu"
      titleIcon={LockOutlinedIcon}
      description="Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật tài khoản."
      fields={PASSWORD_FIELDS}
      form={form}
      errors={errors}
      onChange={handleChange}
      passwordVisibility={passwordVisibility}
      onTogglePassword={handleTogglePassword}
      submitLabel="Lưu mật khẩu"
      submitIcon={<CheckRoundedIcon />}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
