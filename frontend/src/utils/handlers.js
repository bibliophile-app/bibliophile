import { useNavigate, useNavigationType } from 'react-router-dom';

async function handleShare(notify) {
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

function handleSafeNavigation() {
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  function safeBack(fallback = '/') {
    if (navigationType === 'POP') {
      navigate(fallback);
    } else {
      navigate(-1);
    }
  };

  return safeBack;
}

export { handleShare, handleSafeNavigation };