import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/shared/ui/Toast';
import {
  clearCreateCourseDraft,
  saveCreateCourseStep1ToStorage,
} from '@/features/mentor/utils/mentorCourseCreateStorage';

export function useMentorCourseLeaveGuard({
  isDirty,
  form,
  instructorId,
  onPersistDraft,
  onDiscard,
}) {
  const navigate = useNavigate();
  const allowLeaveRef = useRef(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingTo, setPendingTo] = useState(null);
  const [saving, setSaving] = useState(false);

  const completeLeave = useCallback(
    (to) => {
      allowLeaveRef.current = true;
      setDialogOpen(false);
      setPendingTo(null);

      if (to === 'back') {
        navigate(-1);
        return;
      }

      if (to) navigate(to);
    },
    [navigate],
  );

  const requestLeave = useCallback(
    (to = '/mentor/courses') => {
      if (!isDirty || allowLeaveRef.current) {
        if (to === 'back') navigate(-1);
        else navigate(to);
        return;
      }

      setPendingTo(to);
      setDialogOpen(true);
    },
    [isDirty, navigate],
  );

  const handleStay = useCallback(() => {
    setDialogOpen(false);
    setPendingTo(null);
  }, []);

  const handleDiscard = useCallback(() => {
    if (onDiscard) {
      onDiscard();
    } else {
      clearCreateCourseDraft();
    }
    const destination =
      pendingTo === 'back' ? '/mentor/courses' : (pendingTo ?? '/mentor/courses');
    completeLeave(destination);
  }, [completeLeave, onDiscard, pendingTo]);

  const handleSaveDraft = useCallback(async () => {
    setSaving(true);
    try {
      if (onPersistDraft) {
        await onPersistDraft();
      } else {
        saveCreateCourseStep1ToStorage(form, instructorId ?? 0);
      }
      toast.success('Đã lưu bản nháp.');
      completeLeave(pendingTo ?? '/mentor/courses');
    } finally {
      setSaving(false);
    }
  }, [completeLeave, form, instructorId, onPersistDraft, pendingTo]);

  useEffect(() => {
    if (!isDirty) return undefined;

    window.history.pushState({ mentorCreateGuard: true }, '', window.location.href);

    const onPopState = () => {
      if (allowLeaveRef.current) return;

      window.history.pushState({ mentorCreateGuard: true }, '', window.location.href);
      setPendingTo('back');
      setDialogOpen(true);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [isDirty]);

  return {
    dialogOpen,
    saving,
    requestLeave,
    handleStay,
    handleDiscard,
    handleSaveDraft,
  };
}
