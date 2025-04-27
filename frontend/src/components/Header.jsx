import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, AppBar, Button, Drawer, Divider, Toolbar, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';

import Logo from './Logo';
import CustomContainer from './atoms/CustomContainer';
import { useAuth } from '../contexts/AuthContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.surface,
}));

// Component for rendering navigation options
function NavOptions({ options, user }) {
	return (
		<React.Fragment>
			{options.map((option) => (
			<Button key={option.name} variant="text" color="neutral.main" size="small" component={Link} to={option.path}>
				{option.name}
			</Button>
			))}
			{user && (
			<Button color="primary" size="small" variant="contained" 
				sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}
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
    		<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
				<IconButton onClick={toggleDrawer(false)}>
					<Logo variant="icon" size="sm" />
				</IconButton>
			</Box>
			{!user && (
				<React.Fragment>
					<MenuItem>Log In</MenuItem>
					<Divider sx={{ my: 1, backgroundColor: 'background.muted' }} />
					<MenuItem>Create Account</MenuItem>
				</React.Fragment>
			)}
			{options.map((option, index) => (
				<React.Fragment key={option.name}>
					{index !== 0 && <Divider sx={{ my: 1, backgroundColor: 'background.muted' }} />}
					<MenuItem component={Link} to={option.path}>
						{option.name}
					</MenuItem>
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