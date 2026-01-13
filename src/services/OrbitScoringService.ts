/**
 * OrbitScoringService
 *
 * Scoring service for ORBIT-based assessments.
 * Calculates maturity scores based on the standardized ORBIT criteria
 * across all capability domains.
 */

import type {
  AspectAssessmentResponse,
  AspectScore,
  DimensionScore,
  MaturityLevelWithNA,
  OrbitAssessment,
  OrbitAssessmentResponse,
  OrbitCapabilityAssessment,
  OrbitCapabilityScore,
  OrbitDimensionId,
  StandardDimensionResponse,
  TechnologyDimensionResponse,
  TechnologySubDomainId,
  TechnologySubDomainResponse,
  TechnologySubDomainScore,
} from '../types/orbit';

// =============================================================================
// Score Calculation Types
// =============================================================================

export interface AssessmentScoreSummary {
  totalCapabilities: number;
  completedCapabilities: number;
  overallAverageLevel: number;
  dimensionAverages: Record<OrbitDimensionId, number>;
  completionPercentage: number;
}

export interface ScoringOptions {
  includeOptionalDimensions?: boolean;
  weightByAspectCount?: boolean;
}

// =============================================================================
// Service Implementation
// =============================================================================

class OrbitScoringService {
  private readonly defaultOptions: ScoringOptions = {
    includeOptionalDimensions: false,
    weightByAspectCount: true,
  };

  /**
   * Calculate score for a single aspect
   */
  calculateAspectScore(
    aspectId: string,
    aspectName: string,
    response: AspectAssessmentResponse | undefined
  ): AspectScore {
    if (!response) {
      return {
        aspectId,
        aspectName,
        currentLevel: 0,
        questionCompletion: { answered: 0, total: 0, percentage: 0 },
        evidenceCompletion: { provided: 0, total: 0, percentage: 0 },
      };
    }

    // Count question and evidence completion across all level responses
    let totalQuestions = 0;
    let answeredQuestions = 0;
    let totalEvidence = 0;
    let providedEvidence = 0;

    if (response.levelResponses) {
      for (const levelResponse of Object.values(response.levelResponses)) {
        if (levelResponse) {
          // Count questions
          if (levelResponse.questions) {
            totalQuestions += levelResponse.questions.length;
            answeredQuestions += levelResponse.questions.filter(q => q.answer !== null).length;
          }
          // Count evidence
          if (levelResponse.evidence) {
            totalEvidence += levelResponse.evidence.length;
            providedEvidence += levelResponse.evidence.filter(e => e.provided).length;
          }
        }
      }
    }

    return {
      aspectId,
      aspectName,
      currentLevel: response.currentLevel,
      targetLevel: response.targetLevel,
      questionCompletion: {
        answered: answeredQuestions,
        total: totalQuestions,
        percentage: totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0,
      },
      evidenceCompletion: {
        provided: providedEvidence,
        total: totalEvidence,
        percentage: totalEvidence > 0 ? (providedEvidence / totalEvidence) * 100 : 0,
      },
    };
  }

  /**
   * Calculate score for a standard dimension (non-Technology)
   */
  calculateStandardDimensionScore(
    dimensionId: Exclude<OrbitDimensionId, 'technology'>,
    dimensionName: string,
    response: StandardDimensionResponse | undefined
  ): DimensionScore {
    if (!response || !response.aspects) {
      return {
        dimensionId,
        dimensionName,
        overallLevel: 0,
        aspectScores: [],
        averageLevel: 0,
      };
    }

    const aspectScores: AspectScore[] = [];
    let totalLevel = 0;
    let validAspects = 0;

    for (const [aspectId, aspectResponse] of Object.entries(response.aspects)) {
      const score = this.calculateAspectScore(aspectId, aspectId, aspectResponse);
      aspectScores.push(score);

      // Only count non-N/A levels in average
      if (score.currentLevel !== -1 && score.currentLevel > 0) {
        totalLevel += score.currentLevel;
        validAspects++;
      }
    }

    const averageLevel = validAspects > 0 ? totalLevel / validAspects : 0;

    return {
      dimensionId,
      dimensionName,
      overallLevel: response.overallLevel,
      aspectScores,
      averageLevel: Math.round(averageLevel * 100) / 100,
    };
  }

  /**
   * Calculate score for a Technology sub-domain
   */
  calculateTechnologySubDomainScore(
    subDomainId: TechnologySubDomainId,
    subDomainName: string,
    response: TechnologySubDomainResponse | undefined
  ): TechnologySubDomainScore {
    if (!response || !response.aspects) {
      return {
        subDomainId,
        subDomainName,
        overallLevel: 0,
        aspectScores: [],
        averageLevel: 0,
      };
    }

    const aspectScores: AspectScore[] = [];
    let totalLevel = 0;
    let validAspects = 0;

    for (const [aspectId, aspectResponse] of Object.entries(response.aspects)) {
      const score = this.calculateAspectScore(aspectId, aspectId, aspectResponse);
      aspectScores.push(score);

      if (score.currentLevel !== -1 && score.currentLevel > 0) {
        totalLevel += score.currentLevel;
        validAspects++;
      }
    }

    const averageLevel = validAspects > 0 ? totalLevel / validAspects : 0;

    return {
      subDomainId,
      subDomainName,
      overallLevel: response.overallLevel,
      aspectScores,
      averageLevel: Math.round(averageLevel * 100) / 100,
    };
  }

  /**
   * Calculate score for the Technology dimension
   */
  calculateTechnologyDimensionScore(
    response: TechnologyDimensionResponse | undefined
  ): DimensionScore {
    if (!response || !response.subDomains) {
      return {
        dimensionId: 'technology',
        dimensionName: 'Technology',
        overallLevel: 0,
        aspectScores: [],
        averageLevel: 0,
        subDomainScores: [],
      };
    }

    const subDomainScores: TechnologySubDomainScore[] = [];
    const allAspectScores: AspectScore[] = [];
    let totalLevel = 0;
    let validSubDomains = 0;

    const subDomainNames: Record<TechnologySubDomainId, string> = {
      infrastructure: 'Infrastructure',
      integration: 'Integration',
      'platform-services': 'Platform Services',
      'application-architecture': 'Application Architecture',
      'security-identity': 'Security & Identity',
      'operations-monitoring': 'Operations & Monitoring',
      'development-release': 'Development & Release',
    };

    for (const [subDomainId, subDomainResponse] of Object.entries(response.subDomains)) {
      const score = this.calculateTechnologySubDomainScore(
        subDomainId as TechnologySubDomainId,
        subDomainNames[subDomainId as TechnologySubDomainId] || subDomainId,
        subDomainResponse
      );
      subDomainScores.push(score);
      allAspectScores.push(...score.aspectScores);

      if (score.averageLevel > 0) {
        totalLevel += score.averageLevel;
        validSubDomains++;
      }
    }

    const averageLevel = validSubDomains > 0 ? totalLevel / validSubDomains : 0;

    return {
      dimensionId: 'technology',
      dimensionName: 'Technology',
      overallLevel: response.overallLevel,
      aspectScores: allAspectScores,
      averageLevel: Math.round(averageLevel * 100) / 100,
      subDomainScores,
    };
  }

  /**
   * Calculate complete ORBIT score for a capability
   */
  calculateCapabilityScore(
    capability: OrbitCapabilityAssessment,
    options: ScoringOptions = {}
  ): OrbitCapabilityScore {
    const opts = { ...this.defaultOptions, ...options };
    const orbit = capability.orbit || ({} as OrbitAssessmentResponse);

    const dimensionScores: Record<OrbitDimensionId, DimensionScore> = {
      outcomes: this.calculateStandardDimensionScore('outcomes', 'Outcomes', orbit.outcomes),
      roles: this.calculateStandardDimensionScore('roles', 'Roles', orbit.roles),
      business: this.calculateStandardDimensionScore(
        'business',
        'Business Architecture',
        orbit.business
      ),
      information: this.calculateStandardDimensionScore(
        'information',
        'Information & Data',
        orbit.information
      ),
      technology: this.calculateTechnologyDimensionScore(orbit.technology),
    };

    // Calculate overall average (required dimensions only by default)
    const dimensionsToInclude: OrbitDimensionId[] = opts.includeOptionalDimensions
      ? ['outcomes', 'roles', 'business', 'information', 'technology']
      : ['business', 'information', 'technology'];

    let totalLevel = 0;
    let validDimensions = 0;
    let totalAspects = 0;
    let completedAspects = 0;

    for (const dimId of dimensionsToInclude) {
      const dimScore = dimensionScores[dimId];
      if (dimScore.averageLevel > 0) {
        totalLevel += dimScore.averageLevel;
        validDimensions++;
      }
      totalAspects += dimScore.aspectScores.length;
      completedAspects += dimScore.aspectScores.filter(a => a.currentLevel > 0).length;
    }

    const overallAverageLevel = validDimensions > 0 ? totalLevel / validDimensions : 0;
    const completionPercentage = totalAspects > 0 ? (completedAspects / totalAspects) * 100 : 0;

    return {
      capabilityId: capability.capabilityId,
      capabilityName: capability.capabilityAreaName,
      domainName: capability.capabilityDomainName,
      dimensionScores,
      overallAverageLevel: Math.round(overallAverageLevel * 100) / 100,
      completionPercentage: Math.round(completionPercentage * 100) / 100,
    };
  }

  /**
   * Calculate scores for all capabilities in an assessment
   */
  calculateAssessmentScores(
    assessment: OrbitAssessment,
    options: ScoringOptions = {}
  ): OrbitCapabilityScore[] {
    if (!assessment || !assessment.capabilities) {
      return [];
    }

    return assessment.capabilities.map(cap => this.calculateCapabilityScore(cap, options));
  }

  /**
   * Get summary statistics for an assessment
   */
  getAssessmentSummary(
    assessment: OrbitAssessment,
    options: ScoringOptions = {}
  ): AssessmentScoreSummary {
    const scores = this.calculateAssessmentScores(assessment, options);

    if (scores.length === 0) {
      return {
        totalCapabilities: 0,
        completedCapabilities: 0,
        overallAverageLevel: 0,
        dimensionAverages: {
          outcomes: 0,
          roles: 0,
          business: 0,
          information: 0,
          technology: 0,
        },
        completionPercentage: 0,
      };
    }

    const totalCapabilities = scores.length;
    const completedCapabilities = scores.filter(s => s.completionPercentage >= 100).length;

    // Calculate overall average
    const overallSum = scores.reduce((sum, s) => sum + s.overallAverageLevel, 0);
    const overallAverageLevel = overallSum / totalCapabilities;

    // Calculate dimension averages
    const dimensionAverages: Record<OrbitDimensionId, number> = {
      outcomes: 0,
      roles: 0,
      business: 0,
      information: 0,
      technology: 0,
    };

    const dimensions: OrbitDimensionId[] = [
      'outcomes',
      'roles',
      'business',
      'information',
      'technology',
    ];
    for (const dim of dimensions) {
      const dimSum = scores.reduce((sum, s) => sum + s.dimensionScores[dim].averageLevel, 0);
      dimensionAverages[dim] = Math.round((dimSum / totalCapabilities) * 100) / 100;
    }

    // Calculate overall completion
    const completionSum = scores.reduce((sum, s) => sum + s.completionPercentage, 0);
    const completionPercentage = completionSum / totalCapabilities;

    return {
      totalCapabilities,
      completedCapabilities,
      overallAverageLevel: Math.round(overallAverageLevel * 100) / 100,
      dimensionAverages,
      completionPercentage: Math.round(completionPercentage * 100) / 100,
    };
  }

  /**
   * Get maturity level name
   */
  getLevelName(level: MaturityLevelWithNA): string {
    const names: Record<number, string> = {
      [-1]: 'N/A',
      0: 'Not Assessed',
      1: 'Initial',
      2: 'Developing',
      3: 'Defined',
      4: 'Managed',
      5: 'Optimized',
    };
    return names[level] || 'Unknown';
  }

  /**
   * Get color for maturity level (for visualization)
   */
  getLevelColor(level: MaturityLevelWithNA): string {
    const colors: Record<number, string> = {
      [-1]: '#9e9e9e', // Gray for N/A
      0: '#e0e0e0', // Light gray for not assessed
      1: '#f44336', // Red
      2: '#ff9800', // Orange
      3: '#ffeb3b', // Yellow
      4: '#8bc34a', // Light green
      5: '#4caf50', // Green
    };
    return colors[level] || '#e0e0e0';
  }

  /**
   * Check if a capability assessment is complete
   */
  isCapabilityComplete(capability: OrbitCapabilityAssessment): boolean {
    const score = this.calculateCapabilityScore(capability);
    return score.completionPercentage >= 100;
  }

  /**
   * Get completion status for each dimension
   */
  getDimensionCompletionStatus(
    capability: OrbitCapabilityAssessment
  ): Record<OrbitDimensionId, { complete: boolean; percentage: number }> {
    const score = this.calculateCapabilityScore(capability);

    const status: Record<OrbitDimensionId, { complete: boolean; percentage: number }> = {
      outcomes: { complete: false, percentage: 0 },
      roles: { complete: false, percentage: 0 },
      business: { complete: false, percentage: 0 },
      information: { complete: false, percentage: 0 },
      technology: { complete: false, percentage: 0 },
    };

    for (const [dimId, dimScore] of Object.entries(score.dimensionScores)) {
      const totalAspects = dimScore.aspectScores.length;
      const completedAspects = dimScore.aspectScores.filter(a => a.currentLevel > 0).length;
      const percentage = totalAspects > 0 ? (completedAspects / totalAspects) * 100 : 0;

      status[dimId as OrbitDimensionId] = {
        complete: percentage >= 100,
        percentage: Math.round(percentage * 100) / 100,
      };
    }

    return status;
  }
}

// Export singleton instance
const orbitScoringService = new OrbitScoringService();
export default orbitScoringService;

// Also export the class for testing
export { OrbitScoringService };
