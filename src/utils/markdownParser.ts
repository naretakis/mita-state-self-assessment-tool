import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CapabilityDefinition, DimensionDefinition, CapabilityFrontMatter } from '../types';

/**
 * Parses a markdown file containing a MITA capability definition
 * @param fileContent Content of the markdown file
 * @returns Parsed CapabilityDefinition object
 */
export function parseCapabilityMarkdown(fileContent: string): CapabilityDefinition {
  // Parse front matter and content
  const { data, content } = matter(fileContent);
  const frontMatter = data as CapabilityFrontMatter;
  
  // Generate a unique ID based on domain and capability name
  const id = `${frontMatter.capabilityDomain.toLowerCase()}-${frontMatter.capabilityArea.toLowerCase().replace(/\\s+/g, '-')}`;
  
  // Initialize the capability definition
  const capabilityDefinition: CapabilityDefinition = {
    id,
    name: frontMatter.capabilityArea,
    domainName: frontMatter.capabilityDomain,
    moduleName: '', // Not specified in the sample, might need to be added to front matter
    version: frontMatter.version,
    lastUpdated: frontMatter.capabilityAreaLastUpdated,
    description: '',
    dimensions: {
      outcome: createEmptyDimension(),
      role: createEmptyDimension(),
      businessProcess: createEmptyDimension(),
      informationData: createEmptyDimension(),
      technology: createEmptyDimension()
    }
  };
  
  // Parse the markdown content
  const sections = parseMarkdownSections(content);
  
  // Extract capability description
  capabilityDefinition.description = sections[`Capability Area: ${frontMatter.capabilityArea}`] || '';
  
  // Extract dimensions
  extractDimension(sections, 'Outcomes', capabilityDefinition.dimensions.outcome);
  extractDimension(sections, 'Roles', capabilityDefinition.dimensions.role);
  extractDimension(sections, 'Business Processes', capabilityDefinition.dimensions.businessProcess);
  extractDimension(sections, 'Information', capabilityDefinition.dimensions.informationData);
  extractDimension(sections, 'Technology', capabilityDefinition.dimensions.technology);
  
  return capabilityDefinition;
}

/**
 * Loads all capability markdown files from a directory
 * @param directoryPath Path to directory containing markdown files
 * @returns Array of parsed CapabilityDefinition objects
 */
export async function loadCapabilityDefinitions(directoryPath: string): Promise<CapabilityDefinition[]> {
  const files = fs.readdirSync(directoryPath)
    .filter(file => file.endsWith('.md'));
  
  const capabilities: CapabilityDefinition[] = [];
  
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    try {
      const capability = parseCapabilityMarkdown(fileContent);
      capabilities.push(capability);
    } catch (error) {
      console.error(`Error parsing ${file}:`, error);
    }
  }
  
  return capabilities;
}

/**
 * Helper function to create an empty dimension definition
 */
function createEmptyDimension(): DimensionDefinition {
  return {
    description: '',
    assessmentQuestions: [],
    maturityLevels: {
      level1: '',
      level2: '',
      level3: '',
      level4: '',
      level5: ''
    }
  };
}

/**
 * Parse markdown content into sections by headers
 */
function parseMarkdownSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // Split content by level 2 headers (##)
  const level2Regex = /^## (.+)$/gm;
  let match;
  let lastIndex = 0;
  let lastHeader = '';
  
  while ((match = level2Regex.exec(content)) !== null) {
    if (lastHeader) {
      const sectionContent = content.substring(lastIndex, match.index).trim();
      sections[lastHeader] = sectionContent;
    }
    
    lastHeader = match[1];
    lastIndex = match.index + match[0].length;
  }
  
  // Add the last section
  if (lastHeader) {
    sections[lastHeader] = content.substring(lastIndex).trim();
  }
  
  return sections;
}

/**
 * Extract dimension information from markdown sections
 */
function extractDimension(sections: Record<string, string>, dimensionName: string, dimension: DimensionDefinition): void {
  const sectionContent = sections[dimensionName];
  if (!sectionContent) return;
  
  // Parse subsections
  const subsections = parseSubsections(sectionContent);
  
  // Extract description
  dimension.description = subsections['Description'] || '';
  
  // Extract assessment questions
  if (subsections['Assessment Questions']) {
    dimension.assessmentQuestions = subsections['Assessment Questions']
      .split(/\\d+\\.\\s+/)
      .filter(q => q.trim().length > 0)
      .map(q => q.trim());
  }
  
  // Extract maturity levels
  if (subsections['Maturity Level Definitions']) {
    const maturityLevels = parseMaturityLevels(subsections['Maturity Level Definitions']);
    dimension.maturityLevels = {
      level1: maturityLevels['Level 1: Initial'] || '',
      level2: maturityLevels['Level 2: Repeatable'] || '',
      level3: maturityLevels['Level 3: Defined'] || '',
      level4: maturityLevels['Level 4: Managed'] || '',
      level5: maturityLevels['Level 5: Optimized'] || ''
    };
  }
}

/**
 * Parse subsections within a section (### headers)
 */
function parseSubsections(content: string): Record<string, string> {
  const subsections: Record<string, string> = {};
  
  // Split content by level 3 headers (###)
  const level3Regex = /^### (.+)$/gm;
  let match;
  let lastIndex = 0;
  let lastHeader = '';
  
  while ((match = level3Regex.exec(content)) !== null) {
    if (lastHeader) {
      const sectionContent = content.substring(lastIndex, match.index).trim();
      subsections[lastHeader] = sectionContent;
    }
    
    lastHeader = match[1];
    lastIndex = match.index + match[0].length;
  }
  
  // Add the last subsection
  if (lastHeader) {
    subsections[lastHeader] = content.substring(lastIndex).trim();
  }
  
  return subsections;
}

/**
 * Parse maturity levels from the maturity level definitions section
 */
function parseMaturityLevels(content: string): Record<string, string> {
  const levels: Record<string, string> = {};
  
  // Split content by level 4 headers (####)
  const level4Regex = /^#### (.+)$/gm;
  let match;
  let lastIndex = 0;
  let lastHeader = '';
  
  while ((match = level4Regex.exec(content)) !== null) {
    if (lastHeader) {
      const levelContent = content.substring(lastIndex, match.index).trim();
      levels[lastHeader] = levelContent;
    }
    
    lastHeader = match[1];
    lastIndex = match.index + match[0].length;
  }
  
  // Add the last level
  if (lastHeader) {
    levels[lastHeader] = content.substring(lastIndex).trim();
  }
  
  return levels;
}

// Create a named export object to fix ESLint warning
const markdownParserExports = {
  parseCapabilityMarkdown,
  loadCapabilityDefinitions
};

export default markdownParserExports;