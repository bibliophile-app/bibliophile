import { alpha } from '@mui/material/styles';
import { Stack, Button } from '@mui/material';

import Divider from '@/atoms/Divider';
import { handleShare } from '@/utils/handlers';
import { useNotification } from '@/utils/NotificationContext';

function ActionsBase({ actions = [] }) {
  const { notify } = useNotification();

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
      {actions.map(({ label, onClick, icon }, index) => (
        <div key={index}>
          <Button
            startIcon={icon}
            fullWidth
            variant="text"
            color="inherit"
            onClick={onClick}
          >
            {label}
          </Button>
          <Divider />
        </div>
      ))}

      <Button fullWidth variant="text" color="inherit" onClick={() => handleShare(notify)}>
        Compartilhar
      </Button>
    </Stack>
  );
}

export default ActionsBase;
