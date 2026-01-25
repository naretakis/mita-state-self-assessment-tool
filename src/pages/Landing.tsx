/**
 * Landing page - Introduction and overview for first-time visitors
 */

import { JSX } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography, Grid, Link, Alert } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Landing(): JSX.Element {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Privacy First',
      description:
        'All data stays in your browser. No accounts required, no servers, no data collection.',
    },
    {
      icon: <CloudOffIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Works Offline',
      description: 'Full functionality after initial load, even without an internet connection.',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Guided Assessment',
      description:
        'Step-by-step workflow with guiding questions to help determine your maturity levels.',
    },
    {
      icon: <DownloadIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Export & Backup',
      description: 'Generate PDF reports, CSV exports for CMS, and ZIP backups of all your data.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0071bc 0%, #004c8c 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            MITA 4.0 State Self-Assessment Tool
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 2, opacity: 0.9 }}>
            Assess your Medicaid Enterprise maturity using the ORBIT framework
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.85, maxWidth: 600 }}>
            A free, open-source tool for State Medicaid Agencies to evaluate capabilities across 75
            areas and 5 ORBIT dimensions. Your data stays private—stored only in your browser.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
              px: 4,
              py: 1.5,
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Box sx={{ mb: 2 }} aria-hidden="true">
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            How It Works
          </Typography>

          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3" color="primary" gutterBottom>
                1. Select a Capability
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse the Dashboard to see all 75 capability areas organized by domain. Click any
                area to start its assessment.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3" color="primary" gutterBottom>
                2. Rate Each Dimension
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Evaluate your maturity across the five ORBIT dimensions using the guided questions.
                Add notes and attach evidence as you go.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3" color="primary" gutterBottom>
                3. Export Your Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Finalize assessments and export reports. Use tags to organize your work and create
                backups to protect your data.
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Link component={RouterLink} to="/guide" sx={{ mr: 3 }}>
              Learn more about using this tool
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Data Privacy Notice */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Your data is private.</strong> All assessment data is stored locally in your
            browser. Nothing is sent to external servers. Remember to export your data regularly as
            a backup—clearing your browser data will remove your assessments.
          </Typography>
        </Alert>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
            endIcon={<ArrowForwardIcon />}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
