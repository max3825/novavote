'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient, type Election, type ElectionStats } from '@/lib/api-client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ResultsViewer from './ResultsViewer'

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message
  }
  if (typeof err === 'string') {
    return err
  }
  return 'Erreur inattendue'
}

export default function ElectionDetails() {
  const router = useRouter()
  const params = useParams()
  const electionId = params?.id as string

  const [election, setElection] = useState<Election | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voterEmail, setVoterEmail] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [stats, setStats] = useState<ElectionStats | null>(null)

  useEffect(() => {
    if (electionId) {
      loadElection()
      loadStats()
    }
  }, [electionId])

  const loadElection = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getElection(electionId);
      setElection(data as Election);
    } catch (err: unknown) {
      const message = getErrorMessage(err)
      if (message.includes('401')) {
        router.push('/login')
      } else {
        setError(message || 'Erreur chargement élection')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await apiClient.getElectionStats(electionId)
      setStats(data)
    } catch (err: unknown) {
      console.error('Failed to load stats:', getErrorMessage(err))
    }
  }

  const handleSendMagicLink = async () => {
    if (!voterEmail || !electionId) return
    try {
      setSendingEmail(true)
      await apiClient.sendMagicLink(electionId, voterEmail)
      alert(`Magic link envoyé à ${voterEmail}`)
      setVoterEmail('')
    } catch (err: unknown) {
      alert(`Erreur envoi email: ${getErrorMessage(err)}`)
    } finally {
      setSendingEmail(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    if (!electionId) return
    try {
      await apiClient.updateElectionStatus(electionId, newStatus)
      await loadElection()
      await loadStats()
    } catch (err: unknown) {
      alert(`Erreur changement statut: ${getErrorMessage(err)}`)
    }
  }

  const handleDeleteElection = async () => {
    if (!electionId || !election) return
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer l'élection "${election.title}" ? Cette action est irréversible.`)
    if (!confirmed) return

    try {
      await apiClient.deleteElection(electionId)
      alert('Élection supprimée avec succès')
      router.push('/admin')
    } catch (err: unknown) {
      alert(`Erreur suppression élection: ${getErrorMessage(err)}`)
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
      case 'draft': return 'Ouvrir l\'élection'
      case 'open': return 'Fermer l\'élection'
      case 'closed': return 'Décompter les votes'
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-slate-100 font-semibold text-lg">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="card-glass p-10 max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-3">Erreur</h2>
            <p className="text-slate-400 mb-8 font-medium">{error || 'Élection introuvable'}</p>
            <button
              onClick={() => router.push('/admin')}
              className="btn-primary"
            >
              Retour au dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header avec gradient */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10 shadow-lg shadow-indigo-500/5">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/admin')}
                className="mb-4 btn-secondary text-sm"
              >
                ← Retour au dashboard
              </button>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-5xl font-extrabold tracking-tight gradient-text">
                  {election.title}
                </h1>
                <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg ${election.status === 'draft' ? 'bg-slate-700/50 text-slate-300 border border-slate-600' :
                    election.status === 'open' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/30' :
                      election.status === 'closed' ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-orange-500/30' :
                        'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-blue-500/30'
                  }`}>
                  {getStatusLabel(election.status)}
                </span>
              </div>
              <p className="text-slate-400 text-lg font-medium">{election.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations générales */}
            <Card className="card-glass shadow-xl shadow-indigo-500/10 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/30">
                <h2 className="text-lg font-bold text-slate-100">📌 Informations Générales</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">ID Élection</span>
                    <span className="font-mono text-slate-300 text-sm break-all">{election.id}</span>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Créée le</span>
                    <span className="text-slate-100 font-medium">
                      {new Date(election.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                    <span className="block text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">Début</span>
                    <span className="text-indigo-300 font-bold">
                      {new Date(election.start_date).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                    <span className="block text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">Fin</span>
                    <span className="text-indigo-300 font-bold">
                      {new Date(election.end_date).toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Questions */}
            <Card className="card-glass shadow-xl shadow-indigo-500/10 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/30 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-100">❓ Questions et Options</h2>
                <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold">
                  {election.questions.length} Questions
                </span>
              </div>
              <div className="p-6 space-y-6">
                {election.questions.map((q, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-full"></div>
                    <div className="absolute left-[-5px] top-0 w-3 h-3 bg-indigo-500 rounded-full ring-4 ring-slate-800/50"></div>

                    <h3 className="text-lg font-bold text-slate-100 mb-3 block">
                      {q.question}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((option, optIdx) => (
                        <div key={optIdx} className="flex items-center px-4 py-3 bg-slate-800/30 border border-slate-700 rounded-lg text-slate-300 text-sm hover:border-indigo-500/50 hover:bg-slate-700/30 transition-colors">
                          <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 border border-slate-600 flex items-center justify-center text-xs mr-3 font-mono">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Clé publique - Card moderne lumineuse */}
            {election.public_key && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative card-glass overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-100">🔐 Cryptographie</h2>
                    <span className="px-3 py-1 rounded-full text-xs bg-indigo-600 text-white font-bold shadow-sm">RSA-2048</span>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-400 text-sm mb-4 font-medium">
                      Cette élection est sécurisée par cryptographie asymétrique. Voici la clé publique utilisée pour chiffrer les bulletins.
                    </p>
                    <pre className="p-4 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto shadow-inner">
                      {JSON.stringify(election.public_key, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Envoi des invitations */}
            {election.status === 'open' && (
              <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/30 rounded-xl overflow-hidden relative">
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

                <div className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">📧 Inviter des électeurs</h2>
                      <p className="text-indigo-100">Envoyez des liens de vote sécurisés magiques.</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      ✨
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="email@exemple.com"
                        value={voterEmail}
                        onChange={(e) => setVoterEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl 
                                  text-white placeholder-indigo-200/50 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all font-medium"
                      />
                      <span className="absolute left-4 top-4 text-indigo-200">✉️</span>
                    </div>

                    <Button
                      onClick={handleSendMagicLink}
                      disabled={!voterEmail || sendingEmail}
                      className="w-full py-4 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                      {sendingEmail ? 'Envoi en cours...' : 'Envoyer l\'invitation sécurisée →'}
                    </Button>

                    <p className="text-center text-xs text-indigo-200/80 mt-2">
                      🔒 Lien unique chiffré valable 15 minutes • Une seule utilisation possible
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Colonne actions */}
          <div className="space-y-6">

            {/* Statistiques - Highlight */}
            <Card className="card-glass border-none shadow-xl shadow-indigo-500/10 rounded-xl overflow-hidden ring-1 ring-slate-700">
              <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-700">
                <h2 className="text-lg font-bold text-slate-100">📊 Participation</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
                    <div className="text-4xl font-extrabold text-indigo-400 mb-1">
                      {stats?.votes_received ?? 0}
                    </div>
                    <div className="text-xs font-bold text-indigo-400/70 uppercase tracking-wide">Votes</div>
                  </div>
                  <div className="text-center p-4 bg-violet-500/20 border border-violet-500/30 rounded-xl">
                    <div className="text-4xl font-extrabold text-violet-400 mb-1">
                      {stats?.voters_invited ?? 0}
                    </div>
                    <div className="text-xs font-bold text-violet-400/70 uppercase tracking-wide">Invités</div>
                  </div>
                </div>

                {stats && stats.voters_invited > 0 && (
                  <div className="relative pt-2">
                    <div className="flex mb-2 items-center justify-between text-xs font-bold uppercase tracking-wide">
                      <span className="text-slate-400">Taux de participation</span>
                      <span className="text-emerald-400">{stats.participation_rate.toFixed(1)}%</span>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-800/50">
                      <div
                        style={{ width: `${stats.participation_rate}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-400 to-teal-500"
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions Panel */}
            <Card className="card-glass shadow-xl shadow-indigo-500/10 rounded-xl overflow-hidden px-6 py-8">
              <h2 className="text-xl font-bold text-slate-100 mb-6">Mener l'élection</h2>
              <div className="space-y-4">
                {getNextStatus(election.status) && (
                  <Button
                    onClick={() => handleUpdateStatus(getNextStatus(election.status)!)}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                  >
                    {getNextStatusLabel(election.status)}
                  </Button>
                )}

                {election.status === 'open' && (
                  <Button
                    onClick={() => {
                      const voteUrl = `${window.location.origin}/vote/${election.id}`
                      navigator.clipboard.writeText(voteUrl)
                      alert('Lien de vote copié !')
                    }}
                    className="w-full py-3 bg-slate-800/50 border-2 border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 font-bold rounded-xl transition-all"
                  >
                    📋 Copier le lien public
                  </Button>
                )}

                <div className="h-px bg-slate-700 my-4"></div>

                <Button
                  onClick={handleDeleteElection}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 font-bold rounded-xl transition-all"
                >
                  🗑️ Supprimer l'élection
                </Button>
              </div>
            </Card>

          </div>
        </div>

        {/* Résultats détaillés */}
        {election.status === 'tallied' && stats && (
          <div className="mt-10">
            <ResultsViewer stats={stats} election={election} />
          </div>
        )}
      </div>
    </div>
  )
}
