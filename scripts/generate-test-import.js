/**
 * Generate Test Import ZIP
 *
 * Creates synthetic ZIP files for testing import functionality.
 * Generates realistic assessment data matching the export format.
 *
 * Usage: 
 *   node scripts/generate-test-import.js          # Generate both files
 *   node scripts/generate-test-import.js small    # Generate small file only
 *   node scripts/generate-test-import.js large    # Generate large file only
 */

import JSZip from 'jszip';
import { writeFileSync, readFileSync } from 'fs';
import { randomUUID } from 'crypto';

// ============================================================================
// Configuration
// ============================================================================

const EXPORT_VERSION = '1.0';
const APP_VERSION = '0.1.0';

// Load actual capabilities from the data file
const capabilitiesData = JSON.parse(
  readFileSync('src/data/capabilities.json', 'utf-8')
);

/**
 * Extract all domains and areas from capabilities data
 */
function getAllDomainsAndAreas() {
  const result = [];
  
  for (const domain of capabilitiesData.domains) {
    const domainEntry = {
      id: domain.id,
      name: domain.name,
      areas: [],
    };
    
    if (domain.areas) {
      // Standard domain with direct areas
      domainEntry.areas = domain.areas.map(a => ({
        id: a.id,
        name: a.name,
      }));
    } else if (domain.categories) {
      // Categorized domain (Data Management, Technical)
      for (const category of domain.categories) {
        for (const area of category.areas) {
          domainEntry.areas.push({
            id: area.id,
            name: area.name,
          });
        }
      }
    }
    
    result.push(domainEntry);
  }
  
  return result;
}

// Get all domains/areas from actual data
const ALL_DOMAINS = getAllDomainsAndAreas();

// Small sample for quick testing (3 domains, 8 areas)
const SAMPLE_DOMAINS = [
  {
    id: 'member-management',
    name: 'Member Management',
    areas: [
      { id: 'member-eligibility-management', name: 'Member Eligibility Management' },
      { id: 'member-enrollment-management', name: 'Member Enrollment Management' },
      { id: 'member-support-management', name: 'Member Support Management' },
    ],
  },
  {
    id: 'provider-management',
    name: 'Provider Management',
    areas: [
      { id: 'provider-enrollment', name: 'Provider Enrollment' },
      { id: 'provider-screening', name: 'Provider Screening' },
      { id: 'provider-monitoring', name: 'Provider Monitoring' },
    ],
  },
  {
    id: 'claims-encounter-management',
    name: 'Claims and Encounter Management',
    areas: [
      { id: 'claims-encounter-submission', name: 'Claims and Encounter Submission Management' },
      { id: 'claims-adjudication', name: 'Claims Adjudication' },
    ],
  },
];

// ORBIT dimensions with aspects
const ORBIT_DIMENSIONS = {
  outcomes: {
    name: 'Outcomes',
    required: false,
    aspects: [
      { id: 'culture-mindset', name: 'Culture & Mindset' },
      { id: 'capability', name: 'Capability' },
      { id: 'quality-consistency', name: 'Quality & Consistency' },
    ],
  },
  roles: {
    name: 'Roles',
    required: false,
    aspects: [
      { id: 'technology-resources', name: 'Technology Resources' },
      { id: 'organizational-goals-alignment', name: 'Organizational Goals Alignment' },
      { id: 'governance-standardization', name: 'Governance & Standardization' },
    ],
  },
  businessArchitecture: {
    name: 'Business Architecture',
    required: true,
    aspects: [
      { id: 'business-capability', name: 'Business Capability' },
      { id: 'business-process', name: 'Business Process' },
      { id: 'business-process-model', name: 'Business Process Model' },
    ],
  },
  informationData: {
    name: 'Information & Data',
    required: true,
    aspects: [
      { id: 'data-governance', name: 'Data Governance' },
      { id: 'data-quality', name: 'Data Quality' },
      { id: 'data-architecture', name: 'Data Architecture' },
    ],
  },
  technology: {
    name: 'Technology',
    required: true,
    subDimensions: [
      {
        id: 'infrastructure',
        name: 'Infrastructure',
        aspects: [
          { id: 'cloud-adoption', name: 'Cloud Adoption' },
          { id: 'scalability', name: 'Scalability' },
        ],
      },
      {
        id: 'integration',
        name: 'Integration',
        aspects: [
          { id: 'api-management', name: 'API Management' },
          { id: 'data-exchange', name: 'Data Exchange' },
        ],
      },
      {
        id: 'securityIdentity',
        name: 'Security & Identity',
        aspects: [
          { id: 'access-control', name: 'Access Control' },
          { id: 'data-protection', name: 'Data Protection' },
        ],
      },
    ],
  },
};

// Sample notes, barriers, and plans for realistic content
const SAMPLE_NOTES = [
  'Current processes are documented but not consistently followed across all teams.',
  'Staff training has been completed for core functions. Additional training planned for Q2.',
  'Integration with state HIE is in progress. Expected completion by end of fiscal year.',
  'Legacy system limitations require manual workarounds for some edge cases.',
  'Recent audit identified areas for improvement in documentation practices.',
  'Stakeholder feedback has been positive regarding recent process improvements.',
  'Cross-functional team established to address identified gaps.',
  'Vendor support contract renewed with enhanced SLA requirements.',
];

const SAMPLE_BARRIERS = [
  'Limited staff capacity for implementing new processes.',
  'Budget constraints affecting technology modernization timeline.',
  'Legacy system integration challenges requiring custom development.',
  'Competing priorities with other state initiatives.',
  'Vendor dependency for critical system modifications.',
  'Staff turnover impacting institutional knowledge retention.',
  'Complex regulatory requirements requiring careful interpretation.',
  'Data quality issues in source systems affecting downstream processes.',
];

const SAMPLE_PLANS = [
  'Implement automated monitoring by Q3 2026.',
  'Complete staff training program by end of fiscal year.',
  'Migrate to cloud-based infrastructure within 18 months.',
  'Establish formal governance committee by Q2 2026.',
  'Deploy enhanced reporting dashboard by Q4 2026.',
  'Complete vendor evaluation for system replacement.',
  'Develop comprehensive documentation library.',
  'Implement continuous improvement feedback loop.',
];

const SAMPLE_TAGS = ['FY2026', 'Priority', 'In Review', 'Modernization', 'Compliance'];

// Sample attachment templates
const SAMPLE_ATTACHMENTS = [
  {
    fileName: 'process-documentation.pdf',
    fileType: 'application/pdf',
    description: 'Current state process documentation and workflow diagrams',
  },
  {
    fileName: 'audit-findings-2025.pdf',
    fileType: 'application/pdf',
    description: 'Internal audit findings and recommendations',
  },
  {
    fileName: 'training-materials.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'Staff training materials and procedures',
  },
  {
    fileName: 'system-architecture.png',
    fileType: 'image/png',
    description: 'Current system architecture diagram',
  },
  {
    fileName: 'data-flow-diagram.png',
    fileType: 'image/png',
    description: 'Data flow between systems',
  },
  {
    fileName: 'vendor-sla-agreement.pdf',
    fileType: 'application/pdf',
    description: 'Current vendor SLA agreement',
  },
  {
    fileName: 'compliance-checklist.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    description: 'Federal compliance requirements checklist',
  },
  {
    fileName: 'performance-metrics.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    description: 'Monthly performance metrics report',
  },
  {
    fileName: 'stakeholder-feedback.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'Stakeholder feedback summary',
  },
  {
    fileName: 'improvement-roadmap.pdf',
    fileType: 'application/pdf',
    description: 'Planned improvements and timeline',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomSubset(array, minCount = 1, maxCount = array.length) {
  const count = randomInt(minCount, Math.min(maxCount, array.length));
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateDate(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

// ============================================================================
// Data Generators
// ============================================================================

function generateAssessment(domain, area, status = 'finalized') {
  const id = randomUUID();
  const createdDaysAgo = randomInt(30, 90);
  const updatedDaysAgo = randomInt(0, createdDaysAgo);

  const assessment = {
    id,
    capabilityDomainId: domain.id,
    capabilityDomainName: domain.name,
    capabilityAreaId: area.id,
    capabilityAreaName: area.name,
    status,
    tags: randomSubset(SAMPLE_TAGS, 1, 3),
    createdAt: generateDate(createdDaysAgo),
    updatedAt: generateDate(updatedDaysAgo),
  };

  if (status === 'finalized') {
    assessment.finalizedAt = generateDate(updatedDaysAgo);
    assessment.overallScore = parseFloat((randomInt(20, 45) / 10).toFixed(1));
  }

  return assessment;
}

function generateRatings(assessmentId) {
  const ratings = [];

  // Generate ratings for each dimension
  for (const [dimId, dimConfig] of Object.entries(ORBIT_DIMENSIONS)) {
    if (dimId === 'technology' && dimConfig.subDimensions) {
      // Technology has sub-dimensions
      for (const subDim of dimConfig.subDimensions) {
        for (const aspect of subDim.aspects) {
          ratings.push(generateRating(assessmentId, dimId, aspect.id, subDim.id));
        }
      }
    } else if (dimConfig.aspects) {
      // Regular dimension
      for (const aspect of dimConfig.aspects) {
        ratings.push(generateRating(assessmentId, dimId, aspect.id));
      }
    }
  }

  return ratings;
}

function generateRating(assessmentId, dimensionId, aspectId, subDimensionId = undefined) {
  const currentLevel = randomInt(1, 5);
  const targetLevel = Math.min(5, currentLevel + randomInt(0, 2));

  const rating = {
    id: randomUUID(),
    capabilityAssessmentId: assessmentId,
    dimensionId,
    aspectId,
    currentLevel,
    targetLevel,
    questionResponses: [],
    evidenceResponses: [],
    notes: Math.random() > 0.3 ? randomChoice(SAMPLE_NOTES) : '',
    barriers: Math.random() > 0.5 ? randomChoice(SAMPLE_BARRIERS) : '',
    plans: Math.random() > 0.4 ? randomChoice(SAMPLE_PLANS) : '',
    carriedForward: false,
    attachmentIds: [],
    updatedAt: generateDate(randomInt(0, 30)),
  };

  if (subDimensionId) {
    rating.subDimensionId = subDimensionId;
  }

  return rating;
}

function generateHistory(assessment, ratings) {
  const historyId = randomUUID();
  const snapshotDaysAgo = randomInt(60, 180);

  // Calculate dimension scores
  const dimensionScores = {};
  const ratingsByDim = {};

  for (const rating of ratings) {
    if (!ratingsByDim[rating.dimensionId]) {
      ratingsByDim[rating.dimensionId] = [];
    }
    ratingsByDim[rating.dimensionId].push(rating.currentLevel);
  }

  for (const [dimId, levels] of Object.entries(ratingsByDim)) {
    const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    dimensionScores[dimId] = parseFloat(avg.toFixed(2));
  }

  // Create historical ratings (simplified)
  const historicalRatings = ratings.map((r) => ({
    dimensionId: r.dimensionId,
    subDimensionId: r.subDimensionId,
    aspectId: r.aspectId,
    currentLevel: Math.max(1, r.currentLevel - randomInt(0, 1)),
    targetLevel: r.targetLevel,
    questionResponses: [],
    evidenceResponses: [],
    notes: r.notes,
    barriers: r.barriers,
    plans: r.plans,
  }));

  return {
    id: historyId,
    capabilityAssessmentId: assessment.id,
    capabilityAreaId: assessment.capabilityAreaId,
    snapshotDate: generateDate(snapshotDaysAgo),
    tags: assessment.tags,
    overallScore: Math.max(1, (assessment.overallScore || 3) - 0.5),
    dimensionScores,
    ratings: historicalRatings,
  };
}

function generateTags() {
  return SAMPLE_TAGS.map((name) => ({
    id: randomUUID(),
    name,
    usageCount: randomInt(1, 10),
    lastUsed: generateDate(randomInt(0, 30)),
  }));
}

/**
 * Generate synthetic file content based on file type
 */
function generateSyntheticFileContent(fileType, fileName) {
  if (fileType === 'application/pdf') {
    // Generate a minimal valid PDF
    return Buffer.from(
      '%PDF-1.4\n' +
      '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
      '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
      '3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\n' +
      'xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \n' +
      'trailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF'
    );
  } else if (fileType === 'image/png') {
    // Generate a minimal valid 1x1 PNG (red pixel)
    return Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
      0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x18, 0xdd,
      0x8d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, // IEND chunk
      0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
    ]);
  } else {
    // For other file types, generate placeholder text content
    const content = `
=============================================================================
SYNTHETIC TEST FILE: ${fileName}
=============================================================================

This is a synthetic file generated for testing the MITA 4.0 import functionality.

File Type: ${fileType}
Generated: ${new Date().toISOString()}

This file contains placeholder content to simulate real attachments that would
be included in an actual assessment export. In a real scenario, this would
contain actual documentation, diagrams, or other supporting materials.

=============================================================================
SAMPLE CONTENT
=============================================================================

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Key Points:
- Assessment documentation and evidence
- Process workflows and procedures
- Compliance requirements and checklists
- Performance metrics and reports
- Stakeholder feedback and recommendations

=============================================================================
END OF FILE
=============================================================================
`;
    return Buffer.from(content);
  }
}

/**
 * Generate attachments for an assessment
 */
function generateAttachments(assessment, ratings) {
  const attachments = [];
  const attachmentFiles = []; // For ZIP file content

  // Randomly select 1-3 attachments for this assessment
  const numAttachments = randomInt(1, 3);
  const selectedTemplates = randomSubset(SAMPLE_ATTACHMENTS, numAttachments, numAttachments);

  // Pick random ratings to attach files to
  const ratingsWithAttachments = randomSubset(ratings, numAttachments, numAttachments);

  for (let i = 0; i < selectedTemplates.length; i++) {
    const template = selectedTemplates[i];
    const rating = ratingsWithAttachments[i];
    const attachmentId = randomUUID();

    // Generate file content
    const fileContent = generateSyntheticFileContent(template.fileType, template.fileName);

    // Create attachment metadata
    const attachment = {
      id: attachmentId,
      capabilityAssessmentId: assessment.id,
      orbitRatingId: rating.id,
      fileName: template.fileName,
      fileType: template.fileType,
      fileSize: fileContent.length,
      description: template.description,
      uploadedAt: generateDate(randomInt(0, 30)),
    };

    attachments.push(attachment);

    // Store file content for ZIP
    attachmentFiles.push({
      domainId: assessment.capabilityDomainId,
      areaId: assessment.capabilityAreaId,
      fileName: template.fileName,
      content: fileContent,
    });

    // Update rating with attachment ID
    rating.attachmentIds.push(attachmentId);
  }

  return { attachments, attachmentFiles };
}

// ============================================================================
// CSV Generation (matches csvExport.ts format)
// ============================================================================

function generateMaturityProfileCsv(profile) {
  const lines = [];

  lines.push(`MITA 4.0 Maturity Profile: ${profile.stateName},,,,,`);
  lines.push(',,,,,');

  for (const area of profile.areas) {
    lines.push(`Capability Domain: ${area.domainName},,,,,`);
    lines.push(`Capability Area: ${area.areaName},,,,,`);
    lines.push('ORBIT,As Is,To Be,Notes,Barriers & Challenges,Advancement Plans');

    for (const row of area.rows) {
      const notes = escapeCSV(row.notes);
      const barriers = escapeCSV(row.barriers);
      const plans = escapeCSV(row.plans);
      lines.push(`${row.dimension},${row.asIs},${row.toBe},${notes},${barriers},${plans}`);
    }

    lines.push(',,,,,');
  }

  return lines.join('\n');
}

function escapeCSV(value) {
  if (!value) return '';
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildMaturityProfile(domain, assessments, ratings, stateName) {
  const areas = [];

  for (const assessment of assessments) {
    const areaRatings = ratings.filter((r) => r.capabilityAssessmentId === assessment.id);

    // Group by dimension and calculate averages
    const dimData = {};
    const DIMENSION_NAMES = [
      'Outcomes',
      'Roles',
      'Business Architecture',
      'Information & Data',
      'Technology',
    ];

    for (const dimName of DIMENSION_NAMES) {
      dimData[dimName] = { asIs: [], toBe: [], notes: [], barriers: [], plans: [] };
    }

    const dimIdToName = {
      outcomes: 'Outcomes',
      roles: 'Roles',
      businessArchitecture: 'Business Architecture',
      informationData: 'Information & Data',
      technology: 'Technology',
    };

    for (const rating of areaRatings) {
      const dimName = dimIdToName[rating.dimensionId];
      if (!dimName || !dimData[dimName]) continue;

      if (rating.currentLevel > 0) dimData[dimName].asIs.push(rating.currentLevel);
      if (rating.targetLevel > 0) dimData[dimName].toBe.push(rating.targetLevel);
      if (rating.notes) dimData[dimName].notes.push(rating.notes);
      if (rating.barriers) dimData[dimName].barriers.push(rating.barriers);
      if (rating.plans) dimData[dimName].plans.push(rating.plans);
    }

    const rows = DIMENSION_NAMES.map((dimName) => {
      const d = dimData[dimName];
      return {
        dimension: dimName,
        asIs: d.asIs.length > 0 ? (d.asIs.reduce((a, b) => a + b, 0) / d.asIs.length).toFixed(1) : '',
        toBe: d.toBe.length > 0 ? (d.toBe.reduce((a, b) => a + b, 0) / d.toBe.length).toFixed(1) : '',
        notes: d.notes.join('; '),
        barriers: d.barriers.join('; '),
        plans: d.plans.join('; '),
      };
    });

    areas.push({
      domainName: assessment.capabilityDomainName,
      areaName: assessment.capabilityAreaName,
      rows,
    });
  }

  return {
    stateName,
    domainName: domain.name,
    areas,
  };
}

// ============================================================================
// Main Generation
// ============================================================================

/**
 * Select approximately targetPercent of areas from all domains
 */
function selectAreasForComprehensiveExport(targetPercent = 0.72) {
  const result = [];
  
  for (const domain of ALL_DOMAINS) {
    // Calculate how many areas to include from this domain
    const numToInclude = Math.round(domain.areas.length * targetPercent);
    
    if (numToInclude > 0) {
      // Shuffle and select areas
      const shuffled = [...domain.areas].sort(() => Math.random() - 0.5);
      const selectedAreas = shuffled.slice(0, numToInclude);
      
      result.push({
        id: domain.id,
        name: domain.name,
        areas: selectedAreas,
      });
    }
  }
  
  return result;
}

async function generateTestImportZip(domains, stateName, outputPath, description) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Generating: ${description}`);
  console.log(`State: ${stateName}`);
  console.log(`Output: ${outputPath}`);
  console.log('='.repeat(60) + '\n');

  const zip = new JSZip();
  const allAssessments = [];
  const allRatings = [];
  const allHistory = [];
  const allAttachments = [];
  const allAttachmentFiles = [];
  const maturityProfiles = [];

  // Generate data for each domain
  for (const domain of domains) {
    console.log(`Generating data for domain: ${domain.name}`);

    const domainAssessments = [];

    for (const area of domain.areas) {
      // Generate finalized assessment
      const assessment = generateAssessment(domain, area, 'finalized');
      const ratings = generateRatings(assessment.id);
      const history = generateHistory(assessment, ratings);

      // Generate attachments (50% chance per assessment)
      if (Math.random() > 0.5) {
        const { attachments, attachmentFiles } = generateAttachments(assessment, ratings);
        allAttachments.push(...attachments);
        allAttachmentFiles.push(...attachmentFiles);
        console.log(`  - ${area.name}: ${ratings.length} ratings, score: ${assessment.overallScore}, ${attachments.length} attachments`);
      } else {
        console.log(`  - ${area.name}: ${ratings.length} ratings, score: ${assessment.overallScore}`);
      }

      allAssessments.push(assessment);
      allRatings.push(...ratings);
      allHistory.push(history);
      domainAssessments.push(assessment);
    }

    // Build maturity profile for this domain
    const domainRatings = allRatings.filter((r) =>
      domainAssessments.some((a) => a.id === r.capabilityAssessmentId)
    );
    const profile = buildMaturityProfile(domain, domainAssessments, domainRatings, stateName);
    maturityProfiles.push(profile);
  }

  // Generate tags
  const tags = generateTags();

  // Build export data structure
  const exportData = {
    exportVersion: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    appVersion: APP_VERSION,
    scope: 'full',
    data: {
      assessments: allAssessments,
      ratings: allRatings,
      history: allHistory,
      tags,
      attachments: allAttachments,
    },
    metadata: {
      totalAssessments: allAssessments.length,
      totalRatings: allRatings.length,
      totalHistory: allHistory.length,
      totalAttachments: allAttachments.length,
      capabilities: allAssessments.map((a) => `${a.capabilityDomainId}/${a.capabilityAreaId}`),
    },
  };

  // Add data.json
  console.log('\nAdding data.json...');
  zip.file('data.json', JSON.stringify(exportData, null, 2));

  // Add maturity profiles
  console.log('Adding maturity profiles...');
  const csvFolder = zip.folder('maturity-profiles');

  for (const profile of maturityProfiles) {
    const csv = generateMaturityProfileCsv(profile);
    const fileName = `${profile.domainName.toLowerCase().replace(/\s+/g, '-')}-maturity-profile.csv`;
    csvFolder.file(fileName, csv);
    console.log(`  - ${fileName}`);
  }

  // Add combined CSV
  const combinedAreas = maturityProfiles.flatMap((p) => p.areas);
  const combinedProfile = { stateName, domainName: 'All Domains', areas: combinedAreas };
  csvFolder.file('all-domains-maturity-profile.csv', generateMaturityProfileCsv(combinedProfile));
  console.log('  - all-domains-maturity-profile.csv');

  // Add attachments
  if (allAttachmentFiles.length > 0) {
    console.log('Adding attachments...');
    const attachmentsFolder = zip.folder('attachments');

    for (const file of allAttachmentFiles) {
      const folderPath = `${file.domainId}/${file.areaId}`;
      const folder = attachmentsFolder.folder(folderPath);
      folder.file(file.fileName, file.content);
      console.log(`  - ${folderPath}/${file.fileName}`);
    }
  }

  // Add manifest
  console.log('Adding manifest.json...');
  const manifest = {
    exportVersion: EXPORT_VERSION,
    exportDate: exportData.exportDate,
    appVersion: APP_VERSION,
    scope: 'full',
    contents: {
      dataJson: true,
      maturityProfiles: true,
      attachments: allAttachmentFiles.length > 0,
    },
    stats: exportData.metadata,
  };
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // Generate ZIP
  console.log('\nGenerating ZIP file...');
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

  // Write to file
  writeFileSync(outputPath, zipBuffer);

  // Calculate total areas in all domains
  const totalPossibleAreas = ALL_DOMAINS.reduce((sum, d) => sum + d.areas.length, 0);
  const completionPercent = ((allAssessments.length / totalPossibleAreas) * 100).toFixed(1);

  console.log(`\n✓ Generated: ${outputPath}`);
  console.log(`  - ${allAssessments.length} assessments (${completionPercent}% of ${totalPossibleAreas} total areas)`);
  console.log(`  - ${allRatings.length} ratings`);
  console.log(`  - ${allHistory.length} history records`);
  console.log(`  - ${allAttachments.length} attachments`);
  console.log(`  - ${maturityProfiles.length} maturity profiles`);
  
  return {
    assessments: allAssessments.length,
    ratings: allRatings.length,
    attachments: allAttachments.length,
  };
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'both';
  
  console.log('MITA 4.0 Test Import Generator');
  console.log(`Total capability areas in model: ${ALL_DOMAINS.reduce((sum, d) => sum + d.areas.length, 0)}`);
  
  if (mode === 'small' || mode === 'both') {
    await generateTestImportZip(
      SAMPLE_DOMAINS,
      'Sample State',
      'test-data/test-import-small.zip',
      'Small Test Import (3 domains, 8 areas)'
    );
  }
  
  if (mode === 'large' || mode === 'both') {
    const comprehensiveDomains = selectAreasForComprehensiveExport(0.72);
    const totalAreas = comprehensiveDomains.reduce((sum, d) => sum + d.areas.length, 0);
    
    await generateTestImportZip(
      comprehensiveDomains,
      'Comprehensive State',
      'test-data/test-import-comprehensive.zip',
      `Comprehensive Test Import (~72%, ${totalAreas} areas)`
    );
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Done! Test files generated in test-data/');
  console.log('='.repeat(60));
}

main().catch(console.error);
