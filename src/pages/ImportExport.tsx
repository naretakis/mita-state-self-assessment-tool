/**
 * Import/Export page - Manage assessment data import, export, and backup
 */

import { JSX, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DataObjectIcon from '@mui/icons-material/DataObject';
import RestoreIcon from '@mui/icons-material/Restore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import HistoryIcon from '@mui/icons-material/History';
import { ImportDialog, StateNameDialog } from '../components/export';
import { DashboardStats } from '../components/dashboard';
import { useScores } from '../hooks';
import { getAllDomains } from '../services/capabilities';
import {
  exportAsJson,
  exportAsZip,
  exportAsPdf,
  exportDomainCsv,
  exportAllDomainsCsv,
  downloadBlob,
  downloadText,
  generateFilename,
} from '../services/export';

type PendingExport =
  | { type: 'zip' }
  | { type: 'pdf' }
  | { type: 'csv-all' }
  | { type: 'csv'; domainId: string; domainName: string };

export default function ImportExport(): JSX.Element {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [stateNameDialogOpen, setStateNameDialogOpen] = useState(false);
  const [pendingExport, setPendingExport] = useState<PendingExport | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { getStatusCounts, getDomainScore, getOverallScore } = useScores();
  const statusCounts = getStatusCounts();
  const overallScore = getOverallScore();
  const domains = getAllDomains();

  // Get domains with finalized assessments
  const domainsWithAssessments = domains.filter((d) => getDomainScore(d.id) !== null);
  const hasData = statusCounts.finalized > 0 || statusCounts.inProgress > 0;

  const handleImportComplete = (): void => {
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 5000);
  };

  // Exports that need state name prompt
  const startExportWithStateName = (exportType: PendingExport): void => {
    setPendingExport(exportType);
    setStateNameDialogOpen(true);
  };

  const handleStateNameConfirm = async (stateName: string): Promise<void> => {
    setStateNameDialogOpen(false);
    if (!pendingExport) return;

    const exportType = pendingExport;
    setPendingExport(null);

    switch (exportType.type) {
      case 'zip':
        await handleExportZip(stateName);
        break;
      case 'pdf':
        await handleExportPdf(stateName);
        break;
      case 'csv-all':
        await handleExportAllCsv(stateName);
        break;
      case 'csv':
        await handleExportDomainCsv(exportType.domainId, exportType.domainName, stateName);
        break;
    }
  };

  const handleExportZip = async (stateName: string): Promise<void> => {
    setExporting('zip');
    setError(null);
    try {
      const blob = await exportAsZip({ scope: 'full', format: 'zip', stateName }, (p) =>
        setExportProgress(p)
      );
      downloadBlob(blob, generateFilename('backup', 'zip'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(null);
      setExportProgress(0);
    }
  };

  const handleExportJson = async (): Promise<void> => {
    setExporting('json');
    setError(null);
    try {
      const json = await exportAsJson({ scope: 'full', format: 'json' });
      downloadText(json, generateFilename('data', 'json'), 'application/json');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(null);
    }
  };

  const handleExportPdf = async (stateName: string): Promise<void> => {
    setExporting('pdf');
    setError(null);
    try {
      const blob = await exportAsPdf({ scope: 'full', format: 'pdf', stateName }, (p) =>
        setExportProgress(p)
      );
      downloadBlob(blob, generateFilename('report', 'pdf'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(null);
      setExportProgress(0);
    }
  };

  const handleExportDomainCsv = async (
    domainId: string,
    domainName: string,
    stateName: string
  ): Promise<void> => {
    setExporting(`csv-${domainId}`);
    setError(null);
    try {
      const csv = await exportDomainCsv(domainId, stateName);
      if (csv) {
        const filename = `${domainName.toLowerCase().replace(/\s+/g, '-')}-maturity-profile.csv`;
        downloadText(csv, filename, 'text/csv');
      } else {
        throw new Error('No finalized assessments for this domain');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(null);
    }
  };

  const handleExportAllCsv = async (stateName: string): Promise<void> => {
    setExporting('csv-all');
    setError(null);
    try {
      const csv = await exportAllDomainsCsv(stateName);
      if (csv) {
        downloadText(csv, generateFilename('all-domains-maturity-profile', 'csv'), 'text/csv');
      } else {
        throw new Error('No finalized assessments to export');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Import & Export
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Export your assessment data for CMS submission, stakeholder review, or backup. Import
        previous assessments to restore or merge data.
      </Typography>

      {/* Stats Summary - same as Dashboard */}
      <DashboardStats
        total={statusCounts.total}
        finalized={statusCounts.finalized}
        inProgress={statusCounts.inProgress}
        notStarted={statusCounts.notStarted}
        overallScore={overallScore}
      />

      {importSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Import completed successfully! Your assessments have been updated.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Export Section */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <DownloadIcon
                aria-hidden="true"
                sx={{ mr: 1, color: 'primary.main', fontSize: 28 }}
              />
              <Typography variant="h5" component="h2">
                Export
              </Typography>
            </Box>

            {/* Primary Export: Complete Backup */}
            <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FolderZipIcon color="primary" aria-hidden="true" />
                  <Typography variant="h6" component="h3">
                    Complete Backup (ZIP)
                  </Typography>
                  <Chip label="Recommended" size="small" color="primary" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  The most comprehensive export option. Creates a single ZIP file containing
                  everything you need to fully restore your assessments.
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" color="success" aria-hidden="true" />
                    </ListItemIcon>
                    <ListItemText
                      primary="JSON data file"
                      secondary="All assessments, ratings, history, and tags"
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" color="success" aria-hidden="true" />
                    </ListItemIcon>
                    <ListItemText
                      primary="CSV maturity profiles"
                      secondary="CMS-format profiles for each assessed domain"
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" color="success" aria-hidden="true" />
                    </ListItemIcon>
                    <ListItemText
                      primary="File attachments"
                      secondary="All uploaded evidence documents"
                    />
                  </ListItem>
                </List>
                {exporting === 'zip' && (
                  <LinearProgress
                    variant="determinate"
                    value={exportProgress}
                    aria-label={`Export progress: ${exportProgress}% complete`}
                    sx={{ mt: 2 }}
                  />
                )}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  startIcon={<FolderZipIcon />}
                  onClick={() => startExportWithStateName({ type: 'zip' })}
                  disabled={!hasData || exporting !== null}
                  size="large"
                >
                  {exporting === 'zip' ? 'Exporting...' : 'Download ZIP Backup'}
                </Button>
              </CardActions>
            </Card>

            {/* Secondary Exports */}
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Other Export Formats
            </Typography>

            {/* CSV Maturity Profiles */}
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TableChartIcon color="success" aria-hidden="true" />
                  <Typography variant="h6" component="h3">
                    CSV Maturity Profiles
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Export maturity profiles in the CMS-standard CSV format for upload to MES Hub
                  (MESH). Export all domains in a single file or individual domain profiles.
                </Typography>

                {domainsWithAssessments.length > 0 ? (
                  <>
                    {/* Export All - Primary Action */}
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<TableChartIcon />}
                        onClick={() => startExportWithStateName({ type: 'csv-all' })}
                        disabled={exporting !== null}
                      >
                        {exporting === 'csv-all'
                          ? 'Exporting...'
                          : `Export All Profiles (${domainsWithAssessments.length} domains)`}
                      </Button>
                    </Box>

                    {/* Individual Domain Exports */}
                    <Accordion elevation={0} sx={{ bgcolor: 'grey.50' }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                        aria-controls="individual-domain-exports-content"
                        id="individual-domain-exports-header"
                      >
                        <Typography variant="body2" color="text.secondary">
                          Export individual domain profiles
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails id="individual-domain-exports-content">
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {domainsWithAssessments.map((domain) => (
                            <Button
                              key={domain.id}
                              size="small"
                              variant="outlined"
                              onClick={() =>
                                startExportWithStateName({
                                  type: 'csv',
                                  domainId: domain.id,
                                  domainName: domain.name,
                                })
                              }
                              disabled={exporting !== null}
                            >
                              {exporting === `csv-${domain.id}` ? 'Exporting...' : domain.name}
                            </Button>
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No finalized assessments yet. Complete and finalize assessments to export
                    maturity profiles.
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Grid container spacing={2}>
              {/* PDF Report */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PictureAsPdfIcon color="error" aria-hidden="true" />
                      <Typography variant="subtitle1" component="h3">
                        PDF Report
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Professional report for stakeholder review and CMS submission. Includes
                      summary statistics, domain scores, and assessment details.
                    </Typography>
                    {exporting === 'pdf' && (
                      <LinearProgress
                        variant="determinate"
                        value={exportProgress}
                        aria-label={`PDF export progress: ${exportProgress}% complete`}
                        sx={{ mt: 2 }}
                      />
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<PictureAsPdfIcon />}
                      onClick={() => startExportWithStateName({ type: 'pdf' })}
                      disabled={statusCounts.finalized === 0 || exporting !== null}
                    >
                      {exporting === 'pdf' ? 'Generating...' : 'Export PDF'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>

              {/* JSON Data */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <DataObjectIcon color="info" aria-hidden="true" />
                      <Typography variant="subtitle1" component="h3">
                        JSON Data
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Raw assessment data without attachments. Smaller file size, suitable for data
                      backup or transfer between browsers.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<DataObjectIcon />}
                      onClick={handleExportJson}
                      disabled={!hasData || exporting !== null}
                    >
                      {exporting === 'json' ? 'Exporting...' : 'Export JSON'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Import Section */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <UploadFileIcon
                aria-hidden="true"
                sx={{ mr: 1, color: 'primary.main', fontSize: 28 }}
              />
              <Typography variant="h5" component="h2">
                Import
              </Typography>
            </Box>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <RestoreIcon color="primary" aria-hidden="true" />
                  <Typography variant="h6" component="h3">
                    Restore from Backup
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Import assessment data from a previous backup. Supports both ZIP (complete backup)
                  and JSON (data only) files.
                </Typography>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Supported Formats
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <FolderZipIcon fontSize="small" aria-hidden="true" />
                    </ListItemIcon>
                    <ListItemText primary=".zip" secondary="Complete backup with attachments" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <DataObjectIcon fontSize="small" aria-hidden="true" />
                    </ListItemIcon>
                    <ListItemText primary=".json" secondary="Data-only backup" />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  startIcon={<RestoreIcon />}
                  onClick={() => setImportDialogOpen(true)}
                  size="large"
                >
                  Import Backup
                </Button>
              </CardActions>
            </Card>

            {/* How Import Works */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                How Import Works
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Import uses a "merge with history" strategy — no data is ever lost:
              </Typography>
              <List dense disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <DescriptionIcon fontSize="small" color="action" aria-hidden="true" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Newer imported data"
                    secondary="Becomes current; existing moves to history"
                    slotProps={{
                      primary: { variant: 'body2', fontWeight: 500 },
                      secondary: { variant: 'caption' },
                    }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <HistoryIcon fontSize="small" color="action" aria-hidden="true" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Older imported data"
                    secondary="Added to history; current stays unchanged"
                    slotProps={{
                      primary: { variant: 'body2', fontWeight: 500 },
                      secondary: { variant: 'caption' },
                    }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AttachFileIcon fontSize="small" color="action" aria-hidden="true" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Attachments"
                    secondary="Restored from ZIP backups automatically"
                    slotProps={{
                      primary: { variant: 'body2', fontWeight: 500 },
                      secondary: { variant: 'caption' },
                    }}
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* State Name Dialog */}
      <StateNameDialog
        open={stateNameDialogOpen}
        onClose={() => {
          setStateNameDialogOpen(false);
          setPendingExport(null);
        }}
        onConfirm={handleStateNameConfirm}
        exportType={
          pendingExport?.type === 'pdf'
            ? 'PDF report'
            : pendingExport?.type === 'csv'
              ? 'CSV maturity profile'
              : 'export'
        }
      />

      {/* Import Dialog */}
      <ImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </Container>
  );
}
