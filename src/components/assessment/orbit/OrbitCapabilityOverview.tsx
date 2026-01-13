/**
 * OrbitCapabilityOverview Component
 *
 * Displays a generic overview page before starting ORBIT dimension assessments.
 * Content is universal across all capabilities since ORBIT maturity criteria
 * are standardized.
 *
 * Includes:
 * - Brief MITA 4.0 overview
 * - Getting Started Tips
 * - Materials You May Need
 * - Maturity Level definitions
 */

import React from 'react';

interface OrbitCapabilityOverviewProps {
  onNext: () => void;
  onPrevious?: () => void;
}

const OrbitCapabilityOverview: React.FC<OrbitCapabilityOverviewProps> = ({
  onNext,
  onPrevious,
}) => {
  return (
    <div className="orbit-capability-overview">
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 1rem', fontSize: '2rem', fontWeight: 600 }}>
          MITA 4.0 Maturity Assessment
        </h1>
        <p style={{ margin: 0, fontSize: '1.125rem', color: '#5c5c5c', lineHeight: 1.6 }}>
          Welcome to the MITA 4.0 State Self-Assessment Tool. This assessment uses the standardized
          ORBIT framework to evaluate your organization&apos;s maturity across multiple dimensions.
        </p>
      </header>

      {/* MITA 4.0 Overview */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          About the Assessment
        </h2>
        <p style={{ marginBottom: '1rem', color: '#333', lineHeight: 1.6 }}>
          The MITA Maturity Model provides State Medicaid Agencies with a framework to
          systematically assess, benchmark, and improve processes, capabilities, architecture, and
          performance. It offers a clear path to assess maturity, target specific areas for
          improvement, and achieve greater efficiency and effectiveness in delivery of Medicaid
          Program services.
        </p>
        <p style={{ marginBottom: '0', color: '#333', lineHeight: 1.6 }}>
          You will assess each capability using the <strong>ORBIT framework</strong>: Outcomes,
          Roles, Business Architecture, Information & Data, and Technology. Each dimension is
          evaluated on a 1-5 maturity scale with standardized criteria.
        </p>
      </section>

      {/* Getting Started Tips */}
      <div
        className="ds-c-alert ds-c-alert--lightweight"
        style={{ marginBottom: '1.5rem' }}
        role="region"
        aria-label="Getting started tips"
      >
        <div className="ds-c-alert__body">
          <h3 className="ds-c-alert__heading">Getting Started Tips</h3>
          <ul className="ds-c-list" style={{ marginBottom: '1.5rem' }}>
            <li>
              Attest with an honest assessment - select the maturity level that best aligns with
              your knowledge
            </li>
            <li>Provide written details that support your maturity level selections</li>
            <li>Document barriers and challenges you face</li>
            <li>Include advancement plans for areas needing improvement</li>
            <li>Your responses are automatically saved as you proceed through the tool</li>
          </ul>

          <h4 className="ds-c-alert__heading">Materials You May Need</h4>
          <ul className="ds-c-list" style={{ marginBottom: 0 }}>
            <li>Subject matter experts who know the business areas</li>
            <li>Standard operating procedures</li>
            <li>Policy and technical manuals</li>
            <li>SLA documentation</li>
            <li>Links (URLs) to internal and external resources</li>
            <li>Workflow and system diagrams</li>
            <li>Prior MITA State Self-Assessments</li>
          </ul>
        </div>
      </div>

      {/* Maturity Levels */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Maturity Levels
        </h2>
        <p style={{ marginBottom: '1rem', color: '#5c5c5c' }}>
          Each aspect is assessed on a 1-5 maturity scale:
        </p>

        <div
          style={{
            border: '1px solid #d6d7d9',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          {[
            {
              level: 1,
              name: 'Initial',
              description:
                'Processes are unstructured, reactive, and inconsistent. Current state seeks to adopt enterprise-wide planning and architectural frameworks.',
            },
            {
              level: 2,
              name: 'Developing',
              description:
                'Basic processes and systems exist but are not fully standardized or documented. Beginning to adopt industry-recognized frameworks.',
            },
            {
              level: 3,
              name: 'Defined',
              description:
                'Processes, systems, and strategies are standardized, well-documented, and aligned across the organization.',
            },
            {
              level: 4,
              name: 'Managed',
              description:
                'Processes are fully operational, consistent, and well executed. Organization actively monitors and analyzes metrics for improvements.',
            },
            {
              level: 5,
              name: 'Optimized',
              description:
                'Advanced, data-driven strategies drive enterprise optimization. Institutionalized innovation supports adaptability and continuous improvement.',
            },
          ].map(({ level, name, description }, index) => (
            <div
              key={level}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                borderBottom: index < 4 ? '1px solid #d6d7d9' : 'none',
                backgroundColor: index % 2 === 0 ? '#fff' : '#f8f8f8',
              }}
            >
              <span
                style={{
                  minWidth: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: '#0071bc',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  flexShrink: 0,
                }}
              >
                {level}
              </span>
              <div>
                <strong style={{ fontSize: '1rem' }}>
                  Level {level}: {name}
                </strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#5c5c5c' }}>
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: '#5c5c5c',
            fontStyle: 'italic',
          }}
        >
          You may also select &quot;Not Applicable&quot; if a maturity criterion does not apply to
          your business operations.
        </p>
      </section>

      {/* Navigation */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid #d6d7d9',
        }}
        aria-label="Assessment navigation"
      >
        {onPrevious ? (
          <button
            type="button"
            onClick={onPrevious}
            className="ds-c-button ds-c-button--transparent"
          >
            ← Previous
          </button>
        ) : (
          <div />
        )}
        <button type="button" onClick={onNext} className="ds-c-button ds-c-button--primary">
          Begin Assessment →
        </button>
      </nav>
    </div>
  );
};

export default OrbitCapabilityOverview;
