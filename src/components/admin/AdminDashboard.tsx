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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 blur"></div>
          </div>
          <p className="text-slate-100 font-semibold text-lg">Vérification...</p>
        </div>
      </div>
    )
  }

  if (showWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setShowWizard(false)}
            className="mb-6 px-6 py-3 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-slate-600 text-slate-100 font-semibold transition-all hover:shadow-md hover:scale-105"
          >
            ← Retour au dashboard
          </button>
          <CreateElectionWizard onComplete={handleElectionCreated} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header avec glassmorphism */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10 shadow-lg shadow-indigo-500/5">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight">
                <span className="gradient-text">NovaVote</span> <span className="text-slate-100">Admin</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                Gestion complète de vos élections en temps réel
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => router.push('/')}
                className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-indigo-400 font-semibold text-sm transition-all shadow-sm"
              >
                Accueil
              </button>
              <button 
                onClick={() => {
                  apiClient.logout()
                  router.push('/login')
                }}
                className="px-5 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats Cards - Pop effect */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Total */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative card-glass p-6 shadow-xl shadow-indigo-500/20 hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-4 right-4 p-2 bg-indigo-500/20 rounded-lg text-indigo-400">📊</div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Élections</div>
              <div className="text-4xl font-extrabold tracking-tight text-slate-100">
                {elections.length}
              </div>
            </div>
          </div>

          {/* En cours */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative card-glass p-6 shadow-xl shadow-emerald-500/20 hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-4 right-4 p-2 bg-emerald-500/20 rounded-lg text-emerald-400">🟢</div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">En cours</div>
              <div className="text-4xl font-extrabold tracking-tight text-slate-100">
                {elections.filter(e => e.status === 'open').length}
              </div>
            </div>
          </div>

          {/* Brouillons */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-400 to-slate-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative card-glass p-6 shadow-xl shadow-slate-500/20 hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-4 right-4 p-2 bg-slate-700 rounded-lg text-slate-400">📝</div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Brouillons</div>
              <div className="text-4xl font-extrabold tracking-tight text-slate-100">
                {elections.filter(e => e.status === 'draft').length}
              </div>
            </div>
          </div>

          {/* Terminées */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative card-glass p-6 shadow-xl shadow-amber-500/20 hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-4 right-4 p-2 bg-amber-500/20 rounded-lg text-amber-400">✅</div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Terminées</div>
              <div className="text-4xl font-extrabold tracking-tight text-slate-100">
                {elections.filter(e => e.status === 'closed' || e.status === 'tallied').length}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - Vibrant Gradient */}
        <div className="mb-10">
          <button 
            onClick={handleCreateElection}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            <span className="mr-2 text-xl">+</span> Créer une nouvelle élection
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 font-medium flex items-center shadow-sm">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        {/* Elections List - Floating Rows */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-700 border-t-indigo-500 mb-4"></div>
            <p className="text-slate-400 font-medium">Chargement des élections...</p>
          </div>
          ) : elections.length === 0 ? (
          <EmptyElections onCreate={handleCreateElection} />
        ) : (
          <div className="space-y-4">
            {elections.map((election) => (
              <div 
                key={election.id} 
                className="group card-glass p-6 shadow-xl hover:shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-200 relative overflow-hidden"
              >
                {/* Left Accent Border */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    election.status === 'open' ? 'bg-emerald-500' :
                    election.status === 'draft' ? 'bg-slate-600' :
                    election.status === 'closed' ? 'bg-amber-500' :
                    'bg-blue-500'
                }`}></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {election.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        election.status === 'draft' ? 'bg-slate-700/50 text-slate-300 border-slate-600' :
                        election.status === 'open' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                        election.status === 'closed' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      }`}>
                        {getStatusLabel(election.status)}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-4 max-w-2xl line-clamp-1">
                      {election.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-lg">📅</span>
                        <span className="font-medium text-slate-300">
                          {new Date(election.start_date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-slate-600">→</span>
                        <span className="font-medium text-slate-300">
                          {new Date(election.end_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-lg">❓</span>
                        <span className="font-medium text-slate-300">{election.questions.length} questions</span>
                      </div>

                      {election.ballot_count !== undefined && (
                        <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-md border border-indigo-500/30">
                          <span className="font-bold">{election.ballot_count}</span>
                          <span className="font-medium text-xs uppercase">votes</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getNextStatus(election.status) && (
                      <button
                        onClick={() => handleUpdateStatus(election.id, getNextStatus(election.status)!)}
                        className="px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/30 font-semibold text-sm transition-colors"
                      >
                        {getNextStatusLabel(election.status)}
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/admin/election/${election.id}`)}
                      className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 text-slate-300 font-semibold text-sm hover:bg-slate-700/50 transition-all"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => handleDeleteElection(election.id, election.title)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
