import React, { useEffect, useState } from 'react';

import type {
  CapabilityAreaAssessment,
  CapabilityDefinition,
  DimensionAssessment as DimensionData,
  OrbitDimension,
} from '../../types';

interface DimensionAssessmentProps {
  capability: CapabilityAreaAssessment;
  definition: CapabilityDefinition;
  dimension: OrbitDimension;
  onUpdate: (data: Partial<DimensionData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}

const DIMENSION_LABELS: Record<OrbitDimension, string> = {
  outcome: 'Outcomes',
  role: 'Roles',
  businessProcess: 'Business Processes',
  information: 'Information',
  technology: 'Technology',
};

const DimensionAssessment: React.FC<DimensionAssessmentProps> = ({
  capability,
  definition,
  dimension,
  onUpdate,
  onNext,
  onPrevious,
  onSave,
}) => {
  const [formData, setFormData] = useState(capability.dimensions[dimension]);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(capability.dimensions[dimension]);
  }, [capability, dimension]);

  const handleInputChange = (field: keyof DimensionData, value: string | number) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);

    if (validationError && field === 'maturityLevel' && value > 0) {
      setValidationError(null);
    }
  };

  const validateForm = (): boolean => {
    if (formData.maturityLevel === 0) {
      setValidationError('Please select a maturity level to continue.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleSave = () => {
    onSave();
  };

  const dimensionDefinition = definition.dimensions[dimension];
  const maturityLevels = dimensionDefinition?.maturityLevels;

  return (
    <div className="ds-l-row ds-u-justify-content--center">
      <div className="ds-l-col--12 ds-l-lg-col--10">
        <header className="ds-u-margin-bottom--6">
          <h1 className="ds-display--1 ds-u-margin-bottom--2 ds-u-color--primary">
            {definition.capabilityDomainName}
          </h1>
          <h2 className="ds-h2 ds-u-margin-bottom--2 ds-u-color--primary">
            {definition.capabilityAreaName}
          </h2>
          <div className="ds-c-alert ds-c-alert--lightweight ds-u-margin-bottom--4">
            <div className="ds-c-alert__body">
              <h3 className="ds-h3 ds-u-margin-bottom--2 ds-u-color--primary">
                {DIMENSION_LABELS[dimension]} Assessment
              </h3>
              <p className="ds-text ds-u-margin-bottom--0">{dimensionDefinition?.description}</p>
            </div>
          </div>
        </header>

        {validationError && (
          <div className="ds-c-alert ds-c-alert--warn ds-u-margin-bottom--4">
            <div className="ds-c-alert__body">
              <h2 className="ds-c-alert__heading">Validation Error</h2>
              <p className="ds-c-alert__text">{validationError}</p>
            </div>
          </div>
        )}

        <form className="ds-u-margin-bottom--6">
          <fieldset className="ds-c-fieldset ds-u-margin-bottom--6">
            <legend className="ds-c-label ds-u-margin-bottom--3">
              Maturity Level Selection <span className="ds-u-color--error">*</span>
            </legend>
            <div className="ds-c-field__hint ds-u-margin-bottom--4">
              Select the maturity level that best describes your current state for this dimension.
            </div>

            <div className="ds-u-margin-bottom--4">
              {maturityLevels && Object.keys(maturityLevels).length > 0 ? (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {Object.entries(maturityLevels).map(([level, description]) => {
                    const levelNumber = parseInt(level.replace('level', ''));
                    const levelLabels = [
                      'Initial',
                      'Repeatable',
                      'Defined',
                      'Managed',
                      'Optimized',
                    ];
                    const isSelected = formData.maturityLevel === levelNumber;
                    return (
                      <label
                        key={level}
                        htmlFor={`maturity-${levelNumber}`}
                        style={{
                          display: 'block',
                          padding: '1rem',
                          border: `2px solid ${isSelected ? '#00a91c' : '#d6d7d9'}`,
                          borderRadius: '4px',
                          backgroundColor: isSelected ? '#f8fff9' : '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 2px 8px rgba(0, 169, 28, 0.15)' : 'none',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = '#0071bc';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 113, 188, 0.1)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = '#d6d7d9';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        <input
                          type="radio"
                          id={`maturity-${levelNumber}`}
                          name="maturityLevel"
                          value={levelNumber}
                          checked={isSelected}
                          onChange={e =>
                            handleInputChange('maturityLevel', parseInt(e.target.value))
                          }
                          style={{ display: 'none' }}
                        />
                        <div
                          style={{
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <strong style={{ fontSize: '1.125rem', color: '#212121' }}>
                            Level {levelNumber}: {levelLabels[levelNumber - 1]}
                          </strong>
                          {isSelected && (
                            <span style={{ color: '#00a91c', fontSize: '1.25rem' }}>✓</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#5c5c5c', lineHeight: '1.4' }}>
                          {description && description.trim()
                            ? description
                            : 'No description available'}
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="ds-c-alert ds-c-alert--warn">
                  <div className="ds-c-alert__body">
                    <p className="ds-c-alert__text">
                      Maturity level definitions are not available. Please check the content
                      loading.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          {formData.maturityLevel > 0 && (
            <div className="ds-u-margin-bottom--6">
              <h3 className="ds-h3 ds-u-margin-bottom--3">Assessment Details</h3>

              <div className="ds-c-field ds-u-margin-bottom--4">
                <label htmlFor="evidence" className="ds-c-label">
                  Supporting Evidence
                </label>
                <div className="ds-c-field__hint">
                  Provide specific examples, documentation, or evidence that supports your maturity
                  level selection.
                </div>
                <textarea
                  id="evidence"
                  name="evidence"
                  className="ds-c-field"
                  rows={4}
                  value={formData.evidence}
                  onChange={e => handleInputChange('evidence', e.target.value)}
                  placeholder="Describe the evidence that supports your selected maturity level..."
                />
              </div>

              <div className="ds-c-field ds-u-margin-bottom--4">
                <label htmlFor="barriers" className="ds-c-label">
                  Barriers and Challenges
                </label>
                <div className="ds-c-field__hint">
                  Describe any barriers, challenges, or limitations that prevent higher maturity
                  levels.
                </div>
                <textarea
                  id="barriers"
                  name="barriers"
                  className="ds-c-field"
                  rows={3}
                  value={formData.barriers}
                  onChange={e => handleInputChange('barriers', e.target.value)}
                  placeholder="Describe barriers or challenges you face..."
                />
              </div>

              <div className="ds-c-field ds-u-margin-bottom--4">
                <label htmlFor="plans" className="ds-c-label">
                  Advancement Plans
                </label>
                <div className="ds-c-field__hint">
                  Describe your plans or strategies for advancing to higher maturity levels.
                </div>
                <textarea
                  id="plans"
                  name="plans"
                  className="ds-c-field"
                  rows={3}
                  value={formData.plans}
                  onChange={e => handleInputChange('plans', e.target.value)}
                  placeholder="Describe your plans for improvement..."
                />
              </div>

              <div className="ds-c-field ds-u-margin-bottom--4">
                <label htmlFor="notes" className="ds-c-label">
                  Additional Notes
                </label>
                <div className="ds-c-field__hint">
                  Any additional context, considerations, or notes for this dimension.
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  className="ds-c-field"
                  rows={3}
                  value={formData.notes}
                  onChange={e => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes or context..."
                />
              </div>
            </div>
          )}

          {formData.maturityLevel > 0 && (
            <div className="ds-c-field ds-u-margin-bottom--6">
              <label htmlFor="targetMaturityLevel" className="ds-c-label">
                Target Maturity Level (Optional)
              </label>
              <div className="ds-c-field__hint">
                What maturity level would you like to achieve for this dimension?
              </div>
              <select
                id="targetMaturityLevel"
                name="targetMaturityLevel"
                className="ds-c-field"
                value={formData.targetMaturityLevel || ''}
                onChange={e =>
                  handleInputChange(
                    'targetMaturityLevel',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              >
                <option value="">Select target level...</option>
                <option value="1">Level 1 - Initial</option>
                <option value="2">Level 2 - Repeatable</option>
                <option value="3">Level 3 - Defined</option>
                <option value="4">Level 4 - Managed</option>
                <option value="5">Level 5 - Optimized</option>
              </select>
            </div>
          )}
        </form>

        <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
          <button
            type="button"
            className="ds-c-button ds-c-button--transparent"
            onClick={onPrevious}
          >
            ← Previous
          </button>

          <div className="ds-u-display--flex ds-u-align-items--center">
            <button
              type="button"
              className="ds-c-button ds-c-button--transparent ds-u-margin-right--2"
              onClick={handleSave}
            >
              Save Progress
            </button>
            <button type="button" className="ds-c-button ds-c-button--primary" onClick={handleNext}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionAssessment;
