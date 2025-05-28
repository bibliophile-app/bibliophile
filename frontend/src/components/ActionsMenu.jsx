import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import { Stack, Button, Snackbar, Alert } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';

import Divider from '../atoms/Divider';
import { useAuth } from '../utils/AuthContext';

function ActionsMenu({ handleReview }) {
  const { user, handleSignin } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleShare = async () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check this out!',
          url: currentUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  return (
    <>
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
          <Button fullWidth variant="text" color="inherit" onClick={handleSignin}>
            Sign in to log, rate or review
          </Button>
        )}

        <Divider />

        <Button fullWidth variant="text" color="inherit" onClick={handleShare}>
          Share
        </Button>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}

export default ActionsMenu;