/**
 * Tag filter component for dashboard filtering
 */

import { JSX } from 'react';
import { Autocomplete, Chip, TextField } from '@mui/material';

interface TagFilterProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  availableTags: string[];
}

/**
 * Tag filter for dashboard filtering
 */
export function TagFilter({ selectedTags, onChange, availableTags }: TagFilterProps): JSX.Element {
  return (
    <Autocomplete
      multiple
      size="small"
      options={availableTags}
      value={selectedTags}
      onChange={(_, newValue) => onChange(newValue)}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return <Chip key={key} label={option} size="small" color="primary" {...tagProps} />;
        })
      }
      renderInput={(params) => (
        <TextField {...params} placeholder={selectedTags.length === 0 ? 'Filter by tags...' : ''} />
      )}
      sx={{ minWidth: 200 }}
    />
  );
}
