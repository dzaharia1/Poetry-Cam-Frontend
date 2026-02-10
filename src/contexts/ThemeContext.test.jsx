import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeContextProvider, useTheme } from './ThemeContext';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Helper component to consume context
const TestComponent = () => {
  const { isDarkMode, toggleThemeMode, themeMode } = useTheme();
  return (
    <div>
      <span data-testid="mode">{themeMode}</span>
      <span data-testid="is-dark">{isDarkMode.toString()}</span>
      <button onClick={toggleThemeMode}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false, // Default light
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('provides default theme (auto)', () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('auto');
  });

  it('toggles theme correctly', async () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const button = screen.getByText('Toggle');
    const mode = screen.getByTestId('mode');

    // Logic in ThemeContext:
    // if (prev === 'light') -> 'dark'
    // else if (prev === 'dark') -> 'auto'
    // else -> 'light'

    // Initial is 'auto'. So click -> 'light'

    // 1. auto -> light
    await act(async () => {
        button.click();
    });
    expect(mode).toHaveTextContent('light');
    expect(localStorage.getItem('themeMode')).toBe('light');

    // 2. light -> dark
    await act(async () => {
        button.click();
    });
    expect(mode).toHaveTextContent('dark');
    expect(localStorage.getItem('themeMode')).toBe('dark');

    // 3. dark -> auto
    await act(async () => {
        button.click();
    });
    expect(mode).toHaveTextContent('auto');
    expect(localStorage.getItem('themeMode')).toBe('auto');
  });

  it('respects system preference in auto mode', () => {
    // Mock system dark mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('auto');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
  });
});
