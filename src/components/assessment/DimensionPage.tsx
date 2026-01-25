/**
 * Dimension Page Component
 *
 * Shows all aspects for a dimension/sub-dimension on a single page.
 * Aspects are displayed as collapsible cards.
 */

import { JSX, useState, useCallback, useMemo } from 'react';
import { Box, Typography, Chip, Paper, alpha, useTheme } from '@mui/material';
import { AspectCard } from './AspectCard';
import type {
  OrbitAspect,
  OrbitRating,
  Attachment,
  OrbitDimensionId,
  TechnologySubDimensionId,
  MaturityLevelWithNA,
} from '../../types';

interface DimensionPageProps {
  dimensionId: OrbitDimensionId;
  subDimensionId?: TechnologySubDimensionId;
  dimensionName: string;
  dimensionDescription: string;
  isRequired: boolean;
  aspects: OrbitAspect[];
  ratings: Map<string, OrbitRating>;
  attachments: Map<string, Attachment[]>;
  onLevelChange: (aspectId: string, level: MaturityLevelWithNA) => void;
  onTargetLevelChange: (aspectId: string, level: MaturityLevelWithNA | undefined) => void;
  onQuestionChange: (aspectId: string, index: number, checked: boolean) => void;
  onEvidenceChange: (aspectId: string, index: number, checked: boolean) => void;
  onNotesChange: (aspectId: string, notes: string) => void;
  onBarriersChange: (aspectId: string, barriers: string) => void;
  onPlansChange: (aspectId: string, plans: string) => void;
  onAttachmentUpload: (aspectId: string, file: File, description?: string) => Promise<void>;
  onAttachmentDelete: (aspectId: string, attachmentId: string) => Promise<void>;
  onAttachmentDownload: (attachment: Attachment) => void;
  disabled?: boolean;
}

/**
 * Page showing all aspects for a dimension
 */
export function DimensionPage({
  dimensionId: _dimensionId,
  subDimensionId: _subDimensionId,
  dimensionName,
  dimensionDescription,
  isRequired,
  aspects,
  ratings,
  attachments,
  onLevelChange,
  onTargetLevelChange,
  onQuestionChange,
  onEvidenceChange,
  onNotesChange,
  onBarriersChange,
  onPlansChange,
  onAttachmentUpload,
  onAttachmentDelete,
  onAttachmentDownload,
  disabled = false,
}: DimensionPageProps): JSX.Element {
  const theme = useTheme();

  // Track which aspects are expanded - default to all collapsed
  const [expandedAspects, setExpandedAspects] = useState<Set<string>>(new Set());

  const handleExpandChange = useCallback((aspectId: string, expanded: boolean) => {
    setExpandedAspects((prev) => {
      const next = new Set(prev);
      if (expanded) {
        next.add(aspectId);
      } else {
        next.delete(aspectId);
      }
      return next;
    });
  }, []);

  // Calculate progress
  const progress = useMemo(() => {
    const assessed = aspects.filter((a) => {
      const rating = ratings.get(a.id);
      return rating && (rating.currentLevel > 0 || rating.currentLevel === -1);
    }).length;
    return {
      assessed,
      total: aspects.length,
      percentage: aspects.length > 0 ? Math.round((assessed / aspects.length) * 100) : 0,
    };
  }, [aspects, ratings]);

  // Calculate average score
  const averageScore = useMemo(() => {
    const scoredRatings = aspects
      .map((a) => ratings.get(a.id))
      .filter((r): r is OrbitRating => r !== undefined && r.currentLevel > 0);

    if (scoredRatings.length === 0) return null;
    const sum = scoredRatings.reduce((acc, r) => acc + r.currentLevel, 0);
    return Math.round((sum / scoredRatings.length) * 10) / 10;
  }, [aspects, ratings]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          px: 3,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, flexShrink: 0 }}>
              {dimensionName}
            </Typography>
            {!isRequired && (
              <Chip
                label="Optional"
                size="small"
                variant="outlined"
                color="info"
                sx={{ flexShrink: 0 }}
              />
            )}
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0 }}>
              {dimensionDescription}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {progress.assessed}/{progress.total}
              </Typography>
            </Box>
            {averageScore !== null && (
              <Box
                sx={{
                  textAlign: 'center',
                  px: 2,
                  py: 0.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Avg Score
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {averageScore}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Aspect Cards */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {aspects.map((aspect) => {
          const rating = ratings.get(aspect.id);
          const aspectAttachments = attachments.get(aspect.id) ?? [];

          return (
            <AspectCard
              key={aspect.id}
              aspect={aspect}
              rating={rating}
              attachments={aspectAttachments}
              expanded={expandedAspects.has(aspect.id)}
              onExpandChange={(expanded) => handleExpandChange(aspect.id, expanded)}
              onLevelChange={(level) => onLevelChange(aspect.id, level)}
              onTargetLevelChange={(level) => onTargetLevelChange(aspect.id, level)}
              onQuestionChange={(index, checked) => onQuestionChange(aspect.id, index, checked)}
              onEvidenceChange={(index, checked) => onEvidenceChange(aspect.id, index, checked)}
              onNotesChange={(notes) => onNotesChange(aspect.id, notes)}
              onBarriersChange={(barriers) => onBarriersChange(aspect.id, barriers)}
              onPlansChange={(plans) => onPlansChange(aspect.id, plans)}
              onAttachmentUpload={(file, desc) => onAttachmentUpload(aspect.id, file, desc)}
              onAttachmentDelete={(attachmentId) => onAttachmentDelete(aspect.id, attachmentId)}
              onAttachmentDownload={onAttachmentDownload}
              disabled={disabled}
            />
          );
        })}
      </Box>
    </Box>
  );
}
