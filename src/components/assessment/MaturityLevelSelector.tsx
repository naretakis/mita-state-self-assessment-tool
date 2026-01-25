/**
 * Maturity Level Selector Component
 *
 * Click-to-select interface for As-Is maturity level with optional
 * checkbox to mark a level as the To-Be target.
 */

import { JSX } from 'react';
import { Box, Typography, Paper, Checkbox, alpha, useTheme, Tooltip } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { MaturityLevelWithNA } from '../../types';

interface LevelDescription {
  level: MaturityLevelWithNA;
  name: string;
  description: string;
}

interface MaturityLevelSelectorProps {
  asIsValue: MaturityLevelWithNA;
  toBeValue: MaturityLevelWithNA | undefined;
  onAsIsChange: (level: MaturityLevelWithNA) => void;
  onToBeChange: (level: MaturityLevelWithNA | undefined) => void;
  levelDescriptions: LevelDescription[];
  previousAsIsValue?: MaturityLevelWithNA;
  disabled?: boolean;
}

/**
 * Maturity level selector with clickable rows for As-Is and checkboxes for To-Be
 */
export function MaturityLevelSelector({
  asIsValue,
  toBeValue,
  onAsIsChange,
  onToBeChange,
  levelDescriptions,
  previousAsIsValue,
  disabled = false,
}: MaturityLevelSelectorProps): JSX.Element {
  const theme = useTheme();

  const handleRowClick = (level: MaturityLevelWithNA): void => {
    if (!disabled) {
      onAsIsChange(level);
    }
  };

  const handleToBeToggle = (event: React.MouseEvent, level: MaturityLevelWithNA): void => {
    event.stopPropagation();
    if (disabled) return;

    if (toBeValue === level) {
      onToBeChange(undefined);
    } else {
      onToBeChange(level);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Select Maturity Level
        </Typography>
        {previousAsIsValue !== undefined && previousAsIsValue > 0 && (
          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.25,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: 'info.main',
              borderRadius: 1,
            }}
          >
            Previous: Level {previousAsIsValue}
          </Typography>
        )}
      </Box>

      {/* Level rows */}
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
        role="radiogroup"
        aria-label="Select maturity level"
      >
        {levelDescriptions.map((levelDesc) => {
          const isAsIsSelected = asIsValue === levelDesc.level;
          const isToBeSelected = toBeValue === levelDesc.level;
          const isPrevious = previousAsIsValue === levelDesc.level;

          return (
            <Paper
              key={levelDesc.level}
              variant="outlined"
              onClick={() => handleRowClick(levelDesc.level)}
              role="radio"
              aria-checked={isAsIsSelected}
              aria-label={`Level ${levelDesc.level}: ${levelDesc.name}. ${levelDesc.description}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRowClick(levelDesc.level);
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                p: 1.5,
                cursor: disabled ? 'default' : 'pointer',
                borderColor: isAsIsSelected
                  ? 'primary.main'
                  : isPrevious
                    ? 'info.light'
                    : 'divider',
                borderWidth: isAsIsSelected ? 2 : 1,
                borderStyle: isPrevious && !isAsIsSelected ? 'dashed' : 'solid',
                bgcolor: isAsIsSelected
                  ? alpha(theme.palette.primary.main, 0.05)
                  : 'background.paper',
                transition: 'all 0.15s ease',
                position: 'relative',
                '&:hover': {
                  bgcolor: isAsIsSelected
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha(theme.palette.action.hover, 0.04),
                  borderColor: isAsIsSelected ? 'primary.main' : 'primary.light',
                },
              }}
            >
              {/* As-Is indicator */}
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  mr: 1.5,
                  mt: 0.25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {isAsIsSelected ? (
                  <CheckCircleIcon
                    sx={{ color: 'primary.main', fontSize: 22 }}
                    aria-hidden="true"
                  />
                ) : (
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: 'grey.300',
                    }}
                  />
                )}
              </Box>

              {/* Level content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  L{levelDesc.level}: {levelDesc.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5, lineHeight: 1.5, fontSize: '0.85rem' }}
                >
                  {levelDesc.description}
                </Typography>
              </Box>

              {/* To-Be checkbox */}
              <Tooltip
                title={isToBeSelected ? 'Remove To-Be selection' : 'Set as To-Be maturity level'}
              >
                <Box
                  onClick={(e) => handleToBeToggle(e, levelDesc.level)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    ml: 1,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    cursor: disabled ? 'default' : 'pointer',
                    bgcolor: isToBeSelected
                      ? alpha(theme.palette.secondary.main, 0.1)
                      : 'transparent',
                    border: '1px solid',
                    borderColor: isToBeSelected ? 'secondary.main' : 'transparent',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: isToBeSelected
                        ? alpha(theme.palette.secondary.main, 0.15)
                        : alpha(theme.palette.grey[200], 0.5),
                    },
                  }}
                >
                  <Checkbox
                    checked={isToBeSelected}
                    disabled={disabled}
                    size="small"
                    icon={<FlagIcon sx={{ fontSize: 18, color: 'grey.400' }} aria-hidden="true" />}
                    checkedIcon={
                      <FlagIcon sx={{ fontSize: 18, color: 'secondary.main' }} aria-hidden="true" />
                    }
                    sx={{ p: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    inputProps={{
                      'aria-label': `Set Level ${levelDesc.level} as To-Be target`,
                    }}
                    onChange={() => {
                      if (toBeValue === levelDesc.level) {
                        onToBeChange(undefined);
                      } else {
                        onToBeChange(levelDesc.level);
                      }
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: isToBeSelected ? 'secondary.main' : 'text.secondary',
                      fontWeight: isToBeSelected ? 600 : 400,
                      userSelect: 'none',
                    }}
                  >
                    To-Be
                  </Typography>
                </Box>
              </Tooltip>
            </Paper>
          );
        })}

        {/* N/A Option */}
        <Paper
          variant="outlined"
          onClick={() => handleRowClick(-1)}
          role="radio"
          aria-checked={asIsValue === -1}
          aria-label="Not Applicable. This aspect does not apply to this capability"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRowClick(-1);
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            cursor: disabled ? 'default' : 'pointer',
            borderColor: asIsValue === -1 ? 'primary.main' : 'divider',
            borderWidth: asIsValue === -1 ? 2 : 1,
            bgcolor:
              asIsValue === -1 ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor:
                asIsValue === -1
                  ? alpha(theme.palette.primary.main, 0.08)
                  : alpha(theme.palette.action.hover, 0.04),
              borderColor: asIsValue === -1 ? 'primary.main' : 'primary.light',
            },
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              mr: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {asIsValue === -1 ? (
              <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 22 }} aria-hidden="true" />
            ) : (
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'grey.300',
                }}
              />
            )}
          </Box>
          <BlockIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} aria-hidden="true" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Not Applicable
            </Typography>
            <Typography variant="caption" color="text.secondary">
              This aspect does not apply to this capability
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 1.5, display: 'flex', gap: 3 }}>
        <Typography variant="caption" color="text.secondary">
          Click a level to set as current state
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <FlagIcon
            sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5, color: 'secondary.main' }}
          />
          Check to set To-Be maturity level
        </Typography>
      </Box>
    </Box>
  );
}
