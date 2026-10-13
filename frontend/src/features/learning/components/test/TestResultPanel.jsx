import {
  Box,
  Chip,
  Typography,
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import AppButton from '@/shared/ui/AppButton';
import {
  TEST_DIVIDER,
  TEST_ERROR,
  TEST_MUTED,
  TEST_PRIMARY,
  TEST_SUCCESS,
  TEST_TEXT,
  formatTimeSpent,
} from './testTheme';
import TestResultStatsTable from './TestResultStatsTable';

function formatScoreValue(score = 0) {
  const value = Number(score) || 0;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export default function TestResultPanel({
  meta,
  result,
  paper,
  onRetry,
  onBack,
}) {
  const passed = Boolean(result?.passed);
  const maxScore = result?.maxScore ?? 100;
  const displayScore = formatScoreValue(result?.score ?? 0);
  const passingScore = result?.passingScore ?? meta?.passingScore ?? 70;

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '16px',
        border: `1px solid ${TEST_DIVIDER}`,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: { xs: 3, md: 4 },
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 2 }}>
          {passed ? (
            <CheckRoundedIcon sx={{ fontSize: 48, color: TEST_SUCCESS }} />
          ) : (
            <CloseRoundedIcon sx={{ fontSize: 48, color: TEST_ERROR }} />
          )}
        </Box>

        <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 800, color: TEST_TEXT, mb: 0.75 }}>
          {passed ? 'Chúc mừng! Bạn đã đạt' : 'Chưa đạt yêu cầu'}
        </Typography>
        <Typography sx={{ fontSize: 14, color: TEST_MUTED, mb: 2.5 }}>
          {meta?.title ?? 'Bài kiểm tra'}
        </Typography>

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 0.75,
            mb: 2.5,
          }}
        >
          <Typography sx={{ fontSize: 36, fontWeight: 800, color: TEST_PRIMARY, lineHeight: 1 }}>
            {displayScore}
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: TEST_PRIMARY }}>
            /{maxScore}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
          <Chip
            label={`${result?.correctCount ?? 0}/${result?.totalQuestions ?? 0} câu đúng`}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`Thời gian: ${formatTimeSpent(result?.timeSpentSeconds)}`}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          {result?.canRetry && (
            <Chip
              icon={<ReplayRoundedIcon sx={{ fontSize: '16px !important' }} />}
              label={`Còn ${result?.remainingAttempts ?? 0} lượt`}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
          <AppButton variant="outlined" onClick={onBack}>
            Quay lại học
          </AppButton>
          {result?.canRetry && (
            <AppButton onClick={onRetry}>
              Làm lại
            </AppButton>
          )}
        </Box>
      </Box>

      {paper && result?.questionResults && (
        <TestResultStatsTable paper={paper} questionResults={result.questionResults} />
      )}

      {/* Hiển thị chi tiết từng câu hỏi đúng/sai */}
      {paper && paper.sections && result?.questionResults && (
        <Box sx={{ p: { xs: 2.5, md: 3.5 }, bgcolor: '#F8FAFC', borderTop: `1px solid ${TEST_DIVIDER}` }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, mb: 3, color: TEST_TEXT }}>
            Chi tiết bài làm
          </Typography>

          {paper.sections.map((section, sIndex) => (
            <Box key={sIndex} sx={{ mb: 4 }}>
              {/* Tên phần thi (Nghề, Lĩnh vực, Ngữ pháp...) */}
              <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 2, color: TEST_PRIMARY }}>
                Phần {sIndex + 1}: {section.skillType}
              </Typography>

              {/* Lặp qua các câu hỏi trong phần thi */}
              {(section.questions || []).map((q, qIndex) => {
                // Đối chiếu kết quả trả về từ Backend thông qua QuestionId
                const qRes = result.questionResults.find(r => String(r.questionId) === String(q.tempId || q.QuestionId));
                const isBlank = !qRes || qRes.isBlank;
                const isCorrect = qRes?.isCorrect;
                
                // Màu sắc trạng thái cơ bản
                let statusColor = '#94A3B8'; // Xám - Chưa trả lời
                let statusText = 'Chưa trả lời';
                if (!isBlank) {
                  if (isCorrect) {
                    statusColor = '#10B981'; // Xanh lá - Đúng
                    statusText = 'Chính xác';
                  } else {
                    statusColor = '#EF4444'; // Đỏ - Sai
                    statusText = 'Sai';
                  }
                }

                return (
                  <Box 
                    key={qIndex} 
                    sx={{ 
                      mb: 2.5, 
                      p: 2.5, 
                      bgcolor: '#fff', 
                      borderRadius: '12px', 
                      border: `1px solid ${statusColor}40`, // Thêm border màu nhạt theo trạng thái
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
                    }}
                  >
                    {/* Hàng Tiêu đề & Nhãn Trạng thái */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEST_TEXT }}>
                        Câu {q.order || (qIndex + 1)}
                      </Typography>
                      <Chip 
                        label={statusText} 
                        size="small" 
                        sx={{ 
                          bgcolor: `${statusColor}15`, 
                          color: statusColor, 
                          fontWeight: 700,
                          height: 22,
                          fontSize: 12
                        }} 
                      />
                    </Box>

                    {/* Nội dung câu hỏi (Có thể chứa HTML nếu lấy từ CKEditor) */}
                    <Typography 
                      sx={{ fontSize: 14, mb: 2, color: TEST_TEXT }}
                      dangerouslySetInnerHTML={{ __html: q.questionText || q.Content || '' }}
                    />

                    {/* Danh sách lựa chọn (Đáp án) */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {(q.options || q.choices || []).map((opt) => {
                        const optIdStr = String(opt.tempId || opt.ChoiceId);
                        // Kiểm tra user có chọn đáp án này không
                        const isUserSelected = !isBlank && qRes?.userChoiceIds?.includes(optIdStr);
                        // Kiểm tra xem đây có phải đáp án đúng không
                        const isCorrectAnswer = !isBlank && qRes?.correctChoiceIds?.includes(optIdStr);

                        // Đổi màu nền nếu user chọn hoặc đây là đáp án đúng
                        let optBgColor = '#F8FAFC';
                        let optBorderColor = '#E2E8F0';
                        let optIcon = null;

                        if (isCorrectAnswer) {
                            optBgColor = '#ECFDF5'; // Xanh lá nhạt
                            optBorderColor = '#34D399';
                            optIcon = <CheckRoundedIcon sx={{ fontSize: 18, color: '#10B981', ml: 'auto' }} />;
                        } else if (isUserSelected && !isCorrectAnswer) {
                            optBgColor = '#FEF2F2'; // Đỏ nhạt
                            optBorderColor = '#F87171';
                            optIcon = <CloseRoundedIcon sx={{ fontSize: 18, color: '#EF4444', ml: 'auto' }} />;
                        }

                        return (
                          <Box 
                            key={optIdStr}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 1.25,
                              px: 2,
                              borderRadius: '8px',
                              bgcolor: optBgColor,
                              border: `1px solid ${optBorderColor}`,
                            }}
                          >
                            {/* Checkbox mô phỏng */}
                            <Box 
                              sx={{ 
                                width: 18, 
                                height: 18, 
                                borderRadius: q.isMultiple ? '4px' : '50%', 
                                border: `2px solid ${isUserSelected ? (isCorrectAnswer ? '#10B981' : '#EF4444') : '#CBD5E1'}`,
                                bgcolor: isUserSelected ? (isCorrectAnswer ? '#10B981' : '#EF4444') : 'transparent',
                                mr: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {isUserSelected && <CheckRoundedIcon sx={{ fontSize: 14, color: '#fff' }} />}
                            </Box>
                            
                            <Typography 
                              sx={{ fontSize: 14, color: TEST_TEXT, flex: 1 }}
                              dangerouslySetInnerHTML={{ __html: opt.optionText || opt.Content || '' }}
                            />
                            
                            {optIcon}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
