import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import PageNavigation from './PageNavigation';

describe('PageNavigation', () => {
  it('renders Previous and Next buttons', () => {
    render(<PageNavigation onNext={() => {}} onPrev={() => {}} hasNext={true} hasPrev={true} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables Previous button when hasNext is false', () => {
    render(<PageNavigation onNext={() => {}} onPrev={() => {}} hasNext={false} hasPrev={true} />);
    const prevButton = screen.getByText('Previous').closest('button');
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button when hasPrev is false', () => {
    render(<PageNavigation onNext={() => {}} onPrev={() => {}} hasNext={true} hasPrev={false} />);
    const nextButton = screen.getByText('Next').closest('button');
    expect(nextButton).toBeDisabled();
  });

  it('calls onNext when Previous button is clicked', () => {
    // Note: The code maps "Previous" text to `onNext` handler (likely "Previous" means "Newer" in time, or vice versa, based on the implementation)
    // Looking at Home.jsx: handleNext does "Going to Newer (lower index)". So "Previous" button probably means "Newer/Left" in a timeline.
    // The component implementation:
    // <Button ... onClick={onNext} ...>Previous</Button>

    const handleNext = vi.fn();
    render(<PageNavigation onNext={handleNext} onPrev={() => {}} hasNext={true} hasPrev={true} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it('calls onPrev when Next button is clicked', () => {
    // Similarly: <Button ... onClick={onPrev} ...>Next</Button>
    const handlePrev = vi.fn();
    render(<PageNavigation onNext={() => {}} onPrev={handlePrev} hasNext={true} hasPrev={true} />);
    fireEvent.click(screen.getByText('Next'));
    expect(handlePrev).toHaveBeenCalledTimes(1);
  });
});
