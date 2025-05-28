import { alpha } from '@mui/material/styles';
import { Stack, Button } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import Divider from '../atoms/Divider';
import { useAuth } from '../utils/AuthContext';

function ActionsMenu({ handleReview }) {
  const { user } = useAuth();

  return (
    <Stack 
      sx={{
        width: '100%',
        borderRadius: '5px',
        bgcolor: (theme) => alpha(theme.palette.background.contrast, 0.8),
        backdropFilter: 'blur(4px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)', 
      }}
    >
      {user ? (
        <>
          <Button startIcon={<PlaylistAdd />} fullWidth variant="text" color="inherit">
            Read Next
          </Button>

          <Divider />

          <Button fullWidth variant="text" color="inherit" onClick={handleReview}>
            Review or log again...
          </Button>
            
          <Divider />

          <Button fullWidth variant="text" color="inherit">
            Add to lists...
          </Button>
        </>

      ) : (
          <Button fullWidth variant="text" color="inherit">
            Sign in to log, rate or review
          </Button>
      )}

      <Divider />

      <Button fullWidth variant="text" color="inherit">
        Share
      </Button>
    </Stack>
  );
}

export default ActionsMenu;