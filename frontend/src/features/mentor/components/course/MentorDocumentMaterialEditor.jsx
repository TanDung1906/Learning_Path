import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, IconButton, InputBase, LinearProgress, Typography } from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import AppButton from '@/shared/ui/AppButton';
import MaterialDownloadButton from '@/shared/ui/MaterialDownloadButton';
import { uploadDocMaterial } from '@/features/mentor/services/materialUploadService';
import {
  isMaterialFileUploadBlocked,
  releaseMaterialFileUploadLock,
  tryAcquireMaterialFileUploadLock,
} from '@/features/mentor/utils/mentorMaterialFileUploadLock';
import { ContentFieldLabel } from './MentorContentSectionHeading';
import { MUTED, TEXT } from './mentorCourseCreateStyles';
import { MATERIAL_TYPE_THEME } from './mentorCourseContentStyles';
import {
  DOC_ALLOWED_EXTENSIONS,
  DOC_SOURCE_LINK,
  DOC_SOURCE_UPLOAD,
  formatFileSize,
  getDocFileTypeLabel,
  getMaterialMaxFileSizeLabel,
  resolveDocSourceType,
  validateDocFile,
} from '@/features/mentor/utils/mentorCourseContentUtils';

const PRIMARY = '#0891B2';

const SOURCE_OPTIONS = [
  { value: DOC_SOURCE_UPLOAD, label: 'Tải file lên', icon: CloudUploadRoundedIcon },
  { value: DOC_SOURCE_LINK, label: 'Gắn link', icon: LinkRoundedIcon },
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

export default function MentorDocumentMaterialEditor({
  material,
  errors = {},
  onChange,
  disabled = false,
  compact = false,
}) {
  const theme = MATERIAL_TYPE_THEME.DOC;
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

  const resolvedSourceType = resolveDocSourceType(material);
  const sourceType = viewSourceType ?? resolvedSourceType;
  const displayLinkUrl = sourceType === DOC_SOURCE_LINK
    ? (viewSourceType === DOC_SOURCE_LINK
      ? String(linkSnapshot?.MaterialUrl ?? '')
      : String(material.MaterialUrl ?? ''))
    : '';
  const hasStoredFile = Boolean(material.FileName && String(material.MaterialUrl ?? '').trim());
  const hasPendingFile = Boolean(material.File);
  const hasUploadedFile = sourceType === DOC_SOURCE_UPLOAD
    && (hasStoredFile || hasPendingFile);

  useEffect(() => {
    setUploadSnapshot(null);
    setLinkSnapshot(null);
    setViewSourceType(null);
    setFileTypeError('');
  }, [material.tempId, material._restoreAt]);

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

      const validation = validateDocFile(file);
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
      setViewSourceType(null);
      setUploading(true);
      setUploadProgress(0);

      onChange(material.tempId, {
        File: file,
        FileName: file.name,
        FileSize: file.size,
        MaterialUrl: '',
        SourceType: DOC_SOURCE_UPLOAD,
      });

      try {
        const uploaded = await uploadDocMaterial(file, {
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
          MaterialUrl: uploaded.url ?? uploaded.deliveryUrl ?? '',
        };
        setUploadSnapshot(nextUpload);
        onChange(material.tempId, {
          ...nextUpload,
          SourceType: DOC_SOURCE_UPLOAD,
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
          SourceType: DOC_SOURCE_UPLOAD,
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
    if (nextSource === sourceType || disabled || uploading) return;
    setFileTypeError('');
    setUploadError('');

    if (nextSource === DOC_SOURCE_LINK) {
      setUploadSnapshot({
        File: material.File ?? null,
        FileName: material.FileName ?? null,
        FileSize: material.FileSize ?? null,
        MaterialUrl: material.MaterialUrl ?? '',
      });

      const restoredLink = String(linkSnapshot?.MaterialUrl ?? '').trim();
      if (!restoredLink) {
        // Chưa có URL — chỉ đổi UI, không ghi SourceType vào material.
        setViewSourceType(DOC_SOURCE_LINK);
        return;
      }

      setViewSourceType(null);
      onChange(material.tempId, {
        SourceType: DOC_SOURCE_LINK,
        File: null,
        FileName: null,
        FileSize: null,
        MaterialUrl: restoredLink,
      });
      return;
    }

    // Chuyển về Tải file
    if (viewSourceType === DOC_SOURCE_LINK && resolvedSourceType !== DOC_SOURCE_LINK) {
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
      SourceType: DOC_SOURCE_UPLOAD,
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
    if (disabled || uploading) return;
    const files = event.dataTransfer.files;
    if (!files?.length) return;
    if (files.length > 1) {
      setFileTypeError('Chỉ được tải lên 1 file mỗi lần.');
      return;
    }
    applyFile(files[0]);
  };

  const handleRemoveFile = () => {
    setFileTypeError('');
    setUploadError('');
    uploadSeqRef.current += 1;
    uploadingRef.current = false;
    releaseMaterialFileUploadLock(material.tempId);
    setUploading(false);
    setUploadProgress(0);
    setUploadSnapshot(null);
    setViewSourceType(null);
    onChange(material.tempId, {
      File: null,
      FileName: null,
      FileSize: null,
      MaterialUrl: '',
      SourceType: DOC_SOURCE_UPLOAD,
    });
  };

  const handleUrlChange = (value) => {
    const trimmed = String(value ?? '').trim();
    setLinkSnapshot({ MaterialUrl: value });

    if (!trimmed) {
      setViewSourceType(DOC_SOURCE_LINK);
      if (uploadSnapshot) {
        onChange(material.tempId, {
          ...uploadSnapshot,
          SourceType: DOC_SOURCE_UPLOAD,
        });
      } else if (resolvedSourceType === DOC_SOURCE_LINK) {
        onChange(material.tempId, {
          SourceType: DOC_SOURCE_LINK,
          MaterialUrl: '',
          File: null,
          FileName: null,
          FileSize: null,
        });
      }
      return;
    }

    setViewSourceType(null);
    onChange(material.tempId, {
      MaterialUrl: value,
      SourceType: DOC_SOURCE_LINK,
      File: null,
      FileName: null,
      FileSize: null,
    });
  };

  const fileError = fileTypeError || errors.File;
  const displayFileName = material.File?.name ?? material.FileName ?? '';
  const displayFileSize = material.File?.size ?? material.FileSize;
  const downloadUrl = sourceType === DOC_SOURCE_LINK
    ? String(displayLinkUrl ?? '').trim()
    : String(material.MaterialUrl ?? '').trim();
  const downloadFile = sourceType === DOC_SOURCE_UPLOAD ? (material.File ?? null) : null;

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
          <DescriptionRoundedIcon sx={{ fontSize: 20, color: theme.color }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.35 }}>
            Tài liệu học tập
          </Typography>
        </Box>
      ) : null}

      <ContentFieldLabel sx={{ mb: 0.75, fontSize: 12, fontWeight: 700, color: '#64748B' }}>
        Nguồn tài liệu
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
            disabled={disabled || uploading}
            onSelect={handleSourceChange}
          />
        ))}
      </Box>

      {sourceType === DOC_SOURCE_UPLOAD ? (
        <>
          {!hasUploadedFile ? (
            <Box
              onDragEnter={(event) => {
                event.preventDefault();
                if (!disabled) setDragOver(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (!disabled) setDragOver(true);
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
              <InsertDriveFileRoundedIcon sx={{ fontSize: compact ? 28 : 24, color: theme.color }} />
              <Typography
                sx={{ fontSize: 13, fontWeight: 600, color: TEXT, textAlign: 'center', lineHeight: 1.45 }}
              >
                Kéo thả file vào đây hoặc chọn file
              </Typography>
              <Typography sx={{ fontSize: 12, color: MUTED, textAlign: 'center' }}>
                Hỗ trợ PDF, DOC, DOCX · Tối đa {getMaterialMaxFileSizeLabel()}
              </Typography>
              <AppButton
                variant="outlined"
                size="small"
                disabled={disabled || uploading}
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
                {uploading ? 'Đang tải lên...' : 'Chọn file'}
              </AppButton>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple={false}
                accept={DOC_ALLOWED_EXTENSIONS.join(',')}
                disabled={disabled || uploading}
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
                <InsertDriveFileRoundedIcon sx={{ fontSize: 22, color: theme.color, flexShrink: 0 }} />
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
                    {displayFileName || 'Đang tải tài liệu...'}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.2, lineHeight: 1.4 }}>
                    {uploading
                      ? `Đang tải lên... ${uploadProgress}%`
                      : [
                          formatFileSize(displayFileSize),
                          displayFileName ? getDocFileTypeLabel(displayFileName) : '',
                        ].filter(Boolean).join(' · ')}
                  </Typography>
                </Box>
                <MaterialDownloadButton
                  url={downloadUrl}
                  file={downloadFile}
                  fileName={displayFileName}
                  fallbackTitle={material.Title || 'tai-lieu'}
                  disabled={disabled || uploading || !downloadUrl}
                />
                <IconButton
                  size="small"
                  disabled={disabled || uploading}
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
          {uploadError && (
            <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.5 }}>{uploadError}</Typography>
          )}
        </>
      ) : (
        <Box>
          <ContentFieldLabel sx={{ mb: 0.5, fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            Link tài liệu
          </ContentFieldLabel>
          <InputBase
            value={displayLinkUrl}
            onChange={(event) => handleUrlChange(event.target.value)}
            disabled={disabled}
            placeholder="https://drive.google.com/... hoặc link tài liệu"
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
            Dán link Google Drive hoặc URL tài liệu công khai.
          </Typography>
          {errors.MaterialUrl && (
            <Typography sx={{ fontSize: 11, color: '#DC2626', mt: 0.35 }}>
              {errors.MaterialUrl}
            </Typography>
          )}
          {String(displayLinkUrl ?? '').trim() ? (
            <Box sx={{ mt: 1 }}>
              <MaterialDownloadButton
                variant="button"
                size="small"
                url={String(displayLinkUrl).trim()}
                fileName={displayFileName}
                fallbackTitle={material.Title || 'tai-lieu'}
                disabled={disabled}
                sx={{
                  minWidth: 0,
                  height: 34,
                  px: 1.5,
                  borderRadius: '10px',
                  fontSize: 13,
                  fontWeight: 600,
                  borderColor: 'rgba(15,23,42,0.12)',
                  color: PRIMARY,
                  '&:hover': { borderColor: PRIMARY, bgcolor: 'rgba(8,145,178,0.06)' },
                }}
              />
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
}
