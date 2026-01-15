'use client'

import { useState } from 'react'
import { useTheme } from '@/lib/useTheme'

export interface BallotSubmissionAnimationProps {
  isSubmitting: boolean
  step: 'idle' | 'sealing' | 'sending' | 'confirmed'
  receiptCode: string | null
  onAnimationComplete?: () => void
}

export function BallotSubmissionAnimation({
  isSubmitting,
  step,
  receiptCode,
  onAnimationComplete
}: BallotSubmissionAnimationProps) {
  const { theme } = useTheme()

  const messages = {
    idle: 'Prêt à voter',
    sealing: 'Scellement de votre bulletin...',
    sending: 'Envoi vers l\'urne électorale...',
    confirmed: 'Bulletin enregistré !'
  }

  const accentColor = theme === 'midnight' 
    ? 'text-indigo-400' 
    : 'text-emerald-600'

  const bgColor = theme === 'midnight'
    ? 'bg-slate-800/50'
    : 'bg-emerald-50'

  const borderColor = theme === 'midnight'
    ? 'border-indigo-500/30'
    : 'border-emerald-500/30'

  return (
    <div className={`space-y-6 p-8 rounded-2xl ${bgColor} border ${borderColor}`}>
      {/* Animation Container */}
      <div className="flex justify-center items-center min-h-[200px] relative">
        {/* Ballot Box (urne) - Always visible */}
        <div className="absolute right-0 text-6xl drop-shadow-lg">
          🗳️
        </div>

        {/* Envelope Animation */}
        {isSubmitting && (
          <>
            {/* Envelope Sealing Phase */}
            {step === 'sealing' && (
              <div className="animate-seal">
                <span className="text-6xl drop-shadow-lg">✉️→🔒</span>
              </div>
            )}

            {/* Envelope Sliding to Ballot Box */}
            {step === 'sending' && (
              <div className="animate-slide-to-urn">
                <span className="text-6xl drop-shadow-lg">🔒</span>
              </div>
            )}

            {/* Confirmed State */}
            {step === 'confirmed' && (
              <div className="animate-fade-in">
                <span className="text-6xl drop-shadow-lg">✅</span>
              </div>
            )}
          </>
        )}

        {/* Idle State */}
        {!isSubmitting && step === 'idle' && (
          <span className="text-6xl drop-shadow-lg">✉️</span>
        )}
      </div>

      {/* Status Message */}
      <div className="text-center space-y-2">
        <p className={`text-lg font-semibold ${accentColor}`}>
          {messages[step]}
        </p>

        {/* Receipt Code Display */}
        {step === 'confirmed' && receiptCode && (
          <div className={`p-4 rounded-lg ${theme === 'midnight' ? 'bg-slate-700/50' : 'bg-white'} border ${borderColor}`}>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Reçu de vote
            </p>
            <p className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100 break-all">
              {receiptCode}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(receiptCode)
                // Toast notification would go here
              }}
              className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                theme === 'midnight'
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              Copier le reçu
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        {isSubmitting && (
          <div className="flex justify-center gap-2 mt-4">
            <div className={`w-2 h-2 rounded-full ${
              ['sealing', 'sending', 'confirmed'].includes(step)
                ? theme === 'midnight' ? 'bg-indigo-500' : 'bg-emerald-600'
                : theme === 'midnight' ? 'bg-slate-600' : 'bg-slate-300'
            } transition-colors`} />
            <div className={`w-2 h-2 rounded-full ${
              ['sending', 'confirmed'].includes(step)
                ? theme === 'midnight' ? 'bg-indigo-500' : 'bg-emerald-600'
                : theme === 'midnight' ? 'bg-slate-600' : 'bg-slate-300'
            } transition-colors`} />
            <div className={`w-2 h-2 rounded-full ${
              step === 'confirmed'
                ? theme === 'midnight' ? 'bg-indigo-500' : 'bg-emerald-600'
                : theme === 'midnight' ? 'bg-slate-600' : 'bg-slate-300'
            } transition-colors`} />
          </div>
        )}
      </div>
    </div>
  )
}
