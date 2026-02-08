import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ThemeContextProvider, useTheme } from './contexts/ThemeContext';
import Home from './components/Home';
import WebDisplay from './components/WebDisplay';
import Admin from './components/Admin';

function AppContent() {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/web-display/:userId" element={<WebDisplay />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
}

export default App;
