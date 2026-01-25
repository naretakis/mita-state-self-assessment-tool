/**
 * State Name Dialog
 *
 * Simple dialog to prompt for state name before export.
 */

import { JSX, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material';

interface StateNameDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (stateName: string) => void;
  exportType: string;
}

/**
 * Dialog to prompt for state name before export
 */
export default function StateNameDialog({
  open,
  onClose,
  onConfirm,
  exportType,
}: StateNameDialogProps): JSX.Element {
  const [stateName, setStateName] = useState('');

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setStateName('');
    }
  }, [open]);

  const handleConfirm = (): void => {
    onConfirm(stateName || 'State');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="state-name-dialog-title"
    >
      <DialogTitle id="state-name-dialog-title">Enter State Name</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This will be used in the {exportType} header.
        </Typography>
        <TextField
          id="state-name-input"
          label="State Name"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          placeholder="e.g., California"
          fullWidth
          size="small"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleConfirm();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
