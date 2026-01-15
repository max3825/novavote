'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

/**
 * Header.tsx - PRODUCTION GRADE v2.0
 * 
 * Fixes & Improvements:
 * ✅ Hydration Error pattern (isMounted)
 * ✅ Click-outside detection pour fermer le menu
 * ✅ Memory leak fix (event listener cleanup)
 * ✅ Espacement cohérent (gap-4 entre éléments, gap-6 nav)
 * ✅ WCAG compliant (aria-labels, keyboard nav)
 */

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Hydration fix + Auth check
  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('access_token')
    setIsLoggedIn(!!token)

    // Listen to auth changes
    const handleAuthChange = () => {
      const token = localStorage.getItem('access_token')
      setIsLoggedIn(!!token)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    window.addEventListener('storage', handleAuthChange)
    window.addEventListener('auth-change', handleAuthChange)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener('auth-change', handleAuthChange)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    // Nettoyage complet
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_email')
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax'
    setIsLoggedIn(false)
    setShowUserMenu(false)

    // Hard redirect
    window.location.href = '/'
  }

  // Render null pendant l'hydration (évite décalage)
  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          aria-label="Accueil NovaVote"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/40">
            <span className="text-2xl font-bold text-white" aria-hidden>
              🗳
            </span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
            NovaVote
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Dashboard Button */}
              <Link
                href="/admin"
                className="rounded-lg px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:shadow-lg"
              >
                📊 Dashboard
              </Link>

              {/* Divider */}
              <div
                className="h-6 w-px bg-slate-300 dark:bg-slate-700"
                role="separator"
                aria-hidden
              ></div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-sm hover:scale-105 transition-transform shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                  aria-label="Menu utilisateur"
                  aria-expanded={showUserMenu}
                  aria-haspopup="menu"
                >
                  👤
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-2 z-50"
                    role="menu"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:bg-red-50 dark:focus:bg-red-900/20"
                      role="menuitem"
                    >
                      🚪 Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Divider */}
              <div
                className="h-6 w-px bg-slate-300 dark:bg-slate-700"
                role="separator"
                aria-hidden
              ></div>

              {/* Auth Buttons: routes distinctes */}
              <div className="flex items-center gap-3">
                {/* Se connecter → style ghost/outline */}
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  🔑 Se connecter
                </Link>

                {/* Créer un compte → style primary */}
                <Link
                  href="/register"
                  className="rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  ✨ Créer un compte
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
