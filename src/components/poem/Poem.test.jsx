import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import Poem from './Poem';
import * as htmlToImage from 'html-to-image';

// Mock html-to-image
vi.mock('html-to-image', () => ({
  toPng: vi.fn(),
}));

// Mock window.confirm
window.confirm = vi.fn(() => true);

describe('Poem', () => {
  const defaultProps = {
    title: 'Test Poem',
    text: 'Line 1\nLine 2',
    colors: ['#000', '#fff'],
    dayOfWeek: 'Monday',
    date: 1,
    month: 'January',
    year: 2024,
    penName: 'Poet',
    isFavorite: false,
    onToggleFavorite: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders poem content', () => {
    render(<Poem {...defaultProps} />);
    // The title appears twice: once in the main view, once in the hidden export view
    expect(screen.getAllByText('Test Poem')).toHaveLength(2);
    expect(screen.getAllByText('Line 1')).toHaveLength(2);
    expect(screen.getAllByText('Line 2')).toHaveLength(2);
    expect(
      screen.getAllByText('Captured by Poet • Monday, January 1, 2024'),
    ).toHaveLength(2);
  });

  it('toggles favorite', () => {
    const onToggle = vi.fn();
    render(<Poem {...defaultProps} onToggleFavorite={onToggle} />);

    const favButton = screen.getByTestId('favorite-button');
    fireEvent.click(favButton);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders and switches tabs', () => {
    const onGenerateSketch = vi.fn();
    render(
      <Poem
        {...defaultProps}
        id="poem-123"
        onGenerateSketch={onGenerateSketch}
      />,
    );

    // Initial state is Poem tab
    expect(screen.getAllByText('Line 1')).toHaveLength(2);

    // Click Sketch tab
    fireEvent.click(screen.getByText('Sketch'));

    // Should call onGenerateSketch because no sketchUrl is provided
    expect(onGenerateSketch).toHaveBeenCalledWith(
      'poem-123',
      defaultProps.title,
      defaultProps.text,
    );

    // Should show loading text
    expect(screen.getByText('No sketch available.')).toBeInTheDocument();
  });

  it('shows sketch image when sketchUrl is provided', () => {
    render(
      <Poem
        {...defaultProps}
        id="poem-123"
        sketchUrl="http://example.com/sketch.png"
      />,
    );

    fireEvent.click(screen.getByText('Sketch'));

    const img = screen.getByAltText(`Sketch for ${defaultProps.title}`);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://example.com/sketch.png');
  });

  it('opens menu and shows options', () => {
    render(<Poem {...defaultProps} />);

    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onDelete when delete is clicked', () => {
    const onDelete = vi.fn();
    render(<Poem {...defaultProps} onDelete={onDelete} />);

    // Open menu
    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);

    // Click delete
    fireEvent.click(screen.getByText('Delete'));
    expect(window.confirm).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('handles download', async () => {
    vi.mocked(htmlToImage.toPng).mockResolvedValue(
      'data:image/png;base64,fake',
    );

    render(<Poem {...defaultProps} />);

    // Open menu
    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);

    // Click download
    fireEvent.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(htmlToImage.toPng).toHaveBeenCalled();
    });
  });

  it('calls onGenerateSketch when Regenerate Sketch is clicked in the menu', () => {
    const onGenerateSketch = vi.fn();
    render(
      <Poem
        {...defaultProps}
        id="poem-123"
        sketchUrl="http://example.com/sketch.png"
        onGenerateSketch={onGenerateSketch}
      />,
    );

    // Switch to Sketch tab
    fireEvent.click(screen.getByText('Sketch'));

    // Open menu
    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);

    // Click Regenerate Sketch
    fireEvent.click(screen.getByText('Regenerate Sketch'));

    expect(onGenerateSketch).toHaveBeenCalledWith(
      'poem-123',
      defaultProps.title,
      defaultProps.text,
    );
  });
});
