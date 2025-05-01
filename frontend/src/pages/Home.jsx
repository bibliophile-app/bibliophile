import React from 'react'
import Login from '../components/Login'
import { useAuth } from '../utils/AuthContext'

function Home() {
  const {user, logout} = useAuth();

  if (!user) {
    return <Login onLogin={() => window.location.reload()} />
  }

  return (
    <div style={{ minHeight: '100%' }}>
      <h1>Bem-vindo, {user.username}</h1>
      <button onClick={() => {
        logout().then(() => window.location.reload())
      }}>Logout</button>
    </div>
  )
}

export default Home;