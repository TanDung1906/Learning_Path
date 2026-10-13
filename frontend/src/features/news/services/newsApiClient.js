/**
 * News API client — gọi backend thật tại /api/news
 */
import { getApiOrigin } from '@/shared/utils/apiOrigin';

const API_BASE = `${getApiOrigin()}/api/news`;

function normalizeRoleName(role) {
  if (typeof role === 'string') return role.trim();
  return String(role?.roleName || role?.RoleName || '').trim();
}

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };

  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.userId) {
        headers['x-user-id'] = String(user.userId);
      }
      // Fallback nếu token chỉ nằm trong object user (legacy)
      if (!token && user?.token) {
        headers.Authorization = `Bearer ${user.token}`;
      }
      const roles = Array.isArray(user?.roles) ? user.roles : user?.role ? [user.role] : [];
      const isAdmin = roles.some((r) => normalizeRoleName(r).toLowerCase() === 'admin');
      if (isAdmin) {
        headers['x-role-name'] = 'Admin';
      }
    }
  } catch {
    // ignore
  }
  return headers;
}

async function handleResponse(response) {
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) {
    return { ok: false, message: data.message || 'Lỗi server', data: null };
  }
  return {
    ok: true,
    data: data.data,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    message: data.message,
  };
}

export async function apiGetNewsList({ status, categoryId, search, page, pageSize, sort } = {}) {
  try {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (categoryId) params.set('categoryId', categoryId);
    if (search) params.set('search', search);
    if (page) params.set('page', page);
    if (pageSize) params.set('pageSize', pageSize);
    if (sort) params.set('sort', sort);

    const query = params.toString();
    const url = query ? `${API_BASE}?${query}` : API_BASE;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch {
    return { ok: false, message: 'Không thể kết nối đến server', data: [] };
  }
}

export async function apiGetNewsById(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch {
    return { ok: false, message: 'Không thể kết nối đến server', data: null };
  }
}

export async function apiCreateNews(payload) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch {
    return { ok: false, message: 'Không thể kết nối đến server', data: null };
  }
}

export async function apiUpdateNews(id, payload) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch {
    return { ok: false, message: 'Không thể kết nối đến server', data: null };
  }
}

export async function apiDeleteNews(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch {
    return { ok: false, message: 'Không thể kết nối đến server', data: null };
  }
}
