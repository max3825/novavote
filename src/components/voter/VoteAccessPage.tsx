'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function VoteAccessPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token.trim()) {
      toast.error('Veuillez entrer votre lien de vote')
      return
    }

    setLoading(true)
    // Rediriger vers la page de vote avec le token
    router.push(`/vote/${token}`)
  }

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">Voter</h1>
          <p className="dark:text-slate-400 text-gray-600 text-sm">
            Entrez votre lien de vote pour accéder à votre bulletin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-slate-300 text-gray-700 mb-2">
              Lien de vote
            </label>
            <input
              type="text"
              placeholder="Collez votre lien ou token..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 rounded-lg focus:outline-none transition-all"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <p className="text-xs dark:text-slate-500 text-gray-500 mt-1">
              Vous avez reçu ce lien par email de la part de l'administrateur
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:disabled:bg-indigo-600/50 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-500 disabled:cursor-not-allowed"
          >
            {loading ? 'Redirection...' : 'Continuer'}
          </button>
        </form>

        <div className="pt-4 border-t dark:border-slate-800/50 border-gray-200">
          <p className="text-xs text-center dark:text-slate-500 text-gray-600">
            Vous n'avez pas reçu de lien?{' '}
            <a href="/" className="dark:text-indigo-400 dark:hover:text-indigo-300 text-indigo-600 hover:text-indigo-700 font-medium">
              Retour à l'accueil
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
