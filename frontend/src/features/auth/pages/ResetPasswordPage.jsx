import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { resetPasswordApi, forgotPasswordApi } from '@/features/auth/services/authService';
import AuthPasswordField from '@/shared/ui/AuthPasswordField';
import { toast } from '@/shared/ui/Toast';
import '@/shared/styles/auth.css';

const OTP_LENGTH  = 6;
const OTP_SECONDS = 300; // 5 phút

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const email    = sessionStorage.getItem('resetEmail') || '';

  const [digits,       setDigits]      = useState(Array(OTP_LENGTH).fill(''));
  const [newPassword,  setNewPassword] = useState('');
  const [confirmPass,  setConfirmPass] = useState('');
  const [timeLeft,     setTimeLeft]    = useState(OTP_SECONDS);
  const [errors,       setErrors]      = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending,    setResending]   = useState(false);
  const inputRefs    = useRef([]);
  const submittingRef = useRef(false);
  const resendingRef  = useRef(false);

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleDigitChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next  = [...digits];
    next[index] = digit;
    setDigits(next);
    setErrors((p) => ({ ...p, otp: '' }));
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === 'Enter') handleSubmit();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (text.length === OTP_LENGTH) {
      setDigits(text.split(''));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (submittingRef.current) return;

    const otp = digits.join('');
    const errs = {};
    if (otp.length < OTP_LENGTH)       errs.otp        = 'Vui lòng nhập đủ 6 chữ số OTP.';
    if (timeLeft <= 0)                 errs.otp        = 'Mã OTP đã hết hạn. Vui lòng gửi lại.';
    if (!newPassword)                  errs.newPassword = 'Mật khẩu mới không được để trống.';
    else if (newPassword.length < 6)   errs.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    if (confirmPass !== newPassword)   errs.confirmPass = 'Mật khẩu xác nhận không khớp.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const { ok, data } = await resetPasswordApi(email, otp, newPassword);
      if (ok && data.success) {
        sessionStorage.removeItem('resetEmail');
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message || 'Đặt lại mật khẩu thất bại.');
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    } catch {
      toast.error('Không thể kết nối server.');
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendingRef.current) return;
    resendingRef.current = true;
    setResending(true);
    setDigits(Array(OTP_LENGTH).fill(''));
    try {
      const { ok, data } = await forgotPasswordApi(email);
      if (ok && data.success) {
        setTimeLeft(OTP_SECONDS);
        toast.success('Mã OTP mới đã được gửi. Vui lòng kiểm tra hộp thư.');
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.message || 'Không thể gửi lại OTP.');
      }
    } catch {
      toast.error('Không thể kết nối server.');
    } finally {
      resendingRef.current = false;
      setResending(false);
    }
  };

  const otpFilled = digits.join('').length === OTP_LENGTH;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <LockOutlinedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 0.5 }} />
          <h1>S.T.A.R Learning Path</h1>
          <p>Đặt lại mật khẩu</p>
        </div>

        <hr className="auth-divider" />

        <p className="otp-email-hint">
          Nhập mã OTP 6 chữ số đã gửi đến <span>{email}</span>
        </p>

        {/* OTP grid */}
        <div className="otp-grid" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              id={`reset-otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`otp-input ${d ? 'filled' : ''}`}
              value={d}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isSubmitting || timeLeft <= 0}
            />
          ))}
        </div>
        {errors.otp && <p className="field-error" style={{ textAlign: 'center', marginTop: '4px' }}>{errors.otp}</p>}

        {/* Timer */}
        <div className="otp-timer">
          <span className={`time-display ${timeLeft === 0 ? 'expired' : ''}`}>
            {timeLeft > 0 ? formatTime(timeLeft) : 'Hết hạn'}
          </span>
          {timeLeft > 0
            ? <span>Mã còn hiệu lực trong {formatTime(timeLeft)}</span>
            : <span style={{ color: '#ff6b6b' }}>Mã đã hết hạn — hãy gửi lại</span>}
        </div>

        {/* New password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
          <AuthPasswordField
            id="reset-new-password"
            name="newPassword"
            label="Mật khẩu mới"
            placeholder="Ít nhất 6 ký tự"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: '', confirmPass: '' })); }}
            error={errors.newPassword}
            disabled={isSubmitting}
            autoComplete="new-password"
            Icon={VpnKeyOutlinedIcon}
          />

          <AuthPasswordField
            id="reset-confirm-password"
            name="confirmPass"
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập lại mật khẩu"
            value={confirmPass}
            onChange={(e) => { setConfirmPass(e.target.value); setErrors((p) => ({ ...p, confirmPass: '' })); }}
            error={errors.confirmPass}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <button
            id="btn-reset-password"
            type="button"
            className="btn-primary"
            disabled={isSubmitting || timeLeft <= 0 || !otpFilled}
            onClick={handleSubmit}
          >
            {isSubmitting
              ? <><CircularProgress size={16} thickness={5} sx={{ color: 'inherit', mr: 1 }} />Đang xử lý...</>
              : 'Đặt lại mật khẩu'}
          </button>

          <button
            type="button"
            className="btn-secondary"
            disabled={resending || timeLeft > 0}
            onClick={handleResend}
          >
            {resending
              ? <><CircularProgress size={14} thickness={5} sx={{ color: 'inherit', mr: 1 }} />Đang gửi...</>
              : 'Gửi lại mã OTP'}
          </button>
        </div>

        <div className="auth-footer" style={{ marginTop: '16px' }}>
          <Link to="/forgot-password">← Nhập email lại</Link>
          {' · '}
          <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
