'use client'

import { useTheme as useSimpleTheme } from '@/components/providers/SimpleThemeProvider'

export type Theme = 'midnight' | 'civic'

// Wrapper pour aligner l'ancien hook sur le provider centralisé
export function useTheme() {
  const { theme, setTheme, mounted } = useSimpleTheme()

  const mappedTheme: Theme = theme === 'dark' ? 'midnight' : 'civic'
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return { theme: mappedTheme, toggleTheme, mounted }
}
