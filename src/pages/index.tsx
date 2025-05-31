import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const basePath = router.basePath || '';
  
  return (
    <div className={styles.container}>
      <Head>
        <title>MITA State Self-Assessment Tool</title>
        <meta name="description" content="MITA State Self-Assessment Tool" />
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the MITA State Self-Assessment Tool
        </h1>

        <p className={styles.description}>
          A modern tool for assessing Medicaid systems using the MITA NextGen framework
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Getting Started &rarr;</h2>
            <p>Begin a new assessment or continue where you left off.</p>
          </div>

          <div className={styles.card}>
            <h2>About MITA &rarr;</h2>
            <p>Learn about the MITA NextGen capability-based framework.</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>MITA State Self-Assessment Tool</p>
      </footer>
    </div>
  );
}