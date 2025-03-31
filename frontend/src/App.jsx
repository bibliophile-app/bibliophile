import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BooklistManager from './components/BooklistManager';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/booklists" element={<BooklistManager />} />
      </Routes>
    </Router>
  );
}

export default App;
