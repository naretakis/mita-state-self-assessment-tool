import React, { useEffect, useState } from 'react';

import * as yaml from 'js-yaml';
import { useRouter } from 'next/router';

import { useErrorHandler } from '../../hooks/useErrorHandler';
import enhancedStorageService from '../../services/EnhancedStorageService';
import styles from '../../styles/AssessmentSetup.module.css';

import type {
  OrbitAssessment,
  OrbitAssessmentResponse,
  TechnologySubDomainId,
} from '../../types/orbit';

import AssessmentErrorBoundary from './AssessmentErrorBoundary';
import StorageErrorHandler from './StorageErrorHandler';

interface AssessmentSetupProps {
  onAssessmentCreated?: (assessmentId: string) => void;
}

interface CapabilityArea {
  id: string;
  name: string;
  file?: string;
}

interface CapabilityDomain {
  id: string;
  name: string;
  description: string;
  areas: CapabilityArea[];
}

interface CapabilitiesIndex {
  version: string;
  description: string;
  domains: CapabilityDomain[];
  metadata: {
    lastUpdated: string;
    orbitModelVersion: string;
  };
}

interface DomainSelection {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  areas: CapabilityArea[];
}

interface CapabilitySelection {
  id: string;
  domainId: string;
  domainName: string;
  areaName: string;
  selected: boolean;
}

const AssessmentSetup: React.FC<AssessmentSetupProps> = ({ onAssessmentCreated }) => {
  const router = useRouter();
  const [stateName, setStateName] = useState('');
  const [systemName, setSystemName] = useState('');
  const [domains, setDomains] = useState<DomainSelection[]>([]);
  const [selections, setSelections] = useState<CapabilitySelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const errorHandler = useErrorHandler();

  useEffect(() => {
    loadCapabilities();
  }, []);

  const getBasePath = () => {
    if (typeof window === 'undefined') {
      return '';
    }
    const pathname = window.location.pathname;
    if (pathname.includes('/mita-state-self-assessment-tool')) {
      return '/mita-state-self-assessment-tool';
    }
    return '';
  };

  const loadCapabilities = async () => {
    try {
      setLoading(true);
      setError(null);

      const basePath = getBasePath();
      const response = await fetch(`${basePath}/content/capabilities/index.yaml`);

      if (!response.ok) {
        throw new Error(`Failed to load capabilities index: ${response.status}`);
      }

      const yamlContent = await response.text();
      const capabilitiesIndex = yaml.load(yamlContent) as CapabilitiesIndex;

      const initialDomains: DomainSelection[] = capabilitiesIndex.domains.map(domain => ({
        id: domain.id,
        name: domain.name,
        description: domain.description,
        selected: false,
        areas: domain.areas,
      }));

      setDomains(initialDomains);

      const initialSelections: CapabilitySelection[] = capabilitiesIndex.domains.flatMap(domain =>
        domain.areas.map(area => ({
          id: area.id,
          domainId: domain.id,
          domainName: domain.name,
          areaName: area.name,
          selected: false,
        }))
      );

      setSelections(initialSelections);
    } catch (err) {
      console.error('Failed to load capabilities:', err);
      setError('Failed to load capability definitions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (capabilityId: string, selected: boolean) => {
    setSelections(prev =>
      prev.map(selection =>
        selection.id === capabilityId ? { ...selection, selected } : selection
      )
    );

    if (selected && validationError) {
      setValidationError(null);
    }
  };

  const handleSelectAll = (domainId: string, selected: boolean) => {
    setSelections(prev =>
      prev.map(selection =>
        selection.domainId === domainId ? { ...selection, selected } : selection
      )
    );

    if (selected && validationError) {
      setValidationError(null);
    }
  };

  const validateSelections = (): boolean => {
    const hasSelections = selections.some(selection => selection.selected);

    if (!hasSelections) {
      setValidationError('Please select at least one capability area to proceed.');
      return false;
    }

    if (!stateName.trim()) {
      setValidationError('Please enter a state name.');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const createAssessment = async () => {
    if (!validateSelections()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      errorHandler.clearError();

      const selectedCapabilities = selections.filter(s => s.selected);
      const assessmentId = `assessment_${Date.now()}`;
      const now = new Date().toISOString();

      // Create empty ORBIT response structure for each capability
      const createEmptyOrbitResponse = (): OrbitAssessmentResponse => {
        const technologySubDomainIds: TechnologySubDomainId[] = [
          'infrastructure',
          'integration',
          'platform-services',
          'application-architecture',
          'security-identity',
          'operations-monitoring',
          'development-release',
        ];

        const technologySubDomains = technologySubDomainIds.reduce(
          (acc, id) => {
            acc[id] = {
              subDomainId: id,
              aspects: {},
              overallLevel: 0,
              notes: '',
              lastUpdated: now,
            };
            return acc;
          },
          {} as OrbitAssessmentResponse['technology']['subDomains']
        );

        return {
          outcomes: {
            dimensionId: 'outcomes',
            aspects: {},
            overallLevel: 0,
            notes: '',
            lastUpdated: now,
          },
          roles: {
            dimensionId: 'roles',
            aspects: {},
            overallLevel: 0,
            notes: '',
            lastUpdated: now,
          },
          business: {
            dimensionId: 'business',
            aspects: {},
            overallLevel: 0,
            notes: '',
            lastUpdated: now,
          },
          information: {
            dimensionId: 'information',
            aspects: {},
            overallLevel: 0,
            notes: '',
            lastUpdated: now,
          },
          technology: {
            subDomains: technologySubDomains,
            overallLevel: 0,
            notes: '',
            lastUpdated: now,
          },
        };
      };

      // Create assessment capabilities with ORBIT structure
      const assessmentCapabilities = selectedCapabilities.map(selection => ({
        id: `${selection.id}-orbit`,
        capabilityId: selection.id,
        capabilityDomainName: selection.domainName,
        capabilityAreaName: selection.areaName,
        status: 'not-started' as const,
        orbit: createEmptyOrbitResponse(),
        createdAt: now,
        updatedAt: now,
      }));

      const assessment: OrbitAssessment = {
        id: assessmentId,
        stateName: stateName.trim(),
        createdAt: now,
        updatedAt: now,
        status: 'not-started',
        capabilities: assessmentCapabilities,
        metadata: {
          assessmentVersion: '4.0',
          orbitModelVersion: '4.0',
          systemName: systemName.trim() || undefined,
        },
      };

      const success = await enhancedStorageService.saveAssessment(
        assessment as unknown as Parameters<typeof enhancedStorageService.saveAssessment>[0]
      );

      if (!success) {
        throw new Error('Failed to save assessment: Storage operation returned false');
      }

      if (onAssessmentCreated) {
        onAssessmentCreated(assessmentId);
      } else {
        router.push(`/assessment/${assessmentId}`);
      }
    } catch (err) {
      console.error('Failed to create assessment:', err);
      errorHandler.setError(err as Error, {
        operation: 'createAssessment',
        stateName,
        systemName,
        selectedCapabilities: selections.filter(s => s.selected).length,
        timestamp: new Date().toISOString(),
      });
      setError('Failed to create assessment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getSelectionCount = (domainId?: string) => {
    if (domainId) {
      return selections.filter(s => s.domainId === domainId && s.selected).length;
    }
    return selections.filter(s => s.selected).length;
  };

  const isDomainFullySelected = (domainId: string) => {
    const domainSelections = selections.filter(s => s.domainId === domainId);
    return domainSelections.length > 0 && domainSelections.every(s => s.selected);
  };

  const toggleDomainExpansion = (domainId: string) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domainId)) {
        newSet.delete(domainId);
      } else {
        newSet.add(domainId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="ds-base">
        <div className="ds-l-container ds-u-padding-y--4">
          <div className="ds-u-text-align--center">
            <div className="ds-c-spinner" aria-valuetext="Loading capabilities..." />
            <p className="ds-u-margin-top--2">Loading capability definitions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AssessmentErrorBoundary onRetry={() => window.location.reload()}>
      <div className="ds-base">
        <div className="ds-l-container ds-u-padding-y--4">
          <main role="main" className="ds-l-row ds-u-justify-content--center">
            <div className="ds-l-col--12">
              <header className="ds-u-margin-bottom--6">
                <h1 className="ds-display--1 ds-u-margin-bottom--3 ds-u-color--primary">
                  Assessment Setup
                </h1>
                <p className="ds-text--lead">
                  Choose the capability domains and specific areas you want to assess. Each domain
                  contains related capability areas that address different aspects of your Medicaid
                  system.
                </p>
              </header>

              {/* Show storage error handler if there's a storage error */}
              {errorHandler.isStorageError && errorHandler.error && (
                <StorageErrorHandler
                  error={errorHandler.error.originalError}
                  onRetry={() => errorHandler.retry(createAssessment)}
                  onContinueOffline={() => {
                    errorHandler.clearError();
                    setError(null);
                  }}
                  className="ds-u-margin-bottom--4"
                />
              )}

              {/* Show general error message if not a storage error */}
              {error && !errorHandler.isStorageError && (
                <div className="ds-c-alert ds-c-alert--error ds-u-margin-bottom--4">
                  <div className="ds-c-alert__body">
                    <h2 className="ds-c-alert__heading">Error</h2>
                    <p className="ds-c-alert__text">{error}</p>
                  </div>
                </div>
              )}

              {validationError && (
                <div className="ds-c-alert ds-c-alert--warn ds-u-margin-bottom--4">
                  <div className="ds-c-alert__body">
                    <h2 className="ds-c-alert__heading">Validation Error</h2>
                    <p className="ds-c-alert__text">{validationError}</p>
                  </div>
                </div>
              )}

              <form
                onSubmit={e => {
                  e.preventDefault();
                  createAssessment();
                }}
              >
                <div className="ds-l-row ds-u-margin-bottom--6">
                  <div className="ds-l-col--12 ds-l-md-col--6">
                    <div className="ds-c-field">
                      <label htmlFor="state-name" className="ds-c-label">
                        State Name <span className="ds-u-color--error">*</span>
                      </label>
                      <input
                        type="text"
                        id="state-name"
                        name="state-name"
                        className="ds-c-field"
                        value={stateName}
                        onChange={e => setStateName(e.target.value)}
                        required
                        aria-describedby="state-name-hint"
                      />
                      <div id="state-name-hint" className="ds-c-field__hint">
                        Enter the name of your state for this assessment.
                      </div>
                    </div>
                  </div>
                  <div className="ds-l-col--12 ds-l-md-col--6">
                    <div className="ds-c-field">
                      <label htmlFor="system-name" className="ds-c-label">
                        System Name
                      </label>
                      <input
                        type="text"
                        id="system-name"
                        name="system-name"
                        className="ds-c-field"
                        value={systemName}
                        onChange={e => setSystemName(e.target.value)}
                        aria-describedby="system-name-hint"
                      />
                      <div id="system-name-hint" className="ds-c-field__hint">
                        Enter your unique system name if applicable.
                      </div>
                    </div>
                  </div>
                </div>

                <fieldset className="ds-c-fieldset ds-u-margin-bottom--6">
                  <legend className="ds-c-label">
                    Domain and Capability Selection <span className="ds-u-color--error">*</span>
                  </legend>
                  <div className="ds-c-field__hint ds-u-margin-bottom--4">
                    Select the capability domains and areas you want to assess. You must select at
                    least one area to proceed.
                  </div>

                  <div className="ds-c-alert ds-c-alert--lightweight ds-u-margin-bottom--4">
                    <div className="ds-c-alert__body">
                      <p className="ds-c-alert__text">
                        <strong>
                          {getSelectionCount()} capability area
                          {getSelectionCount() !== 1 ? 's' : ''} selected
                        </strong>{' '}
                        for assessment
                      </p>
                    </div>
                  </div>

                  <div className={styles.capabilityDomains}>
                    {domains.map(domain => (
                      <div key={domain.id} className="ds-u-margin-bottom--4">
                        <div
                          className={`ds-c-card ${styles.domainCard} ${
                            domain.areas.length === 0 ? styles.domainCardDisabled : ''
                          } ${getSelectionCount(domain.id) > 0 ? styles.domainCardSelected : ''}`}
                        >
                          <div className={styles.domainHeader}>
                            <button
                              type="button"
                              className={styles.domainToggle}
                              onClick={() => toggleDomainExpansion(domain.id)}
                              aria-expanded={expandedDomains.has(domain.id)}
                            >
                              <div className={styles.domainTitle}>
                                <h3 className="ds-h4 ds-u-margin--0 ds-u-color--primary">
                                  <span className={styles.expandIcon}>
                                    {expandedDomains.has(domain.id) ? '▼' : '▶'}
                                  </span>
                                  {domain.name}
                                </h3>
                                <div className="ds-u-margin-top--1">
                                  {domain.areas.length > 0 ? (
                                    <>
                                      <span className="ds-text--small ds-u-color--muted">
                                        {domain.areas.length} capability area
                                        {domain.areas.length !== 1 ? 's' : ''}
                                      </span>
                                      {getSelectionCount(domain.id) > 0 && (
                                        <span
                                          className={`ds-text--small ds-u-margin-left--2 ${styles.selectionCount}`}
                                        >
                                          • {getSelectionCount(domain.id)} selected
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="ds-text--small ds-u-color--muted">
                                      Coming in future release
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                            <div className={styles.domainActions}>
                              {domain.areas.length > 0 && expandedDomains.has(domain.id) && (
                                <button
                                  type="button"
                                  className="ds-c-button ds-c-button--transparent ds-c-button--small"
                                  onClick={() =>
                                    handleSelectAll(domain.id, !isDomainFullySelected(domain.id))
                                  }
                                >
                                  {isDomainFullySelected(domain.id) ? 'Deselect All' : 'Select All'}
                                </button>
                              )}
                            </div>
                          </div>

                          {domain.areas.length > 0 && expandedDomains.has(domain.id) && (
                            <div className="ds-u-margin-top--3 ds-u-padding-top--3 ds-u-border-top--1">
                              <div className={styles.areasGrid}>
                                {domain.areas.map(area => {
                                  const selection = selections.find(s => s.id === area.id);
                                  return (
                                    <div key={area.id} className={styles.areaOption}>
                                      <label
                                        htmlFor={`capability-${area.id}`}
                                        className={`${styles.areaCard} ${
                                          selection?.selected ? styles.areaCardSelected : ''
                                        }`}
                                      >
                                        <div className={styles.areaCardHeader}>
                                          <input
                                            type="checkbox"
                                            id={`capability-${area.id}`}
                                            name="capabilities"
                                            value={area.id}
                                            className={styles.areaCheckbox}
                                            checked={selection?.selected || false}
                                            onChange={e =>
                                              handleSelectionChange(area.id, e.target.checked)
                                            }
                                          />
                                          <div className={styles.areaContent}>
                                            <h4 className={styles.areaTitle}>{area.name}</h4>
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>

                <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
                  <button
                    type="button"
                    className="ds-c-button ds-c-button--transparent"
                    onClick={() => router.push('/dashboard')}
                    disabled={saving}
                  >
                    ← Back to Dashboard
                  </button>

                  <button
                    type="submit"
                    className="ds-c-button ds-c-button--primary"
                    disabled={saving || getSelectionCount() === 0 || !stateName.trim()}
                  >
                    {saving ? (
                      <>
                        <span className="ds-c-spinner ds-c-spinner--small ds-u-margin-right--1" />
                        Creating Assessment...
                      </>
                    ) : (
                      'Create Assessment'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </AssessmentErrorBoundary>
  );
};

export default AssessmentSetup;
