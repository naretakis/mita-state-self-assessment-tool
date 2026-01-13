/**
 * OrbitTechnologyAssessment Component
 *
 * Displays assessment interface for the Technology ORBIT dimension.
 * Handles navigation between 7 sub-domains and their aspects.
 */

import React, { useCallback, useMemo, useState } from 'react';

import OrbitAspectAssessment from './OrbitAspectAssessment';

import type {
  AspectAssessmentResponse,
  TechnologyDimension,
  TechnologyDimensionResponse,
  TechnologySubDomain,
  TechnologySubDomainId,
  TechnologySubDomainResponse,
} from '../../../types/orbit';

interface OrbitTechnologyAssessmentProps {
  dimension: TechnologyDimension;
  response: TechnologyDimensionResponse | undefined;
  onUpdate: (response: TechnologyDimensionResponse) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const OrbitTechnologyAssessment: React.FC<OrbitTechnologyAssessmentProps> = ({
  dimension,
  response,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const [activeSubDomain, setActiveSubDomain] = useState<TechnologySubDomainId>(
    dimension.subDomains[0]?.id || 'infrastructure'
  );

  // Initialize or get current response
  const currentResponse = useMemo((): TechnologyDimensionResponse => {
    if (response) {
      return response;
    }
    const subDomains: Partial<Record<TechnologySubDomainId, TechnologySubDomainResponse>> = {};
    for (const sd of dimension.subDomains) {
      subDomains[sd.id] = {
        subDomainId: sd.id,
        aspects: {},
        overallLevel: 0,
        notes: '',
        lastUpdated: new Date().toISOString(),
      };
    }
    return {
      subDomains: subDomains as Record<TechnologySubDomainId, TechnologySubDomainResponse>,
      overallLevel: 0,
      notes: '',
      lastUpdated: new Date().toISOString(),
    };
  }, [response, dimension.subDomains]);

  // Get active sub-domain definition
  const activeSubDomainDef = useMemo((): TechnologySubDomain | undefined => {
    return dimension.subDomains.find(sd => sd.id === activeSubDomain);
  }, [dimension.subDomains, activeSubDomain]);

  // Get active sub-domain response
  const activeSubDomainResponse = useMemo((): TechnologySubDomainResponse | undefined => {
    return currentResponse.subDomains[activeSubDomain];
  }, [currentResponse.subDomains, activeSubDomain]);

  // Handle aspect update
  const handleAspectUpdate = useCallback(
    (aspectId: string, aspectResponse: AspectAssessmentResponse) => {
      const updatedSubDomain: TechnologySubDomainResponse = {
        ...(activeSubDomainResponse || {
          subDomainId: activeSubDomain,
          aspects: {},
          overallLevel: 0,
          notes: '',
          lastUpdated: new Date().toISOString(),
        }),
        aspects: {
          ...(activeSubDomainResponse?.aspects || {}),
          [aspectId]: aspectResponse,
        },
        lastUpdated: new Date().toISOString(),
      };

      const updated: TechnologyDimensionResponse = {
        ...currentResponse,
        subDomains: {
          ...currentResponse.subDomains,
          [activeSubDomain]: updatedSubDomain,
        },
        lastUpdated: new Date().toISOString(),
      };
      onUpdate(updated);
    },
    [activeSubDomain, activeSubDomainResponse, currentResponse, onUpdate]
  );

  // Handle sub-domain notes update
  const handleSubDomainNotesUpdate = useCallback(
    (notes: string) => {
      const updatedSubDomain: TechnologySubDomainResponse = {
        ...(activeSubDomainResponse || {
          subDomainId: activeSubDomain,
          aspects: {},
          overallLevel: 0,
          notes: '',
          lastUpdated: new Date().toISOString(),
        }),
        notes,
        lastUpdated: new Date().toISOString(),
      };

      const updated: TechnologyDimensionResponse = {
        ...currentResponse,
        subDomains: {
          ...currentResponse.subDomains,
          [activeSubDomain]: updatedSubDomain,
        },
        lastUpdated: new Date().toISOString(),
      };
      onUpdate(updated);
    },
    [activeSubDomain, activeSubDomainResponse, currentResponse, onUpdate]
  );

  // Calculate completion stats for each sub-domain
  const subDomainStats = useMemo(() => {
    const stats: Record<TechnologySubDomainId, { completed: number; total: number }> = {} as Record<
      TechnologySubDomainId,
      { completed: number; total: number }
    >;

    for (const sd of dimension.subDomains) {
      const sdResponse = currentResponse.subDomains[sd.id];
      const total = sd.aspects.length;
      const completed = sd.aspects.filter(aspect => {
        const aspectResponse = sdResponse?.aspects[aspect.id];
        return aspectResponse && aspectResponse.currentLevel > 0;
      }).length;
      stats[sd.id] = { completed, total };
    }

    return stats;
  }, [dimension.subDomains, currentResponse.subDomains]);

  // Calculate overall completion
  const overallStats = useMemo(() => {
    let totalAspects = 0;
    let completedAspects = 0;

    for (const sd of dimension.subDomains) {
      const stat = subDomainStats[sd.id];
      totalAspects += stat.total;
      completedAspects += stat.completed;
    }

    return {
      total: totalAspects,
      completed: completedAspects,
      percentage: totalAspects > 0 ? Math.round((completedAspects / totalAspects) * 100) : 0,
    };
  }, [dimension.subDomains, subDomainStats]);

  return (
    <div className="orbit-technology-assessment">
      {/* Header */}
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
          {dimension.name}
        </h2>
        <p style={{ margin: '0 0 1rem', color: '#5c5c5c' }}>{dimension.description}</p>

        {/* Overall Progress */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              marginBottom: '0.25rem',
            }}
          >
            <span>
              {overallStats.completed} of {overallStats.total} aspects assessed
            </span>
            <span>{overallStats.percentage}% complete</span>
          </div>
          <div
            style={{
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${overallStats.percentage}%`,
                backgroundColor: overallStats.percentage === 100 ? '#4caf50' : '#0071bc',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </header>

      {/* Sub-Domain Tabs */}
      <div
        role="tablist"
        aria-label="Technology sub-domains"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '2px solid #d6d7d9',
          paddingBottom: '0.75rem',
        }}
      >
        {dimension.subDomains.map(sd => {
          const stats = subDomainStats[sd.id];
          const isActive = activeSubDomain === sd.id;
          const isComplete = stats.completed === stats.total && stats.total > 0;

          return (
            <button
              key={sd.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${sd.id}`}
              onClick={() => {
                setActiveSubDomain(sd.id);
              }}
              style={{
                padding: '0.5rem 0.75rem',
                border: isActive ? '2px solid #0071bc' : '1px solid #aeb0b5',
                borderRadius: '4px',
                backgroundColor: isActive ? '#0071bc' : '#fff',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isActive ? '#fff' : '#212121',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{sd.name}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '10px',
                  backgroundColor: isActive
                    ? 'rgba(255,255,255,0.25)'
                    : isComplete
                      ? '#4caf50'
                      : '#e0e0e0',
                  color: isActive ? '#fff' : isComplete ? '#fff' : '#212121',
                  fontWeight: 600,
                }}
              >
                {stats.completed}/{stats.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-Domain Content */}
      {activeSubDomainDef && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeSubDomain}`}
          aria-labelledby={`tab-${activeSubDomain}`}
        >
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
              {activeSubDomainDef.name}
            </h3>
            <p style={{ margin: 0, color: '#5c5c5c', fontSize: '0.875rem' }}>
              {activeSubDomainDef.description}
            </p>
          </div>

          {/* Aspects */}
          <div style={{ marginBottom: '1.5rem' }}>
            {activeSubDomainDef.aspects.map(aspect => (
              <OrbitAspectAssessment
                key={aspect.id}
                aspect={aspect}
                response={activeSubDomainResponse?.aspects[aspect.id]}
                onUpdate={aspectResponse => handleAspectUpdate(aspect.id, aspectResponse)}
              />
            ))}
          </div>

          {/* Sub-Domain Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor={`subdomain-notes-${activeSubDomain}`}
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '0.25rem',
              }}
            >
              Notes for {activeSubDomainDef.name}
            </label>
            <textarea
              id={`subdomain-notes-${activeSubDomain}`}
              value={activeSubDomainResponse?.notes || ''}
              onChange={e => handleSubDomainNotesUpdate(e.target.value)}
              placeholder="Add notes for this sub-domain..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d6d7d9',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid #d6d7d9',
        }}
      >
        {onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="ds-c-button ds-c-button--transparent"
          >
            ← Previous
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="ds-c-button ds-c-button--primary"
            style={{ marginLeft: 'auto' }}
          >
            Next →
          </button>
        )}
      </nav>
    </div>
  );
};

export default OrbitTechnologyAssessment;
