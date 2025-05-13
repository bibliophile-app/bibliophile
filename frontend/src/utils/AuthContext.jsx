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
  
  async function register({ username, password }) {
    const response = await fetch(`/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ email, username, password })
      });
  }

  async function login({ username, password }) {
    const response = await fetch(`/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    })
   
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