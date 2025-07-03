import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { ContentService } from '../../services/ContentService';
import enhancedStorageService from '../../services/EnhancedStorageService';

import CapabilityOverview from './CapabilityOverview';
import DimensionAssessment from './DimensionAssessment';
import ProgressTracker from './ProgressTracker';

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

      const contentService = new ContentService('/content');
      await contentService.initialize();
      const loadedCapabilities = contentService.getAllCapabilities();

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
      const updatedAssessment = {
        ...assessment,
        updatedAt: new Date().toISOString(),
      };

      const success = await enhancedStorageService.saveAssessment(updatedAssessment);

      if (success) {
        setLastSaved(new Date());
        setAssessment(updatedAssessment);
      }
    } catch (err) {
      console.error('Failed to save assessment:', err);
    } finally {
      setSaving(false);
    }
  }, [assessment, saving]);

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

  const navigateToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const handleNext = async () => {
    if (currentStepIndex < steps.length - 1) {
      navigateToStep(currentStepIndex + 1);
    } else {
      // Assessment complete - save before navigating
      await saveAssessment();
      router.push(`/assessment/${assessmentId}/results`);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      navigateToStep(currentStepIndex - 1);
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
    return capabilities.find(cap => cap.id === step.capabilityId) || null;
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

  return (
    <div className="ds-base">
      <div className="ds-l-container ds-u-padding-y--4">
        <ProgressTracker
          currentStep={currentStepIndex + 1}
          totalSteps={steps.length}
          completionPercentage={getCompletionPercentage()}
          saving={saving}
          lastSaved={lastSaved}
        />

        <main role="main" className="ds-u-margin-top--4">
          {currentStep.type === 'overview' && currentCapability && currentDefinition && (
            <CapabilityOverview
              capability={currentCapability}
              definition={currentDefinition}
              onNext={handleNext}
              onPrevious={currentStepIndex > 0 ? handlePrevious : undefined}
            />
          )}

          {currentStep.type === 'dimension' &&
            currentCapability &&
            currentDefinition &&
            currentStep.dimension && (
              <DimensionAssessment
                capability={currentCapability}
                definition={currentDefinition}
                dimension={currentStep.dimension}
                onUpdate={data =>
                  updateDimension(currentCapability.id, currentStep.dimension!, data)
                }
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSave={saveAssessment}
              />
            )}
        </main>
      </div>
    </div>
  );
};

export default GuidedAssessment;
