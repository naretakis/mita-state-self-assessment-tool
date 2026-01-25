/**
 * HistoryPanel Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { v4 as uuidv4 } from 'uuid';
import { db, clearDatabase } from '../../services/db';
import { HistoryPanel } from './HistoryPanel';

describe('HistoryPanel', () => {
  const mockOnViewHistory = vi.fn();
  const mockOnDeleteHistory = vi.fn();

  beforeEach(async () => {
    await clearDatabase();
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  const createAssessment = async (
    areaId: string,
    status: 'in_progress' | 'finalized' = 'finalized',
    score?: number
  ): Promise<string> => {
    const id = uuidv4();
    await db.capabilityAssessments.add({
      id,
      capabilityDomainId: 'test-domain',
      capabilityDomainName: 'Test Domain',
      capabilityAreaId: areaId,
      capabilityAreaName: 'Test Area',
      status,
      tags: ['tag1'],
      createdAt: new Date(),
      updatedAt: new Date(),
      finalizedAt: status === 'finalized' ? new Date() : undefined,
      overallScore: score,
    });
    return id;
  };

  const createHistoryEntry = async (areaId: string, score: number, date: Date): Promise<string> => {
    const id = uuidv4();
    await db.assessmentHistory.add({
      id,
      capabilityAssessmentId: uuidv4(),
      capabilityAreaId: areaId,
      snapshotDate: date,
      tags: ['historical-tag'],
      overallScore: score,
      dimensionScores: {},
      ratings: [],
    });
    return id;
  };

  it('should return null when not open', () => {
    const { container } = render(
      <HistoryPanel
        capabilityAreaId="area-1"
        open={false}
        onViewHistory={mockOnViewHistory}
        onDeleteHistory={mockOnDeleteHistory}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should show "No assessments yet" when no data exists', async () => {
    render(
      <HistoryPanel
        capabilityAreaId="area-1"
        open={true}
        onViewHistory={mockOnViewHistory}
        onDeleteHistory={mockOnDeleteHistory}
      />
    );

    // Wait for async data loading
    expect(await screen.findByText('No assessments yet')).toBeInTheDocument();
  });

  it('should show current finalized assessment', async () => {
    await createAssessment('area-1', 'finalized', 3.5);

    render(
      <HistoryPanel
        capabilityAreaId="area-1"
        open={true}
        onViewHistory={mockOnViewHistory}
        onDeleteHistory={mockOnDeleteHistory}
      />
    );

    expect(await screen.findByText('Current')).toBeInTheDocument();
    expect(await screen.findByText('Score: 3.5')).toBeInTheDocument();
  });

  it('should show historical entries', async () => {
    await createHistoryEntry('area-1', 2.5, new Date('2024-01-15'));

    render(
      <HistoryPanel
        capabilityAreaId="area-1"
        open={true}
        onViewHistory={mockOnViewHistory}
        onDeleteHistory={mockOnDeleteHistory}
      />
    );

    expect(await screen.findByText('Score: 2.5')).toBeInTheDocument();
  });

  it('should show both current and historical entries', async () => {
    await createAssessment('area-1', 'finalized', 4.0);
    await createHistoryEntry('area-1', 3.0, new Date('2024-01-15'));
    await createHistoryEntry('area-1', 2.0, new Date('2023-06-01'));

    render(
      <HistoryPanel
        capabilityAreaId="area-1"
        open={true}
        onViewHistory={mockOnViewHistory}
        onDeleteHistory={mockOnDeleteHistory}
      />
    );

    expect(await screen.findByText('Current')).toBeInTheDocument();
    expect(await screen.findByText('Score: 4.0')).toBeInTheDocument();
    expect(await screen.findByText('Score: 3.0')).toBeInTheDocument();
    expect(await screen.findByText('Score: 2.0')).toBeInTheDocument();
  });

  it('should call onViewHistory when view button clicked', async () => {
    const user = userEvent.setup();
    const historyId = await createHistoryEntry('area-1', 3.0, new Date());

    render(
      <HistoryPanel
        capabilityAreaId="area-1"
        open={true}
        onViewHistory={mockOnViewHistory}
        onDeleteHistory={mockOnDeleteHistory}
      />
    );

    // Wait for content to load
    await screen.findByText('Score: 3.0');

    // Find and click view button
    const viewButton = screen.getByTitle('View details');
    await user.click(viewButton);

    expect(mockOnViewHistory).toHaveBeenCalledWith(historyId);
  });

  it('should call onDeleteHistory when delete button clicked', async () => {
    const user = userEvent.setup();
    const historyId = await createHistoryEntry('area-1', 3.0, new Date());

    render(
      <HistoryPanel
        capabilityAreaId="area-1"
        open={true}
        onViewHistory={mockOnViewHistory}
        onDeleteHistory={mockOnDeleteHistory}
      />
    );

    await screen.findByText('Score: 3.0');

    const deleteButton = screen.getByTitle('Delete history entry');
    await user.click(deleteButton);

    expect(mockOnDeleteHistory).toHaveBeenCalledWith(historyId);
  });

  it('should display tags on entries', async () => {
    await createAssessment('area-1', 'finalized', 3.5);

    render(
      <HistoryPanel
        capabilityAreaId="area-1"
        open={true}
        onViewHistory={mockOnViewHistory}
        onDeleteHistory={mockOnDeleteHistory}
      />
    );

    expect(await screen.findByText('tag1')).toBeInTheDocument();
  });

  it('should not show in-progress assessment as current', async () => {
    await createAssessment('area-1', 'in_progress');

    render(
      <HistoryPanel
        capabilityAreaId="area-1"
        open={true}
        onViewHistory={mockOnViewHistory}
        onDeleteHistory={mockOnDeleteHistory}
      />
    );

    // Should show "No assessments yet" since in_progress doesn't count
    expect(await screen.findByText('No assessments yet')).toBeInTheDocument();
  });

  it('should show history even without current assessment', async () => {
    await createHistoryEntry('area-1', 2.5, new Date());

    render(
      <HistoryPanel
        capabilityAreaId="area-1"
        open={true}
        onViewHistory={mockOnViewHistory}
        onDeleteHistory={mockOnDeleteHistory}
      />
    );

    expect(await screen.findByText('Score: 2.5')).toBeInTheDocument();
    expect(screen.queryByText('Current')).toBeNull();
  });
});
