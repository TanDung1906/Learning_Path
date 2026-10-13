
export function mapApiComment(row) {
  return {
    id: row.CommentId,
    authorName: row.FullName || 'Học viên',
    avatarUrl: row.AvatarUrl || null,
    rating: row.Rating ?? null,
    content: row.Content,
    createdAt: row.CreatedAt,
    userId: row.UserId,
    isInstructor: Boolean(row.IsInstructor),
    parentCommentId: row.ParentCommentId || null,
    editCount: row.EditCount || 0,
    progressPercentage: row.ProgressPercentage || 0,
  };
}
export function getCommentInitials(name = '') {
  return String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';
}

export function formatCommentDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function resolveAvatarSrc(avatarUrl) {
  if (!avatarUrl) return null;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;
  return `http://localhost:5000${avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`}`;
}
