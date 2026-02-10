import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { lightTheme } from './theme';

const AllTheProviders = ({ children }) => {
  return (
    <ThemeContextProvider>
      <ThemeProvider theme={lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContextProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
