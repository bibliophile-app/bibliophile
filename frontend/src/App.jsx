import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserManager from './components/UserManager';
import QuoteManager from './components/QuoteManager';
import ReviewManager from './components/ReviewManager';
import FollowerManager from './components/FollowerManager';
import BooklistManager from './components/BooklistManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/booklists" element={<BooklistManager />} />
        <Route path="/test/users" element={<UserManager/>}/>
        <Route path="/test/quotes" element={<QuoteManager/>}/>
        <Route path="/test/reviews" element={<ReviewManager/>}/>
        <Route path="/test/followers" element={<FollowerManager/>}/>
      </Routes>
    </Router>
  );
}

export default App;
