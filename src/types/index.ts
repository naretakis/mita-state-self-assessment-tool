// Core data models based on data_models.md

export interface Assessment {
  id: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  status: AssessmentStatus;
  capabilities: CapabilityAssessment[];
  metadata: AssessmentMetadata;
}

export type AssessmentStatus = 
  | 'not-started'
  | 'in-progress' 
  | 'completed';

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
    informationData: DimensionAssessment;
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
    informationData: DimensionDefinition;
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

export interface AssessmentSummary {
  id: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  status: AssessmentStatus;
  completionPercentage: number;
}

// Front matter metadata interface
export interface CapabilityFrontMatter {
  capabilityDomain: string;
  capabilityArea: string;
  version: string;
  capabilityAreaCreated: string;
  capabilityAreaLastUpdated: string;
  assessmentCreated?: string;
  assessmentUpdated?: string;
  assessmentStatus?: AssessmentStatus;
}

// Legacy data structure for migration
export interface AssessmentData {
  assessmentId: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  capabilities: Record<string, OldCapabilityAssessment>;
}

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
  evidence: string;
  notes: string;
}