import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import WebDisplay from './components/WebDisplay';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/web-display/:userId" element={<WebDisplay />} />
    </Routes>
  );
}

export default App;
