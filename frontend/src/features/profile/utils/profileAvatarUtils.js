const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '').replace(/\/$/, '');

export const AVATAR_UPDATED_EVENT = 'avatar-updated';

/**
 * Hàm xử lý và chuẩn hóa URL của ảnh đại diện.
 * - Nếu không có ảnh, trả về null.
 * - Nếu đường dẫn là link tuyệt đối (http/https) hoặc chuỗi base64 (data:), giữ nguyên.
 * - Nếu là đường dẫn tương đối (ví dụ: '/uploads/avatar.png'), nối thêm host của API backend để tạo link tuyệt đối.
 */
export function resolveAvatarUrl(avatarUrl) {
  if (!avatarUrl) return null;
  if (/^https?:\/\//i.test(avatarUrl) || avatarUrl.startsWith('data:')) return avatarUrl;
  const path = avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`;
  return `${API_ORIGIN}${path}`;
}

/**
 * Hàm lưu trữ lâu dài (persist) URL ảnh đại diện mới của người dùng.
 * - Chuẩn hóa URL trước khi lưu.
 * - Lưu trực tiếp vào localStorage khóa 'avatarUrl'.
 * - Cập nhật trường 'avatarUrl' nằm bên trong đối tượng JSON 'user' trong localStorage.
 * - Phát đi một Custom Event (avatar-updated) để các component khác (ví dụ: Header) cập nhật ngay lập tức.
 */
export function persistUserAvatar(avatarUrl) {
  const resolved = resolveAvatarUrl(avatarUrl);
  if (!resolved) return null;

  localStorage.setItem('avatarUrl', resolved);

  try {
    const raw = localStorage.getItem('user');
    if (raw && raw !== 'undefined' && raw !== 'null') {
      const user = JSON.parse(raw);
      localStorage.setItem('user', JSON.stringify({ ...user, avatarUrl: resolved }));
    }
  } catch {
    // bỏ qua nếu dữ liệu user bị lỗi
  }

  window.dispatchEvent(new CustomEvent(AVATAR_UPDATED_EVENT, { detail: { avatarUrl: resolved } }));
  return resolved;
}

/**
 * Hàm lấy ra URL ảnh đại diện đang được lưu trữ trong localStorage.
 * - Ưu tiên lấy từ khóa lẻ 'avatarUrl'.
 * - Nếu không có, tìm kiếm trong thuộc tính 'avatarUrl' của đối tượng 'user' đã parse.
 * - Trả về link ảnh đã chuẩn hóa hoặc null.
 */
export function getStoredAvatarUrl() {
  const explicit = localStorage.getItem('avatarUrl');
  if (explicit) return explicit.replace(/(https?:\/\/.*?)\/\//, '$1/');

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.avatarUrl ? resolveAvatarUrl(user.avatarUrl) : null;
  } catch {
    return null;
  }
}
