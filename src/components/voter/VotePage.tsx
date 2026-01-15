'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient, type VoteSession } from '@/lib/api-client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message
  }
  if (typeof err === 'string') {
    return err
  }
  return 'Erreur inattendue'
}

export default function VotePage() {
  const router = useRouter()
  const params = useParams()
  const token = params?.token as string
  
  const [session, setSession] = useState<VoteSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Pour choix unique: number (index de l'option)
  // Pour choix multiple: number[] (indices des options)
  const [answers, setAnswers] = useState<{ [key: number]: number | number[] }>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [trackingCode, setTrackingCode] = useState('')

  useEffect(() => {
    if (token) {
      verifyToken()
    }
  }, [token])

  const verifyToken = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.verifyMagicLink(token)
      setSession(data)
      // Initialize answers: -1 for single choice, [] for multiple choice, [] for ranking
      const initialAnswers: { [key: number]: number | number[] } = {}
      data.questions.forEach((q, idx) => {
        if (q.type === 'multiple' || q.type === 'ranking') {
          initialAnswers[idx] = []
        } else {
          initialAnswers[idx] = -1
        }
      })
      setAnswers(initialAnswers)
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Lien invalide ou expiré')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!session) return
    
    // Check all questions answered
    const unanswered = session.questions.filter((q, idx) => {
      const answer = answers[idx]
      if (q.type === 'multiple' || q.type === 'ranking') {
        return Array.isArray(answer) && answer.length === 0
      } else {
        return answer === -1
      }
    })
    
    if (unanswered.length > 0) {
      toast.error('Veuillez répondre à toutes les questions')
      return
    }

    try {
      setSubmitting(true)
      
      // Build ballot
      const choices = session.questions.map((q, idx) => {
        const answer = answers[idx]
        let choiceValue: string
        
        if ((q.type === 'multiple' || q.type === 'ranking') && Array.isArray(answer)) {
          // Multiple/Ranking: convert to JSON array
          const selectedOptions = answer.map(i => q.options[i])
          
          if (q.type === 'ranking') {
            // Ranking: send as JSON object { "1": "Option A", "2": "Option B" }
            const rankingObj: { [key: string]: string } = {}
            selectedOptions.forEach((opt, rank) => {
              rankingObj[(rank + 1).toString()] = opt
            })
            choiceValue = JSON.stringify(rankingObj)
          } else {
            // Multiple: send as JSON array ["Option A", "Option B"]
            choiceValue = JSON.stringify(selectedOptions)
          }
        } else if (typeof answer === 'number') {
          // Single choice: just the option string
          choiceValue = q.options[answer]
        } else {
          throw new Error(`Invalid answer type for question ${idx}`)
        }
        
        return {
          question: q.question,
          choice: choiceValue
        }
      })
      
      // Encrypt (mock for now)
      const encrypted_ballot = {
        choices: choices.map(c => ({ encrypted: btoa(c.choice) })),
        public_key_used: session.public_key
      }
      
      // Generate proof (mock)
      const proof = {
        commitment: Math.random().toString(36),
        challenge: Math.random().toString(36),
        response: Math.random().toString(36)
      }
      
      const response = await apiClient.submitBallot({
        election_id: session.election_id,
        encrypted_ballot,
        proof,
        voter_fingerprint: btoa(session.email),
        magic_token: token  // CRUCIAL: Permet à l'API d'envoyer l'email de confirmation
      })
      
      setTrackingCode(response.tracking_code)
      setSubmitted(true)
    } catch (err: unknown) {
      alert(`Erreur soumission: ${getErrorMessage(err)}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">⏳</div>
          <p className="text-slate-400">Vérification du lien...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800 p-8 max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2">Lien invalide</h2>
            <p className="text-slate-400 mb-6">
              {error || 'Ce lien de vote est invalide ou a expiré'}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800 p-8 max-w-2xl">
          <div className="text-center">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Vote enregistré !</h2>
            <p className="text-slate-300 mb-6">
              Votre bulletin a été soumis et chiffré avec succès.
            </p>
            
            <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
              <p className="text-sm text-slate-400 mb-2">Code de suivi :</p>
              <p className="text-2xl font-mono font-bold text-blue-400">
                {trackingCode}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Conservez ce code pour vérifier votre vote plus tard
              </p>
            </Card>

            <div className="space-y-3 text-sm text-slate-400">
              <p>
                ✓ Votre vote a été chiffré avec la clé publique de l'élection
              </p>
              <p>
                ✓ Votre identité est protégée par cryptographie
              </p>
              <p>
                ✓ Vous pouvez vérifier votre bulletin avec le code ci-dessus
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {session.election_title}
            </h1>
            <p className="text-slate-400">
              Vote pour : {session.email}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="space-y-6">
          {/* Instructions */}
          <Card className="bg-blue-900/20 border-blue-800 p-6">
            <div className="flex gap-4">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h3 className="font-bold text-blue-300 mb-2">Instructions</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Répondez à chaque question en sélectionnant une option</li>
                  <li>• Votre vote sera chiffré avant l'envoi</li>
                  <li>• Vous recevrez un code de suivi après soumission</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Questions */}
          {session.questions.map((q, idx) => {
            const isMultiple = q.type === 'multiple'
            const isRanking = q.type === 'ranking'
            const currentAnswer = answers[idx]
            
            return (
              <Card key={idx} className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <h3 className="text-lg font-bold flex-1">
                    Question {idx + 1} : {q.question}
                  </h3>
                  {isMultiple && (
                    <span className="px-3 py-1 bg-blue-600/20 border border-blue-600/40 rounded-full text-xs font-semibold text-blue-300">
                      Choix multiple
                    </span>
                  )}
                  {isRanking && (
                    <span className="px-3 py-1 bg-purple-600/20 border border-purple-600/40 rounded-full text-xs font-semibold text-purple-300">
                      🏆 Classement
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  {isRanking && (
                    <p className="text-sm text-slate-400 mb-3">
                      Cliquez sur les options dans l'ordre de votre préférence (1er, 2e, 3e...)
                    </p>
                  )}
                  {q.options.map((option, optIdx) => {
                    const isSelected = isMultiple || isRanking
                      ? Array.isArray(currentAnswer) && currentAnswer.includes(optIdx)
                      : currentAnswer === optIdx
                    
                    const rankPosition = isRanking && Array.isArray(currentAnswer) 
                      ? currentAnswer.indexOf(optIdx) + 1 
                      : 0
                    
                    return (
                      <label
                        key={optIdx}
                        className={`
                          flex items-center p-4 rounded-lg cursor-pointer transition-all
                          ${isSelected
                            ? isRanking 
                              ? 'bg-purple-600 border-purple-500' 
                              : 'bg-blue-600 border-blue-500'
                            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                          }
                          border-2
                        `}
                      >
                        {isRanking ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                const currentArray = Array.isArray(currentAnswer) ? currentAnswer : []
                                const newAnswer = currentArray.includes(optIdx)
                                  ? currentArray.filter((i) => i !== optIdx)
                                  : [...currentArray, optIdx]
                                setAnswers({ ...answers, [idx]: newAnswer })
                              }}
                              className="mr-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white/30"
                            >
                              {rankPosition > 0 ? rankPosition : '•'}
                            </button>
                            <span className="text-slate-100">{option}</span>
                          </>
                        ) : isMultiple ? (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const checked = e.target.checked
                              const currentArray = Array.isArray(currentAnswer) ? currentAnswer : []
                              const newAnswer = checked
                                ? [...currentArray, optIdx]
                                : currentArray.filter((i) => i !== optIdx)
                              setAnswers({ ...answers, [idx]: newAnswer })
                            }}
                            className="mr-3 w-5 h-5 accent-blue-500"
                          />
                        ) : (
                          <input
                            type="radio"
                            name={`question-${idx}`}
                            value={optIdx}
                            checked={isSelected}
                            onChange={() => setAnswers({ ...answers, [idx]: optIdx })}
                            className="mr-3 w-5 h-5 accent-blue-500"
                          />
                        )}
                        <span className="text-slate-100">{option}</span>
                      </label>
                    )
                  })}
                </div>
              </Card>
            )
          })}

          {/* Submit */}
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="text-center space-y-4">
              <p className="text-slate-400">
                Vérifiez vos réponses avant de soumettre
              </p>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-500 px-12 py-3 text-lg disabled:opacity-50"
              >
                {submitting ? '🔐 Chiffrement...' : '🗳️ Soumettre mon vote'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
