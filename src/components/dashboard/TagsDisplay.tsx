/**
 * Compact tag display with overflow handling
 * Shows first N tags with "+X more" badge and tooltip for full list
 */

import { JSX } from 'react';
import { Box, Chip, Tooltip, Typography } from '@mui/material';

interface TagsDisplayProps {
  tags: string[];
  maxVisible?: number;
}

/**
 * Displays tags with overflow handling - shows first N tags plus "+X more" with tooltip
 */
export function TagsDisplay({ tags, maxVisible = 3 }: TagsDisplayProps): JSX.Element {
  if (tags.length === 0) {
    return <Box />;
  }

  const visibleTags = tags.slice(0, maxVisible);
  const hiddenTags = tags.slice(maxVisible);
  const hasOverflow = hiddenTags.length > 0;

  const tooltipContent = (
    <Box>
      <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
        All tags:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'grey.200' }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'nowrap', justifyContent: 'center' }}>
      {visibleTags.map((tag) => (
        <Chip key={tag} label={tag} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
      ))}
      {hasOverflow && (
        <Tooltip title={tooltipContent} placement="top" arrow>
          <Chip
            label={`+${hiddenTags.length}`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              bgcolor: 'grey.300',
              cursor: 'help',
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
}
