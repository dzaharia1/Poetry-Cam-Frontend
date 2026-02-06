// Shared theme properties (typography, spacing, breakpoints)
const sharedTheme = {
  typography: {
    fontFamily: {
      heading: "'Young Serif', serif",
      body: "'Habibi', serif",
      code: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    },
    weight: {
      light: 100,
      regular: 400,
      bold: 700,
      extraBold: 800,
    },
    size: {
      h2: '40px',
      h2Mobile: '22px',
      poemLine: '28px',
      poemLineMobile: '18px',
      body: '16px',
      small: '14px',
      tiny: '12px',
    },
  },
  breakpoints: {
    mobile: '800px',
    tablet: '1120px',
  },
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '16px',
    4: '24px',
    5: '44px',
  },
};

// Light theme colors
export const lightTheme = {
  ...sharedTheme,
  colors: {
    primary: '#333333',
    primaryHover: '#222222',
    secondary: '#f4f2ed',
    secondaryHover: '#f9f7f3',
    background: '#eae7e4',
    paper: '#f4f2ed',
    text: {
      primary: '#333333',
      secondary: '#666666',
      headings: '#444444',
      light: '#ffffff',
      error: '#ff0000',
      delete: '#ff4d4f',
    },
    border: '#cccccc',
    shadows: {
      green: 'rgba(0, 221, 99, 0.33)',
      red: 'rgba(247, 0, 78, 0.25)',
      card: '0 4px 20px rgba(0, 0, 0, 0.15)',
      nav1: '0 2px 35px rgba(0, 0, 0, 0.1)',
      nav2: '0 0px 2px rgba(0, 0, 0, 0.21)',
    },
  },
};

// Dark theme colors
export const darkTheme = {
  ...sharedTheme,
  colors: {
    primary: '#e8e6e3',
    primaryHover: '#f4f2ed',
    secondary: '#2d2d2d',
    secondaryHover: '#3a3a3a',
    background: '#1a1a1a',
    paper: '#2d2d2d',
    text: {
      primary: '#e8e6e3',
      secondary: '#b0b0b0',
      headings: '#f4f2ed',
      light: '#ffffff',
      error: '#ff6b6b',
      delete: '#ff6b6b',
    },
    border: '#3b3b3bff',
    shadows: {
      green: 'rgba(0, 221, 99, 0.4)',
      red: 'rgba(247, 0, 78, 0.3)',
      card: '0 4px 20px rgba(0, 0, 0, 0.5)',
      nav1: '0 2px 35px rgba(0, 0, 0, 0.3)',
      nav2: '0 0px 2px rgba(0, 0, 0, 0.5)',
    },
  },
};

// Default export for backward compatibility (can be removed if not needed)
export default lightTheme;
