import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Modal from '@/atoms/Modal';
import Divider from '@/atoms/Divider';
import TextArea from '@/atoms/TextArea';
import LoadingBox from '@/atoms/LoadingBox';
import { useNotification } from '@/utils/NotificationContext';
import { addQuote, updateQuote, deleteQuote, searchQuoteById } from '@/utils/quotes';

const maxLength = 255;

function QuoteForm({
  open,
  onClose,
  onSubmit,
  quoteId = null
}) {
  const { notify, confirm } = useNotification();
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('create');
  const [loading, setIsLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function handleExit() {
    setContent('');
    setMode('create');
    setIsLoading(false);
    setConfirming(false);
    if (onClose) onClose();
  }

  async function handleSave() {
    if (!content.trim()) {
      notify({ message: 'A citação não pode estar vazia!', severity: 'warning' });
      return;
    }
    setIsLoading(true);
    let errored = false;
    try {
      if (mode === 'create') await addQuote({ content });
      else await updateQuote(quoteId, { content });
    } catch (e) {
      errored = true;
      notify({ message: e.message || 'Erro ao salvar citação!', severity: 'error' });
    } finally {
      setIsLoading(false);
      handleExit();
      if (!errored && onSubmit) onSubmit();
      if (errored && onSubmit) onSubmit(); // força atualização mesmo se erro
    }
  }

  async function handleConfirm(action, quoteId, beforeUnmount) {
    setConfirming(true);
    try {
      if (action === 'close') beforeUnmount();
      else if (action === 'delete') {
        await deleteQuote(quoteId);
        if (onSubmit) onSubmit();
        beforeUnmount();
      }
    } catch (e) {
      notify({ message: e.message || 'Erro ao remover citação!', severity: 'error' });
    } finally {
      setConfirming(false);
    }
  }

  function handleAttemptClose() {
    if (!content) return handleExit();
    confirm({
      title: 'Descartar alterações?',
      description: 'As alterações serão perdidas. Deseja continuar?',
      confirmText: 'Descartar',
      onConfirm: async () => handleConfirm('close', quoteId, handleExit)
    });
  }

  function handleAttemptDelete() {
    confirm({
      title: 'Remover citação?',
      description: 'Tem certeza que deseja remover esta citação? Esta ação não pode ser desfeita.',
      confirmText: 'Remover',
      onConfirm: async () => handleConfirm('delete', quoteId, handleExit)
    });
  }

  useEffect(() => {
    if (!open) return;
    if (quoteId) {
      setMode('edit');
      setIsLoading(true);
      async function fetchQuote() {
        try {
          const quote = await searchQuoteById(quoteId);
          setContent(quote.content || '');
        } catch (error) {
          notify({ message: 'Erro ao carregar citação!', severity: 'error' });
          setTimeout(() => handleExit(), 1500);
        } finally {
          setIsLoading(false);
        }
      }
      fetchQuote();
    } else {
      setMode('create');
      setContent('');
    }
  }, [quoteId, open]);

  return (
    <Modal
      open={open}
      onClose={handleAttemptClose}
      sx={{ width: { xs: '100%', sm: '500px' } }}
    >
      {loading ? <LoadingBox /> : (
        <React.Fragment>
          <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">
              Guarde aqui sua citação favorita
            </Typography>
            <IconButton onClick={handleAttemptClose} disabled={confirming}>
              <CloseIcon sx={{ color: '#fefefe' }} />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextArea
              placeholder="Escreva aqui sua citação..."
              multiline
              minRows={4}
              maxRows={12}
              maxLength={maxLength}
              value={content}
              onChange={setContent}
              sx={{ backgroundColor: '#ecf0f1', color: '#000', fontSize: '0.875rem' }}
            />
          </Box>
          <Box
            sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: 'background.muted' }}
          >
            {mode === 'edit' && (
              <Button color="error" variant="contained" sx={{ color: '#fefefe' }} onClick={handleAttemptDelete} disabled={confirming}>
                REMOVER
              </Button>
            )}
            <Button variant="contained" color="success" sx={{ color: '#fefefe' }} onClick={handleSave} disabled={confirming}>
              {mode === 'edit' ? 'SALVAR ALTERAÇÕES' : 'SALVAR'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Modal>
  );
}

export default QuoteForm;
