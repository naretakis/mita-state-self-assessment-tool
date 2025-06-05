import matter from 'gray-matter';
import yaml from 'js-yaml';

import type { CapabilityLevel } from '../services/StorageService';

/**
 * Interface for parsed markdown content
 */
export interface ParsedContent {
  metadata: ContentMetadata;
  content: string;
}

/**
 * Interface for content metadata
 */
export interface ContentMetadata {
  title: string;
  description?: string;
  businessArea?: string;
  category?: string;
  tags?: string[];
  levels?: CapabilityLevel[];
  lastUpdated?: string;
  version?: string;
  [key: string]: unknown;
}

/**
 * Parse markdown content with frontmatter
 * @param markdown Raw markdown content
 * @returns Parsed content with metadata and content
 */
export function parseMarkdown(markdown: string): ParsedContent {
  try {
    const { data, content } = matter(markdown, {
      engines: {
        yaml: s => yaml.load(s) as Record<string, unknown>,
      },
    });

    return {
      metadata: data as ContentMetadata,
      content: content.trim(),
    };
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return {
      metadata: { title: 'Error' },
      content: 'Failed to parse content.',
    };
  }
}

/**
 * Extract capability levels from markdown content
 * @param content Markdown content
 * @returns Array of capability levels
 */
export function extractCapabilityLevels(content: string): CapabilityLevel[] {
  const levels: CapabilityLevel[] = [];
  const levelRegex = /## Level (\d+)[\r\n]+([\s\S]*?)(?=## Level \d+|$)/g;

  let match;
  while ((match = levelRegex.exec(content)) !== null) {
    const levelNumber = parseInt(match[1], 10);
    const levelContent = match[2].trim();

    // Extract description (first paragraph after level heading)
    const descriptionMatch = levelContent.match(/^(.*?)(?=\n\n|\n###|$)/s);
    const description = descriptionMatch ? descriptionMatch[0].trim() : '';

    // Extract criteria (bullet points)
    const criteriaRegex = /[*-] (.*?)(?=\n[*-]|\n\n|$)/g;
    const criteria: string[] = [];

    let criteriaMatch;
    while ((criteriaMatch = criteriaRegex.exec(levelContent)) !== null) {
      criteria.push(criteriaMatch[1].trim());
    }

    levels.push({
      level: levelNumber,
      description,
      criteria,
    });
  }

  return levels;
}

/**
 * Extract sections from markdown content
 * @param content Markdown content
 * @returns Object with sections as keys and content as values
 */
export function extractSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const sectionRegex = /## ([^\n]+)[\r\n]+([\s\S]*?)(?=## [^\n]+|$)/g;

  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    const sectionName = match[1].trim();
    const sectionContent = match[2].trim();
    sections[sectionName] = sectionContent;
  }

  return sections;
}

/**
 * Generate markdown from content metadata and sections
 * @param metadata Content metadata
 * @param content Main content
 * @returns Markdown string
 */
export function generateMarkdown(metadata: ContentMetadata, content: string): string {
  const frontmatter = yaml.dump(metadata);

  return `---\n${frontmatter}---\n\n${content}`;
}

/**
 * Extract tags from markdown content
 * @param content Markdown content
 * @returns Array of tags
 */
export function extractTags(content: string): string[] {
  const tagRegex = /\s#([a-zA-Z0-9_-]+)/g;
  const tags: string[] = [];

  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    if (match[1]) {
      tags.push(match[1]);
    }
  }

  return [...new Set(tags)]; // Remove duplicates
}
