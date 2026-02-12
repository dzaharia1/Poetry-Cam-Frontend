import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import TopBar from './TopBar';
import * as ThemeContext from '../contexts/ThemeContext';

// Mock the context fully to allow overrides
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
  ThemeContextProvider: ({ children }) => <div>{children}</div>,
}));

describe('TopBar', () => {
  it('renders light mode logo', () => {
    vi.mocked(ThemeContext.useTheme).mockReturnValue({
      isDarkMode: false,
      theme: { breakpoints: { mobile: '600px', tablet: '900px' } },
    });

    render(<TopBar handleMenuClick={() => {}} onCapture={() => {}} />);
    const logo = screen.getByRole('img');
    expect(logo).toHaveAttribute('src', 'logo.svg');
  });

  it('renders dark mode logo', () => {
    vi.mocked(ThemeContext.useTheme).mockReturnValue({
      isDarkMode: true,
      theme: { breakpoints: { mobile: '600px', tablet: '900px' } },
    });

    render(<TopBar handleMenuClick={() => {}} onCapture={() => {}} />);
    const logo = screen.getByRole('img');
    expect(logo).toHaveAttribute('src', 'logodark.svg');
  });

  it('handles menu click', () => {
    vi.mocked(ThemeContext.useTheme).mockReturnValue({
      isDarkMode: false,
      theme: { breakpoints: { mobile: '600px', tablet: '900px' } },
    });

    const handleMenuClick = vi.fn();
    render(<TopBar handleMenuClick={handleMenuClick} onCapture={() => {}} />);

    // Get all buttons and find the menu button by its class
    const buttons = screen.getAllByRole('button');
    const menuButton = buttons.find((btn) =>
      btn.classList.contains('mobile-menu'),
    );
    fireEvent.click(menuButton);
    expect(handleMenuClick).toHaveBeenCalledTimes(1);
  });

  it('renders camera button', () => {
    vi.mocked(ThemeContext.useTheme).mockReturnValue({
      isDarkMode: false,
      theme: { breakpoints: { mobile: '600px', tablet: '900px' } },
    });

    render(<TopBar handleMenuClick={() => {}} onCapture={() => {}} />);
    const cameraButton = screen.getByLabelText('Take Photo');
    expect(cameraButton).toBeInTheDocument();
  });

  it('calls onCapture when camera button is used', () => {
    vi.mocked(ThemeContext.useTheme).mockReturnValue({
      isDarkMode: false,
      theme: { breakpoints: { mobile: '600px', tablet: '900px' } },
    });

    const handleCapture = vi.fn();
    render(<TopBar handleMenuClick={() => {}} onCapture={handleCapture} />);

    // Find the hidden file input (it's a sibling of the camera button)
    const cameraButton = screen.getByLabelText('Take Photo');
    const fileInput =
      cameraButton.parentElement.querySelector('input[type="file"]');

    // Create a mock file
    const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(handleCapture).toHaveBeenCalledTimes(1);
    expect(handleCapture).toHaveBeenCalledWith(file);
  });
});
