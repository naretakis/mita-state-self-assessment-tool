/**
 * Import Dialog Component
 *
 * Dialog for importing assessment data from JSON or ZIP files.
 */

import { JSX, useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ErrorIcon from '@mui/icons-material/Error';
import { importFromJson, importFromZip, readFileAsText } from '../../services/export';
import type { ImportResult, ImportItemResult } from '../../services/export';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
}

type ImportState = 'idle' | 'importing' | 'complete';

/**
 * Import dialog component
 */
export default function ImportDialog({
  open,
  onClose,
  onImportComplete,
}: ImportDialogProps): JSX.Element {
  const [state, setState] = useState<ImportState>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleImport = useCallback(async () => {
    if (!selectedFile) return;

    setState('importing');
    setError(null);
    setProgress(0);

    const onProgress = (p: number, msg: string): void => {
      setProgress(p);
      setProgressMessage(msg);
    };

    try {
      let importResult: ImportResult;

      if (selectedFile.name.endsWith('.zip')) {
        importResult = await importFromZip(selectedFile, onProgress);
      } else if (selectedFile.name.endsWith('.json')) {
        const jsonString = await readFileAsText(selectedFile);
        importResult = await importFromJson(jsonString, onProgress);
      } else {
        throw new Error('Unsupported file type. Please use .json or .zip files.');
      }

      setResult(importResult);
      setState('complete');

      if (importResult.success) {
        onImportComplete?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
      setState('idle');
    }
  }, [selectedFile, onImportComplete]);

  const handleClose = useCallback(() => {
    setState('idle');
    setSelectedFile(null);
    setError(null);
    setResult(null);
    setProgress(0);
    onClose();
  }, [onClose]);

  const getActionIcon = (action: ImportItemResult['action']): JSX.Element => {
    switch (action) {
      case 'imported_current':
        return <CheckCircleIcon color="success" aria-hidden="true" />;
      case 'imported_history':
        return <HistoryIcon color="info" aria-hidden="true" />;
      case 'skipped':
        return <SkipNextIcon color="action" aria-hidden="true" />;
      case 'error':
        return <ErrorIcon color="error" aria-hidden="true" />;
    }
  };

  const getActionLabel = (action: ImportItemResult['action']): string => {
    switch (action) {
      case 'imported_current':
        return 'Current';
      case 'imported_history':
        return 'History';
      case 'skipped':
        return 'Skipped';
      case 'error':
        return 'Error';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="import-dialog-title"
    >
      <DialogTitle id="import-dialog-title">Import Assessment Data</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {state === 'idle' && (
          <>
            {/* Drop Zone */}
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: selectedFile ? 'action.selected' : 'background.default',
                borderStyle: 'dashed',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              role="button"
              tabIndex={0}
              aria-label={
                selectedFile
                  ? `Selected file: ${selectedFile.name}`
                  : 'Drop a file here or click to browse. Supports .json and .zip files'
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.zip"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                aria-label="Select file to import"
              />
              <UploadFileIcon
                aria-hidden="true"
                sx={{ fontSize: 48, color: 'action.active', mb: 1 }}
              />
              {selectedFile ? (
                <>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1">Drop a file here or click to browse</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supports .json and .zip files
                  </Typography>
                </>
              )}
            </Paper>

            {/* Info Box */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'info.lighter',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'info.light',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <strong>How import works:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                • Newer imported data becomes current, existing moves to history
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Older imported data is added to history
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • No data is ever lost during import
              </Typography>
            </Box>
          </>
        )}

        {state === 'importing' && (
          <Box sx={{ py: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {progressMessage}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              aria-label={`Import progress: ${progress}% complete`}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {progress}% complete
            </Typography>
          </Box>
        )}

        {state === 'complete' && result && (
          <Box>
            <Alert severity={result.success ? 'success' : 'warning'} sx={{ mb: 2 }}>
              {result.success
                ? `Import complete! ${result.importedAsCurrent} as current, ${result.importedAsHistory} as history, ${result.skipped} skipped.`
                : `Import completed with ${result.errors.length} error(s).`}
            </Alert>

            {/* Summary Chips */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<CheckCircleIcon />}
                label={`${result.importedAsCurrent} Current`}
                color="success"
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<HistoryIcon />}
                label={`${result.importedAsHistory} History`}
                color="info"
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<SkipNextIcon />}
                label={`${result.skipped} Skipped`}
                variant="outlined"
                size="small"
              />
            </Box>

            {/* Details List */}
            {result.details.length > 0 && (
              <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                <List dense>
                  {result.details.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getActionIcon(item.action)}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.areaName}
                        secondary={item.reason}
                        slotProps={{
                          primary: { variant: 'body2' },
                          secondary: { variant: 'caption' },
                        }}
                      />
                      <Chip
                        label={getActionLabel(item.action)}
                        size="small"
                        variant="outlined"
                        color={
                          item.action === 'imported_current'
                            ? 'success'
                            : item.action === 'imported_history'
                              ? 'info'
                              : item.action === 'error'
                                ? 'error'
                                : 'default'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{state === 'complete' ? 'Close' : 'Cancel'}</Button>
        {state === 'idle' && (
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={!selectedFile}
            startIcon={<UploadFileIcon />}
          >
            Import
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
