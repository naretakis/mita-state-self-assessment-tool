import React from 'react';
import Head from 'next/head';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'MITA State Self-Assessment Tool' 
}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="MITA State Self-Assessment Tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>MITA State Self-Assessment Tool</h1>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>MITA State Self-Assessment Tool</p>
      </footer>
    </div>
  );
};

export default Layout;