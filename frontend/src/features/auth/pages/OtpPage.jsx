import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { verifyOtpApi } from '@/features/auth/services/authService';
import Logo from '@/shared/ui/Logo';
import { toast } from '@/shared/ui/Toast';
import '@/shared/styles/auth.css';

const OTP_LENGTH  = 6;
const OTP_SECONDS = 180; // 3 phút

export default function OtpPage() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('pendingEmail') || '';

  const [digits, setDigits]             = useState(Array(OTP_LENGTH).fill(''));
  const [timeLeft, setTimeLeft]         = useState(OTP_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending]       = useState(false);
  const inputRefs    = useRef([]);
  const submittingRef = useRef(false);
  const resendingRef  = useRef(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Redirect nếu không có email pending
  useEffect(() => {
    if (!email) navigate('/register', { replace: true });
  }, [email, navigate]);

  const handleDigitChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next  = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') handleVerify();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (text.length === OTP_LENGTH) {
      setDigits(text.split(''));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (submittingRef.current) return;

    const otpCode = digits.join('');
    if (otpCode.length < OTP_LENGTH) {
      toast.error('Vui lòng nhập đủ 6 chữ số OTP.');
      return;
    }
    if (timeLeft <= 0) {
      toast.error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const { ok, data } = await verifyOtpApi(email, otpCode);
      if (ok && data.success) {
        sessionStorage.removeItem('pendingEmail');
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message || 'Xác thực thất bại.');
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
    toast.error('Vui lòng quay lại trang Đăng ký để gửi lại OTP.');
    resendingRef.current = false;
    setResending(false);
  };

  const isDisabled = isSubmitting || timeLeft <= 0;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo height={56} link={false} className="brand-logo" />
          <h1>S.T.A.R Learning Path</h1>
          <p>Xác thực tài khoản của bạn</p>
        </div>

        <hr className="auth-divider" />

        <p className="otp-email-hint">
          Mã OTP 6 chữ số đã được gửi đến <span>{email}</span>
        </p>

        {/* OTP Inputs */}
        <div className="otp-grid" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => (inputRefs.current[i] = el)}
              id={`otp-digit-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`otp-input ${d ? 'filled' : ''}`}
              value={d}
              onChange={e => handleDigitChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              disabled={isDisabled}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="otp-timer">
          <span className={`time-display ${timeLeft === 0 ? 'expired' : ''}`}>
            {timeLeft > 0 ? formatTime(timeLeft) : 'Hết hạn'}
          </span>
          {timeLeft > 0
            ? <span>Mã còn hiệu lực trong {formatTime(timeLeft)}</span>
            : <span style={{ color: '#ff6b6b' }}>Mã đã hết hạn</span>
          }
        </div>

        <div className="auth-form" style={{ marginTop: '20px' }}>
          <button
            id="btn-verify-otp"
            type="button"
            className="btn-primary"
            disabled={isDisabled || digits.join('').length < OTP_LENGTH}
            onClick={handleVerify}
          >
            {isSubmitting
              ? <><CircularProgress size={16} thickness={5} sx={{ color: 'inherit', mr: 1 }} />Đang xác thực...</>
              : 'Xác nhận OTP'}
          </button>

          <button
            type="button"
            className="btn-secondary"
            disabled={resending || timeLeft > 0}
            onClick={handleResend}
          >
            {resending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
          </button>
        </div>

        <div className="auth-footer" style={{ marginTop: '16px' }}>
          <Link to="/register">← Quay lại Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}
