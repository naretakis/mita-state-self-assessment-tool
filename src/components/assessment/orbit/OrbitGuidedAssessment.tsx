/**
 * OrbitGuidedAssessment Component
 *
 * Main assessment workflow component using the ORBIT maturity model.
 * Guides users through capability selection and ORBIT dimension assessments.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useAnnouncements } from '../../../hooks/useAnnouncements';
import { useCapabilities } from '../../../hooks/useCapabilities';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { useOrbitModel } from '../../../hooks/useOrbitModel';
import enhancedStorageService from '../../../services/EnhancedStorageService';
import AppHeader from '../../layout/AppHeader';
import AssessmentErrorBoundary from '../AssessmentErrorBoundary';
import AssessmentHeader from '../AssessmentHeader';
import StorageErrorHandler from '../StorageErrorHandler';

import OrbitAssessmentSidebar from './OrbitAssessmentSidebar';
import OrbitCapabilityOverview from './OrbitCapabilityOverview';
import OrbitDimensionAssessment from './OrbitDimensionAssessment';
import OrbitTechnologyAssessment from './OrbitTechnologyAssessment';

import type {
  OrbitAssessment,
  OrbitAssessmentResponse,
  OrbitDimensionId,
  StandardDimensionResponse,
  TechnologyDimensionResponse,
} from '../../../types/orbit';

interface OrbitGuidedAssessmentProps {
  assessmentId: string;
}

type AssessmentStepType = 'overview' | 'dimension';

interface AssessmentStep {
  type: AssessmentStepType;
  capabilityId: string;
  dimensionId?: OrbitDimensionId;
}

const ORBIT_DIMENSION_ORDER: OrbitDimensionId[] = [
  'outcomes',
  'roles',
  'business',
  'information',
  'technology',
];

const DIMENSION_LABELS: Record<OrbitDimensionId, string> = {
  outcomes: 'Outcomes',
  roles: 'Roles',
  business: 'Business Architecture',
  information: 'Information & Data',
  technology: 'Technology',
};

const OrbitGuidedAssessment: React.FC<OrbitGuidedAssessmentProps> = ({ assessmentId }) => {
  const router = useRouter();
  const [assessment, setAssessment] = useState<OrbitAssessment | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { capabilities: _capabilities, loading: capabilitiesLoading } = useCapabilities();
  const { model: orbitModel, loading: orbitLoading } = useOrbitModel();
  const errorHandler = useErrorHandler();
  const { announceStepChange, announceError, announceSuccess, LiveRegions } = useAnnouncements();

  // Generate steps based on assessment capabilities
  const steps = useMemo((): AssessmentStep[] => {
    if (!assessment) {
      return [];
    }

    const generatedSteps: AssessmentStep[] = [];

    for (const capability of assessment.capabilities) {
      // Overview step
      generatedSteps.push({
        type: 'overview',
        capabilityId: capability.capabilityId,
      });

      // Dimension steps
      for (const dimensionId of ORBIT_DIMENSION_ORDER) {
        generatedSteps.push({
          type: 'dimension',
          capabilityId: capability.capabilityId,
          dimensionId,
        });
      }
    }

    return generatedSteps;
  }, [assessment]);

  // Load assessment data
  useEffect(() => {
    loadAssessment();
  }, [assessmentId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!assessment) {
      return;
    }

    const interval = setInterval(() => {
      saveAssessment();
    }, 30000);

    return () => clearInterval(interval);
  }, [assessment]);

  const loadAssessment = async () => {
    try {
      setLoading(true);

      // Try to load as OrbitAssessment first
      const loaded = await enhancedStorageService.loadAssessment(assessmentId);

      if (!loaded) {
        throw new Error('Assessment not found');
      }

      // Check if it's already an ORBIT assessment or needs conversion
      if ('capabilities' in loaded && Array.isArray(loaded.capabilities)) {
        // Check if first capability has 'orbit' property (new format)
        const firstCap = loaded.capabilities[0];
        if (firstCap && 'orbit' in firstCap) {
          setAssessment(loaded as unknown as OrbitAssessment);
        } else {
          // Legacy format - create new ORBIT assessment structure
          const orbitAssessment = convertToOrbitAssessment(loaded);
          setAssessment(orbitAssessment);
        }
      }
    } catch (err) {
      console.error('Failed to load assessment:', err);
      errorHandler.setError(err as Error, { operation: 'load', assessmentId });
    } finally {
      setLoading(false);
    }
  };

  // Convert legacy assessment to ORBIT format
  const convertToOrbitAssessment = (legacy: unknown): OrbitAssessment => {
    const legacyAssessment = legacy as {
      id: string;
      stateName: string;
      createdAt: string;
      updatedAt: string;
      status: string;
      capabilities: Array<{
        id: string;
        capabilityDomainName: string;
        capabilityAreaName: string;
      }>;
      metadata?: {
        systemName?: string;
      };
    };

    return {
      id: legacyAssessment.id,
      stateName: legacyAssessment.stateName,
      createdAt: legacyAssessment.createdAt,
      updatedAt: legacyAssessment.updatedAt,
      status: 'in-progress',
      capabilities: legacyAssessment.capabilities.map(cap => ({
        id: `${cap.id}-orbit`,
        capabilityId: cap.id,
        capabilityDomainName: cap.capabilityDomainName,
        capabilityAreaName: cap.capabilityAreaName,
        status: 'not-started',
        orbit: createEmptyOrbitResponse(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      metadata: {
        assessmentVersion: '4.0',
        orbitModelVersion: '4.0',
        systemName: legacyAssessment.metadata?.systemName,
      },
    };
  };

  const createEmptyOrbitResponse = (): OrbitAssessmentResponse => ({
    business: {
      dimensionId: 'business',
      aspects: {},
      overallLevel: 0,
      notes: '',
      lastUpdated: new Date().toISOString(),
    },
    information: {
      dimensionId: 'information',
      aspects: {},
      overallLevel: 0,
      notes: '',
      lastUpdated: new Date().toISOString(),
    },
    technology: {
      subDomains: {} as TechnologyDimensionResponse['subDomains'],
      overallLevel: 0,
      notes: '',
      lastUpdated: new Date().toISOString(),
    },
  });

  const saveAssessment = useCallback(async () => {
    if (!assessment || saving) {
      return;
    }

    try {
      setSaving(true);
      errorHandler.clearError();

      const updatedAssessment = {
        ...assessment,
        updatedAt: new Date().toISOString(),
      };

      // Save as generic object - storage service handles serialization
      const success = await enhancedStorageService.saveAssessment(
        updatedAssessment as unknown as Parameters<typeof enhancedStorageService.saveAssessment>[0]
      );

      if (success) {
        setLastSaved(new Date());
        setAssessment(updatedAssessment);
        announceSuccess('Assessment progress saved');
      } else {
        throw new Error('Failed to save assessment');
      }
    } catch (err) {
      console.error('Failed to save:', err);
      errorHandler.setError(err as Error, { operation: 'save', assessmentId });
      announceError('Failed to save progress');
    } finally {
      setSaving(false);
    }
  }, [assessment, saving, assessmentId, errorHandler, announceSuccess, announceError]);

  const updateCapabilityOrbit = useCallback(
    (capabilityId: string, orbitUpdate: Partial<OrbitAssessmentResponse>) => {
      if (!assessment) {
        return;
      }

      setAssessment(prev => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          capabilities: prev.capabilities.map(cap =>
            cap.capabilityId === capabilityId
              ? {
                  ...cap,
                  orbit: {
                    ...cap.orbit,
                    ...orbitUpdate,
                  },
                  status: 'in-progress',
                  updatedAt: new Date().toISOString(),
                }
              : cap
          ),
          status: 'in-progress',
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [assessment]
  );

  const navigateToStep = useCallback(
    async (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        await saveAssessment();
        setCurrentStepIndex(stepIndex);

        const step = steps[stepIndex];
        if (step) {
          const capability = assessment?.capabilities.find(
            c => c.capabilityId === step.capabilityId
          );
          const dimensionLabel = step.dimensionId ? DIMENSION_LABELS[step.dimensionId] : '';
          const stepName =
            step.type === 'overview'
              ? `${capability?.capabilityAreaName} Overview`
              : `${capability?.capabilityAreaName} - ${dimensionLabel}`;
          announceStepChange(stepName, stepIndex + 1, steps.length);
        }
      }
    },
    [steps, assessment, saveAssessment, announceStepChange]
  );

  const handleNext = useCallback(async () => {
    if (currentStepIndex < steps.length - 1) {
      await navigateToStep(currentStepIndex + 1);
    } else {
      await saveAssessment();
      router.push(`/assessment/${assessmentId}/results`);
    }
  }, [currentStepIndex, steps.length, navigateToStep, saveAssessment, router, assessmentId]);

  const handlePrevious = useCallback(async () => {
    if (currentStepIndex > 0) {
      await navigateToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, navigateToStep]);

  // Get current step data
  const currentStep = steps[currentStepIndex];
  const currentCapability = assessment?.capabilities.find(
    c => c.capabilityId === currentStep?.capabilityId
  );

  // Get current step name for header display
  const getCurrentStepName = (): string => {
    if (!currentStep || !currentCapability) {
      return 'MITA 4.0 ORBIT Assessment';
    }

    if (currentStep.type === 'overview') {
      return `${currentCapability.capabilityAreaName} - Overview`;
    } else if (currentStep.dimensionId) {
      return `${currentCapability.capabilityAreaName} - ${DIMENSION_LABELS[currentStep.dimensionId]}`;
    }

    return currentCapability.capabilityAreaName;
  };

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    if (!assessment) {
      return 0;
    }

    let totalAspects = 0;
    let completedAspects = 0;

    for (const cap of assessment.capabilities) {
      // Count aspects in each dimension
      const orbit = cap.orbit;

      // Standard dimensions
      for (const dimId of ['outcomes', 'roles', 'business', 'information'] as const) {
        const dim = orbit[dimId];
        if (dim) {
          const aspectCount = Object.keys(dim.aspects || {}).length;
          totalAspects += aspectCount || 1; // At least 1 per dimension
          const completed = Object.values(dim.aspects || {}).filter(a => a.currentLevel > 0).length;
          completedAspects += completed;
        }
      }

      // Technology dimension
      if (orbit.technology?.subDomains) {
        for (const sd of Object.values(orbit.technology.subDomains)) {
          const aspectCount = Object.keys(sd.aspects || {}).length;
          totalAspects += aspectCount || 1;
          const completed = Object.values(sd.aspects || {}).filter(a => a.currentLevel > 0).length;
          completedAspects += completed;
        }
      }
    }

    return totalAspects > 0 ? Math.round((completedAspects / totalAspects) * 100) : 0;
  }, [assessment]);

  // Loading state
  if (loading || capabilitiesLoading || orbitLoading) {
    return (
      <div className="ds-base">
        <div className="ds-l-container ds-u-padding-y--4">
          <div className="ds-u-text-align--center">
            <div className="ds-c-spinner" aria-valuetext="Loading assessment..." />
            <p className="ds-u-margin-top--2">Loading ORBIT assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (errorHandler.error && !assessment) {
    return (
      <div className="ds-base">
        <div className="ds-l-container ds-u-padding-y--4">
          <div className="ds-c-alert ds-c-alert--error">
            <div className="ds-c-alert__body">
              <h2 className="ds-c-alert__heading">Error Loading Assessment</h2>
              <p className="ds-c-alert__text">{errorHandler.error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment || !orbitModel || steps.length === 0) {
    return (
      <div className="ds-base">
        <div className="ds-l-container ds-u-padding-y--4">
          <p>No assessment data available.</p>
        </div>
      </div>
    );
  }

  return (
    <AssessmentErrorBoundary
      assessmentId={assessmentId}
      onRetry={() => window.location.reload()}
      onExportData={() => {}}
    >
      <div className="ds-base assessment-page">
        <LiveRegions />

        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <AppHeader />

        <AssessmentHeader
          assessmentName={assessment.stateName}
          systemName={assessment.metadata?.systemName}
          currentStep={getCurrentStepName()}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          saving={saving}
          lastSaved={lastSaved}
          completionPercentage={completionPercentage}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
        />

        {/* Sidebar */}
        <OrbitAssessmentSidebar
          assessment={assessment}
          steps={steps}
          currentStepIndex={currentStepIndex}
          onNavigateToStep={navigateToStep}
          isMobileOpen={mobileSidebarOpen}
          onMobileToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Main Content */}
        <div className="assessment-main-content assessment-main-content--sidebar-expanded">
          <div className="assessment-content-inner">
            {/* Storage Error Handler */}
            {errorHandler.isStorageError && errorHandler.error && (
              <StorageErrorHandler
                error={errorHandler.error.originalError}
                onRetry={() => errorHandler.retry(saveAssessment)}
                onContinueOffline={() => errorHandler.clearError()}
                className="ds-u-margin-bottom--3"
              />
            )}

            <main role="main" id="main-content" tabIndex={-1}>
              {/* Overview Step */}
              {currentStep?.type === 'overview' && (
                <OrbitCapabilityOverview
                  onNext={handleNext}
                  onPrevious={currentStepIndex > 0 ? handlePrevious : undefined}
                />
              )}

              {/* Dimension Steps */}
              {currentStep?.type === 'dimension' &&
                currentCapability &&
                currentStep.dimensionId &&
                currentStep.dimensionId !== 'technology' && (
                  <OrbitDimensionAssessment
                    dimensionId={currentStep.dimensionId as Exclude<OrbitDimensionId, 'technology'>}
                    dimension={
                      orbitModel[currentStep.dimensionId as keyof typeof orbitModel] as Parameters<
                        typeof OrbitDimensionAssessment
                      >[0]['dimension']
                    }
                    response={
                      currentCapability.orbit[
                        currentStep.dimensionId as keyof OrbitAssessmentResponse
                      ] as StandardDimensionResponse | undefined
                    }
                    onUpdate={response => {
                      const dimensionId = currentStep.dimensionId;
                      if (dimensionId) {
                        updateCapabilityOrbit(currentCapability.capabilityId, {
                          [dimensionId]: response,
                        });
                      }
                    }}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                )}

              {/* Technology Dimension */}
              {currentStep?.type === 'dimension' &&
                currentCapability &&
                currentStep.dimensionId === 'technology' && (
                  <OrbitTechnologyAssessment
                    dimension={orbitModel.technology}
                    response={currentCapability.orbit.technology}
                    onUpdate={response =>
                      updateCapabilityOrbit(currentCapability.capabilityId, {
                        technology: response,
                      })
                    }
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                )}
            </main>
          </div>
        </div>
      </div>
    </AssessmentErrorBoundary>
  );
};

export default OrbitGuidedAssessment;
