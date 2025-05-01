import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import SearchBar from '../search/SearchBar';

// Component for rendering navigation options
function DesktopToolbar({ options, user }) {
	return (
		<React.Fragment>
			{!user && (
				<React.Fragment>
					<Button variant="text" color="neutral.main" size="small"> Log In </Button>
					<Button variant="text" color="neutral.main" size="small" component={Link} to={"/signin"}> Create Account </Button>
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
				  	sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}
				>
					<AddIcon fontSize="small" /> Log
				</Button>
			)}
  		</React.Fragment>
	);
}

export default DesktopToolbar;