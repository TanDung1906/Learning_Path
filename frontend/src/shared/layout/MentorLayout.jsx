import { Box } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import { pageContentSx } from './MainLayout';
import { MentorLayoutGuard } from '@/shared/routing/RoleShellRedirects';
import { NavigationGuardProvider } from '@/context/NavigationGuardContext';

export default function MentorLayout() {
  return (
    <MentorLayoutGuard>
      <NavigationGuardProvider>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#FFFFFF',
          }}
        >
          <Header logoTo="/mentor/courses" profilePath="/mentor/profile" showMyCoursesButton={false} />
          <Sidebar variant="mentor" />

          <Box
            component="main"
            sx={{
              ml: `${SIDEBAR_WIDTH}px`,
              flex: 1,
              bgcolor: '#FFFFFF',
            }}
          >
            <Box sx={pageContentSx}>
              <Outlet />
            </Box>
          </Box>
        </Box>

        <Footer />
      </NavigationGuardProvider>
    </MentorLayoutGuard>
  );
}
