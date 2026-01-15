'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'

interface Election {
  id: string
  title: string
  description: string
  status: 'draft' | 'open' | 'closed' | 'tallied'
  questions: { question: string; options: string[] }[]
  start_date: string
  end_date: string
  created_at: string
  ballot_count?: number
}

export function ElectionsList() {
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showWizard, setShowWizard] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      // Redirection sans dépendance au router
      window.location.href = '/login'
      return
    }
    loadElections()
  }, [])

  const loadElections = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getElections() as Promise<Election[]> | Election[]
      setElections(await data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur chargement élections'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon'
      case 'open': return 'Ouverte'
      case 'closed': return 'Fermée'
      case 'tallied': return 'Décomptée'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
      {/* Header spécifique */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Élections
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Liste et gestion des élections
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => (window.location.href = '/admin')}
                className="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 font-semibold text-sm transition-all shadow-sm"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Actions */}
        <div className="mb-8">
          <button 
            onClick={() => (window.location.href = '/admin/election/new')}
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-md hover:shadow-lg dark:shadow-indigo-500/30 dark:hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            <span className="mr-2 text-xl">+</span> Créer une nouvelle élection
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-700 dark:text-red-200 font-medium flex items-center shadow-sm">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        {/* Liste */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 dark:border-slate-700 border-t-indigo-500 mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Chargement des élections...</p>
          </div>
        ) : elections.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🗳️</div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Aucune élection créée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {elections.map((election) => (
              <div 
                key={election.id} 
                className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md dark:hover:shadow-indigo-500/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {election.title}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300">
                        {getStatusLabel(election.status)}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 max-w-2xl line-clamp-1">
                      {election.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => (window.location.href = `/admin/election/${election.id}`)}
                      className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/50 font-semibold text-sm transition-all"
                    >
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
