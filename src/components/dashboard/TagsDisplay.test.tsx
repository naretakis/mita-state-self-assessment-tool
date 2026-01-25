/**
 * TagsDisplay Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagsDisplay } from './TagsDisplay';

describe('TagsDisplay', () => {
  it('should render nothing for empty tags array', () => {
    const { container } = render(<TagsDisplay tags={[]} />);
    expect(container.querySelector('.MuiChip-root')).toBeNull();
  });

  it('should render all tags when count is within maxVisible', () => {
    render(<TagsDisplay tags={['tag1', 'tag2']} maxVisible={3} />);

    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('should render exactly maxVisible tags', () => {
    render(<TagsDisplay tags={['tag1', 'tag2', 'tag3']} maxVisible={3} />);

    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
  });

  it('should show overflow indicator when tags exceed maxVisible', () => {
    render(<TagsDisplay tags={['tag1', 'tag2', 'tag3', 'tag4', 'tag5']} maxVisible={3} />);

    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('should use default maxVisible of 3', () => {
    render(<TagsDisplay tags={['a', 'b', 'c', 'd']} />);

    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('should show tooltip with all tags on hover', async () => {
    const user = userEvent.setup();
    render(<TagsDisplay tags={['tag1', 'tag2', 'tag3', 'tag4']} maxVisible={2} />);

    const overflowChip = screen.getByText('+2');
    await user.hover(overflowChip);

    // Tooltip should show "All tags:" label
    expect(await screen.findByText('All tags:')).toBeInTheDocument();
  });

  it('should handle single tag', () => {
    render(<TagsDisplay tags={['only-tag']} />);

    expect(screen.getByText('only-tag')).toBeInTheDocument();
    expect(screen.queryByText(/^\+\d+$/)).toBeNull();
  });

  it('should handle maxVisible of 1', () => {
    render(<TagsDisplay tags={['a', 'b', 'c']} maxVisible={1} />);

    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.queryByText('b')).toBeNull();
    expect(screen.queryByText('c')).toBeNull();
  });

  it('should not show overflow when tags equal maxVisible', () => {
    render(<TagsDisplay tags={['a', 'b']} maxVisible={2} />);

    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.queryByText(/^\+\d+$/)).toBeNull();
  });
});
