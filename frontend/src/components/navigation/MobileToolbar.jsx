import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Divider, Drawer, IconButton, MenuItem } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ListIcon from '@mui/icons-material/List';

import Logo from '../../atoms/Logo';
import SearchBar from '../search/SearchBar';

const ItemDivider = styled(Divider)(({ theme }) => ({
	my: 0.5, 
	backgroundColor: theme.palette.background.muted, 
}));

const StyledMenuItem = styled(MenuItem)(({
	padding: '6px 3px',
}));

// Component for rendering drawer content
function MobileToolbar({ user, options }) {
	const [open, setOpen] = useState(false);

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
			</Drawer>
		</React.Fragment>
	);
}

export default MobileToolbar;