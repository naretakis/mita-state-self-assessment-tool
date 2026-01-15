import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import capabilityService from '../../services/CapabilityService';
import enhancedStorageService from '../../services/EnhancedStorageService';
import AppHeader from '../layout/AppHeader';

import AssessmentErrorBoundary from './AssessmentErrorBoundary';
import AssessmentHeader from './AssessmentHeader';
import AssessmentSidebar from './AssessmentSidebar';
import CapabilityOverview from './CapabilityOverview';
import DimensionAssessment from './DimensionAssessment';
import StorageErrorHandler from './StorageErrorHandler';

import type {
  Assessment,
  CapabilityAreaAssessment,
  CapabilityDefinition,
  OrbitDimension,
} from '../../types';

interface GuidedAssessmentProps {
  assessmentId: string;
}

interface AssessmentStep {
  type: 'overview' | 'dimension';
  capabilityId: string;
  dimension?: OrbitDimension;
}

const ORBIT_DIMENSIONS: OrbitDimension[] = [
  'outcome',
  'role',
  'businessProcess',
  'information',
  'technology',
];

/**
 * Create a default dimension definition for ORBIT model
 */
const createDefaultDimension = () => ({
  description: '',
  maturityAssessment: [],
  maturityLevels: {
    level1: 'Level 1: Initial',
    level2: 'Level 2: Developing',
    level3: 'Level 3: Defined',
    level4: 'Level 4: Managed',
    level5: 'Level 5: Optimized',
  },
});

const GuidedAssessment: React.FC<GuidedAssessmentProps> = ({ assessmentId }) => {
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [capabilities, setCapabilities] = useState<CapabilityDefinition[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<AssessmentStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const errorHandler = useErrorHandler();

  // Accessibility hooks
  const { containerRef, restoreFocus } = useKeyboardNavigation({
    onEscape: () => router.push('/dashboard'),
    trapFocus: true,
  });
  const { announceStepChange, announceError, announceSuccess, LiveRegions } = useAnnouncements();

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

  // Load assessment and capabilities
  useEffect(() => {
    loadAssessmentData();
  }, [assessmentId]);

  // Generate steps when assessment loads
  useEffect(() => {
    if (assessment) {
      generateSteps();
    }
  }, [assessment]);

  const loadAssessmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const loadedAssessment = await enhancedStorageService.loadAssessment(assessmentId);
      if (!loadedAssessment) {
        throw new Error('Assessment not found');
      }

      // Load capabilities from CapabilityService and convert to CapabilityDefinition format
      const capabilityMetadata = await capabilityService.getAllCapabilities();
      const loadedCapabilities: CapabilityDefinition[] = capabilityMetadata.map(cap => ({
        id: cap.id,
        version: cap.version,
        capabilityDomainName: cap.domainName,
        capabilityAreaName: cap.areaName,
        capabilityVersion: cap.version,
        capabilityAreaCreated: cap.createdAt,
        capabilityAreaLastUpdated: cap.updatedAt,
        description: cap.description,
        domainDescription: cap.domainDescription,
        areaDescription: cap.areaDescription,
        dimensions: {
          outcome: createDefaultDimension(),
          role: createDefaultDimension(),
          businessProcess: createDefaultDimension(),
          information: createDefaultDimension(),
          technology: createDefaultDimension(),
        },
      }));

      setAssessment(loadedAssessment);
      setCapabilities(loadedCapabilities);
    } catch (err) {
      console.error('Failed to load assessment:', err);
      setError('Failed to load assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSteps = () => {
    if (!assessment) {
      return;
    }

    const newSteps: AssessmentStep[] = [];

    assessment.capabilities.forEach(capability => {
      // Add overview step
      newSteps.push({
        type: 'overview',
        capabilityId: capability.id,
      });

      // Add dimension steps
      ORBIT_DIMENSIONS.forEach(dimension => {
        newSteps.push({
          type: 'dimension',
          capabilityId: capability.id,
          dimension,
        });
      });
    });

    setSteps(newSteps);
  };

  const saveAssessment = useCallback(async () => {
    if (!assessment || saving) {
      return;
    }

    try {
      setSaving(true);
      errorHandler.clearError(); // Clear any previous errors

      const updatedAssessment = {
        ...assessment,
        updatedAt: new Date().toISOString(),
      };

      const success = await enhancedStorageService.saveAssessment(updatedAssessment);

      if (success) {
        setLastSaved(new Date());
        setAssessment(updatedAssessment);
        setError(null); // Clear any previous error state
        announceSuccess('Assessment progress saved successfully');
      } else {
        throw new Error('Failed to save assessment: Storage operation returned false');
      }
    } catch (err) {
      console.error('Failed to save assessment:', err);
      errorHandler.setError(err as Error, {
        assessmentId: assessment.id,
        operation: 'save',
        timestamp: new Date().toISOString(),
      });
      const errorMessage = 'Failed to save your progress. Your work may not be preserved.';
      setError(errorMessage);
      announceError(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [assessment, saving, errorHandler, announceSuccess, announceError]);

  const updateDimension = (
    capabilityId: string,
    dimension: OrbitDimension,
    data: Record<string, unknown>
  ) => {
    if (!assessment) {
      return;
    }

    const updatedAssessment = {
      ...assessment,
      capabilities: assessment.capabilities.map(cap =>
        cap.id === capabilityId
          ? {
              ...cap,
              dimensions: {
                ...cap.dimensions,
                [dimension]: {
                  ...cap.dimensions[dimension],
                  ...data,
                  lastUpdated: new Date().toISOString(),
                },
              },
              status: 'in-progress' as const,
            }
          : cap
      ),
      status: 'in-progress' as const,
    };

    setAssessment(updatedAssessment);
  };

  const navigateToStep = async (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      // Save before navigating
      await saveAssessment();

      setCurrentStepIndex(stepIndex);

      // Announce step change to screen readers
      const step = steps[stepIndex];
      if (step) {
        const capability = capabilities.find(cap => cap.id === step.capabilityId);
        const stepName =
          step.type === 'overview'
            ? `${capability?.capabilityAreaName} Overview`
            : `${capability?.capabilityAreaName} - ${step.dimension} Assessment`;
        announceStepChange(stepName, stepIndex + 1, steps.length);
      }

      // Restore focus to main content
      setTimeout(() => restoreFocus(), 100);
    }
  };

  const handleNext = async () => {
    if (currentStepIndex < steps.length - 1) {
      await navigateToStep(currentStepIndex + 1);
    } else {
      // Assessment complete - save before navigating
      await saveAssessment();
      router.push(`/assessment/${assessmentId}/results`);
    }
  };

  const handlePrevious = async () => {
    if (currentStepIndex > 0) {
      await navigateToStep(currentStepIndex - 1);
    }
  };

  const getCurrentCapability = (): CapabilityAreaAssessment | null => {
    if (!assessment || !steps[currentStepIndex]) {
      return null;
    }
    const step = steps[currentStepIndex];
    return assessment.capabilities.find(cap => cap.id === step.capabilityId) || null;
  };

  const getCurrentCapabilityDefinition = (): CapabilityDefinition | null => {
    const step = steps[currentStepIndex];
    if (!step) {
      return null;
    }

    // Get the assessment capability first - we'll need it for fallback
    const assessmentCapability = assessment?.capabilities.find(cap => cap.id === step.capabilityId);

    // First try exact ID match
    let definition = capabilities.find(cap => cap.id === step.capabilityId);
    if (definition) {
      return definition;
    }

    // If no exact match, try matching by capability area name
    // This handles the case where assessment uses IDs like "provider-enrollment"
    // but definitions have IDs like "provider-provider-enrollment"
    if (assessmentCapability) {
      definition = capabilities.find(
        cap =>
          cap.capabilityAreaName.toLowerCase().replace(/\s+/g, '-') ===
            assessmentCapability.capabilityAreaName.toLowerCase().replace(/\s+/g, '-') ||
          cap.id.endsWith(step.capabilityId)
      );
    }

    // If still no definition found, create a fallback from assessment data
    if (!definition && assessmentCapability) {
      const defaultDimension = {
        description: '',
        maturityAssessment: [],
        maturityLevels: {
          level1: 'Level 1: Initial',
          level2: 'Level 2: Developing',
          level3: 'Level 3: Defined',
          level4: 'Level 4: Managed',
          level5: 'Level 5: Optimized',
        },
      };

      definition = {
        id: assessmentCapability.id,
        capabilityDomainName: assessmentCapability.capabilityDomainName,
        capabilityAreaName: assessmentCapability.capabilityAreaName,
        capabilityVersion: '1.0',
        capabilityAreaCreated: new Date().toISOString().split('T')[0],
        capabilityAreaLastUpdated: new Date().toISOString().split('T')[0],
        description: `Assessment for ${assessmentCapability.capabilityAreaName}`,
        domainDescription: `${assessmentCapability.capabilityDomainName} domain`,
        areaDescription: `${assessmentCapability.capabilityAreaName} capability area`,
        dimensions: {
          outcome: { ...defaultDimension },
          role: { ...defaultDimension },
          businessProcess: { ...defaultDimension },
          information: { ...defaultDimension },
          technology: { ...defaultDimension },
        },
      };
    }

    return definition || null;
  };

  const getCompletionPercentage = (): number => {
    if (!assessment) {
      return 0;
    }

    const totalDimensions = assessment.capabilities.length * 5;
    let completedDimensions = 0;

    assessment.capabilities.forEach(capability => {
      ORBIT_DIMENSIONS.forEach(dimension => {
        if (capability.dimensions[dimension].maturityLevel > 0) {
          completedDimensions++;
        }
      });
    });

    return totalDimensions > 0 ? Math.round((completedDimensions / totalDimensions) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="ds-base">
        <div className="ds-l-container ds-u-padding-y--4">
          <div className="ds-u-text-align--center">
            <div className="ds-c-spinner" aria-valuetext="Loading assessment..." />
            <p className="ds-u-margin-top--2">Loading assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ds-base">
        <div className="ds-l-container ds-u-padding-y--4">
          <div className="ds-c-alert ds-c-alert--error">
            <div className="ds-c-alert__body">
              <h2 className="ds-c-alert__heading">Error</h2>
              <p className="ds-c-alert__text">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment || steps.length === 0) {
    return (
      <div className="ds-base">
        <div className="ds-l-container ds-u-padding-y--4">
          <p>No assessment data available.</p>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const currentCapability = getCurrentCapability();
  const currentDefinition = getCurrentCapabilityDefinition();

  const getCurrentStepName = (): string => {
    if (!currentStep || !currentDefinition) {
      return '';
    }

    if (currentStep.type === 'overview') {
      return `${currentDefinition.capabilityAreaName} - Overview`;
    } else if (currentStep.dimension) {
      const dimensionLabels = {
        outcome: 'Outcomes',
        role: 'Roles',
        businessProcess: 'Business Process',
        information: 'Information',
        technology: 'Technology',
      };
      return `${currentDefinition.capabilityAreaName} - ${dimensionLabels[currentStep.dimension]}`;
    }

    return currentDefinition.capabilityAreaName;
  };

  return (
    <AssessmentErrorBoundary
      assessmentId={assessmentId}
      onRetry={() => window.location.reload()}
      onExportData={() => {
        // Export will be handled by the error boundary
      }}
    >
      <div className="ds-base assessment-page" ref={containerRef} tabIndex={-1}>
        <LiveRegions />

        {/* Skip link for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Main App Header for consistent navigation */}
        <AppHeader />

        <AssessmentHeader
          assessmentName={assessment.stateName}
          systemName={assessment.metadata?.systemName}
          currentStep={getCurrentStepName()}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          saving={saving}
          lastSaved={lastSaved}
          completionPercentage={getCompletionPercentage()}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
        />

        <AssessmentSidebar
          assessment={assessment}
          capabilities={capabilities}
          steps={steps}
          currentStepIndex={currentStepIndex}
          onNavigateToStep={navigateToStep}
          isCollapsed={false}
          onToggleCollapse={() => {}}
          isMobileOpen={mobileSidebarOpen}
          onMobileToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <div className="assessment-main-content assessment-main-content--sidebar-expanded">
          <div className="assessment-content-inner">
            {/* Show storage error handler if there's a storage error */}
            {errorHandler.isStorageError && errorHandler.error && (
              <StorageErrorHandler
                error={errorHandler.error.originalError}
                assessment={assessment || undefined}
                onRetry={() => errorHandler.retry(saveAssessment)}
                onContinueOffline={() => {
                  errorHandler.clearError();
                  setError(null);
                }}
                className="ds-u-margin-bottom--3"
              />
            )}

            {/* Show general error message if not a storage error */}
            {error && !errorHandler.isStorageError && (
              <div className="ds-c-alert ds-c-alert--error ds-u-margin-bottom--3" role="alert">
                <div className="ds-c-alert__body">
                  <p className="ds-c-alert__text">{error}</p>
                </div>
              </div>
            )}

            <main role="main" id="main-content" tabIndex={-1}>
              {currentStep.type === 'overview' && currentCapability && currentDefinition && (
                <AssessmentErrorBoundary
                  assessmentId={assessmentId}
                  onRetry={() => setCurrentStepIndex(currentStepIndex)} // Retry current step
                >
                  <CapabilityOverview
                    capability={currentCapability}
                    definition={currentDefinition}
                    onNext={handleNext}
                    onPrevious={currentStepIndex > 0 ? handlePrevious : undefined}
                  />
                </AssessmentErrorBoundary>
              )}

              {currentStep.type === 'dimension' &&
                currentCapability &&
                currentDefinition &&
                currentStep.dimension && (
                  <AssessmentErrorBoundary
                    assessmentId={assessmentId}
                    onRetry={() => setCurrentStepIndex(currentStepIndex)} // Retry current step
                  >
                    <DimensionAssessment
                      capability={currentCapability}
                      definition={currentDefinition}
                      dimension={currentStep.dimension}
                      onUpdate={data =>
                        updateDimension(
                          currentCapability.id,
                          currentStep.dimension as OrbitDimension,
                          data
                        )
                      }
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                      onSave={saveAssessment}
                    />
                  </AssessmentErrorBoundary>
                )}
            </main>
          </div>
        </div>
      </div>
    </AssessmentErrorBoundary>
  );
};

export default GuidedAssessment;
