/**
 * 404 Not Found page component.
 *
 * Displayed when a user navigates to a route that doesn't exist in the application.
 * Provides navigation options to return to the home page or dashboard.
 *
 * @returns The NotFound page component
 */

import { JSX } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function NotFound(): JSX.Element {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '6rem',
            fontWeight: 700,
            color: 'primary.main',
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button component={RouterLink} to="/" variant="outlined" startIcon={<HomeIcon />}>
            Go Home
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard"
            variant="contained"
            startIcon={<DashboardIcon />}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
