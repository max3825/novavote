'use client'

import { useTheme } from '@/components/providers/SimpleThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme()
  const isDark = theme === 'dark'

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-100 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors"
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      type="button"
    >
      {isDark ? (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
      <span className="hidden sm:inline">
        {isDark ? 'Clair' : 'Sombre'}
      </span>
    </button>
  )
}
