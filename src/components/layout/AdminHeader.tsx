'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/**
 * Admin Header Component
 * Spécifique au tableau de bord admin
 * Contient logout et infos utilisateur
 */

export function AdminHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const email = localStorage.getItem('user_email');
    setIsLoggedIn(!!token);
    setUserEmail(email || 'Admin');

    const handleAuthChange = () => {
      const token = localStorage.getItem('access_token');
      const email = localStorage.getItem('user_email');
      setIsLoggedIn(!!token);
      setUserEmail(email || 'Admin');
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    // Nettoyage complet
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    
    // Supprimer le cookie côté client
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
    
    // Mise à jour locale
    setIsLoggedIn(false);
    setShowUserMenu(false);
    
    // HARD REDIRECT - Force la page à se recharger complètement
    // Cela garantit que le middleware verra l'absence de cookie et redirigera
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/admin"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/40">
            <span className="text-2xl font-bold text-white">🗳</span>
          </div>
          <div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wide">
              Admin
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">NovaVote</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {userEmail[0]?.toUpperCase() || 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {userEmail}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrateur</p>
              </div>
            </button>

            {/* Dropdown Menu - SIMPLIFIÉ */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  🚪 Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
