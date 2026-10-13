import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import { toast } from '@/shared/ui/Toast';
import MentorCourseContentBuilder from '@/features/mentor/components/course/MentorCourseContentBuilder';
import MentorContentOverview from '@/features/mentor/components/course/MentorContentOverview';
import MentorCourseContentFooterActions, {
  COURSE_CONTENT_MOBILE_FOOTER_ID,
} from '@/features/mentor/components/course/MentorCourseContentFooterActions';
import ScrollToTopButton from '@/shared/ui/ScrollToTopButton';
import MentorCourseCreateStepIndicator from '@/features/mentor/components/course/MentorCourseCreateStepIndicator';
import MentorCourseLeaveDialog from '@/features/mentor/components/course/MentorCourseLeaveDialog';
import MentorChapterDraftDialog from '@/features/mentor/components/course/MentorChapterDraftDialog';
import { useMentorCourseLeaveGuard } from '@/features/mentor/hooks/useMentorCourseLeaveGuard';
import { useNavigationGuard } from '@/context/NavigationGuardContext';
import { saveCreateCourseContent } from '@/features/mentor/services/mentorCourseService';
import { uploadPendingMaterialsInPaths } from '@/features/mentor/utils/mentorMaterialUploadUtils';
import { getUser } from '@/features/auth/utils/authUtils';
import {
  createEmptyMaterial,
  createEmptyNode,
  createEmptyPath,
  chapterCanPublish,
  chapterHasContent,
  getChapterPublishBlockReason,
  getLessonPublishBlockReason,
  lessonCanPublish,
  normalizeChapterPublishState,
  syncPathsChapterPublishState,
  lessonHasContent,
  materialHasContent,
  getMaterialPersistentId,
  hasContentValidationErrors,
  getFirstContentErrorTarget,
  parseContentFocusTarget,
  validateCourseContent,
  validatePathForSave,
  makePathDirtyKey,
  makeNodeDirtyKey,
  makeMaterialDirtyKey,
  pathHasAnyDirty,
  clearDirtyKeysForPath,
  withNormalizedOrders,
  reorderMaterials,
  scrollToContentItem,
  MATERIAL_TYPE_LABELS,
} from '@/features/mentor/utils/mentorCourseContentUtils';
import { discardCreateCourseContentFromStorage, loadCreateCourseDraft } from '@/features/mentor/utils/mentorCourseCreateStorage';

const CREATE_CONTENT_UNSAVED_TITLE = 'Chưa lưu nháp';
const CREATE_CONTENT_UNSAVED_MESSAGE =
  'Bạn chưa nhấn Lưu nháp nên phần nội dung này chưa được lưu nháp. Bạn có muốn tiếp tục chuyển mục không?';

function getDeleteDialogContent(deleteConfirm) {
  if (!deleteConfirm) {
    return { title: 'Xác nhận', message: '' };
  }

  if (deleteConfirm.type === 'newPath') {
    return {
      title: 'Xóa chương mới?',
      message: `Bạn có chắc muốn xóa "${deleteConfirm.label}"? Chương này chưa lưu lên hệ thống.`,
    };
  }

  if (deleteConfirm.type === 'lesson') {
    return {
      title: 'Xóa bài học?',
      message: `Bạn có chắc muốn xóa "${deleteConfirm.label}"? Toàn bộ học liệu trong bài học sẽ bị xóa.`,
    };
  }

  return {
    title: 'Xóa học liệu?',
    message: `Bạn có chắc muốn xóa "${deleteConfirm.label}"? Nội dung học liệu sẽ bị xóa vĩnh viễn.`,
  };
}

function LeaveAwareBreadcrumbLink({ to, children, onNavigate, sx }) {
  return (
    <MuiLink
      component="button"
      type="button"
      underline="hover"
      onClick={() => onNavigate(to)}
      sx={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        font: 'inherit',
        p: 0,
        ...sx,
      }}
    >
      {children}
    </MuiLink>
  );
}

function updatePathInList(paths, pathTempId, patch) {
  return paths.map((path) =>
    path.tempId === pathTempId ? { ...path, ...patch } : path,
  );
}

function updateNodeInPath(paths, pathTempId, nodeTempId, patch) {
  return paths.map((path) => {
    if (path.tempId !== pathTempId) return path;
    return {
      ...path,
      nodes: (path.nodes ?? path.Nodes ?? []).map((node) =>
        node.tempId === nodeTempId ? { ...node, ...patch } : node,
      ),
    };
  });
}

function updateMaterialInPath(paths, pathTempId, nodeTempId, materialTempId, patch) {
  return paths.map((path) => {
    if (path.tempId !== pathTempId) return path;
    return {
      ...path,
      nodes: (path.nodes ?? path.Nodes ?? []).map((node) => {
        if (node.tempId !== nodeTempId) return node;
        return {
          ...node,
          materials: (node.materials ?? node.Materials ?? []).map((material) => {
            if (material.tempId !== materialTempId) return material;
            const next = { ...material, ...patch };
            const persistentId = getMaterialPersistentId(material);
            if (persistentId && !getMaterialPersistentId(next)) {
              next.MaterialId = persistentId;
            } else if (getMaterialPersistentId(next)) {
              next.MaterialId = getMaterialPersistentId(next);
            }
            return next;
          }),
        };
      }),
    };
  });
}

export default function MentorCreateCourseContentPage() {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [paths, setPaths] = useState([]);
  const [ready, setReady] = useState(false);
  const [validationErrors, setValidationErrors] = useState({ root: [], paths: {} });
  const [expandedPaths, setExpandedPaths] = useState({});
  const [expandedNodes, setExpandedNodes] = useState({});
  const [dirtyKeys, setDirtyKeys] = useState({});
  const [isCourseContentDraftSaved, setIsCourseContentDraftSaved] = useState(false);
  const [savingChapterId, setSavingChapterId] = useState(null);
  const [chapterDraftDialogOpen, setChapterDraftDialogOpen] = useState(false);
  const [pendingChapterTempId, setPendingChapterTempId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [focusTarget, setFocusTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [sessionNavDialogOpen, setSessionNavDialogOpen] = useState(false);
  const [savingSessionNav, setSavingSessionNav] = useState(false);
  const [externalNavDialogOpen, setExternalNavDialogOpen] = useState(false);
  const [savingExternalNav, setSavingExternalNav] = useState(false);
  const pendingSessionNavRef = useRef(null);
  const pendingExternalNavRef = useRef(null);

  const { registerNavigationGuard } = useNavigationGuard() ?? {};

  const instructorId = getUser()?.userId ?? null;
  const courseName = course?.CourseName ?? '';

  const isDirty = useMemo(
    () => paths.some((path) => pathHasAnyDirty(dirtyKeys, path.tempId)),
    [paths, dirtyKeys],
  );

  const markDirty = useCallback((key) => {
    if (!key) return;
    setDirtyKeys((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, []);

  const persistDraft = useCallback(async ({ markAllSaved = true } = {}) => {
    if (!course) return;
    await saveCreateCourseContent(course, paths);
    setIsCourseContentDraftSaved(true);
    if (markAllSaved) {
      setDirtyKeys({});
    }
  }, [course, paths]);

  const requestContentNavigation = useCallback((navigateFn) => {
    if (!navigateFn) return;
    if (!isDirty) {
      navigateFn();
      return;
    }
    pendingSessionNavRef.current = navigateFn;
    setSessionNavDialogOpen(true);
  }, [isDirty]);

  const handleSessionNavStay = useCallback(() => {
    pendingSessionNavRef.current = null;
    setSessionNavDialogOpen(false);
  }, []);

  const handleSessionNavSkip = useCallback(() => {
    const navigateFn = pendingSessionNavRef.current;
    pendingSessionNavRef.current = null;
    setSessionNavDialogOpen(false);
    navigateFn?.();
  }, []);

  const handleSessionNavSaveDraft = useCallback(async () => {
    const navigateFn = pendingSessionNavRef.current;
    setSavingSessionNav(true);
    try {
      await persistDraft();
      toast.success('Đã lưu bản nháp trong phiên làm việc.');
      pendingSessionNavRef.current = null;
      setSessionNavDialogOpen(false);
      navigateFn?.();
    } finally {
      setSavingSessionNav(false);
    }
  }, [persistDraft]);

  const discardContentSessionSnapshot = useCallback(() => {
    discardCreateCourseContentFromStorage();
  }, []);

  const requestExternalNavigation = useCallback((navigateFn) => {
    if (!navigateFn) return;
    if (!isDirty) {
      navigateFn();
      return;
    }
    pendingExternalNavRef.current = navigateFn;
    setExternalNavDialogOpen(true);
  }, [isDirty]);

  const handleExternalNavStay = useCallback(() => {
    pendingExternalNavRef.current = null;
    setExternalNavDialogOpen(false);
  }, []);

  const handleExternalNavDiscard = useCallback(() => {
    const navigateFn = pendingExternalNavRef.current;
    discardContentSessionSnapshot();
    pendingExternalNavRef.current = null;
    setExternalNavDialogOpen(false);
    navigateFn?.();
  }, [discardContentSessionSnapshot]);

  const handleExternalNavSaveDraft = useCallback(async () => {
    const navigateFn = pendingExternalNavRef.current;
    setSavingExternalNav(true);
    try {
      await persistDraft();
      toast.success('Đã lưu bản nháp trong phiên làm việc.');
      pendingExternalNavRef.current = null;
      setExternalNavDialogOpen(false);
      navigateFn?.();
    } finally {
      setSavingExternalNav(false);
    }
  }, [persistDraft]);

  useEffect(() => {
    if (!registerNavigationGuard) return undefined;
    return registerNavigationGuard(requestExternalNavigation);
  }, [registerNavigationGuard, requestExternalNavigation]);

  const {
    dialogOpen,
    saving,
    requestLeave,
    handleStay,
    handleDiscard,
    handleSaveDraft,
  } = useMentorCourseLeaveGuard({
    isDirty,
    form: {},
    instructorId,
    onPersistDraft: persistDraft,
    onDiscard: discardContentSessionSnapshot,
  });

  useEffect(() => {
    const draft = loadCreateCourseDraft();
    if (!draft?.course) {
      toast.error('Vui lòng hoàn thành thông tin cơ bản trước.');
      navigate('/mentor/courses/create', { replace: true });
      return;
    }

    const loadedPaths = withNormalizedOrders(draft.paths ?? []);

    setCourse(draft.course);
    setPaths(loadedPaths);
    setDirtyKeys({});
    setIsCourseContentDraftSaved(
      Boolean(draft.meta?.contentDraftSaved) || loadedPaths.length > 0,
    );
    setReady(true);
  }, [navigate]);

  useEffect(() => {
    if (!isDirty) return undefined;

    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const applyPaths = useCallback((updater) => {
    setPaths((prev) => withNormalizedOrders(updater(prev)));
    setValidationErrors({ root: [], paths: {} });
  }, []);

  const handleNavigateToContent = useCallback((target) => {
    requestContentNavigation(() => {
      setFocusTarget(target);
      scrollToContentItem(target, { setExpandedPaths, setExpandedNodes });
    });
  }, [requestContentNavigation]);

  const handleAddPath = () => {
    const newPath = createEmptyPath();
    markDirty(makePathDirtyKey(newPath.tempId));
    applyPaths((prev) => [...prev, newPath]);
    setExpandedPaths((prev) => ({ ...prev, [newPath.tempId]: true }));
  };

  const handlePathChange = (pathTempId, patch) => {
    if (patch.IsActive === 1 || patch.IsActive === true) {
      const path = paths.find((item) => item.tempId === pathTempId);
      const nextPath = path ? { ...path, ...patch } : null;
      if (nextPath && !chapterCanPublish(nextPath)) {
        toast.error(getChapterPublishBlockReason(nextPath));
        return;
      }
    }

    markDirty(makePathDirtyKey(pathTempId));
    applyPaths((prev) => updatePathInList(prev, pathTempId, patch));
  };

  const handleDeleteNewPath = (pathTempId) => {
    const path = paths.find((item) => item.tempId === pathTempId);
    if (!path || path.PathId) return;

    applyPaths((prev) => prev.filter((p) => p.tempId !== pathTempId));
    setDirtyKeys((prev) => clearDirtyKeysForPath(prev, pathTempId));
    setExpandedPaths((prev) => {
      const next = { ...prev };
      delete next[pathTempId];
      return next;
    });
  };

  const requestDeleteNewPath = (pathTempId) => {
    const path = paths.find((item) => item.tempId === pathTempId);
    if (!path || path.PathId) return;

    if (!chapterHasContent(path)) {
      handleDeleteNewPath(pathTempId);
      return;
    }

    setDeleteConfirm({
      type: 'newPath',
      pathTempId,
      label: String(path.PathName ?? '').trim() || 'Chương mới',
    });
  };

  const requestDeleteNode = (pathTempId, nodeTempId) => {
    const path = paths.find((item) => item.tempId === pathTempId);
    const node = (path?.nodes ?? []).find((item) => item.tempId === nodeTempId);
    if (!node) return;
    if (!lessonHasContent(node)) {
      handleNodeDelete(pathTempId, nodeTempId);
      return;
    }
    const label = String(node?.NodeName ?? '').trim() || 'Bài học này';
    setDeleteConfirm({ type: 'lesson', pathTempId, nodeTempId, label });
  };

  const requestDeleteMaterial = (pathTempId, nodeTempId, materialTempId) => {
    const path = paths.find((item) => item.tempId === pathTempId);
    const node = (path?.nodes ?? []).find((item) => item.tempId === nodeTempId);
    const material = (node?.materials ?? []).find((item) => item.tempId === materialTempId);
    if (!material) return;
    if (!materialHasContent(material)) {
      handleMaterialDelete(pathTempId, nodeTempId, materialTempId);
      return;
    }
    const title = String(material?.Title ?? '').trim();
    const typeLabel = MATERIAL_TYPE_LABELS[material?.MaterialType] ?? 'Học liệu';
    const label = title || `${typeLabel} này`;
    setDeleteConfirm({
      type: 'material',
      pathTempId,
      nodeTempId,
      materialTempId,
      label,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'newPath') {
      handleDeleteNewPath(deleteConfirm.pathTempId);
    } else if (deleteConfirm.type === 'lesson') {
      handleNodeDelete(deleteConfirm.pathTempId, deleteConfirm.nodeTempId);
    } else {
      handleMaterialDelete(
        deleteConfirm.pathTempId,
        deleteConfirm.nodeTempId,
        deleteConfirm.materialTempId,
      );
    }

    setDeleteConfirm(null);
  };

  const handleAddNode = (pathTempId) => {
    const newNode = createEmptyNode();
    markDirty(makeNodeDirtyKey(pathTempId, newNode.tempId));
    applyPaths((prev) =>
      prev.map((path) =>
        path.tempId === pathTempId
          ? { ...path, nodes: [...(path.nodes ?? []), newNode] }
          : path,
      ),
    );
    setExpandedNodes((prev) => ({ ...prev, [newNode.tempId]: true }));
  };

  const handleNodeChange = (pathTempId, nodeTempId, patch) => {
    if (patch.IsActive === 1 || patch.IsActive === true) {
      const path = paths.find((item) => item.tempId === pathTempId);
      const node = (path?.nodes ?? []).find((item) => item.tempId === nodeTempId);
      const nextNode = node ? { ...node, ...patch } : null;
      if (nextNode && !lessonCanPublish(nextNode)) {
        toast.error(getLessonPublishBlockReason(nextNode));
        return;
      }
    }

    markDirty(makeNodeDirtyKey(pathTempId, nodeTempId));
    applyPaths((prev) => updateNodeInPath(prev, pathTempId, nodeTempId, patch));
  };

  const handleNodeDelete = (pathTempId, nodeTempId) => {
    applyPaths((prev) =>
      prev.map((path) =>
        path.tempId === pathTempId
          ? { ...path, nodes: (path.nodes ?? []).filter((node) => node.tempId !== nodeTempId) }
          : path,
      ),
    );
    setExpandedNodes((prev) => {
      const next = { ...prev };
      delete next[nodeTempId];
      return next;
    });
  };

  const handleAddMaterial = (pathTempId, nodeTempId) => {
    const newMaterial = createEmptyMaterial();
    markDirty(makeMaterialDirtyKey(pathTempId, nodeTempId, newMaterial.tempId));
    applyPaths((prev) =>
      prev.map((path) => {
        if (path.tempId !== pathTempId) return path;
        return {
          ...path,
          nodes: (path.nodes ?? []).map((node) =>
            node.tempId === nodeTempId
              ? { ...node, materials: [...(node.materials ?? []), newMaterial] }
              : node,
          ),
        };
      }),
    );
  };

  const handleMaterialChange = (pathTempId, nodeTempId, materialTempId, patch) => {
    markDirty(makeMaterialDirtyKey(pathTempId, nodeTempId, materialTempId));
    applyPaths((prev) =>
      updateMaterialInPath(prev, pathTempId, nodeTempId, materialTempId, patch),
    );
  };

  const handleMaterialDelete = (pathTempId, nodeTempId, materialTempId) => {
    applyPaths((prev) =>
      prev.map((path) => {
        if (path.tempId !== pathTempId) return path;
        return {
          ...path,
          nodes: (path.nodes ?? []).map((node) =>
            node.tempId === nodeTempId
              ? {
                ...node,
                materials: (node.materials ?? []).filter(
                  (material) => material.tempId !== materialTempId,
                ),
              }
              : node,
          ),
        };
      }),
    );
  };

  const handleMaterialReorder = (pathTempId, nodeTempId, fromIndex, toIndex) => {
    applyPaths((prev) =>
      prev.map((path) => {
        if (path.tempId !== pathTempId) return path;
        return {
          ...path,
          nodes: (path.nodes ?? []).map((node) => {
            if (node.tempId !== nodeTempId) return node;
            return {
              ...node,
              materials: reorderMaterials(node.materials ?? [], fromIndex, toIndex),
            };
          }),
        };
      }),
    );
  };

  const executeChapterSave = async (pathTempId) => {
    const path = paths.find((item) => item.tempId === pathTempId);
    if (!path) return false;

    const pathErrors = validatePathForSave(path, paths);
    if (Object.keys(pathErrors).length > 0) {
      setValidationErrors((prev) => ({
        ...prev,
        paths: {
          ...(prev.paths ?? {}),
          [pathTempId]: {
            ...(prev.paths?.[pathTempId] ?? {}),
            ...pathErrors,
          },
        },
      }));

      const firstNodeError = Object.values(pathErrors.nodes ?? {})[0];
      const firstMaterialError = Object.values(firstNodeError?.materials ?? {})[0];
      const toastMessage = pathErrors.PathName
        ?? pathErrors._publish
        ?? pathErrors._nodes
        ?? firstNodeError?.NodeName
        ?? firstNodeError?._publish
        ?? firstNodeError?._materials
        ?? firstMaterialError?.Title
        ?? Object.values(firstMaterialError ?? {}).find(Boolean)
        ?? 'Vui lòng kiểm tra lại thông tin chương.';
      toast.error(toastMessage);
      return false;
    }

    setSavingChapterId(pathTempId);
    try {
      await persistDraft({ markAllSaved: false });
      setDirtyKeys((prev) => clearDirtyKeysForPath(prev, pathTempId));
      toast.success('Đã lưu chương.');
      return true;
    } finally {
      setSavingChapterId(null);
    }
  };

  const handleSaveChapter = (pathTempId) => {
    if (!isCourseContentDraftSaved) {
      setPendingChapterTempId(pathTempId);
      setChapterDraftDialogOpen(true);
      return;
    }

    void executeChapterSave(pathTempId);
  };

  const handleChapterDraftDialogSave = async () => {
    if (!pendingChapterTempId) return;

    const saved = await executeChapterSave(pendingChapterTempId);
    if (!saved) return;

    setIsCourseContentDraftSaved(true);
    setChapterDraftDialogOpen(false);
    setPendingChapterTempId(null);
  };

  const handleChapterDraftDialogCancel = () => {
    if (savingChapterId) return;
    setChapterDraftDialogOpen(false);
    setPendingChapterTempId(null);
  };

  const handleSaveDraftClick = async () => {
    setSavingDraft(true);
    try {
      await persistDraft();
      toast.success('Đã lưu bản nháp nội dung khóa học.');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleNext = async () => {
    const errors = validateCourseContent(paths);
    setValidationErrors(errors);

    if (hasContentValidationErrors(errors)) {
      toast.error('Vui lòng kiểm tra lại cấu trúc nội dung khóa học.');

      setExpandedPaths((prev) => {
        const next = { ...prev };
        paths.forEach((path) => {
          if (errors.paths?.[path.tempId]) next[path.tempId] = true;
        });
        return next;
      });

      setExpandedNodes((prev) => {
        const next = { ...prev };
        paths.forEach((path) => {
          const pathErrors = errors.paths?.[path.tempId];
          if (!pathErrors?.nodes) return;
          (path.nodes ?? []).forEach((node) => {
            if (pathErrors.nodes[node.tempId]) next[node.tempId] = true;
          });
        });
        return next;
      });

      const target = getFirstContentErrorTarget(errors, paths);
      if (target) {
        const focus = parseContentFocusTarget(target, paths);
        if (focus) setFocusTarget(focus);
        setTimeout(() => {
          document
            .querySelector(`[data-content-error="${target}"]`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 220);
      }
      return;
    }

    setSubmitting(true);
    try {
      const uploadedPaths = await uploadPendingMaterialsInPaths(paths);
      const result = await saveCreateCourseContent(course, uploadedPaths);
      if (!result.ok) {
        toast.error('Không thể lưu nội dung. Vui lòng thử lại.');
        return;
      }
      navigate('/mentor/courses/create/review');
    } catch (error) {
      toast.error(error?.message || 'Không thể tải học liệu lên. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready || !course) return null;

  const deleteDialogContent = getDeleteDialogContent(deleteConfirm);

  const footerActions = (
    <MentorCourseContentFooterActions
      onBack={() => requestLeave('/mentor/courses/create')}
      onSaveDraft={handleSaveDraftClick}
      onPrimary={handleNext}
      primaryLabel="Tiếp theo"
      primaryEndIcon={!submitting ? <ArrowForwardRoundedIcon /> : undefined}
      backDisabled={submitting || savingDraft || saving}
      saveDraftDisabled={submitting || saving}
      primaryDisabled={savingDraft || saving}
      saveDraftLoading={savingDraft}
      primaryLoading={submitting}
    />
  );

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', xl: 1600 }, mx: 'auto' }}>
      <Breadcrumbs
        separator="/"
        sx={{ mb: 2, '& .MuiBreadcrumbs-separator': { color: '#64748B', mx: 0.5 } }}
      >
        <LeaveAwareBreadcrumbLink
          to="/home"
          onNavigate={requestLeave}
          sx={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}
        >
          Trang chủ
        </LeaveAwareBreadcrumbLink>
        <LeaveAwareBreadcrumbLink
          to="/mentor/courses"
          onNavigate={requestLeave}
          sx={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}
        >
          Khóa học của tôi
        </LeaveAwareBreadcrumbLink>
        <LeaveAwareBreadcrumbLink
          to="/mentor/courses/create"
          onNavigate={requestLeave}
          sx={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}
        >
          Tạo khóa học
        </LeaveAwareBreadcrumbLink>
        <Typography sx={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>
          Xây nội dung
        </Typography>
      </Breadcrumbs>

      <MentorCourseCreateStepIndicator currentStep={2} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 280px' },
          gap: { xs: 2, lg: 2 },
          alignItems: 'start',
        }}
      >
        <MentorCourseContentBuilder
          paths={paths}
          courseTitle={courseName}
          errors={validationErrors}
          expandedPaths={expandedPaths}
          expandedNodes={expandedNodes}
          onTogglePath={(pathTempId) =>
            setExpandedPaths((prev) => ({
              ...prev,
              [pathTempId]: prev[pathTempId] === false,
            }))
          }
          onToggleNode={(nodeTempId) =>
            setExpandedNodes((prev) => ({
              ...prev,
              [nodeTempId]: prev[nodeTempId] === false,
            }))
          }
          onAddPath={handleAddPath}
          onPathChange={handlePathChange}
          onDeleteNewPath={requestDeleteNewPath}
          onAddNode={handleAddNode}
          onNodeChange={handleNodeChange}
          onNodeDelete={requestDeleteNode}
          onAddMaterial={handleAddMaterial}
          onMaterialChange={handleMaterialChange}
          onMaterialDelete={requestDeleteMaterial}
          onMaterialReorder={handleMaterialReorder}
          disabled={submitting || savingDraft || Boolean(savingChapterId)}
          dirtyKeys={dirtyKeys}
          savingChapterId={savingChapterId}
          onSaveChapter={handleSaveChapter}
          focusTarget={focusTarget}
          onRequestContentNavigation={requestContentNavigation}
        />

        <MentorContentOverview
          paths={paths}
          courseName={courseName}
          focusTarget={focusTarget}
          footer={footerActions}
          onNavigateToItem={handleNavigateToContent}
        />
      </Box>

      <Box
        id={COURSE_CONTENT_MOBILE_FOOTER_ID}
        sx={{
          display: { xs: 'block', lg: 'none' },
          position: 'sticky',
          bottom: 0,
          zIndex: 5,
          mt: 2.5,
          pt: 1.5,
          pb: 'max(20px, env(safe-area-inset-bottom, 0px))',
          bgcolor: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(15,23,42,0.08)',
        }}
      >
        {footerActions}
      </Box>

      <ScrollToTopButton
        avoidSelectors={['#app-site-footer', `#${COURSE_CONTENT_MOBILE_FOOTER_ID}`]}
      />

      <MentorCourseLeaveDialog
        open={dialogOpen}
        onStay={handleStay}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraft}
        saving={saving}
        title={CREATE_CONTENT_UNSAVED_TITLE}
        message={CREATE_CONTENT_UNSAVED_MESSAGE}
        discardLabel="Tiếp tục"
      />

      <MentorCourseLeaveDialog
        open={externalNavDialogOpen}
        onStay={handleExternalNavStay}
        onDiscard={handleExternalNavDiscard}
        onSaveDraft={handleExternalNavSaveDraft}
        saving={savingExternalNav}
        title={CREATE_CONTENT_UNSAVED_TITLE}
        message={CREATE_CONTENT_UNSAVED_MESSAGE}
        discardLabel="Tiếp tục"
      />

      <MentorCourseLeaveDialog
        open={sessionNavDialogOpen}
        onStay={handleSessionNavStay}
        onDiscard={handleSessionNavSkip}
        onSaveDraft={handleSessionNavSaveDraft}
        saving={savingSessionNav}
        title={CREATE_CONTENT_UNSAVED_TITLE}
        message={CREATE_CONTENT_UNSAVED_MESSAGE}
        discardLabel="Tiếp tục"
      />

      <MentorChapterDraftDialog
        open={chapterDraftDialogOpen}
        onCancel={handleChapterDraftDialogCancel}
        onSaveDraft={handleChapterDraftDialogSave}
        saving={Boolean(savingChapterId)}
      />

      <ConfirmDialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title={deleteDialogContent.title}
        message={deleteDialogContent.message}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        destructive
      />
    </Box>
  );
}
