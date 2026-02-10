import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import TopBar from './TopBar';
import * as ThemeContext from '../contexts/ThemeContext';

// Mock the context fully to allow overrides
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
  ThemeContextProvider: ({ children }) => <div>{children}</div>
}));

describe('TopBar', () => {
  it('renders light mode logo', () => {
    vi.mocked(ThemeContext.useTheme).mockReturnValue({
      isDarkMode: false,
      theme: { breakpoints: { mobile: '600px', tablet: '900px' } }
    });

    render(<TopBar handleMenuClick={() => {}} onCapture={() => {}} />);
    const logo = screen.getByRole('img');
    expect(logo).toHaveAttribute('src', 'logo.svg');
  });

  it('renders dark mode logo', () => {
    vi.mocked(ThemeContext.useTheme).mockReturnValue({
      isDarkMode: true,
      theme: { breakpoints: { mobile: '600px', tablet: '900px' } }
    });

    render(<TopBar handleMenuClick={() => {}} onCapture={() => {}} />);
    const logo = screen.getByRole('img');
    expect(logo).toHaveAttribute('src', 'logodark.svg');
  });

  it('handles menu click', () => {
    vi.mocked(ThemeContext.useTheme).mockReturnValue({
      isDarkMode: false,
      theme: { breakpoints: { mobile: '600px', tablet: '900px' } }
    });

    const handleMenuClick = vi.fn();
    render(<TopBar handleMenuClick={handleMenuClick} onCapture={() => {}} />);

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    expect(handleMenuClick).toHaveBeenCalledTimes(1);
  });
});
