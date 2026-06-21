import { useState } from 'react'
import { supabase } from '../supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Vérifie ton email !')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">
          {isLogin ? 'Connexion' : 'Inscription'}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
        />

        {message && <p className="text-yellow-400 mb-3 text-sm">{message}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {isLogin ? 'Se connecter' : "S'inscrire"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-gray-400 text-sm mt-4 text-center cursor-pointer hover:text-white"
        >
          {isLogin ? "Pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
        </p>
      </div>
    </div>
  )
}