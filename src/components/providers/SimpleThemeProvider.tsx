'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function SimpleThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Récupérer le thème sauvegardé (compat app-theme + legacy theme)
    const saved = localStorage.getItem('theme') as Theme | null
    const legacyAppTheme = localStorage.getItem('app-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const initialTheme: Theme = saved
      ? saved
      : legacyAppTheme === 'civic'
        ? 'light'
        : legacyAppTheme === 'midnight'
          ? 'dark'
          : prefersDark
            ? 'dark'
            : 'light'

    setThemeState(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    // Compatibilité avec l'ancien toggle (midnight/civic)
    localStorage.setItem('app-theme', newTheme === 'dark' ? 'midnight' : 'civic')
    applyTheme(newTheme)
  }

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement
    html.classList.remove('midnight', 'civic')

    if (newTheme === 'dark') {
      html.classList.add('dark', 'midnight')
    } else {
      html.classList.remove('dark')
      html.classList.add('civic')
    }
  }

  // Toujours rendre pour éviter les erreurs d'hydratation
  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    // Retourner une valeur par défaut au lieu de throw pendant l'initialisation
    return { theme: 'dark' as Theme, setTheme: () => {}, mounted: false }
  }
  return context
}
