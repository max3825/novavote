"use client";

import React from "react";
import CreateElectionWizard from "./CreateElectionWizard";

/**
 * Dashboard.tsx - VERSION NETTOYÉE
 * Suppression des boutons placeholders non fonctionnels
 * Garde uniquement le wizard de création d'élection
 */
export function Dashboard() {
  return (
    <div className="space-y-8">
      <header className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 shadow-sm">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Admin • Contrôle total</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tableau de bord</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Créez et pilotez vos élections avec une UX guidée et vérifiable.</p>
        </div>
      </header>

      <CreateElectionWizard />
    </div>
  );
}
