import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';

import { alpha, styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography'; 
import FormControl from '@mui/material/FormControl';


const TextInput  = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    backgroundColor: '#F3F6F9',
    border: '1px solid',
    borderColor: '#E0E3E7',
    fontSize: 15,
    padding: '10px 12px',
    color: theme.palette.primary.main, 
    
    '&:focus': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const RenderInputField = ({ id, label, value, onChange, type = 'text' }) => (
  <FormControl
    required
    id={id}
    variant="standard"
    fullWidth
    value={value}
    onChange={onChange}
  >
    <InputLabel
      shrink
      htmlFor={`${id}-input`}
      sx={{
        color: 'primary.main',
        fontSize: '1.5rem',
        fontWeight: 500,
        '& .MuiFormLabel-asterisk': {
          display: 'none',
        },
      }}
    >
      {label}
    </InputLabel>
    <TextInput id={`${id}-input`} type={type} />
  </FormControl>
);


export default function Login({ onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleMouseDownPassword = (e) => e.preventDefault();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');          
    try {
      await login({ username, password });
      setUsername('');
      setPassword('');
      onSuccess?.();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}      
    >
      <RenderInputField
        id="username"
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <RenderInputField
        id="password"
        label="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
      />
    
      {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"    
        fullWidth          
      >
        Sign In
      </Button>

    </Box>
  );
}