import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchContainer = styled('div')(({ theme, isOpen }) => ({
  position: 'relative',
  height: '1rem',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row-reverse',
  color: theme.palette.neutral.main,
  borderRadius: theme.shape.borderRadius.pill,
  backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
  width: isOpen ? '180px' : '40px',
  padding: isOpen ? theme.spacing(0.5, 1) : 0,
  overflow: 'hidden',

  transition: [
    theme.transitions.create(['background-color'], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }),
    theme.transitions.create(['width', 'padding'], {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeInOut,
    }),
  ].join(','),

  '&:focus-within': {
    backgroundColor: isOpen ? theme.palette.neutral.secondary : 'transparent',
    color: isOpen ? theme.palette.background.default : theme.palette.neutral.main,
  }
}));

const StyledInputBase = styled(InputBase)(({ theme, isOpen }) => ({
  color: 'inherit',
  fontSize: '0.8rem',
  lineHeight: 1.2, 
  flex: 1,

  opacity: isOpen ? 1 : 0,
  pointerEvents: isOpen ? 'auto' : 'none',

  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
    width: '100%',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: 'inherit',
  padding: '1px',
}));

function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  function handleToggle() {
    setOpen((prev) => !prev);
    if (open) setQuery(""); // clear query if closing
  }

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <SearchContainer isOpen={open}>
      <StyledInputBase
          inputRef={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder=""
          isOpen={open}
      />
      <StyledIconButton onClick={handleToggle}>
        <SearchIcon fontSize='small' />
      </StyledIconButton>
    </SearchContainer>
  );
}

export default SearchBar;
