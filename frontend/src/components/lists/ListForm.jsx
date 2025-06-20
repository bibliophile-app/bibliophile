import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, IconButton, Button, 
  List, ListItem, ListItemText, ListItemAvatar
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';


import Modal from '@/atoms/Modal';
import Divider from '@/atoms/Divider';
import TextArea from '@/atoms/TextArea';

function AddToListForm({ open, onClose, onSubmit, book, lists=[] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedListIds, setSelectedListIds] = useState(new Set());

  function toggleSelection(id) {
    setSelectedListIds(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  function handleClose() {
    setSearch('');
    onClose();
  }

  function handleSubmit() {
    onSubmit(Array.from(selectedListIds), book.id);
    setSelectedListIds(new Set());
    handleClose();
  }

  const filtered = lists.filter(l => l.listName.toLowerCase().includes(search.toLowerCase()));

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
    >
      <Box>
        {/* Cabeçalho */}
        <Box 
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}
        >
          <Typography variant="h5">
            Adicione {book.title} à...
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon  sx={{ color: '#fefefe' }}/>
          </IconButton>
        </Box>

        <Divider />

        {/* Nova lista + busca */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, px: 2 }}>
          <Box component={Button} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon fontSize="small" />
            <Typography variant="p" onClick={() => navigate('/list/new')} sx={{ cursor: 'pointer', fontWeight: 500 }}>
              Nova lista...
            </Typography>
          </Box>

          <TextArea  
            onChange={setSearch}
            customHeight={true}
            slotProps={{
              endAdornment: <FilterListIcon fontSize="small"/>
            }}
          />
        </Box>

        {/* Lista filtrada */}
        <Box
          sx={{
            my: 1,
            minHeight: 200,
            maxHeight: 200,
            overflowY: 'auto',
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
          <List>
            {filtered.map(list => {
              const isSelected = selectedListIds.has(list.id);
              const isAlreadyInList = list.books.includes(book.id);
              return (
                <ListItem
                  key={list.id}
                  button="true"
                  disabled={isAlreadyInList}
                  onClick={() => {
                    if (!isAlreadyInList) toggleSelection(list.id);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 0.2, my: 0.5,
                    bgcolor: isSelected ? 'background.muted' : 'transparent',
                    color: isSelected ? 'common.white' : isAlreadyInList ? 'text.disabled' : 'text.primary',
                    opacity: isAlreadyInList ? 0.5 : 1,
                    '&:hover': {
                      bgcolor: isAlreadyInList ? 'transparent' : (isSelected ? 'background.muted' : 'action.hover'),
                      cursor: isAlreadyInList ? 'default' : 'pointer',
                    },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: '32px' }}>
                    {isSelected && <CheckIcon fontSize="small" sx={{ color: "green.main"}} />}
                  </ListItemAvatar>
                  <ListItemText
                    primary={list.listName}
                    secondary={`${list.books.length} livros`}
                    sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                    slotProps={{
                      secondary: {
                        sx: {
                          fontSize: '0.875rem',
                          color: 'neutral.main',
                        },
                      },
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Botão de confirmação */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1, bgcolor: 'background.muted' }}>
          <Button
            variant="contained"
            color="success"
            sx={{ color: '#fefefe' }}
            onClick={handleSubmit}
          >
            ADICIONAR
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddToListForm;