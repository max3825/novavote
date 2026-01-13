"use client";

import React from "react";
import CreateElectionWizard from "./CreateElectionWizard";

export function Dashboard() {
  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-white/5 bg-slate-900/70 p-6 shadow-2xl shadow-black/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Admin • Contrôle total</p>
            <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
            <p className="text-sm text-slate-300">Créez et pilotez vos élections avec une UX guidée et vérifiable.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 focus:outline-none focus-visible:ring focus-visible:ring-cyan-400">
              Importer un modèle
            </button>
            <button className="rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.01] focus:outline-none focus-visible:ring focus-visible:ring-cyan-400">
              Nouvelle élection
            </button>
          </div>
        </div>
      </header>

      <CreateElectionWizard />
    </div>
  );
}
