/**
 * Dashboard statistics summary cards
 */

import { JSX } from 'react';
import { Grid, Paper, Typography } from '@mui/material';

interface DashboardStatsProps {
  total: number;
  finalized: number;
  inProgress: number;
  notStarted: number;
  overallScore: number | null;
}

/**
 * Summary statistics cards for the dashboard header
 * Matches the layout of the Results page stats
 */
export function DashboardStats({
  total,
  finalized,
  inProgress,
  notStarted,
  overallScore,
}: DashboardStatsProps): JSX.Element {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h3" component="p" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {overallScore !== null ? overallScore.toFixed(1) : '—'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overall Score
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h3" component="p" sx={{ fontWeight: 700 }}>
            {finalized}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Finalized Assessments
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h3" component="p" sx={{ fontWeight: 700 }}>
            {inProgress}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In Progress
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h3" component="p" sx={{ fontWeight: 700 }}>
            {notStarted}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Not Started ({Math.round((notStarted / total) * 100)}% remaining)
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
