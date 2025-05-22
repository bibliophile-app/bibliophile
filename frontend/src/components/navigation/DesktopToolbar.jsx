import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

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
  		</React.Fragment>
	);
}

export default DesktopToolbar;