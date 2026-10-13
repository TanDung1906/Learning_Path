import { Box, Collapse, IconButton, Typography, alpha } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PlayLessonRoundedIcon from '@mui/icons-material/PlayLessonRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import OndemandVideoRoundedIcon from '@mui/icons-material/OndemandVideoRounded';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AppButton from '@/shared/ui/AppButton';
import {
  filterLearningMaterials,
  isEditDirty,
  isNewUnsavedPath,
  isNodeActive,
  isPathActive,
  makePathDirtyKey,
  makeNodeDirtyKey,
  makeMaterialDirtyKey,
  MATERIAL_TYPE_LABELS,
  materialHasContent,
} from '@/features/mentor/utils/mentorCourseContentUtils';
import { DETAIL_ENTITY_TITLE_SX, MUTED, PRIMARY, TEXT } from './mentorCourseCreateStyles';
import { BUILDER_PANEL_SX } from './mentorCourseContentStyles';

const MAX_VISIBLE_CHAPTERS = 5;
/** Chiều cao ước lượng mỗi dòng chương (thu gọn) — 5 dòng rồi scroll. */
const CHAPTER_ROW_HEIGHT = 50;
const CHAPTER_ACTION_ICON_SIZE = 28;
const PUBLISHED_EYE_COLOR = '#16A34A';
const HIDDEN_EYE_COLOR = '#64748B';

function getChapterLabel(path, pathIndex) {
  const prefix = `Chương ${pathIndex + 1}`;
  const name = String(path.PathName ?? '').trim();
  return name ? `${prefix} · ${name}` : prefix;
}

function getNodeLabel(node, nodeIndex) {
  const prefix = `Bài ${nodeIndex + 1}`;
  const name = String(node.NodeName ?? node.nodeName ?? '').trim();
  return name ? `${prefix} · ${name}` : prefix;
}

function getMaterialIcon(materialType) {
  switch (materialType) {
    case 'TEXT':
      return ArticleRoundedIcon;
    case 'DOC':
      return DescriptionRoundedIcon;
    default:
      return OndemandVideoRoundedIcon;
  }
}

function getMaterialLabel(material, materialIndex) {
  const typeLabel = MATERIAL_TYPE_LABELS[material.MaterialType] ?? 'Học liệu';
  const title = String(material.Title ?? '').trim();
  if (title) return title;
  if (!materialHasContent(material)) return `${typeLabel} · chưa có nội dung`;
  return `${typeLabel} ${materialIndex + 1}`;
}

function ChapterVisibilityBadge({ path }) {
  if (path.PathId == null) return null;

  const isHidden = !isPathActive(path);

  if (isHidden) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.4,
          px: 0.75,
          py: 0.3,
          borderRadius: '999px',
          flexShrink: 0,
          alignSelf: 'center',
          color: HIDDEN_EYE_COLOR,
          bgcolor: 'rgba(100,116,139,0.12)',
          border: '1px solid rgba(100,116,139,0.22)',
        }}
        title="Chương đang ẩn"
      >
        <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} />
        <Typography
          component="span"
          sx={{
            fontSize: 11.5,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}
        >
          Ẩn
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: CHAPTER_ACTION_ICON_SIZE,
        height: CHAPTER_ACTION_ICON_SIZE,
        borderRadius: '999px',
        flexShrink: 0,
        alignSelf: 'center',
        color: PUBLISHED_EYE_COLOR,
        bgcolor: 'rgba(22,163,74,0.1)',
        border: '1px solid rgba(22,163,74,0.28)',
      }}
      title="Chương đã xuất bản"
    >
      <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
    </Box>
  );
}

function LessonVisibilityBadge({ node }) {
  if (node.NodeId == null) return null;

  const isHidden = !isNodeActive(node);

  if (isHidden) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.35,
          px: 0.6,
          py: 0.25,
          borderRadius: '999px',
          flexShrink: 0,
          alignSelf: 'center',
          color: HIDDEN_EYE_COLOR,
          bgcolor: 'rgba(100,116,139,0.12)',
          border: '1px solid rgba(100,116,139,0.22)',
        }}
        title="Bài học đang ẩn"
      >
        <VisibilityOffOutlinedIcon sx={{ fontSize: 14 }} />
        <Typography
          component="span"
          sx={{
            fontSize: 10.5,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}
        >
          Ẩn
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: '999px',
        flexShrink: 0,
        alignSelf: 'center',
        color: PUBLISHED_EYE_COLOR,
        bgcolor: 'rgba(22,163,74,0.1)',
        border: '1px solid rgba(22,163,74,0.28)',
      }}
      title="Bài học đã xuất bản"
    >
      <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
    </Box>
  );
}

function SidebarRow({
  label,
  sublabel,
  icon: Icon,
  selected = false,
  dirty = false,
  hasError = false,
  indent = 0,
  onClick,
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        flex: 1,
        minWidth: 0,
        textAlign: 'left',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        font: 'inherit',
        pl: indent > 0 ? 0.5 + indent * 1.25 : 0.5,
        pr: 0.5,
        py: 0.65,
      }}
    >
      {Icon ? (
        <Icon sx={{ fontSize: 17, color: selected ? PRIMARY : MUTED, flexShrink: 0 }} />
      ) : null}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontSize: indent > 0 ? 12.5 : 13,
            fontWeight: selected ? 700 : 600,
            color: selected ? PRIMARY : TEXT,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {label}
        </Typography>
        {sublabel ? (
          <Typography sx={{ fontSize: 11, color: MUTED, mt: 0.15, lineHeight: 1.35 }}>
            {sublabel}
          </Typography>
        ) : null}
      </Box>
      {hasError ? (
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#DC2626', flexShrink: 0 }} />
      ) : dirty ? (
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#F59E0B', flexShrink: 0 }} />
      ) : null}
    </Box>
  );
}

function NodeSidebarItem({
  pathTempId,
  node,
  nodeIndex,
  expanded,
  selected,
  dirty,
  hasError,
  nodeErrors = {},
  isMaterialSelected,
  isMaterialDirty,
  onToggle,
  onSelect,
  onSelectMaterial,
  onAddMaterial,
  disabled = false,
}) {
  const materials = filterLearningMaterials(node.materials ?? node.Materials ?? []);

  return (
    <Box sx={{ mb: 0.35 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 0.15,
          borderRadius: '10px',
          border: selected ? `1px solid ${alpha(PRIMARY, 0.35)}` : '1px solid transparent',
          bgcolor: selected ? alpha(PRIMARY, 0.08) : 'transparent',
          transition: 'background-color 0.15s, border-color 0.15s',
          '&:hover': !selected ? { bgcolor: 'rgba(8,145,178,0.04)' } : undefined,
        }}
      >
        <IconButton
          size="small"
          onClick={onToggle}
          aria-label={expanded ? 'Thu gọn bài học' : 'Mở rộng học liệu'}
          sx={{
            p: 0.25,
            alignSelf: 'center',
            flexShrink: 0,
            color: MUTED,
            '&:hover': { color: PRIMARY, bgcolor: 'rgba(8,145,178,0.08)' },
          }}
        >
          {expanded ? (
            <ExpandMoreRoundedIcon sx={{ fontSize: 18 }} />
          ) : (
            <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>

        <SidebarRow
          label={getNodeLabel(node, nodeIndex)}
          sublabel={`${materials.length} học liệu`}
          icon={PlayLessonRoundedIcon}
          indent={0}
          selected={selected}
          dirty={dirty}
          hasError={hasError}
          onClick={onSelect}
        />

        <LessonVisibilityBadge node={node} />
      </Box>

      <Collapse in={expanded} unmountOnExit collapsedSize={0}>
        <Box sx={{ pl: 2.75, pt: 0.15, pb: 0.35 }}>
          {materials.length === 0 ? (
            <Typography sx={{ fontSize: 11.5, color: MUTED, pl: 0.5, py: 0.35 }}>
              Chưa có học liệu
            </Typography>
          ) : (
            materials.map((material, materialIndex) => {
              const MaterialIcon = getMaterialIcon(material.MaterialType);
              const materialSelected = isMaterialSelected?.(
                pathTempId,
                node.tempId,
                material.tempId,
              );

              return (
                <Box
                  key={material.tempId}
                  sx={{
                    mb: 0.2,
                    borderRadius: '8px',
                    border: materialSelected
                      ? `1px solid ${alpha(PRIMARY, 0.35)}`
                      : '1px solid transparent',
                    bgcolor: materialSelected ? alpha(PRIMARY, 0.08) : 'transparent',
                  }}
                >
                  <SidebarRow
                    label={getMaterialLabel(material, materialIndex)}
                    icon={MaterialIcon}
                    indent={1}
                    selected={materialSelected}
                    dirty={isMaterialDirty?.(pathTempId, node.tempId, material.tempId)}
                    hasError={Boolean(nodeErrors.materials?.[material.tempId])}
                    onClick={() => onSelectMaterial?.(pathTempId, node.tempId, material.tempId)}
                  />
                </Box>
              );
            })
          )}
          <AppButton
            variant="text"
            startIcon={<AddRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={() => onAddMaterial?.(pathTempId, node.tempId)}
            disabled={disabled}
            sx={{
              mt: 0.25,
              ml: 0.25,
              height: 28,
              fontSize: 11.5,
              fontWeight: 600,
              color: PRIMARY,
              justifyContent: 'flex-start',
              px: 0.75,
            }}
          >
            Thêm học liệu
          </AppButton>
        </Box>
      </Collapse>
    </Box>
  );
}

function ChapterSidebarItem({
  path,
  pathIndex,
  expanded,
  selected,
  dirty,
  hasError,
  disabled,
  onToggle,
  onSelect,
  onEdit,
  onDelete,
  editing = false,
  children,
}) {
  const nodes = path.nodes ?? [];

  return (
    <Box sx={{ mb: 0.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 0.25,
          minHeight: CHAPTER_ROW_HEIGHT - 4,
          pr: 0.75,
          borderRadius: '10px',
          border: selected || editing
            ? `1.5px solid ${alpha(PRIMARY, 0.55)}`
            : '1px solid transparent',
          bgcolor: selected || editing ? alpha(PRIMARY, 0.08) : 'transparent',
          transition: 'background-color 0.15s, border-color 0.15s',
          '&:hover': !(selected || editing) ? { bgcolor: 'rgba(8,145,178,0.04)' } : undefined,
        }}
      >
        <IconButton
          size="small"
          onClick={onToggle}
          aria-label={expanded ? 'Thu gọn chương' : 'Mở rộng chương'}
          sx={{
            p: 0.35,
            alignSelf: 'center',
            flexShrink: 0,
            color: MUTED,
            '&:hover': { color: PRIMARY, bgcolor: 'rgba(8,145,178,0.08)' },
          }}
        >
          {expanded ? (
            <ExpandMoreRoundedIcon sx={{ fontSize: 20 }} />
          ) : (
            <ChevronRightRoundedIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>

        <SidebarRow
          label={getChapterLabel(path, pathIndex)}
          sublabel={`${nodes.length} bài học`}
          icon={MenuBookRoundedIcon}
          selected={selected}
          dirty={dirty}
          hasError={hasError}
          onClick={onSelect}
        />

        <ChapterVisibilityBadge path={path} />

        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            onEdit?.();
          }}
          disabled={disabled}
          aria-label="Sửa thông tin chương"
          sx={{
            alignSelf: 'center',
            flexShrink: 0,
            width: CHAPTER_ACTION_ICON_SIZE,
            height: CHAPTER_ACTION_ICON_SIZE,
            border: `1.5px solid ${editing ? '#D97706' : '#FBBF24'}`,
            borderRadius: '999px',
            color: editing ? '#92400E' : '#B45309',
            bgcolor: editing ? 'rgba(245,158,11,0.22)' : 'rgba(251,191,36,0.12)',
            boxShadow: editing
              ? '0 1px 4px rgba(217,119,6,0.22), inset 0 1px 0 rgba(255,255,255,0.45)'
              : 'inset 0 1px 0 rgba(255,255,255,0.35)',
            transition: 'background-color 0.15s, border-color 0.15s, box-shadow 0.15s, color 0.15s',
            '&:hover': {
              color: '#78350F',
              borderColor: '#F59E0B',
              bgcolor: 'rgba(245,158,11,0.2)',
              boxShadow: '0 2px 8px rgba(217,119,6,0.18), inset 0 1px 0 rgba(255,255,255,0.4)',
            },
            '&.Mui-disabled': {
              color: 'rgba(180,83,9,0.45)',
              borderColor: 'rgba(251,191,36,0.45)',
              bgcolor: 'rgba(251,191,36,0.06)',
              boxShadow: 'none',
            },
          }}
        >
          <EditOutlinedIcon sx={{ fontSize: 17 }} />
        </IconButton>

        {isNewUnsavedPath(path) ? (
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.();
            }}
            disabled={disabled}
            aria-label="Xóa chương mới"
            sx={{
              alignSelf: 'center',
              flexShrink: 0,
              width: 32,
              height: 32,
              border: '1.5px solid #DC2626',
              borderRadius: '8px',
              color: '#DC2626',
              '&:hover': { bgcolor: 'rgba(220,38,38,0.06)' },
              '&.Mui-disabled': {
                color: 'rgba(220,38,38,0.45)',
                borderColor: 'rgba(220,38,38,0.35)',
              },
            }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        ) : null}
      </Box>

      <Collapse in={expanded} unmountOnExit collapsedSize={0}>
        {children}
      </Collapse>
    </Box>
  );
}

export default function MentorCourseContentSidebar({
  paths = [],
  courseName = '',
  activeChapterId = null,
  focusTarget = null,
  errors = {},
  dirtyKeys = {},
  onSelectChapter,
  onEditChapter,
  onSelectNode,
  onSelectMaterial,
  onAddChapter,
  onAddNode,
  onAddMaterial,
  onDeleteNewPath,
  disabled = false,
  footer = null,
}) {
  const [expandedChapterId, setExpandedChapterId] = useState(activeChapterId);
  const [expandedNodeId, setExpandedNodeId] = useState(null);
  const chapterListRef = useRef(null);
  const prevPathCountRef = useRef(paths.length);

  useEffect(() => {
    if (activeChapterId) {
      setExpandedChapterId(activeChapterId);
    }
  }, [activeChapterId]);

  useEffect(() => {
    if (
      (focusTarget?.type === 'lesson' || focusTarget?.type === 'material')
      && focusTarget.nodeTempId
    ) {
      setExpandedNodeId(focusTarget.nodeTempId);
    }
  }, [focusTarget]);

  useEffect(() => {
    const prevCount = prevPathCountRef.current;
    prevPathCountRef.current = paths.length;

    if (paths.length <= prevCount || paths.length <= MAX_VISIBLE_CHAPTERS) return;

    const scrollToBottom = () => {
      const listEl = chapterListRef.current;
      if (!listEl) return;
      listEl.scrollTo({ top: listEl.scrollHeight, behavior: 'smooth' });
    };

    requestAnimationFrame(() => {
      scrollToBottom();
      window.setTimeout(scrollToBottom, 150);
    });
  }, [paths.length]);

  const handleChapterClick = useCallback((pathTempId) => {
    setExpandedChapterId((prev) => (prev === pathTempId ? prev : pathTempId));
    if (
      focusTarget?.type === 'chapter-edit'
      && focusTarget.pathTempId === pathTempId
    ) {
      return;
    }
    onSelectChapter?.(pathTempId);
  }, [focusTarget, onSelectChapter]);

  const handleToggleChapter = useCallback((event, pathTempId) => {
    event.stopPropagation();
    setExpandedChapterId((prev) => (prev === pathTempId ? null : pathTempId));
    if (activeChapterId !== pathTempId) {
      onSelectChapter?.(pathTempId);
    }
  }, [activeChapterId, onSelectChapter]);

  const handleNodeClick = useCallback((pathTempId, nodeTempId) => {
    setExpandedNodeId((prev) => (prev === nodeTempId ? prev : nodeTempId));
    if (
      focusTarget?.type === 'lesson'
      && focusTarget.pathTempId === pathTempId
      && focusTarget.nodeTempId === nodeTempId
    ) {
      return;
    }
    onSelectNode?.(pathTempId, nodeTempId);
  }, [focusTarget, onSelectNode]);

  const handleToggleNode = useCallback((event, pathTempId, nodeTempId) => {
    event.stopPropagation();
    setExpandedNodeId((prev) => (prev === nodeTempId ? null : nodeTempId));
    const isSelected = (
      (focusTarget?.type === 'lesson' || focusTarget?.type === 'material')
      && focusTarget.pathTempId === pathTempId
      && focusTarget.nodeTempId === nodeTempId
    );
    if (!isSelected) {
      onSelectNode?.(pathTempId, nodeTempId);
    }
  }, [focusTarget, onSelectNode]);

  const chapterDirtyById = useMemo(() => {
    const map = {};
    paths.forEach((path) => {
      map[path.tempId] = isEditDirty(dirtyKeys, makePathDirtyKey(path.tempId));
    });
    return map;
  }, [paths, dirtyKeys]);

  const nodeDirtyById = useMemo(() => {
    const map = {};
    paths.forEach((path) => {
      (path.nodes ?? []).forEach((node) => {
        map[node.tempId] = isEditDirty(dirtyKeys, makeNodeDirtyKey(path.tempId, node.tempId));
      });
    });
    return map;
  }, [paths, dirtyKeys]);

  const isMaterialDirty = useCallback((pathTempId, nodeTempId, materialTempId) => (
    isEditDirty(dirtyKeys, makeMaterialDirtyKey(pathTempId, nodeTempId, materialTempId))
  ), [dirtyKeys]);

  const isNodeSelected = useCallback((pathTempId, nodeTempId) => (
    (focusTarget?.type === 'lesson' || focusTarget?.type === 'material')
    && focusTarget.pathTempId === pathTempId
    && focusTarget.nodeTempId === nodeTempId
  ), [focusTarget]);

  const isMaterialSelected = useCallback((pathTempId, nodeTempId, materialTempId) => (
    focusTarget?.type === 'material'
    && focusTarget.pathTempId === pathTempId
    && focusTarget.nodeTempId === nodeTempId
    && focusTarget.materialTempId === materialTempId
  ), [focusTarget]);

  const isChapterSelected = useCallback((pathTempId) => (
    activeChapterId === pathTempId
  ), [activeChapterId]);

  const isChapterEditing = useCallback((pathTempId) => (
    focusTarget?.type === 'chapter-edit'
    && focusTarget.pathTempId === pathTempId
  ), [focusTarget]);

  const chapterListMaxHeight = MAX_VISIBLE_CHAPTERS * CHAPTER_ROW_HEIGHT;

  return (
    <Box
      sx={{
        position: { lg: 'sticky' },
        top: { lg: 24 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxHeight: { lg: 'calc(100vh - 48px)' },
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          ...BUILDER_PANEL_SX,
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          maxHeight: { xs: 'min(420px, 50vh)', lg: '100%' },
        }}
      >
        {courseName ? (
          <Typography sx={{ ...DETAIL_ENTITY_TITLE_SX, mb: 1, flexShrink: 0, fontSize: 15 }}>
            {courseName}
          </Typography>
        ) : null}

        <Typography sx={{ fontSize: 13, fontWeight: 700, color: TEXT, mb: 1.25, flexShrink: 0 }}>
          Danh sách chương
          {paths.length > MAX_VISIBLE_CHAPTERS ? (
            <Typography component="span" sx={{ fontSize: 11, fontWeight: 500, color: MUTED, ml: 0.75 }}>
              ({paths.length} chương — cuộn để xem thêm)
            </Typography>
          ) : null}
        </Typography>

        {paths.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: MUTED, lineHeight: 1.55, mb: 1.5 }}>
            Chưa có chương nào. Thêm chương đầu tiên để bắt đầu.
          </Typography>
        ) : (
          <Box
            ref={chapterListRef}
            sx={{
              overflowY: paths.length > MAX_VISIBLE_CHAPTERS ? 'auto' : 'visible',
              overflowX: 'hidden',
              maxHeight: paths.length > MAX_VISIBLE_CHAPTERS ? chapterListMaxHeight : 'none',
              pr: 0.25,
              mr: -0.25,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'rgba(15,23,42,0.15)',
                borderRadius: '999px',
              },
            }}
          >
            {paths.map((path, pathIndex) => {
              const nodes = path.nodes ?? [];
              const expanded = expandedChapterId === path.tempId;
              const pathErrors = errors.paths?.[path.tempId] ?? {};
              const hasPathError = Boolean(pathErrors.PathName || pathErrors._nodes);
              const hasNodeError = Object.keys(pathErrors.nodes ?? {}).length > 0;

              return (
                <ChapterSidebarItem
                  key={path.tempId}
                  path={path}
                  pathIndex={pathIndex}
                  expanded={expanded}
                  selected={isChapterSelected(path.tempId)}
                  dirty={chapterDirtyById[path.tempId]}
                  hasError={hasPathError || hasNodeError}
                  disabled={disabled}
                  onToggle={(event) => handleToggleChapter(event, path.tempId)}
                  onSelect={() => handleChapterClick(path.tempId)}
                  onEdit={() => onEditChapter?.(path.tempId)}
                  editing={isChapterEditing(path.tempId)}
                  onDelete={() => onDeleteNewPath?.(path.tempId)}
                >
                  <Box sx={{ pl: 3.5, pt: 0.25, pb: 0.5 }}>
                    {nodes.length === 0 ? (
                      <Typography sx={{ fontSize: 12, color: MUTED, pl: 1, py: 0.5 }}>
                        Chưa có bài học
                      </Typography>
                    ) : (
                      nodes.map((node, nodeIndex) => (
                        <NodeSidebarItem
                          key={node.tempId}
                          pathTempId={path.tempId}
                          node={node}
                          nodeIndex={nodeIndex}
                          expanded={expandedNodeId === node.tempId}
                          selected={isNodeSelected(path.tempId, node.tempId)}
                          dirty={nodeDirtyById[node.tempId]}
                          hasError={Boolean(pathErrors.nodes?.[node.tempId])}
                          nodeErrors={pathErrors.nodes?.[node.tempId] ?? {}}
                          isMaterialSelected={isMaterialSelected}
                          isMaterialDirty={isMaterialDirty}
                          onToggle={(event) => handleToggleNode(event, path.tempId, node.tempId)}
                          onSelect={() => handleNodeClick(path.tempId, node.tempId)}
                          onSelectMaterial={onSelectMaterial}
                          onAddMaterial={onAddMaterial}
                          disabled={disabled}
                        />
                      ))
                    )}

                    <AppButton
                      variant="text"
                      startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
                      onClick={() => onAddNode?.(path.tempId)}
                      disabled={disabled}
                      sx={{
                        mt: 0.5,
                        ml: 0.5,
                        height: 32,
                        fontSize: 12,
                        fontWeight: 600,
                        color: PRIMARY,
                        justifyContent: 'flex-start',
                        px: 1,
                      }}
                    >
                      Thêm bài học
                    </AppButton>
                  </Box>
                </ChapterSidebarItem>
              );
            })}
          </Box>
        )}

        <AppButton
          startIcon={<AddRoundedIcon />}
          onClick={onAddChapter}
          disabled={disabled}
          sx={{
            mt: 1.25,
            height: 38,
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: 13,
            bgcolor: PRIMARY,
            flexShrink: 0,
            '&:hover': { bgcolor: '#0E7490' },
          }}
        >
          Thêm chương
        </AppButton>
      </Box>

      {footer ? (
        <Box sx={{ display: { xs: 'none', lg: 'block' }, width: '100%', flexShrink: 0 }}>
          {footer}
        </Box>
      ) : null}
    </Box>
  );
}
