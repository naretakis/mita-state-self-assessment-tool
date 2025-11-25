import React from 'react';

export interface LiveRegionProps {
  children: React.ReactNode;
  /**
   * Politeness level for screen reader announcements
   * - 'polite': Wait for current speech to finish
   * - 'assertive': Interrupt current speech
   * - 'off': No announcement
   */
  politeness?: 'polite' | 'assertive' | 'off';
  /**
   * Whether the region should be visible
   */
  visible?: boolean;
  className?: string;
}

/**
 * Live Region Component
 *
 * Provides ARIA live region for dynamic content updates that should be
 * announced to screen readers.
 *
 * @example
 * <LiveRegion politeness="polite">
 *   Assessment saved successfully
 * </LiveRegion>
 */
const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  visible = true,
  className = '',
}) => {
  const classes = [className];

  if (!visible) {
    classes.push('ds-u-visibility--screen-reader');
  }

  return (
    <div
      role={politeness === 'off' ? undefined : 'status'}
      aria-live={politeness}
      aria-atomic="true"
      className={classes.join(' ')}
    >
      {children}
    </div>
  );
};

export default LiveRegion;
