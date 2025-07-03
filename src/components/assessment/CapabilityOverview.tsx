import React from 'react';

import type { CapabilityAreaAssessment, CapabilityDefinition } from '../../types';

interface CapabilityOverviewProps {
  capability: CapabilityAreaAssessment;
  definition: CapabilityDefinition;
  onNext: () => void;
  onPrevious?: () => void;
}

const CapabilityOverview: React.FC<CapabilityOverviewProps> = ({
  capability: _capability,
  definition,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="ds-l-row ds-u-justify-content--center">
      <div className="ds-l-col--12 ds-l-lg-col--10">
        <header className="ds-u-margin-bottom--6">
          <div className="ds-u-margin-bottom--2">
            <span className="ds-c-badge ds-c-badge--info">
              {definition.capabilityDomainName} Domain
            </span>
          </div>
          <h1 className="ds-display--1 ds-u-margin-bottom--3 ds-u-color--primary">
            {definition.capabilityAreaName}
          </h1>
          <p className="ds-text--lead ds-u-measure--wide">{definition.description}</p>
        </header>

        <div className="ds-c-card ds-u-margin-bottom--6">
          <div className="ds-c-card__body">
            <h2 className="ds-h3 ds-u-margin-bottom--3">Assessment Overview</h2>
            <p className="ds-u-margin-bottom--4">
              You will assess this capability area across five ORBIT dimensions. Each dimension
              represents a different aspect of your system's maturity:
            </p>

            <div className="ds-l-row">
              <div className="ds-l-col--12 ds-l-md-col--6">
                <ul className="ds-c-list ds-c-list--bare">
                  <li className="ds-u-margin-bottom--2">
                    <strong className="ds-u-color--primary">Outcomes:</strong> Business results and
                    objectives
                  </li>
                  <li className="ds-u-margin-bottom--2">
                    <strong className="ds-u-color--primary">Roles:</strong> Who performs functions
                    and responsibilities
                  </li>
                  <li className="ds-u-margin-bottom--2">
                    <strong className="ds-u-color--primary">Business Processes:</strong> Workflows
                    and procedures
                  </li>
                </ul>
              </div>
              <div className="ds-l-col--12 ds-l-md-col--6">
                <ul className="ds-c-list ds-c-list--bare">
                  <li className="ds-u-margin-bottom--2">
                    <strong className="ds-u-color--primary">Information:</strong> Data structure and
                    sharing
                  </li>
                  <li className="ds-u-margin-bottom--2">
                    <strong className="ds-u-color--primary">Technology:</strong> Technical
                    implementation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="ds-c-card ds-u-margin-bottom--6">
          <div className="ds-c-card__body">
            <h2 className="ds-h3 ds-u-margin-bottom--3">Maturity Levels</h2>
            <p className="ds-u-margin-bottom--4">
              For each dimension, you'll select a maturity level from 1 to 5:
            </p>

            <div className="ds-l-row">
              <div className="ds-l-col--12">
                <dl className="ds-c-list ds-c-list--bare">
                  <div className="ds-u-margin-bottom--2">
                    <dt className="ds-u-font-weight--bold ds-u-color--primary">
                      Level 1 - Initial:
                    </dt>
                    <dd>Ad hoc processes with limited documentation</dd>
                  </div>
                  <div className="ds-u-margin-bottom--2">
                    <dt className="ds-u-font-weight--bold ds-u-color--primary">
                      Level 2 - Repeatable:
                    </dt>
                    <dd>Basic processes with some documentation and consistency</dd>
                  </div>
                  <div className="ds-u-margin-bottom--2">
                    <dt className="ds-u-font-weight--bold ds-u-color--primary">
                      Level 3 - Defined:
                    </dt>
                    <dd>Documented and standardized processes</dd>
                  </div>
                  <div className="ds-u-margin-bottom--2">
                    <dt className="ds-u-font-weight--bold ds-u-color--primary">
                      Level 4 - Managed:
                    </dt>
                    <dd>Measured and controlled processes with metrics</dd>
                  </div>
                  <div className="ds-u-margin-bottom--2">
                    <dt className="ds-u-font-weight--bold ds-u-color--primary">
                      Level 5 - Optimized:
                    </dt>
                    <dd>Continuously improving processes with innovation</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="ds-c-alert ds-c-alert--lightweight ds-u-margin-bottom--6">
          <div className="ds-c-alert__body">
            <h3 className="ds-c-alert__heading">Assessment Tips</h3>
            <ul className="ds-c-alert__text ds-c-list">
              <li>Be honest in your assessment - this helps identify improvement opportunities</li>
              <li>Provide specific evidence to support your maturity level selections</li>
              <li>Document barriers and challenges you face</li>
              <li>Include advancement plans for areas needing improvement</li>
              <li>Your responses are automatically saved every 30 seconds</li>
            </ul>
          </div>
        </div>

        <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
          {onPrevious ? (
            <button
              type="button"
              className="ds-c-button ds-c-button--transparent"
              onClick={onPrevious}
            >
              ← Previous
            </button>
          ) : (
            <div />
          )}

          <button type="button" className="ds-c-button ds-c-button--primary" onClick={onNext}>
            Begin Assessment →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CapabilityOverview;
