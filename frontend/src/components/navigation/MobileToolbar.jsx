import React, {useState} from 'react';
import { useAuth } from '../../utils/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { Box, Button, Drawer, IconButton, MenuItem } from '@mui/material';

import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';

import PopUp from '../../atoms/PopUp'
import Login from '../Login';
import Register from '../Register';
import Logo from '../../atoms/Logo';
import Divider from '../../atoms/Divider';
import SearchBar from '../search/SearchBar';

const StyledMenuItem = styled(MenuItem)(({
	padding: '6px 3px',
}));

// Component for rendering drawer content
function MobileToolbar({ user, options }) {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [openLogin, setOpenLogin] = useState(false);
	const [openRegister, setOpenRegister] = useState(false);

	const handleLoginSuccess = () => {
		setOpenLogin(false);       
    	window.location.reload();
	};
	const handleRegisterSuccess = () => {
		setOpenRegister(false);    
    	window.location.reload();
	};

	function toggleDrawer(open) {
		return (event) => {
    		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      			return;
    		}
    		setOpen(open);
		};
	}

	return (
		<React.Fragment>
			<SearchBar />
			<IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
				<ListIcon fontSize="medium" sx={{ color: 'neutral.main' }} />
			</IconButton>
			<Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
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
							<StyledMenuItem onClick={() => setOpenLogin(true)}> Log In </StyledMenuItem>
							<Divider />
							<StyledMenuItem onClick={() => setOpenRegister(true)}> Create Account </StyledMenuItem>
							<Divider />
						</React.Fragment>
					)}

					<PopUp
						open={openLogin}
						onClose={() => setOpenLogin(false)}
					>
						<Login onSuccess={handleLoginSuccess} />
					</PopUp>

					<PopUp
						open={openRegister}
						onClose={() => setOpenRegister(false)}
					>
						<Register onSuccess={handleRegisterSuccess} />
					</PopUp>
					
					{options.map((option, index) => (
						<React.Fragment key={option.name}>
							{index !== 0 && <Divider />}
							<StyledMenuItem component={Link} to={option.path} onClick={toggleDrawer(false)}>
								{option.icon && <option.icon fontSize="small" />}
								{option.name}
							</StyledMenuItem>
						</React.Fragment>
					))}

					{user && (
						<Button 
							color="primary" size="small" variant="contained" fullWidth
							sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}
							onClick={() => {
								logout().then(() => {
									navigate('/');
									toggleDrawer(false)();
								});
							}}
						>
							
							<LogoutIcon fontSize="small" /> 
							Logout
						</Button>
					)}

				</Box>
			</Drawer>
		</React.Fragment>
	);
}

export default MobileToolbar;