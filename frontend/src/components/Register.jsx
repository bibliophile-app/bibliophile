//import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';   // ← não esqueça!

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import EmailIcon from '@mui/icons-material/Email';

import {
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Register({ onSuccess }) {
  //const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleMouseDownPassword = (e) => e.preventDefault();

  async function handleRegister(e) {
    e.preventDefault();
    setError('');           // limpa mensagem antiga
    try {
      await register({ username, password, email });
      setUsername('');
      setPassword('');
      setEmail('');
      // AVISA AO MODAL QUE DEU CERTO
      onSuccess?.();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}
      >
        <TextField
          required
          id="email"
          label="Email"
          value={email}                            // 1. value
          onChange={e => setEmail(e.target.value)} // 2. onChange
          autoComplete="email"
          
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            )
          }}
          
        />

        <TextField
          required
          id="username"
          label="Username"
          value={username}                            // 1. value
          onChange={e => setUsername(e.target.value)} // 2. onChange
          autoComplete="username"
          
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleIcon />
              </InputAdornment>
            )
          }}
          
        />
  
        <TextField
          label="Password"
          required
          fullWidth
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword
                      ? 'Ocultar senha'
                      : 'Mostrar senha'
                  }
                  onClick={() => setShowPassword(show => !show)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword
                    ? <Visibility />
                    : <VisibilityOff />
                  }
                </IconButton>
              </InputAdornment>              
            )
          }}
        />
      {/* Exibe a mensagem de erro */}
      {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      <Button
        type="submit"
        variant="contained"
        color="primary"    // <— adiciona isso
        fullWidth          // <— opcional, mas costuma melhorar o layout
      >
        Sign Up
      </Button>
      </Box>
    );
}