import { createContext, useContext, useEffect, useState } from "react"
import Register from "@/components/Register"
import Login from "@/components/Login"

const AuthContext = createContext()

function AuthProvider ({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  

  async function authUser() {
    const response = await fetch(`/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
  
    if (!response.ok) {
      console.error('Falha ao obter usuário:', response.status);
      setUser({ id: -1 });
      return;
    }
  
    try {
      const profile = await response.json();
      setUser(profile);
    } catch (err) {
      console.error('Erro ao fazer parsing do JSON:', err);
      setUser({ id: -1 });
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

  function isAuth() {
    return user && user?.id >= 0;
  }

  useEffect(() => {
    authUser()
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])
  
  return (
    <AuthContext.Provider 
      value={{ 
        user,
        loading, 
        register, 
        login, 
        logout,
        isAuth,
        handleSignin: () => setLoginOpen(true), 
        handleSignup: () => setRegisterOpen(true)
      }}
    >
      
      {children}

      <Login 
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => window.location.reload()} 
      />

      <Register
        isOpen={registerOpen}
        onClose={() => setOpenRegister(false)}
        onSuccess={() => window.location.reload()}
      />
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext);

export {useAuth, AuthProvider};