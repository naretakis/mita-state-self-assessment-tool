# MITA State Self-Assessment Tool - Phase 1 Completion Checklist

This document outlines the remaining tasks to complete "Development Phase 1: Project Setup and Configuration" for the MITA State Self-Assessment Tool.

## Areas to Address for Phase 1 Completion

### 1. CMS Design System Integration

- Create a wrapper component for CMS Design System
- Import and use CMS Design System CSS
- Replace custom components with CMS Design System components where appropriate

```tsx
// Example: Create src/components/common/CMSProvider.tsx
import React from 'react';
import '@cmsgov/design-system/dist/css/index.css';

interface CMSProviderProps {
  children: React.ReactNode;
}

export const CMSProvider: React.FC<CMSProviderProps> = ({ children }) => {
  return (
    <div className="ds-base">
      {children}
    </div>
  );
};

export default CMSProvider;
```

### 2. Error Boundary Component

- Create an error boundary component to gracefully handle runtime errors
- Implement in the application layout

```tsx
// Example: Create src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 3. Environment Variables Setup

- Create a `.env.local.example` file to document required environment variables

```
# Base path for deployment
NEXT_PUBLIC_BASE_PATH=/mita-state-self-assessment-tool

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_EXPORT_FEATURES=true
```

### 4. Component Index Export

- Complete the component index export file to make importing components easier

```tsx
// Update src/components/index.ts
export { default as Button } from './common/Button';
export { default as Layout } from './layout/Layout';
export { default as ImageOptimizer } from './ImageOptimizer';
// Add more exports as components are created
```

### 5. Browser Storage Detection Hook

- Create a custom hook for browser storage detection

```tsx
// Example: Create src/hooks/useStorageAvailability.ts
import { useState, useEffect } from 'react';

export function useStorageAvailability() {
  const [storageAvailable, setStorageAvailable] = useState<{
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
  }>({
    localStorage: false,
    sessionStorage: false,
    indexedDB: false,
  });

  useEffect(() => {
    // Check localStorage
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      setStorageAvailable(prev => ({ ...prev, localStorage: true }));
    } catch (e) {
      console.warn('localStorage not available:', e);
    }

    // Check sessionStorage
    try {
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      setStorageAvailable(prev => ({ ...prev, sessionStorage: true }));
    } catch (e) {
      console.warn('sessionStorage not available:', e);
    }

    // Check indexedDB
    try {
      const testRequest = indexedDB.open('__idb_test__');
      testRequest.onerror = () => {
        console.warn('indexedDB not available');
      };
      testRequest.onsuccess = () => {
        testRequest.result.close();
        indexedDB.deleteDatabase('__idb_test__');
        setStorageAvailable(prev => ({ ...prev, indexedDB: true }));
      };
    } catch (e) {
      console.warn('indexedDB not available:', e);
    }
  }, []);

  return storageAvailable;
}

export default useStorageAvailability;
```

### 6. README Updates

- Update the README.md file with more detailed setup and contribution instructions
- Include information about project structure, available scripts, and prerequisites

### 7. Basic Theme Configuration

- Create a theme configuration file to ensure consistent styling

```tsx
// Example: Create src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#0071bc',
    secondary: '#205493',
    background: '#f1f1f1',
    text: '#212121',
    error: '#e31c3d',
    success: '#2e8540',
    warning: '#fdb81e',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    widescreen: '1200px',
  },
  typography: {
    fontFamily: '"Source Sans Pro", "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
    fontSize: {
      small: '14px',
      base: '16px',
      large: '18px',
      heading: {
        h1: '32px',
        h2: '24px',
        h3: '20px',
        h4: '18px',
      },
    },
  },
};

export default theme;
```

### 8. Content Loading Client-Side Utility

- Create a utility for loading content on the client side

```tsx
// Example: Create src/utils/clientContentLoader.ts
import { CapabilityDefinition } from '../types';
import { memoryCache, CACHE_DURATIONS } from './cacheUtils';

/**
 * Client-side utility for loading capability content
 */
export async function loadCapabilityContent(capabilityId: string): Promise<CapabilityDefinition | null> {
  // Check cache first
  const cachedCapability = memoryCache.get<CapabilityDefinition>(`capability-${capabilityId}`);
  if (cachedCapability) {
    return cachedCapability;
  }
  
  try {
    // Fetch the content file
    const response = await fetch(`/content/${capabilityId}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load capability: ${response.status}`);
    }
    
    const content = await response.text();
    
    // Use dynamic import to load the parser only when needed
    const { parseCapabilityMarkdown } = await import('./markdownParser');
    const capability = parseCapabilityMarkdown(content);
    
    // Cache the result
    memoryCache.set(`capability-${capabilityId}`, capability, CACHE_DURATIONS.MEDIUM);
    
    return capability;
  } catch (error) {
    console.error(`Error loading capability ${capabilityId}:`, error);
    return null;
  }
}

export default { loadCapabilityContent };
```

## Completion Criteria

Once these items are implemented, the "Development Phase 1: Project Setup and Configuration" will be complete, and the project will be ready to move on to implementing the assessment workflow and user interface components.

## Next Steps After Phase 1

1. Implement the assessment workflow components
2. Create the capability selection interface
3. Develop the dimension assessment forms
4. Build the reporting and visualization components
5. Implement the export functionality