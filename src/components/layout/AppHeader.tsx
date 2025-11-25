import React, { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { useResponsive } from '@/hooks/useResponsive';

import styles from './Layout.module.css';
import MobileNav from './MobileNav';

/**
 * App Header Component
 *
 * Reusable header with navigation that can be used across different layouts.
 * Provides consistent branding and navigation throughout the application.
 */
const AppHeader: React.FC = () => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Navigation items
  const navItems = [
    { label: 'Home', href: '/', icon: '🏠', external: false },
    { label: 'Dashboard', href: '/dashboard', icon: '📊', external: false },
    { label: 'About Tool', href: '/about-tool', icon: 'ℹ️', external: false },
    {
      label: 'About MITA',
      href: 'https://cmsgov.github.io/Medicaid-Information-Technology-Architecture-MITA/',
      icon: '📖',
      external: true,
    },
  ];

  return (
    <header className={`${styles.header} ds-u-padding-y--3 ds-u-padding-x--2`}>
      <div className={styles.headerContent}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.titleLink}>
            <h1 className={`${styles.title} ${isMobile ? styles.titleMobile : ''}`}>
              MITA State Self-Assessment Tool
            </h1>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className={styles.desktopNav} aria-label="Main navigation">
              <ul className={styles.desktopNavList}>
                {navItems.map((item, index) => {
                  const isActive = !item.external && router.pathname === item.href;
                  return (
                    <li key={index}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.desktopNavLink}
                        >
                          {item.label}
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="currentColor"
                            aria-hidden="true"
                            style={{ marginLeft: '0.25rem' }}
                          >
                            <path d="M10.5 1.5h-3v1h1.793L4.146 7.646l.708.708L10 3.207V5h1V1.5z" />
                            <path d="M9 9H3V3h3V2H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6H9v3z" />
                          </svg>
                          <span className="ds-u-visibility--screen-reader">
                            {' '}
                            (opens in new tab)
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className={`${styles.desktopNavLink} ${isActive ? styles.desktopNavLinkActive : ''}`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <MobileNav
              items={navItems}
              isOpen={mobileNavOpen}
              onToggle={() => setMobileNavOpen(!mobileNavOpen)}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
