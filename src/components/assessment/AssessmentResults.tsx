'use client';

import React, { useState, useEffect } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Link from 'next/link';
import { Bar, Radar } from 'react-chartjs-2';

import { useStorageContext } from '../storage/StorageProvider';

import type { Assessment, OrbitDimension } from '../../types';

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

interface AssessmentResultsProps {
  assessmentId: string;
}

interface MaturityScore {
  capabilityArea: string;
  domain: string;
  overallScore: number;
  dimensionScores: Record<OrbitDimension, number>;
}

interface ExportOptions {
  format: 'pdf' | 'csv';
  includeDetails: boolean;
  includeCharts: boolean;
}

/**
 * Calculate maturity scores for assessment
 */
function calculateMaturityScores(assessment: Assessment): MaturityScore[] {
  return assessment.capabilities.map(capability => {
    const dimensions = capability.dimensions;
    const scores = {
      outcome: dimensions.outcome?.maturityLevel || 0,
      role: dimensions.role?.maturityLevel || 0,
      businessProcess: dimensions.businessProcess?.maturityLevel || 0,
      information: dimensions.information?.maturityLevel || 0,
      technology: dimensions.technology?.maturityLevel || 0,
    };

    // Calculate overall score using all dimensions (including zeros for incomplete assessments)
    const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / 5;

    return {
      capabilityArea: capability.capabilityAreaName,
      domain: capability.capabilityDomainName,
      overallScore: Math.round(overallScore * 10) / 10,
      dimensionScores: scores,
    };
  });
}

/**
 * Generate CSV content from assessment data
 */
function generateCSV(assessment: Assessment, scores: MaturityScore[]): string {
  const headers = [
    'Domain',
    'Capability Area',
    'Overall Score',
    'Outcome',
    'Role',
    'Business Process',
    'Information',
    'Technology',
  ];
  const rows = scores.map(score => [
    score.domain,
    score.capabilityArea,
    score.overallScore.toString(),
    score.dimensionScores.outcome.toString(),
    score.dimensionScores.role.toString(),
    score.dimensionScores.businessProcess.toString(),
    score.dimensionScores.information.toString(),
    score.dimensionScores.technology.toString(),
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

/**
 * Generate PDF report from assessment data
 */
function generatePDF(
  assessment: Assessment,
  scores: MaturityScore[],
  options: ExportOptions
): jsPDF {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('MITA Assessment Results', 20, 20);

  // Assessment info
  doc.setFontSize(12);
  doc.text(`State: ${assessment.stateName}`, 20, 35);
  doc.text(`Created: ${new Date(assessment.createdAt).toLocaleDateString()}`, 20, 45);
  doc.text(`Status: ${assessment.status}`, 20, 55);

  // Summary table
  const tableData = scores.map(score => [
    score.domain,
    score.capabilityArea,
    score.overallScore.toString(),
    score.dimensionScores.outcome.toString(),
    score.dimensionScores.role.toString(),
    score.dimensionScores.businessProcess.toString(),
    score.dimensionScores.information.toString(),
    score.dimensionScores.technology.toString(),
  ]);

  autoTable(doc, {
    head: [
      [
        'Domain',
        'Capability Area',
        'Overall',
        'Outcome',
        'Role',
        'Business Process',
        'Information',
        'Technology',
      ],
    ],
    body: tableData,
    startY: 70,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  if (options.includeDetails) {
    // Add detailed assessment data
    let yPosition =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

    doc.setFontSize(14);
    doc.text('Detailed Assessment Results', 20, yPosition);
    yPosition += 15;

    assessment.capabilities.forEach(capability => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.text(
        `${capability.capabilityDomainName} - ${capability.capabilityAreaName}`,
        20,
        yPosition
      );
      yPosition += 10;

      Object.entries(capability.dimensions).forEach(([dimension, data]) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(10);
        doc.text(`${dimension}: Level ${data.maturityLevel}`, 25, yPosition);
        yPosition += 8;

        if (data.evidence) {
          const evidenceLines = doc.splitTextToSize(`Evidence: ${data.evidence}`, 160);
          doc.text(evidenceLines, 30, yPosition);
          yPosition += evidenceLines.length * 5;
        }
      });

      yPosition += 10;
    });
  }

  return doc;
}

/**
 * Assessment Results Component
 */
export function AssessmentResults({ assessmentId }: AssessmentResultsProps) {
  const { loadAssessment, updateAssessmentStatus } = useStorageContext();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [scores, setScores] = useState<MaturityScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Load assessment data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const assessmentData = await loadAssessment(assessmentId);

        if (!assessmentData) {
          setError('Assessment not found');
          return;
        }

        setAssessment(assessmentData);
        const calculatedScores = calculateMaturityScores(assessmentData);
        setScores(calculatedScores);

        // Update status to completed if not already
        if (assessmentData.status !== 'completed') {
          await updateAssessmentStatus(assessmentId, 'completed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assessmentId, loadAssessment, updateAssessmentStatus]);

  // Handle export
  const handleExport = async (options: ExportOptions) => {
    if (!assessment) {
      return;
    }

    setExporting(true);
    try {
      if (options.format === 'csv') {
        const csvContent = generateCSV(assessment, scores);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mita-assessment-${assessmentId}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const pdf = generatePDF(assessment, scores, options);
        pdf.save(`mita-assessment-${assessmentId}.pdf`);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  // Chart data
  const barChartData = {
    labels: scores.map(s => s.capabilityArea),
    datasets: [
      {
        label: 'Overall Maturity Score',
        data: scores.map(s => s.overallScore),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const radarChartData = {
    labels: ['Outcome', 'Role', 'Business Process', 'Information', 'Technology'],
    datasets: scores.map((score, index) => ({
      label: score.capabilityArea,
      data: [
        score.dimensionScores.outcome,
        score.dimensionScores.role,
        score.dimensionScores.businessProcess,
        score.dimensionScores.information,
        score.dimensionScores.technology,
      ],
      backgroundColor: `rgba(${54 + index * 50}, ${162 - index * 30}, ${235 - index * 40}, 0.2)`,
      borderColor: `rgba(${54 + index * 50}, ${162 - index * 30}, ${235 - index * 40}, 1)`,
      borderWidth: 2,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'MITA Maturity Assessment Results' },
    },
    scales: {
      y: { beginAtZero: true, max: 5 },
    },
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'ORBIT Dimension Comparison' },
    },
    scales: {
      r: { beginAtZero: true, max: 5 },
    },
  };

  if (loading) {
    return (
      <div className="ds-u-text-align--center ds-u-padding--4">
        <div className="ds-c-spinner" role="status" aria-label="Loading results">
          <span className="ds-u-visibility--screen-reader">Loading...</span>
        </div>
        <p className="ds-u-margin-top--2">Calculating assessment results...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="ds-c-alert ds-c-alert--error">
        <div className="ds-c-alert__body">
          <h3 className="ds-c-alert__heading">Error Loading Results</h3>
          <p className="ds-c-alert__text">{error || 'Assessment not found'}</p>
          <Link href="/dashboard" className="ds-c-button ds-c-button--primary ds-u-margin-top--2">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-l-container">
      <div className="ds-l-row ds-u-justify-content--center">
        <div className="ds-l-col--12 ds-l-lg-col--10">
          {/* Header */}
          <header className="ds-u-margin-bottom--4">
            <h1 className="ds-display--1 ds-u-margin-bottom--2">Assessment Results</h1>
            <p className="ds-text--lead">
              MITA maturity assessment results for {assessment.stateName}
            </p>
            <div className="ds-u-margin-top--2">
              <span className="ds-c-badge ds-c-badge--success">Completed</span>
              <span className="ds-u-margin-left--2 ds-text--small ds-u-color--muted">
                Last updated: {new Date(assessment.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </header>

          {/* Summary Cards */}
          <div className="ds-l-row ds-u-margin-bottom--4">
            <div className="ds-l-col--12 ds-l-md-col--4">
              <div className="ds-c-card">
                <div className="ds-c-card__body ds-u-text-align--center">
                  <h3 className="ds-h3 ds-u-margin-bottom--1">Overall Average</h3>
                  <div className="ds-display--2 ds-u-color--primary">
                    {scores.length > 0
                      ? (
                          scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length
                        ).toFixed(1)
                      : '0.0'}
                  </div>
                  <p className="ds-text--small ds-u-color--muted">out of 5.0</p>
                </div>
              </div>
            </div>
            <div className="ds-l-col--12 ds-l-md-col--4">
              <div className="ds-c-card">
                <div className="ds-c-card__body ds-u-text-align--center">
                  <h3 className="ds-h3 ds-u-margin-bottom--1">Capability Areas</h3>
                  <div className="ds-display--2 ds-u-color--primary">{scores.length}</div>
                  <p className="ds-text--small ds-u-color--muted">assessed</p>
                </div>
              </div>
            </div>
            <div className="ds-l-col--12 ds-l-md-col--4">
              <div className="ds-c-card">
                <div className="ds-c-card__body ds-u-text-align--center">
                  <h3 className="ds-h3 ds-u-margin-bottom--1">Domains</h3>
                  <div className="ds-display--2 ds-u-color--primary">
                    {new Set(scores.map(s => s.domain)).size}
                  </div>
                  <p className="ds-text--small ds-u-color--muted">covered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          {scores.length > 0 && (
            <div className="ds-u-margin-bottom--4">
              <h2 className="ds-h2 ds-u-margin-bottom--3">Visualization</h2>
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
            </div>
          )}

          {/* Detailed Results Table */}
          <div className="ds-u-margin-bottom--4">
            <h2 className="ds-h2 ds-u-margin-bottom--3">Detailed Results</h2>
            {scores.length > 0 ? (
              <div className="ds-c-table-wrapper">
                <table className="ds-c-table">
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Capability Area</th>
                      <th>Overall</th>
                      <th>Outcome</th>
                      <th>Role</th>
                      <th>Business Process</th>
                      <th>Information</th>
                      <th>Technology</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score, index) => (
                      <tr key={index}>
                        <td>{score.domain}</td>
                        <td>{score.capabilityArea}</td>
                        <td>
                          <strong>{score.overallScore}</strong>
                        </td>
                        <td>{score.dimensionScores.outcome}</td>
                        <td>{score.dimensionScores.role}</td>
                        <td>{score.dimensionScores.businessProcess}</td>
                        <td>{score.dimensionScores.information}</td>
                        <td>{score.dimensionScores.technology}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="ds-c-alert ds-c-alert--warn">
                <div className="ds-c-alert__body">
                  <h3 className="ds-c-alert__heading">Assessment Not Started</h3>
                  <p className="ds-c-alert__text">
                    This assessment has {assessment?.capabilities?.length || 0} capability areas
                    selected, but no maturity levels have been set yet.
                  </p>
                  <p className="ds-u-margin-top--2">
                    <Link
                      href={`/assessment/${assessmentId}`}
                      className="ds-c-button ds-c-button--primary"
                    >
                      Start Assessment
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Export Options */}
          <div className="ds-u-margin-bottom--4">
            <h2 className="ds-h2 ds-u-margin-bottom--3">Export Results</h2>
            <div className="ds-l-row">
              <div className="ds-l-col--12 ds-l-md-col--6">
                <div className="ds-c-card">
                  <div className="ds-c-card__body">
                    <h3 className="ds-h3 ds-u-margin-bottom--2">PDF Report</h3>
                    <p className="ds-u-margin-bottom--3">
                      Generate a comprehensive PDF report with charts and detailed results.
                    </p>
                    <button
                      type="button"
                      className="ds-c-button ds-c-button--primary ds-u-margin-right--2"
                      onClick={() =>
                        handleExport({ format: 'pdf', includeDetails: true, includeCharts: true })
                      }
                      disabled={exporting}
                    >
                      {exporting ? 'Generating...' : 'Download PDF'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="ds-l-col--12 ds-l-md-col--6">
                <div className="ds-c-card">
                  <div className="ds-c-card__body">
                    <h3 className="ds-h3 ds-u-margin-bottom--2">CSV Data</h3>
                    <p className="ds-u-margin-bottom--3">
                      Export raw assessment data in CSV format for further analysis.
                    </p>
                    <button
                      type="button"
                      className="ds-c-button ds-c-button--transparent"
                      onClick={() =>
                        handleExport({ format: 'csv', includeDetails: false, includeCharts: false })
                      }
                      disabled={exporting}
                    >
                      {exporting ? 'Generating...' : 'Download CSV'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="ds-u-margin-bottom--4 ds-u-padding-top--4 ds-u-border-top--1">
            <div className="ds-l-row">
              <div className="ds-l-col--auto ds-u-margin-right--2">
                <Link href="/dashboard" className="ds-c-button ds-c-button--primary">
                  Return to Dashboard
                </Link>
              </div>
              <div className="ds-l-col--auto">
                <Link
                  href={`/assessment/${assessmentId}`}
                  className="ds-c-button ds-c-button--transparent"
                >
                  View Assessment Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentResults;
