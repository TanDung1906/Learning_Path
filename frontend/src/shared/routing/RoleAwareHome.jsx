import { Navigate } from 'react-router-dom';
import HomePage from '@/features/home/HomePage';
import { getRoleDefaultPath, getUser } from '@/features/auth/utils/authUtils';
import { shouldLeaveStudentHome } from '@/shared/routing/RoleShellRedirects';

/** Trang chủ học viên — role khác về shell mặc định của role. */
export default function RoleAwareHome() {
  if (shouldLeaveStudentHome(getUser())) {
    return <Navigate to={getRoleDefaultPath()} replace />;
  }

  return <HomePage />;
}

/** Fallback URL không tồn tại — mỗi role về đúng trang mặc định. */
export function AppRootRedirect() {
  return <Navigate to={getRoleDefaultPath()} replace />;
}
