/**
 * OrbitAssessmentSidebar Component
 *
 * Navigation sidebar for ORBIT-based assessments.
 * Shows capability and dimension progress.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { OrbitAssessment, OrbitDimensionId } from '../../../types/orbit';

interface AssessmentStep {
  type: 'overview' | 'dimension';
  capabilityId: string;
  dimensionId?: OrbitDimensionId;
}

interface OrbitAssessmentSidebarProps {
  assessment: OrbitAssessment;
  steps: AssessmentStep[];
  currentStepIndex: number;
  onNavigateToStep: (stepIndex: number) => Promise<void>;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const DIMENSION_LABELS: Record<OrbitDimensionId, string> = {
  outcomes: 'Outcomes',
  roles: 'Roles',
  business: 'Business Architecture',
  information: 'Information & Data',
  technology: 'Technology',
};

const DIMENSION_ORDER: OrbitDimensionId[] = [
  'outcomes',
  'roles',
  'business',
  'information',
  'technology',
];

const OrbitAssessmentSidebar: React.FC<OrbitAssessmentSidebarProps> = ({
  assessment,
  steps,
  currentStepIndex,
  onNavigateToStep,
  isMobileOpen = false,
  onMobileToggle,
}) => {
  const [expandedCapabilities, setExpandedCapabilities] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-expand capability containing current step
  useEffect(() => {
    const currentStep = steps[currentStepIndex];
    if (currentStep) {
      setExpandedCapabilities(prev => new Set([...prev, currentStep.capabilityId]));
    }
  }, [currentStepIndex, steps]);

  const toggleCapability = useCallback((capabilityId: string) => {
    setExpandedCapabilities(prev => {
      const next = new Set(prev);
      if (next.has(capabilityId)) {
        next.delete(capabilityId);
      } else {
        next.add(capabilityId);
      }
      return next;
    });
  }, []);

  const handleStepNavigation = useCallback(
    async (stepIndex: number) => {
      await onNavigateToStep(stepIndex);
      if (isMobile && onMobileToggle) {
        onMobileToggle();
      }
    },
    [onNavigateToStep, isMobile, onMobileToggle]
  );

  // Group steps by capability
  const groupedSteps = useMemo(() => {
    const groups: Array<{
      capabilityId: string;
      capabilityName: string;
      overviewStepIndex: number;
      dimensionSteps: Array<{ dimensionId: OrbitDimensionId; stepIndex: number }>;
      progress: number;
    }> = [];

    const capabilityMap = new Map<string, (typeof groups)[0]>();

    steps.forEach((step, index) => {
      let group = capabilityMap.get(step.capabilityId);

      if (!group) {
        const capability = assessment.capabilities.find(c => c.capabilityId === step.capabilityId);
        group = {
          capabilityId: step.capabilityId,
          capabilityName: capability?.capabilityAreaName || step.capabilityId,
          overviewStepIndex: -1,
          dimensionSteps: [],
          progress: 0,
        };
        capabilityMap.set(step.capabilityId, group);
        groups.push(group);
      }

      if (step.type === 'overview') {
        group.overviewStepIndex = index;
      } else if (step.dimensionId) {
        group.dimensionSteps.push({
          dimensionId: step.dimensionId,
          stepIndex: index,
        });
      }
    });

    // Calculate progress for each capability
    groups.forEach(group => {
      const capability = assessment.capabilities.find(c => c.capabilityId === group.capabilityId);
      if (capability?.orbit) {
        let completedDimensions = 0;

        // Check standard dimensions
        for (const dimId of ['outcomes', 'roles', 'business', 'information'] as const) {
          const dim = capability.orbit[dimId];
          if (dim && Object.keys(dim.aspects || {}).length > 0) {
            const hasCompleted = Object.values(dim.aspects).some(a => a.currentLevel > 0);
            if (hasCompleted) {
              completedDimensions++;
            }
          }
        }

        // Check technology
        if (capability.orbit.technology?.subDomains) {
          const hasCompleted = Object.values(capability.orbit.technology.subDomains).some(sd =>
            Object.values(sd.aspects || {}).some(a => a.currentLevel > 0)
          );
          if (hasCompleted) {
            completedDimensions++;
          }
        }

        group.progress = Math.round((completedDimensions / 5) * 100);
      }
    });

    return groups;
  }, [steps, assessment.capabilities]);

  // Get step status
  const getStepStatus = useCallback(
    (stepIndex: number): 'completed' | 'current' | 'pending' => {
      if (stepIndex === currentStepIndex) {
        return 'current';
      }

      const step = steps[stepIndex];
      if (!step || step.type === 'overview') {
        return stepIndex < currentStepIndex ? 'completed' : 'pending';
      }

      // Check dimension completion
      const capability = assessment.capabilities.find(c => c.capabilityId === step.capabilityId);
      if (!capability?.orbit || !step.dimensionId) {
        return 'pending';
      }

      if (step.dimensionId === 'technology') {
        const tech = capability.orbit.technology;
        if (tech?.subDomains) {
          const hasCompleted = Object.values(tech.subDomains).some(sd =>
            Object.values(sd.aspects || {}).some(a => a.currentLevel > 0)
          );
          return hasCompleted ? 'completed' : 'pending';
        }
      } else {
        const dim = capability.orbit[step.dimensionId];
        if (dim && Object.values(dim.aspects || {}).some(a => a.currentLevel > 0)) {
          return 'completed';
        }
      }

      return 'pending';
    },
    [currentStepIndex, steps, assessment.capabilities]
  );

  const handleResultsClick = useCallback(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    window.location.href = `${basePath}/assessment/${assessment.id}/results`;
  }, [assessment.id]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="assessment-sidebar-overlay assessment-sidebar-overlay--visible"
          onClick={onMobileToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`assessment-sidebar ${isMobile && isMobileOpen ? 'assessment-sidebar--mobile-open' : ''}`}
        aria-label="Assessment navigation"
        aria-hidden={isMobile && !isMobileOpen}
      >
        {isMobile && (
          <button
            type="button"
            className="assessment-sidebar__close-btn"
            onClick={onMobileToggle}
            aria-label="Close navigation"
          >
            ×
          </button>
        )}

        <nav className="assessment-sidebar__nav" aria-label="Assessment sections">
          <ul className="assessment-sidebar__list">
            {groupedSteps.map(group => {
              const isExpanded = expandedCapabilities.has(group.capabilityId);
              const hasCurrentStep = steps[currentStepIndex]?.capabilityId === group.capabilityId;

              return (
                <li key={group.capabilityId} className="assessment-sidebar__group">
                  <button
                    type="button"
                    className={`assessment-sidebar__capability-header ${hasCurrentStep ? 'assessment-sidebar__capability-header--current' : ''}`}
                    onClick={() => toggleCapability(group.capabilityId)}
                    aria-expanded={isExpanded}
                    aria-controls={`capability-steps-${group.capabilityId}`}
                  >
                    <span className="assessment-sidebar__expand-icon">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                    <div className="assessment-sidebar__capability-info">
                      <h3 className="assessment-sidebar__capability-title">
                        {group.capabilityName}
                      </h3>
                      <div className="assessment-sidebar__progress">
                        <div
                          className="assessment-sidebar__progress-bar"
                          role="progressbar"
                          aria-valuenow={group.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="assessment-sidebar__progress-fill"
                            style={{ width: `${group.progress}%` }}
                          />
                        </div>
                        <span className="assessment-sidebar__progress-text">{group.progress}%</span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <ul
                      className="assessment-sidebar__steps"
                      id={`capability-steps-${group.capabilityId}`}
                    >
                      {/* Overview step */}
                      {group.overviewStepIndex >= 0 && (
                        <li className="assessment-sidebar__step">
                          <button
                            type="button"
                            className={`assessment-sidebar__step-button assessment-sidebar__step-button--${getStepStatus(group.overviewStepIndex)}`}
                            onClick={() => handleStepNavigation(group.overviewStepIndex)}
                            aria-current={
                              currentStepIndex === group.overviewStepIndex ? 'step' : undefined
                            }
                          >
                            <span className="assessment-sidebar__step-icon">
                              {getStepStatus(group.overviewStepIndex) === 'completed'
                                ? '✓'
                                : getStepStatus(group.overviewStepIndex) === 'current'
                                  ? '●'
                                  : '○'}
                            </span>
                            <span className="assessment-sidebar__step-label">Overview</span>
                          </button>
                        </li>
                      )}

                      {/* Dimension steps */}
                      {group.dimensionSteps
                        .sort(
                          (a, b) =>
                            DIMENSION_ORDER.indexOf(a.dimensionId) -
                            DIMENSION_ORDER.indexOf(b.dimensionId)
                        )
                        .map(({ dimensionId, stepIndex }) => {
                          const status = getStepStatus(stepIndex);
                          const isOptional = dimensionId === 'outcomes' || dimensionId === 'roles';

                          return (
                            <li key={dimensionId} className="assessment-sidebar__step">
                              <button
                                type="button"
                                className={`assessment-sidebar__step-button assessment-sidebar__step-button--${status}`}
                                onClick={() => handleStepNavigation(stepIndex)}
                                aria-current={currentStepIndex === stepIndex ? 'step' : undefined}
                              >
                                <span className="assessment-sidebar__step-icon">
                                  {status === 'completed' ? '✓' : status === 'current' ? '●' : '○'}
                                </span>
                                <span className="assessment-sidebar__step-label">
                                  {DIMENSION_LABELS[dimensionId]}
                                  {isOptional && (
                                    <span
                                      style={{
                                        fontSize: '0.625rem',
                                        color: '#5c5c5c',
                                        marginLeft: '0.25rem',
                                      }}
                                    >
                                      (optional)
                                    </span>
                                  )}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="assessment-sidebar__footer">
            <button
              type="button"
              className="assessment-sidebar__results-btn"
              onClick={handleResultsClick}
              aria-label="View assessment results"
            >
              <span className="assessment-sidebar__results-icon" aria-hidden="true">
                📊
              </span>
              View Results
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default OrbitAssessmentSidebar;
