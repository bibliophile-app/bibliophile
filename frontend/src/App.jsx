import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { styled, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';

import theme from './styles/MUITheme'; 
import CustomContainer from './atoms/CustomContainer';
import { AuthProvider } from "./utils/AuthContext";

import Home from './pages/Home';
import Profile from './pages/Profile';
import SearchPage from './pages/SearchPage';
import Register from './components/Register';
import NavBar from './components/navigation/NavBar';
import QuoteManager from './components/QuoteManager';
import ReviewManager from './components/ReviewManager';
import BooklistManager from './components/BooklistManager';

const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `
  radial-gradient(
	circle at top left,
	rgba(32, 44, 55, 0.6) 0%,
	rgba(22, 29, 38, 0.8) 40%
  ),
  linear-gradient(
	180deg,
	${theme.palette.background.default} 0%,
	${theme.palette.background.surface} 100%
  )`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}));

function App() {
	return (
    	<AuthProvider>
      		<ThemeProvider theme={theme}>
        		<BrowserRouter>
          			<PageWrapper disabledGutters>
            			<NavBar />
            			<CustomContainer maxWidth="lg" sx={{ mt: 4 }}>
              				<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/profile" element={<Profile />} />
								<Route path="/signin" element={<Register />} />
								<Route path="/search/:query" element={<SearchPage />} /> 
								<Route path="/test/quotes" element={<QuoteManager />} />
								<Route path="/test/booklists" element={<BooklistManager />} />
								<Route path="/test/reviews" element={<ReviewManager />} />
							</Routes>
            			</CustomContainer>
          			</PageWrapper>
        		</BrowserRouter>
      		</ThemeProvider>
    	</AuthProvider>
  	);
}

export default App;