/** Origin backend (không có /api) — dùng cho static files và API base. */
export function getApiOrigin() {
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return String(raw).replace(/\/api\/?$/, '').replace(/\/$/, '');
}

export function getApiBasePath() {
  return `${getApiOrigin()}/api`;
}
