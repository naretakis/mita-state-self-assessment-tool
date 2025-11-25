import React from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import AppHeader from './AppHeader';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showMobileNav?: boolean;
}

/**
 * Main layout component for the application
 * Provides consistent header and footer across pages with responsive features
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'MITA State Self-Assessment Tool',
  maxWidth = 'lg',
}) => {
  const router = useRouter();
  const basePath = router.basePath || '';

  // Get max-width class based on prop
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm':
        return styles.mainNarrow;
      case 'md':
        return styles.mainMedium;
      case 'lg':
        return styles.mainLarge;
      case 'xl':
        return styles.mainExtraLarge;
      case 'full':
        return styles.mainFull;
      default:
        return styles.mainLarge;
    }
  };

  return (
    <div className={`${styles.container} ds-base`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="MITA State Self-Assessment Tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </Head>

      {/* Skip navigation link for accessibility */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <AppHeader />

      <main
        id="main-content"
        className={`${styles.main} ${getMaxWidthClass()} ds-u-padding-y--4 ds-u-padding-x--2`}
      >
        {children}
      </main>

      <footer className={`${styles.footer} ds-u-padding-y--3 ds-u-padding-x--2 ds-u-margin-top--6`}>
        <div className={styles.footerContent}>
          <p className="ds-u-margin--0">MITA State Self-Assessment Tool</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
