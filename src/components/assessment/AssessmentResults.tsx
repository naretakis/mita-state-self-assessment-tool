'use client';

import { useEffect, useState } from 'react';

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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Link from 'next/link';
import { Bar, Radar } from 'react-chartjs-2';

import ContentService from '@/services/ContentService';
import { ScoringService, type EnhancedMaturityScore } from '@/services/ScoringService';

// Create a singleton instance
const scoringService = new ScoringService();

import { useStorageContext } from '../storage/StorageProvider';

import type { Assessment } from '../../types';

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

// Use the enhanced scoring interface from the service
type MaturityScore = EnhancedMaturityScore;

interface ExportOptions {
  format: 'pdf' | 'csv';
  includeDetails: boolean;
  includeCharts: boolean;
}

/**
 * Calculate maturity scores for assessment using enhanced scoring
 */
function calculateMaturityScores(assessment: Assessment, definitions: any[]): MaturityScore[] {
  try {
    // Use the enhanced scoring service
    return scoringService.calculateOverallScore(assessment, definitions);
  } catch (error) {
    console.error('Error calculating enhanced scores, falling back to basic scoring:', error);

    // Fallback to basic scoring for backward compatibility
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
        baseScore: Math.round(overallScore * 10) / 10,
        partialCredit: 0,
        dimensionScores: {
          outcome: {
            maturityLevel: scores.outcome,
            partialCredit: 0,
            finalScore: scores.outcome,
            checkboxCompletion: { completed: 0, total: 0, percentage: 0 },
          },
          role: {
            maturityLevel: scores.role,
            partialCredit: 0,
            finalScore: scores.role,
            checkboxCompletion: { completed: 0, total: 0, percentage: 0 },
          },
          businessProcess: {
            maturityLevel: scores.businessProcess,
            partialCredit: 0,
            finalScore: scores.businessProcess,
            checkboxCompletion: { completed: 0, total: 0, percentage: 0 },
          },
          information: {
            maturityLevel: scores.information,
            partialCredit: 0,
            finalScore: scores.information,
            checkboxCompletion: { completed: 0, total: 0, percentage: 0 },
          },
          technology: {
            maturityLevel: scores.technology,
            partialCredit: 0,
            finalScore: scores.technology,
            checkboxCompletion: { completed: 0, total: 0, percentage: 0 },
          },
        },
      };
    });
  }
}

/**
 * Generate CSV content from assessment data with enhanced scoring
 */
function generateCSV(assessment: Assessment, scores: MaturityScore[]): string {
  const headers = [
    'Domain',
    'Capability Area',
    'Overall Score',
    'Base Score',
    'Partial Credit',
    'Outcome Final',
    'Outcome Base',
    'Outcome Partial',
    'Role Final',
    'Role Base',
    'Role Partial',
    'Business Process Final',
    'Business Process Base',
    'Business Process Partial',
    'Information Final',
    'Information Base',
    'Information Partial',
    'Technology Final',
    'Technology Base',
    'Technology Partial',
  ];
  const rows = scores.map(score => [
    score.domain,
    score.capabilityArea,
    score.overallScore.toFixed(2),
    score.baseScore.toFixed(2),
    score.partialCredit.toFixed(2),
    score.dimensionScores.outcome.finalScore.toFixed(2),
    score.dimensionScores.outcome.maturityLevel.toString(),
    score.dimensionScores.outcome.partialCredit.toFixed(2),
    score.dimensionScores.role.finalScore.toFixed(2),
    score.dimensionScores.role.maturityLevel.toString(),
    score.dimensionScores.role.partialCredit.toFixed(2),
    score.dimensionScores.businessProcess.finalScore.toFixed(2),
    score.dimensionScores.businessProcess.maturityLevel.toString(),
    score.dimensionScores.businessProcess.partialCredit.toFixed(2),
    score.dimensionScores.information.finalScore.toFixed(2),
    score.dimensionScores.information.maturityLevel.toString(),
    score.dimensionScores.information.partialCredit.toFixed(2),
    score.dimensionScores.technology.finalScore.toFixed(2),
    score.dimensionScores.technology.maturityLevel.toString(),
    score.dimensionScores.technology.partialCredit.toFixed(2),
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

  // Summary table with enhanced scoring
  const tableData = scores.map(score => [
    score.domain,
    score.capabilityArea,
    score.overallScore.toFixed(2),
    score.baseScore.toFixed(2),
    `+${score.partialCredit.toFixed(2)}`,
    score.dimensionScores.outcome.finalScore.toFixed(2),
    score.dimensionScores.role.finalScore.toFixed(2),
    score.dimensionScores.businessProcess.finalScore.toFixed(2),
    score.dimensionScores.information.finalScore.toFixed(2),
    score.dimensionScores.technology.finalScore.toFixed(2),
  ]);

  autoTable(doc, {
    head: [
      [
        'Domain',
        'Capability Area',
        'Overall',
        'Base',
        'Partial',
        'Outcome',
        'Role',
        'Business Process',
        'Information',
        'Technology',
      ],
    ],
    body: tableData,
    startY: 70,
    styles: { fontSize: 7 },
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

      // Find the corresponding enhanced score data
      const enhancedScore = scores.find(s => s.capabilityArea === capability.capabilityAreaName);

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

        // Get enhanced score for this dimension
        const dimScore =
          enhancedScore?.dimensionScores[dimension as keyof typeof enhancedScore.dimensionScores];
        const finalScore = dimScore?.finalScore || data.maturityLevel || 0;
        const partialCredit = dimScore?.partialCredit || 0;

        doc.setFontSize(10);
        if (partialCredit > 0) {
          doc.text(
            `${dimension}: Score ${finalScore.toFixed(2)} (Level ${data.maturityLevel} + ${partialCredit.toFixed(2)} bonus)`,
            25,
            yPosition
          );
        } else {
          doc.text(`${dimension}: Score ${finalScore.toFixed(2)}`, 25, yPosition);
        }
        yPosition += 8;

        if (data.evidence) {
          const evidenceLines = doc.splitTextToSize(
            `Supporting Description: ${data.evidence}`,
            160
          );
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

  // We'll load capability definitions directly using ContentService

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [scores, setScores] = useState<MaturityScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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

        // Load capability definitions for enhanced scoring
        let definitions: any[] = [];
        try {
          const contentService = new ContentService('/content');
          await contentService.initialize();
          definitions = contentService.getAllCapabilities();
        } catch (err) {
          console.warn('Failed to load capability definitions, using fallback scoring:', err);
        }

        setAssessment(assessmentData);
        const calculatedScores = calculateMaturityScores(assessmentData, definitions);
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

  // Toggle section expansion
  const toggleSection = (capabilityId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(capabilityId)) {
        newSet.delete(capabilityId);
      } else {
        newSet.add(capabilityId);
      }
      return newSet;
    });
  };

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
        score.dimensionScores.outcome.finalScore,
        score.dimensionScores.role.finalScore,
        score.dimensionScores.businessProcess.finalScore,
        score.dimensionScores.information.finalScore,
        score.dimensionScores.technology.finalScore,
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
              <div className="ds-u-margin-bottom--4">
                {scores.map((score, index) => {
                  const capability = assessment?.capabilities.find(
                    cap => cap.capabilityAreaName === score.capabilityArea
                  );
                  const capabilityId = capability?.id || `capability-${index}`;
                  const isExpanded = expandedSections.has(capabilityId);

                  return (
                    <div key={capabilityId} className="ds-c-card ds-u-margin-bottom--3">
                      <button
                        type="button"
                        className="ds-c-card__header"
                        onClick={() => toggleSection(capabilityId)}
                        aria-expanded={isExpanded}
                        aria-controls={`details-${capabilityId}`}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          padding: '1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <h3 className="ds-h3 ds-u-margin-bottom--1">{score.capabilityArea}</h3>
                          <p className="ds-text--small ds-u-margin-bottom--0 ds-u-color--muted">
                            {score.domain}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0071bc' }}
                            >
                              {score.overallScore.toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#5c5c5c' }}>out of 5.0</div>
                          </div>
                          <span style={{ fontSize: '1.25rem', color: '#5c5c5c' }}>
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div id={`details-${capabilityId}`} className="ds-c-card__body">
                          {/* Score Breakdown */}
                          <div className="ds-u-margin-bottom--4">
                            <h4 className="ds-h4 ds-u-margin-bottom--2">Score Breakdown</h4>
                            <div className="ds-l-row">
                              <div className="ds-l-col--12 ds-l-md-col--6">
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem',
                                  }}
                                >
                                  <span>Base Score:</span>
                                  <strong>{score.baseScore.toFixed(2)}</strong>
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem',
                                  }}
                                >
                                  <span>Partial Credit:</span>
                                  <strong
                                    className={score.partialCredit > 0 ? 'ds-u-color--success' : ''}
                                  >
                                    +{score.partialCredit.toFixed(2)}
                                  </strong>
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid #dee2e6',
                                    paddingTop: '0.5rem',
                                  }}
                                >
                                  <span>
                                    <strong>Overall Score:</strong>
                                  </span>
                                  <strong style={{ color: '#0071bc' }}>
                                    {score.overallScore.toFixed(2)}
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ORBIT Dimension Scores */}
                          <div className="ds-u-margin-bottom--4">
                            <h4 className="ds-h4 ds-u-margin-bottom--2">ORBIT Dimension Scores</h4>
                            <div className="ds-l-row">
                              {Object.entries(score.dimensionScores).map(
                                ([dimension, dimScore]) => {
                                  const dimensionLabels = {
                                    outcome: 'Outcomes',
                                    role: 'Roles',
                                    businessProcess: 'Business Process',
                                    information: 'Information',
                                    technology: 'Technology',
                                  };

                                  return (
                                    <div
                                      key={dimension}
                                      className="ds-l-col--12 ds-l-md-col--6 ds-l-lg-col--4 ds-u-margin-bottom--2"
                                    >
                                      <div
                                        className="ds-c-card"
                                        style={{ padding: '1rem', backgroundColor: '#f8f9fa' }}
                                      >
                                        <h5 className="ds-h5 ds-u-margin-bottom--1">
                                          {
                                            dimensionLabels[
                                              dimension as keyof typeof dimensionLabels
                                            ]
                                          }
                                        </h5>
                                        <div
                                          style={{
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold',
                                            color: '#28a745',
                                          }}
                                        >
                                          {dimScore.finalScore.toFixed(2)}
                                        </div>
                                        {dimScore.partialCredit > 0 && (
                                          <div style={{ fontSize: '0.75rem', color: '#5c5c5c' }}>
                                            Level {dimScore.maturityLevel} +{' '}
                                            {dimScore.partialCredit.toFixed(2)}
                                          </div>
                                        )}
                                        {dimScore.checkboxCompletion.total > 0 && (
                                          <div
                                            style={{
                                              fontSize: '0.75rem',
                                              color: '#5c5c5c',
                                              marginTop: '0.25rem',
                                            }}
                                          >
                                            {dimScore.checkboxCompletion.completed}/
                                            {dimScore.checkboxCompletion.total} checkboxes
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          {/* Assessment Details */}
                          {capability && (
                            <div className="ds-u-margin-bottom--0">
                              <h4 className="ds-h4 ds-u-margin-bottom--2">Assessment Details</h4>
                              {Object.entries(capability.dimensions).map(([dimension, dimData]) => {
                                const dimensionLabels = {
                                  outcome: 'Outcomes',
                                  role: 'Roles',
                                  businessProcess: 'Business Process',
                                  information: 'Information',
                                  technology: 'Technology',
                                };

                                if (!dimData || dimData.maturityLevel === 0) {
                                  return null;
                                }

                                // Get the enhanced score for this dimension
                                const enhancedDimScore =
                                  score.dimensionScores[
                                    dimension as keyof typeof score.dimensionScores
                                  ];

                                return (
                                  <div key={dimension} className="ds-u-margin-bottom--3">
                                    <h5 className="ds-h5 ds-u-margin-bottom--2">
                                      {dimensionLabels[dimension as keyof typeof dimensionLabels]}
                                      <span className="ds-c-badge ds-c-badge--success ds-u-margin-left--1">
                                        Score {enhancedDimScore.finalScore.toFixed(2)}
                                      </span>
                                      {enhancedDimScore.partialCredit > 0 && (
                                        <span className="ds-c-badge ds-c-badge--info ds-u-margin-left--1">
                                          +{enhancedDimScore.partialCredit.toFixed(2)} bonus
                                        </span>
                                      )}
                                    </h5>

                                    {dimData.evidence && (
                                      <div className="ds-u-margin-bottom--2">
                                        <strong>Supporting Description:</strong>
                                        <p className="ds-u-margin-top--1">{dimData.evidence}</p>
                                      </div>
                                    )}

                                    {dimData.barriers && (
                                      <div className="ds-u-margin-bottom--2">
                                        <strong>Barriers and Challenges:</strong>
                                        <p className="ds-u-margin-top--1">{dimData.barriers}</p>
                                      </div>
                                    )}

                                    {dimData.plans && (
                                      <div className="ds-u-margin-bottom--2">
                                        <strong>Outcomes-Based Advancement Plans:</strong>
                                        <p className="ds-u-margin-top--1">{dimData.plans}</p>
                                      </div>
                                    )}

                                    {dimData.notes && (
                                      <div className="ds-u-margin-bottom--2">
                                        <strong>Additional Notes:</strong>
                                        <p className="ds-u-margin-top--1">{dimData.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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
