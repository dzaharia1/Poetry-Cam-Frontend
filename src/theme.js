const theme = {
  colors: {
    primary: '#333333',
    primaryHover: '#222222',
    secondary: '#f4f2ed',
    secondaryHover: '#f9f7f3',
    background: '#eae7e4',
    paper: '#f4f2ed',
    text: {
      primary: '#333333', // or #444444 from index.css, standardizing to #333 mostly used
      secondary: '#666666',
      headings: '#444444',
      light: '#ffffff',
      error: '#ff0000', // standard red
      delete: '#ff4d4f',
    },
    border: '#cccccc', // #ccc
    shadows: {
      green: 'rgba(0, 221, 99, 0.33)',
      red: 'rgba(247, 0, 78, 0.25)',
      card: '0 4px 20px rgba(0, 0, 0, 0.15)',
      nav1: '0 2px 35px rgba(0, 0, 0, 0.1)',
      nav2: '0 0px 2px rgba(0, 0, 0, 0.21)',
    },
  },
  typography: {
    fontFamily: {
      heading: "'Young Serif', serif",
      body: "'Habibi', serif",
      code: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    },
    weight: {
      light: 100,
      regular: 400, // Default usually
      bold: 700, // or 600 in some places
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
    5: '44px', // margins for poem heading
  },
};

export default theme;
