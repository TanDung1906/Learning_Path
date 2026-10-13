import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, IconButton, InputBase, LinearProgress, Typography } from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import OndemandVideoRoundedIcon from '@mui/icons-material/OndemandVideoRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import VideoFileRoundedIcon from '@mui/icons-material/VideoFileRounded';
import AppButton from '@/shared/ui/AppButton';
import { ContentFieldLabel } from './MentorContentSectionHeading';
import { MUTED, TEXT } from './mentorCourseCreateStyles';
import { MATERIAL_TYPE_THEME } from './mentorCourseContentStyles';
import {
  COMPACT_VIDEO_PREVIEW_HEIGHT,
  COMPACT_VIDEO_PREVIEW_MAX_WIDTH,
  fetchVideoTitle,
  resolveVideoEmbed,
} from '@/shared/utils/videoEmbedUtils';
import {
  VIDEO_ALLOWED_EXTENSIONS,
  VIDEO_SOURCE_LINK,
  VIDEO_SOURCE_UPLOAD,
  formatFileSize,
  getMaterialMaxFileSizeLabel,
  getVideoFileTypeLabel,
  resolveVideoSourceType,
  validateVideoFile,
} from '@/features/mentor/utils/mentorCourseContentUtils';
import { VIDEO_FILE_ACCEPT } from '@/shared/utils/materialUploadValidation';
import { uploadVideoMaterial } from '@/features/mentor/services/materialUploadService';
import {
  isMaterialFileUploadBlocked,
  releaseMaterialFileUploadLock,
  tryAcquireMaterialFileUploadLock,
} from '@/features/mentor/utils/mentorMaterialFileUploadLock';

const PRIMARY = '#0891B2';
const fieldLabelSx = { mb: 0.5, fontSize: 12, fontWeight: 700, color: '#64748B' };

const SOURCE_OPTIONS = [
  { value: VIDEO_SOURCE_UPLOAD, label: 'Tải file lên', icon: CloudUploadRoundedIcon },
  { value: VIDEO_SOURCE_LINK, label: 'Gắn link', icon: LinkRoundedIcon },
];

function SourceOptionButton({ option, selected, disabled, onSelect }) {
  const Icon = option.icon;
  const isSelected = selected === option.value;

  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={() => onSelect(option.value)}
      sx={{
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        minHeight: 40,
        px: 1.25,
        border: 'none',
        borderRadius: '10px',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 13,
        fontWeight: isSelected ? 700 : 600,
        fontFamily: 'inherit',
        color: isSelected ? PRIMARY : MUTED,
        bgcolor: isSelected ? 'rgba(8,145,178,0.10)' : 'transparent',
        transition: 'background-color 0.15s, color 0.15s',
        opacity: disabled ? 0.6 : 1,
        '&:hover': disabled
          ? {}
          : {
              bgcolor: isSelected ? 'rgba(8,145,178,0.14)' : 'rgba(15,23,42,0.04)',
              color: isSelected ? PRIMARY : TEXT,
            },
      }}
    >
      <Icon sx={{ fontSize: 18 }} />
      {option.label}
    </Box>
  );
}

function VideoPreviewFrame({ embedUrl, previewType }) {
  // File .mp4/.webm/.mov: dùng <video> (iframe không ổn định với file video trực tiếp).
  if (previewType === 'video') {
    if (!embedUrl) return null;
    return (
      <Box
        component="video"
        src={embedUrl}
        controls
        playsInline
        title="Xem trước video"
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 'none',
          bgcolor: '#000',
          objectFit: 'contain',
        }}
      />
    );
  }

  return (
    <Box
      component="iframe"
      src={embedUrl}
      title="Xem trước video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        border: 'none',
        bgcolor: '#000',
      }}
    />
  );
}

export default function MentorVideoMaterialEditor({
  material,
  errors = {},
  onChange,
  disabled = false,
  compact = false,
}) {
  const theme = MATERIAL_TYPE_THEME.VIDEO;
  const fileInputRef = useRef(null);
  const uploadSeqRef = useRef(0);
  const uploadingRef = useRef(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileTypeError, setFileTypeError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSnapshot, setUploadSnapshot] = useState(null);
  const [linkSnapshot, setLinkSnapshot] = useState(null);
  // UI-only: chuyển sang Gắn link khi chưa có URL — không dirty material.
  const [viewSourceType, setViewSourceType] = useState(null);

  const resolvedSourceType = resolveVideoSourceType(material);
  const sourceType = viewSourceType ?? resolvedSourceType;
  const materialUrl = sourceType === VIDEO_SOURCE_LINK && viewSourceType === VIDEO_SOURCE_LINK
    ? String(linkSnapshot?.MaterialUrl ?? '').trim()
    : String(material.MaterialUrl ?? '').trim();
  const displayLinkUrl = sourceType === VIDEO_SOURCE_LINK
    ? (viewSourceType === VIDEO_SOURCE_LINK
      ? String(linkSnapshot?.MaterialUrl ?? '')
      : String(material.MaterialUrl ?? ''))
    : '';
  const hasStoredFile = Boolean(material.FileName && String(material.MaterialUrl ?? '').trim());
  const hasPendingFile = Boolean(material.File);
  const hasUploadedFile = sourceType === VIDEO_SOURCE_UPLOAD
    && (hasStoredFile || hasPendingFile || uploading);
  const isBusy = disabled || uploading;

  useEffect(() => {
    setUploadSnapshot(null);
    setLinkSnapshot(null);
    setViewSourceType(null);
    setFileTypeError('');
    setUploadError('');
    setUploading(false);
    setUploadProgress(0);
  }, [material.tempId, material._restoreAt]);

  const preview = useMemo(() => resolveVideoEmbed(materialUrl), [materialUrl]);
  const canPreview = Boolean(preview.embedUrl && preview.previewType) && !uploading;
  const showUnknownPreview = sourceType === VIDEO_SOURCE_LINK && materialUrl.length > 0 && !canPreview;

  useEffect(() => () => {
    releaseMaterialFileUploadLock(material.tempId);
  }, [material.tempId]);

  const applyFile = useCallback(
    async (file) => {
      if (!file || disabled || uploadingRef.current || uploading) return;

      if (isMaterialFileUploadBlocked(material.tempId)) {
        setFileTypeError('Đang có học liệu khác tải file lên. Vui lòng đợi hoàn tất.');
        return;
      }

      const hasCompletedUpload = Boolean(
        String(material.MaterialUrl ?? '').trim()
        && material.FileName
        && !material.File,
      );
      if (hasCompletedUpload) {
        setFileTypeError('Vui lòng xóa file hiện tại trước khi tải file mới.');
        return;
      }

      const validation = validateVideoFile(file);
      if (!validation.ok) {
        setFileTypeError(validation.message);
        return;
      }

      if (!tryAcquireMaterialFileUploadLock(material.tempId)) {
        setFileTypeError('Đang có học liệu khác tải file lên. Vui lòng đợi hoàn tất.');
        return;
      }

      const seq = ++uploadSeqRef.current;
      uploadingRef.current = true;
      setFileTypeError('');
      setUploadError('');
      setUploading(true);
      setUploadProgress(0);
      setViewSourceType(null);
      onChange(material.tempId, {
        File: file,
        FileName: file.name,
        FileSize: file.size,
        MaterialUrl: '',
        SourceType: VIDEO_SOURCE_UPLOAD,
      });

      try {
        const uploaded = await uploadVideoMaterial(file, {
          onProgress: (percent) => {
            if (seq !== uploadSeqRef.current) return;
            setUploadProgress(percent);
          },
        });
        if (seq !== uploadSeqRef.current) return;

        const nextUpload = {
          File: null,
          FileName: uploaded.fileName ?? file.name,
          FileSize: uploaded.fileSize ?? file.size,
          MaterialUrl: uploaded.deliveryUrl ?? uploaded.url ?? '',
        };
        setUploadSnapshot(nextUpload);
        onChange(material.tempId, {
          ...nextUpload,
          SourceType: VIDEO_SOURCE_UPLOAD,
        });
      } catch (error) {
        if (seq !== uploadSeqRef.current) return;
        setUploadError(error?.message || 'Lỗi trong quá trình tải file, hãy thử lại');
        setUploadSnapshot(null);
        onChange(material.tempId, {
          File: null,
          FileName: null,
          FileSize: null,
          MaterialUrl: '',
          SourceType: VIDEO_SOURCE_UPLOAD,
        });
      } finally {
        if (seq === uploadSeqRef.current) {
          uploadingRef.current = false;
          releaseMaterialFileUploadLock(material.tempId);
          setUploading(false);
          setUploadProgress(0);
        }
      }
    },
    [disabled, material.File, material.FileName, material.MaterialUrl, material.tempId, onChange, uploading],
  );

  const handleSourceChange = (nextSource) => {
    if (nextSource === sourceType || uploading) return;
    setFileTypeError('');
    setUploadError('');

    if (nextSource === VIDEO_SOURCE_LINK) {
      setUploadSnapshot({
        File: material.File ?? null,
        FileName: material.FileName ?? null,
        FileSize: material.FileSize ?? null,
        MaterialUrl: material.MaterialUrl ?? '',
      });
      uploadSeqRef.current += 1;

      const restoredLink = String(linkSnapshot?.MaterialUrl ?? '').trim();
      if (!restoredLink) {
        // Chưa có URL — chỉ đổi UI, không ghi SourceType vào material.
        setViewSourceType(VIDEO_SOURCE_LINK);
        return;
      }

      setViewSourceType(null);
      onChange(material.tempId, {
        SourceType: VIDEO_SOURCE_LINK,
        File: null,
        FileName: null,
        FileSize: null,
        MaterialUrl: restoredLink,
      });
      return;
    }

    // Chuyển về Tải file
    if (viewSourceType === VIDEO_SOURCE_LINK && resolvedSourceType !== VIDEO_SOURCE_LINK) {
      // Đang ở UI-only LINK (chưa nhập URL) — material vẫn giữ dữ liệu upload gốc.
      setViewSourceType(null);
      return;
    }

    setLinkSnapshot({
      MaterialUrl: material.MaterialUrl ?? '',
    });
    setViewSourceType(null);
    const restored = uploadSnapshot ?? {
      File: null,
      FileName: null,
      FileSize: null,
      MaterialUrl: '',
    };
    onChange(material.tempId, {
      SourceType: VIDEO_SOURCE_UPLOAD,
      File: restored.File ?? null,
      FileName: restored.FileName ?? null,
      FileSize: restored.FileSize ?? null,
      MaterialUrl: restored.MaterialUrl ?? '',
    });
  };

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 1) {
      setFileTypeError('Chỉ được tải lên 1 file mỗi lần.');
      event.target.value = '';
      return;
    }
    const file = files?.[0];
    if (file) applyFile(file);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    if (isBusy) return;
    const files = event.dataTransfer.files;
    if (!files?.length) return;
    if (files.length > 1) {
      setFileTypeError('Chỉ được tải lên 1 file mỗi lần.');
      return;
    }
    applyFile(files[0]);
  };

  const handleRemoveFile = () => {
    uploadSeqRef.current += 1;
    uploadingRef.current = false;
    releaseMaterialFileUploadLock(material.tempId);
    setFileTypeError('');
    setUploadError('');
    setUploading(false);
    setUploadProgress(0);
    setUploadSnapshot(null);
    setViewSourceType(null);
    onChange(material.tempId, {
      File: null,
      FileName: null,
      FileSize: null,
      MaterialUrl: '',
      SourceType: VIDEO_SOURCE_UPLOAD,
    });
  };

  const applyVideoUrl = useCallback(
    async (value, { fillTitle = false } = {}) => {
      const trimmed = String(value ?? '').trim();
      const patch = {
        MaterialUrl: trimmed,
        SourceType: VIDEO_SOURCE_LINK,
        File: null,
        FileName: null,
        FileSize: null,
      };

      if (fillTitle && trimmed) {
        const { embedUrl } = resolveVideoEmbed(trimmed);
        if (embedUrl) {
          const title = await fetchVideoTitle(trimmed);
          if (title) patch.Title = title;
        }
      }

      setLinkSnapshot({ MaterialUrl: trimmed });
      if (!trimmed) {
        // Xóa hết URL → quay UI-only, khôi phục material về snapshot upload nếu có.
        setViewSourceType(VIDEO_SOURCE_LINK);
        if (uploadSnapshot) {
          onChange(material.tempId, {
            ...uploadSnapshot,
            SourceType: VIDEO_SOURCE_UPLOAD,
          });
        } else if (resolvedSourceType === VIDEO_SOURCE_LINK) {
          onChange(material.tempId, {
            SourceType: VIDEO_SOURCE_LINK,
            MaterialUrl: '',
            File: null,
            FileName: null,
            FileSize: null,
          });
        }
        return;
      }

      setViewSourceType(null);
      onChange(material.tempId, patch);
    },
    [material.tempId, onChange, resolvedSourceType, uploadSnapshot],
  );

  const handleUrlChange = (value) => {
    const trimmed = String(value ?? '').trim();
    setLinkSnapshot({ MaterialUrl: value });

    if (!trimmed) {
      setViewSourceType(VIDEO_SOURCE_LINK);
      if (uploadSnapshot) {
        onChange(material.tempId, {
          ...uploadSnapshot,
          SourceType: VIDEO_SOURCE_UPLOAD,
        });
      } else if (resolvedSourceType === VIDEO_SOURCE_LINK) {
        onChange(material.tempId, {
          SourceType: VIDEO_SOURCE_LINK,
          MaterialUrl: '',
          File: null,
          FileName: null,
          FileSize: null,
        });
      }
      // Nếu material vốn là UPLOAD và chưa từng có link — không onChange → không dirty.
      return;
    }

    setViewSourceType(null);
    onChange(material.tempId, {
      MaterialUrl: value,
      SourceType: VIDEO_SOURCE_LINK,
      File: null,
      FileName: null,
      FileSize: null,
    });
  };

  const handleUrlPaste = useCallback(
    async (event) => {
      const pasted = event.clipboardData?.getData('text')?.trim();
      if (!pasted) return;
      event.preventDefault();
      await applyVideoUrl(pasted, { fillTitle: true });
    },
    [applyVideoUrl],
  );

  const fileError = fileTypeError || uploadError || errors.File;
  const displayFileName = material.File?.name ?? material.FileName ?? '';
  const displayFileSize = material.File?.size ?? material.FileSize;

  return (
    <Box
      sx={
        compact
          ? { mt: 0 }
          : {
              mt: 1.25,
              ml: { xs: 0, sm: 0.25 },
              p: { xs: 1.25, sm: 1.5 },
              borderRadius: '16px',
              border: `1px solid ${
                errors.File || errors.MaterialUrl ? '#FECACA' : 'rgba(15,23,42,0.08)'
              }`,
              bgcolor: '#F8FAFC',
            }
      }
    >
      {!compact ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
          <PlayCircleRoundedIcon sx={{ fontSize: 20, color: theme.color }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.35 }}>
            Video học tập
          </Typography>
        </Box>
      ) : null}

      <ContentFieldLabel sx={{ mb: 0.75, fontSize: 12, fontWeight: 700, color: '#64748B' }}>
        Nguồn video
      </ContentFieldLabel>
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          p: 0.5,
          mb: 1.25,
          borderRadius: '12px',
          bgcolor: '#fff',
          border: '1px solid rgba(15,23,42,0.08)',
        }}
      >
        {SOURCE_OPTIONS.map((option) => (
          <SourceOptionButton
            key={option.value}
            option={option}
            selected={sourceType}
            disabled={isBusy}
            onSelect={handleSourceChange}
          />
        ))}
      </Box>

      {sourceType === VIDEO_SOURCE_UPLOAD ? (
        <>
          {!hasUploadedFile ? (
            <Box
              onDragEnter={(event) => {
                event.preventDefault();
                if (!isBusy) setDragOver(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (!isBusy) setDragOver(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragOver(false);
              }}
              onDrop={handleDrop}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                py: 2.5,
                px: 2,
                borderRadius: '14px',
                border: `1.5px dashed ${
                  fileError ? '#DC2626' : dragOver ? PRIMARY : 'rgba(15,23,42,0.14)'
                }`,
                bgcolor: dragOver ? 'rgba(8,145,178,0.04)' : '#fff',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
            >
              <VideoFileRoundedIcon sx={{ fontSize: compact ? 28 : 24, color: theme.color }} />
              <Typography
                sx={{ fontSize: 13, fontWeight: 600, color: TEXT, textAlign: 'center', lineHeight: 1.45 }}
              >
                Kéo thả video vào đây hoặc chọn file
              </Typography>
              <Typography sx={{ fontSize: 12, color: MUTED, textAlign: 'center' }}>
                Hỗ trợ MP4, WEBM, MOV · Tối đa {getMaterialMaxFileSizeLabel()}
              </Typography>
              <AppButton
                variant="outlined"
                size="small"
                disabled={isBusy}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  mt: 0.5,
                  minWidth: 0,
                  height: 34,
                  px: 1.75,
                  borderRadius: '10px',
                  fontSize: 13,
                  fontWeight: 600,
                  borderColor: 'rgba(15,23,42,0.12)',
                  color: PRIMARY,
                  '&:hover': { borderColor: PRIMARY, bgcolor: 'rgba(8,145,178,0.06)' },
                }}
              >
                Chọn file
              </AppButton>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple={false}
                accept={`${VIDEO_ALLOWED_EXTENSIONS.join(',')},${VIDEO_FILE_ACCEPT}`}
                disabled={isBusy}
                onChange={handleFileInputChange}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 1.25,
                borderRadius: '14px',
                bgcolor: '#fff',
                border: '1px solid rgba(15,23,42,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <VideoFileRoundedIcon sx={{ fontSize: 22, color: theme.color, flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: TEXT,
                      lineHeight: 1.35,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {displayFileName || 'Đang tải video...'}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.2, lineHeight: 1.4 }}>
                    {uploading
                      ? `Đang tải lên Cloudinary... ${uploadProgress}%`
                      : [
                          formatFileSize(displayFileSize),
                          displayFileName ? getVideoFileTypeLabel(displayFileName) : '',
                        ].filter(Boolean).join(' · ')}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  disabled={isBusy}
                  onClick={handleRemoveFile}
                  aria-label="Xóa file"
                  sx={{ color: MUTED, '&:hover': { color: '#DC2626', bgcolor: 'rgba(220,38,38,0.06)' } }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
              {uploading ? (
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    height: 6,
                    borderRadius: 999,
                    bgcolor: 'rgba(8,145,178,0.12)',
                    '& .MuiLinearProgress-bar': { bgcolor: PRIMARY, borderRadius: 999 },
                  }}
                />
              ) : null}
            </Box>
          )}
          {fileError && (
            <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.5 }}>{fileError}</Typography>
          )}
        </>
      ) : (
        <Box>
          <ContentFieldLabel sx={fieldLabelSx}>Link video</ContentFieldLabel>
          <InputBase
            value={displayLinkUrl}
            onChange={(event) => handleUrlChange(event.target.value)}
            onPaste={handleUrlPaste}
            disabled={disabled}
            placeholder="https://youtube.com/watch?v=... hoặc link video"
            fullWidth
            sx={{
              fontSize: 13,
              color: TEXT,
              px: 1,
              py: 0.65,
              borderRadius: '10px',
              border: `1px solid ${errors.MaterialUrl ? '#DC2626' : 'rgba(15,23,42,0.12)'}`,
              bgcolor: '#fff',
              '&:focus-within': { borderColor: errors.MaterialUrl ? '#DC2626' : PRIMARY },
            }}
          />
          <Typography sx={{ fontSize: 11.5, color: MUTED, mt: 0.5, lineHeight: 1.45 }}>
            Hỗ trợ YouTube, Vimeo hoặc file/link .mp4 / .webm / .mov trên hệ thống.
          </Typography>
          {errors.MaterialUrl && (
            <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.35 }}>
              {errors.MaterialUrl}
            </Typography>
          )}
        </Box>
      )}

      {canPreview ? (
        <Box
          sx={{
            mt: compact ? 2 : 1.25,
            width: '100%',
            display: 'flex',
            justifyContent: compact ? 'center' : 'flex-start',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: compact ? { xs: '100%', sm: COMPACT_VIDEO_PREVIEW_MAX_WIDTH } : '100%',
            }}
          >
            <ContentFieldLabel sx={{ ...fieldLabelSx, mb: 0.75 }}>
              Xem trước
            </ContentFieldLabel>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                ...(compact
                  ? { height: COMPACT_VIDEO_PREVIEW_HEIGHT }
                  : { pt: '56.25%' }),
                borderRadius: compact ? '10px' : '14px',
                overflow: 'hidden',
                border: '1px solid rgba(15,23,42,0.08)',
                bgcolor: '#0F172A',
                mx: compact ? 'auto' : 0,
              }}
            >
              <Box sx={{ position: 'absolute', inset: 0 }}>
                <VideoPreviewFrame embedUrl={preview.embedUrl} previewType={preview.previewType} />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : null}

      {showUnknownPreview ? (
        <Box
          sx={{
            mt: compact ? 2 : 1.25,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            p: compact ? 1 : 1.25,
            borderRadius: compact ? '10px' : '14px',
            bgcolor: compact ? 'transparent' : '#fff',
            border: '1px dashed rgba(15,23,42,0.12)',
          }}
        >
          <OndemandVideoRoundedIcon sx={{ fontSize: 20, color: MUTED, mt: 0.1, flexShrink: 0 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEXT, lineHeight: 1.45 }}>
              Không thể xem trước link này bằng iframe.
            </Typography>
            <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.35, lineHeight: 1.45 }}>
              Link gốc vẫn có thể được lưu. Vui lòng mở link để xem video.
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
