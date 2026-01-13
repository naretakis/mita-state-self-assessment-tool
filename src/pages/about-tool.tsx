import React from 'react';

import Head from 'next/head';
import Link from 'next/link';

import AppHeader from '../components/layout/AppHeader';

/**
 * About Tool page - provides information about the MITA 4.0 Maturity Model and tool development
 */
const AboutTool: React.FC = () => {
  return (
    <>
      <Head>
        <title>About the Tool - MITA State Self-Assessment Tool</title>
        <meta
          name="description"
          content="Learn about the MITA 4.0 Maturity Model, how this tool works, and how to contribute"
        />
      </Head>

      <div className="ds-base">
        <AppHeader />
        <div
          className="ds-l-container ds-u-padding-y--4"
          style={{ marginTop: 'var(--app-header-height)' }}
        >
          <main role="main" className="ds-l-row ds-u-justify-content--center">
            <div className="ds-l-col--12 ds-l-md-col--10 ds-l-lg-col--8">
              <header className="ds-u-margin-bottom--6 ds-u-text-align--center ds-u-padding-top--4">
                <h1 className="ds-display--1 ds-u-margin-bottom--3 ds-u-color--primary">
                  About the Tool
                </h1>
                <p className="ds-text--lead ds-u-measure--wide">
                  Understanding the MITA 4.0 Maturity Model and how this tool supports State
                  Medicaid Agency self-assessments
                </p>
              </header>

              <section className="ds-u-margin-bottom--6">
                <h2 className="ds-h2 ds-u-margin-bottom--3">MITA 4.0 Maturity Model Purpose</h2>
                <p className="ds-u-margin-bottom--3">
                  The MITA Maturity Model provides State Medicaid Agencies (SMAs) with a framework
                  to systematically assess, benchmark, and improve processes, capabilities,
                  architecture, and performance. The model offers SMAs a clear path to assess
                  maturity, target specific areas for improvement, and achieve greater efficiency
                  and effectiveness in delivery of Medicaid Program services.
                </p>

                <h3 className="ds-h3 ds-u-margin-bottom--2">Maturity Model Goals</h3>
                <ul className="ds-c-list ds-u-margin-bottom--4">
                  <li>
                    <strong>Align with Strategic Objectives:</strong> Help ensure state capabilities
                    directly support SMA goals
                  </li>
                  <li>
                    <strong>Drive Standardization & Efficiency:</strong> Standardize and streamline
                    processes across a SMA
                  </li>
                  <li>
                    <strong>Enable Effective Transformation:</strong> Enable transformative and
                    higher-quality outcomes with greater effectiveness
                  </li>
                  <li>
                    <strong>Optimize Resource Use:</strong> Maximize impact while minimizing waste
                  </li>
                  <li>
                    <strong>Strengthen Risk Management:</strong> Increase the capability to identify
                    and mitigate risks
                  </li>
                  <li>
                    <strong>Enable Measurable Progress:</strong> Provide measures to track
                    improvement over time
                  </li>
                </ul>
              </section>

              <section className="ds-u-margin-bottom--6">
                <h2 className="ds-h2 ds-u-margin-bottom--3">The ORBIT Framework</h2>
                <p className="ds-u-margin-bottom--3">
                  MITA 4.0 assesses the maturity of a capability based on how well the SMA performs
                  that capability using the ORBIT framework:
                </p>
                <div className="ds-l-row ds-u-margin-bottom--4">
                  <div className="ds-l-col--12">
                    <div className="ds-c-card ds-u-padding--3">
                      <ul className="ds-c-list ds-u-margin-bottom--0">
                        <li>
                          <strong>Outcomes:</strong> The definition of the desired outcomes that
                          require the capability to be achieved
                        </li>
                        <li>
                          <strong>Roles:</strong> The individual roles responsible for providing the
                          capability
                        </li>
                        <li>
                          <strong>Business Processes:</strong> The business processes performed to
                          deliver the capability
                        </li>
                        <li>
                          <strong>Information:</strong> The information and data management
                          capabilities needed to deliver the capability
                        </li>
                        <li>
                          <strong>Technology:</strong> The technology used to automate the
                          capability
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="ds-u-margin-bottom--6">
                <h2 className="ds-h2 ds-u-margin-bottom--3">Maturity Levels</h2>
                <p className="ds-u-margin-bottom--3">
                  The MITA 4.0 Maturity Model uses five levels to describe an organization's
                  maturity progression:
                </p>
                <div className="ds-l-row">
                  <div className="ds-l-col--12 ds-u-margin-bottom--3">
                    <div className="ds-c-card ds-u-padding--3">
                      <h3 className="ds-h4 ds-u-margin-bottom--2">Level 1: Initial</h3>
                      <p className="ds-u-margin-bottom--0">
                        SMA seeks to adopt enterprise-wide planning and architectural frameworks to
                        improve program delivery. Current processes are unstructured, reactive, and
                        inconsistent.
                      </p>
                    </div>
                  </div>
                  <div className="ds-l-col--12 ds-u-margin-bottom--3">
                    <div className="ds-c-card ds-u-padding--3">
                      <h3 className="ds-h4 ds-u-margin-bottom--2">Level 2: Developing</h3>
                      <p className="ds-u-margin-bottom--0">
                        SMA complies with federal regulations and guidance and has begun adopting
                        MES industry-recognized planning and architectural frameworks. Although
                        basic processes and systems exist, they are not fully standardized or
                        documented.
                      </p>
                    </div>
                  </div>
                  <div className="ds-l-col--12 ds-u-margin-bottom--3">
                    <div className="ds-c-card ds-u-padding--3">
                      <h3 className="ds-h4 ds-u-margin-bottom--2">Level 3: Defined</h3>
                      <p className="ds-u-margin-bottom--0">
                        SMA complies with federal regulations and guidance and has fully implemented
                        MES industry-recognized planning and architectural frameworks. Processes,
                        systems, and strategies are standardized, well-documented, and aligned
                        across the organization.
                      </p>
                    </div>
                  </div>
                  <div className="ds-l-col--12 ds-u-margin-bottom--3">
                    <div className="ds-c-card ds-u-padding--3">
                      <h3 className="ds-h4 ds-u-margin-bottom--2">Level 4: Managed</h3>
                      <p className="ds-u-margin-bottom--0">
                        SMA maintains compliance, follows industry-recognized planning and
                        architectural frameworks, and monitors MES performance to meet goals. The
                        organization is a thought-leader in the MES ecosystem and actively
                        collaborates and shares approaches with other SMAs.
                      </p>
                    </div>
                  </div>
                  <div className="ds-l-col--12 ds-u-margin-bottom--3">
                    <div className="ds-c-card ds-u-padding--3">
                      <h3 className="ds-h4 ds-u-margin-bottom--2">Level 5: Optimized</h3>
                      <p className="ds-u-margin-bottom--0">
                        The SMA employs advanced, data-driven strategies to manage MES planning and
                        architecture to align predictive decision-making with the SMA's long-term
                        goals. The SMA's institutionalized innovation supports adaptability,
                        scalability, and continuous improvement.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="ds-u-margin-bottom--6">
                <h2 className="ds-h2 ds-u-margin-bottom--3">What is This Tool?</h2>
                <p className="ds-u-margin-bottom--3">
                  The MITA State Self-Assessment Tool is a modern, browser-based application that
                  helps State Medicaid Agencies assess the maturity of their systems using the MITA
                  4.0 capability-based framework. This tool supports the production of a Maturity
                  Profile that conforms to CMS requirements for a standardized view of assessment
                  results.
                </p>

                <h3 className="ds-h3 ds-u-margin-bottom--2">Key Capabilities</h3>
                <ul className="ds-c-list ds-u-margin-bottom--4">
                  <li>
                    <strong>Browser-Based:</strong> Works entirely in your browser with local data
                    storage
                  </li>
                  <li>
                    <strong>MITA 4.0 Integration:</strong> Full integration with the ORBIT framework
                    and maturity criteria
                  </li>
                  <li>
                    <strong>Guided Assessment:</strong> Step-by-step workflow through each ORBIT
                    dimension
                  </li>
                  <li>
                    <strong>Standardized Output:</strong> Generate Maturity Profiles conforming to
                    CMS requirements
                  </li>
                  <li>
                    <strong>Privacy-First:</strong> Your data never leaves your browser
                  </li>
                </ul>
              </section>

              <section className="ds-u-margin-bottom--6">
                <h2 className="ds-h2 ds-u-margin-bottom--3">Open Source & Community</h2>
                <p className="ds-u-margin-bottom--3">
                  This project follows an open-source approach to enable community contributions and
                  transparency. We believe that better tools come from collaborative development.
                </p>

                <div className="ds-c-alert ds-c-alert--lightweight ds-u-margin-bottom--4">
                  <div className="ds-c-alert__body">
                    <h3 className="ds-c-alert__heading">Get Involved</h3>
                    <p className="ds-c-alert__text ds-u-margin-bottom--3">
                      Whether you're a developer, state agency user, or interested in MITA
                      assessments, there are ways to contribute to this project.
                    </p>
                    <div className="ds-l-row">
                      <div className="ds-l-col--12 ds-l-sm-col--6 ds-u-margin-bottom--2">
                        <a
                          href="https://github.com/naretakis/mita-state-self-assessment-tool"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ds-c-button ds-c-button--primary ds-u-display--block"
                        >
                          View on GitHub
                          <span className="ds-u-visibility--screen-reader">
                            {' '}
                            (opens in new tab)
                          </span>
                        </a>
                      </div>
                      <div className="ds-l-col--12 ds-l-sm-col--6">
                        <a
                          href="https://github.com/naretakis/mita-state-self-assessment-tool/blob/main/CONTRIBUTING.md"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ds-c-button ds-c-button--transparent ds-u-display--block"
                        >
                          Contributing Guide
                          <span className="ds-u-visibility--screen-reader">
                            {' '}
                            (opens in new tab)
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="ds-u-margin-bottom--6">
                <h2 className="ds-h2 ds-u-margin-bottom--3">Project Status</h2>
                <p className="ds-u-margin-bottom--3">
                  This tool is being developed as a proof-of-concept SS-A Tool to support the MITA
                  4.0 pilot. The tool produces a Maturity Profile that conforms to the CMS
                  spreadsheet template and can generate a .csv file for uploading to the MES Hub
                  (MESH).
                </p>

                <div className="ds-c-alert ds-c-alert--warn ds-c-alert--lightweight">
                  <div className="ds-c-alert__body">
                    <h3 className="ds-c-alert__heading">Development Status</h3>
                    <p className="ds-c-alert__text">
                      This tool is actively under development to support the MITA 4.0 pilot. While
                      core functionality is working, we're continuously adding features and
                      improvements based on user feedback.
                    </p>
                  </div>
                </div>
              </section>

              <section className="ds-u-text-align--center ds-u-padding-top--4 ds-u-border-top--1">
                <h2 className="ds-h2 ds-u-margin-bottom--3 ds-u-color--primary">
                  Ready to Try It?
                </h2>
                <p className="ds-u-margin-bottom--4 ds-u-measure--wide">
                  Start your MITA 4.0 assessment or explore the tool's capabilities.
                </p>
                <div className="ds-l-row ds-u-justify-content--center">
                  <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4 ds-u-margin-bottom--2">
                    <Link
                      href="/dashboard"
                      className="ds-c-button ds-c-button--primary ds-c-button--big ds-u-display--block"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4">
                    <Link
                      href="/"
                      className="ds-c-button ds-c-button--transparent ds-c-button--big ds-u-display--block"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AboutTool;
