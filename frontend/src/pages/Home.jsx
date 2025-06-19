import React from 'react'
import { useAuth } from '../utils/AuthContext'

function Home() {
  const { user, isAuth } = useAuth();

  if (!isAuth()) {
    return (<div style={{ minHeight: '100%' }}>
              <h1> Você não está logado </h1>
            </div>
    )
  }

  return (
    <div style={{ minHeight: '100%' }}>
      <h1>Bem-vindo, {user.username}</h1>
    </div>
  )
}

export default Home;