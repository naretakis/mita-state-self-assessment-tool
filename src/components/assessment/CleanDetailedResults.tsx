/**
 * Clean Detailed Results Component
 * Improved layout without inline styles, following UX best practices
 */

import { useState } from 'react';

import type { EnhancedMaturityScore } from '../../services/ScoringService';
import type { Assessment } from '../../types';

interface CleanDetailedResultsProps {
  assessment: Assessment;
  scores: EnhancedMaturityScore[];
}

export function CleanDetailedResults({ assessment, scores }: CleanDetailedResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (capabilityId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(capabilityId)) {
        newSet.delete(capabilityId);
      } else {
        newSet.add(capabilityId);
      }
      return newSet;
    });
  };

  if (scores.length === 0) {
    return (
      <div className="ds-c-alert ds-c-alert--warn">
        <div className="ds-c-alert__body">
          <h3 className="ds-c-alert__heading">Assessment Not Started</h3>
          <p className="ds-c-alert__text">
            This assessment has {assessment?.capabilities?.length || 0} capability areas selected,
            but no maturity levels have been set yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-u-margin-bottom--2">
      <h2 className="ds-h2 ds-u-margin-bottom--2 ds-u-color--base">Detailed Results</h2>

      {scores.map((score, index) => {
        const capability = assessment?.capabilities.find(
          cap => cap.capabilityAreaName === score.capabilityArea
        );
        const capabilityId = capability?.id || `capability-${index}`;
        const isExpanded = expandedSections.has(capabilityId);

        return (
          <div
            key={capabilityId}
            className="ds-u-border--1 ds-u-border-radius--sm ds-u-margin-bottom--1"
            style={{ backgroundColor: 'transparent' }}
          >
            <button
              type="button"
              className="ds-u-width--full ds-u-border--0 ds-u-text-align--left ds-u-cursor--pointer ds-u-padding--1 ds-u-bg-color--transparent"
              onClick={() => toggleSection(capabilityId)}
              aria-expanded={isExpanded}
              aria-controls={`details-${capabilityId}`}
              style={{
                borderRadius: '4px 4px 0 0',
                transition: 'background-color 0.2s ease',
                minHeight: '48px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-gray-lightest, #f8f9fa)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
                <div className="ds-u-flex--1">
                  <div className="ds-text ds-u-margin-bottom--0 ds-u-color--base ds-u-font-weight--bold">
                    {score.capabilityArea}
                  </div>
                  <div className="ds-text--small ds-u-margin-bottom--0 ds-u-color--muted">
                    {score.domain}
                  </div>
                </div>
                <div className="ds-u-display--flex ds-u-align-items--center ds-u-margin-left--2">
                  <div className="ds-u-text-align--right ds-u-margin-right--1">
                    <div className="ds-text--lead ds-u-color--primary ds-u-margin-bottom--0 ds-u-font-weight--bold">
                      {score.overallScore.toFixed(2)}
                    </div>
                    <div className="ds-text--small ds-u-color--muted">out of 5.0</div>
                  </div>
                  <span
                    className="ds-u-color--base ds-u-font-weight--bold ds-u-font-size--sm"
                    style={{ fontSize: '12px', minWidth: '16px', textAlign: 'center' }}
                  >
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </div>
            </button>

            {isExpanded && (
              <div id={`details-${capabilityId}`} className="ds-u-padding--2 ds-u-border-top--1">
                {/* Score Breakdown */}
                <div className="ds-u-margin-bottom--2">
                  <h4 className="ds-h5 ds-u-margin-bottom--1 ds-u-color--base">Score Breakdown</h4>
                  <div
                    className="ds-u-padding--1 ds-u-border-radius--sm ds-u-border--1"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div className="ds-u-display--flex ds-u-justify-content--between ds-u-margin-bottom--0">
                      <span className="ds-text--small ds-u-color--base">
                        Average Maturity Level:
                      </span>
                      <strong className="ds-text--small ds-u-color--base">
                        {score.baseScore.toFixed(1)}
                      </strong>
                    </div>
                    <div className="ds-u-display--flex ds-u-justify-content--between ds-u-margin-bottom--0">
                      <span className="ds-text--small ds-u-color--base">Checkbox Bonus:</span>
                      <strong
                        className={`ds-text--small ${score.partialCredit > 0 ? 'ds-u-color--success' : 'ds-u-color--base'}`}
                      >
                        +{score.partialCredit.toFixed(2)}
                      </strong>
                    </div>
                    <div className="ds-u-display--flex ds-u-justify-content--between ds-u-border-top--1 ds-u-padding-top--1 ds-u-margin-top--1">
                      <span className="ds-text--small ds-u-color--base">
                        <strong>Overall Score:</strong>
                      </span>
                      <strong className="ds-u-color--primary ds-text--small">
                        {score.overallScore.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* ORBIT Dimension Scores */}
                <div className="ds-u-margin-bottom--2">
                  <h4 className="ds-h5 ds-u-margin-bottom--1 ds-u-color--base">
                    ORBIT Dimension Scores
                  </h4>
                  <div className="ds-l-row">
                    {Object.entries(score.dimensionScores).map(([dimension, dimScore]) => {
                      const dimensionLabels = {
                        outcome: 'Outcomes',
                        role: 'Roles',
                        businessProcess: 'Business Process',
                        information: 'Information',
                        technology: 'Technology',
                      };

                      return (
                        <div
                          key={dimension}
                          className="ds-l-col--12 ds-l-md-col--6 ds-l-lg-col--4 ds-u-margin-bottom--1"
                        >
                          <div
                            className="ds-u-padding--1 ds-u-border--1 ds-u-border-radius--sm"
                            style={{ minHeight: '60px', backgroundColor: 'transparent' }}
                          >
                            <h5 className="ds-text--small ds-u-margin-bottom--0 ds-u-font-weight--bold ds-u-color--base">
                              {dimensionLabels[dimension as keyof typeof dimensionLabels]}
                            </h5>
                            <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
                              <div className="ds-text ds-u-font-weight--bold ds-u-color--success">
                                {dimScore.finalScore.toFixed(2)}
                              </div>
                              <div className="ds-u-text-align--right">
                                {dimScore.partialCredit > 0 && (
                                  <div className="ds-text--small ds-u-color--muted">
                                    L{dimScore.maturityLevel} +{dimScore.partialCredit.toFixed(2)}
                                  </div>
                                )}
                                {dimScore.checkboxCompletion.total > 0 && (
                                  <div className="ds-text--small ds-u-color--muted">
                                    {dimScore.checkboxCompletion.completed}/
                                    {dimScore.checkboxCompletion.total}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assessment Details */}
                {capability && (
                  <div>
                    <h4 className="ds-h5 ds-u-margin-bottom--1 ds-u-color--base">
                      Assessment Details
                    </h4>
                    {Object.entries(capability.dimensions).map(([dimension, dimData]) => {
                      const dimensionLabels = {
                        outcome: 'Outcomes',
                        role: 'Roles',
                        businessProcess: 'Business Process',
                        information: 'Information',
                        technology: 'Technology',
                      };

                      const hasContent =
                        dimData.evidence || dimData.barriers || dimData.plans || dimData.notes;

                      if (!hasContent) {
                        return null;
                      }

                      return (
                        <div key={dimension} className="ds-u-margin-bottom--1">
                          <h5 className="ds-text--small ds-u-margin-bottom--0 ds-u-color--primary ds-u-font-weight--bold">
                            {dimensionLabels[dimension as keyof typeof dimensionLabels]}
                          </h5>

                          <div
                            className="ds-u-padding--1 ds-u-border-left--3 ds-u-border-color--primary-light ds-u-border-radius--sm"
                            style={{ backgroundColor: 'transparent' }}
                          >
                            {dimData.evidence && (
                              <div className="ds-u-margin-bottom--1">
                                <strong className="ds-text--small ds-u-display--block ds-u-margin-bottom--0 ds-u-color--base">
                                  Supporting Attestation:
                                </strong>
                                <p className="ds-text--small ds-u-margin--0 ds-u-color--muted">
                                  {dimData.evidence}
                                </p>
                              </div>
                            )}

                            {dimData.barriers && (
                              <div className="ds-u-margin-bottom--1">
                                <strong className="ds-text--small ds-u-display--block ds-u-margin-bottom--0 ds-u-color--base">
                                  Barriers and Challenges:
                                </strong>
                                <p className="ds-text--small ds-u-margin--0 ds-u-color--muted">
                                  {dimData.barriers}
                                </p>
                              </div>
                            )}

                            {dimData.plans && (
                              <div className="ds-u-margin-bottom--1">
                                <strong className="ds-text--small ds-u-display--block ds-u-margin-bottom--0 ds-u-color--base">
                                  Outcomes-Based Advancement Plans:
                                </strong>
                                <p className="ds-text--small ds-u-margin--0 ds-u-color--muted">
                                  {dimData.plans}
                                </p>
                              </div>
                            )}

                            {dimData.notes && (
                              <div>
                                <strong className="ds-text--small ds-u-display--block ds-u-margin-bottom--0 ds-u-color--base">
                                  Additional Notes:
                                </strong>
                                <p className="ds-text--small ds-u-margin--0 ds-u-color--muted">
                                  {dimData.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
