import React from 'react';

/**
 * Spacing value type based on design token scale (0-8)
 * Maps to: 0px, 8px, 16px, 24px, 32px, 40px, 48px, 56px, 64px
 */
export type SpacingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Spacing direction for margin and padding
 */
export type SpacingDirection = 'top' | 'right' | 'bottom' | 'left' | 'x' | 'y' | 'all';

export interface SpacingProps {
  children: React.ReactNode;
  padding?: SpacingValue | Partial<Record<SpacingDirection, SpacingValue>>;
  margin?: SpacingValue | Partial<Record<SpacingDirection, SpacingValue>>;
  className?: string;
}

/**
 * Convert spacing value to CMS Design System class
 */
const getSpacingClass = (
  type: 'padding' | 'margin',
  value: SpacingValue | Partial<Record<SpacingDirection, SpacingValue>>
): string => {
  const prefix = type === 'padding' ? 'ds-u-padding' : 'ds-u-margin';

  // If value is a number, apply to all sides
  if (typeof value === 'number') {
    return `${prefix}--${value}`;
  }

  // If value is an object, apply to specific sides
  const classes: string[] = [];
  Object.entries(value).forEach(([direction, spacing]) => {
    if (spacing !== undefined) {
      if (direction === 'all') {
        classes.push(`${prefix}--${spacing}`);
      } else if (direction === 'x') {
        classes.push(`${prefix}-x--${spacing}`);
      } else if (direction === 'y') {
        classes.push(`${prefix}-y--${spacing}`);
      } else {
        classes.push(`${prefix}-${direction}--${spacing}`);
      }
    }
  });

  return classes.join(' ');
};

/**
 * Spacing Component
 *
 * Provides consistent spacing using CMS Design System utilities.
 * Wraps children in a div with appropriate padding and margin classes.
 *
 * @example
 * // Apply padding of 2 (16px) to all sides
 * <Spacing padding={2}>Content</Spacing>
 *
 * @example
 * // Apply specific padding and margin
 * <Spacing padding={{ top: 3, bottom: 3 }} margin={{ bottom: 2 }}>
 *   Content
 * </Spacing>
 */
const Spacing: React.FC<SpacingProps> = ({ children, padding, margin, className = '' }) => {
  const classes: string[] = [className];

  if (padding !== undefined) {
    classes.push(getSpacingClass('padding', padding));
  }

  if (margin !== undefined) {
    classes.push(getSpacingClass('margin', margin));
  }

  return <div className={classes.join(' ').trim()}>{children}</div>;
};

export default Spacing;
