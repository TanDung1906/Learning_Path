const API_BASE = 'http://localhost:5000/api';

// ==========================================
// CÁC HÀM HELPER GỌI API CHO GỌN CODE
// ==========================================

/**
 * Hàm phụ trợ chuyên dùng để gọi các API xác thực (Đăng nhập, Đăng ký, OTP, Onboarding...) có phương thức POST.
 */
const apiAuthFetch = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}/auth${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { ok: data.success, status: data.status, data: data.user || data, token: data.token };
};

/**
 * Hàm phụ trợ tự động đọc JWT Token từ localStorage và tạo Header Authorization để gửi đi.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Hàm phụ trợ chung để thực hiện các yêu cầu GET đọc dữ liệu từ Backend (tự động đính kèm Token bảo mật).
 */
const apiGet = async (endpoint) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { ...getAuthHeaders() }
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
};

/**
 * Hàm phụ trợ chung để thực hiện các yêu cầu POST gửi dữ liệu lên Backend (tự động đính kèm Token bảo mật).
 */
const apiPost = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};

// ==========================================
// 1. API KHÓA HỌC (COURSES)
// ==========================================

/**
 * Lấy toàn bộ danh sách khóa học (hỗ trợ đính kèm mã user để lọc thông tin cá nhân hóa nếu đã đăng nhập).
 */
export const getCoursesApi = (userId) => {
  const headers = userId ? { 'x-user-id': String(userId), ...getAuthHeaders() } : { ...getAuthHeaders() };
  return fetch(`${API_BASE}/courses`, { headers })
    .then((res) => res.json())
    .then((data) => ({ ok: true, data }))
    .catch(() => ({ ok: false, data: {} }));
};

/**
 * Lấy danh sách các khóa học nổi bật nhất (giới hạn số lượng hiển thị).
 */
export const getTopCoursesApi = (limit = 4) => apiGet(`/courses/top?limit=${limit}`);

/**
 * Gửi yêu cầu đăng ký tham gia (enroll) một khóa học mới.
 */
export const enrollCourseApi = (data) => apiPost('/courses/enroll', data);

/**
 * Lấy danh sách các khóa học mà học viên hiện tại đang tham gia.
 */
export const getMyCoursesApi = (userId) => apiGet(`/courses/my?userId=${userId}`);


// ==========================================
// 2. API XÁC THỰC (AUTH & USER)
// ==========================================

/**
 * Thực hiện yêu cầu Đăng nhập tài khoản bằng Email và Password.
 */
export const loginApi = (email, password) => apiAuthFetch('/login', { email, password });

/**
 * Thực hiện yêu cầu đăng ký tài khoản mới (gửi thông tin ban đầu lên để nhận mã OTP).
 */
export const registerApi = (formData) => apiAuthFetch('/register', formData);

/**
 * Xác thực mã OTP gửi qua Email để chính thức tạo tài khoản.
 */
export const verifyOtpApi = (email, otpCode) => apiAuthFetch('/verify-otp', { email, otpCode });

/**
 * Lấy danh sách toàn bộ các danh mục học tập (Categories) từ Database.
 */
export const getCategoriesApi = () => apiGet('/categories');

/**
 * Lấy danh sách toàn bộ các trình độ học tập (Levels) từ Database.
 */
export const getLevelsApi = () => apiGet('/levels');

/**
 * Lưu thông tin khảo sát ban đầu của học viên mới (onboarding: các lĩnh vực quan tâm, trình độ, mục tiêu).
 */
export const saveOnboardingApi = (userId, categoryIds, levelId, goal) =>
  apiAuthFetch('/onboarding', { userId, categoryIds, levelId, goal });

/**
 * Gửi yêu cầu OTP để đặt lại mật khẩu khi bị quên.
 */
export const forgotPasswordApi = (email) => apiAuthFetch('/forgot-password', { email });

/**
 * Xác thực OTP và đặt mật khẩu mới cho người dùng.
 */
export const resetPasswordApi = (email, otp, newPassword) => apiAuthFetch('/reset-password', { email, otp, newPassword });