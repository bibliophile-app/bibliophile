import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';

import theme from './styles/MUITheme'; 
import CustomContainer from './components/atoms/CustomContainer';
import { AuthProvider } from "./contexts/AuthContext";

import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Register from './pages/Register';
import QuoteManager from './components/QuoteManager';
import ReviewManager from './components/ReviewManager';
import BooklistManager from './components/BooklistManager';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Box sx={{ 
              minHeight: '100vh', 
              backgroundColor: theme.palette.background.default,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Header />
            <CustomContainer maxWidth="lg" sx={{ backgroundColor: 'background.main', mt: 4 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/signin" element={<Register />} />
                <Route path="/test/quotes" element={<QuoteManager />} />
                <Route path="/test/booklists" element={<BooklistManager />} />
                <Route path="/test/reviews" element={<ReviewManager />} />
              </Routes>
            </CustomContainer>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;