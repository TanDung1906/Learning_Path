import { useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from '@mui/material';
import { buildTestResultStats, buildTestResultStatsFromSectionRows } from '@/features/learning/utils/testResultStatsUtils';
import {
  TEST_DIVIDER,
  TEST_MUTED,
  TEST_PRIMARY,
  TEST_SUCCESS,
  TEST_ERROR,
  TEST_TEXT,
} from './testTheme';

export default function TestResultStatsTable({
  paper,
  questionResults = [],
  stats: statsOverride = null,
  compact = false,
}) {
  const stats = useMemo(() => {
    if (statsOverride) return statsOverride;
    return buildTestResultStats(paper, questionResults);
  }, [statsOverride, paper, questionResults]);

  if (!stats.skillCount) return null;

  const rows = stats.skills.flatMap((skill) =>
    skill.sections.map((section, sectionIndex) => ({
      skillType: skill.skillType,
      typeId: skill.typeId,
      sectionCount: skill.sectionCount,
      sectionId: section.sectionId,
      displayName: section.displayName,
      chapterLabel: section.chapterLabel,
      chapterCourseNumber: section.chapterCourseNumber,
      pathOrder: section.pathOrder,
      pathId: section.pathId,
      correctCount: section.correctCount,
      wrongCount: section.wrongCount,
      totalCount: section.totalCount,
      isFirstSectionInSkill: sectionIndex === 0,
      sectionRowSpan: skill.sections.length,
    })),
  );

  const formatChapterCell = (row) => {
    if (row.chapterCourseNumber) return row.chapterCourseNumber;
    if (row.pathOrder) return `Chương ${row.pathOrder}`;
    if (row.chapterLabel) return row.chapterLabel;
    if (row.pathId) return `Chương #${row.pathId}`;
    return '—';
  };

  return (
    <Box sx={{ p: compact ? 0 : { xs: 2.5, md: 3.5 }, borderTop: compact ? 'none' : `1px solid ${TEST_DIVIDER}` }}>
      <Typography sx={{ fontSize: 18, fontWeight: 800, color: TEST_TEXT, mb: 0.75 }}>
        Thống kê theo kỹ năng & section
      </Typography>
      <Typography sx={{ fontSize: 14, color: TEST_MUTED, mb: 2.5 }}>
        Bài kiểm tra gồm{' '}
        <Box component="span" sx={{ fontWeight: 700, color: TEST_PRIMARY }}>
          {stats.skillCount}
        </Box>
        {' '}kỹ năng
      </Typography>

      <TableContainer
        sx={{
          borderRadius: '12px',
          border: `1px solid ${TEST_DIVIDER}`,
          bgcolor: '#fff',
        }}
      >
        <Table size="small">
          <TableHead sx={{ bgcolor: alpha(TEST_PRIMARY, 0.03) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: TEST_MUTED, fontSize: 13 }}>TypeId</TableCell>
              <TableCell sx={{ fontWeight: 700, color: TEST_MUTED, fontSize: 13 }}>Kỹ năng</TableCell>
              <TableCell sx={{ fontWeight: 700, color: TEST_MUTED, fontSize: 13, textAlign: 'center' }}>
                Số section
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: TEST_MUTED, fontSize: 13 }}>SectionId</TableCell>
              <TableCell sx={{ fontWeight: 700, color: TEST_MUTED, fontSize: 13 }}>
                Chương trong khóa
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: TEST_MUTED, fontSize: 13 }}>Tên section</TableCell>
              <TableCell sx={{ fontWeight: 700, color: TEST_MUTED, fontSize: 13, textAlign: 'center' }}>
                Câu đúng
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: TEST_MUTED, fontSize: 13, textAlign: 'center' }}>
                Câu sai
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: TEST_MUTED, fontSize: 13, textAlign: 'center' }}>
                Tổng
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={`${row.typeId}-${row.sectionId}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {row.isFirstSectionInSkill && (
                  <>
                    <TableCell
                      rowSpan={row.sectionRowSpan}
                      sx={{ fontSize: 14, fontWeight: 700, color: TEST_TEXT, verticalAlign: 'top' }}
                    >
                      {row.typeId ?? '—'}
                    </TableCell>
                    <TableCell
                      rowSpan={row.sectionRowSpan}
                      sx={{ fontSize: 14, fontWeight: 600, color: TEST_TEXT, verticalAlign: 'top' }}
                    >
                      {row.skillType}
                    </TableCell>
                    <TableCell
                      rowSpan={row.sectionRowSpan}
                      sx={{ fontSize: 14, fontWeight: 700, color: TEST_PRIMARY, textAlign: 'center', verticalAlign: 'top' }}
                    >
                      {row.sectionCount}
                    </TableCell>
                  </>
                )}
                <TableCell sx={{ fontSize: 14, fontWeight: 700, color: TEST_TEXT }}>
                  {row.sectionId}
                </TableCell>
                <TableCell sx={{ fontSize: 14, color: TEST_TEXT, whiteSpace: 'nowrap', fontWeight: 600 }}>
                  {formatChapterCell(row)}
                </TableCell>
                <TableCell sx={{ fontSize: 14, color: TEST_TEXT }}>
                  {row.displayName}
                </TableCell>
                <TableCell sx={{ fontSize: 14, fontWeight: 700, color: TEST_SUCCESS, textAlign: 'center' }}>
                  {row.correctCount}
                </TableCell>
                <TableCell sx={{ fontSize: 14, fontWeight: 700, color: TEST_ERROR, textAlign: 'center' }}>
                  {row.wrongCount}
                </TableCell>
                <TableCell sx={{ fontSize: 14, fontWeight: 600, color: TEST_MUTED, textAlign: 'center' }}>
                  {row.totalCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
