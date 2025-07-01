import React from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Assessment detail page - placeholder for future implementation
 */
const AssessmentDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Assessment - MITA State Self-Assessment Tool</title>
        <meta name="description" content="View or edit MITA assessment" />
      </Head>

      <div className="ds-base">
        <div className="ds-l-container ds-u-padding-y--4">
          <main role="main" className="ds-l-row ds-u-justify-content--center">
            <div className="ds-l-col--12 ds-l-md-col--10 ds-l-lg-col--8">
              <header className="ds-u-margin-bottom--6 ds-u-text-align--center">
                <h1 className="ds-display--1 ds-u-margin-bottom--3 ds-u-color--primary">
                  Assessment Details
                </h1>
                <p className="ds-text--lead ds-u-measure--wide">
                  {id ? `Assessment ID: ${id}` : 'Loading assessment...'}
                </p>
              </header>

              <div className="ds-c-alert ds-c-alert--warn ds-u-margin-bottom--4">
                <div className="ds-c-alert__body">
                  <h2 className="ds-c-alert__heading">Coming Soon</h2>
                  <p className="ds-c-alert__text">
                    The assessment detail functionality is currently under development. This page
                    will allow you to view and edit your assessment responses.
                  </p>
                </div>
              </div>

              <div className="ds-u-text-align--center">
                <Link href="/dashboard" className="ds-c-button ds-c-button--primary">
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AssessmentDetail;
