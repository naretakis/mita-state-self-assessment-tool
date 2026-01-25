/**
 * Assessment Page
 *
 * Main page for conducting ORBIT maturity assessments.
 * Shows capability context, sidebar navigation, and dimension-based assessment flow.
 */

import { JSX, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { getAreaWithDomain } from '../services/capabilities';
import {
  getOrbitModel,
  getTechnologySubDimensions,
  getAspectsForDimension,
  getAspectsForSubDimension,
} from '../services/orbit';
import { useOrbitRatings, useAttachments, useCapabilityAssessments, useTags } from '../hooks';
import { AssessmentContextBar, AssessmentSidebar, DimensionPage } from '../components/assessment';
import type {
  OrbitDimensionId,
  TechnologySubDimensionId,
  MaturityLevelWithNA,
  OrbitRating,
  Attachment,
} from '../types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

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

  // Standard dimensions (non-Technology)
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

  // Technology sub-dimensions
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
 * Assessment page component
 */
export default function Assessment(): JSX.Element {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isViewMode = searchParams.get('view') === 'true';

  // Load assessment from DB
  const assessment = useLiveQuery(
    () => (assessmentId ? db.capabilityAssessments.get(assessmentId) : undefined),
    [assessmentId]
  );

  // Hooks for ratings, attachments, and tags
  const {
    ratings,
    saveRating,
    updateLevel,
    updateTargetLevel,
    updateNotes,
    updateBarriers,
    updatePlans,
    getAverageLevelForDimension,
    getAssessedCountForDimension,
    getOverallAverageLevel,
    getAssessedCount,
  } = useOrbitRatings(assessmentId);

  const { attachmentsByRating, uploadAttachment, deleteAttachment, downloadAttachment } =
    useAttachments(assessmentId);

  const { finalizeAssessment, updateTags } = useCapabilityAssessments();
  const { getAllTagNames } = useTags();

  // Navigation state
  const navItems = useMemo(() => buildNavItems(), []);
  const [currentNavIndex, setCurrentNavIndex] = useState(0);
  const [isReviewSelected, setIsReviewSelected] = useState(false);

  // Save status
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | undefined>();

  // Finalize dialog
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Ensure currentNav is always defined
  const currentNav = navItems[currentNavIndex] ?? navItems[0];

  // Get capability info
  const capabilityInfo = useMemo(() => {
    if (!assessment) return null;
    return getAreaWithDomain(assessment.capabilityAreaId);
  }, [assessment]);

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

  // Build attachments map for current dimension
  const attachmentsMap = useMemo(() => {
    const map = new Map<string, Attachment[]>();
    for (const rating of ratingsMap.values()) {
      const ratingAttachments = attachmentsByRating.get(rating.id) ?? [];
      map.set(rating.aspectId, ratingAttachments);
    }
    return map;
  }, [ratingsMap, attachmentsByRating]);

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

      if (nav.subDimensionId) {
        // Technology sub-dimension
        const subDimRatings = ratings.filter(
          (r) => r.dimensionId === 'technology' && r.subDimensionId === nav.subDimensionId
        );
        assessedCount = subDimRatings.filter((r) => r.currentLevel !== 0).length;
        const scored = subDimRatings.filter((r) => r.currentLevel > 0);
        if (scored.length > 0) {
          avgScore = scored.reduce((sum, r) => sum + r.currentLevel, 0) / scored.length;
        }
      } else {
        assessedCount = getAssessedCountForDimension(nav.dimensionId);
        avgScore = getAverageLevelForDimension(nav.dimensionId);
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
  }, [navItems, ratings, getAssessedCountForDimension, getAverageLevelForDimension]);

  // Calculate overall progress
  const totalAspects = navItems.reduce((sum, nav) => sum + nav.aspectCount, 0);
  const overallProgress =
    totalAspects > 0 ? Math.round((getAssessedCount() / totalAspects) * 100) : 0;

  // Auto-save indicator
  const triggerSave = useCallback(() => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setLastSaved(new Date());
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 300);
  }, []);

  // Tag handlers
  const handleTagAdd = useCallback(
    async (tag: string) => {
      if (!assessmentId || !assessment) return;
      const newTags = [...assessment.tags, tag];
      await updateTags(assessmentId, newTags);
      triggerSave();
    },
    [assessmentId, assessment, updateTags, triggerSave]
  );

  const handleTagRemove = useCallback(
    async (tag: string) => {
      if (!assessmentId || !assessment) return;
      const newTags = assessment.tags.filter((t) => t !== tag);
      await updateTags(assessmentId, newTags);
      triggerSave();
    },
    [assessmentId, assessment, updateTags, triggerSave]
  );

  // Rating handlers
  const handleLevelChange = useCallback(
    async (aspectId: string, level: MaturityLevelWithNA) => {
      if (!currentNav) return;
      await updateLevel(currentNav.dimensionId, aspectId, level, currentNav.subDimensionId);
      triggerSave();
    },
    [updateLevel, currentNav, triggerSave]
  );

  const handleTargetLevelChange = useCallback(
    async (aspectId: string, level: MaturityLevelWithNA | undefined) => {
      if (!currentNav) return;
      await updateTargetLevel(currentNav.dimensionId, aspectId, level, currentNav.subDimensionId);
      triggerSave();
    },
    [updateTargetLevel, currentNav, triggerSave]
  );

  const handleQuestionChange = useCallback(
    async (aspectId: string, index: number, checked: boolean) => {
      if (!currentNav) return;
      const rating = ratingsMap.get(aspectId);
      const responses = [...(rating?.questionResponses ?? [])];
      const existingIndex = responses.findIndex((r) => r.questionIndex === index);

      if (existingIndex >= 0) {
        responses[existingIndex] = { questionIndex: index, answer: checked };
      } else {
        responses.push({ questionIndex: index, answer: checked });
      }

      await saveRating({
        dimensionId: currentNav.dimensionId,
        subDimensionId: currentNav.subDimensionId,
        aspectId,
        currentLevel: rating?.currentLevel ?? 0,
        targetLevel: rating?.targetLevel,
        questionResponses: responses,
        evidenceResponses: rating?.evidenceResponses ?? [],
        notes: rating?.notes ?? '',
        barriers: rating?.barriers ?? '',
        plans: rating?.plans ?? '',
      });
      triggerSave();
    },
    [ratingsMap, saveRating, currentNav, triggerSave]
  );

  const handleEvidenceChange = useCallback(
    async (aspectId: string, index: number, checked: boolean) => {
      if (!currentNav) return;
      const rating = ratingsMap.get(aspectId);
      const responses = [...(rating?.evidenceResponses ?? [])];
      const existingIndex = responses.findIndex((r) => r.evidenceIndex === index);

      if (existingIndex >= 0) {
        responses[existingIndex] = { evidenceIndex: index, provided: checked };
      } else {
        responses.push({ evidenceIndex: index, provided: checked });
      }

      await saveRating({
        dimensionId: currentNav.dimensionId,
        subDimensionId: currentNav.subDimensionId,
        aspectId,
        currentLevel: rating?.currentLevel ?? 0,
        targetLevel: rating?.targetLevel,
        questionResponses: rating?.questionResponses ?? [],
        evidenceResponses: responses,
        notes: rating?.notes ?? '',
        barriers: rating?.barriers ?? '',
        plans: rating?.plans ?? '',
      });
      triggerSave();
    },
    [ratingsMap, saveRating, currentNav, triggerSave]
  );

  const handleNotesChange = useCallback(
    async (aspectId: string, notes: string) => {
      if (!currentNav) return;
      await updateNotes(currentNav.dimensionId, aspectId, notes, currentNav.subDimensionId);
      triggerSave();
    },
    [updateNotes, currentNav, triggerSave]
  );

  const handleBarriersChange = useCallback(
    async (aspectId: string, barriers: string) => {
      if (!currentNav) return;
      await updateBarriers(currentNav.dimensionId, aspectId, barriers, currentNav.subDimensionId);
      triggerSave();
    },
    [updateBarriers, currentNav, triggerSave]
  );

  const handlePlansChange = useCallback(
    async (aspectId: string, plans: string) => {
      if (!currentNav) return;
      await updatePlans(currentNav.dimensionId, aspectId, plans, currentNav.subDimensionId);
      triggerSave();
    },
    [updatePlans, currentNav, triggerSave]
  );

  const handleAttachmentUpload = useCallback(
    async (aspectId: string, file: File, description?: string) => {
      if (!currentNav || !assessmentId) return;
      const rating = ratingsMap.get(aspectId);
      if (!rating) {
        // Create a rating first if it doesn't exist
        await saveRating({
          dimensionId: currentNav.dimensionId,
          subDimensionId: currentNav.subDimensionId,
          aspectId,
          currentLevel: 0,
        });
      }
      // Get the rating ID (may have just been created)
      const updatedRating = await db.orbitRatings
        .where('[capabilityAssessmentId+dimensionId+aspectId]')
        .equals([assessmentId, currentNav.dimensionId, aspectId])
        .first();

      if (updatedRating) {
        await uploadAttachment(updatedRating.id, file, description);
        triggerSave();
      }
    },
    [ratingsMap, saveRating, currentNav, assessmentId, uploadAttachment, triggerSave]
  );

  const handleAttachmentDelete = useCallback(
    async (_aspectId: string, attachmentId: string) => {
      await deleteAttachment(attachmentId);
      triggerSave();
    },
    [deleteAttachment, triggerSave]
  );

  // Navigation handlers
  const handleDimensionSelect = useCallback(
    (dimensionId: OrbitDimensionId, subDimensionId?: TechnologySubDimensionId) => {
      const index = navItems.findIndex(
        (nav) => nav.dimensionId === dimensionId && nav.subDimensionId === subDimensionId
      );
      if (index >= 0) {
        setCurrentNavIndex(index);
        setIsReviewSelected(false);
      }
    },
    [navItems]
  );

  const handleReviewSelect = useCallback(() => {
    setIsReviewSelected(true);
    setFinalizeDialogOpen(true);
  }, []);

  const handleFinalize = useCallback(async () => {
    if (!assessmentId) return;
    try {
      await finalizeAssessment(assessmentId);
      setFinalizeDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Assessment finalized successfully!',
        severity: 'success',
      });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch {
      setSnackbar({ open: true, message: 'Failed to finalize assessment', severity: 'error' });
    }
  }, [assessmentId, finalizeAssessment, navigate]);

  // Loading state
  if (!assessment || !capabilityInfo || !currentNav) {
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
        <Typography sx={{ mt: 2 }}>Loading assessment...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Context Bar */}
      <AssessmentContextBar
        domainName={capabilityInfo.domain.name}
        areaName={capabilityInfo.area.name}
        areaDescription={capabilityInfo.area.description}
        areaTopics={capabilityInfo.area.topics}
        categoryName={capabilityInfo.category?.name}
        tags={assessment.tags}
        tagSuggestions={getAllTagNames()}
        onTagAdd={handleTagAdd}
        onTagRemove={handleTagRemove}
        onBack={() => navigate('/dashboard')}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        disabled={isViewMode}
      />

      {/* View Mode Alert */}
      {isViewMode && (
        <Alert
          severity="info"
          sx={{ borderRadius: 0 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate(`/assessment/${assessmentId}`)}
            >
              Switch to Edit
            </Button>
          }
        >
          View Mode — Changes are disabled
        </Alert>
      )}

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <AssessmentSidebar
          overallScore={getOverallAverageLevel()}
          overallProgress={overallProgress}
          dimensions={sidebarDimensions}
          currentDimensionId={currentNav.dimensionId}
          currentSubDimensionId={currentNav.subDimensionId}
          onDimensionSelect={handleDimensionSelect}
          onReviewSelect={handleReviewSelect}
          isReviewSelected={isReviewSelected}
          showFinalize={!isViewMode}
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
            attachments={attachmentsMap}
            onLevelChange={handleLevelChange}
            onTargetLevelChange={handleTargetLevelChange}
            onQuestionChange={handleQuestionChange}
            onEvidenceChange={handleEvidenceChange}
            onNotesChange={handleNotesChange}
            onBarriersChange={handleBarriersChange}
            onPlansChange={handlePlansChange}
            onAttachmentUpload={handleAttachmentUpload}
            onAttachmentDelete={handleAttachmentDelete}
            onAttachmentDownload={downloadAttachment}
            disabled={isViewMode}
          />
        </Box>
      </Box>

      {/* Finalize Dialog */}
      <Dialog
        open={finalizeDialogOpen}
        onClose={() => setFinalizeDialogOpen(false)}
        aria-labelledby="finalize-dialog-title"
        aria-describedby="finalize-dialog-description"
      >
        <DialogTitle id="finalize-dialog-title">Finalize Assessment?</DialogTitle>
        <DialogContent>
          <DialogContentText id="finalize-dialog-description">
            You have completed {overallProgress}% of the assessment. Finalizing will calculate your
            overall maturity score and save a snapshot for history tracking.
            {overallProgress < 100 && (
              <>
                <br />
                <br />
                <strong>Note:</strong> Some aspects are not yet assessed. You can still finalize now
                and edit later if needed.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFinalizeDialogOpen(false)}>Continue Editing</Button>
          <Button onClick={handleFinalize} variant="contained" color="primary">
            Finalize Assessment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" role="status" aria-live="polite">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
