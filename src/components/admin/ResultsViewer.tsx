'use client'

import { Card } from '@/components/ui/Card'
import { ResultsChart } from '@/components/ui/ResultsChart'
import { EmptyResults } from '@/components/ui/EmptyState'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'

interface ResultsViewerProps {
  stats: any
  election: any
}

export default function ResultsViewer({ stats, election }: ResultsViewerProps) {
  const [isExporting, setIsExporting] = useState(false)

  if (!stats?.results_by_question) {
    return <EmptyResults />
  }

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setIsExporting(true)
      const response = await fetch(
        `/api/elections/${election.id}/export?format=${format}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `election_${election.id}_results.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'single':
        return '📍 Choix unique'
      case 'multiple':
        return '☑️ Choix multiple'
      case 'ranking':
        return '🏆 Classement'
      default:
        return type
    }
  }

  const getBarColor = (percentage: number) => {
    if (percentage >= 60) return 'from-green-500 to-green-600'
    if (percentage >= 40) return 'from-blue-500 to-blue-600'
    if (percentage >= 20) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Export buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          📥 Exporter CSV
        </Button>
        <Button
          onClick={() => handleExport('json')}
          disabled={isExporting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          📥 Exporter JSON
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-800 p-6 text-center">
          <div className="text-4xl font-bold text-blue-400">
            {stats.votes_received}
          </div>
          <div className="text-sm text-slate-400 mt-2">Votes reçus</div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 text-center">
          <div className="text-4xl font-bold text-purple-400">
            {stats.voters_invited}
          </div>
          <div className="text-sm text-slate-400 mt-2">Électeurs invités</div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 text-center">
          <div className="text-4xl font-bold text-green-400">
            {stats.participation_rate.toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400 mt-2">Participation</div>
        </Card>
      </div>

      {stats.results_by_question.map((result: any, idx: number) => {
        const isRanking = result.type === 'ranking'
        
        return (
          <Card key={idx} className="bg-slate-900/50 border-slate-800 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-white">
                  {idx + 1}. {result.question}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                  {getTypeLabel(result.type)}
                </span>
              </div>
              {isRanking && (
                <div className="mt-3 bg-amber-900/20 border border-amber-700/50 rounded-lg p-3">
                  <p className="text-sm text-amber-200">
                    🏆 <strong>Comptage :</strong> Seuls les <strong>premiers choix</strong> sont comptabilisés (scrutin majoritaire)
                  </p>
                </div>
              )}
            </div>

            {isRanking ? (
              // AFFICHAGE SPÉCIAL POUR CLASSEMENT (RANKING)
              <div className="space-y-3">
                {result.options
                  .slice()
                  .sort((a: any, b: any) => b.votes - a.votes)
                  .map((option: any, oIdx: number) => {
                    const position = oIdx + 1
                    const medal = oIdx === 0 ? '🥇' : oIdx === 1 ? '🥈' : oIdx === 2 ? '🥉' : `${position}.`
                    const bgColor = oIdx === 0 ? 'bg-yellow-500/10 border-yellow-500/30' :
                                    oIdx === 1 ? 'bg-slate-400/10 border-slate-400/30' :
                                    oIdx === 2 ? 'bg-orange-500/10 border-orange-500/30' :
                                    'bg-slate-800/50 border-slate-700'
                    const textColor = oIdx === 0 ? 'text-yellow-300' :
                                      oIdx === 1 ? 'text-slate-300' :
                                      oIdx === 2 ? 'text-orange-300' :
                                      'text-slate-400'

                    return (
                      <div key={oIdx} className={`flex items-center justify-between border rounded-lg px-5 py-4 ${bgColor} hover:scale-[1.01] transition-all`}>
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{medal}</span>
                          <div>
                            <span className="text-slate-100 font-bold text-lg">{option.option}</span>
                            <p className="text-xs text-slate-500 mt-0.5">#{position} au classement</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${textColor}`}>
                            {option.votes}
                          </div>
                          <p className="text-xs text-slate-500">
                            {option.votes === 0 ? 'aucun' : option.votes === 1 ? '1er choix' : '1ers choix'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              // AFFICHAGE CLASSIQUE POUR SINGLE ET MULTIPLE
              <div className="space-y-4">
                {result.options.map((option: any, oIdx: number) => {
                  const maxVotes = Math.max(...result.options.map((o: any) => o.votes), 1)
                  const barWidth = (option.votes / maxVotes) * 100

                  return (
                    <div key={oIdx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-slate-100 font-medium">{option.option}</p>
                        </div>
                        <div className="flex items-center gap-4 ml-4 text-right">
                          <div className="text-sm text-slate-400">
                            <span className="text-xl font-bold text-white">{option.votes}</span>
                            <span className="text-slate-500 ml-1">vote{option.votes !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-300 w-12">
                            {option.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getBarColor(
                            option.percentage
                          )} transition-all duration-300`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-400">
                Total pour cette question: {result.options.reduce((sum: number, o: any) => sum + o.votes, 0)} vote{result.options.reduce((sum: number, o: any) => sum + o.votes, 0) !== 1 ? 's' : ''}
              </p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
