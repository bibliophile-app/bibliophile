import { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import Dialog from '@/atoms/Dialog';

const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [toastState, setToastState] = useState({
    open: false,
    message: '',
    severity: 'info',
    duration: 3000,
  });

  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    description: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    onConfirm: null,
  });

  function notify({ message, severity = 'info', duration = 3000 }) {
    setToastState({ open: true, message, severity, duration });
  };

  function confirm({ title, description, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm }) {
    setDialogState({
      open: true,
      title,
      description,
      confirmText,
      cancelText,
      onConfirm,
    });
  };

  function handleToastClose(_, reason) {
    if (reason === 'clickaway') return;
    setToastState((prev) => ({ ...prev, open: false }));
  };

  function handleDialogClose() {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  async function handleDialogConfirm() {
    handleDialogClose();
    if (dialogState.onConfirm) await dialogState.onConfirm();
  };

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}

      {/* Toast */}
      <Snackbar
        open={toastState.open}
        autoHideDuration={toastState.duration}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toastState.severity}
          sx={{ width: '100%' }}
        >
          {toastState.message}
        </Alert>
      </Snackbar>

      {/* Diálogo de confirmação */}
      <Dialog
        open={dialogState.open}
        title={dialogState.title}
        description={dialogState.description}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogClose}
      />
    </NotificationContext.Provider>
  );
}

const useNotification = () => useContext(NotificationContext);

export { useNotification, NotificationProvider }