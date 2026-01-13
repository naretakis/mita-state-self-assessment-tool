export { useBreakpoint, default as useResponsive } from './useResponsive';
export type { ResponsiveState } from './useResponsive';
export { default as useStorageAvailability } from './useStorageAvailability';

// ORBIT Maturity Model hooks
export {
  useOrbitDimension,
  useOrbitModel,
  useTechnologySubDomain,
  useTechnologySubDomains,
} from './useOrbitModel';
export type { DimensionSummaryItem, UseOrbitModelReturn } from './useOrbitModel';

// Capability hooks (ORBIT-compatible)
export {
  useCapabilities,
  useCapability,
  useCapabilityDomain,
  useCapabilitySelection,
} from './useCapabilities';
