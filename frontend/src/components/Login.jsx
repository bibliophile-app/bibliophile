import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'; 

//novas
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
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
    //fontFamily: /*...*/,
    padding: '10px 12px',
    color: theme.palette.primary.main,      // texto sempre na cor primária
    
    '&:focus': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function Login({ onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDownPassword = (e) => e.preventDefault();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');           // limpa mensagem antiga
    try {
      await login({ username, password });
      setUsername('');
      setPassword('');
      // AVISA AO MODAL QUE DEU CERTO
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
      

      <FormControl 
        id="username"
        variant="standard" 
        fullWidth
        value={username}                            
        onChange={e => setUsername(e.target.value)}       
      >
        <InputLabel shrink htmlFor="username-input"
          sx={{color: 'primary.main', fontSize: '1.5rem', fontWeight: 500}}>
          Username
        </InputLabel>
        
        <TextInput/>

      </FormControl>

      <FormControl 
        id="password"
        variant="standard" 
        fullWidth
        value={password}                            
        onChange={e => setPassword(e.target.value)}
        
      >
        <InputLabel shrink htmlFor="bootstrap-input"
          sx={{ color: 'primary.main', fontSize: '1.5rem', fontWeight: 500 }}>
          Password
        </InputLabel>
        <TextInput type="password"/>
      </FormControl>
    
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
