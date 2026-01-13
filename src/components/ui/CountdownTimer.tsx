'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  endDate: string
  onComplete?: () => void
}

export function CountdownTimer({ endDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      } else {
        onComplete?.()
        return null
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [endDate, onComplete])

  if (!timeLeft) {
    return (
      <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400 font-semibold">⏰ Élection terminée</p>
      </div>
    )
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 shadow-lg flex items-center justify-center">
          <span className="text-3xl font-bold text-white">{value}</span>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl blur opacity-30 animate-pulse"></div>
      </div>
      <span className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
    </div>
  )

  return (
    <div className="p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Temps restant
        </h3>
      </div>
      <div className="flex justify-center gap-4">
        <TimeUnit value={timeLeft.days} label="Jours" />
        <TimeUnit value={timeLeft.hours} label="Heures" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Secondes" />
      </div>
    </div>
  )
}
