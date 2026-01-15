/**
 * OrbitAspectAssessment Component
 *
 * Displays assessment questions and evidence collection for a single ORBIT aspect.
 * Uses the legacy card-based UI pattern with expandable level details.
 *
 * Flow:
 * 1. User sees all 5 maturity levels with descriptions
 * 2. User clicks a level to select it AND expand details
 * 3. Expanded level shows checkboxes and notes fields
 * 4. Only selected level is expanded
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
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Initial',
  2: 'Developing',
  3: 'Defined',
  4: 'Managed',
  5: 'Optimized',
};

const OrbitAspectAssessment: React.FC<OrbitAspectAssessmentProps> = ({
  aspect,
  response,
  onUpdate,
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

  // Handle level selection (clicking selects AND expands)
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

  // Handle text field updates
  const handleFieldUpdate = useCallback(
    (field: 'barriers' | 'plans' | 'notes', value: string) => {
      const updated: AspectAssessmentResponse = {
        ...currentResponse,
        [field]: value,
        lastUpdated: new Date().toISOString(),
      };
      onUpdate(updated);
    },
    [currentResponse, onUpdate]
  );

  // Get level response for a specific level
  const getLevelResponse = useCallback(
    (levelNum: 1 | 2 | 3 | 4 | 5) => {
      return currentResponse.levelResponses[levelNum];
    },
    [currentResponse.levelResponses]
  );

  return (
    <div
      className="orbit-aspect-assessment"
      style={{
        border: '1px solid #d6d7d9',
        borderRadius: '4px',
        padding: '1.5rem',
        backgroundColor: '#fafafa',
      }}
    >
      {/* Aspect Header */}
      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          margin: '0 0 0.5rem',
          color: '#212121',
        }}
      >
        {aspect.name}
      </h3>

      {/* Aspect Description */}
      <p
        style={{
          fontSize: '0.875rem',
          color: '#5c5c5c',
          marginBottom: '1rem',
          lineHeight: '1.5',
        }}
      >
        {aspect.description}
      </p>

      {/* Level Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[1, 2, 3, 4, 5].map(level => {
          const levelKey = `level${level}` as LevelKey;
          const levelDef = aspect.levels[levelKey];
          const isSelected = selectedLevel === level;
          const levelResponse = getLevelResponse(level as 1 | 2 | 3 | 4 | 5);
          const hasQuestions = levelDef.questions.length > 0;
          const hasEvidence = levelDef.evidence.length > 0;

          return (
            <div
              key={level}
              style={{
                border: `2px solid ${isSelected ? '#00a91c' : '#d6d7d9'}`,
                borderRadius: '4px',
                backgroundColor: isSelected ? '#f8fff9' : '#fff',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(0, 169, 28, 0.15)' : 'none',
              }}
            >
              {/* Level Header - Always visible, clickable to select */}
              <button
                type="button"
                onClick={() => handleLevelSelect(level as MaturityLevelWithNA)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  display: 'block',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                aria-expanded={isSelected}
                aria-controls={`level-content-${aspect.id}-${level}`}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <strong style={{ fontSize: '1rem', color: '#212121' }}>
                        Level {level}: {LEVEL_NAMES[level]}
                      </strong>
                      {isSelected && (
                        <span style={{ color: '#00a91c', fontSize: '1.25rem' }}>✓</span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#5c5c5c',
                        lineHeight: '1.4',
                        margin: 0,
                      }}
                    >
                      {levelDef.description}
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Content - Only shown when selected */}
              {isSelected && (
                <div
                  id={`level-content-${aspect.id}-${level}`}
                  style={{
                    padding: '0 1rem 1rem 1rem',
                    borderTop: '1px solid #e6e6e6',
                    marginTop: '0',
                  }}
                >
                  {/* Questions/Checkboxes */}
                  {hasQuestions && (
                    <div style={{ marginTop: '1rem' }}>
                      {levelDef.questions.map((question, idx) => {
                        const isChecked =
                          (levelResponse?.questions[idx]?.answer as boolean) || false;
                        return (
                          <label
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem',
                              marginBottom: '0.5rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e =>
                                handleQuestionAnswer(
                                  level as 1 | 2 | 3 | 4 | 5,
                                  idx,
                                  e.target.checked
                                )
                              }
                              style={{
                                marginTop: '0.125rem',
                                flexShrink: 0,
                                minWidth: '16px',
                                width: '16px',
                                height: '16px',
                              }}
                            />
                            <span
                              style={{
                                lineHeight: '1.4',
                                flex: '1',
                                wordBreak: 'break-word',
                                color: '#212121',
                              }}
                            >
                              {question.text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Evidence Checkboxes */}
                  {hasEvidence && (
                    <div style={{ marginTop: '1rem' }}>
                      <h6
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          marginBottom: '0.5rem',
                          color: '#212121',
                        }}
                      >
                        Evidence (check if available)
                      </h6>
                      {levelDef.evidence.map((evidence, idx) => {
                        const isChecked = levelResponse?.evidence[idx]?.provided || false;
                        return (
                          <label
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem',
                              marginBottom: '0.5rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e =>
                                handleEvidenceToggle(
                                  level as 1 | 2 | 3 | 4 | 5,
                                  idx,
                                  e.target.checked
                                )
                              }
                              style={{
                                marginTop: '0.125rem',
                                flexShrink: 0,
                                minWidth: '16px',
                                width: '16px',
                                height: '16px',
                              }}
                            />
                            <span
                              style={{
                                lineHeight: '1.4',
                                flex: '1',
                                wordBreak: 'break-word',
                                color: '#212121',
                              }}
                            >
                              {evidence}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Notes Fields Section */}
                  <div
                    style={{
                      marginTop: hasQuestions || hasEvidence ? '1.5rem' : '1rem',
                      paddingTop: hasQuestions || hasEvidence ? '1rem' : '0',
                      borderTop: hasQuestions || hasEvidence ? '1px solid #e6e6e6' : 'none',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: '#212121',
                      }}
                    >
                      Assessment Details
                    </h4>

                    {/* Supporting Description */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label
                        htmlFor={`notes-${aspect.id}-${level}`}
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          marginBottom: '0.25rem',
                          color: '#212121',
                        }}
                      >
                        Supporting Description
                      </label>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#5c5c5c',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Provide specific examples or documentation that supports your maturity level
                        selection.
                      </div>
                      <textarea
                        id={`notes-${aspect.id}-${level}`}
                        className="ds-c-field"
                        rows={3}
                        value={currentResponse.notes}
                        onChange={e => handleFieldUpdate('notes', e.target.value)}
                        placeholder="Describe the evidence that supports your selected maturity level..."
                        style={{ fontSize: '0.875rem', width: '100%' }}
                      />
                    </div>

                    {/* Barriers and Challenges */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label
                        htmlFor={`barriers-${aspect.id}-${level}`}
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          marginBottom: '0.25rem',
                          color: '#212121',
                        }}
                      >
                        Barriers and Challenges
                      </label>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#5c5c5c',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Describe any barriers or challenges that prevent higher maturity levels.
                      </div>
                      <textarea
                        id={`barriers-${aspect.id}-${level}`}
                        className="ds-c-field"
                        rows={3}
                        value={currentResponse.barriers}
                        onChange={e => handleFieldUpdate('barriers', e.target.value)}
                        placeholder="Describe barriers or challenges you face..."
                        style={{ fontSize: '0.875rem', width: '100%' }}
                      />
                    </div>

                    {/* Advancement Plans */}
                    <div style={{ marginBottom: '0' }}>
                      <label
                        htmlFor={`plans-${aspect.id}-${level}`}
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          marginBottom: '0.25rem',
                          color: '#212121',
                        }}
                      >
                        Advancement Plans
                      </label>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#5c5c5c',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Describe your plans for advancing to higher maturity levels.
                      </div>
                      <textarea
                        id={`plans-${aspect.id}-${level}`}
                        className="ds-c-field"
                        rows={3}
                        value={currentResponse.plans}
                        onChange={e => handleFieldUpdate('plans', e.target.value)}
                        placeholder="Describe your plans for improvement..."
                        style={{ fontSize: '0.875rem', width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* N/A Option */}
        <div
          style={{
            border: `2px solid ${selectedLevel === -1 ? '#71767a' : '#d6d7d9'}`,
            borderRadius: '4px',
            backgroundColor: selectedLevel === -1 ? '#f5f5f5' : '#fff',
            transition: 'all 0.2s ease',
          }}
        >
          <button
            type="button"
            onClick={() => handleLevelSelect(-1)}
            style={{
              width: '100%',
              padding: '1rem',
              display: 'block',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <strong style={{ fontSize: '1rem', color: '#212121' }}>Not Applicable</strong>
              {selectedLevel === -1 && (
                <span style={{ color: '#71767a', fontSize: '1.25rem' }}>✓</span>
              )}
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#5c5c5c',
                lineHeight: '1.4',
                margin: '0.5rem 0 0',
              }}
            >
              This aspect does not apply to your organization or system.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrbitAspectAssessment;
