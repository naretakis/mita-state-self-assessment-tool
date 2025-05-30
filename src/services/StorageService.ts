import { Assessment, AssessmentData, AssessmentSummary, AssessmentStatus, DimensionAssessment, OldDimensionAssessment } from '@/types';

const STORAGE_KEY_PREFIX = 'mita-assessment-';
const ASSESSMENT_LIST_KEY = 'mita-assessment-list';
const STORAGE_VERSION = '1.0';

/**
 * Service for managing browser storage operations
 */
export const StorageService = {
  /**
   * Save assessment data to browser storage using a tiered approach
   */
  saveAssessment: async (assessment: Assessment): Promise<boolean> => {
    try {
      // First try to save to localStorage
      try {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${assessment.id}`, 
          JSON.stringify(assessment)
        );
        // Update the assessment list
        await StorageService.updateAssessmentList(assessment);
        return true;
      } catch (localStorageError) {
        // If localStorage fails (likely due to size), try IndexedDB
        // Note: In a real implementation, we would add IndexedDB logic here
        console.warn('localStorage save failed, would use IndexedDB in production', localStorageError);
        return false;
      }
    } catch (error) {
      console.error('Error saving assessment data:', error);
      return false;
    }
  },

  /**
   * Load assessment data from browser storage
   */
  loadAssessment: async (id: string): Promise<Assessment | null> => {
    try {
      // First try localStorage
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
      if (data) {
        return JSON.parse(data);
      }
      
      // If not in localStorage, would try IndexedDB in a real implementation
      console.warn('Assessment not found in localStorage, would check IndexedDB in production');
      return null;
    } catch (error) {
      console.error('Error loading assessment data:', error);
      return null;
    }
  },

  /**
   * List all saved assessments
   */
  listAssessments: async (): Promise<AssessmentSummary[]> => {
    try {
      const listData = localStorage.getItem(ASSESSMENT_LIST_KEY);
      return listData ? JSON.parse(listData) : [];
    } catch (error) {
      console.error('Error listing assessments:', error);
      return [];
    }
  },

  /**
   * Update the assessment list with summary information
   */
  updateAssessmentList: async (assessment: Assessment): Promise<boolean> => {
    try {
      // Get current list
      const currentList = await StorageService.listAssessments();
      
      // Create summary
      const summary: AssessmentSummary = {
        id: assessment.id,
        stateName: assessment.stateName,
        createdAt: assessment.createdAt,
        updatedAt: assessment.updatedAt,
        status: assessment.status,
        completionPercentage: calculateCompletionPercentage(assessment)
      };
      
      // Update or add to list
      const updatedList = currentList.some(item => item.id === assessment.id)
        ? currentList.map(item => item.id === assessment.id ? summary : item)
        : [...currentList, summary];
      
      // Save updated list
      localStorage.setItem(ASSESSMENT_LIST_KEY, JSON.stringify(updatedList));
      return true;
    } catch (error) {
      console.error('Error updating assessment list:', error);
      return false;
    }
  },

  /**
   * Delete assessment by ID
   */
  deleteAssessment: async (id: string): Promise<boolean> => {
    try {
      // Remove from localStorage
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
      
      // Update list
      const currentList = await StorageService.listAssessments();
      const updatedList = currentList.filter(item => item.id !== id);
      localStorage.setItem(ASSESSMENT_LIST_KEY, JSON.stringify(updatedList));
      
      // In a real implementation, would also remove from IndexedDB if present
      return true;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      return false;
    }
  },

  /**
   * Export assessment to JSON file
   */
  exportAssessment: async (id: string): Promise<Blob> => {
    const assessment = await StorageService.loadAssessment(id);
    if (!assessment) {
      throw new Error(`Assessment with ID ${id} not found`);
    }
    
    const jsonString = JSON.stringify(assessment, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  },

  /**
   * Import assessment from JSON file
   */
  importAssessment: async (file: File): Promise<Assessment> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          if (!event.target?.result) {
            throw new Error('Failed to read file');
          }
          
          const assessment = JSON.parse(event.target.result as string) as Assessment;
          
          // Validate the imported data structure
          if (!assessment.id || !assessment.stateName || !assessment.capabilities) {
            throw new Error('Invalid assessment data structure');
          }
          
          // Save the imported assessment
          const saved = await StorageService.saveAssessment(assessment);
          if (!saved) {
            throw new Error('Failed to save imported assessment');
          }
          
          resolve(assessment);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  },

  /**
   * Check if browser storage is available
   */
  isStorageAvailable: (): boolean => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Migrate from old data format to new format
   */
  migrateOldData: async (): Promise<boolean> => {
    try {
      // Check for old format data
      const oldData = localStorage.getItem('mita-assessment-data');
      if (!oldData) {
        return false; // No old data to migrate
      }
      
      const oldAssessment = JSON.parse(oldData) as AssessmentData;
      
      // Convert to new format
      const newAssessment: Assessment = {
        id: oldAssessment.assessmentId,
        stateName: oldAssessment.stateName,
        createdAt: oldAssessment.createdAt,
        updatedAt: oldAssessment.updatedAt,
        status: oldAssessment.status as AssessmentStatus,
        capabilities: Object.values(oldAssessment.capabilities).map(cap => ({
          id: cap.id,
          capabilityId: cap.id,
          name: cap.name,
          domainName: 'Unknown', // Default value
          moduleName: 'Unknown', // Default value
          status: 'in-progress',
          dimensions: {
            outcome: migrateOldDimension(cap.dimensions.outcome),
            role: migrateOldDimension(cap.dimensions.role),
            businessProcess: migrateOldDimension(cap.dimensions.businessProcess),
            information: migrateOldDimension(cap.dimensions.information),
            technology: migrateOldDimension(cap.dimensions.technology),
          }
        })),
        metadata: {
          version: STORAGE_VERSION,
        }
      };
      
      // Save in new format
      const saved = await StorageService.saveAssessment(newAssessment);
      
      // If successful, remove old data
      if (saved) {
        localStorage.removeItem('mita-assessment-data');
      }
      
      return saved;
    } catch (error) {
      console.error('Error migrating old data:', error);
      return false;
    }
  }
};

/**
 * Helper function to migrate old dimension data to new format
 */
function migrateOldDimension(oldDimension: OldDimensionAssessment): DimensionAssessment {
  return {
    maturityLevel: oldDimension.maturityLevel || 1,
    evidence: oldDimension.evidence || '',
    barriers: '',
    plans: '',
    notes: oldDimension.notes || '',
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Helper function to calculate completion percentage
 */
function calculateCompletionPercentage(assessment: Assessment): number {
  if (!assessment.capabilities.length) return 0;
  
  const totalDimensions = assessment.capabilities.length * 5; // 5 dimensions per capability
  let completedDimensions = 0;
  
  assessment.capabilities.forEach(capability => {
    Object.values(capability.dimensions).forEach(dimension => {
      if (dimension.maturityLevel > 0 && dimension.evidence) {
        completedDimensions++;
      }
    });
  });
  
  return Math.round((completedDimensions / totalDimensions) * 100);
}

export default StorageService;