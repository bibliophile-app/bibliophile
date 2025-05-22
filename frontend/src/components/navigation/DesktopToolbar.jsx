import React, { useState } from 'react';
import { useAuth } from '../../utils/AuthContext'

import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';

import PopUp from '../../atoms/PopUp'
import Login from '../Login';
import Register from '../Register';
import SearchBar from '../search/SearchBar';


function DesktopToolbar({ options, user }) {
	const { logout } = useAuth();
	const { navigate } = useNavigate();
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

	return (
		<React.Fragment>
			{!user && (
				<React.Fragment>

					<Button
						variant="text"
						color="neutral.main"
						size="small"
						onClick={() => setOpenLogin(true)}
					>
						Log In
					</Button>

					<Button 
						variant="text" 
						color="neutral.main" 
						size="small" 
						onClick={() => setOpenRegister(true)}
					> 
						Create Account 
					</Button>

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

			{options.map((option) => (
			<Button key={option.name} variant="text" color="neutral.main" size="small" component={Link} to={option.path}>
				{option.name}
			</Button>
			))}

			<SearchBar />

			{user && (
				<Button 
					color="primary" size="small" variant="contained" 
				  	sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}
					onClick={() => {
        				logout().then(() => navigate('/'))}}
				>
					
					<LogoutIcon fontSize="small" /> 
					Logout
				</Button>
			)}
			
  		</React.Fragment>
	);
}

export default DesktopToolbar;