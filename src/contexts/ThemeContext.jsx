import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  // Three modes: 'light', 'dark', 'auto'
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'auto'; // Default to auto
  });

  // Track system preference
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine if we should show dark mode
  const isDarkMode =
    themeMode === 'auto' ? systemPrefersDark : themeMode === 'dark';

  // Update CSS custom properties and PWA theme-color when theme changes
  useEffect(() => {
    const theme = isDarkMode ? darkTheme : lightTheme;

    // Update CSS custom properties
    document.documentElement.style.setProperty(
      '--background-color',
      theme.colors.background,
    );
    document.documentElement.style.setProperty(
      '--text-color',
      theme.colors.text.headings,
    );

    // Update PWA theme-color meta tag for status bar
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = theme.colors.background;
  }, [isDarkMode]);

  const toggleThemeMode = () => {
    setThemeMode((prev) => {
      // Cycle: light -> dark -> auto -> light
      let newMode;
      if (prev === 'light') {
        newMode = 'dark';
      } else if (prev === 'dark') {
        newMode = 'auto';
      } else {
        newMode = 'light';
      }
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        isDarkMode,
        themeMode,
        toggleThemeMode,
        setThemeMode: (mode) => {
          setThemeMode(mode);
          localStorage.setItem('themeMode', mode);
        },
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
