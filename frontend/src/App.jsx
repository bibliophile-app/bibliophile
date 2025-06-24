import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

import { NotificationProvider } from './utils/NotificationContext';

import Home from './pages/Home';
import Profile from './pages/Profile';
import TBRPage from './pages/TBR';
import ListPage from './pages/List';
import BookPage from './pages/Book';
import DiaryPage from './pages/Diary';
import ListsPage from './pages/Lists';
import ReviewsPage from './pages/Reviews';
import QuotesPage from './pages/Quotes';
import SearchPage from './pages/SearchPage';
import ListEditor from './pages/ListEditor';
import ReviewsPopularFriends from './pages/ReviewsPopularFriends';
import BooksPopularWeek from './pages/BooksPopularWeek';
import FollowersPage from './pages/Followers';
import FollowingPage from './pages/Following';
import NavBar from './components/navigation/NavBar';
import QuoteManager from './components/QuoteManager';
import FollowerManager from './components/FollowerManager';

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
		<BrowserRouter>
			<PageWrapper disabledGutters>
				<NavBar />
				<Container sx={{ mt: 4, pb: 4, px: 3, minWidth: '100vh', maxWidth: 'lg' }}>
					<NotificationProvider>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/tbr" element={<TBRPage />} />
						<Route path=":username/diary" element={<DiaryPage />} />
						<Route path=":username/profile" element={<Profile />} />
						<Route path=":username/reviews" element={<ReviewsPage />} />
						<Route path=":username/lists" element={<ListsPage />} />
						<Route path=":username/quotes" element={<QuotesPage />} />
						<Route path=":id/list" element={<ListPage />} />
						<Route path="/list/new" element={<ListEditor />} />
						<Route path="/:id/list/edit" element={<ListEditor />} />
						<Route path="/search/:query" element={<SearchPage />} /> 
						<Route path="/book/:bookId" element={<BookPage />} /> 
						<Route path="/popular/friends" element={<ReviewsPopularFriends />} />
						<Route path="/popular/week" element={<BooksPopularWeek />} />
						<Route path=":username/followers" element={<FollowersPage />} />
						<Route path=":username/following" element={<FollowingPage />} />
						<Route path="/test/quotes" element={<QuoteManager />} />
						<Route path="/test/followers" element={<FollowerManager/>}/>
					</Routes>
					</NotificationProvider>
				</Container>
			</PageWrapper>
		</BrowserRouter>
	);
}

export default App;