import React from 'react';

import Link from 'next/link';

import AppHeader from './AppHeader';

interface LandingPageProps {
  className?: string;
}

/**
 * Landing page component for the MITA State Self-Assessment Tool
 * Provides welcome message, tool overview, and navigation options
 */
const LandingPage: React.FC<LandingPageProps> = ({ className = '' }) => {
  return (
    <div className={`ds-base ${className}`}>
      <AppHeader />
      <div
        className="ds-l-container ds-u-padding-y--4"
        style={{ marginTop: 'var(--app-header-height)' }}
      >
        <main role="main" className="ds-l-row ds-u-justify-content--center">
          <div className="ds-l-col--12 ds-l-md-col--10 ds-l-lg-col--8">
            {/* Header Section */}
            <header className="ds-u-text-align--center ds-u-margin-bottom--6 ds-u-padding-top--4">
              <h1 className="ds-display--1 ds-u-margin-bottom--3 ds-u-color--primary">
                MITA State Self-Assessment Tool
              </h1>
              <p className="ds-text--lead ds-u-margin-bottom--4 ds-u-measure--wide">
                Assess the maturity of your Medicaid Enterprise Systems using the MITA 4.0
                capability-based framework. This browser-based tool helps State Medicaid Agencies
                systematically evaluate their systems and identify opportunities for improvement.
              </p>
            </header>

            {/* Navigation Actions */}
            <section
              className="ds-u-text-align--center ds-u-margin-bottom--6 landing-page-actions"
              aria-labelledby="actions-heading"
            >
              <h2 id="actions-heading" className="ds-u-visibility--screen-reader">
                Get Started Options
              </h2>
              <div className="ds-l-row ds-u-justify-content--center">
                <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4 ds-u-margin-bottom--3">
                  <Link
                    href="/dashboard"
                    className="ds-c-button ds-c-button--primary ds-c-button--big ds-u-display--block"
                  >
                    Get Started
                  </Link>
                  <p className="ds-text--small ds-u-margin-top--2 ds-u-margin-bottom--0">
                    Begin a new assessment or manage existing ones
                  </p>
                </div>
                <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4 ds-u-margin-bottom--3">
                  <Link
                    href="/about-tool"
                    className="ds-c-button ds-c-button--transparent ds-c-button--big ds-u-display--block"
                  >
                    About This Tool
                  </Link>
                  <p className="ds-text--small ds-u-margin-top--2 ds-u-margin-bottom--0">
                    Learn about the MITA 4.0 Maturity Model and how this tool works
                  </p>
                </div>
                <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4 ds-u-margin-bottom--3">
                  <a
                    href="https://cmsgov.github.io/Medicaid-Information-Technology-Architecture-MITA-4/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ds-c-button ds-c-button--transparent ds-c-button--big ds-u-display--block"
                  >
                    <span>About MITA</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10.5 1.5h-3v1h1.793L4.146 7.646l.708.708L10 3.207V5h1V1.5z" />
                      <path d="M9 9H3V3h3V2H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1-1V6H9v3z" />
                    </svg>
                  </a>
                  <p className="ds-text--small ds-u-margin-top--2 ds-u-margin-bottom--0">
                    Learn about the MITA 4.0 framework
                  </p>
                </div>
              </div>
            </section>

            {/* MITA 4.0 Overview */}
            <section className="ds-u-margin-bottom--6" aria-labelledby="overview-heading">
              <h2
                id="overview-heading"
                className="ds-h2 ds-u-text-align--center ds-u-margin-bottom--4"
              >
                What is MITA 4.0?
              </h2>
              <p className="ds-u-margin-bottom--3">
                The Medicaid Information Technology Architecture (MITA) 4.0 Maturity Model provides
                State Medicaid Agencies (SMAs) with a framework to systematically assess, benchmark,
                and improve their Medicaid Enterprise Systems. It offers SMAs a clear path to assess
                maturity, target specific areas for improvement, and achieve greater efficiency and
                effectiveness in delivery of Medicaid Program services.
              </p>
            </section>

            {/* Capability Reference Model */}
            <section className="ds-u-margin-bottom--6" aria-labelledby="capability-heading">
              <h2
                id="capability-heading"
                className="ds-h2 ds-u-text-align--center ds-u-margin-bottom--4"
              >
                Capability Reference Model
              </h2>
              <p className="ds-u-margin-bottom--3">
                A <strong>capability</strong> is an ability that a SMA possesses or seeks to develop
                to achieve its goals and meet its desired outcomes. It represents what the SMA can
                do—without explaining how, why, or where the SMA uses the capability.
              </p>
              <p className="ds-u-margin-bottom--3">
                The MITA 4.0 Capability Reference Model organizes capabilities into two levels:
              </p>
              <div className="ds-l-row ds-u-margin-bottom--4">
                <div className="ds-l-col--12 ds-l-md-col--6 ds-u-margin-bottom--3">
                  <div className="ds-c-card ds-u-padding--3" style={{ height: '100%' }}>
                    <h3 className="ds-h4 ds-u-margin-bottom--2">Capability Domains</h3>
                    <p className="ds-u-margin-bottom--0">
                      The highest-level groupings that organize related capabilities. Examples
                      include Provider, Member, Care Management, and Operations.
                    </p>
                  </div>
                </div>
                <div className="ds-l-col--12 ds-l-md-col--6 ds-u-margin-bottom--3">
                  <div className="ds-c-card ds-u-padding--3" style={{ height: '100%' }}>
                    <h3 className="ds-h4 ds-u-margin-bottom--2">Capability Areas</h3>
                    <p className="ds-u-margin-bottom--0">
                      More specific capabilities within each domain. For example, the Provider
                      domain includes Provider Enrollment, Provider Screening, and Provider
                      Information Management.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ORBIT Framework */}
            <section className="ds-u-margin-bottom--6" aria-labelledby="orbit-heading">
              <h2
                id="orbit-heading"
                className="ds-h2 ds-u-text-align--center ds-u-margin-bottom--4"
              >
                The ORBIT Framework
              </h2>
              <p className="ds-u-margin-bottom--3">
                Each capability is assessed based on five dimensions using the ORBIT framework. This
                assessment determines how well the SMA performs that capability:
              </p>
              <div className="ds-c-card ds-u-padding--3 ds-u-margin-bottom--4">
                <ul className="ds-c-list ds-u-margin-bottom--0">
                  <li>
                    <strong>O - Outcomes:</strong> The desired results that require the capability
                    to be achieved
                  </li>
                  <li>
                    <strong>R - Roles:</strong> The individual roles responsible for providing the
                    capability
                  </li>
                  <li>
                    <strong>B - Business Processes:</strong> The business processes performed to
                    deliver the capability
                  </li>
                  <li>
                    <strong>I - Information:</strong> The information and data management
                    capabilities needed
                  </li>
                  <li>
                    <strong>T - Technology:</strong> The technology used to automate the capability
                  </li>
                </ul>
              </div>
            </section>

            {/* Maturity Levels */}
            <section className="ds-u-margin-bottom--6" aria-labelledby="maturity-heading">
              <h2
                id="maturity-heading"
                className="ds-h2 ds-u-text-align--center ds-u-margin-bottom--4"
              >
                Five Maturity Levels
              </h2>
              <p className="ds-u-margin-bottom--3">
                For each ORBIT dimension, the SMA rates their maturity on a five-level scale:
              </p>
              <div className="ds-c-card ds-u-padding--3">
                <ul className="ds-c-list ds-u-margin-bottom--0">
                  <li>
                    <strong>Level 1 - Initial:</strong> Unstructured, reactive, and inconsistent
                    processes
                  </li>
                  <li>
                    <strong>Level 2 - Developing:</strong> Basic processes exist but are not fully
                    standardized
                  </li>
                  <li>
                    <strong>Level 3 - Defined:</strong> Standardized, well-documented, and aligned
                    processes
                  </li>
                  <li>
                    <strong>Level 4 - Managed:</strong> Fully operational with performance
                    monitoring for improvement
                  </li>
                  <li>
                    <strong>Level 5 - Optimized:</strong> Advanced, data-driven strategies with
                    continuous improvement
                  </li>
                </ul>
              </div>
            </section>

            {/* Key Features */}
            <section className="ds-u-margin-bottom--6" aria-labelledby="features-heading">
              <h2
                id="features-heading"
                className="ds-h2 ds-u-text-align--center ds-u-margin-bottom--4"
              >
                Key Features
              </h2>
              <div className="ds-l-row">
                <div className="ds-l-col--12 ds-l-md-col--6 ds-u-margin-bottom--3">
                  <div className="ds-c-card ds-u-padding--3">
                    <h3 className="ds-h4 ds-u-margin-bottom--2">Capability-Based Assessment</h3>
                    <p className="ds-u-margin-bottom--0">
                      Evaluate your systems using the MITA 4.0 Capability Reference Model across
                      Capability Domains and Capability Areas with the ORBIT framework.
                    </p>
                  </div>
                </div>
                <div className="ds-l-col--12 ds-l-md-col--6 ds-u-margin-bottom--3">
                  <div className="ds-c-card ds-u-padding--3">
                    <h3 className="ds-h4 ds-u-margin-bottom--2">Standardized Maturity Profile</h3>
                    <p className="ds-u-margin-bottom--0">
                      Generate a Maturity Profile that conforms to CMS requirements for a
                      standardized view of your assessment results.
                    </p>
                  </div>
                </div>
                <div className="ds-l-col--12 ds-l-md-col--6 ds-u-margin-bottom--3">
                  <div className="ds-c-card ds-u-padding--3">
                    <h3 className="ds-h4 ds-u-margin-bottom--2">Guided Workflow</h3>
                    <p className="ds-u-margin-bottom--0">
                      Step-by-step assessment process with maturity criteria guidance and contextual
                      help throughout your evaluation.
                    </p>
                  </div>
                </div>
                <div className="ds-l-col--12 ds-l-md-col--6 ds-u-margin-bottom--3">
                  <div className="ds-c-card ds-u-padding--3">
                    <h3 className="ds-h4 ds-u-margin-bottom--2">Actionable Reports</h3>
                    <p className="ds-u-margin-bottom--0">
                      Generate comprehensive PDF and CSV reports with maturity visualizations to
                      support APD planning and MES initiatives.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
