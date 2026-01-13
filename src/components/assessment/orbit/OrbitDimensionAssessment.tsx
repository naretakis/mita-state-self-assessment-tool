/**
 * OrbitDimensionAssessment Component
 *
 * Displays assessment interface for a complete ORBIT dimension.
 * Handles standard dimensions (Outcomes, Roles, Business, Information)
 * with their aspects.
 */

import React, { useCallback, useMemo, useState } from 'react';

import OrbitAspectAssessment from './OrbitAspectAssessment';

import type {
  AspectAssessmentResponse,
  OrbitDimensionDefinition,
  OrbitDimensionId,
  StandardDimensionResponse,
} from '../../../types/orbit';

interface OrbitDimensionAssessmentProps {
  dimensionId: Exclude<OrbitDimensionId, 'technology'>;
  dimension: OrbitDimensionDefinition;
  response: StandardDimensionResponse | undefined;
  onUpdate: (response: StandardDimensionResponse) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const OrbitDimensionAssessment: React.FC<OrbitDimensionAssessmentProps> = ({
  dimensionId,
  dimension,
  response,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const [expandedAspects, setExpandedAspects] = useState<Set<string>>(new Set());

  // Initialize or get current response
  const currentResponse = useMemo((): StandardDimensionResponse => {
    if (response) {
      return response;
    }
    return {
      dimensionId,
      aspects: {},
      overallLevel: 0,
      notes: '',
      lastUpdated: new Date().toISOString(),
    };
  }, [response, dimensionId]);

  // Toggle aspect expansion
  const toggleAspect = useCallback((aspectId: string) => {
    setExpandedAspects(prev => {
      const next = new Set(prev);
      if (next.has(aspectId)) {
        next.delete(aspectId);
      } else {
        next.add(aspectId);
      }
      return next;
    });
  }, []);

  // Expand all aspects
  const expandAll = useCallback(() => {
    setExpandedAspects(new Set(dimension.aspects.map(a => a.id)));
  }, [dimension.aspects]);

  // Collapse all aspects
  const collapseAll = useCallback(() => {
    setExpandedAspects(new Set());
  }, []);

  // Handle aspect update
  const handleAspectUpdate = useCallback(
    (aspectId: string, aspectResponse: AspectAssessmentResponse) => {
      const updated: StandardDimensionResponse = {
        ...currentResponse,
        aspects: {
          ...currentResponse.aspects,
          [aspectId]: aspectResponse,
        },
        lastUpdated: new Date().toISOString(),
      };
      onUpdate(updated);
    },
    [currentResponse, onUpdate]
  );

  // Handle notes update
  const handleNotesUpdate = useCallback(
    (notes: string) => {
      const updated: StandardDimensionResponse = {
        ...currentResponse,
        notes,
        lastUpdated: new Date().toISOString(),
      };
      onUpdate(updated);
    },
    [currentResponse, onUpdate]
  );

  // Calculate completion stats
  const completionStats = useMemo(() => {
    const totalAspects = dimension.aspects.length;
    const completedAspects = dimension.aspects.filter(aspect => {
      const aspectResponse = currentResponse.aspects[aspect.id];
      return aspectResponse && aspectResponse.currentLevel > 0;
    }).length;
    return {
      total: totalAspects,
      completed: completedAspects,
      percentage: totalAspects > 0 ? Math.round((completedAspects / totalAspects) * 100) : 0,
    };
  }, [dimension.aspects, currentResponse.aspects]);

  return (
    <div className="orbit-dimension-assessment">
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
        >
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>{dimension.name}</h2>
          {!dimension.required && (
            <span
              style={{
                padding: '0.125rem 0.5rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: '#5c5c5c',
              }}
            >
              Optional
            </span>
          )}
        </div>
        <p style={{ margin: '0 0 1rem', color: '#5c5c5c' }}>{dimension.description}</p>

        {/* Progress Bar */}
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
              {completionStats.completed} of {completionStats.total} aspects assessed
            </span>
            <span>{completionStats.percentage}% complete</span>
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
                width: `${completionStats.percentage}%`,
                backgroundColor: completionStats.percentage === 100 ? '#4caf50' : '#0071bc',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Expand/Collapse Controls */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={expandAll}
            style={{
              padding: '0.25rem 0.75rem',
              border: '1px solid #d6d7d9',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            style={{
              padding: '0.25rem 0.75rem',
              border: '1px solid #d6d7d9',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Collapse All
          </button>
        </div>
      </header>

      {/* Aspects */}
      <div style={{ marginBottom: '2rem' }}>
        {dimension.aspects.map(aspect => (
          <OrbitAspectAssessment
            key={aspect.id}
            aspect={aspect}
            response={currentResponse.aspects[aspect.id]}
            onUpdate={aspectResponse => handleAspectUpdate(aspect.id, aspectResponse)}
            expanded={expandedAspects.has(aspect.id)}
            onToggleExpand={() => toggleAspect(aspect.id)}
          />
        ))}
      </div>

      {/* Dimension Notes */}
      <div style={{ marginBottom: '2rem' }}>
        <label
          htmlFor={`dimension-notes-${dimensionId}`}
          style={{ display: 'block', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}
        >
          Overall Notes for {dimension.name}
        </label>
        <textarea
          id={`dimension-notes-${dimensionId}`}
          value={currentResponse.notes}
          onChange={e => handleNotesUpdate(e.target.value)}
          placeholder="Add any overall notes or observations for this dimension..."
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d6d7d9',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        />
      </div>

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

export default OrbitDimensionAssessment;
