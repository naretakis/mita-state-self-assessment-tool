import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { ContentService } from '../../services/ContentService';
import enhancedStorageService from '../../services/EnhancedStorageService';

import type { CapabilityDefinition, Assessment, CapabilityAreaAssessment } from '../../types';

interface AssessmentSetupProps {
  onAssessmentCreated?: (assessmentId: string) => void;
}

interface DomainSelection {
  name: string;
  selected: boolean;
  areas: CapabilityDefinition[];
}

interface CapabilitySelection {
  id: string;
  domainName: string;
  areaName: string;
  selected: boolean;
}

const AssessmentSetup: React.FC<AssessmentSetupProps> = ({ onAssessmentCreated }) => {
  const router = useRouter();
  const [stateName, setStateName] = useState('');
  const [capabilities, setCapabilities] = useState<CapabilityDefinition[]>([]);
  const [domains, setDomains] = useState<DomainSelection[]>([]);
  const [selections, setSelections] = useState<CapabilitySelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    loadCapabilities();
  }, []);

  const loadCapabilities = async () => {
    try {
      setLoading(true);
      setError(null);

      const contentService = new ContentService('/content');
      await contentService.initialize();
      const loadedCapabilities = contentService.getAllCapabilities();

      setCapabilities(loadedCapabilities);

      const groupedCapabilities = loadedCapabilities.reduce(
        (groups, capability) => {
          const domain = capability.capabilityDomainName;
          if (!groups[domain]) {
            groups[domain] = [];
          }
          groups[domain].push(capability);
          return groups;
        },
        {} as Record<string, CapabilityDefinition[]>
      );

      const initialDomains: DomainSelection[] = [
        ...Object.entries(groupedCapabilities).map(([name, areas]) => ({
          name,
          selected: false,
          areas,
        })),
        { name: 'Claims Management', selected: false, areas: [] },
        { name: 'Care Management', selected: false, areas: [] },
        { name: 'Financial Management', selected: false, areas: [] },
      ];

      setDomains(initialDomains);

      const initialSelections: CapabilitySelection[] = loadedCapabilities.map(cap => ({
        id: cap.id,
        domainName: cap.capabilityDomainName,
        areaName: cap.capabilityAreaName,
        selected: false,
      }));

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

  const handleSelectAll = (domainName: string, selected: boolean) => {
    setSelections(prev =>
      prev.map(selection =>
        selection.domainName === domainName ? { ...selection, selected } : selection
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

      const selectedCapabilities = selections.filter(s => s.selected);
      const assessmentId = `assessment_${Date.now()}`;
      const now = new Date().toISOString();

      const capabilityAssessments: CapabilityAreaAssessment[] = selectedCapabilities.map(
        selection => {
          const capability = capabilities.find(cap => cap.id === selection.id);
          if (!capability) {
            throw new Error(`Capability not found: ${selection.id}`);
          }

          return {
            id: capability.id,
            capabilityDomainName: capability.capabilityDomainName,
            capabilityAreaName: capability.capabilityAreaName,
            status: 'not-started' as const,
            dimensions: {
              outcome: {
                maturityLevel: 0,
                evidence: '',
                barriers: '',
                plans: '',
                notes: '',
                lastUpdated: now,
              },
              role: {
                maturityLevel: 0,
                evidence: '',
                barriers: '',
                plans: '',
                notes: '',
                lastUpdated: now,
              },
              businessProcess: {
                maturityLevel: 0,
                evidence: '',
                barriers: '',
                plans: '',
                notes: '',
                lastUpdated: now,
              },
              information: {
                maturityLevel: 0,
                evidence: '',
                barriers: '',
                plans: '',
                notes: '',
                lastUpdated: now,
              },
              technology: {
                maturityLevel: 0,
                evidence: '',
                barriers: '',
                plans: '',
                notes: '',
                lastUpdated: now,
              },
            },
          };
        }
      );

      const assessment: Assessment = {
        id: assessmentId,
        stateName: stateName.trim(),
        createdAt: now,
        updatedAt: now,
        status: 'not-started',
        capabilities: capabilityAssessments,
        metadata: {
          assessmentVersion: '1.0',
          notes: '',
        },
      };

      const success = await enhancedStorageService.saveAssessment(assessment);

      if (!success) {
        throw new Error('Failed to save assessment');
      }

      if (onAssessmentCreated) {
        onAssessmentCreated(assessmentId);
      } else {
        router.push(`/assessment/${assessmentId}`);
      }
    } catch (err) {
      console.error('Failed to create assessment:', err);
      setError('Failed to create assessment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getSelectionCount = (domainName?: string) => {
    if (domainName) {
      return selections.filter(s => s.domainName === domainName && s.selected).length;
    }
    return selections.filter(s => s.selected).length;
  };

  const isDomainFullySelected = (domainName: string) => {
    const domainSelections = selections.filter(s => s.domainName === domainName);
    return domainSelections.length > 0 && domainSelections.every(s => s.selected);
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
    <div className="ds-base">
      <div className="ds-l-container ds-u-padding-y--4">
        <main role="main" className="ds-l-row ds-u-justify-content--center">
          <div className="ds-l-col--12">
            <header className="ds-u-margin-bottom--6">
              <h1 className="ds-display--1 ds-u-margin-bottom--3 ds-u-color--primary">
                Assessment Setup
              </h1>
              <p className="ds-text--lead">
                Select the capability domains and areas you want to include in your MITA assessment.
              </p>
            </header>

            {error && (
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
              <div className="ds-c-field ds-u-margin-bottom--6">
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

              <fieldset className="ds-c-fieldset ds-u-margin-bottom--6">
                <legend className="ds-c-label">
                  Capability Selection <span className="ds-u-color--error">*</span>
                </legend>
                <div className="ds-c-field__hint ds-u-margin-bottom--3">
                  Select the capability areas you want to assess. You must select at least one area.
                  {getSelectionCount() > 0 && (
                    <span className="ds-u-display--block ds-u-margin-top--1 ds-u-font-weight--bold ds-u-color--success">
                      {getSelectionCount()} area{getSelectionCount() !== 1 ? 's' : ''} selected
                    </span>
                  )}
                </div>

                <div className="ds-l-row">
                  {domains.map(domain => (
                    <div
                      key={domain.name}
                      className="ds-l-col--12 ds-l-md-col--6 ds-u-margin-bottom--4"
                    >
                      <div className="ds-u-border--3 ds-u-border-color--primary-light ds-u-border-radius ds-u-padding--4 ds-u-bg--primary-lightest ds-u-height--full ds-u-shadow--2">
                        <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--flex-start ds-u-margin-bottom--3">
                          <div>
                            <h3 className="ds-h4 ds-u-margin--0 ds-u-margin-bottom--1 ds-u-font-weight--bold ds-u-color--primary">
                              {domain.name}
                            </h3>
                            {domain.areas.length > 0 ? (
                              <span className="ds-u-font-size--sm ds-u-color--muted">
                                {domain.areas.length} area{domain.areas.length !== 1 ? 's' : ''}{' '}
                                available
                              </span>
                            ) : (
                              <span className="ds-u-font-size--sm ds-u-color--muted">
                                Coming in future release
                              </span>
                            )}
                          </div>
                          {domain.areas.length > 0 ? (
                            <span className="ds-c-badge ds-c-badge--success">Available</span>
                          ) : (
                            <span className="ds-c-badge ds-c-badge--info">Coming Soon</span>
                          )}
                        </div>

                        {domain.areas.length > 0 ? (
                          <>
                            <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center ds-u-margin-bottom--3 ds-u-padding-top--2 ds-u-border-top--1 ds-u-border-color--gray-lighter">
                              <span className="ds-u-font-size--sm ds-u-font-weight--semibold">
                                {getSelectionCount(domain.name)} of {domain.areas.length} selected
                              </span>
                              <button
                                type="button"
                                className="ds-c-button ds-c-button--outline ds-c-button--small"
                                onClick={() =>
                                  handleSelectAll(domain.name, !isDomainFullySelected(domain.name))
                                }
                              >
                                {isDomainFullySelected(domain.name) ? 'Deselect All' : 'Select All'}
                              </button>
                            </div>
                            <div className="ds-u-margin-left--1">
                              {domain.areas.map(capability => {
                                const selection = selections.find(s => s.id === capability.id);
                                return (
                                  <div key={capability.id} className="ds-u-margin-bottom--3">
                                    <label
                                      htmlFor={`capability-${capability.id}`}
                                      className="ds-u-cursor--pointer ds-u-display--block"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`capability-${capability.id}`}
                                        name="capabilities"
                                        value={capability.id}
                                        className="ds-u-display--inline-block ds-u-vertical-align--top ds-u-margin-right--2"
                                        checked={selection?.selected || false}
                                        onChange={e =>
                                          handleSelectionChange(capability.id, e.target.checked)
                                        }
                                      />
                                      <div
                                        className="ds-u-display--inline-block ds-u-width--auto"
                                        style={{ width: 'calc(100% - 24px)' }}
                                      >
                                        <span className="ds-u-font-weight--semibold ds-u-display--block">
                                          {capability.capabilityAreaName}
                                        </span>
                                        {capability.description && (
                                          <span className="ds-u-display--block ds-u-font-size--sm ds-u-color--muted ds-u-margin-top--1">
                                            {capability.description.substring(0, 120)}
                                            {capability.description.length > 120 ? '...' : ''}
                                          </span>
                                        )}
                                      </div>
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="ds-u-padding-top--2 ds-u-border-top--1 ds-u-border-color--gray-lighter">
                            <p className="ds-u-color--muted ds-u-font-size--sm ds-u-margin--0 ds-u-text-align--center">
                              Capability areas will be available in future releases.
                            </p>
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
  );
};

export default AssessmentSetup;
