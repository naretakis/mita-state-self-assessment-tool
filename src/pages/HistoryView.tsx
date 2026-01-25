/**
 * History View Page
 *
 * Read-only view of a historical assessment snapshot.
 * Reuses assessment components but displays historical data.
 */

import { JSX, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Chip } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { getAreaWithDomain } from '../services/capabilities';
import {
  getOrbitModel,
  getTechnologySubDimensions,
  getAspectsForDimension,
  getAspectsForSubDimension,
} from '../services/orbit';
import { AssessmentSidebar, DimensionPage } from '../components/assessment';
import type {
  OrbitDimensionId,
  TechnologySubDimensionId,
  OrbitRating,
  HistoricalRating,
} from '../types';

/**
 * Navigation item for sidebar
 */
interface NavItem {
  dimensionId: OrbitDimensionId;
  subDimensionId?: TechnologySubDimensionId;
  name: string;
  description: string;
  isRequired: boolean;
  aspectCount: number;
}

/**
 * Build navigation items from ORBIT model
 */
function buildNavItems(): NavItem[] {
  const items: NavItem[] = [];
  const orbitModel = getOrbitModel();

  for (const dimId of ['outcomes', 'roles', 'businessArchitecture', 'informationData'] as const) {
    const dim = orbitModel.dimensions[dimId];
    items.push({
      dimensionId: dimId,
      name: dim.name,
      description: dim.description,
      isRequired: dim.required,
      aspectCount: dim.aspects.length,
    });
  }

  const techSubDims = getTechnologySubDimensions();
  for (const subDim of techSubDims) {
    items.push({
      dimensionId: 'technology',
      subDimensionId: subDim.id,
      name: subDim.name,
      description: subDim.description,
      isRequired: true,
      aspectCount: subDim.aspects.length,
    });
  }

  return items;
}

/**
 * Convert HistoricalRating to OrbitRating format for display
 */
function historicalToOrbitRating(
  historyId: string,
  historical: HistoricalRating,
  index: number
): OrbitRating {
  return {
    id: `${historyId}-${index}`,
    capabilityAssessmentId: historyId,
    dimensionId: historical.dimensionId,
    subDimensionId: historical.subDimensionId,
    aspectId: historical.aspectId,
    currentLevel: historical.currentLevel,
    targetLevel: historical.targetLevel,
    questionResponses: historical.questionResponses,
    evidenceResponses: historical.evidenceResponses,
    notes: historical.notes,
    barriers: historical.barriers,
    plans: historical.plans,
    carriedForward: false,
    attachmentIds: [],
    updatedAt: new Date(),
  };
}

/**
 * History view page component
 */
export default function HistoryView(): JSX.Element {
  const { historyId } = useParams<{ historyId: string }>();
  const navigate = useNavigate();

  // Load history entry from DB
  const historyEntry = useLiveQuery(
    () => (historyId ? db.assessmentHistory.get(historyId) : undefined),
    [historyId]
  );

  // Navigation state
  const navItems = useMemo(() => buildNavItems(), []);
  const [currentNavIndex, setCurrentNavIndex] = useState(0);
  const currentNav = navItems[currentNavIndex] ?? navItems[0];

  // Get capability info
  const capabilityInfo = useMemo(() => {
    if (!historyEntry) return null;
    return getAreaWithDomain(historyEntry.capabilityAreaId);
  }, [historyEntry]);

  // Convert historical ratings to OrbitRating format
  const ratings = useMemo(() => {
    if (!historyEntry || !historyId) return [];
    return historyEntry.ratings.map((r, i) => historicalToOrbitRating(historyId, r, i));
  }, [historyEntry, historyId]);

  // Build ratings map for current dimension
  const ratingsMap = useMemo(() => {
    const map = new Map<string, OrbitRating>();
    if (!currentNav) return map;
    for (const rating of ratings) {
      if (currentNav.subDimensionId) {
        if (
          rating.dimensionId === currentNav.dimensionId &&
          rating.subDimensionId === currentNav.subDimensionId
        ) {
          map.set(rating.aspectId, rating);
        }
      } else {
        if (rating.dimensionId === currentNav.dimensionId && !rating.subDimensionId) {
          map.set(rating.aspectId, rating);
        }
      }
    }
    return map;
  }, [ratings, currentNav]);

  // Get aspects for current dimension
  const currentAspects = useMemo(() => {
    if (!currentNav) return [];
    if (currentNav.subDimensionId) {
      return getAspectsForSubDimension(currentNav.subDimensionId);
    }
    return getAspectsForDimension(currentNav.dimensionId);
  }, [currentNav]);

  // Calculate sidebar progress data
  const sidebarDimensions = useMemo(() => {
    return navItems.map((nav) => {
      let assessedCount = 0;
      const totalCount = nav.aspectCount;
      let avgScore: number | null = null;

      const dimRatings = ratings.filter((r) => {
        if (nav.subDimensionId) {
          return r.dimensionId === nav.dimensionId && r.subDimensionId === nav.subDimensionId;
        }
        return r.dimensionId === nav.dimensionId && !r.subDimensionId;
      });

      assessedCount = dimRatings.filter((r) => r.currentLevel !== 0).length;
      const scored = dimRatings.filter((r) => r.currentLevel > 0);
      if (scored.length > 0) {
        avgScore = scored.reduce((sum, r) => sum + r.currentLevel, 0) / scored.length;
      }

      return {
        dimensionId: nav.dimensionId,
        subDimensionId: nav.subDimensionId,
        name: nav.name,
        assessedCount,
        totalCount,
        averageScore: avgScore,
        isRequired: nav.isRequired,
      };
    });
  }, [navItems, ratings]);

  // Calculate overall progress
  const totalAspects = navItems.reduce((sum, nav) => sum + nav.aspectCount, 0);
  const assessedCount = ratings.filter((r) => r.currentLevel !== 0).length;
  const overallProgress = totalAspects > 0 ? Math.round((assessedCount / totalAspects) * 100) : 0;

  // Navigation handler
  const handleDimensionSelect = useCallback(
    (dimensionId: OrbitDimensionId, subDimensionId?: TechnologySubDimensionId) => {
      const index = navItems.findIndex(
        (nav) => nav.dimensionId === dimensionId && nav.subDimensionId === subDimensionId
      );
      if (index >= 0) {
        setCurrentNavIndex(index);
      }
    },
    [navItems]
  );

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Loading state
  if (!historyEntry || !capabilityInfo || !currentNav) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading history...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </Typography>
        </Box>
        <Typography variant="h5" component="h1">
          {capabilityInfo.domain.name} → {capabilityInfo.area.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Chip label="Historical Snapshot" size="small" color="secondary" />
          <Typography variant="body2" color="text.secondary">
            {formatDate(historyEntry.snapshotDate)}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            Score: {historyEntry.overallScore.toFixed(1)}
          </Typography>
          {historyEntry.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      </Box>

      {/* View Mode Alert */}
      <Alert severity="info" sx={{ borderRadius: 0 }}>
        Historical View — This is a read-only snapshot from {formatDate(historyEntry.snapshotDate)}
      </Alert>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <AssessmentSidebar
          overallScore={historyEntry.overallScore}
          overallProgress={overallProgress}
          dimensions={sidebarDimensions}
          currentDimensionId={currentNav.dimensionId}
          currentSubDimensionId={currentNav.subDimensionId}
          onDimensionSelect={handleDimensionSelect}
          onReviewSelect={() => {}}
          isReviewSelected={false}
          showFinalize={false}
        />

        {/* Main Content Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DimensionPage
            dimensionId={currentNav.dimensionId}
            subDimensionId={currentNav.subDimensionId}
            dimensionName={currentNav.name}
            dimensionDescription={currentNav.description}
            isRequired={currentNav.isRequired}
            aspects={currentAspects}
            ratings={ratingsMap}
            attachments={new Map()}
            onLevelChange={() => Promise.resolve()}
            onTargetLevelChange={() => Promise.resolve()}
            onQuestionChange={() => Promise.resolve()}
            onEvidenceChange={() => Promise.resolve()}
            onNotesChange={() => Promise.resolve()}
            onBarriersChange={() => Promise.resolve()}
            onPlansChange={() => Promise.resolve()}
            onAttachmentUpload={() => Promise.resolve()}
            onAttachmentDelete={() => Promise.resolve()}
            onAttachmentDownload={() => Promise.resolve()}
            disabled={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
