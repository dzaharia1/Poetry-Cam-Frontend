import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import NavItem from './NavItem';

vi.mock('lucide-react', () => ({
  Star: ({ 'data-testid': testId }) => <span data-testid={testId || 'star-icon'}>Star</span>,
  Monitor: ({ 'data-testid': testId }) => <span data-testid={testId || 'monitor-icon'}>Monitor</span>,
}));

describe('NavItem', () => {
  const defaultProps = {
    title: 'My Poem',
    colors: ['#ff0000', '#00ff00'],
    active: false,
    onClick: vi.fn(),
  };

  it('renders the title', () => {
    render(<NavItem {...defaultProps} />);
    expect(screen.getByText('My Poem')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<NavItem {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByText('My Poem'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not show Monitor icon by default', () => {
    render(<NavItem {...defaultProps} />);
    expect(screen.queryByTestId('monitor-icon')).not.toBeInTheDocument();
  });

  it('shows Monitor icon when isWebDisplay is true', () => {
    render(<NavItem {...defaultProps} isWebDisplay={true} />);
    expect(screen.getByTestId('monitor-icon')).toBeInTheDocument();
  });

  it('does not show Star icon by default', () => {
    render(<NavItem {...defaultProps} />);
    expect(screen.queryByTestId('star-icon')).not.toBeInTheDocument();
  });

  it('shows Star icon when isFavorite is true', () => {
    render(<NavItem {...defaultProps} isFavorite={true} />);
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('shows both Monitor and Star icons when both props are true', () => {
    render(<NavItem {...defaultProps} isWebDisplay={true} isFavorite={true} />);
    expect(screen.getByTestId('monitor-icon')).toBeInTheDocument();
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });
});
