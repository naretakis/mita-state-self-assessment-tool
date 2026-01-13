/**
 * Export Data Collector
 * Aggregates all assessment data from multiple sources for export
 * Supports both legacy and ORBIT assessment formats
 */

import ContentService from '../ContentService';
import { ScoringService } from '../ScoringService';

import type { Assessment, CapabilityAreaAssessment, CapabilityDefinition } from '../../types';
import type { OrbitAssessment, OrbitCapabilityAssessment } from '../../types/orbit';
import type { EnhancedMaturityScore } from '../ScoringService';
import type { ExportData, ExportError, ExportMetadata } from './types';

/**
 * Type guard to check if an assessment is in ORBIT format
 */
function isOrbitAssessment(
  assessment: Assessment | OrbitAssessment
): assessment is OrbitAssessment {
  if (!assessment.capabilities || assessment.capabilities.length === 0) {
    return false;
  }
  const firstCap = assessment.capabilities[0];
  return 'orbit' in firstCap;
}

/**
 * Type guard to check if a capability is in ORBIT format
 */
function isOrbitCapability(
  capability: CapabilityAreaAssessment | OrbitCapabilityAssessment
): capability is OrbitCapabilityAssessment {
  return 'orbit' in capability;
}

export class ExportDataCollector {
  private contentService: ContentService;
  private scoringService: ScoringService;

  constructor() {
    this.contentService = new ContentService('/content');
    this.scoringService = new ScoringService();
  }

  /**
   * Collect complete export data for an assessment
   * Supports both legacy and ORBIT assessment formats
   */
  async collectExportData(assessment: Assessment | OrbitAssessment): Promise<ExportData> {
    try {
      // Initialize content service if not already done
      await this.contentService.initialize();

      // Collect capability definitions
      const capabilities = await this.collectCapabilityDefinitions(assessment);

      // Calculate enhanced scores (only for legacy format, ORBIT uses OrbitScoringService)
      let scores: EnhancedMaturityScore[] = [];
      if (!isOrbitAssessment(assessment)) {
        scores = this.scoringService.calculateOverallScore(assessment, capabilities);
      }

      // Generate export metadata
      const metadata = this.generateExportMetadata(assessment, scores);

      return {
        assessment: assessment as Assessment, // Type assertion for export data structure
        scores,
        metadata,
        capabilities,
      };
    } catch (error) {
      throw this.createExportError(
        'data_collection',
        'Failed to collect export data',
        error as Error,
        { assessmentId: assessment.id }
      );
    }
  }

  /**
   * Collect capability definitions for the assessment
   * Supports both legacy and ORBIT assessment formats
   */
  private async collectCapabilityDefinitions(
    assessment: Assessment | OrbitAssessment
  ): Promise<CapabilityDefinition[]> {
    try {
      const definitions: CapabilityDefinition[] = [];

      // Get definitions for each capability in the assessment
      for (const capability of assessment.capabilities) {
        try {
          // Handle both ORBIT and legacy capability ID formats
          const capabilityId = isOrbitCapability(capability)
            ? capability.capabilityId
            : capability.id;

          const definition = await this.contentService.getCapability(capabilityId);
          if (definition) {
            definitions.push(definition);
          } else {
            console.warn(`Definition not found for capability ${capabilityId}`);
          }
        } catch (error) {
          const capId = isOrbitCapability(capability) ? capability.capabilityId : capability.id;
          console.warn(`Failed to load definition for capability ${capId}:`, error);
        }
      }

      return definitions;
    } catch (error) {
      console.warn('Failed to load capability definitions, using empty array:', error);
      return [];
    }
  }

  /**
   * Generate export metadata
   * Supports both legacy and ORBIT assessment formats
   */
  private generateExportMetadata(
    assessment: Assessment | OrbitAssessment,
    scores: EnhancedMaturityScore[]
  ): ExportMetadata {
    const now = new Date().toISOString();

    // Calculate completion percentage based on format
    let completionPercentage = 0;

    if (isOrbitAssessment(assessment)) {
      // ORBIT format: check required dimensions (B, I, T)
      const totalRequired = assessment.capabilities.length * 3;
      let completedRequired = 0;

      for (const capability of assessment.capabilities) {
        const orbit = capability.orbit;
        if (orbit) {
          if (orbit.business?.overallLevel && orbit.business.overallLevel > 0) {
            completedRequired++;
          }
          if (orbit.information?.overallLevel && orbit.information.overallLevel > 0) {
            completedRequired++;
          }
          if (orbit.technology?.overallLevel && orbit.technology.overallLevel > 0) {
            completedRequired++;
          }
        }
      }

      completionPercentage =
        totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;
    } else {
      // Legacy format: use scores
      const completedCapabilities = scores.filter(score => score.overallScore > 0).length;
      completionPercentage =
        scores.length > 0 ? Math.round((completedCapabilities / scores.length) * 100) : 0;
    }

    return {
      exportedAt: now,
      exportVersion: '1.0.0',
      schemaVersion: '1.0',
      systemName: assessment.metadata?.systemName,
      lastSavedAt: assessment.updatedAt,
      completionPercentage,
    };
  }

  /**
   * Validate assessment data completeness
   * Supports both legacy and ORBIT assessment formats
   */
  async validateAssessmentData(assessment: Assessment | OrbitAssessment): Promise<{
    isValid: boolean;
    warnings: string[];
    errors: string[];
  }> {
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Check basic assessment structure
      if (!assessment) {
        errors.push('Assessment data is missing');
        return { isValid: false, warnings, errors };
      }

      if (!assessment.id) {
        errors.push('Assessment ID is missing');
      }

      if (!assessment.stateName) {
        warnings.push('State name is missing');
      }

      if (!assessment.metadata?.systemName) {
        warnings.push('System name is missing - will not be included in export');
      }

      // Check capabilities
      if (!assessment.capabilities || assessment.capabilities.length === 0) {
        errors.push('No capabilities found in assessment');
        return { isValid: false, warnings, errors };
      }

      // Determine assessment format and validate accordingly
      if (isOrbitAssessment(assessment)) {
        // Validate ORBIT format assessment
        for (const capability of assessment.capabilities) {
          if (!capability.capabilityId) {
            warnings.push(`Capability missing ID: ${capability.capabilityAreaName}`);
          }

          if (!capability.capabilityAreaName) {
            warnings.push(`Capability missing area name: ${capability.capabilityId}`);
          }

          if (!capability.capabilityDomainName) {
            warnings.push(`Capability missing domain name: ${capability.capabilityId}`);
          }

          // Check ORBIT dimensions
          const orbit = capability.orbit;
          if (!orbit) {
            warnings.push(`Missing ORBIT data for ${capability.capabilityAreaName}`);
          } else {
            // Check required dimensions (business, information, technology)
            if (!orbit.business || orbit.business.overallLevel === 0) {
              warnings.push(
                `No maturity level selected for Business Architecture in ${capability.capabilityAreaName}`
              );
            }
            if (!orbit.information || orbit.information.overallLevel === 0) {
              warnings.push(
                `No maturity level selected for Information & Data in ${capability.capabilityAreaName}`
              );
            }
            if (!orbit.technology || orbit.technology.overallLevel === 0) {
              warnings.push(
                `No maturity level selected for Technology in ${capability.capabilityAreaName}`
              );
            }
          }
        }
      } else {
        // Validate legacy format assessment
        for (const capability of assessment.capabilities) {
          if (!capability.id) {
            warnings.push(`Capability missing ID: ${capability.capabilityAreaName}`);
          }

          if (!capability.capabilityAreaName) {
            warnings.push(`Capability missing area name: ${capability.id}`);
          }

          if (!capability.capabilityDomainName) {
            warnings.push(`Capability missing domain name: ${capability.id}`);
          }

          // Check dimensions
          const dimensions = ['outcome', 'role', 'businessProcess', 'information', 'technology'];
          for (const dimension of dimensions) {
            const dimData =
              capability.dimensions?.[dimension as keyof typeof capability.dimensions];
            if (!dimData) {
              warnings.push(
                `Missing ${dimension} dimension data for ${capability.capabilityAreaName}`
              );
            } else {
              if (dimData.maturityLevel === 0) {
                warnings.push(
                  `No maturity level selected for ${dimension} in ${capability.capabilityAreaName}`
                );
              }
            }
          }
        }
      }

      const isValid = errors.length === 0;
      return { isValid, warnings, errors };
    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { isValid: false, warnings, errors };
    }
  }

  /**
   * Get export data summary for progress tracking
   * Supports both legacy and ORBIT assessment formats
   */
  getExportDataSummary(assessment: Assessment | OrbitAssessment): {
    totalCapabilities: number;
    completedCapabilities: number;
    totalDimensions: number;
    completedDimensions: number;
    hasSystemName: boolean;
    hasMetadata: boolean;
  } {
    const totalCapabilities = assessment.capabilities?.length || 0;
    const totalDimensions = totalCapabilities * 5; // 5 ORBIT dimensions per capability

    let completedCapabilities = 0;
    let completedDimensions = 0;

    if (assessment.capabilities) {
      if (isOrbitAssessment(assessment)) {
        // ORBIT format
        for (const capability of assessment.capabilities) {
          let capabilityCompleted = false;
          const orbit = capability.orbit;

          if (orbit) {
            // Check optional dimensions
            if (orbit.outcomes?.overallLevel && orbit.outcomes.overallLevel > 0) {
              completedDimensions++;
              capabilityCompleted = true;
            }
            if (orbit.roles?.overallLevel && orbit.roles.overallLevel > 0) {
              completedDimensions++;
              capabilityCompleted = true;
            }
            // Check required dimensions
            if (orbit.business?.overallLevel && orbit.business.overallLevel > 0) {
              completedDimensions++;
              capabilityCompleted = true;
            }
            if (orbit.information?.overallLevel && orbit.information.overallLevel > 0) {
              completedDimensions++;
              capabilityCompleted = true;
            }
            if (orbit.technology?.overallLevel && orbit.technology.overallLevel > 0) {
              completedDimensions++;
              capabilityCompleted = true;
            }
          }

          if (capabilityCompleted) {
            completedCapabilities++;
          }
        }
      } else {
        // Legacy format
        for (const capability of assessment.capabilities) {
          let capabilityCompleted = false;
          const dimensions = ['outcome', 'role', 'businessProcess', 'information', 'technology'];

          for (const dimension of dimensions) {
            const dimData =
              capability.dimensions?.[dimension as keyof typeof capability.dimensions];
            if (dimData && dimData.maturityLevel > 0) {
              completedDimensions++;
              capabilityCompleted = true;
            }
          }

          if (capabilityCompleted) {
            completedCapabilities++;
          }
        }
      }
    }

    return {
      totalCapabilities,
      completedCapabilities,
      totalDimensions,
      completedDimensions,
      hasSystemName: Boolean(assessment.metadata?.systemName),
      hasMetadata: Boolean(assessment.metadata),
    };
  }

  /**
   * Create a standardized export error
   */
  private createExportError(
    type: ExportError['type'],
    message: string,
    originalError?: Error,
    context?: Record<string, unknown>
  ): ExportError {
    return {
      type,
      message,
      originalError,
      context,
      recoverable: type !== 'unknown',
    };
  }
}
