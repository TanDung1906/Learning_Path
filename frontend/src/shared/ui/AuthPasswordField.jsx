import { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function AuthPasswordField({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete = 'current-password',
  Icon = LockOutlinedIcon,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrapper has-toggle">
        <span className="input-icon" aria-hidden="true">
          <Icon />
        </span>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="input-toggle"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          tabIndex={-1}
        >
          {show ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
