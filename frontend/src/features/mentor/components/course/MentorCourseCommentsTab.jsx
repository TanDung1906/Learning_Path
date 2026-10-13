import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Rating,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AppButton from '@/shared/ui/AppButton';
import { toast } from '@/shared/ui/Toast';
import { CREATE_CARD_SX } from './mentorCourseCreateStyles';
import {
  formatCommentDate,
  getCommentInitials,
  resolveAvatarSrc,
} from '@/features/courses/data/courseCommentsMock';
import {
  createMentorCourseComment,
  fetchMentorCourseComments,
  replyMentorCourseComment,
} from '@/features/mentor/services/mentorCourseService';
import {
  COMMENT_MAX_LENGTH,
  REPLY_MAX_LENGTH,
} from '@/features/mentor/utils/mentorCourseCommentsUtils';

const PRIMARY = '#0891B2';
const TEXT = '#0F172A';
const MUTED = '#64748B';
const DIVIDER = 'rgba(8,145,178,0.10)';
const COMMENT_LIST_MAX_HEIGHT = 480;

// Giao diện (CSS) cho cái nút nhỏ (Chip) hiển thị chữ "Giảng viên"
const INSTRUCTOR_CHIP_SX = {
  height: 22,
  fontSize: 11,
  fontWeight: 600,
  bgcolor: alpha(PRIMARY, 0.1),
  color: PRIMARY,
  border: `1px solid ${alpha(PRIMARY, 0.22)}`,
  '& .MuiChip-label': { px: 0.85 },
};

// Component hiển thị Tiêu đề của phần bình luận
function SectionTitle({ children, sx }) {
  return (
    <Typography sx={{ fontWeight: 700, color: TEXT, fontSize: { xs: 18, sm: 20 }, lineHeight: 1.3, ...sx }}>
      {children}
    </Typography>
  );
}

// -------------------------------------------------------------------------------------------------
// HÀM QUAN TRỌNG: ĐÚC CÂY ĐỆ QUY (Cha - Con)
// Công dụng: Biến 1 danh sách phẳng (phẳng lì từ trên xuống dưới) thành dạng Cây 
// để lúc in ra màn hình nó sẽ biết được đứa nào là con của đứa nào.
// -------------------------------------------------------------------------------------------------
function buildCommentTree(flatComments) {
  const commentMap = {};
  const rootComments = [];

  // Vòng lặp 1: Gắn thêm 1 cái túi rỗng tên là 'replies' cho tất cả mọi người
  flatComments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  // Vòng lặp 2: Nhét các đứa con vào trong cái túi 'replies' của người Cha
  flatComments.forEach(comment => {
    if (comment.parentCommentId && commentMap[comment.parentCommentId]) {
      commentMap[comment.parentCommentId].replies.push(commentMap[comment.id]);
    } else {
      // Nếu không có Cha (parentCommentId bị null), thì nó chính là Cụ tổ (Root)
      rootComments.push(commentMap[comment.id]);
    }
  });

  return rootComments;
}

// -------------------------------------------------------------------------------------------------
// COMPONENT: FORM NHẬP BÌNH LUẬN MỚI
// Nằm ở trên cùng, dùng để Mentor đăng 1 thông báo mới toanh 
// -------------------------------------------------------------------------------------------------
function MentorCommentComposeForm({ submitting, onSubmit }) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      toast.error('Vui lòng nhập nội dung bình luận.');
      return;
    }
    onSubmit(trimmed, () => setContent(''));
  };

  return (
    <Box
      sx={{
        mt: 2.5,
        mb: 3,
        p: 2.25,
        borderRadius: '16px',
        border: `1px solid ${DIVIDER}`,
        bgcolor: alpha(PRIMARY, 0.02),
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: TEXT, mb: 1.25 }}>
        Đăng thông báo mới
      </Typography>
      <TextField
        multiline
        minRows={3}
        fullWidth
        placeholder="Chia sẻ thông báo hoặc trao đổi với học viên..."
        value={content}
        onChange={(event) => setContent(event.target.value.slice(0, COMMENT_MAX_LENGTH))}
        inputProps={{ maxLength: COMMENT_MAX_LENGTH }}
        sx={{
          mb: 0.75,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: '#fff',
            fontSize: 14,
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: content.length >= COMMENT_MAX_LENGTH ? '#DC2626' : MUTED,
          }}
        >
          {content.length}/{COMMENT_MAX_LENGTH}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <AppButton
          onClick={handleSubmit}
          loading={submitting}
          disabled={submitting || !content.trim() || content.length > COMMENT_MAX_LENGTH}
        >
          Gửi bình luận
        </AppButton>
      </Box>
    </Box>
  );
}

// -------------------------------------------------------------------------------------------------
// COMPONENT: FORM TRẢ LỜI
// Hiện ra bên dưới mỗi bình luận khi Mentor bấm vào nút "Trả lời" xanh xanh
// -------------------------------------------------------------------------------------------------
function MentorCommentReplyForm({ initialValue = '', submitting, onSubmit, onCancel }) {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      toast.error('Vui lòng nhập nội dung phản hồi.');
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <Box
      sx={{
        mt: 1.5,
        p: 2.25,
        borderRadius: '16px',
        border: `1px solid ${DIVIDER}`,
        bgcolor: alpha(PRIMARY, 0.02),
      }}
    >
      <TextField
        multiline
        minRows={2}
        fullWidth
        placeholder="Viết câu trả lời..."
        value={content}
        onChange={(event) => setContent(event.target.value.slice(0, REPLY_MAX_LENGTH))}
        inputProps={{ maxLength: REPLY_MAX_LENGTH }}
        sx={{
          mb: 0.75,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: '#fff',
            fontSize: 14,
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: content.length >= REPLY_MAX_LENGTH ? '#DC2626' : MUTED,
          }}
        >
          {content.length}/{REPLY_MAX_LENGTH}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
        {onCancel ? (
          <AppButton variant="outlined" onClick={onCancel}>
            Hủy
          </AppButton>
        ) : null}
        <AppButton
          loading={submitting}
          disabled={submitting || !content.trim()}
          onClick={handleSubmit}
        >
          Gửi trả lời
        </AppButton>
      </Box>
    </Box>
  );
}

// -------------------------------------------------------------------------------------------------
// COMPONENT: GIAO DIỆN 1 DÒNG BÌNH LUẬN CỦA MENTOR
//depth (độ sâu thụt lề), onReply (hàm bấm gửi), replyingToId (ID đang bị bấm), setReplyingToId (đổi trạng thái)
// -------------------------------------------------------------------------------------------------
function MentorCommentItem({ comment, replying, submitting, onStartReply, onCancelReply, onSubmitReply, depth = 0 }) {
  const avatarSrc = resolveAvatarSrc(comment.avatarUrl);

  // Biến isReplying dùng để kiểm tra xem bình luận này CÓ ĐANG BỊ Mentor bấm nút "Trả lời" hay không.
  // Nếu có, thì sẽ giấu nút "Trả lời" đi và bật cái Form nhập chữ lên.
  const isReplying = replying === comment.id;

  return (
    // THỤT LỀ: Nếu là Con/Cháu (depth > 0) thì margin-left (ml) thụt vào 5 đơn vị (40px)
    <Box sx={{ ml: depth > 0 ? 5 : 0, mt: depth > 0 ? 1.5 : 0 }}>

      {/* UI Búp Bê Nga: Trang trí viền và màu nền cho người con */}
      <Box
        sx={{
          display: 'flex', gap: 1.75, py: 2.25,
          borderBottom: depth === 0 ? `1px solid ${DIVIDER}` : 'none',
          bgcolor: depth > 0 ? alpha(PRIMARY, 0.02) : 'transparent',
          p: depth > 0 ? 2 : 0, borderRadius: depth > 0 ? 2 : 0,
        }}
      >
        {/* HIỂN THỊ AVATAR */}
        <Avatar
          src={avatarSrc || undefined}
          sx={{
            width: 42,
            height: 42,
            bgcolor: alpha(PRIMARY, 0.12),
            color: PRIMARY,
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {getCommentInitials(comment.authorName)}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* HIỂN THỊ TÊN, NẾU LÀ INSTRUCTOR THÌ HIỆN THÊM CHỮ "Giảng viên" cho uy tín hơn */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.35 }}>
              {comment.authorName}
            </Typography>
            {comment.isInstructor && (
              <Chip size="small" label="Giảng viên" sx={INSTRUCTOR_CHIP_SX} />
            )}
            <Typography sx={{ fontSize: 12.5, color: MUTED }}>
              {formatCommentDate(comment.createdAt)}
            </Typography>
          </Box>

          {/* HIỂN THỊ SỐ SAO (Chỉ sinh viên đánh giá mới có sao) */}
          {comment.rating != null && (
            <Rating
              value={comment.rating}
              readOnly
              size="small"
              icon={<StarRoundedIcon sx={{ fontSize: 16 }} />}
              emptyIcon={<StarRoundedIcon sx={{ fontSize: 16, opacity: 0.28 }} />}
              sx={{ color: '#F59E0B', mb: 0.75, '& .MuiRating-iconEmpty': { color: alpha('#F59E0B', 0.28) } }}
            />
          )}

          {/* NỘI DUNG CHỮ */}
          <Typography sx={{ fontSize: 14, color: TEXT, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
            {comment.content}
          </Typography>

          {/* NÚT TRẢ LỜI: Nếu đang không bấm Form nhập thì mới hiện nút này */}
          {!isReplying && (
            <AppButton
              variant="text"
              onClick={() => onStartReply(comment.id)}
              sx={{ mt: 0.75, px: 0, minWidth: 0, fontSize: 13, fontWeight: 600, color: PRIMARY }}
            >
              Trả lời
            </AppButton>
          )}

          {/* BẬT FORM TRẢ LỜI: Nếu Mentor đang bấm trả lời ông này thì bung cái hộp ra */}
          {isReplying && (
            <MentorCommentReplyForm
              submitting={submitting}
              onCancel={onCancelReply}
              onSubmit={(content) => onSubmitReply(comment.id, content)}
            />
          )}

          {/* --------------------------------------------------------------------------- */}
          {/* ĐỆ QUY THÔNG QUA BIẾN childComment */}
          {/* Lấy từng đứa con ra, và lại dùng chính Component <MentorCommentItem> để hiển thị nó */}
          {/* --------------------------------------------------------------------------- */}
          {comment.replies && comment.replies.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {comment.replies.map((childComment) => (
                <MentorCommentItem
                  key={childComment.id}
                  comment={childComment}
                  depth={depth + 1}
                  replying={replying}
                  submitting={submitting}
                  onStartReply={onStartReply}
                  onCancelReply={onCancelReply}
                  onSubmitReply={onSubmitReply}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// -------------------------------------------------------------------------------------------------
// COMPONENT CHÍNH: XUẤT RA TOÀN BỘ TRANG BÌNH LUẬN
// -------------------------------------------------------------------------------------------------
export default function MentorCourseCommentsTab({ courseId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [postingComment, setPostingComment] = useState(false);

  // Gọi API lấy toàn bộ danh sách bình luận (ở dạng phẳng)
  const loadComments = useCallback(async () => {
    setLoading(true);
    const result = await fetchMentorCourseComments(courseId);
    setComments(result.comments ?? []);
    if (!result.ok && result.message) {
      toast.error(result.message);
    }
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Hàm xử lý gửi Bình Luận Gốc (Bình luận mới toanh)
  const handleSubmitComment = async (content, resetForm) => {
    setPostingComment(true);
    const result = await createMentorCourseComment(courseId, content);
    setPostingComment(false);

    if (!result.ok) {
      toast.error(result.message ?? 'Không thể gửi bình luận.');
      return;
    }

    toast.success('Đã đăng thông báo.');
    resetForm();
    loadComments(); // Tải lại toàn bộ cây từ server
  };

  // Hàm xử lý khi gửi Câu Trả Lời cho một người nào đó
  const handleSubmitReply = async (commentId, content) => {
    setSubmittingId(commentId);
    const result = await replyMentorCourseComment(courseId, commentId, content);
    setSubmittingId(null);

    if (!result.ok) {
      toast.error(result.message ?? 'Không thể gửi phản hồi.');
      return;
    }

    setReplyingId(null);
    toast.success('Đã gửi phản hồi.');
    loadComments(); // BẮT BUỘC TẢI LẠI ĐỂ SQL KẾT NỐI PARENT VỚI CHILD
  };

  // ---------------------------------------------------------------------------
  // KÍCH HOẠT ĐỆ QUY: Biến mảng phẳng thành cây đệ quy
  // ---------------------------------------------------------------------------
  const nestedComments = useMemo(() => buildCommentTree(comments), [comments]);

  return (
    <Box sx={CREATE_CARD_SX}>
      <Box sx={{ pb: 2, mb: 0.5, borderBottom: `1px solid ${DIVIDER}` }}>
        <SectionTitle sx={{ mb: 0.75 }}>Đánh giá</SectionTitle>
        <Typography sx={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>
          {loading ? 'Đang tải...' : `${comments.length} tương tác`}
        </Typography>
      </Box>

      {loading ? (
        <Typography sx={{ py: 3, fontSize: 14, color: MUTED, textAlign: 'center' }}>
          Đang tải bình luận...
        </Typography>
      ) : comments.length === 0 ? (
        <Typography sx={{ py: 3, fontSize: 14, color: MUTED, textAlign: 'center' }}>
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </Typography>
      ) : (
        <Box
          sx={{
            maxHeight: COMMENT_LIST_MAX_HEIGHT,
            overflowY: 'auto',
            pr: 0.5,
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(8,145,178,0.35) transparent',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(8,145,178,0.35)',
              borderRadius: '99px',
            },
          }}
        >
          {/* ĐỆ QUY comment*/}
          {nestedComments.map((comment) => (
            <MentorCommentItem
              key={comment.id}
              comment={comment}
              replying={replyingId}
              submitting={submittingId === comment.id}
              onStartReply={setReplyingId}
              onCancelReply={() => setReplyingId(null)}
              onSubmitReply={handleSubmitReply}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
