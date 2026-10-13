import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { forgotPasswordApi } from '@/features/auth/services/authService';
import Logo from '@/shared/ui/Logo';
import { toast } from '@/shared/ui/Toast';
import '@/shared/styles/auth.css';

const COOLDOWN_KEY = 'otpCooldownEnd';
const COOLDOWN_MS  = 300_000; // 5 phút

const validateEmail = (email) => {
  if (!email || email.includes(' ')) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};

const formatTime = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

const getRemainingCooldown = () => {
  const end = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
  if (!end) return 0;
  const remaining = Math.ceil((end - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email,        setEmail]        = useState('');
  const [error,        setError]        = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown,     setCooldown]     = useState(0);
  const timerRef      = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    const remaining = getRemainingCooldown();
    if (remaining > 0) startCountdown(remaining);
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startCountdown = (seconds) => {
    setCooldown(seconds);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          localStorage.removeItem(COOLDOWN_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown > 0 || submittingRef.current) return;

    const trimmed = email.trim();
    if (!trimmed)                { setError('Email không được để trống.'); return; }
    if (!validateEmail(trimmed)) { setError('Email không hợp lệ.'); return; }

    submittingRef.current = true;
    setIsSubmitting(true);
    setError('');

    try {
      const { ok, data } = await forgotPasswordApi(trimmed.toLowerCase());

      if (ok && data.success) {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
        startCountdown(COOLDOWN_MS / 1000);
        sessionStorage.setItem('resetEmail', trimmed.toLowerCase());
        toast.success(data.message);
        navigate('/reset-password');
      } else {
        toast.error(data.message || 'Không thể gửi OTP. Vui lòng thử lại.');
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    } catch {
      toast.error('Không thể kết nối server. Vui lòng kiểm tra backend.');
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const isBlocked = cooldown > 0 || isSubmitting;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo height={56} link={false} className="brand-logo" />
          <h1>S.T.A.R Learning Path</h1>
          <p>Khôi phục mật khẩu của bạn</p>
        </div>

        <hr className="auth-divider" />

        <p style={{
          color: 'var(--clr-text-dim)',
          fontSize: '13.5px',
          textAlign: 'center',
          marginBottom: '20px',
          lineHeight: '1.6',
        }}>
          Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã OTP 6 chữ số để đặt lại mật khẩu.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="forgot-email">Email đã đăng ký</label>
            <div className="input-wrapper">
              <span className="input-icon" aria-hidden="true">
                <EmailOutlinedIcon />
              </span>
              <input
                id="forgot-email"
                type="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                autoFocus
                value={email}
                disabled={isBlocked}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
            </div>
            {error && <p className="field-error">{error}</p>}
          </div>

          {cooldown > 0 && (
            <div className="otp-timer" style={{ marginTop: '4px' }}>
              <span className="time-display">{formatTime(cooldown)}</span>
              <span>Gửi lại OTP sau {formatTime(cooldown)}</span>
            </div>
          )}

          <button
            id="btn-send-otp"
            type="submit"
            className="btn-primary"
            disabled={isBlocked}
            style={{ marginTop: '8px' }}
          >
            {isSubmitting
              ? <><CircularProgress size={16} thickness={5} sx={{ color: 'inherit', mr: 1 }} />Đang gửi OTP...</>
              : cooldown > 0
              ? `Gửi lại sau ${formatTime(cooldown)}`
              : 'Gửi mã OTP'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">← Quay lại Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
