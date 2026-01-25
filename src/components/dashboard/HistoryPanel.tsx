/**
 * Assessment history panel component
 * Clean inline design matching mita-3.0
 */

import { JSX } from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useHistory, useCapabilityAssessments } from '../../hooks';
import type { AssessmentHistory } from '../../types';

interface HistoryPanelProps {
  capabilityAreaId: string;
  open: boolean;
  onViewHistory: (historyId: string) => void;
  onDeleteHistory: (historyId: string) => void;
}

/**
 * Inline panel showing assessment history for a capability area
 */
export function HistoryPanel({
  capabilityAreaId,
  open,
  onViewHistory,
  onDeleteHistory,
}: HistoryPanelProps): JSX.Element | null {
  const { getHistoryForArea } = useHistory();
  const { getAssessmentForArea } = useCapabilityAssessments();
  const history = getHistoryForArea(capabilityAreaId);
  const currentAssessment = getAssessmentForArea(capabilityAreaId);

  if (!open) return null;

  const hasCurrentFinalized =
    currentAssessment?.status === 'finalized' && currentAssessment.overallScore !== undefined;
  const hasHistory = history.length > 0;

  if (!hasCurrentFinalized && !hasHistory) {
    return (
      <Box sx={{ pl: 5, py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          No assessments yet
        </Typography>
      </Box>
    );
  }

  const formatDateTime = (date: Date): string => {
    return new Date(date).toLocaleString(undefined, {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ pl: 5, py: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ mb: 1, display: 'block' }}
      >
        Assessment History
      </Typography>

      {/* Current finalized assessment */}
      {hasCurrentFinalized && currentAssessment && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 0.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'success.50',
            mx: -1,
            px: 1,
            borderRadius: 1,
          }}
        >
          <Box sx={{ width: 70 }}>
            <Chip
              label="Current"
              size="small"
              color="success"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
            />
          </Box>
          <Typography variant="body2" sx={{ width: 160 }}>
            {formatDateTime(currentAssessment.finalizedAt || currentAssessment.updatedAt)}
          </Typography>
          <Typography variant="body2" fontWeight={500} sx={{ width: 80 }}>
            Score: {currentAssessment.overallScore?.toFixed(1)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {currentAssessment.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.65rem' }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Historical assessments */}
      {history.map((entry: AssessmentHistory) => (
        <Box
          key={entry.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 0.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ width: 70 }} />
          <Typography variant="body2" sx={{ width: 160 }}>
            {formatDateTime(entry.snapshotDate)}
          </Typography>
          <Typography variant="body2" fontWeight={500} sx={{ width: 80 }}>
            Score: {entry.overallScore.toFixed(1)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            {entry.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.65rem' }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
            <IconButton size="small" onClick={() => onViewHistory(entry.id)} title="View details">
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDeleteHistory(entry.id)}
              title="Delete history entry"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
