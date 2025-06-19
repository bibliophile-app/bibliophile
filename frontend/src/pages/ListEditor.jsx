import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, CircularProgress } from '@mui/material';

import ListBuilder from '@/components/lists/ListBuilder';
import useOpenLibrary from '@/utils/useOpenLibrary';
import { useAuth } from '@/utils/AuthContext';
import { handleSafeNavigation } from '@/utils/handlers';
import { useNotification } from '@/utils/NotificationContext';
import { BooklistConstants } from '@/utils/constants';
import {
  searchById,
  createList,
  updateList,
  deleteList,
  addBook,
  removeBook
} from '@/utils/lists';

function ListEditorPage() {
  const safeBack = handleSafeNavigation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuth } = useAuth();
  const { notify, confirm } = useNotification();

  const isEdit = !!id;

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  const [booksToAdd, setBooksToAdd] = useState([]);
  const [booksToRemove, setBooksToRemove] = useState([]);

  const { fetchResults } = useOpenLibrary({
    onError: (err) => {
      console.error("Erro ao buscar livro:", err);
    }
  });

  useEffect(() => {
    setLoading(isEdit);
    if (!isEdit || !user) return;
    
    if (!isAuth()) {
      notify({ 
        message: 'Por favor, faça login para acessar a edição de listas.',
        severity: 'info',
      });
      safeBack();
      return;
    }

    async function fetchList() {
      try {
        const fetchedList = await searchById(id, true);

        if (fetchedList.username !== user?.username || fetchedList.listName === BooklistConstants.DEFAULT_LIST_NAME) {
          notify({ message: 'Você não pode editar essa lista!', severity: 'error' });
          safeBack();
          return;
        }

        const books = await Promise.all(
          fetchedList.books.map(async (bookId) => await fetchResults(null, bookId))
        );

        fetchedList.books = books;
        setList(fetchedList);
      } catch (error) {
        notify({ message: 'Erro ao carregar lista!', severity: 'error' });
        safeBack();
        return;
      } finally {
        setLoading(false);
      }
    }

    fetchList();
  }, [id, user]);

  async function handleSave(data) {
    try {
      let listId;
      if (isEdit) {
        listId = id;
        await updateList(listId, { listName: data.name, listDescription: data.description });

        for (const book of booksToAdd) {
          await addBook(listId, book.id);
        }

        for (const book of booksToRemove) {
          await removeBook(listId, book.id);
        }
      } else {
        listId = await createList({ listName: data.name, listDescription: data.description });

        for (const book of data.books) {
          await addBook(listId, book.id);
        }
      }

      notify({
        message: 'Lista salva!',
        severity: 'success'
      });

      navigate(`/${listId}/list`);
    } catch (error) {
      notify({
        message: `Erro ao salvar lista: ${error}`,
        severity: 'error'
      });
    }
  }

  function handleDelete() {
    confirm({
      title: 'Remover lista?',
      description: 'Tem certeza que deseja remover essa lista?',
      confirmText: 'Remover',
      onConfirm: async () => {
        try {
          await deleteList(id);
          navigate(`${user}/lists`);
        } catch (error) {
          notify({ message: 'Erro ao deletar lista', severity: 'error' });
        }
      }
    });
  }

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <ListBuilder
      list={list}
      onSave={handleSave}
      onDelete={handleDelete}
      onAddBooks={setBooksToAdd}
      onRemoveBooks={setBooksToRemove}
    />
  );
}

export default ListEditorPage;