import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import NavBar from './NavBar';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  LogOut: () => <span data-testid="logout-icon">LogOut</span>,
  Settings: () => <span data-testid="settings-icon">Settings</span>,
}));

// Mock NavItem
vi.mock('./NavItem', () => ({
  default: ({ title, onClick, active, isWebDisplay }) => (
    <button
      data-testid={`nav-item-${title}`}
      onClick={onClick}
      data-active={active}
      data-is-web-display={isWebDisplay}>
      {title}
    </button>
  ),
}));

describe('NavBar', () => {
  const defaultProps = {
    currentIndex: 0,
    handleNavigateToPoem: vi.fn(),
    onLogout: vi.fn(),
    isMenuOpen: true, // Force open for testing content visibility
    setIsMenuOpen: vi.fn(),
    poems: [
      { id: '1', title: 'Poem 1', palette: ['#000'], isFavorite: false },
      { id: '2', title: 'Poem 2', palette: ['#fff'], isFavorite: true },
    ],
    setIsSettingsOpen: vi.fn(),
    sortMode: 'date',
    onSortModeChange: vi.fn(),
  };

  it('renders poems list', () => {
    render(<NavBar {...defaultProps} />);
    expect(screen.getByTestId('nav-item-Poem 1')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-Poem 2')).toBeInTheDocument();
  });

  it('navigates to poem on click', () => {
    render(<NavBar {...defaultProps} />);
    fireEvent.click(screen.getByTestId('nav-item-Poem 2'));
    expect(defaultProps.handleNavigateToPoem).toHaveBeenCalledWith(1);
  });

  it('highlights current poem', () => {
    render(<NavBar {...defaultProps} currentIndex={1} />);
    expect(screen.getByTestId('nav-item-Poem 2')).toHaveAttribute('data-active', 'true');
  });

  it('toggles sort mode', () => {
    render(<NavBar {...defaultProps} />);

    const faveTab = screen.getByText('By Fave');
    fireEvent.click(faveTab);
    expect(defaultProps.onSortModeChange).toHaveBeenCalledWith('fave');

    const dateTab = screen.getByText('By Date');
    fireEvent.click(dateTab);
    expect(defaultProps.onSortModeChange).toHaveBeenCalledWith('date');
  });

  it('opens settings', () => {
    render(<NavBar {...defaultProps} />);
    // IconButton implementation in Nav passes click through
    // We mocked Settings icon with testid
    const settingsBtn = screen.getByTestId('settings-icon').closest('button');
    fireEvent.click(settingsBtn);
    expect(defaultProps.setIsSettingsOpen).toHaveBeenCalledWith(true);
  });

  it('handles logout', () => {
    // Prevent default navigation
    const onLogout = vi.fn(e => e.preventDefault());
    render(<NavBar {...defaultProps} onLogout={onLogout} />);

    const logoutBtn = screen.getByText('Log out');
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();
  });

  it('marks the web display poem with isWebDisplay prop', () => {
    render(<NavBar {...defaultProps} webDisplayPoemId="2" />);
    expect(screen.getByTestId('nav-item-Poem 1')).toHaveAttribute('data-is-web-display', 'false');
    expect(screen.getByTestId('nav-item-Poem 2')).toHaveAttribute('data-is-web-display', 'true');
  });

  it('passes isWebDisplay as false when webDisplayPoemId is not set', () => {
    render(<NavBar {...defaultProps} />);
    expect(screen.getByTestId('nav-item-Poem 1')).toHaveAttribute('data-is-web-display', 'false');
    expect(screen.getByTestId('nav-item-Poem 2')).toHaveAttribute('data-is-web-display', 'false');
  });
});
