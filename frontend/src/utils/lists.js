const API_URL = "/booklists";

function extractListId(response) {
  const match = response.match(/Booklist ID:\s*(\d+)/);
  if (!match) {
    throw new Error(`Could not extract list ID from response: ${response}`);
  }
  return parseInt(match[1], 10);
};

async function fetchLists() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erro ao buscar listas: HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Erro ao buscar listas: ${error.message}`);
  }
}

async function searchById(listId, includeBooks) {
  if (!listId) throw new Error("Parâmetro 'listId' é obrigatório");
  try {
    const response = await fetch(includeBooks ? `${API_URL}/${listId}/books` : `${API_URL}/${listId}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar listas por ID: HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Erro ao buscar lista por ID: ${error.message}`);
  }
}

async function searchByUser(userId) {
  if (!userId) throw new Error("Parâmetro 'userId' é obrigatório");
  try {
    const response = await fetch(`${API_URL}/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar listas do usuário: HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Erro ao buscar listas do usuário: ${error.message}`);
  }
}

async function searchDefault(userId) {
  if (!userId) throw new Error("Parâmetro 'userId' é obrigatório");
  try {
    const response = await fetch(`${API_URL}/user/${userId}/default`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar listas do usuário: HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Erro ao buscar listas do usuário: ${error.message}`);
  }
}

async function createList({ listName, listDescription }) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        listName,
        listDescription,
      })
    });
    if (!response.ok) {
      throw new Error(`Erro ao adicionar lista: HTTP ${response.status}`);
    }

    const text = await response.text();
    const listId = extractListId(text);
    return listId;
  } catch (error) {
    throw new Error(`Erro ao adicionar lista: ${error.message}`);
  }
}

async function updateList(listId, { listName, listDescription }) {
  if (!listId) throw new Error("Parâmetro 'listId' é obrigatório");
  
  try {
    const response = await fetch(`${API_URL}/${listId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        listName,
        listDescription,
      })
    });
    if (!response.ok) {
      throw new Error(`Erro ao atualizar lista: HTTP ${response.status}`);
    }
    return true;
  } catch (error) {
    throw new Error(`Erro ao atualizar lista: ${error.message}`);
  }
}

async function deleteList(listId) {
  if (!listId) throw new Error("Parâmetro 'listId' é obrigatório");
  try {
    const response = await fetch(`${API_URL}/${listId}`, {
      method: "DELETE",
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`Erro ao deletar lista: HTTP ${response.status}`);
    }
    return true;
  } catch (error) {
    throw new Error(`Erro ao deletar lista: ${error.message}`);
  }
}

async function addBook(listId, bookId) {
    if (!listId || !bookId) throw new Error("Parâmetros 'listId', 'bookId' são obrigatórios");
    try {
      const response = await fetch(`${API_URL}/${listId}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          bookId: bookId,
        })
      });
   
      if (!response.ok) {
        throw new Error(`Erro ao adicionar livro à lista: HTTP ${response.status}`);
      }
      return true;
    } catch (error) {
      throw new Error(`Erro ao adicionar livro: ${error.message}`);
    }
}

async function removeBook(listId, bookId) {
    if (!listId || !bookId) throw new Error("Parâmetros 'listId', 'bookId' são obrigatórios");
    try {
      const response = await fetch(`${API_URL}/${listId}/books/${bookId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });
   
      if (!response.ok) {
        throw new Error(`Erro ao remover livro à lista: HTTP ${response.status}`);
      }
      return true;
    } catch (error) {
      throw new Error(`Erro ao remover livro: ${error.message}`);
    }
}

export {
  fetchLists,
  searchById,
  searchByUser,
  createList,
  updateList,
  deleteList,
  addBook,
  removeBook,
  searchDefault,
};