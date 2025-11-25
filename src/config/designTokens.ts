/**
 * Design Token Configuration
 *
 * Centralizes design system values for consistent theming across the application.
 * Based on CMS Design System standards with MITA-specific customizations.
 */

export interface ThemeConfig {
  spacing: {
    unit: number;
    scale: number[];
  };
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  touchTargets: {
    minimum: number;
    comfortable: number;
  };
  typography: {
    baseFontSize: number;
    lineHeight: number;
    scale: number[];
  };
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    text: string;
    background: string;
    border: string;
  };
  contrast: {
    normalText: number;
    largeText: number;
    uiComponents: number;
  };
}

/**
 * Design tokens following CMS Design System standards
 */
export const designTokens: ThemeConfig = {
  spacing: {
    unit: 8, // Base spacing unit in pixels
    scale: [0, 8, 16, 24, 32, 40, 48, 56, 64], // 0-8 scale
  },
  breakpoints: {
    sm: 544, // Mobile phones
    md: 768, // Tablets
    lg: 1024, // Desktop
    xl: 1280, // Large desktop
  },
  touchTargets: {
    minimum: 44, // WCAG 2.1 AA minimum
    comfortable: 48, // Comfortable touch target size
  },
  typography: {
    baseFontSize: 16,
    lineHeight: 1.5,
    scale: [0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.875, 2.25, 3], // rem scale
  },
  colors: {
    primary: '#0071bc',
    secondary: '#112e51',
    success: '#2e8540',
    warning: '#fdb81e',
    error: '#d83933',
    text: '#212121',
    background: '#f9f9f9',
    border: '#dcdee0',
  },
  contrast: {
    normalText: 4.5, // WCAG AA for normal text
    largeText: 3.0, // WCAG AA for large text (18px+)
    uiComponents: 3.0, // WCAG AA for UI components
  },
};

/**
 * Spacing utility function
 * Converts spacing scale value to pixels
 */
export const getSpacing = (scale: number): number => {
  return designTokens.spacing.scale[scale] || 0;
};

/**
 * Breakpoint utility function
 * Returns media query string for given breakpoint
 */
export const getBreakpoint = (size: keyof ThemeConfig['breakpoints']): string => {
  return `${designTokens.breakpoints[size]}px`;
};

/**
 * Check if viewport width matches a breakpoint
 */
export const matchesBreakpoint = (
  width: number,
  size: keyof ThemeConfig['breakpoints']
): boolean => {
  return width >= designTokens.breakpoints[size];
};

export default designTokens;
