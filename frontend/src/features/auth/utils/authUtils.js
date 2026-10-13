export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
}

export function getUserRoles(user = getUser()) {
  if (Array.isArray(user?.roles)) {
    return user.roles
      .map((role) => {
        if (typeof role === "string") return role.trim();
        return String(role?.roleName || role?.RoleName || "").trim();
      })
      .filter(Boolean);
  }

  if (user?.role) {
    return [String(user.role).trim()].filter(Boolean);
  }

  return [];
}

export function isMentor(user = getUser()) {
  return getUserRoles(user).some((role) => role.toLowerCase() === "mentor");
}

export function isAdmin(user = getUser()) {
  return getUserRoles(user).some((role) => role.toLowerCase() === "admin");
}

export function isStudent(user = getUser()) {
  const normalized = getUserRoles(user).map((role) => role.toLowerCase());

  if (normalized.includes("admin") || normalized.includes("mentor")) {
    return false;
  }

  if (normalized.includes("student")) {
    return true;
  }

  // Đăng ký qua OTP chỉ dành cho học viên — chưa có User_Roles vẫn coi là Student
  return normalized.length === 0;
}

export function getPrimaryRoleLabel(user = getUser()) {
  if (isAdmin(user)) return "Admin";
  if (isMentor(user)) return "Mentor";
  if (isStudent(user)) return "Học viên";
  return "Học viên";
}

/** Trang mặc định theo role — single source of truth cho redirect. */
export const ROLE_DEFAULT_PATHS = {
  Admin: "/admin/accounts",
  Mentor: "/mentor/courses",
  Student: "/home",
  /** Student bị chặt khỏi shell Mentor/Admin — ưu tiên trang khóa học. */
  StudentBrowse: "/courses",
};

export function isAuthenticatedUser(user = getUser()) {
  return Boolean(user && Object.keys(user).length > 0 && localStorage.getItem("user"));
}

/** Đích điều hướng sau đăng nhập / hoàn tất survey — theo role. */
export function getPostLoginPath(user = getUser(), { isFirstLogin } = {}) {
  if ((isFirstLogin ?? user?.isFirstLogin) && isStudent(user)) return "/survey";
  return getRoleDefaultPath(user);
}

/** Trang mặc định theo role (bỏ qua first-login). Guest → /home. */
export function getRoleDefaultPath(user = getUser()) {
  if (!isAuthenticatedUser(user)) return ROLE_DEFAULT_PATHS.Student;
  if (isAdmin(user)) return ROLE_DEFAULT_PATHS.Admin;
  if (isMentor(user)) return ROLE_DEFAULT_PATHS.Mentor;
  return ROLE_DEFAULT_PATHS.Student;
}

/** Tra redirect từ map role → path (không phân biệt hoa thường). */
export function resolveRoleRedirectPath(user, roleRedirects = {}) {
  if (!roleRedirects || typeof roleRedirects !== "object") return null;

  const normalizedMap = Object.fromEntries(
    Object.entries(roleRedirects).map(([role, path]) => [role.toLowerCase(), path]),
  );

  for (const role of getUserRoles(user)) {
    const target = normalizedMap[role.toLowerCase()];
    if (target) return target;
  }

  return null;
}
