import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Auth from './pages/Auth'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  if (!session) return <Auth />

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div>
        <p>Connecté : {session.user.email}</p>
        <button onClick={() => supabase.auth.signOut()} className="mt-4 text-red-400">
          Déconnexion
        </button>
      </div>
    </div>
  )
}