/**
 * Domain Scores List Component
 *
 * Simple list of domains with scores for navigation to domain details.
 * Minimal design - just name, score, and arrow indicator.
 */

import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getScoreColor } from '../../utils';

interface DomainScore {
  id: string;
  name: string;
  score: number | null;
}

interface DomainScoresListProps {
  domains: DomainScore[];
}

/**
 * Simple domain list with scores for navigation
 */
export function DomainScoresList({ domains }: DomainScoresListProps): JSX.Element {
  const navigate = useNavigate();

  const handleClick = (domainId: string): void => {
    navigate(`/results/${domainId}`);
  };

  return (
    <Paper variant="outlined">
      <List disablePadding>
        {domains.map((domain, index) => (
          <ListItemButton
            key={domain.id}
            onClick={() => handleClick(domain.id)}
            divider={index < domains.length - 1}
            sx={{ py: 1.5 }}
          >
            <ListItemText
              primary={domain.name}
              primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {domain.score !== null ? (
                <Chip
                  label={domain.score.toFixed(1)}
                  size="small"
                  sx={{
                    bgcolor: getScoreColor(domain.score),
                    color: 'white',
                    fontWeight: 600,
                    minWidth: 50,
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.disabled">
                  —
                </Typography>
              )}
              <ChevronRightIcon sx={{ fontSize: 20, color: 'grey.500' }} />
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
