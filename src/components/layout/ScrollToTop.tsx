import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to top of page on route changes.
 * Targets the main content container since the app uses a flex layout
 * where the main element scrolls, not the window.
 */
export function ScrollToTop(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    // The main content area has id="main-content" and is the scrollable container
    const mainContent = document.getElementById('main-content');
    // scrollTo may not exist in test environments (jsdom)
    if (mainContent?.scrollTo) {
      mainContent.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
