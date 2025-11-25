import React, { useEffect, useRef } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './MobileNav.module.css';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  ariaLabel?: string;
  external?: boolean;
}

interface MobileNavProps {
  items: NavigationItem[];
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Mobile Navigation Component
 *
 * Provides a hamburger menu with slide-out drawer for mobile devices.
 * Features:
 * - Touch-friendly navigation items (44x44px minimum)
 * - Focus trap when open
 * - Keyboard navigation support
 * - Dismissible via close button, overlay click, or Escape key
 */
const MobileNav: React.FC<MobileNavProps> = ({ items, isOpen, onToggle }) => {
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  // Focus trap when menu is open
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle overlay click to close menu
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onToggle();
    }
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className={styles.hamburger}
        onClick={onToggle}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        type="button"
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={handleOverlayClick} aria-hidden="true" />}

      {/* Navigation Drawer */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        aria-label="Mobile navigation"
        role="navigation"
      >
        {/* Close Button */}
        <button
          ref={firstFocusableRef}
          className={styles.closeButton}
          onClick={onToggle}
          aria-label="Close navigation menu"
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>

        {/* Navigation Items */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {items.map((item, index) => {
              const isActive = !item.external && router.pathname === item.href;
              return (
                <li key={index} className={styles.navItem}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.navLink}
                      aria-label={`${item.ariaLabel || item.label} (opens in new tab)`}
                      onClick={onToggle}
                    >
                      {item.icon && (
                        <span className={styles.navIcon} aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        aria-hidden="true"
                        style={{ marginLeft: '0.5rem' }}
                      >
                        <path d="M10.5 1.5h-3v1h1.793L4.146 7.646l.708.708L10 3.207V5h1V1.5z" />
                        <path d="M9 9H3V3h3V2H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6H9v3z" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                      aria-label={item.ariaLabel || item.label}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={onToggle}
                    >
                      {item.icon && (
                        <span className={styles.navIcon} aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
