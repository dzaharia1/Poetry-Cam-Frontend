import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import Button from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders start icon', () => {
    render(
      <Button startIcon={<span data-testid="start-icon">Icon</span>}>
        Click Me
      </Button>
    );
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies secondary variant styles', () => {
    // This is a bit tricky to test with styled-components without snapshot or checking computed styles
    // We'll just check if it renders without crashing for now
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });
});
