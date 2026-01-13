/**
 * OrbitCapabilityOverview Component
 *
 * Displays overview information for a capability before starting
 * the ORBIT dimension assessments.
 */

import React from 'react';

import type { CapabilityMetadata, OrbitCapabilityAssessment } from '../../../types/orbit';

interface OrbitCapabilityOverviewProps {
  capability: OrbitCapabilityAssessment;
  capabilityMeta: CapabilityMetadata;
  onNext: () => void;
  onPrevious?: () => void;
}

const OrbitCapabilityOverview: React.FC<OrbitCapabilityOverviewProps> = ({
  capability,
  capabilityMeta,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="orbit-capability-overview">
      <header style={{ marginBottom: '2rem' }}>
        <div
          style={{
            fontSize: '0.875rem',
            color: '#5c5c5c',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {capabilityMeta.domainName}
        </div>
        <h1 style={{ margin: '0 0 1rem', fontSize: '2rem', fontWeight: 600 }}>
          {capabilityMeta.areaName}
        </h1>
        <p style={{ margin: 0, fontSize: '1.125rem', color: '#5c5c5c', lineHeight: 1.6 }}>
          {capabilityMeta.description}
        </p>
      </header>

      {/* ORBIT Assessment Overview */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          ORBIT Assessment Overview
        </h2>
        <p style={{ marginBottom: '1rem', color: '#5c5c5c' }}>
          You will assess this capability across five ORBIT dimensions. Each dimension evaluates
          different aspects of your organization&apos;s maturity.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Outcomes */}
          <div
            style={{
              padding: '1rem',
              border: '1px solid #d6d7d9',
              borderRadius: '4px',
              backgroundColor: '#f8f8f8',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600 }}>
              O - Outcomes
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#5c5c5c',
                  fontWeight: 400,
                  marginLeft: '0.5rem',
                }}
              >
                (Optional)
              </span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#5c5c5c' }}>
              Organizational culture, capability, quality, and alignment to goals.
            </p>
          </div>

          {/* Roles */}
          <div
            style={{
              padding: '1rem',
              border: '1px solid #d6d7d9',
              borderRadius: '4px',
              backgroundColor: '#f8f8f8',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600 }}>
              R - Roles
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#5c5c5c',
                  fontWeight: 400,
                  marginLeft: '0.5rem',
                }}
              >
                (Optional)
              </span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#5c5c5c' }}>
              Technology resources, governance, communication, and staffing capacity.
            </p>
          </div>

          {/* Business Architecture */}
          <div
            style={{
              padding: '1rem',
              border: '1px solid #0071bc',
              borderRadius: '4px',
              backgroundColor: '#e6f3ff',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600 }}>
              B - Business Architecture
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#5c5c5c' }}>
              Business processes, models, strategic planning, and policy management.
            </p>
          </div>

          {/* Information & Data */}
          <div
            style={{
              padding: '1rem',
              border: '1px solid #0071bc',
              borderRadius: '4px',
              backgroundColor: '#e6f3ff',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600 }}>
              I - Information & Data
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#5c5c5c' }}>
              Data governance, quality, integration, security, and analytics.
            </p>
          </div>

          {/* Technology */}
          <div
            style={{
              padding: '1rem',
              border: '1px solid #0071bc',
              borderRadius: '4px',
              backgroundColor: '#e6f3ff',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600 }}>
              T - Technology
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#5c5c5c' }}>
              Infrastructure, integration, platform services, security, and operations.
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            <strong>Note:</strong> Outcomes and Roles dimensions are optional. Business
            Architecture, Information & Data, and Technology are required for a complete assessment.
          </p>
        </div>
      </section>

      {/* Maturity Levels */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Maturity Levels
        </h2>
        <p style={{ marginBottom: '1rem', color: '#5c5c5c' }}>
          Each aspect within a dimension is assessed on a 1-5 maturity scale:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            {
              level: 1,
              name: 'Initial',
              color: '#f44336',
              description: 'Unstructured, reactive processes',
            },
            {
              level: 2,
              name: 'Developing',
              color: '#ff9800',
              description: 'Basic processes, beginning to standardize',
            },
            {
              level: 3,
              name: 'Defined',
              color: '#ffeb3b',
              description: 'Standardized, documented processes',
            },
            {
              level: 4,
              name: 'Managed',
              color: '#8bc34a',
              description: 'Fully operational, metrics-driven',
            },
            {
              level: 5,
              name: 'Optimized',
              color: '#4caf50',
              description: 'Advanced, data-driven innovation',
            },
          ].map(({ level, name, color, description }) => (
            <div
              key={level}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.5rem',
              }}
            >
              <span
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: color,
                  color: level >= 3 ? '#000' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {level}
              </span>
              <div>
                <strong>{name}</strong>
                <span style={{ color: '#5c5c5c', marginLeft: '0.5rem' }}>- {description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Current Status */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Assessment Status
        </h2>
        <div
          style={{
            padding: '1rem',
            border: '1px solid #d6d7d9',
            borderRadius: '4px',
            backgroundColor: '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Status:</span>
            <span
              style={{
                padding: '0.125rem 0.5rem',
                borderRadius: '4px',
                backgroundColor:
                  capability.status === 'completed'
                    ? '#4caf50'
                    : capability.status === 'in-progress'
                      ? '#ff9800'
                      : '#e0e0e0',
                color: capability.status === 'not-started' ? '#5c5c5c' : '#fff',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {capability.status === 'completed'
                ? 'Completed'
                : capability.status === 'in-progress'
                  ? 'In Progress'
                  : 'Not Started'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Last Updated:</span>
            <span style={{ color: '#5c5c5c' }}>
              {new Date(capability.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid #d6d7d9',
        }}
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
