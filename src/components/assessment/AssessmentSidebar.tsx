/**
 * Assessment Sidebar Component
 *
 * Compact navigation showing dimensions with progress indicators.
 */

import { JSX } from 'react';
import {
  Box,
  List,
  ListItemButton,
  Typography,
  LinearProgress,
  Divider,
  Paper,
  alpha,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PendingIcon from '@mui/icons-material/Pending';
import FlagIcon from '@mui/icons-material/Flag';
import type { OrbitDimensionId, TechnologySubDimensionId } from '../../types';

interface DimensionProgress {
  dimensionId: OrbitDimensionId;
  subDimensionId?: TechnologySubDimensionId;
  name: string;
  assessedCount: number;
  totalCount: number;
  averageScore: number | null;
  isRequired: boolean;
}

interface AssessmentSidebarProps {
  overallScore: number | null;
  overallProgress: number;
  dimensions: DimensionProgress[];
  currentDimensionId: OrbitDimensionId | 'review';
  currentSubDimensionId?: TechnologySubDimensionId;
  onDimensionSelect: (
    dimensionId: OrbitDimensionId,
    subDimensionId?: TechnologySubDimensionId
  ) => void;
  onReviewSelect: () => void;
  isReviewSelected?: boolean;
  showFinalize?: boolean;
}

/**
 * Format score for display
 */
function formatScore(score: number | null): string {
  if (score === null) return '—';
  return score.toFixed(1);
}

/**
 * Assessment sidebar with compact navigation
 */
export function AssessmentSidebar({
  overallScore,
  overallProgress,
  dimensions,
  currentDimensionId,
  currentSubDimensionId,
  onDimensionSelect,
  onReviewSelect,
  isReviewSelected = false,
  showFinalize = true,
}: AssessmentSidebarProps): JSX.Element {
  const theme = useTheme();

  const getProgressIcon = (assessed: number, total: number): JSX.Element => {
    const size = 16;
    if (assessed === 0) {
      return <RadioButtonUncheckedIcon sx={{ fontSize: size, color: 'grey.400' }} />;
    }
    if (assessed === total) {
      return <CheckCircleIcon sx={{ fontSize: size, color: 'success.main' }} />;
    }
    return <PendingIcon sx={{ fontSize: size, color: 'warning.main' }} />;
  };

  const isSelected = (dim: DimensionProgress): boolean => {
    if (isReviewSelected) return false;
    if (dim.subDimensionId) {
      return dim.dimensionId === currentDimensionId && dim.subDimensionId === currentSubDimensionId;
    }
    return dim.dimensionId === currentDimensionId && !currentSubDimensionId;
  };

  // Group dimensions for display
  const standardDimensions = dimensions.filter((d) => d.dimensionId !== 'technology');
  const techDimensions = dimensions.filter((d) => d.dimensionId === 'technology');

  return (
    <Paper
      elevation={0}
      sx={{
        width: 240,
        height: '100%',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
      component="aside"
      aria-label="Assessment navigation"
    >
      {/* Overall Progress - Compact */}
      <Box
        sx={{ px: 1.5, py: 1, bgcolor: alpha(theme.palette.primary.main, 0.03) }}
        role="region"
        aria-label="Overall assessment progress"
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}
        >
          <Typography variant="caption" color="text.secondary">
            Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {overallProgress}%
            </Typography>
            {overallScore !== null && (
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Avg: {formatScore(overallScore)}
              </Typography>
            )}
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={overallProgress}
          aria-label={`Overall progress: ${overallProgress}% complete`}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
              bgcolor: overallProgress === 100 ? 'success.main' : 'primary.main',
            },
          }}
        />
      </Box>

      <Divider />

      {/* Dimension Navigation - Compact single rows */}
      <Box sx={{ flex: 1, overflow: 'auto' }} component="nav" aria-label="ORBIT dimensions">
        <List disablePadding role="list">
          {/* Standard Dimensions */}
          {standardDimensions.map((dim) => {
            const selected = isSelected(dim);

            return (
              <ListItemButton
                key={dim.dimensionId}
                selected={selected}
                onClick={() => onDimensionSelect(dim.dimensionId)}
                aria-current={selected ? 'true' : undefined}
                aria-label={`${dim.name}${!dim.isRequired ? ' (optional)' : ''}, ${dim.assessedCount} of ${dim.totalCount} assessed${dim.averageScore !== null ? `, average score ${formatScore(dim.averageScore)}` : ''}`}
                sx={{
                  py: 0.75,
                  px: 1.5,
                  minHeight: 36,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderLeft: '3px solid',
                    borderColor: 'primary.main',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                  {getProgressIcon(dim.assessedCount, dim.totalCount)}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: selected ? 600 : 400,
                      flex: 1,
                      fontSize: '0.8125rem',
                    }}
                  >
                    {dim.name}
                  </Typography>
                  {!dim.isRequired && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.disabled', fontSize: '0.65rem' }}
                    >
                      opt
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', minWidth: 28, textAlign: 'right' }}
                  >
                    {dim.assessedCount}/{dim.totalCount}
                  </Typography>
                  {dim.averageScore !== null && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        minWidth: 24,
                        textAlign: 'right',
                        color: 'text.secondary',
                      }}
                    >
                      {formatScore(dim.averageScore)}
                    </Typography>
                  )}
                </Box>
              </ListItemButton>
            );
          })}

          {/* Technology Section Header */}
          {techDimensions.length > 0 && (
            <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'grey.100' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, fontSize: '0.65rem' }}
              >
                TECHNOLOGY
              </Typography>
            </Box>
          )}

          {/* Technology Sub-dimensions */}
          {techDimensions.map((dim) => {
            const selected = isSelected(dim);

            return (
              <ListItemButton
                key={`${dim.dimensionId}-${dim.subDimensionId}`}
                selected={selected}
                onClick={() => onDimensionSelect(dim.dimensionId, dim.subDimensionId)}
                aria-current={selected ? 'true' : undefined}
                aria-label={`${dim.name}, ${dim.assessedCount} of ${dim.totalCount} assessed${dim.averageScore !== null ? `, average score ${formatScore(dim.averageScore)}` : ''}`}
                sx={{
                  py: 0.75,
                  px: 1.5,
                  pl: 2.5,
                  minHeight: 36,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderLeft: '3px solid',
                    borderColor: 'primary.main',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                  {getProgressIcon(dim.assessedCount, dim.totalCount)}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: selected ? 600 : 400,
                      flex: 1,
                      fontSize: '0.8125rem',
                    }}
                  >
                    {dim.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', minWidth: 28, textAlign: 'right' }}
                  >
                    {dim.assessedCount}/{dim.totalCount}
                  </Typography>
                  {dim.averageScore !== null && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        minWidth: 24,
                        textAlign: 'right',
                        color: 'text.secondary',
                      }}
                    >
                      {formatScore(dim.averageScore)}
                    </Typography>
                  )}
                </Box>
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* Review & Finalize - Compact */}
      {showFinalize && (
        <Box sx={{ p: 0.75 }}>
          <ListItemButton
            selected={isReviewSelected}
            onClick={onReviewSelect}
            sx={{
              py: 0.75,
              px: 1,
              minHeight: 36,
              borderRadius: 1,
              bgcolor: isReviewSelected ? alpha(theme.palette.success.main, 0.1) : 'transparent',
              border: '1px solid',
              borderColor: isReviewSelected ? 'success.main' : 'divider',
              '&:hover': {
                bgcolor: alpha(theme.palette.success.main, 0.08),
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
              <FlagIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: 'success.dark', fontSize: '0.8125rem' }}
              >
                Review & Finalize
              </Typography>
            </Box>
          </ListItemButton>
        </Box>
      )}
    </Paper>
  );
}
