import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

function AuthProvider ({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function authUser() {
    const response = await fetch(`/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
  
    if (!response.ok) {
      console.error('Falha ao obter usuário:', response.status);
      setUser(null);
      return;
    }
  
    try {
      const profile = await response.json();
      setUser(profile);
    } catch (err) {
      console.error('Erro ao fazer parsing do JSON:', err);
      setUser(null);
    }
  }
  
  async function register({ email, username, password }) {
    const response = await fetch(`/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ email, username, password })
      });
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("username já existe");
        }
      
        let message = "Não foi possível criar a conta"
        try {
          const data = await response.json()
          message = data.message || message;
        } catch (_){
          throw new Error(message);
        }
      }
  }

  async function login({ username, password }) {
    const response = await fetch(`/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    })
   
    if (!response.ok) {
      
      let message = "Usuário ou senha inválidos"
      try {
        const data = await response.json()
        message = data.message || message;
      } catch (_){
        throw new Error(message);
      }
    }
    await authUser();
  }

  async function logout() {
    await fetch(`/logout`, { credentials: 'include' })
    setUser(null)
  }

  useEffect(() => {
    authUser()
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])
  
  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
    return useContext(AuthContext);
}

export {useAuth, AuthProvider};