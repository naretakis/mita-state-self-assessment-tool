import React from 'react';

import type { Assessment, CapabilityDefinition, OrbitDimension } from '../../types';

/**
 * Represents a single step in the assessment workflow
 */
interface AssessmentStep {
  /** Type of step - either capability overview or dimension assessment */
  type: 'overview' | 'dimension';
  /** ID of the capability this step belongs to */
  capabilityId: string;
  /** Specific ORBIT dimension for dimension steps */
  dimension?: OrbitDimension;
}

/**
 * Props interface for the AssessmentSidebar component
 */
interface AssessmentSidebarProps {
  /** The current assessment data */
  assessment: Assessment;
  /** Array of capability definitions for navigation structure */
  capabilities: CapabilityDefinition[];
  /** Array of assessment steps in order */
  steps: AssessmentStep[];
  /** Index of the currently active step */
  currentStepIndex: number;
  /** Callback function when user navigates to a different step */
  onNavigateToStep: (stepIndex: number) => void;
  /** Whether the sidebar is collapsed on desktop */
  isCollapsed: boolean;
  /** Callback to toggle sidebar collapse state */
  onToggleCollapse: () => void;
  /** Whether the mobile sidebar overlay is open */
  isMobileOpen?: boolean;
  /** Callback to toggle mobile sidebar visibility */
  onMobileToggle?: () => void;
}

const ORBIT_DIMENSIONS: OrbitDimension[] = [
  'outcome',
  'role',
  'businessProcess',
  'information',
  'technology',
];

const DIMENSION_LABELS: Record<OrbitDimension, string> = {
  outcome: 'Outcomes',
  role: 'Roles',
  businessProcess: 'Business Process',
  information: 'Information',
  technology: 'Technology',
};

/**
 * AssessmentSidebar component provides navigation for guided assessments
 * with capability-based organization and progress tracking.
 *
 * Features:
 * - Collapsible sidebar for desktop with persistent state
 * - Mobile overlay with backdrop for smaller screens
 * - Capability-based navigation with progress indicators
 * - Expandable sections for dimension steps
 * - Visual status indicators (completed, current, pending)
 * - Results access and contextual actions
 * - Full keyboard and screen reader accessibility
 *
 * @param props - The component props
 * @returns JSX element representing the assessment sidebar
 */
const AssessmentSidebar: React.FC<AssessmentSidebarProps> = React.memo(
  ({
    assessment,
    capabilities,
    steps,
    currentStepIndex,
    onNavigateToStep,
    isCollapsed,
    onToggleCollapse,
    isMobileOpen = false,
    onMobileToggle,
  }) => {
    const [isMobile, setIsMobile] = React.useState(false);
    const [expandedCapabilities, setExpandedCapabilities] = React.useState<Set<string>>(new Set());

    // Keyboard shortcuts
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        // Escape to close mobile sidebar
        if (event.key === 'Escape' && isMobile && isMobileOpen && onMobileToggle) {
          event.preventDefault();
          onMobileToggle();
        }
        // Alt + R to open results
        if (event.altKey && event.key === 'r') {
          event.preventDefault();
          handleResultsClick();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobile, isMobileOpen, onMobileToggle, assessment.id]);

    React.useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Touch gesture support for mobile with error handling
    React.useEffect(() => {
      if (!isMobile || !isMobileOpen) {
        return;
      }

      let startX = 0;
      let currentX = 0;
      let isDragging = false;

      const handleTouchStart = (e: TouchEvent) => {
        try {
          if (e.touches && e.touches[0]) {
            startX = e.touches[0].clientX;
            isDragging = true;
          }
        } catch (error) {
          console.warn('Touch start error:', error);
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        try {
          if (!isDragging || !e.touches || !e.touches[0]) {
            return;
          }
          currentX = e.touches[0].clientX;
          const deltaX = currentX - startX;

          // Only allow swipe left to close
          if (deltaX < -50 && onMobileToggle) {
            onMobileToggle();
            isDragging = false;
          }
        } catch (error) {
          console.warn('Touch move error:', error);
          isDragging = false;
        }
      };

      const handleTouchEnd = () => {
        isDragging = false;
      };

      try {
        const sidebar = document.querySelector('.assessment-sidebar');
        if (sidebar) {
          sidebar.addEventListener('touchstart', handleTouchStart, { passive: true });
          sidebar.addEventListener('touchmove', handleTouchMove, { passive: true });
          sidebar.addEventListener('touchend', handleTouchEnd, { passive: true });

          return () => {
            try {
              sidebar.removeEventListener('touchstart', handleTouchStart);
              sidebar.removeEventListener('touchmove', handleTouchMove);
              sidebar.removeEventListener('touchend', handleTouchEnd);
            } catch (error) {
              console.warn('Failed to remove touch event listeners:', error);
            }
          };
        }
      } catch (error) {
        console.warn('Failed to set up touch gesture support:', error);
      }
    }, [isMobile, isMobileOpen, onMobileToggle]);

    const handleStepNavigation = React.useCallback(
      (stepIndex: number) => {
        onNavigateToStep(stepIndex);
        if (isMobile && onMobileToggle) {
          onMobileToggle();
        }
      },
      [onNavigateToStep, isMobile, onMobileToggle]
    );

    const handleResultsClick = React.useCallback(() => {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const resultsUrl = `${basePath}/assessment/${assessment.id}/results`;
      window.location.href = resultsUrl;
    }, [assessment.id]);

    const toggleCapability = React.useCallback((capabilityId: string) => {
      setExpandedCapabilities(prev => {
        const newSet = new Set(prev);
        if (newSet.has(capabilityId)) {
          newSet.delete(capabilityId);
        } else {
          newSet.add(capabilityId);
        }
        return newSet;
      });
    }, []);

    // Auto-expand capability containing current step
    React.useEffect(() => {
      const currentStep = steps[currentStepIndex];
      if (currentStep) {
        setExpandedCapabilities(prev => new Set([...prev, currentStep.capabilityId]));
      }
    }, [currentStepIndex, steps]);

    /**
     * Determines the status of a specific assessment step
     * @param stepIndex - The index of the step to check
     * @returns Status of the step: 'completed', 'current', or 'pending'
     */
    const getStepStatus = React.useCallback(
      (stepIndex: number): 'completed' | 'current' | 'pending' => {
        // Type guard: ensure valid step index
        if (stepIndex < 0 || stepIndex >= steps.length) {
          return 'pending';
        }

        // Current step is always marked as current
        if (stepIndex === currentStepIndex) {
          return 'current';
        }

        const step = steps[stepIndex];
        if (!step) {
          return 'pending';
        }

        // For dimension steps, check if the dimension has been completed
        if (step.type === 'dimension' && step.dimension) {
          const capability = assessment.capabilities.find(cap => cap.id === step.capabilityId);
          if (capability?.dimensions?.[step.dimension]) {
            const maturityLevel = capability.dimensions[step.dimension].maturityLevel;
            if (typeof maturityLevel === 'number' && maturityLevel > 0) {
              return 'completed';
            }
          }
        }

        return 'pending';
      },
      [currentStepIndex, steps, assessment.capabilities]
    );

    const groupedSteps = React.useMemo(() => {
      const groups: Array<{
        capability: CapabilityDefinition;
        overviewStep: number;
        dimensionSteps: Array<{ dimension: OrbitDimension; stepIndex: number }>;
        progress: number;
      }> = [];

      steps.forEach((step, index) => {
        const capability = capabilities.find(cap => cap.id === step.capabilityId);
        if (!capability) {
          return;
        }

        let group = groups.find(g => g.capability.id === step.capabilityId);
        if (!group) {
          // Calculate progress once when creating the group
          const assessmentCapability = assessment.capabilities.find(
            cap => cap.id === step.capabilityId
          );
          let progress = 0;
          if (assessmentCapability?.dimensions) {
            const completedDimensions = ORBIT_DIMENSIONS.filter(dim => {
              const dimension = assessmentCapability.dimensions[dim];
              return (
                dimension &&
                typeof dimension.maturityLevel === 'number' &&
                dimension.maturityLevel > 0
              );
            }).length;
            progress = Math.round(
              Math.max(0, Math.min(100, (completedDimensions / ORBIT_DIMENSIONS.length) * 100))
            );
          }

          group = {
            capability,
            overviewStep: -1,
            dimensionSteps: [],
            progress,
          };
          groups.push(group);
        }

        if (step.type === 'overview') {
          group.overviewStep = index;
        } else if (step.dimension) {
          group.dimensionSteps.push({
            dimension: step.dimension,
            stepIndex: index,
          });
        }
      });

      return groups;
    }, [steps, capabilities, assessment.capabilities]);

    return (
      <>
        {isMobile && isMobileOpen && (
          <div
            className="assessment-sidebar-overlay assessment-sidebar-overlay--visible"
            onClick={onMobileToggle}
            aria-hidden="true"
          />
        )}

        <aside
          className={`assessment-sidebar ${isCollapsed ? 'assessment-sidebar--collapsed' : ''} ${
            isMobile && isMobileOpen ? 'assessment-sidebar--mobile-open' : ''
          }`}
          aria-label="Assessment navigation"
          aria-hidden={isMobile && !isMobileOpen}
          onClick={isCollapsed && !isMobile ? onToggleCollapse : undefined}
          style={{ cursor: isCollapsed && !isMobile ? 'pointer' : 'default' }}
        >
          {isMobile && (
            <button
              type="button"
              className="assessment-sidebar__close-btn"
              onClick={onMobileToggle}
              aria-label="Close navigation"
              title="Close navigation"
            >
              ×
            </button>
          )}

          {!isCollapsed && (
            <nav className="assessment-sidebar__nav" aria-label="Assessment sections">
              <ul className="assessment-sidebar__list">
                {groupedSteps.map(group => {
                  const progress = group.progress;

                  const isExpanded = expandedCapabilities.has(group.capability.id);
                  const hasCurrentStep =
                    steps[currentStepIndex]?.capabilityId === group.capability.id;

                  return (
                    <li key={group.capability.id} className="assessment-sidebar__group">
                      <button
                        type="button"
                        className={`assessment-sidebar__capability-header ${
                          hasCurrentStep ? 'assessment-sidebar__capability-header--current' : ''
                        }`}
                        onClick={() => toggleCapability(group.capability.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`capability-steps-${group.capability.id}`}
                        aria-label={`${group.capability.capabilityAreaName} - ${progress}% complete - ${isExpanded ? 'Collapse' : 'Expand'} section`}
                      >
                        <span className="assessment-sidebar__expand-icon">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                        <div className="assessment-sidebar__capability-info">
                          <h3 className="assessment-sidebar__capability-title">
                            {group.capability.capabilityAreaName}
                          </h3>
                          <div className="assessment-sidebar__progress">
                            <div
                              className="assessment-sidebar__progress-bar"
                              role="progressbar"
                              aria-valuenow={progress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${progress}% complete`}
                            >
                              <div
                                className="assessment-sidebar__progress-fill"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="assessment-sidebar__progress-text">{progress}%</span>
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <ul
                          className="assessment-sidebar__steps"
                          id={`capability-steps-${group.capability.id}`}
                          aria-label={`Steps for ${group.capability.capabilityAreaName}`}
                        >
                          {group.overviewStep >= 0 && (
                            <li className="assessment-sidebar__step">
                              <button
                                type="button"
                                className={`assessment-sidebar__step-button assessment-sidebar__step-button--${getStepStatus(group.overviewStep)}`}
                                onClick={() => handleStepNavigation(group.overviewStep)}
                                aria-current={
                                  currentStepIndex === group.overviewStep ? 'step' : undefined
                                }
                                aria-label={`Overview - ${getStepStatus(group.overviewStep)} - Navigate to step ${group.overviewStep + 1}`}
                              >
                                <span className="assessment-sidebar__step-icon">
                                  {getStepStatus(group.overviewStep) === 'completed'
                                    ? '✓'
                                    : getStepStatus(group.overviewStep) === 'current'
                                      ? '●'
                                      : '○'}
                                </span>
                                <span className="assessment-sidebar__step-label">Overview</span>
                              </button>
                            </li>
                          )}

                          {group.dimensionSteps.map(({ dimension, stepIndex }) => (
                            <li key={dimension} className="assessment-sidebar__step">
                              <button
                                type="button"
                                className={`assessment-sidebar__step-button assessment-sidebar__step-button--${getStepStatus(stepIndex)}`}
                                onClick={() => handleStepNavigation(stepIndex)}
                                aria-current={currentStepIndex === stepIndex ? 'step' : undefined}
                                aria-label={`${DIMENSION_LABELS[dimension]} dimension - ${getStepStatus(stepIndex)} - Navigate to step ${stepIndex + 1}`}
                              >
                                <span className="assessment-sidebar__step-icon">
                                  {getStepStatus(stepIndex) === 'completed'
                                    ? '✓'
                                    : getStepStatus(stepIndex) === 'current'
                                      ? '●'
                                      : '○'}
                                </span>
                                <span className="assessment-sidebar__step-label">
                                  {DIMENSION_LABELS[dimension]}
                                </span>
                              </button>
                            </li>
                          ))}
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
                  aria-label="View assessment results (Alt+R)"
                  title="View assessment results (Alt+R)"
                >
                  <span className="assessment-sidebar__results-icon" aria-hidden="true">
                    📊
                  </span>
                  View Results
                </button>

                {!isMobile && (
                  <button
                    type="button"
                    className="assessment-sidebar__collapse-btn"
                    onClick={onToggleCollapse}
                    aria-label="Collapse sidebar"
                    title="Collapse sidebar"
                  >
                    ← Collapse
                  </button>
                )}
              </div>
            </nav>
          )}
        </aside>
      </>
    );
  }
);

export default AssessmentSidebar;
