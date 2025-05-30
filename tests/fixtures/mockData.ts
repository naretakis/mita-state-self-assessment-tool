/**
 * Mock data for testing components
 */

// Mock assessment data
export const mockAssessmentData = {
  id: 'assessment-1',
  title: 'MITA Self-Assessment 2023',
  state: 'Example State',
  date: '2023-10-15',
  status: 'in-progress',
  sections: [
    {
      id: 'section-1',
      title: 'Business Architecture',
      completed: false,
      capabilities: [
        {
          id: 'capability-1',
          name: 'Member Management',
          description: 'Capability for managing member information',
          currentLevel: 2,
          targetLevel: 3,
          justification: 'Current systems support basic member management',
          asIsDescription: 'Manual processes with some automation',
          toBeDescription: 'Fully automated member management system'
        }
      ]
    }
  ]
};

// Mock user data
export const mockUserData = {
  id: 'user-1',
  name: 'Test User',
  role: 'assessor',
  email: 'test@example.gov',
  state: 'Example State',
  lastLogin: '2023-10-14T10:30:00Z'
};

// Mock content data
export const mockContentData = {
  framework: {
    title: 'MITA Framework',
    version: '3.0',
    domains: [
      {
        name: 'Business Architecture',
        description: 'Business processes and capabilities',
        capabilities: [
          {
            name: 'Member Management',
            description: 'Capability for managing member information',
            levels: [
              {
                level: 1,
                description: 'Primarily manual processes'
              },
              {
                level: 2,
                description: 'Mix of manual and automated processes'
              },
              {
                level: 3,
                description: 'Primarily automated processes'
              },
              {
                level: 4,
                description: 'Fully automated with advanced analytics'
              },
              {
                level: 5,
                description: 'Optimized processes with continuous improvement'
              }
            ]
          }
        ]
      }
    ]
  }
};