import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import { Box, AppBar, Button, Drawer, Divider, Toolbar, MenuItem, IconButton } from '@mui/material';

import Logo from './atoms/Logo';
import SearchBar from './atoms/SearchBar';
import CustomContainer from './atoms/CustomContainer';
import { useAuth } from '../contexts/AuthContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.surface,
}));

const ItemDivider = styled(Divider)(({ theme }) => ({
	my: 0.5, 
	backgroundColor: theme.palette.background.muted, 
}));

const StyledMenuItem = styled(MenuItem)(({
	padding: '6px 3px',
  }));

// Component for rendering navigation options
function NavOptions({ options, user }) {
	return (
		<React.Fragment>
			{!user && (
				<React.Fragment>
					<Button variant="text" color="neutral.main" size="small"> Log In </Button>
					<Button variant="text" color="neutral.main" size="small"> Create Account </Button>
				</React.Fragment>
			)}

			{options.map((option) => (
			<Button key={option.name} variant="text" color="neutral.main" size="small" component={Link} to={option.path}>
				{option.name}
			</Button>
			))}

			<SearchBar />
			
			{user && (
				<Button color="primary" size="small" variant="contained" 
				  	sx={{ display: 'flex', borderRadius: 0, justifyContent: 'center', gap: 0.5 }}
				>
					<AddIcon fontSize="small" /> Log
				</Button>
			)}
  		</React.Fragment>
	);
}

// Component for rendering drawer content
function DrawerContent({ user, options, toggleDrawer }) {
	return (
		<Box sx={{ p: 2, backgroundColor: 'background.surface', height: '100%' }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
				<Link to="/" style={{ textDecoration: 'none' }}>
					<Logo variant="icon" size="sm"/>
				</Link>
				<Box sx={{ display: 'flex', alignItems: 'center' }}> 
					<SearchBar />
					<IconButton aria-label="Menu button" onClick={toggleDrawer(false)}>
						<CloseIcon fontSize="medium" sx={{ color: 'neutral.main' }} />
					</IconButton>
				</Box>
			</Box>
			{!user && (
				<React.Fragment>
					<StyledMenuItem> Log In </StyledMenuItem>
					<ItemDivider />
					<StyledMenuItem> Create Account </StyledMenuItem>
					<ItemDivider />
				</React.Fragment>
			)}
			{options.map((option, index) => (
				<React.Fragment key={option.name}>
					{index !== 0 && <ItemDivider />}
					<StyledMenuItem component={Link} to={option.path} >
						{option.icon && <option.icon fontSize="small" />}
						{option.name}
					</StyledMenuItem>
				</React.Fragment>
			))}
			{user && (
				<Button color="primary" variant="contained" fullWidth
					sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 2 }}				
				>
					<AddIcon fontSize="small" /> Log
				</Button>
			)}
		</Box>
	);
}

function Header() {
	const { user } = useAuth();
	const [open, setOpen] = useState(false);

	const publicOptions = [{ name: 'Books', path: '/books' }];
	const privateOptions = [
		{ name: 'Profile', path: '/profile' },
		{ name: 'Books', path: '/books' },
		{ name: 'Reviews', path: '/reviews' },
		{ name: 'Diary', path: '/diary' },
		{ name: 'Read Next', path: '/read-next' },
		{ name: 'Lists', path: '/lists' },
	];

  	const toggleDrawer = (open) => (event) => {
    	if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      		return;
    	}
    	setOpen(open);
	};

	return (
		<AppBar
			sx={{ position: 'static', boxShadow: 0, bgcolor: 'transparent' }}
		>
			<CustomContainer>
				<StyledToolbar disableGutters>
					{/* Logo on the left */}
					<Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
						<Link to="/" style={{ textDecoration: 'none' }}>
							<Logo variant="full" />
						</Link>
					</Box>

					{/* Desktop Navigation */}
					<Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
						<NavOptions options={user ? privateOptions : publicOptions} user={user} />
					</Box>

					{/* Mobile Navigation */}
					<Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
						<SearchBar />

						<IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
							<ListIcon fontSize="medium" sx={{ color: 'neutral.main' }} />
						</IconButton>

						<Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
							<DrawerContent options={user ? privateOptions : publicOptions} user={user} toggleDrawer={toggleDrawer} />
						</Drawer>
					</Box>
				</StyledToolbar>
			</CustomContainer>
		</AppBar>
	);
}

export default Header;