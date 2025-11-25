import React from 'react';

/**
 * Grid Container Props
 */
export interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

/**
 * Grid Row Props
 */
export interface GridRowProps {
  children: React.ReactNode;
  className?: string;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

/**
 * Grid Column Props
 */
export interface GridColProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

/**
 * Grid Container Component
 *
 * Provides a responsive container with optional max-width.
 * Uses CMS Design System container classes.
 *
 * @example
 * <GridContainer>
 *   <GridRow>
 *     <GridCol span={12}>Content</GridCol>
 *   </GridRow>
 * </GridContainer>
 */
export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  className = '',
  fluid = false,
  gap,
}) => {
  const classes = ['ds-l-container'];

  if (fluid) {
    classes.push('ds-l-container--fluid');
  }

  if (gap !== undefined) {
    classes.push(`ds-u-gap--${gap}`);
  }

  if (className) {
    classes.push(className);
  }

  return <div className={classes.join(' ')}>{children}</div>;
};

/**
 * Grid Row Component
 *
 * Creates a flexbox row for grid columns.
 * Uses CMS Design System row classes.
 *
 * @example
 * <GridRow gap={3} align="center">
 *   <GridCol span={6}>Left</GridCol>
 *   <GridCol span={6}>Right</GridCol>
 * </GridRow>
 */
export const GridRow: React.FC<GridRowProps> = ({
  children,
  className = '',
  gap,
  align,
  justify,
}) => {
  const classes = ['ds-l-row'];

  if (gap !== undefined) {
    classes.push(`ds-u-gap--${gap}`);
  }

  if (align) {
    const alignMap = {
      start: 'ds-u-align-items--start',
      center: 'ds-u-align-items--center',
      end: 'ds-u-align-items--end',
      stretch: 'ds-u-align-items--stretch',
    };
    classes.push(alignMap[align]);
  }

  if (justify) {
    const justifyMap = {
      start: 'ds-u-justify-content--start',
      center: 'ds-u-justify-content--center',
      end: 'ds-u-justify-content--end',
      between: 'ds-u-justify-content--between',
      around: 'ds-u-justify-content--around',
    };
    classes.push(justifyMap[justify]);
  }

  if (className) {
    classes.push(className);
  }

  return <div className={classes.join(' ')}>{children}</div>;
};

/**
 * Grid Column Component
 *
 * Creates a responsive column within a grid row.
 * Supports different column spans at different breakpoints.
 *
 * @example
 * // Full width on mobile, half on tablet, third on desktop
 * <GridCol span={12} md={6} lg={4}>
 *   Content
 * </GridCol>
 */
export const GridCol: React.FC<GridColProps> = ({
  children,
  className = '',
  span = 12,
  sm,
  md,
  lg,
  xl,
}) => {
  const classes = [];

  // Base span (mobile-first)
  classes.push(`ds-l-col--${span}`);

  // Responsive spans
  if (sm) {
    classes.push(`ds-l-sm-col--${sm}`);
  }
  if (md) {
    classes.push(`ds-l-md-col--${md}`);
  }
  if (lg) {
    classes.push(`ds-l-lg-col--${lg}`);
  }
  if (xl) {
    classes.push(`ds-l-xl-col--${xl}`);
  }

  if (className) {
    classes.push(className);
  }

  return <div className={classes.join(' ')}>{children}</div>;
};

// Export as default object for convenience
const Grid = {
  Container: GridContainer,
  Row: GridRow,
  Col: GridCol,
};

export default Grid;
