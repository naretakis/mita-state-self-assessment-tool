/**
 * OrbitAspectAssessment Component
 *
 * Displays assessment questions and evidence collection for a single ORBIT aspect.
 * Used within dimension assessment to evaluate individual aspects.
 */

import React, { useCallback, useMemo, useState } from 'react';

import type {
  AspectAssessmentResponse,
  AspectLevelResponse,
  LevelKey,
  MaturityLevelWithNA,
  OrbitAspect,
} from '../../../types/orbit';

interface OrbitAspectAssessmentProps {
  aspect: OrbitAspect;
  response: AspectAssessmentResponse | undefined;
  onUpdate: (response: AspectAssessmentResponse) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Initial',
  2: 'Developing',
  3: 'Defined',
  4: 'Managed',
  5: 'Optimized',
};

const LEVEL_COLORS: Record<number, string> = {
  0: '#e0e0e0',
  1: '#f44336',
  2: '#ff9800',
  3: '#ffeb3b',
  4: '#8bc34a',
  5: '#4caf50',
};

const OrbitAspectAssessment: React.FC<OrbitAspectAssessmentProps> = ({
  aspect,
  response,
  onUpdate,
  expanded = false,
  onToggleExpand,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<MaturityLevelWithNA>(
    response?.currentLevel ?? 0
  );

  // Initialize or get current response
  const currentResponse = useMemo((): AspectAssessmentResponse => {
    if (response) {
      return response;
    }
    return {
      aspectId: aspect.id,
      currentLevel: 0,
      levelResponses: {},
      barriers: '',
      plans: '',
      notes: '',
      lastUpdated: new Date().toISOString(),
    };
  }, [response, aspect.id]);

  // Handle level selection
  const handleLevelSelect = useCallback(
    (level: MaturityLevelWithNA) => {
      setSelectedLevel(level);
      const updated: AspectAssessmentResponse = {
        ...currentResponse,
        currentLevel: level,
        lastUpdated: new Date().toISOString(),
      };
      onUpdate(updated);
    },
    [currentResponse, onUpdate]
  );

  // Handle question answer
  const handleQuestionAnswer = useCallback(
    (levelNum: 1 | 2 | 3 | 4 | 5, questionIndex: number, answer: boolean | string) => {
      const levelKey = `level${levelNum}` as LevelKey;
      const levelDef = aspect.levels[levelKey];

      const existingLevelResponse = currentResponse.levelResponses[levelNum] || {
        levelSelected: levelNum,
        questions: levelDef.questions.map((_, idx) => ({ questionIndex: idx, answer: null })),
        evidence: levelDef.evidence.map((_, idx) => ({ evidenceIndex: idx, provided: false })),
        notes: '',
        lastUpdated: new Date().toISOString(),
      };

      const updatedQuestions = [...existingLevelResponse.questions];
      updatedQuestions[questionIndex] = { questionIndex, answer };

      const updatedLevelResponse: AspectLevelResponse = {
        ...existingLevelResponse,
        questions: updatedQuestions,
        lastUpdated: new Date().toISOString(),
      };

      const updated: AspectAssessmentResponse = {
        ...currentResponse,
        levelResponses: {
          ...currentResponse.levelResponses,
          [levelNum]: updatedLevelResponse,
        },
        lastUpdated: new Date().toISOString(),
      };
      onUpdate(updated);
    },
    [aspect.levels, currentResponse, onUpdate]
  );

  // Handle evidence toggle
  const handleEvidenceToggle = useCallback(
    (levelNum: 1 | 2 | 3 | 4 | 5, evidenceIndex: number, provided: boolean) => {
      const levelKey = `level${levelNum}` as LevelKey;
      const levelDef = aspect.levels[levelKey];

      const existingLevelResponse = currentResponse.levelResponses[levelNum] || {
        levelSelected: levelNum,
        questions: levelDef.questions.map((_, idx) => ({ questionIndex: idx, answer: null })),
        evidence: levelDef.evidence.map((_, idx) => ({ evidenceIndex: idx, provided: false })),
        notes: '',
        lastUpdated: new Date().toISOString(),
      };

      const updatedEvidence = [...existingLevelResponse.evidence];
      updatedEvidence[evidenceIndex] = { evidenceIndex, provided };

      const updatedLevelResponse: AspectLevelResponse = {
        ...existingLevelResponse,
        evidence: updatedEvidence,
        lastUpdated: new Date().toISOString(),
      };

      const updated: AspectAssessmentResponse = {
        ...currentResponse,
        levelResponses: {
          ...currentResponse.levelResponses,
          [levelNum]: updatedLevelResponse,
        },
        lastUpdated: new Date().toISOString(),
      };
      onUpdate(updated);
    },
    [aspect.levels, currentResponse, onUpdate]
  );

  // Handle notes update
  const handleNotesUpdate = useCallback(
    (notes: string) => {
      const updated: AspectAssessmentResponse = {
        ...currentResponse,
        notes,
        lastUpdated: new Date().toISOString(),
      };
      onUpdate(updated);
    },
    [currentResponse, onUpdate]
  );

  // Get level definition for selected level
  const selectedLevelDef = useMemo(() => {
    if (selectedLevel <= 0 || selectedLevel > 5) {
      return null;
    }
    const levelKey = `level${selectedLevel}` as LevelKey;
    return aspect.levels[levelKey];
  }, [aspect.levels, selectedLevel]);

  // Get level response for selected level
  const selectedLevelResponse = useMemo(() => {
    if (selectedLevel <= 0 || selectedLevel > 5) {
      return null;
    }
    return currentResponse.levelResponses[selectedLevel as 1 | 2 | 3 | 4 | 5];
  }, [currentResponse.levelResponses, selectedLevel]);

  return (
    <div
      className="orbit-aspect-assessment"
      style={{
        border: '1px solid #d6d7d9',
        borderRadius: '4px',
        marginBottom: '1rem',
        backgroundColor: '#fff',
      }}
    >
      {/* Aspect Header */}
      <button
        type="button"
        onClick={onToggleExpand}
        style={{
          width: '100%',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: expanded ? '#f0f0f0' : '#fff',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        aria-expanded={expanded}
        aria-controls={`aspect-content-${aspect.id}`}
      >
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{aspect.name}</h4>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#5c5c5c' }}>
            {aspect.description}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {selectedLevel > 0 && (
            <span
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                backgroundColor: LEVEL_COLORS[selectedLevel] || '#e0e0e0',
                color: selectedLevel >= 3 ? '#000' : '#fff',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Level {selectedLevel}
            </span>
          )}
          <span style={{ fontSize: '1.25rem' }}>{expanded ? '▼' : '▶'}</span>
        </div>
      </button>

      {/* Aspect Content */}
      {expanded && (
        <div
          id={`aspect-content-${aspect.id}`}
          style={{ padding: '1rem', borderTop: '1px solid #d6d7d9' }}
        >
          {/* Level Selection */}
          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 1.5rem' }}>
            <legend style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Select Maturity Level
            </legend>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5].map(level => (
                <label
                  key={level}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    border: `2px solid ${selectedLevel === level ? '#0071bc' : '#d6d7d9'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: selectedLevel === level ? '#e6f3ff' : '#fff',
                  }}
                >
                  <input
                    type="radio"
                    name={`level-${aspect.id}`}
                    value={level}
                    checked={selectedLevel === level}
                    onChange={() => handleLevelSelect(level as MaturityLevelWithNA)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ fontWeight: selectedLevel === level ? 600 : 400 }}>
                    {level}: {LEVEL_NAMES[level]}
                  </span>
                </label>
              ))}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  border: `2px solid ${selectedLevel === -1 ? '#0071bc' : '#d6d7d9'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedLevel === -1 ? '#e6f3ff' : '#fff',
                }}
              >
                <input
                  type="radio"
                  name={`level-${aspect.id}`}
                  value={-1}
                  checked={selectedLevel === -1}
                  onChange={() => handleLevelSelect(-1)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ fontWeight: selectedLevel === -1 ? 600 : 400 }}>N/A</span>
              </label>
            </div>
          </fieldset>

          {/* Level Details */}
          {selectedLevelDef && selectedLevel > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Level {selectedLevel}: {LEVEL_NAMES[selectedLevel]}
              </h5>
              <p style={{ fontSize: '0.875rem', color: '#5c5c5c', marginBottom: '1rem' }}>
                {selectedLevelDef.description}
              </p>

              {/* Questions */}
              {selectedLevelDef.questions.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h6 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Assessment Questions
                  </h6>
                  {selectedLevelDef.questions.map((question, idx) => (
                    <div key={idx} style={{ marginBottom: '0.75rem' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        {question.type === 'yes-no' ? (
                          <input
                            type="checkbox"
                            checked={
                              (selectedLevelResponse?.questions[idx]?.answer as boolean) || false
                            }
                            onChange={e =>
                              handleQuestionAnswer(
                                selectedLevel as 1 | 2 | 3 | 4 | 5,
                                idx,
                                e.target.checked
                              )
                            }
                            style={{ marginTop: '0.125rem' }}
                          />
                        ) : null}
                        <span>{question.text}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Evidence */}
              {selectedLevelDef.evidence.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h6 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Evidence (check if available)
                  </h6>
                  {selectedLevelDef.evidence.map((evidence, idx) => (
                    <div key={idx} style={{ marginBottom: '0.5rem' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLevelResponse?.evidence[idx]?.provided || false}
                          onChange={e =>
                            handleEvidenceToggle(
                              selectedLevel as 1 | 2 | 3 | 4 | 5,
                              idx,
                              e.target.checked
                            )
                          }
                          style={{ marginTop: '0.125rem' }}
                        />
                        <span>{evidence}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label
              htmlFor={`notes-${aspect.id}`}
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '0.25rem',
              }}
            >
              Notes
            </label>
            <textarea
              id={`notes-${aspect.id}`}
              value={currentResponse.notes}
              onChange={e => handleNotesUpdate(e.target.value)}
              placeholder="Add any additional notes or context..."
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
    </div>
  );
};

export default OrbitAspectAssessment;
