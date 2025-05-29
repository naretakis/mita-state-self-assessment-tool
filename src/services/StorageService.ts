import { AssessmentData } from '@/types';

const STORAGE_KEY = 'mita-assessment-data';

/**
 * Service for managing browser storage operations
 */
export const StorageService = {
  /**
   * Save assessment data to browser storage
   */
  saveAssessment: (data: AssessmentData): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving assessment data:', error);
      return false;
    }
  },

  /**
   * Load assessment data from browser storage
   */
  loadAssessment: (): AssessmentData | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading assessment data:', error);
      return null;
    }
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
   * Clear assessment data from browser storage
   */
  clearAssessment: (): boolean => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing assessment data:', error);
      return false;
    }
  }
};

export default StorageService;