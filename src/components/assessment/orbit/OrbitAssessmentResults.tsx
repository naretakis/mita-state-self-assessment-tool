/**
 * OrbitAssessmentResults Component
 *
 * Displays assessment results using the ORBIT maturity model structure.
 * Shows scores per dimension, technology sub-domains, and overall capability scores.
 */

import React, { useEffect, useMemo, useState } from 'react';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import Link from 'next/link';
import { Bar, Radar } from 'react-chartjs-2';

import { useCapabilities } from '../../../hooks/useCapabilities';
import enhancedStorageService from '../../../services/EnhancedStorageService';
import { OrbitScoringService } from '../../../services/OrbitScoringService';
import AppHeader from '../../layout/AppHeader';
import { EnhancedExportSection } from '../EnhancedExportSection';

import type {
  OrbitAssessment,
  OrbitCapabilityScore,
  OrbitDimensionId,
  TechnologySubDomainScore,
} from '../../../types/orbit';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface OrbitAssessmentResultsProps {
  assessmentId: string;
}

const DIMENSION_LABELS: Record<OrbitDimensionId, string> = {
  outcomes: 'Outcomes',
  roles: 'Roles',
  business: 'Business Architecture',
  information: 'Information & Data',
  technology: 'Technology',
};

const DIMENSION_COLORS: Record<OrbitDimensionId, { bg: string; border: string }> = {
  outcomes: { bg: 'rgba(255, 159, 64, 0.6)', border: 'rgba(255, 159, 64, 1)' },
  roles: { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgba(153, 102, 255, 1)' },
  business: { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
  information: { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' },
  technology: { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
};

const OrbitAssessmentResults: React.FC<OrbitAssessmentResultsProps> = ({ assessmentId }) => {
  const [assessment, setAssessment] = useState<OrbitAssessment | null>(null);
  const [scores, setScores] = useState<OrbitCapabilityScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { capabilities } = useCapabilities();

  // Load assessment and calculate scores
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const loaded = await enhancedStorageService.loadAssessment(assessmentId);

        if (!isMounted) {
          return;
        }

        if (!loaded) {
          setError('Assessment not found');
          return;
        }

        // Check if it's an ORBIT assessment
        if (!('capabilities' in loaded) || !Array.isArray(loaded.capabilities)) {
          setError('Invalid assessment format');
          return;
        }

        const firstCap = loaded.capabilities[0];
        if (!firstCap || !('orbit' in firstCap)) {
          setError('This assessment uses the legacy format. Please use the standard results page.');
          return;
        }

        const orbitAssessment = loaded as unknown as OrbitAssessment;
        setAssessment(orbitAssessment);

        // Calculate scores using OrbitScoringService
        const scoringService = new OrbitScoringService();
        const calculatedScores = orbitAssessment.capabilities.map(cap =>
          scoringService.calculateCapabilityScore(cap)
        );
        setScores(calculatedScores);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load assessment');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [assessmentId]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (scores.length === 0) {
      return {
        overallAverage: 0,
        capabilityCount: 0,
        dimensionAverages: {} as Record<OrbitDimensionId, number>,
        completionPercentage: 0,
      };
    }

    const overallAverage =
      scores.reduce((sum, s) => sum + s.overallAverageLevel, 0) / scores.length;

    const dimensionAverages: Record<OrbitDimensionId, number> = {
      outcomes: 0,
      roles: 0,
      business: 0,
      information: 0,
      technology: 0,
    };

    const dimensionCounts: Record<OrbitDimensionId, number> = {
      outcomes: 0,
      roles: 0,
      business: 0,
      information: 0,
      technology: 0,
    };

    for (const score of scores) {
      for (const [dimId, dimScore] of Object.entries(score.dimensionScores)) {
        const id = dimId as OrbitDimensionId;
        if (dimScore.averageLevel > 0) {
          dimensionAverages[id] += dimScore.averageLevel;
          dimensionCounts[id]++;
        }
      }
    }

    for (const dimId of Object.keys(dimensionAverages) as OrbitDimensionId[]) {
      if (dimensionCounts[dimId] > 0) {
        dimensionAverages[dimId] /= dimensionCounts[dimId];
      }
    }

    // Calculate completion percentage
    const completionSum = scores.reduce((sum, s) => sum + s.completionPercentage, 0);
    const completionPercentage = scores.length > 0 ? completionSum / scores.length : 0;

    return {
      overallAverage: Math.round(overallAverage * 10) / 10,
      capabilityCount: scores.length,
      dimensionAverages,
      completionPercentage: Math.round(completionPercentage),
    };
  }, [scores]);

  // Bar chart data - capability scores
  const barChartData = useMemo(() => {
    const capabilityNames = scores.map(s => {
      const cap = capabilities.find(c => c.id === s.capabilityId);
      return cap?.areaName || s.capabilityName || s.capabilityId;
    });

    return {
      labels: capabilityNames,
      datasets: [
        {
          label: 'Overall Maturity Score',
          data: scores.map(s => s.overallAverageLevel),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [scores, capabilities]);

  // Radar chart data - dimension comparison
  const radarChartData = useMemo(() => {
    const labels = Object.values(DIMENSION_LABELS);

    return {
      labels,
      datasets: scores.map((score, index) => {
        const cap = capabilities.find(c => c.id === score.capabilityId);
        const capName = cap?.areaName || score.capabilityName || score.capabilityId;
        const hue = (index * 60) % 360;

        return {
          label: capName,
          data: [
            score.dimensionScores.outcomes?.averageLevel || 0,
            score.dimensionScores.roles?.averageLevel || 0,
            score.dimensionScores.business?.averageLevel || 0,
            score.dimensionScores.information?.averageLevel || 0,
            score.dimensionScores.technology?.averageLevel || 0,
          ],
          backgroundColor: `hsla(${hue}, 70%, 60%, 0.2)`,
          borderColor: `hsla(${hue}, 70%, 50%, 1)`,
          borderWidth: 2,
        };
      }),
    };
  }, [scores, capabilities]);

  // Dimension breakdown chart
  const dimensionBarData = useMemo(
    () => ({
      labels: Object.values(DIMENSION_LABELS),
      datasets: [
        {
          label: 'Average Score by Dimension',
          data: [
            summary.dimensionAverages.outcomes || 0,
            summary.dimensionAverages.roles || 0,
            summary.dimensionAverages.business || 0,
            summary.dimensionAverages.information || 0,
            summary.dimensionAverages.technology || 0,
          ],
          backgroundColor: Object.values(DIMENSION_COLORS).map(c => c.bg),
          borderColor: Object.values(DIMENSION_COLORS).map(c => c.border),
          borderWidth: 1,
        },
      ],
    }),
    [summary.dimensionAverages]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: 'MITA 4.0 ORBIT Assessment Results' },
      },
      scales: {
        y: { beginAtZero: true, max: 5 },
      },
    }),
    []
  );

  const radarOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: 'ORBIT Dimension Comparison' },
      },
      scales: {
        r: { beginAtZero: true, max: 5 },
      },
    }),
    []
  );

  const dimensionChartOptions = useMemo(
    () => ({
      responsive: true,
      indexAxis: 'y' as const,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Average Score by ORBIT Dimension' },
      },
      scales: {
        x: { beginAtZero: true, max: 5 },
      },
    }),
    []
  );

  // Loading state
  if (loading) {
    return (
      <div className="ds-base">
        <AppHeader />
        <div className="ds-l-container ds-u-padding-y--4">
          <div className="ds-u-text-align--center">
            <div className="ds-c-spinner" aria-valuetext="Loading results..." />
            <p className="ds-u-margin-top--2">Calculating assessment results...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !assessment) {
    return (
      <div className="ds-base">
        <AppHeader />
        <div className="ds-l-container ds-u-padding-y--4">
          <div className="ds-c-alert ds-c-alert--error">
            <div className="ds-c-alert__body">
              <h2 className="ds-c-alert__heading">Error Loading Results</h2>
              <p className="ds-c-alert__text">{error || 'Assessment not found'}</p>
              <Link
                href="/dashboard"
                className="ds-c-button ds-c-button--primary ds-u-margin-top--2"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-base">
      <AppHeader />

      <div className="ds-l-container ds-u-padding-y--4">
        <div className="ds-l-row ds-u-justify-content--center">
          <div className="ds-l-col--12 ds-l-lg-col--10">
            {/* Header */}
            <header className="ds-u-margin-bottom--4">
              <h1 className="ds-text-heading--2xl ds-u-margin-bottom--2">
                ORBIT Assessment Results
              </h1>
              <p className="ds-text-body--lg">
                MITA 4.0 maturity assessment results for {assessment.stateName}
              </p>
              <div className="ds-u-margin-top--2">
                <span className="ds-c-badge ds-c-badge--success">
                  {assessment.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
                <span className="ds-u-margin-left--2 ds-text-body--sm ds-u-color--gray-60">
                  Last updated: {new Date(assessment.updatedAt).toLocaleDateString()}
                </span>
                {assessment.metadata?.systemName && (
                  <span className="ds-u-margin-left--2 ds-text-body--sm ds-u-color--gray-60">
                    System: {assessment.metadata.systemName}
                  </span>
                )}
              </div>
            </header>

            {/* Summary Cards */}
            <div className="ds-l-row ds-u-margin-bottom--4">
              <div className="ds-l-col--12 ds-l-md-col--3">
                <div className="ds-c-card">
                  <div className="ds-c-card__body ds-u-text-align--center">
                    <h3 className="ds-text-heading--md ds-u-margin-bottom--1">Overall Average</h3>
                    <div className="ds-text-heading--2xl ds-u-color--primary">
                      {summary.overallAverage}
                    </div>
                    <p className="ds-text-body--sm ds-u-color--gray-60">out of 5.0</p>
                  </div>
                </div>
              </div>
              <div className="ds-l-col--12 ds-l-md-col--3">
                <div className="ds-c-card">
                  <div className="ds-c-card__body ds-u-text-align--center">
                    <h3 className="ds-text-heading--md ds-u-margin-bottom--1">Capabilities</h3>
                    <div className="ds-text-heading--2xl ds-u-color--primary">
                      {summary.capabilityCount}
                    </div>
                    <p className="ds-text-body--sm ds-u-color--gray-60">assessed</p>
                  </div>
                </div>
              </div>
              <div className="ds-l-col--12 ds-l-md-col--3">
                <div className="ds-c-card">
                  <div className="ds-c-card__body ds-u-text-align--center">
                    <h3 className="ds-text-heading--md ds-u-margin-bottom--1">Completion</h3>
                    <div className="ds-text-heading--2xl ds-u-color--primary">
                      {summary.completionPercentage}%
                    </div>
                    <p className="ds-text-body--sm ds-u-color--gray-60">of aspects</p>
                  </div>
                </div>
              </div>
              <div className="ds-l-col--12 ds-l-md-col--3">
                <div className="ds-c-card">
                  <div className="ds-c-card__body ds-u-text-align--center">
                    <h3 className="ds-text-heading--md ds-u-margin-bottom--1">Model Version</h3>
                    <div className="ds-text-heading--2xl ds-u-color--primary">
                      {assessment.metadata?.orbitModelVersion || '4.0'}
                    </div>
                    <p className="ds-text-body--sm ds-u-color--gray-60">MITA ORBIT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            {scores.length > 0 && (
              <div className="ds-u-margin-bottom--4">
                <h2 className="ds-text-heading--xl ds-u-margin-bottom--3">Visualization</h2>
                <div className="ds-l-row">
                  <div className="ds-l-col--12 ds-l-lg-col--6 ds-u-margin-bottom--3">
                    <div className="ds-c-card">
                      <div className="ds-c-card__body">
                        <Bar data={barChartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                  <div className="ds-l-col--12 ds-l-lg-col--6 ds-u-margin-bottom--3">
                    <div className="ds-c-card">
                      <div className="ds-c-card__body">
                        <Radar data={radarChartData} options={radarOptions} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ds-l-row">
                  <div className="ds-l-col--12">
                    <div className="ds-c-card">
                      <div className="ds-c-card__body">
                        <Bar data={dimensionBarData} options={dimensionChartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Results by Capability */}
            <div className="ds-u-margin-bottom--4">
              <h2 className="ds-text-heading--xl ds-u-margin-bottom--3">Detailed Results</h2>
              {scores.map(score => {
                const cap = capabilities.find(c => c.id === score.capabilityId);
                const capName = cap?.areaName || score.capabilityName || score.capabilityId;
                const capDomain = cap?.domainName || score.domainName || 'Unknown Domain';

                // Get technology sub-domain scores if available
                const techDimScore = score.dimensionScores.technology;
                const subDomainScores = techDimScore?.subDomainScores || [];

                return (
                  <div key={score.capabilityId} className="ds-c-card ds-u-margin-bottom--3">
                    <div className="ds-c-card__header">
                      <h3 className="ds-text-heading--lg">{capName}</h3>
                      <p className="ds-text-body--sm ds-u-color--gray-60">{capDomain}</p>
                    </div>
                    <div className="ds-c-card__body">
                      <div className="ds-l-row">
                        <div className="ds-l-col--12 ds-l-md-col--4">
                          <div className="ds-u-text-align--center ds-u-padding--2">
                            <div className="ds-text-heading--2xl ds-u-color--primary">
                              {score.overallAverageLevel.toFixed(1)}
                            </div>
                            <p className="ds-text-body--sm">Overall Score</p>
                          </div>
                        </div>
                        <div className="ds-l-col--12 ds-l-md-col--8">
                          <table className="ds-c-table ds-c-table--borderless">
                            <thead>
                              <tr>
                                <th>Dimension</th>
                                <th>Score</th>
                                <th>Aspects</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(score.dimensionScores).map(([dimId, dimScore]) => {
                                const totalAspects = dimScore.aspectScores.length;
                                const completedAspects = dimScore.aspectScores.filter(
                                  a => a.currentLevel > 0
                                ).length;

                                return (
                                  <tr key={dimId}>
                                    <td>{DIMENSION_LABELS[dimId as OrbitDimensionId]}</td>
                                    <td>
                                      <span
                                        style={{
                                          color:
                                            dimScore.averageLevel >= 3
                                              ? '#2e8540'
                                              : dimScore.averageLevel >= 2
                                                ? '#e27600'
                                                : '#d63e04',
                                        }}
                                      >
                                        {dimScore.averageLevel.toFixed(1)}
                                      </span>
                                    </td>
                                    <td>
                                      {completedAspects}/{totalAspects}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Technology Sub-Domain Breakdown */}
                      {subDomainScores.length > 0 && (
                        <div className="ds-u-margin-top--3 ds-u-border-top--1 ds-u-padding-top--3">
                          <h4 className="ds-text-heading--md ds-u-margin-bottom--2">
                            Technology Sub-Domains
                          </h4>
                          <div className="ds-l-row">
                            {subDomainScores.map((subScore: TechnologySubDomainScore) => (
                              <div
                                key={subScore.subDomainId}
                                className="ds-l-col--6 ds-l-md-col--3 ds-u-margin-bottom--2"
                              >
                                <div
                                  style={{
                                    padding: '0.75rem',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '4px',
                                  }}
                                >
                                  <div className="ds-text-body--sm ds-u-font-weight--bold">
                                    {subScore.subDomainName}
                                  </div>
                                  <div
                                    className="ds-text-heading--lg"
                                    style={{
                                      color:
                                        subScore.averageLevel >= 3
                                          ? '#2e8540'
                                          : subScore.averageLevel >= 2
                                            ? '#e27600'
                                            : '#d63e04',
                                    }}
                                  >
                                    {subScore.averageLevel.toFixed(1)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Export Section - reuse existing component with type assertion */}
            <EnhancedExportSection
              assessment={
                assessment as unknown as Parameters<typeof EnhancedExportSection>[0]['assessment']
              }
            />

            {/* Navigation */}
            <div className="ds-u-margin-bottom--4 ds-u-padding-top--4 ds-u-border-top--1">
              <div className="ds-l-row ds-u-gap--2">
                <div className="ds-l-col--12 ds-l-sm-col--auto">
                  <Link href="/dashboard" className="ds-c-button ds-c-button--primary">
                    Return to Dashboard
                  </Link>
                </div>
                <div className="ds-l-col--12 ds-l-sm-col--auto">
                  <Link
                    href={`/assessment/${assessmentId}`}
                    className="ds-c-button ds-c-button--transparent"
                  >
                    Continue Assessment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrbitAssessmentResults;
