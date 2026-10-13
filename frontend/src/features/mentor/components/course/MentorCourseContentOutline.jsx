import { useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import MentorChapterCardMenu from './MentorChapterCardMenu';
import {
  getMaterialOutlineDetail,
  countMaterialsInPath,
  REVIEW_OUTLINE_TYPE_LABELS,
} from '@/features/mentor/utils/mentorCourseReviewUtils';
import {
  getNodeMaterials,
  getPathNodes,
  normalizeMaterialForDisplay,
} from '@/features/mentor/utils/mentorCourseContentUtils';
import { MUTED, TEXT, DETAIL_PANEL_SX, DETAIL_PANEL_HEADER_SX, DETAIL_NESTED_BLOCK_SX, BORDER_SUBTLE, SURFACE_SUBTLE } from './mentorCourseCreateStyles';
import {
  CHAPTER_THEME,
  LESSON_THEME,
  MATERIAL_TYPE_THEME,
} from './mentorCourseContentStyles';

const MATERIAL_LINK_SX = {
  color: '#2563EB',
  textDecoration: 'underline',
  fontSize: 'inherit',
  fontWeight: 500,
  wordBreak: 'break-word',
  cursor: 'pointer',
  transition: 'color 0.15s ease',
  '&:hover': {
    color: '#1D4ED8',
    textDecoration: 'underline',
  },
};

function getItemKey(item, fallback) {
  return (
    item?.tempId ??
    item?.materialId ??
    item?.MaterialId ??
    item?.nodeId ??
    item?.NodeId ??
    item?.pathId ??
    item?.PathId ??
    fallback
  );
}

function MaterialOutlineRow({ material }) {
  const [expanded, setExpanded] = useState(false);
  const normalized = normalizeMaterialForDisplay(material);
  const typeLabel = REVIEW_OUTLINE_TYPE_LABELS[normalized.MaterialType] ?? 'Học liệu';
  const title = String(normalized.Title ?? '').trim() || typeLabel;
  const detail = getMaterialOutlineDetail(normalized);
  const theme = MATERIAL_TYPE_THEME[normalized.MaterialType] ?? MATERIAL_TYPE_THEME.VIDEO;

  return (
    <Box
      sx={{
        borderRadius: '10px',
        border: `1px solid ${theme.border}`,
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1.25,
          py: 1,
        }}
      >
        {detail && (
          <IconButton size="small" onClick={() => setExpanded((prev) => !prev)} sx={{ p: 0.25 }}>
            {expanded ? (
              <ExpandLessRoundedIcon sx={{ fontSize: 16, color: theme.color }} />
            ) : (
              <ExpandMoreRoundedIcon sx={{ fontSize: 16, color: theme.color }} />
            )}
          </IconButton>
        )}
        <Typography
          sx={{
            flex: 1,
            fontSize: 12.5,
            fontWeight: 600,
            color: TEXT,
            lineHeight: 1.45,
            minWidth: 0,
          }}
        >
          <Box component="span" sx={{ color: theme.color }}>
            {typeLabel}:
          </Box>{' '}
          {title}
        </Typography>
      </Box>
      {detail && (
        <Collapse in={expanded}>
          <Box sx={{ px: 1.5, pb: 1.15, pt: 0.25 }}>
            {detail.type === 'link' ? (
              <Typography
                component="div"
                sx={{
                  fontSize: 11.5,
                  color: MUTED,
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}
              >
                <Box
                  component="a"
                  href={detail.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={MATERIAL_LINK_SX}
                >
                  {detail.label}
                </Box>
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: 11.5,
                  color: MUTED,
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {detail.text}
              </Typography>
            )}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

function LessonOutline({ node, nodeIndex, pathIndex }) {
  const [expanded, setExpanded] = useState(false);
  const materials = getNodeMaterials(node, { learningOnly: true });
  const lessonTitle = node.NodeName || node.nodeName || `Bài ${nodeIndex + 1}`;

  return (
    <Box
      sx={{
        borderLeft: `2px solid ${LESSON_THEME.accent}`,
        ...DETAIL_NESTED_BLOCK_SX,
        borderRadius: '0 10px 10px 0',
        overflow: 'hidden',
      }}
    >
      <Box
        role="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          pl: 1.25,
          pr: 1.25,
          py: 1.15,
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.02)' },
        }}
      >
        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          sx={{ p: 0.25 }}
          aria-label={expanded ? 'Thu gọn học liệu' : 'Xem học liệu'}
        >
          {expanded ? (
            <ExpandLessRoundedIcon sx={{ fontSize: 18, color: LESSON_THEME.color }} />
          ) : (
            <ExpandMoreRoundedIcon sx={{ fontSize: 18, color: LESSON_THEME.color }} />
          )}
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.4 }}>
            Bài {nodeIndex + 1}: {lessonTitle}
          </Typography>
          <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.1 }}>
            {materials.length} học liệu
          </Typography>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ pl: 1.5, pr: 1.25, pb: 1.25 }}>
          {node.Description && (
            <Typography sx={{ fontSize: 12.5, color: MUTED, mb: 1.15, lineHeight: 1.55 }}>
              {node.Description}
            </Typography>
          )}
          {materials.length === 0 ? (
            <Typography sx={{ fontSize: 12.5, color: MUTED, fontStyle: 'italic' }}>
              Chưa có học liệu
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.85 }}>
              {materials.map((material, materialIndex) => (
                <MaterialOutlineRow
                  key={getItemKey(material, `material-${pathIndex}-${nodeIndex}-${materialIndex}`)}
                  material={material}
                />
              ))}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

function ChapterOutline({ path, pathIndex, defaultExpanded, onQuizSetup }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const nodes = getPathNodes(path);
  const chapterTitle = path.PathName || path.pathName || `Chương ${pathIndex + 1}`;
  const materialCount = countMaterialsInPath(path);

  return (
    <Box sx={DETAIL_PANEL_SX}>
      <Box
        role="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.25,
          px: 1.75,
          py: 1.5,
          bgcolor: SURFACE_SUBTLE,
          borderBottom: expanded ? `1px solid ${BORDER_SUBTLE}` : 'none',
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.035)' },
        }}
      >
        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          sx={{ p: 0.4 }}
          aria-label={expanded ? 'Thu gọn chương' : 'Mở chương'}
        >
          {expanded ? (
            <ExpandLessRoundedIcon sx={{ fontSize: 20, color: CHAPTER_THEME.color }} />
          ) : (
            <ExpandMoreRoundedIcon sx={{ fontSize: 20, color: CHAPTER_THEME.color }} />
          )}
        </IconButton>
        <MenuBookRoundedIcon sx={{ fontSize: 18, color: CHAPTER_THEME.color }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.4 }}>
            Chương {pathIndex + 1}: {chapterTitle}
          </Typography>
          <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.15 }}>
            {nodes.length} bài học · {materialCount} học liệu
          </Typography>
        </Box>
        {onQuizSetup ? (
          <Box
            onClick={(event) => event.stopPropagation()}
            sx={{
              flexShrink: 0,
              width: { xs: '100%', sm: 'auto' },
              pl: { xs: 4.5, sm: 0 },
            }}
          >
            <MentorChapterCardMenu
              variant="chapterButton"
              onQuizSetup={() => onQuizSetup(path, pathIndex)}
            />
          </Box>
        ) : null}
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ px: 2, py: 2 }}>
          {path.Description && (
            <Typography sx={{ fontSize: 13, color: MUTED, mb: 2, lineHeight: 1.6 }}>
              {path.Description}
            </Typography>
          )}

          {nodes.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: MUTED }}>Chương này chưa có bài học</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {nodes.map((node, nodeIndex) => (
                <LessonOutline
                  key={getItemKey(node, `node-${pathIndex}-${nodeIndex}`)}
                  node={node}
                  nodeIndex={nodeIndex}
                  pathIndex={pathIndex}
                />
              ))}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

export default function MentorCourseContentOutline({ paths = [], onChapterQuizSetup }) {
  if (paths.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {paths.map((path, pathIndex) => (
        <ChapterOutline
          key={getItemKey(path, `path-${pathIndex}`)}
          path={path}
          pathIndex={pathIndex}
          defaultExpanded={false}
          onQuizSetup={onChapterQuizSetup}
        />
      ))}
    </Box>
  );
}
