import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { AssessmentResults } from '../../../components/assessment';
import AssessmentHeader from '../../../components/assessment/AssessmentHeader';
import AssessmentSidebar from '../../../components/assessment/AssessmentSidebar';
import { OrbitAssessmentResults } from '../../../components/assessment/orbit';
import AppHeader from '../../../components/layout/AppHeader';
import capabilityService from '../../../services/CapabilityService';
import enhancedStorageService from '../../../services/EnhancedStorageService';

import type { Assessment, CapabilityDefinition, OrbitDimension } from '../../../types';

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
 * Assessment Results Page with Sidebar
 * Detects assessment format and renders appropriate results component
 */
export default function AssessmentResultsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isOrbitAssessment, setIsOrbitAssessment] = useState<boolean>(false);
  const [capabilities, setCapabilities] = useState<CapabilityDefinition[]>([]);
  const [steps, setSteps] = useState<AssessmentStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadAssessmentData(id);
    }
  }, [id]);

  useEffect(() => {
    if (assessment && !isOrbitAssessment) {
      generateSteps();
    }
  }, [assessment, isOrbitAssessment]);

  const loadAssessmentData = async (assessmentId: string) => {
    try {
      setLoading(true);
      const loadedAssessment = await enhancedStorageService.loadAssessment(assessmentId);
      if (!loadedAssessment) {
        return;
      }

      // Check if it's an ORBIT assessment
      if ('capabilities' in loadedAssessment && Array.isArray(loadedAssessment.capabilities)) {
        const firstCap = loadedAssessment.capabilities[0];
        if (firstCap && 'orbit' in firstCap) {
          setIsOrbitAssessment(true);
          setAssessment(loadedAssessment);
          setLoading(false);
          return;
        }
      }

      // Legacy assessment - load capabilities for sidebar
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
        dimensions: {} as CapabilityDefinition['dimensions'],
      }));

      setAssessment(loadedAssessment);
      setCapabilities(loadedCapabilities);
      setIsOrbitAssessment(false);
    } catch (err) {
      console.error('Failed to load assessment:', err);
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
      newSteps.push({ type: 'overview', capabilityId: capability.id });
      ORBIT_DIMENSIONS.forEach(dimension => {
        newSteps.push({ type: 'dimension', capabilityId: capability.id, dimension });
      });
    });
    setSteps(newSteps);
  };

  const navigateToStep = async (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      await router.push(`/assessment/${id}`);
    }
  };

  if (!id || typeof id !== 'string') {
    return (
      <div className="ds-base">
        <div className="ds-l-container ds-u-padding-y--4">
          <div className="ds-c-alert ds-c-alert--error">
            <div className="ds-c-alert__body">
              <h3 className="ds-c-alert__heading">Invalid Assessment ID</h3>
              <p className="ds-c-alert__text">The assessment ID is missing or invalid.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !assessment) {
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

  // Render ORBIT results for new format assessments
  if (isOrbitAssessment) {
    return <OrbitAssessmentResults assessmentId={id} />;
  }

  // Render legacy results with sidebar
  return (
    <div className="ds-base">
      <AppHeader />

      <AssessmentHeader
        assessmentName={assessment.stateName}
        systemName={assessment.metadata?.systemName}
        currentStep="Results"
        onOpenSidebar={() => setMobileSidebarOpen(true)}
      />

      <AssessmentSidebar
        assessment={assessment}
        capabilities={capabilities}
        steps={steps}
        currentStepIndex={-1} // No current step on results page
        onNavigateToStep={navigateToStep}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <div
        className={`assessment-main-content ${
          sidebarCollapsed
            ? 'assessment-main-content--sidebar-collapsed'
            : 'assessment-main-content--sidebar-expanded'
        }`}
      >
        <AssessmentResults assessmentId={id} />
      </div>
    </div>
  );
}
