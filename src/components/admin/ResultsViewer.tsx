'use client'

import { Card } from '@/components/ui/Card'
import { ResultsChart } from '@/components/ui/ResultsChart'
import { EmptyResults } from '@/components/ui/EmptyState'
import { useMemo } from 'react'

interface ResultsViewerProps {
  stats: any
  election: any
}

export default function ResultsViewer({ stats, election }: ResultsViewerProps) {
  if (!stats?.results_by_question) {
    return <EmptyResults />
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

      {stats.results_by_question.map((result: any, idx: number) => (
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
          </div>

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

          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400">
              Total pour cette question: {result.options.reduce((sum: number, o: any) => sum + o.votes, 0)} vote{result.options.reduce((sum: number, o: any) => sum + o.votes, 0) !== 1 ? 's' : ''}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
