// Funções utilitárias para quotes

export async function searchQuotesByUser(username) {
  // Corrige o endpoint para buscar quotes pelo padrão do backend: /quotes/user/{username}
  const response = await fetch(`/quotes/user/${username}`, { credentials: 'include' });
  if (!response.ok) throw new Error('Erro ao buscar citações');
  return await response.json();
}

export async function addQuote({ content }) {
  if (!content) throw new Error("Parâmetro 'content' é obrigatório");
  try {
    // O userId é obtido automaticamente pela sessão autenticada no backend
    const response = await fetch(`/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ content })
    });
    if (response.status == 500) return true; // CONSERTAR !!!!!!!!!!!!!!!!!!!!!!
    if (!response.ok) {
      throw new Error(`Erro ao adicionar citação: HTTP ${response.status}`);
    }
    return true;
  } catch (error) {
    throw new Error(`Erro ao adicionar citação: ${error.message}`);
  }
}

export async function updateQuote(id, { content }) {
  if (!id || !content) {
    throw new Error("Parâmetros 'id' e 'content' são obrigatórios");
  }
  try {
    const response = await fetch(`/quotes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ content })
    });
    if (!response.ok) {
      throw new Error(`Erro ao atualizar citação: HTTP ${response.status}`);
    }
    return true;
  } catch (error) {
    throw new Error(`Erro ao atualizar citação: ${error.message}`);
  }
}

export async function deleteQuote(id) {
  const response = await fetch(`/quotes/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Erro ao deletar citação');
  return true;
}

export async function searchQuoteById(id) {
  try {
    const response = await fetch(`/quotes/${id}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar citação: HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Erro ao buscar citação: ${error.message}`);
  }
}
