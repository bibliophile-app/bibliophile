import { alpha } from '@mui/material/styles';
import { Stack, Button } from '@mui/material';

import Divider from '../atoms/Divider';
import { useNotification } from '../utils/NotificationContext';

function ActionsBase({ actions = [] }) {
  const { notify } = useNotification();

  const handleShare = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Veja isso!', url: currentUrl });
      } catch (err) {
        notify({ message: 'Falha ao compartilhar.', severity: 'error' });
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        notify({ message: 'Link copiado para a área de transferência!', severity: 'success' });
      } catch (err) {
        notify({ message: 'Erro ao copiar o link.', severity: 'error' });
      }
    }
  };

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

      <Button fullWidth variant="text" color="inherit" onClick={handleShare}>
        Compartilhar
      </Button>
    </Stack>
  );
}

export default ActionsBase;
