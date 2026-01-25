/**
 * Assessment Context Bar Component
 *
 * Top bar showing capability area name, collapsible description
 * and topic chips, tags, and save status.
 */

import { JSX, useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  Paper,
  Popper,
  List,
  ListItemButton,
  ListItemText,
  ClickAwayListener,
  IconButton,
  Tooltip,
  Collapse,
  alpha,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import SyncIcon from '@mui/icons-material/Sync';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AssessmentContextBarProps {
  domainName: string;
  areaName: string;
  areaDescription: string;
  areaTopics: string[];
  categoryName?: string;
  tags: string[];
  tagSuggestions: string[];
  onTagAdd: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  onBack: () => void;
  saveStatus: SaveStatus;
  lastSaved?: Date;
  disabled?: boolean;
}

/**
 * Assessment context bar with capability name and collapsible details
 */
export function AssessmentContextBar({
  areaName,
  areaDescription,
  areaTopics,
  categoryName,
  tags,
  tagSuggestions,
  onTagAdd,
  onTagRemove,
  onBack,
  saveStatus,
  lastSaved,
  disabled = false,
}: AssessmentContextBarProps): JSX.Element {
  const theme = useTheme();
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input
  const filteredSuggestions = tagSuggestions
    .filter((s) => s.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(s))
    .slice(0, 5);

  // Focus input when shown
  useEffect(() => {
    if (showTagInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showTagInput]);

  const handleTagInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.trim()) {
        e.preventDefault();
        const newTag = tagInput.trim();
        if (!tags.includes(newTag)) {
          onTagAdd(newTag);
        }
        setTagInput('');
        setShowSuggestions(false);
      } else if (e.key === 'Escape') {
        setShowTagInput(false);
        setTagInput('');
        setShowSuggestions(false);
      }
    },
    [tagInput, tags, onTagAdd]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      onTagAdd(suggestion);
      setTagInput('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    },
    [onTagAdd]
  );

  const handleClickAway = useCallback(() => {
    if (!tagInput.trim()) {
      setShowTagInput(false);
    }
    setShowSuggestions(false);
  }, [tagInput]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Header Row: Back, Capability Name, Expand Toggle, Tags, Save Status */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.5,
        }}
      >
        {/* Back button */}
        <Tooltip title="Back to Dashboard">
          <IconButton
            onClick={onBack}
            size="small"
            aria-label="Back to Dashboard"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <ArrowBackIcon aria-hidden="true" />
          </IconButton>
        </Tooltip>

        {/* Capability Area Name + Expand Toggle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
          }}
          onClick={() => setExpanded(!expanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setExpanded(!expanded);
            }
          }}
          aria-expanded={expanded}
          aria-controls="capability-details"
        >
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
            {areaName}
          </Typography>
          <IconButton
            size="small"
            sx={{ ml: 0.5, color: 'text.secondary' }}
            aria-label={expanded ? 'Collapse capability details' : 'Expand capability details'}
            tabIndex={-1}
          >
            {expanded ? (
              <ExpandLessIcon aria-hidden="true" />
            ) : (
              <ExpandMoreIcon aria-hidden="true" />
            )}
          </IconButton>
        </Box>

        {/* Tags - right after capability name */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexWrap: 'wrap',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {showTagInput ? (
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  inputRef={inputRef}
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onKeyDown={handleTagInputKeyDown}
                  onFocus={() => tagInput && setShowSuggestions(true)}
                  placeholder="Add tag..."
                  size="small"
                  disabled={disabled}
                  inputProps={{
                    'aria-label': 'Add a tag to this assessment',
                    'aria-describedby': 'tag-input-hint',
                  }}
                  sx={{
                    width: 120,
                    '& .MuiOutlinedInput-root': {
                      height: 28,
                      fontSize: '0.875rem',
                    },
                  }}
                />
                <span id="tag-input-hint" style={{ position: 'absolute', left: '-9999px' }}>
                  Press Enter to add the tag, Escape to cancel
                </span>
                <Popper
                  open={showSuggestions && filteredSuggestions.length > 0}
                  anchorEl={inputRef.current}
                  placement="bottom-start"
                  sx={{ zIndex: 1300 }}
                >
                  <Paper elevation={3} sx={{ mt: 0.5, minWidth: 150 }}>
                    <List dense disablePadding>
                      {filteredSuggestions.map((suggestion) => (
                        <ListItemButton
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{ py: 0.5 }}
                        >
                          <ListItemText
                            primary={suggestion}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                </Popper>
              </Box>
            </ClickAwayListener>
          ) : (
            <Tooltip title="Add custom tags to group and filter assessments">
              <IconButton
                size="small"
                onClick={() => setShowTagInput(true)}
                disabled={disabled}
                sx={{
                  width: 24,
                  height: 24,
                  border: '1px dashed',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}

          {tags.length === 0 && !showTagInput && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.disabled',
                fontStyle: 'italic',
              }}
            >
              Add tags to organize (e.g., vendor, module)
            </Typography>
          )}

          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onDelete={disabled ? undefined : () => onTagRemove(tag)}
              sx={{
                height: 24,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: 'primary.main',
                  '&:hover': { color: 'primary.dark' },
                },
              }}
            />
          ))}
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Save status */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            minWidth: 70,
            justifyContent: 'flex-end',
          }}
        >
          {saveStatus === 'saving' && (
            <>
              <SyncIcon
                sx={{
                  fontSize: 16,
                  color: 'text.secondary',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Saving...
              </Typography>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="success.main">
                Saved
              </Typography>
            </>
          )}
          {saveStatus === 'idle' && lastSaved && (
            <>
              <CloudDoneIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary">
                {formatTime(lastSaved)}
              </Typography>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
              <Typography variant="caption" color="error.main">
                Error
              </Typography>
            </>
          )}
        </Box>
      </Box>

      {/* Collapsible: Description + Topic Chips */}
      <Collapse in={expanded}>
        <Box
          id="capability-details"
          sx={{
            px: 2,
            pb: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.grey[100], 0.5),
          }}
        >
          {/* Indent to align with capability name */}
          <Box sx={{ pl: 5 }}>
            {/* Category badge if present */}
            {categoryName && (
              <Chip
                label={categoryName}
                size="small"
                sx={{
                  mt: 1.5,
                  mb: 1,
                  height: 22,
                  fontSize: '0.75rem',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.dark',
                  fontWeight: 500,
                }}
              />
            )}

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: categoryName ? 0 : 1.5,
                mb: 1.5,
                lineHeight: 1.6,
              }}
            >
              {areaDescription}
            </Typography>

            {/* Topic Chips */}
            {areaTopics.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center' }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: 'text.secondary', mr: 0.5 }}
                >
                  Topics:
                </Typography>
                {areaTopics.map((topic, index) => (
                  <Chip
                    key={index}
                    label={topic}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 26,
                      fontSize: '0.8rem',
                      borderColor: alpha(theme.palette.text.secondary, 0.3),
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderColor: 'primary.main',
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}
