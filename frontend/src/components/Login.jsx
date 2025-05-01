import { useState } from 'react'
import { useAuth } from '../utils/AuthContext'

export default function Login() {
  const {login} = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault();
    await login({username, password});
    setUsername('');
    setPassword('');
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login de Usuário</h2>
      <form onSubmit={handleLogin}>
        <input value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button>Login</button>
      </form>
    </div>
  )
}
