import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { styled, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';

import theme from './styles/MUITheme'; 
import CustomContainer from './atoms/CustomContainer';
import { AuthProvider } from "./utils/AuthContext";

import Home from './pages/Home';
import DiaryPage from './pages/Diary';
import BookPage from './pages/BookPage';
import ReviewsPage from './pages/Reviews';
import Profile from './pages/Profile';
import SearchPage from './pages/SearchPage';
import NavBar from './components/navigation/NavBar';
import QuoteManager from './components/QuoteManager';
import FollowerManager from './components/FollowerManager';
import BooklistManager from './components/BooklistManager';

const PageWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'disabledGutters'
  })(({ theme }) => ({
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  background: `
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
}));

function App() {
	return (
    	<ThemeProvider theme={theme}>
        	<AuthProvider>
				<BrowserRouter>
          			<PageWrapper disabledGutters>
            			<NavBar />
            			<CustomContainer maxWidth="lg" sx={{ mt: 4 }}>
              				<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/diary" element={<DiaryPage />} />
								<Route path=":username/profile" element={<Profile />} />
								<Route path=":username/reviews" element={<ReviewsPage />} />
								<Route path="/book/:olid" element={<BookPage />} /> 
								<Route path="/search/:query" element={<SearchPage />} /> 
								<Route path="/test/quotes" element={<QuoteManager />} />
								<Route path="/test/booklists" element={<BooklistManager />} />
								<Route path="/test/followers" element={<FollowerManager/>}/>
							</Routes>
            			</CustomContainer>
          			</PageWrapper>
        		</BrowserRouter>
			</AuthProvider>
      	</ThemeProvider>
  	);
}

export default App;