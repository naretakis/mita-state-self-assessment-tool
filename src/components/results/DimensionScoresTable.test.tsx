/**
 * DimensionScoresTable Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DimensionScoresTable from './DimensionScoresTable';
import type { DimensionScore, AspectScore, OrbitRating, Attachment } from '../../types';

describe('DimensionScoresTable', () => {
  const mockOnDownloadAttachment = vi.fn();

  const createAspectScore = (
    aspectId: string,
    aspectName: string,
    currentLevel: number,
    isAssessed: boolean = true
  ): AspectScore => ({
    aspectId,
    aspectName,
    dimensionId: 'businessArchitecture',
    currentLevel: currentLevel as AspectScore['currentLevel'],
    isAssessed,
  });

  const createDimensionScore = (
    dimensionId: string,
    dimensionName: string,
    averageLevel: number | null,
    aspectScores: AspectScore[] = []
  ): DimensionScore => ({
    dimensionId: dimensionId as DimensionScore['dimensionId'],
    dimensionName,
    required: dimensionId !== 'outcomes' && dimensionId !== 'roles',
    averageLevel,
    aspectScores,
  });

  const defaultProps = {
    ratings: [] as OrbitRating[],
    attachments: [] as Attachment[],
    onDownloadAttachment: mockOnDownloadAttachment,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render table headers', () => {
    const scores: DimensionScore[] = [
      createDimensionScore('businessArchitecture', 'Business Architecture', 3.5),
    ];

    render(<DimensionScoresTable dimensionScores={scores} {...defaultProps} />);

    expect(screen.getByText('Dimension')).toBeInTheDocument();
    expect(screen.getByText('Aspects Assessed')).toBeInTheDocument();
    expect(screen.getByText('Average Score')).toBeInTheDocument();
  });

  it('should render dimension names', () => {
    const scores: DimensionScore[] = [
      createDimensionScore('businessArchitecture', 'Business Architecture', 3.5),
      createDimensionScore('informationData', 'Information & Data', 4.0),
    ];

    render(<DimensionScoresTable dimensionScores={scores} {...defaultProps} />);

    expect(screen.getByText('Business Architecture')).toBeInTheDocument();
    expect(screen.getByText('Information & Data')).toBeInTheDocument();
  });

  it('should render dimension scores', () => {
    const scores: DimensionScore[] = [
      createDimensionScore('businessArchitecture', 'Business Architecture', 3.5),
      createDimensionScore('informationData', 'Information & Data', 4.2),
    ];

    render(<DimensionScoresTable dimensionScores={scores} {...defaultProps} />);

    expect(screen.getByText('3.5')).toBeInTheDocument();
    expect(screen.getByText('4.2')).toBeInTheDocument();
  });

  it('should handle null scores', () => {
    const scores: DimensionScore[] = [
      createDimensionScore('businessArchitecture', 'Business Architecture', null),
    ];

    render(<DimensionScoresTable dimensionScores={scores} {...defaultProps} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('should render both required and optional dimensions', () => {
    const scores: DimensionScore[] = [
      createDimensionScore('businessArchitecture', 'Business Architecture', 3.5),
      createDimensionScore('outcomes', 'Outcomes', 3.0),
    ];

    render(<DimensionScoresTable dimensionScores={scores} {...defaultProps} />);

    expect(screen.getByText('Business Architecture')).toBeInTheDocument();
    expect(screen.getByText('Outcomes')).toBeInTheDocument();
  });

  it('should handle empty scores array', () => {
    render(<DimensionScoresTable dimensionScores={[]} {...defaultProps} />);

    // Should render table structure without data rows
    expect(screen.getByText('Dimension')).toBeInTheDocument();
    expect(screen.getByText('Dimension Scores')).toBeInTheDocument();
  });

  it('should display aspect count', () => {
    const scores: DimensionScore[] = [
      createDimensionScore('businessArchitecture', 'Business Architecture', 3.5, [
        createAspectScore('aspect-1', 'Process Standardization', 4),
        createAspectScore('aspect-2', 'Enterprise Alignment', 3),
        createAspectScore('aspect-3', 'Not Assessed', 0, false),
      ]),
    ];

    render(<DimensionScoresTable dimensionScores={scores} {...defaultProps} />);

    // Should show 2/3 (2 assessed out of 3 total)
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('should handle technology dimension with sub-dimensions', () => {
    const techScore: DimensionScore = {
      dimensionId: 'technology',
      dimensionName: 'Technology',
      required: true,
      averageLevel: 3.5,
      aspectScores: [
        createAspectScore('aspect-1', 'Aspect 1', 3),
        createAspectScore('aspect-2', 'Aspect 2', 4),
      ],
      subDimensionScores: [
        {
          subDimensionId: 'infrastructure',
          subDimensionName: 'Infrastructure',
          averageLevel: 3.0,
          aspectScores: [createAspectScore('infra-1', 'Infra Aspect', 3)],
        },
        {
          subDimensionId: 'integration',
          subDimensionName: 'Integration',
          averageLevel: 4.0,
          aspectScores: [createAspectScore('int-1', 'Int Aspect', 4)],
        },
      ],
    };

    render(<DimensionScoresTable dimensionScores={[techScore]} {...defaultProps} />);

    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('3.5')).toBeInTheDocument();
  });

  it('should expand technology dimension to show sub-dimensions', async () => {
    const user = userEvent.setup();
    const techScore: DimensionScore = {
      dimensionId: 'technology',
      dimensionName: 'Technology',
      required: true,
      averageLevel: 3.5,
      aspectScores: [],
      subDimensionScores: [
        {
          subDimensionId: 'infrastructure',
          subDimensionName: 'Infrastructure',
          averageLevel: 3.0,
          aspectScores: [],
        },
      ],
    };

    render(<DimensionScoresTable dimensionScores={[techScore]} {...defaultProps} />);

    // Click to expand
    await user.click(screen.getByText('Technology'));

    // Sub-dimension should be visible (prefixed with arrow indicator)
    expect(screen.getByText(/Infrastructure/)).toBeInTheDocument();
  });

  it('should render with ratings data', () => {
    const scores: DimensionScore[] = [
      createDimensionScore('businessArchitecture', 'Business Architecture', 3.5, [
        createAspectScore('aspect-1', 'Process Standardization', 4),
      ]),
    ];

    const ratings: OrbitRating[] = [
      {
        id: 'rating-1',
        capabilityAssessmentId: 'assessment-1',
        dimensionId: 'businessArchitecture',
        aspectId: 'aspect-1',
        currentLevel: 4,
        questionResponses: [],
        evidenceResponses: [],
        notes: 'Test notes',
        barriers: '',
        plans: '',
        carriedForward: false,
        attachmentIds: [],
        updatedAt: new Date(),
      },
    ];

    render(
      <DimensionScoresTable
        dimensionScores={scores}
        ratings={ratings}
        attachments={[]}
        onDownloadAttachment={mockOnDownloadAttachment}
      />
    );

    expect(screen.getByText('Business Architecture')).toBeInTheDocument();
  });

  it('should handle attachments', () => {
    const scores: DimensionScore[] = [
      createDimensionScore('businessArchitecture', 'Business Architecture', 3.5),
    ];

    const attachments: Attachment[] = [
      {
        id: 'attachment-1',
        capabilityAssessmentId: 'assessment-1',
        orbitRatingId: 'rating-1',
        fileName: 'test-file.pdf',
        fileType: 'application/pdf',
        fileSize: 1024,
        blob: new Blob(),
        uploadedAt: new Date(),
      },
    ];

    render(
      <DimensionScoresTable
        dimensionScores={scores}
        ratings={[]}
        attachments={attachments}
        onDownloadAttachment={mockOnDownloadAttachment}
      />
    );

    expect(screen.getByText('Business Architecture')).toBeInTheDocument();
  });
});
