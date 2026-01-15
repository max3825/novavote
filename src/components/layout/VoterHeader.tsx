'use client';

import Link from 'next/link';

/**
 * Voter Header Component
 * Minimaliste, juste logo + branding
 * Pas de menu utilisateur
 */

export function VoterHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/40">
            <span className="text-2xl font-bold text-white">🗳</span>
          </div>
          <div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wide">
              Vote sécurisé
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">NovaVote</p>
          </div>
        </Link>

        {/* Security Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg">
          <span className="text-sm text-green-700 dark:text-green-300 font-semibold">✓ Sécurisé</span>
        </div>
      </div>
    </header>
  );
}
