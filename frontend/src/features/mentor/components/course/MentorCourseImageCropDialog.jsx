import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  alpha,
} from '@mui/material';
import AppButton from '@/shared/ui/AppButton';
import {
  clampCropOffset,
  getCroppedImageDataUrl,
  getRenderedSize,
  validateThumbnailDataUrl,
} from '@/features/mentor/utils/mentorCourseImageUtils';
import { toast } from '@/shared/ui/Toast';
import { COURSE_THUMBNAIL_ASPECT, PRIMARY } from './mentorCourseCreateStyles';

const CROP_WIDTH = 300;
const CROP_HEIGHT = Math.round(CROP_WIDTH / COURSE_THUMBNAIL_ASPECT);
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.08;

export default function MentorCourseImageCropDialog({ open, imageSrc, onClose, onSave }) {
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStateRef = useRef(null);
  const cropBoxRef = useRef(null);

  const clampOffset = useCallback(
    (nextOffset, nextZoom = zoom) => {
      if (!imageSize.width) return nextOffset;

      const { width, height } = getRenderedSize(
        imageSize.width,
        imageSize.height,
        CROP_WIDTH,
        CROP_HEIGHT,
        nextZoom,
      );

      return clampCropOffset(nextOffset, width, height, CROP_WIDTH, CROP_HEIGHT);
    },
    [imageSize, zoom],
  );

  useEffect(() => {
    if (!open || !imageSrc) return;

    const image = new Image();
    image.onload = () => {
      setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
      setZoom(MIN_ZOOM);
      setOffset({ x: 0, y: 0 });
    };
    image.src = imageSrc;
  }, [open, imageSrc]);

  useEffect(() => {
    if (!imageSize.width) return;
    setOffset((prev) => clampOffset(prev, zoom));
  }, [zoom, imageSize, clampOffset]);

  const handlePointerDown = useCallback((event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: { ...offset },
    };
  }, [offset]);

  const handlePointerMove = useCallback((event) => {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) return;

    const nextOffset = {
      x: dragStateRef.current.startOffset.x + (event.clientX - dragStateRef.current.startX),
      y: dragStateRef.current.startOffset.y + (event.clientY - dragStateRef.current.startY),
    };

    setOffset(clampOffset(nextOffset));
  }, [clampOffset]);

  const handlePointerUp = useCallback((event) => {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) return;
    dragStateRef.current = null;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const handleWheel = useCallback((event) => {
    event.preventDefault();

    if (!imageSize.width) return;

    const direction = event.deltaY > 0 ? -1 : 1;
    setZoom((prevZoom) => {
      const nextZoom = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, Number((prevZoom + direction * ZOOM_STEP).toFixed(3))),
      );
      setOffset((prevOffset) => clampOffset(prevOffset, nextZoom));
      return nextZoom;
    });
  }, [clampOffset, imageSize.width]);

  useEffect(() => {
    const node = cropBoxRef.current;
    if (!open || !node) return undefined;

    const onWheel = (event) => {
      event.preventDefault();
      handleWheel(event);
    };

    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, [open, handleWheel]);

  const handleSave = async () => {
    if (!imageSrc) return;

    setSaving(true);
    try {
      const cropped = await getCroppedImageDataUrl(imageSrc, {
        cropWidth: CROP_WIDTH,
        cropHeight: CROP_HEIGHT,
        zoom,
        offset,
      });

      const validationError = validateThumbnailDataUrl(cropped);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      onSave(cropped);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const { width: renderedWidth, height: renderedHeight } = imageSize.width
    ? getRenderedSize(imageSize.width, imageSize.height, CROP_WIDTH, CROP_HEIGHT, zoom)
    : { width: 0, height: 0 };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Chọn vùng ảnh</DialogTitle>
      <DialogContent sx={{ pt: 0.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Kéo ảnh để chọn vùng hiển thị. Cuộn chuột để phóng to hoặc thu nhỏ.
        </Typography>

        <Box
          ref={cropBoxRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          sx={{
            position: 'relative',
            width: CROP_WIDTH,
            height: CROP_HEIGHT,
            mx: 'auto',
            overflow: 'hidden',
            borderRadius: '12px',
            bgcolor: '#0F172A',
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          {imageSrc && imageSize.width > 0 && (
            <Box
              component="img"
              src={imageSrc}
              alt=""
              draggable={false}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: renderedWidth,
                height: renderedHeight,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                pointerEvents: 'none',
              }}
            />
          )}

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              boxShadow: `0 0 0 9999px ${alpha('#0F172A', 0.62)}`,
              border: '2px solid #FFFFFF',
              borderRadius: '10px',
              pointerEvents: 'none',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)
              `,
              backgroundSize: '33.33% 100%, 100% 33.33%',
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <AppButton variant="outlined" onClick={onClose} disabled={saving}>
          Hủy
        </AppButton>
        <AppButton
          loading={saving}
          onClick={handleSave}
          sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: '#0E7490' } }}
        >
          Lưu ảnh
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
