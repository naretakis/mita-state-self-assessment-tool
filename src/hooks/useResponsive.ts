import { useEffect, useState } from 'react';

import { designTokens } from '@/config/designTokens';

export interface ResponsiveState {
  viewport: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
}

/**
 * Custom hook for responsive viewport detection
 *
 * Detects viewport size and provides responsive state information
 * based on CMS Design System breakpoints.
 *
 * @returns ResponsiveState object with viewport information
 */
export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    // Server-side rendering fallback
    if (typeof window === 'undefined') {
      return {
        viewport: 'desktop',
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
      };
    }

    return getResponsiveState();
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setState(getResponsiveState());
    };

    // Initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return state;
};

/**
 * Get current responsive state based on window dimensions
 */
function getResponsiveState(): ResponsiveState {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Determine viewport type based on breakpoints
  let viewport: 'mobile' | 'tablet' | 'desktop';
  if (width < designTokens.breakpoints.md) {
    viewport = 'mobile';
  } else if (width < designTokens.breakpoints.lg) {
    viewport = 'tablet';
  } else {
    viewport = 'desktop';
  }

  // Detect touch device
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ('msMaxTouchPoints' in navigator &&
      (navigator as { msMaxTouchPoints: number }).msMaxTouchPoints > 0);

  return {
    viewport,
    width,
    height,
    isMobile: viewport === 'mobile',
    isTablet: viewport === 'tablet',
    isDesktop: viewport === 'desktop',
    isTouchDevice,
  };
}

/**
 * Hook to check if viewport matches a specific breakpoint
 * @param breakpoint - Breakpoint to check ('sm' | 'md' | 'lg' | 'xl')
 */
export const useBreakpoint = (breakpoint: keyof typeof designTokens.breakpoints): boolean => {
  const { width } = useResponsive();
  return width >= designTokens.breakpoints[breakpoint];
};

export default useResponsive;
