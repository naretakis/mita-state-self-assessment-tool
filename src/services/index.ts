/**
 * Services Index
 *
 * Central export point for all application services.
 */

// ORBIT Maturity Model service
export { OrbitMaturityService, default as orbitMaturityService } from './OrbitMaturityService';

// ORBIT Scoring service
export { OrbitScoringService, default as orbitScoringService } from './OrbitScoringService';
export type { AssessmentScoreSummary, ScoringOptions } from './OrbitScoringService';

// Capability service (ORBIT-compatible)
export { CapabilityService, default as capabilityService } from './CapabilityService';

// Legacy scoring service (for backward compatibility with legacy assessments)
export { ScoringService, default as scoringService } from './ScoringService';
