import { parseMarkdown, extractSections } from './markdownParser';

/**
 * Interface for capability dimensions
 */
export interface CapabilityDimension {
  description: string;
  assessmentQuestions: string[];
  maturityLevels: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
}

/**
 * Interface for capability definition
 */
export interface CapabilityDefinition {
  id: string;
  name: string;
  domainName: string;
  moduleName: string;
  version: string;
  lastUpdated: string;
  description: string;
  dimensions: {
    outcome: CapabilityDimension;
    role: CapabilityDimension;
    businessProcess: CapabilityDimension;
    information: CapabilityDimension;
    technology: CapabilityDimension;
  };
}

/**
 * Parse capability markdown content
 * @param markdown Raw markdown content
 * @returns Parsed capability definition
 */
export function parseCapabilityMarkdown(markdown: string): CapabilityDefinition {
  const { metadata, content } = parseMarkdown(markdown);
  const sections = extractSections(content);

  // Extract dimensions
  const dimensions = {
    outcome: parseDimension(sections['Outcome Dimension'] || ''),
    role: parseDimension(sections['Roles Dimension'] || ''),
    businessProcess: parseDimension(sections['Business Processes Dimension'] || ''),
    information: parseDimension(sections['Information Dimension'] || ''),
    technology: parseDimension(sections['Technology Dimension'] || ''),
  };

  return {
    id: (metadata.id as string) || '',
    name: metadata.title || '',
    domainName: (metadata.businessArea as string) || '',
    moduleName: (metadata.category as string) || '',
    version: (metadata.version as string) || '1.0',
    lastUpdated: (metadata.lastUpdated as string) || new Date().toISOString().split('T')[0],
    description: sections['Description'] || '',
    dimensions,
  };
}

/**
 * Parse dimension section
 * @param content Dimension section content
 * @returns Parsed dimension
 */
function parseDimension(content: string): CapabilityDimension {
  // Extract description (first paragraph)
  const descriptionMatch = content.match(/^(.*?)(?=\n\n|\n###|$)/m);
  const description = descriptionMatch ? descriptionMatch[0].trim() : '';

  // Extract assessment questions
  const questionsSection = content.match(/### Assessment Questions\s+([\s\S]*?)(?=###|$)/m);
  const questionsContent = questionsSection ? questionsSection[1].trim() : '';
  const questions = questionsContent
    .split('\n')
    .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
    .map(line => line.replace(/^[*-]\s+/, '').trim());

  // Extract maturity levels
  const maturityLevels = {
    level1: extractMaturityLevel(content, 'Level 1'),
    level2: extractMaturityLevel(content, 'Level 2'),
    level3: extractMaturityLevel(content, 'Level 3'),
    level4: extractMaturityLevel(content, 'Level 4'),
    level5: extractMaturityLevel(content, 'Level 5'),
  };

  return {
    description,
    assessmentQuestions: questions,
    maturityLevels,
  };
}

/**
 * Extract maturity level content
 * @param content Dimension content
 * @param levelName Level name to extract
 * @returns Level content
 */
function extractMaturityLevel(content: string, levelName: string): string {
  const levelRegex = new RegExp(`### ${levelName}\\s+([\\s\\S]*?)(?=###|$)`);
  const match = content.match(levelRegex);
  return match ? match[1].trim() : '';
}

/**
 * Load all capability definitions from a directory
 * This function is meant to be used in a server context or during build time
 * @param capabilities Array of capability data objects
 * @returns Array of capability definitions
 */
export function loadCapabilityDefinitions(capabilityData: string[]): CapabilityDefinition[] {
  const capabilities: CapabilityDefinition[] = [];

  try {
    for (const content of capabilityData) {
      try {
        const capability = parseCapabilityMarkdown(content);
        capabilities.push(capability);
      } catch (error) {
        console.error(`Error parsing capability content:`, error);
      }
    }
  } catch (error) {
    console.error('Error loading capability definitions:', error);
  }

  return capabilities;
}
