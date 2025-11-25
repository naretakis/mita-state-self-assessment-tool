/**
 * Test Utilities
 *
 * Helper functions for testing spacing, contrast ratios, and accessibility
 */

/**
 * Calculate relative luminance of a color
 * Used for contrast ratio calculations
 * @param rgb - RGB color values [r, g, b] where each value is 0-255
 */
export const getRelativeLuminance = (rgb: [number, number, number]): number => {
  const [r, g, b] = rgb.map(val => {
    const normalized = val / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First color as RGB array [r, g, b]
 * @param color2 - Second color as RGB array [r, g, b]
 * @returns Contrast ratio (1-21)
 */
export const getContrastRatio = (
  color1: [number, number, number],
  color2: [number, number, number]
): number => {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Parse hex color to RGB
 * @param hex - Hex color string (e.g., '#0071bc' or '0071bc')
 */
export const hexToRgb = (hex: string): [number, number, number] => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return [r, g, b];
};

/**
 * Check if contrast ratio meets WCAG AA standards
 * @param ratio - Contrast ratio to check
 * @param isLargeText - Whether the text is large (18px+ or 14px+ bold)
 */
export const meetsContrastStandard = (ratio: number, isLargeText = false): boolean => {
  const requiredRatio = isLargeText ? 3.0 : 4.5;
  return ratio >= requiredRatio;
};

/**
 * Get computed spacing between two elements
 * @param element1 - First element
 * @param element2 - Second element (should be after element1 in DOM)
 */
export const getSpacingBetween = (element1: HTMLElement, element2: HTMLElement): number => {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  // Calculate vertical spacing
  if (rect2.top >= rect1.bottom) {
    return rect2.top - rect1.bottom;
  }

  // Calculate horizontal spacing
  if (rect2.left >= rect1.right) {
    return rect2.left - rect1.right;
  }

  // Elements overlap or are not adjacent
  return 0;
};

/**
 * Check if element meets minimum touch target size
 * @param element - Element to check
 * @param minSize - Minimum size in pixels (default 44)
 */
export const meetsTouchTargetSize = (element: HTMLElement, minSize = 44): boolean => {
  const rect = element.getBoundingClientRect();
  return rect.width >= minSize && rect.height >= minSize;
};

/**
 * Get distance from element to viewport edge
 * @param element - Element to check
 * @param edge - Which edge to check ('top' | 'right' | 'bottom' | 'left')
 */
export const getDistanceToViewportEdge = (
  element: HTMLElement,
  edge: 'top' | 'right' | 'bottom' | 'left'
): number => {
  const rect = element.getBoundingClientRect();
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  switch (edge) {
    case 'top':
      return rect.top;
    case 'right':
      return viewport.width - rect.right;
    case 'bottom':
      return viewport.height - rect.bottom;
    case 'left':
      return rect.left;
    default:
      return 0;
  }
};

/**
 * Check if elements overlap
 * @param element1 - First element
 * @param element2 - Second element
 */
export const elementsOverlap = (element1: HTMLElement, element2: HTMLElement): boolean => {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return !(
    rect1.right <= rect2.left ||
    rect1.left >= rect2.right ||
    rect1.bottom <= rect2.top ||
    rect1.top >= rect2.bottom
  );
};

/**
 * Check if element has accessible name
 * @param element - Element to check
 */
export const hasAccessibleName = (element: HTMLElement): boolean => {
  // Check for aria-label
  if (element.getAttribute('aria-label')) {
    return true;
  }

  // Check for aria-labelledby
  if (element.getAttribute('aria-labelledby')) {
    return true;
  }

  // Check for text content
  const textContent = element.textContent?.trim();
  if (textContent && textContent.length > 0) {
    return true;
  }

  // Check for alt attribute (images)
  if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
    return true;
  }

  // Check for title attribute
  if (element.getAttribute('title')) {
    return true;
  }

  return false;
};

/**
 * Check if form input has associated label
 * @param input - Input element to check
 */
export const hasAssociatedLabel = (
  input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
): boolean => {
  // Check for aria-labelledby
  if (input.getAttribute('aria-labelledby')) {
    return true;
  }

  // Check for aria-label
  if (input.getAttribute('aria-label')) {
    return true;
  }

  // Check for associated label via for/id
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) {
      return true;
    }
  }

  // Check if input is wrapped in a label
  const parentLabel = input.closest('label');
  if (parentLabel) {
    return true;
  }

  return false;
};

/**
 * Get all focusable elements within a container
 * @param container - Container element
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector));
};

/**
 * Check if page has horizontal scrolling
 */
export const hasHorizontalScroll = (): boolean => {
  return document.body.scrollWidth > window.innerWidth;
};

/**
 * Check if element uses CMS Design System classes
 * @param element - Element to check
 */
export const usesCMSDesignSystem = (element: HTMLElement): boolean => {
  const classList = Array.from(element.classList);
  return classList.some(className => className.startsWith('ds-'));
};

/**
 * Get heading level from element
 * @param element - Heading element
 */
export const getHeadingLevel = (element: HTMLElement): number | null => {
  const match = element.tagName.match(/^H([1-6])$/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Check if heading hierarchy is valid on page
 */
export const hasValidHeadingHierarchy = (): boolean => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const levels = headings
    .map(h => getHeadingLevel(h as HTMLElement))
    .filter(l => l !== null) as number[];

  // Check for exactly one h1
  const h1Count = levels.filter(l => l === 1).length;
  if (h1Count !== 1) {
    return false;
  }

  // Check for no skipped levels
  for (let i = 1; i < levels.length; i++) {
    const diff = levels[i] - levels[i - 1];
    if (diff > 1) {
      return false; // Skipped a level
    }
  }

  return true;
};

export default {
  getRelativeLuminance,
  getContrastRatio,
  hexToRgb,
  meetsContrastStandard,
  getSpacingBetween,
  meetsTouchTargetSize,
  getDistanceToViewportEdge,
  elementsOverlap,
  hasAccessibleName,
  hasAssociatedLabel,
  getFocusableElements,
  hasHorizontalScroll,
  usesCMSDesignSystem,
  getHeadingLevel,
  hasValidHeadingHierarchy,
};
