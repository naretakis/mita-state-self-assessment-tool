/**
 * About page - How to use the tool, understanding your data, and contributing
 */

import { JSX } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import Looks6Icon from '@mui/icons-material/Looks6';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { GITHUB_REPO_URL } from '../constants';

export default function About(): JSX.Element {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        About This Tool
      </Typography>

      <Typography variant="body1" paragraph color="text.secondary">
        The MITA 4.0 State Self-Assessment Tool helps State Medicaid Agencies evaluate their
        Medicaid Enterprise maturity. This page explains how to use the tool effectively and how
        your data is managed.
      </Typography>

      {/* How to Use This Tool */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          How to Use This Tool
        </Typography>

        <Typography variant="body1" paragraph>
          The assessment process is designed to be straightforward. Here's the typical workflow:
        </Typography>

        <List>
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <LooksOneIcon color="primary" aria-hidden="true" />
            </ListItemIcon>
            <ListItemText
              primary="Start from the Dashboard"
              secondary="The Dashboard shows all 75 capability areas organized by domain. When you first arrive, everything will be marked as 'Not Started.' Click on any capability area to begin its assessment."
            />
          </ListItem>

          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <LooksTwoIcon color="primary" aria-hidden="true" />
            </ListItemIcon>
            <ListItemText
              primary="Complete the ORBIT Assessment"
              secondary="Each capability is assessed across five ORBIT dimensions: Outcomes, Roles, Business Architecture, Information & Data, and Technology. For each dimension, you'll rate your current maturity level (1-5) and can optionally set a target level. The tool provides guiding questions to help you determine the appropriate level."
            />
          </ListItem>

          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <Looks3Icon color="primary" aria-hidden="true" />
            </ListItemIcon>
            <ListItemText
              primary="Add Notes and Evidence"
              secondary="Document your rationale, identify barriers to advancement, and outline plans for improvement. You can also attach supporting documents like policies, procedures, or screenshots."
            />
          </ListItem>

          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <Looks4Icon color="primary" aria-hidden="true" />
            </ListItemIcon>
            <ListItemText
              primary="Finalize Your Assessment"
              secondary="Once you've completed all dimensions, finalize the assessment. This locks in your ratings and creates a snapshot in the assessment history. You can still edit finalized assessments later—the tool will preserve your previous ratings for reference."
            />
          </ListItem>

          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <Looks5Icon color="primary" aria-hidden="true" />
            </ListItemIcon>
            <ListItemText
              primary="Organize with Tags"
              secondary="Use tags to organize your assessments by project, fiscal year, module, or any other grouping that makes sense for your agency. Tags help you filter and find assessments quickly on the Dashboard."
            />
          </ListItem>

          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <Looks6Icon color="primary" aria-hidden="true" />
            </ListItemIcon>
            <ListItemText
              primary="Export Your Results"
              secondary="Generate reports in multiple formats: PDF for stakeholder presentations, CSV in the CMS Maturity Profile format, or a complete ZIP backup that includes all your data and attachments."
            />
          </ListItem>
        </List>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" component={RouterLink} to="/dashboard">
            Go to Dashboard
          </Button>
        </Box>
      </Paper>

      {/* Understanding Your Data */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Understanding Your Data
        </Typography>

        <Typography variant="body1" paragraph>
          This tool stores all assessment data locally in your web browser. No data is ever sent to
          external servers—your assessments are completely private and remain on your device.
        </Typography>

        <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Important:</strong> Because data is stored in your browser, clearing your
            browser data or using a different browser/device will result in losing your assessments.
            We strongly recommend exporting your data regularly as a backup.
          </Typography>
        </Alert>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
          Backing Up Your Work
        </Typography>
        <Typography variant="body1" paragraph>
          Use the <strong>Import/Export</strong> page to:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• Export a ZIP file containing all your assessments and attachments" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Import a previously exported ZIP to restore your data" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Transfer assessments between browsers or devices" />
          </ListItem>
        </List>

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" component={RouterLink} to="/import-export">
            Go to Import/Export
          </Button>
        </Box>
      </Paper>

      {/* About MITA 4.0 and ORBIT */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          About MITA 4.0 and ORBIT
        </Typography>

        <Typography variant="body1" paragraph>
          The Medicaid Information Technology Architecture (MITA) 4.0 framework helps State Medicaid
          Agencies assess and improve their Medicaid Enterprise Systems. The ORBIT Maturity Model is
          the assessment framework used in MITA 4.0.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          ORBIT Dimensions
        </Typography>
        <Typography variant="body1" paragraph>
          Each capability area is assessed across five dimensions:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary={
                <>
                  <strong>Outcomes</strong> (Optional)
                </>
              }
              secondary="Business results and value delivery"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <>
                  <strong>Roles</strong> (Optional)
                </>
              }
              secondary="Organizational structure and responsibilities"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <>
                  <strong>Business Architecture</strong> (Required)
                </>
              }
              secondary="Process design and enterprise alignment"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <>
                  <strong>Information & Data</strong> (Required)
                </>
              }
              secondary="Data governance and management"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <>
                  <strong>Technology</strong> (Required)
                </>
              }
              secondary="Infrastructure, integration, and security (includes 7 sub-dimensions)"
            />
          </ListItem>
        </List>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
          Maturity Levels
        </Typography>
        <Typography variant="body1">
          Each dimension is rated on a scale from 1 to 5, with an option for N/A when a criterion
          doesn't apply:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Level 1: Initial" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Level 2: Developing" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Level 3: Defined" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Level 4: Managed" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Level 5: Optimized" />
          </ListItem>
        </List>
      </Paper>

      {/* Open Source */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <GitHubIcon aria-hidden="true" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2">
            Open Source
          </Typography>
        </Box>

        <Typography variant="body1" paragraph>
          This tool is open source and freely available. It was built to support State Medicaid
          Agencies in conducting their MITA 4.0 self-assessments.
        </Typography>

        <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
          <Typography variant="body2">
            Interested in contributing or reporting an issue? Visit our GitHub repository for
            documentation, source code, and contribution guidelines.
          </Typography>
        </Alert>

        <Link
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on GitHub (opens in new window)"
          sx={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <GitHubIcon aria-hidden="true" sx={{ mr: 0.5, fontSize: 18 }} />
          View on GitHub
        </Link>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          Built with React, TypeScript, and Material UI. Data stored locally using IndexedDB.
        </Typography>
      </Paper>
    </Container>
  );
}
