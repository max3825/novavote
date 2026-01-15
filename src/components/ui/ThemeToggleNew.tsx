'use client'

import { useTheme } from '@/lib/useTheme'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 hover:scale-110"
      title={theme === 'midnight' ? 'Passer au thème clair (Civic)' : 'Passer au thème sombre (Midnight)'}
      aria-label={`Passer du thème ${theme} au thème ${theme === 'midnight' ? 'Civic' : 'Midnight'}`}
      style={{
        background: theme === 'midnight' 
          ? 'rgba(99, 102, 241, 0.1)' 
          : 'rgba(16, 185, 129, 0.1)',
        border: theme === 'midnight'
          ? '1px solid rgba(99, 102, 241, 0.3)'
          : '1px solid rgba(16, 185, 129, 0.3)',
      }}
    >
      {theme === 'midnight' ? (
        <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM7 11a1 1 0 100-2 1 1 0 000 2zm-4.536.464a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm10.607 2.121a1 1 0 11-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM17 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )}
      {isHovered && (
        <span className={`absolute top-full mt-2 px-2 py-1 rounded text-xs whitespace-nowrap ${
          theme === 'midnight' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-emerald-600 text-white'
        }`}>
          {theme === 'midnight' ? 'Civic' : 'Midnight'}
        </span>
      )}
    </button>
  )
}
