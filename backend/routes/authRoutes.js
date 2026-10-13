const express = require('express');
const router = express.Router();
const {
  login,
  register,
  verifyOtp,
  saveOnboarding,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

// POST /api/auth/login — tất cả roles (Admin, Mentor, Student)
router.post('/login', login);

// POST /api/auth/register — chỉ dành cho Student (tự đăng ký)
router.post('/register', register);

// POST /api/auth/verify-otp — xác thực OTP đăng ký
router.post('/verify-otp', verifyOtp);


// POST /api/auth/onboarding — lưu kết quả khảo sát 3 bước
router.post('/onboarding', saveOnboarding);


// POST /api/auth/forgot-password — gửi OTP đặt lại mật khẩu (tất cả roles)
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password — xác nhận OTP và cập nhật mật khẩu (tất cả roles)
router.post('/reset-password', resetPassword);

module.exports = router;
