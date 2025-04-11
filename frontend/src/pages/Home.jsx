import React, { useEffect, useState } from 'react'
import Login from '../components/Login'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const {user, logout} = useAuth();

  if (!user) {
    return <Login onLogin={() => window.location.reload()} />
  }

  return (
    <div>
      <h1>Bem-vindo, {user.username}</h1>
      <button onClick={() => {
        logout().then(() => window.location.reload())
      }}>Logout</button>
    </div>
  )
}

export default Home;