import {
  Box,
  Chip,
  Typography,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AppButton from '@/shared/ui/AppButton';
import { BYPASS_ATTEMPT_LIMIT, fetchAttemptSectionStats } from '@/features/learning/services/courseTestService';
import { buildTestResultStatsFromSectionRows } from '@/features/learning/utils/testResultStatsUtils';
import TestResultStatsTable from '@/features/learning/components/test/TestResultStatsTable';
import {
  TEST_DIVIDER,
  TEST_MUTED,
  TEST_PRIMARY,
  TEST_TEXT,
  formatDurationMinutes,
} from './testTheme';

export default function TestIntroPanel({
  meta,
  loading = false,
  onStart,
  onBack,
}) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailStats, setDetailStats] = useState(null);
  const [detailAttempt, setDetailAttempt] = useState(null);
  const [detailError, setDetailError] = useState('');

  const rules = [
    `Thời gian làm bài: ${formatDurationMinutes(meta?.timeLimitMinutes)}.`,
    `Điểm đạt: ${meta?.passingScore ?? 70}%.`,
    `Số lượt làm bài còn lại: ${meta?.remainingAttempts ?? 0}/${meta?.maxAttempts ?? 3}.`,
    'Hết giờ hệ thống sẽ tự nộp bài.',
  ];

  const prerequisitesMet = meta?.prerequisitesMet !== false;
  const canStart =
    prerequisitesMet && (BYPASS_ATTEMPT_LIMIT || (meta?.remainingAttempts ?? 0) > 0);
  const prerequisiteBlockers = meta?.prerequisiteBlockers ?? [];
  const formatSkills = (skills = []) => {
    const map = { LISTENING: 'Nghe', READING: 'Đọc', VOCABULARY: 'Từ vựng/Ngữ pháp' };
    const labels = skills.map(s => map[s] || s);
    if (labels.length === 0) return '';
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return `${labels[0]} và ${labels[1]}`;
    return labels.slice(0, -1).join(', ') + ` và ${labels[labels.length - 1]}`;
  };
  const skillText = meta?.skills?.length > 0 ? formatSkills(meta.skills) : '';
  const questionLabel = skillText ? skillText : 'Bài kiểm tra';

  // Format date
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    // Remove 'Z' if present, because DB returns local time but node-mssql appends Z
    const normalizedDate = dateString.endsWith('Z') ? dateString.slice(0, -1) : dateString;
    const d = new Date(normalizedDate);
    return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Calculate time spent
  const calculateTimeSpent = (start, submit) => {
    if (!start || !submit) return 'N/A';
    const normStart = start.endsWith('Z') ? start.slice(0, -1) : start;
    const normSubmit = submit.endsWith('Z') ? submit.slice(0, -1) : submit;
    
    const diff = Math.floor((new Date(normSubmit) - new Date(normStart)) / 1000);
    if (diff < 0) return 'N/A';
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    if (m === 0) return `${s} giây`;
    return `${m} phút ${s} giây`;
  };

  const handleViewAttemptDetail = async (attempt) => {
    if (!meta?.courseId || !attempt?.AttemptId) return;

    setDetailAttempt(attempt);
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailStats(null);
    setDetailError('');

    try {
      const res = await fetchAttemptSectionStats(meta.courseId, attempt.AttemptId);
      if (!res?.ok) {
        setDetailError(res?.message ?? 'Không tải được thống kê lần làm bài.');
        return;
      }

      const sectionRows = res.data?.sectionRows ?? [];
      if (sectionRows.length === 0) {
        setDetailError('Lần làm bài này chưa có dữ liệu thống kê theo section.');
        return;
      }

      setDetailStats(buildTestResultStatsFromSectionRows(sectionRows));
    } catch {
      setDetailError('Không tải được thống kê lần làm bài.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setDetailAttempt(null);
    setDetailStats(null);
    setDetailError('');
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '16px',
        border: `1px solid ${TEST_DIVIDER}`,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: { xs: 2.5, md: 3.5 }, py: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: alpha('#7C3AED', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <QuizRoundedIcon sx={{ fontSize: 22, color: '#7C3AED' }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: 20, md: 24 },
                fontWeight: 800,
                color: TEST_TEXT,
                lineHeight: 1.25,
              }}
            >
              {meta?.title ?? 'Bài kiểm tra'}
            </Typography>
            <Typography sx={{ fontSize: 13, color: TEST_MUTED, mt: 0.5 }}>
              {meta?.scope === 'final'
                ? 'Kiểm tra tổng hợp toàn khóa học'
                : meta?.chapterTitle
                  ? meta.chapterTitle
                  : 'Kiểm tra cuối chương'}
            </Typography>
          </Box>
          <Box>
            <AppButton
              variant="outlined"
              size="small"
              startIcon={<HistoryRoundedIcon />}
              onClick={() => setHistoryOpen(true)}
              sx={{
                borderRadius: '8px',
                px: 1.5,
                py: 0.5,
                fontSize: 13,
                fontWeight: 600,
                borderColor: TEST_DIVIDER,
                color: TEST_TEXT,
                '&:hover': { borderColor: TEST_PRIMARY, color: TEST_PRIMARY, bgcolor: alpha(TEST_PRIMARY, 0.04) },
              }}
            >
              Lịch sử
            </AppButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
          <Chip
            icon={<AccessTimeRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label={formatDurationMinutes(meta?.timeLimitMinutes)}
            size="small"
            sx={{ fontWeight: 600, bgcolor: alpha(TEST_PRIMARY, 0.06), color: TEST_PRIMARY }}
          />
          <Chip
            icon={<QuizRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label={questionLabel}
            size="small"
            sx={{ fontWeight: 600, bgcolor: alpha('#7C3AED', 0.08), color: '#7C3AED' }}
          />
          <Chip
            icon={<ReplayRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label={`Còn ${meta?.remainingAttempts ?? 0} lượt`}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          {meta?.isDemo && (
            <Chip
              icon={<InfoOutlinedIcon sx={{ fontSize: '16px !important' }} />}
              label="Demo UI"
              size="small"
              sx={{ fontWeight: 600, bgcolor: alpha('#EA580C', 0.08), color: '#EA580C' }}
            />
          )}
        </Box>

        <Box
          sx={{
            bgcolor: alpha(TEST_PRIMARY, 0.04),
            borderRadius: '12px',
            border: `1px solid ${alpha(TEST_PRIMARY, 0.1)}`,
            px: 2,
            py: 1.75,
            mb: 3,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEST_TEXT, mb: 1 }}>
            Quy định làm bài
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.25 }}>
            {rules.map((rule) => (
              <Typography
                key={rule}
                component="li"
                sx={{ fontSize: 13.5, color: TEST_MUTED, lineHeight: 1.65, mb: 0.5 }}
              >
                {rule}
              </Typography>
            ))}
          </Box>
        </Box>

        {!prerequisitesMet && prerequisiteBlockers.length > 0 && (
          <Box
            sx={{
              bgcolor: alpha('#DC2626', 0.04),
              borderRadius: '12px',
              border: `1px solid ${alpha('#DC2626', 0.15)}`,
              px: 2,
              py: 1.75,
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#DC2626', mb: 1 }}>
              Chưa đủ điều kiện làm bài
            </Typography>
            <Typography sx={{ fontSize: 13, color: TEST_MUTED, mb: 1, lineHeight: 1.55 }}>
              Bạn cần đạt các bài kiểm tra sau trước:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.25 }}>
              {prerequisiteBlockers.map((blocker) => (
                <Typography
                  key={blocker.chapterId}
                  component="li"
                  sx={{ fontSize: 13.5, color: TEST_MUTED, lineHeight: 1.65, mb: 0.5 }}
                >
                  {blocker.quizTitle}
                  {!blocker.quizEnabled ? ' (chưa được mentor bật)' : ''}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {!canStart && prerequisitesMet && (
          <Typography sx={{ fontSize: 14, color: '#DC2626', fontWeight: 600, mb: 2 }}>
            Bạn đã hết lượt làm bài kiểm tra.
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
          <AppButton variant="outlined" onClick={onBack}>
            Quay lại học
          </AppButton>
          <AppButton loading={loading} disabled={!canStart} onClick={onStart}>
            Bắt đầu làm bài
          </AppButton>
        </Box>
      </Box>

      {/* Modal Lịch sử làm bài */}
      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: TEST_TEXT }}>
            Lịch sử làm bài
          </Typography>
          <IconButton onClick={() => setHistoryOpen(false)} size="small" sx={{ color: TEST_MUTED }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {(!meta?.history || meta.history.length === 0) ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: TEST_MUTED, fontSize: 14 }}>
                Chưa có lịch sử làm bài nào.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: alpha(TEST_PRIMARY, 0.03) }}>
                  <TableRow>
                    <TableCell sx={{ color: TEST_MUTED, fontSize: 13, fontWeight: 600, py: 1.5 }}>Ngày giờ</TableCell>
                    <TableCell sx={{ color: TEST_MUTED, fontSize: 13, fontWeight: 600, py: 1.5 }}>Thời gian làm</TableCell>
                    <TableCell sx={{ color: TEST_MUTED, fontSize: 13, fontWeight: 600, py: 1.5, textAlign: 'right' }}>Điểm</TableCell>
                    <TableCell sx={{ color: TEST_MUTED, fontSize: 13, fontWeight: 600, py: 1.5, textAlign: 'right' }}>Kết quả</TableCell>
                    <TableCell sx={{ color: TEST_MUTED, fontSize: 13, fontWeight: 600, py: 1.5, textAlign: 'right' }}>Chi tiết</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meta.history.map((attempt, index) => {
                    const passed = attempt.IsPass;
                    const scoreValue = Number.isInteger(attempt.Point) ? attempt.Point : Number(attempt.Point).toFixed(1);
                    
                    return (
                      <TableRow 
                        key={attempt.AttemptId}
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          bgcolor: passed ? alpha('#10B981', 0.015) : alpha('#EF4444', 0.015),
                        }}
                      >
                        <TableCell sx={{ fontSize: 14, fontWeight: 600, color: TEST_TEXT, py: 2 }}>
                          {formatDateTime(attempt.StartedAt)}
                        </TableCell>
                        <TableCell sx={{ fontSize: 14, color: TEST_TEXT, py: 2 }}>
                          {calculateTimeSpent(attempt.StartedAt, attempt.SubmittedAt)}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right', py: 2 }}>
                          <Typography sx={{ fontSize: 18, fontWeight: 800, color: passed ? '#10B981' : '#EF4444', lineHeight: 1 }}>
                            {scoreValue} <Box component="span" sx={{ fontSize: 13, fontWeight: 600, color: TEST_MUTED }}>/ 100</Box>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right', py: 2 }}>
                          <Chip 
                            label={passed ? 'Đạt' : 'Chưa đạt'} 
                            size="small" 
                            sx={{ 
                              bgcolor: passed ? alpha('#10B981', 0.1) : alpha('#EF4444', 0.1),
                              color: passed ? '#10B981' : '#EF4444',
                              fontWeight: 700,
                              fontSize: 12,
                              height: 24
                            }} 
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right', py: 2 }}>
                          <AppButton
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityRoundedIcon />}
                            onClick={() => handleViewAttemptDetail(attempt)}
                            sx={{
                              borderRadius: '8px',
                              px: 1.25,
                              py: 0.25,
                              fontSize: 12,
                              fontWeight: 600,
                              borderColor: TEST_DIVIDER,
                              color: TEST_TEXT,
                              whiteSpace: 'nowrap',
                              '&:hover': {
                                borderColor: TEST_PRIMARY,
                                color: TEST_PRIMARY,
                                bgcolor: alpha(TEST_PRIMARY, 0.04),
                              },
                            }}
                          >
                            Xem chi tiết
                          </AppButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailOpen}
        onClose={handleCloseDetail}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: TEST_TEXT }}>
              Thống kê lần làm bài
            </Typography>
            {detailAttempt && (
              <Typography sx={{ fontSize: 13, color: TEST_MUTED, mt: 0.5 }}>
                {formatDateTime(detailAttempt.StartedAt)}
                {' · '}
                Điểm: {Number.isInteger(detailAttempt.Point) ? detailAttempt.Point : Number(detailAttempt.Point).toFixed(1)}/100
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleCloseDetail} size="small" sx={{ color: TEST_MUTED }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {detailLoading && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: TEST_MUTED, fontSize: 14 }}>
                Đang tải thống kê...
              </Typography>
            </Box>
          )}

          {!detailLoading && detailError && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: TEST_MUTED, fontSize: 14 }}>
                {detailError}
              </Typography>
            </Box>
          )}

          {!detailLoading && !detailError && detailStats && (
            <TestResultStatsTable stats={detailStats} compact />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
