import React, { useEffect, useState } from 'react'
import Login from './Login'

function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8080/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
  }, [])

  if (!user) {
    return <Login onLogin={() => window.location.reload()} />
  }

  return (
    <div>
      <h1>Bem-vindo, {user.username}</h1>
      <button onClick={() => {
        fetch('http://localhost:8080/logout', { credentials: 'include' }).then(() => window.location.reload())
      }}>Logout</button>
    </div>
  )
}

export default Home;