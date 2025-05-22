import { alpha } from '@mui/material/styles';
import { Stack, Button } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import Divider from '../atoms/Divider';

function ActionsMenu({ handleReview }) {
  return (
    <Stack 
      spacing={1} 
      sx={{
        py: 1,
        mb: 2,
        width: '100%',
        bgcolor: (theme) => alpha(theme.palette.background.contrast, 0.8),  // escurece
        backdropFilter: 'blur(4px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)', 
      }}
    >
      <Button startIcon={<PlaylistAdd />} fullWidth variant="text" color="inherit">
        Read Next
      </Button>

      <Divider sx={{ my: 1 }} />

      <Button fullWidth variant="text" color="inherit" onClick={handleReview}>
        Show your activity
      </Button>

      <Divider sx={{ my: 1 }} />

      <Button fullWidth variant="text" color="inherit" onClick={handleReview}>
        Review or log again...
      </Button>
        
      <Divider sx={{ my: 1 }} />

      <Button fullWidth variant="text" color="inherit">
        Add to lists...
      </Button>
      
      <Divider sx={{ my: 1 }} />

      <Button fullWidth variant="text" color="inherit">
        Share
      </Button>
    </Stack>
  );
}

export default ActionsMenu;