// Assessment data types
export type AssessmentStatus = 
  | 'not-started'
  | 'in-progress' 
  | 'completed';

export interface Assessment {
  id: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  status: AssessmentStatus;
  capabilities: CapabilityAssessment[];
  metadata: AssessmentMetadata;
}

export interface AssessmentMetadata {
  version: string;
  completedBy?: string;
  reviewedBy?: string;
  submissionDate?: string;
  notes?: string;
}

export interface CapabilityAssessment {
  id: string;
  capabilityId: string;
  name: string;
  domainName: string;
  moduleName: string;
  status: AssessmentStatus;
  dimensions: {
    outcome: DimensionAssessment;
    role: DimensionAssessment;
    businessProcess: DimensionAssessment;
    information: DimensionAssessment;
    technology: DimensionAssessment;
  };
}

export interface DimensionAssessment {
  maturityLevel: number;
  evidence: string;
  barriers: string;
  plans: string;
  notes: string;
  targetMaturityLevel?: number;
  lastUpdated: string;
}

export interface AssessmentSummary {
  id: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  status: AssessmentStatus;
  completionPercentage: number;
}

// For backward compatibility
export interface AssessmentData {
  assessmentId: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  status: 'in-progress' | 'completed';
  capabilities: Record<string, OldCapabilityAssessment>;
}

// Old interfaces for backward compatibility
export interface OldCapabilityAssessment {
  id: string;
  name: string;
  dimensions: {
    outcome: OldDimensionAssessment;
    role: OldDimensionAssessment;
    businessProcess: OldDimensionAssessment;
    information: OldDimensionAssessment;
    technology: OldDimensionAssessment;
  };
}

export interface OldDimensionAssessment {
  maturityLevel: number;
  notes: string;
  evidence: string;
}

// MITA Framework types
export interface Capability {
  id: string;
  name: string;
  description: string;
  domain: string;
  area: string;
  dimensions: {
    outcome: CapabilityDimension;
    role: CapabilityDimension;
    businessProcess: CapabilityDimension;
    information: CapabilityDimension;
    technology: CapabilityDimension;
  };
}

export interface CapabilityDimension {
  description: string;
  levels: MaturityLevel[];
}

export interface MaturityLevel {
  level: number;
  description: string;
  criteria: string[];
}

// New capability definition model
export interface CapabilityDefinition {
  id: string;
  name: string;
  domainName: string;
  moduleName: string;
  version: string;
  lastUpdated: string;
  description: string;
  dimensions: {
    outcome: DimensionDefinition;
    role: DimensionDefinition;
    businessProcess: DimensionDefinition;
    information: DimensionDefinition;
    technology: DimensionDefinition;
  };
}

export interface DimensionDefinition {
  description: string;
  assessmentQuestions: string[];
  maturityLevels: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
}