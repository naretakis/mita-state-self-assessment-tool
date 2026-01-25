import { JSX, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Box, Button, Container, Link, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Determines if a nav item is currently active based on the path
 */
function isNavActive(currentPath: string, navPath: string): boolean {
  if (navPath === '/results') {
    return currentPath.startsWith('/results');
  }
  return currentPath === navPath;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide footer on assessment pages (full-screen working area)
  const isAssessmentPage = location.pathname.startsWith('/assessment/');

  // Navigation items for cleaner rendering
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/results', label: 'Results', icon: <AssessmentIcon /> },
    { path: '/import-export', label: 'Import/Export', icon: <ImportExportIcon /> },
    { path: '/about', label: 'About', icon: <InfoOutlinedIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Skip to main content link - visually hidden until focused */}
      <Link
        href="#main-content"
        sx={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 9999,
          padding: 2,
          backgroundColor: 'primary.main',
          color: 'white',
          textDecoration: 'none',
          fontWeight: 600,
          '&:focus': {
            left: '50%',
            transform: 'translateX(-50%)',
            top: 8,
          },
        }}
      >
        Skip to main content
      </Link>

      <AppBar
        position="static"
        color="primary"
        component="nav"
        aria-label="Main navigation"
        sx={{ flexShrink: 0 }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/');
              }
            }}
            aria-label="MITA 4.0 SS-A Tool - Go to home page"
          >
            MITA 4.0 SS-A Tool
          </Typography>
          {navItems.map((item) => {
            const isActive = isNavActive(location.pathname, item.path);
            return (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                aria-current={isActive ? 'page' : undefined}
                sx={{
                  mr: item.path !== '/about' ? 1 : 0,
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        aria-label="Main content"
        sx={{
          flexGrow: 1,
          overflow: isAssessmentPage ? 'hidden' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          // Remove focus outline since this is just a skip link target
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        {children}
      </Box>

      {!isAssessmentPage && (
        <Box
          component="footer"
          role="contentinfo"
          aria-label="Site footer"
          sx={{
            py: 2,
            px: 2,
            flexShrink: 0,
            backgroundColor: 'grey.100',
            borderTop: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              MITA 4.0 State Self-Assessment Tool • All data stored locally in your browser •
              Version {__APP_VERSION__}
            </Typography>
          </Container>
        </Box>
      )}
    </Box>
  );
}
