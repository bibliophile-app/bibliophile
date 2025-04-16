import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext"

import Home from './pages/Home';
import Login from './components/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';

import QuoteManager from './components/QuoteManager';
import ReviewManager from './components/ReviewManager';
import BooklistManager from './components/BooklistManager';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>      
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<Register />} />
          <Route path="/test/quotes" element={<QuoteManager/>}/>
          <Route path="/test/booklists" element={<BooklistManager />} />
          <Route path="/test/reviews" element={<ReviewManager/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
