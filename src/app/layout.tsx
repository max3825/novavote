import React from "react";
import "../styles/globals.css";
import { SimpleThemeProvider } from "@/components/providers/SimpleThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

export const metadata = {
  title: "E-vote Platform",
  description: "Secure, verifiable, and delightful e-voting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <SimpleThemeProvider>
          <ToastProvider />
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-20 border-b border-slate-700 bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-indigo-500/5">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/40" aria-hidden>
                    <span className="text-2xl font-bold text-white">🗳</span>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide">Plateforme vérifiable</p>
                    <p className="text-xl font-bold text-slate-100">NovaVote</p>
                  </div>
                </div>
                <nav className="flex items-center gap-2 text-sm font-semibold">
                  <a className="rounded-xl px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-all" href="/admin">Admin</a>
                  <a className="rounded-xl px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-all" href="/login">Se connecter</a>
                  <a className="rounded-xl px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-all" href="/">Accueil</a>
                </nav>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-slate-700 bg-slate-900/80 backdrop-blur-sm py-8 text-center">
              <p className="text-slate-400 font-semibold">Conçu pour la transparence, la vérifiabilité et une UX moderne.</p>
              <p className="text-slate-500 text-sm mt-2">© 2026 NovaVote • Open Source</p>
            </footer>
          </div>
        </SimpleThemeProvider>
      </body>
    </html>
  );
}
