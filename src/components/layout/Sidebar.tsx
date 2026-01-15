'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Sidebar.tsx - PRODUCTION GRADE v2.0
 *
 * Navigation épurée et fonctionnelle:
 * ✅ Dashboard - Vue d'ensemble
 * ✅ Créer Élection - Action principale
 * ✅ Élections - Gestion complète
 * ✅ Responsive et sticky (sans hardcode)
 * ✅ WCAG compliant avec landmarks
 */

interface NavItem {
  name: string
  href: string
  icon: string
}

// Navigation épurée: uniquement les sections de navigation,
// suppression du bouton d'action "Créer Élection" de la sidebar.
const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Élections', href: '/admin/elections', icon: '🗳️' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-64 bg-slate-50 dark:bg-slate-900/40 border-r border-slate-200 dark:border-slate-800 h-full flex flex-col sticky top-[var(--header-height,73px)]"
      aria-label="Navigation principale"
    >
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isActive
                  ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/50'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-xl" aria-hidden>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Info */}
      <div className="px-4 py-6 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          © 2026 NovaVote
        </p>
      </div>
    </aside>
  )
}
