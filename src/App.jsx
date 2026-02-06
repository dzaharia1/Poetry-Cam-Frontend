import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import Home from './components/Home';
import WebDisplay from './components/WebDisplay';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/web-display/:userId" element={<WebDisplay />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
