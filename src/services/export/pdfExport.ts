/**
 * PDF Export Service
 *
 * Generates comprehensive professional PDF reports using jsPDF.
 * Includes cover page, executive summary, domain details, and full assessment data.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ExportData, ExportOptions } from './types';
import type { OrbitDimensionId, OrbitRating, LevelKey } from '../../types';
import { getDimension, getAspect, getMaturityLevelMeta, getTechnologySubDimension } from '../orbit';
import { getDomainById, getAreaById } from '../capabilities';
import {
  PAGE,
  MARGIN,
  CONTENT_WIDTH,
  COLORS,
  DIMENSION_NAMES,
  getMaturityLevelName,
} from './pdfStyles';

/** Page dimensions - re-exported for local use */
const PAGE_WIDTH = PAGE.WIDTH;
const PAGE_HEIGHT = PAGE.HEIGHT;
const MARGIN_LEFT = MARGIN.LEFT;
const MARGIN_RIGHT = MARGIN.RIGHT;
const MARGIN_TOP = MARGIN.TOP;
const MARGIN_BOTTOM = MARGIN.BOTTOM;

/** Extended jsPDF type with autoTable */
type JsPDFWithAutoTable = jsPDF & { lastAutoTable: { finalY: number } };

/**
 * Generates a comprehensive PDF report from export data
 */
export async function generatePdfReport(data: ExportData, options: ExportOptions): Promise<Blob> {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  const stateName = options.stateName ?? 'State';

  // Generate cover page
  generateCoverPage(doc, data, stateName);

  // Generate executive summary
  doc.addPage();
  generateExecutiveSummary(doc, data);

  // Generate domain details
  const finalizedAssessments = data.data.assessments.filter((a) => a.status === 'finalized');

  // Group assessments by domain
  const assessmentsByDomain = new Map<string, typeof finalizedAssessments>();
  for (const assessment of finalizedAssessments) {
    const existing = assessmentsByDomain.get(assessment.capabilityDomainId);
    if (existing) {
      existing.push(assessment);
    } else {
      assessmentsByDomain.set(assessment.capabilityDomainId, [assessment]);
    }
  }

  // Generate detailed section for each domain
  for (const [domainId, domainAssessments] of assessmentsByDomain) {
    doc.addPage();
    generateDomainSection(doc, domainId, domainAssessments, data);
  }

  // Add page numbers and footer
  addPageNumbersAndFooter(doc, stateName);

  return doc.output('blob');
}

/**
 * Generates the cover page
 */
function generateCoverPage(doc: JsPDFWithAutoTable, data: ExportData, stateName: string): void {
  const centerX = PAGE_WIDTH / 2;

  // Header bar - taller for more presence
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, PAGE_WIDTH, 60, 'F');

  // Title
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('MITA 4.0', centerX, 28, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Maturity Assessment Report', centerX, 42, { align: 'center' });

  // State name - larger and more prominent
  doc.setTextColor(...COLORS.secondary);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(stateName, centerX, 90, { align: 'center' });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.darkGray);
  doc.text('State Medicaid Agency Self-Assessment', centerX, 100, { align: 'center' });

  // Divider line
  doc.setDrawColor(...COLORS.mediumGray);
  doc.setLineWidth(0.5);
  doc.line(centerX - 50, 110, centerX + 50, 110);

  // Overall score section
  const finalizedAssessments = data.data.assessments.filter((a) => a.status === 'finalized');
  const scores = finalizedAssessments
    .map((a) => a.overallScore)
    .filter((s): s is number => s !== undefined);

  const yScoreSection = 130;

  if (scores.length > 0) {
    const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maturityLevel = getMaturityLevelName(overallScore);

    // Score circle/badge
    doc.setFillColor(...COLORS.primary);
    doc.circle(centerX, yScoreSection + 20, 25, 'F');

    doc.setTextColor(...COLORS.white);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(overallScore.toFixed(1), centerX, yScoreSection + 25, { align: 'center' });

    // Label below score
    doc.setTextColor(...COLORS.secondary);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Maturity Score', centerX, yScoreSection + 55, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.darkGray);
    doc.text(`Maturity Level: ${maturityLevel}`, centerX, yScoreSection + 63, { align: 'center' });
  } else {
    // No finalized assessments
    doc.setTextColor(...COLORS.darkGray);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('No finalized assessments', centerX, yScoreSection + 25, { align: 'center' });
  }

  // Stats cards row
  const yStats = 210;
  const cardWidth = 50;
  const cardHeight = 35;
  const cardSpacing = 8;
  const totalWidth = cardWidth * 3 + cardSpacing * 2;
  const startX = centerX - totalWidth / 2;

  const statsData = [
    {
      value: finalizedAssessments.length.toString(),
      label: 'Finalized',
      color: COLORS.accent,
    },
    {
      value: data.data.assessments.filter((a) => a.status === 'in_progress').length.toString(),
      label: 'In Progress',
      color: COLORS.primary,
    },
    {
      value: data.metadata.totalAttachments.toString(),
      label: 'Attachments',
      color: COLORS.darkGray,
    },
  ];

  statsData.forEach((stat, index) => {
    const cardX = startX + index * (cardWidth + cardSpacing);

    // Card background
    doc.setFillColor(...COLORS.lightGray);
    doc.roundedRect(cardX, yStats, cardWidth, cardHeight, 3, 3, 'F');

    // Value
    doc.setTextColor(...stat.color);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(stat.value, cardX + cardWidth / 2, yStats + 15, { align: 'center' });

    // Label
    doc.setTextColor(...COLORS.darkGray);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(stat.label, cardX + cardWidth / 2, yStats + 26, { align: 'center' });
  });

  // Export date at bottom
  const exportDate = new Date(data.exportDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Footer section
  doc.setDrawColor(...COLORS.mediumGray);
  doc.line(MARGIN_LEFT, PAGE_HEIGHT - 35, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 35);

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`Report Generated: ${exportDate}`, centerX, PAGE_HEIGHT - 25, { align: 'center' });

  doc.setFontSize(8);
  doc.text('MITA 4.0 State Self-Assessment Tool', centerX, PAGE_HEIGHT - 18, { align: 'center' });
}

/**
 * Generates the executive summary section
 */
function generateExecutiveSummary(doc: JsPDFWithAutoTable, data: ExportData): number {
  let yPos = MARGIN_TOP;

  // Section header
  yPos = addSectionHeader(doc, 'Executive Summary', yPos);

  // Introduction text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.secondary);

  const introText =
    'This report presents the results of the MITA 4.0 maturity self-assessment. ' +
    'Each capability area has been evaluated across the five ORBIT dimensions: ' +
    'Outcomes, Roles, Business Architecture, Information & Data, and Technology.';

  const splitIntro = doc.splitTextToSize(introText, CONTENT_WIDTH);
  doc.text(splitIntro, MARGIN_LEFT, yPos);
  yPos += splitIntro.length * 5 + 10;

  // Domain scores table
  const finalizedAssessments = data.data.assessments.filter((a) => a.status === 'finalized');

  // Group by domain
  const domainScores = new Map<string, { name: string; scores: number[]; areas: string[] }>();
  for (const assessment of finalizedAssessments) {
    if (assessment.overallScore !== undefined) {
      const existing = domainScores.get(assessment.capabilityDomainId);
      if (existing) {
        existing.scores.push(assessment.overallScore);
        existing.areas.push(assessment.capabilityAreaName);
      } else {
        domainScores.set(assessment.capabilityDomainId, {
          name: assessment.capabilityDomainName,
          scores: [assessment.overallScore],
          areas: [assessment.capabilityAreaName],
        });
      }
    }
  }

  if (domainScores.size > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Domain Maturity Scores', MARGIN_LEFT, yPos);
    yPos += 8;

    const domainTableData = Array.from(domainScores.entries()).map(([, domainData]) => {
      const avg = domainData.scores.reduce((a, b) => a + b, 0) / domainData.scores.length;
      return [
        domainData.name,
        avg.toFixed(1),
        domainData.scores.length.toString(),
        getMaturityLevelName(avg),
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [['Domain', 'Score', 'Areas', 'Maturity Level']],
      body: domainTableData,
      theme: 'striped',
      headStyles: { fillColor: COLORS.primary, fontSize: 10 },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 50 },
      },
      margin: { left: MARGIN_LEFT, right: MARGIN_RIGHT },
    });

    yPos = doc.lastAutoTable.finalY + 15;
  }

  // Dimension scores summary
  if (finalizedAssessments.length > 0) {
    yPos = checkPageBreak(doc, yPos, 60);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ORBIT Dimension Summary', MARGIN_LEFT, yPos);
    yPos += 8;

    // Calculate average scores per dimension
    const dimensionScores: Record<OrbitDimensionId, number[]> = {
      outcomes: [],
      roles: [],
      businessArchitecture: [],
      informationData: [],
      technology: [],
    };

    for (const rating of data.data.ratings) {
      if (rating.currentLevel > 0) {
        dimensionScores[rating.dimensionId].push(rating.currentLevel);
      }
    }

    const dimensionTableData = Object.entries(dimensionScores)
      .filter(([, scores]) => scores.length > 0)
      .map(([dimId, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const dimension = getDimension(dimId as OrbitDimensionId);
        return [
          DIMENSION_NAMES[dimId as OrbitDimensionId],
          avg.toFixed(1),
          dimension?.required ? 'Required' : 'Optional',
        ];
      });

    if (dimensionTableData.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Dimension', 'Avg Score', 'Status']],
        body: dimensionTableData,
        theme: 'striped',
        headStyles: { fillColor: COLORS.primary, fontSize: 10 },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { left: MARGIN_LEFT, right: MARGIN_RIGHT },
      });

      yPos = doc.lastAutoTable.finalY + 10;
    }
  }

  return yPos;
}

/**
 * Generates a detailed section for a domain
 */
function generateDomainSection(
  doc: JsPDFWithAutoTable,
  domainId: string,
  assessments: ExportData['data']['assessments'],
  data: ExportData
): number {
  let yPos = MARGIN_TOP;

  const domain = getDomainById(domainId);
  if (!domain) return yPos;

  // Domain header
  yPos = addSectionHeader(doc, domain.name, yPos);

  // Domain description
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.secondary);
  const descLines = doc.splitTextToSize(domain.description, CONTENT_WIDTH);
  doc.text(descLines, MARGIN_LEFT, yPos);
  yPos += descLines.length * 5 + 10;

  // Domain score summary
  const scores = assessments.map((a) => a.overallScore).filter((s): s is number => s !== undefined);

  if (scores.length > 0) {
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    doc.setFillColor(...COLORS.lightGray);
    doc.roundedRect(MARGIN_LEFT, yPos, CONTENT_WIDTH, 20, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text(`Domain Average: ${avgScore.toFixed(1)} / 5.0`, MARGIN_LEFT + 5, yPos + 8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.darkGray);
    doc.text(
      `${assessments.length} capability area${assessments.length > 1 ? 's' : ''} assessed`,
      MARGIN_LEFT + 5,
      yPos + 15
    );

    yPos += 28;
  }

  // Each capability area
  for (const assessment of assessments) {
    yPos = checkPageBreak(doc, yPos, 80);
    yPos = generateCapabilityAreaSection(doc, assessment, data, yPos);
  }

  return yPos;
}

/**
 * Generates a section for a single capability area
 */
function generateCapabilityAreaSection(
  doc: JsPDFWithAutoTable,
  assessment: ExportData['data']['assessments'][0],
  data: ExportData,
  startY: number
): number {
  let yPos = startY;

  const area = getAreaById(assessment.capabilityAreaId);

  // Capability area header
  doc.setFillColor(...COLORS.primary);
  doc.rect(MARGIN_LEFT, yPos, CONTENT_WIDTH, 8, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.white);
  doc.text(assessment.capabilityAreaName, MARGIN_LEFT + 3, yPos + 5.5);

  // Score badge
  if (assessment.overallScore !== undefined) {
    const scoreText = assessment.overallScore.toFixed(1);
    doc.setFillColor(...COLORS.accent);
    doc.roundedRect(PAGE_WIDTH - MARGIN_RIGHT - 20, yPos + 1, 17, 6, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.white);
    doc.text(scoreText, PAGE_WIDTH - MARGIN_RIGHT - 11.5, yPos + 5, { align: 'center' });
  }

  yPos += 12;

  // Area description
  if (area) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.secondary);
    const areaDescLines = doc.splitTextToSize(area.description, CONTENT_WIDTH);
    doc.text(areaDescLines, MARGIN_LEFT, yPos);
    yPos += areaDescLines.length * 4 + 4;

    // Topics
    if (area.topics && area.topics.length > 0) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...COLORS.darkGray);
      const topicsText = `Topics: ${area.topics.join(', ')}`;
      const topicLines = doc.splitTextToSize(topicsText, CONTENT_WIDTH);
      doc.text(topicLines, MARGIN_LEFT, yPos);
      yPos += topicLines.length * 3.5 + 6;
    }
  }

  // Get ratings for this assessment
  const ratings = data.data.ratings.filter((r) => r.capabilityAssessmentId === assessment.id);

  // Group ratings by dimension
  const ratingsByDimension = new Map<OrbitDimensionId, OrbitRating[]>();
  for (const rating of ratings) {
    const existing = ratingsByDimension.get(rating.dimensionId);
    if (existing) {
      existing.push(rating);
    } else {
      ratingsByDimension.set(rating.dimensionId, [rating]);
    }
  }

  // Generate dimension details
  for (const [dimensionId, dimRatings] of ratingsByDimension) {
    yPos = checkPageBreak(doc, yPos, 40);
    yPos = generateDimensionDetails(doc, dimensionId, dimRatings, yPos);
  }

  // Attachments for this assessment
  const attachments = data.data.attachments.filter(
    (a) => a.capabilityAssessmentId === assessment.id
  );

  if (attachments.length > 0) {
    yPos = checkPageBreak(doc, yPos, 30);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.secondary);
    doc.text('Attachments:', MARGIN_LEFT, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    for (const attachment of attachments) {
      const attachText = `• ${attachment.fileName}`;
      doc.text(attachText, MARGIN_LEFT + 3, yPos);
      yPos += 4;
    }
    yPos += 4;
  }

  // Add spacing between capability areas
  yPos += 8;

  return yPos;
}

/**
 * Generates details for a dimension's ratings
 */
function generateDimensionDetails(
  doc: JsPDFWithAutoTable,
  dimensionId: OrbitDimensionId,
  ratings: OrbitRating[],
  startY: number
): number {
  let yPos = startY;

  const dimension = getDimension(dimensionId);
  if (!dimension) return yPos;

  // Dimension subheader
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(DIMENSION_NAMES[dimensionId], MARGIN_LEFT, yPos);

  // Calculate dimension average
  const assessed = ratings.filter((r) => r.currentLevel > 0);
  if (assessed.length > 0) {
    const avg = assessed.reduce((sum, r) => sum + r.currentLevel, 0) / assessed.length;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.darkGray);
    doc.text(`(Avg: ${avg.toFixed(1)})`, MARGIN_LEFT + 50, yPos);
  }

  yPos += 6;

  // Build table data for aspects
  const tableData: string[][] = [];

  for (const rating of ratings) {
    const aspect = getAspect(dimensionId, rating.aspectId, rating.subDimensionId);

    if (!aspect) continue;

    // Get level info
    let levelName = 'Not Rated';
    let levelDesc = '';

    if (rating.currentLevel > 0) {
      const levelKey = `level${rating.currentLevel}` as LevelKey;
      const levelMeta = getMaturityLevelMeta(levelKey);
      levelName = `${rating.currentLevel} - ${levelMeta.name}`;

      // Get aspect-specific level description
      const aspectLevel = aspect.levels[levelKey];
      if (aspectLevel) {
        levelDesc = aspectLevel.description;
      }
    } else if (rating.currentLevel === 0) {
      levelName = 'N/A';
      levelDesc = 'Not applicable to this capability area';
    }

    // Sub-dimension prefix for Technology
    let aspectName = aspect.name;
    if (dimensionId === 'technology' && rating.subDimensionId) {
      const subDim = getTechnologySubDimension(rating.subDimensionId);
      if (subDim) {
        aspectName = `${subDim.name}: ${aspect.name}`;
      }
    }

    tableData.push([aspectName, levelName, levelDesc]);
  }

  if (tableData.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Aspect', 'Level', 'Description']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: COLORS.lightGray,
        textColor: COLORS.secondary,
        fontSize: 8,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        cellWidth: 'wrap',
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 28 },
        2: { cellWidth: 'auto' },
      },
      margin: { left: MARGIN_LEFT, right: MARGIN_RIGHT },
      tableWidth: CONTENT_WIDTH,
    });

    yPos = doc.lastAutoTable.finalY + 4;
  }

  // Add notes, barriers, and plans if any rating has them
  const ratingsWithText = ratings.filter(
    (r) =>
      (r.notes && r.notes.trim()) ||
      (r.barriers && r.barriers.trim()) ||
      (r.plans && r.plans.trim())
  );

  if (ratingsWithText.length > 0) {
    yPos = checkPageBreak(doc, yPos, 25);

    doc.setFontSize(8);
    doc.setTextColor(...COLORS.darkGray);

    for (const rating of ratingsWithText) {
      const aspect = getAspect(dimensionId, rating.aspectId, rating.subDimensionId);
      if (!aspect) continue;

      // Notes
      if (rating.notes && rating.notes.trim()) {
        yPos = checkPageBreak(doc, yPos, 12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${aspect.name} - Notes:`, MARGIN_LEFT + 3, yPos);
        yPos += 4;
        doc.setFont('helvetica', 'normal');
        const noteLines = doc.splitTextToSize(rating.notes, CONTENT_WIDTH - 10);
        doc.text(noteLines, MARGIN_LEFT + 5, yPos);
        yPos += noteLines.length * 3.5 + 2;
      }

      // Barriers & Challenges
      if (rating.barriers && rating.barriers.trim()) {
        yPos = checkPageBreak(doc, yPos, 12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${aspect.name} - Barriers & Challenges:`, MARGIN_LEFT + 3, yPos);
        yPos += 4;
        doc.setFont('helvetica', 'normal');
        const barrierLines = doc.splitTextToSize(rating.barriers, CONTENT_WIDTH - 10);
        doc.text(barrierLines, MARGIN_LEFT + 5, yPos);
        yPos += barrierLines.length * 3.5 + 2;
      }

      // Advancement Plans
      if (rating.plans && rating.plans.trim()) {
        yPos = checkPageBreak(doc, yPos, 12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${aspect.name} - Advancement Plans:`, MARGIN_LEFT + 3, yPos);
        yPos += 4;
        doc.setFont('helvetica', 'normal');
        const planLines = doc.splitTextToSize(rating.plans, CONTENT_WIDTH - 10);
        doc.text(planLines, MARGIN_LEFT + 5, yPos);
        yPos += planLines.length * 3.5 + 2;
      }
    }
  }

  yPos += 4;
  return yPos;
}

/**
 * Adds a section header with styling
 */
function addSectionHeader(doc: JsPDFWithAutoTable, title: string, yPos: number): number {
  doc.setFillColor(...COLORS.primary);
  doc.rect(MARGIN_LEFT, yPos, 4, 10, 'F');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.secondary);
  doc.text(title, MARGIN_LEFT + 8, yPos + 7);

  return yPos + 15;
}

/**
 * Checks if we need a page break and adds one if necessary
 */
function checkPageBreak(doc: JsPDFWithAutoTable, yPos: number, requiredSpace: number): number {
  if (yPos + requiredSpace > PAGE_HEIGHT - MARGIN_BOTTOM) {
    doc.addPage();
    return MARGIN_TOP;
  }
  return yPos;
}

/**
 * Adds page numbers and footer to all pages
 */
function addPageNumbersAndFooter(doc: JsPDFWithAutoTable, stateName: string): void {
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Skip cover page for page numbers
    if (i === 1) continue;

    // Footer line
    doc.setDrawColor(...COLORS.mediumGray);
    doc.line(MARGIN_LEFT, PAGE_HEIGHT - 18, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 18);

    // Page number
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.darkGray);
    doc.text(`Page ${i - 1} of ${pageCount - 1}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 12, {
      align: 'center',
    });

    // Footer text
    doc.setFontSize(8);
    doc.text(`${stateName} - MITA 4.0 Maturity Assessment`, MARGIN_LEFT, PAGE_HEIGHT - 12);
  }
}
