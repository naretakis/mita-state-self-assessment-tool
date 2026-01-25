/**
 * Status chip component for displaying assessment status
 */

import { JSX } from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

type Status = 'not_started' | 'in_progress' | 'finalized';

interface StatusChipProps {
  status: Status;
  size?: 'small' | 'medium';
}

const statusConfig: Record<
  Status,
  { label: string; color: 'default' | 'warning' | 'success'; icon: JSX.Element }
> = {
  not_started: {
    label: 'Not Started',
    color: 'default',
    icon: <RadioButtonUncheckedIcon fontSize="small" />,
  },
  in_progress: {
    label: 'In Progress',
    color: 'warning',
    icon: <PendingIcon fontSize="small" />,
  },
  finalized: {
    label: 'Finalized',
    color: 'success',
    icon: <CheckCircleIcon fontSize="small" />,
  },
};

/**
 * Chip displaying assessment status
 */
export function StatusChip({ status, size = 'small' }: StatusChipProps): JSX.Element {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      icon={config.icon}
      variant="outlined"
    />
  );
}
