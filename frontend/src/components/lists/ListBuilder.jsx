import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Divider from '../../atoms/Divider';
import TextArea from '../../atoms/TextArea';
import SearchAutocomplete from '../search/SearchAutocomplete';
import BookImage from '../../atoms/BookImage';

function ListBuilder({ list = null, onSave, onDelete, onAddBooks, onRemoveBooks }) {
  const isEdit = !!list;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [books, setBooks] = useState([]);
  const [initialBooks, setInitialBooks] = useState([]);

  useEffect(() => {
    if (isEdit) {
      setName(list.listName || '');
      setDescription(list.listDescription || '');
      setBooks(list.books || []);
      setInitialBooks(list.books || []);
    }
  }, [list]);

  function addBook(book) {
    if (books.some(b => b.id === book.id)) return;
      
    const updatedBooks = [...books, book];
    setBooks(updatedBooks);
    if (onAddBooks) 
      console.log(book);
      onAddBooks((prev) => [...prev, book]);
  };

  function removeBook(bookToRemove) {
    const updatedBooks = books.filter((book) => book.id !== bookToRemove.id);
    setBooks(updatedBooks);
    
    if (onRemoveBooks) {
      const wasInitiallyPresent = initialBooks.some(b => b.id === bookToRemove.id);
      if (wasInitiallyPresent)
        onRemoveBooks((prev) => [...prev, bookToRemove]);
    }
  };

  async function handleSave() {
    const payload = {
      name,
      description,
      books,
    };

    if (onSave) await onSave(payload);
  };

  async function handleDelete() {
    await onDelete();
  };


  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Editar Lista' : 'Nova Lista'}
        </Typography>

        <Button variant="contained" color="background.main" sx={{ ml: 'auto' }}>
          CANCELAR
        </Button>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Stack direction="row" spacing={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 2 }}>
          <TextArea
            title="Nome"
            value={name}
            onChange={setName}
            maxLength={50}
            multiline={false}
            customHeight="auto"
            sx={{ fontSize: '1rem', fontWeight: 600 }}
          />

          <TextArea
            title="Descrição"
            value={description}
            onChange={setDescription}
            maxLength={255}
            multiline
            minRows={4}
            maxRows={12}
            sx={{ fontSize: '1rem' }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Adicione livros...
            </Typography>

            <SearchAutocomplete onSelect={addBook} placeholder={'Digite o nome de um livro...'} />
          </Box>

          <Box
            sx={{
              minHeight: 300,
              maxHeight: 300,
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#3f4e60',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
            }}
          >
            {books.map((book, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'transparent',
                  border: '1px solid #2f3e4e',
                  borderRadius: 1,
                  py: 1,
                  px: 0.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BookImage src={book?.coverUrl} width={60} height={80} />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h7" fontWeight="bold" color="white" gutterBottom>
                      {book?.title}
                    </Typography>
                    <Typography variant="body2">{book?.authors}</Typography>
                  </Box>
                </Box>

                <IconButton onClick={() => removeBook(book)} sx={{ color: '#91A0B5' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        {isEdit && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            DELETAR
          </Button>
        )}

        <Button
          variant="contained"
          color="success"
          sx={{ color: '#fefefe' }}
          onClick={handleSave}
        >
          {isEdit ? 'SALVAR ALTERAÇÕES' : 'SALVAR'}
        </Button>
      </Box>
    </Box>
  );
}

export default ListBuilder;
