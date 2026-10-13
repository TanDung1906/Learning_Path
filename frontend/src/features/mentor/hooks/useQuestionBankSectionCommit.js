import { useCallback, useRef } from 'react';
import { toast } from '@/shared/ui/Toast';

/**
 * =============================================================================
 * useQuestionBankSectionCommit — Hook flush editor + chặn navigation
 * =============================================================================
 *
 * MỤC ĐÍCH: Đồng bộ nội dung editor đang gõ trước khi lưu/navigate;
 *            chặn chuyển trang khi đang upload file.
 *
 * LUỒNG:
 *   1. BuilderPanel đăng ký controls (flush, isBusy) qua bindSectionControls
 *   2. Trước khi navigate/lưu → flushActiveSection() đẩy text đang gõ vào state
 *   3. prepareSectionNavigation() kiểm tra busy → toast cảnh báo nếu đang upload
 */
export default function useQuestionBankSectionCommit() {
  // controlsRef: lưu reference tới { flush, isBusy } từ MentorTestSectionCard
  const controlsRef = useRef(null);

  // Đăng ký controls từ section editor con (gọi từ BuilderPanel)
  const bindSectionControls = useCallback((controls) => {
    controlsRef.current = controls;
  }, []);

  // Flush: đẩy nội dung đang gõ trong editor vào state parent
  const flushActiveSection = useCallback(() => {
    controlsRef.current?.flush?.();
  }, []);

  // Kiểm tra section có đang busy không (upload file hoặc editor đang xử lý)
  const isActiveSectionBusy = useCallback((activeSection) => {
    if (controlsRef.current?.isBusy?.()) return true;
    return Boolean(activeSection?.File);
  }, []);

  // Chuẩn bị navigation: flush + kiểm tra busy
  // Trả về false nếu đang upload → chặn navigate
  const prepareSectionNavigation = useCallback((activeSection) => {
    flushActiveSection();

    if (isActiveSectionBusy(activeSection)) {
      toast.warning('Đang tải file lên, vui lòng đợi hoàn tất.');
      return false;
    }

    return true;
  }, [flushActiveSection, isActiveSectionBusy]);

  return {
    bindSectionControls,
    flushActiveSection,
    isActiveSectionBusy,
    prepareSectionNavigation,
  };
};
