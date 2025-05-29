// Assessment data types
export interface AssessmentData {
  assessmentId: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  status: 'in-progress' | 'completed';
  capabilities: Record<string, CapabilityAssessment>;
}

export interface CapabilityAssessment {
  id: string;
  name: string;
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