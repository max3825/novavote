'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyElections } from '@/components/ui/EmptyState'
import CreateElectionWizard from './CreateElectionWizard'
import toast from 'react-hot-toast'

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

export default function AdminDashboard() {
  const router = useRouter()
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showWizard, setShowWizard] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Vérification auth au démarrage
    const token = localStorage.getItem('access_token')
    if (!token) {
      toast.error('Vous devez être connecté')
      router.replace('/login')
      return
    }
    setIsAuthenticated(true)
    setIsCheckingAuth(false)
    loadElections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger])

  const loadElections = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getElections() as Promise<Election[]> | Election[]
      setElections(await data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur chargement élections'
      if (message.includes('401')) {
        router.push('/login')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateElection = () => {
    // Double vérification avant d'ouvrir le wizard
    const token = localStorage.getItem('access_token')
    if (!token) {
      toast.error('Vous devez être connecté pour créer une élection')
      router.replace('/login')
      return
    }
    setShowWizard(true)
  }

  const handleElectionCreated = () => {
    setShowWizard(false)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiClient.updateElectionStatus(id, newStatus)
      toast.success('Statut mis à jour')
      setRefreshTrigger(prev => prev + 1)
    } catch (err: any) {
      toast.error(`Erreur: ${err.message}`)
    }
  }

  const handleDeleteElection = async (id: string, title: string) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer l'élection "${title}" ? Cette action est irréversible.`)
    if (!confirmed) return

    try {
      await apiClient.deleteElection(id)
      toast.success('Élection supprimée avec succès')
      setRefreshTrigger(prev => prev + 1)
    } catch (err: any) {
      toast.error(`Erreur: ${err.message}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500'
      case 'open': return 'bg-green-500'
      case 'closed': return 'bg-orange-500'
      case 'tallied': return 'bg-blue-500'
      default: return 'bg-gray-500'
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

  const getNextStatus = (status: string) => {
    switch (status) {
      case 'draft': return 'open'
      case 'open': return 'closed'
      case 'closed': return 'tallied'
      default: return null
    }
  }

  const getNextStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Ouvrir'
      case 'open': return 'Fermer'
      case 'closed': return 'Décompter'
      default: return null
    }
  }

  // Ne rien afficher pendant la vérification auth
  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-500 animate-spin"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-100 font-semibold text-lg">Vérification...</p>
        </div>
      </div>
    )
  }

  if (showWizard) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setShowWizard(false)}
            className="mb-6 px-6 py-3 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-900 dark:text-slate-100 font-semibold transition-all hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            ← Retour au dashboard
          </button>
          <CreateElectionWizard onComplete={handleElectionCreated} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
      {/* Header - Clean White with border */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10 shadow-sm dark:shadow-indigo-500/5">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                NovaVote Admin
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Gestion complète de vos élections en temps réel
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => router.push('/')}
                className="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 font-semibold text-sm transition-all shadow-sm"
              >
                Accueil
              </button>
              <button 
                onClick={() => {
                  apiClient.logout()
                  router.push('/login')
                }}
                className="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats Cards - Clean White with dark variants */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Total */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-indigo-500/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Élections</div>
              <div className="text-2xl">📊</div>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              {elections.length}
            </div>
          </div>

          {/* En cours */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-emerald-500/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">En cours</div>
              <div className="text-2xl">🟢</div>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              {elections.filter(e => e.status === 'open').length}
            </div>
          </div>

          {/* Brouillons */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-slate-500/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Brouillons</div>
              <div className="text-2xl">📝</div>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              {elections.filter(e => e.status === 'draft').length}
            </div>
          </div>

          {/* Terminées */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-amber-500/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Terminées</div>
              <div className="text-2xl">✅</div>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              {elections.filter(e => e.status === 'closed' || e.status === 'tallied').length}
            </div>
          </div>
        </div>

        {/* Action Button - Vibrant Gradient */}
        <div className="mb-10">
          <button 
            onClick={handleCreateElection}
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-md hover:shadow-lg dark:shadow-indigo-500/30 dark:hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            <span className="mr-2 text-xl">+</span> Créer une nouvelle élection
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-700 dark:text-red-200 font-medium flex items-center shadow-sm">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        {/* Elections List - Clean White Cards */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 dark:border-slate-700 border-t-indigo-500 mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Chargement des élections...</p>
          </div>
          ) : elections.length === 0 ? (
          <EmptyElections onCreate={handleCreateElection} />
        ) : (
          <div className="space-y-4">
            {elections.map((election) => (
              <div 
                key={election.id} 
                className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md dark:hover:shadow-indigo-500/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all relative overflow-hidden"
              >
                {/* Left Accent Border */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    election.status === 'open' ? 'bg-emerald-500' :
                    election.status === 'draft' ? 'bg-slate-300 dark:bg-slate-600' :
                    election.status === 'closed' ? 'bg-amber-500' :
                    'bg-indigo-500'
                }`}></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {election.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        election.status === 'draft' ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300' :
                        election.status === 'open' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                        election.status === 'closed' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' :
                        'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400'
                      }`}>
                        {getStatusLabel(election.status)}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 max-w-2xl line-clamp-1">
                      {election.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <span className="font-medium text-slate-900 dark:text-slate-300">
                          {new Date(election.start_date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-slate-400 dark:text-slate-600">→</span>
                        <span className="font-medium text-slate-900 dark:text-slate-300">
                          {new Date(election.end_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg">❓</span>
                        <span className="font-medium">{election.questions.length} questions</span>
                      </div>

                      {election.ballot_count !== undefined && (
                        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/20 px-3 py-1 rounded-md border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 font-medium">
                          <span className="font-bold">{election.ballot_count}</span>
                          <span className="text-xs uppercase">votes</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getNextStatus(election.status) && (
                      <button
                        onClick={() => handleUpdateStatus(election.id, getNextStatus(election.status)!)}
                        className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-400 font-semibold text-sm transition-colors border border-indigo-200 dark:border-indigo-500/30"
                      >
                        {getNextStatusLabel(election.status)}
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/admin/election/${election.id}`)}
                      className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/50 font-semibold text-sm transition-all"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => handleDeleteElection(election.id, election.title)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Supprimer"
                    >
                      🗑️
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
