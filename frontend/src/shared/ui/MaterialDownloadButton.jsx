import { IconButton, Tooltip } from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import AppButton from '@/shared/ui/AppButton';
import { toast } from '@/shared/ui/Toast';
import { downloadMaterial } from '@/shared/utils/materialDownloadUtils';

export default function MaterialDownloadButton({
  url,
  file,
  fileName,
  fallbackTitle = 'tai-lieu',
  disabled = false,
  variant = 'icon',
  size = 'small',
  label = 'Tải về',
  sx,
  iconSx,
}) {
  const canDownload = Boolean(file) || Boolean(String(url ?? '').trim());

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!canDownload || disabled) return;

    try {
      const result = downloadMaterial({ url, file, fileName, fallbackTitle });
      if (!result?.ok) {
        toast.error('Không thể tải tài liệu. Vui lòng thử lại.');
      }
    } catch {
      toast.error('Không thể tải tài liệu. Vui lòng thử lại.');
    }
  };

  if (!canDownload) return null;

  if (variant === 'button') {
    return (
      <AppButton
        type="button"
        size={size}
        variant="outlined"
        disabled={disabled}
        onClick={handleClick}
        startIcon={<DownloadRoundedIcon sx={{ fontSize: '18px !important' }} />}
        sx={sx}
      >
        {label}
      </AppButton>
    );
  }

  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          type="button"
          size={size}
          disabled={disabled}
          onClick={handleClick}
          aria-label={label}
          sx={iconSx}
        >
          <DownloadRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </span>
    </Tooltip>
  );
}
