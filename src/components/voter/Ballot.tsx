"use client";

import React, { useState } from "react";
import { useEncryptionPlaceholder } from "../hooks/useEncryptionPlaceholder";

type Question = {
  id: string;
  label: string;
  options: { id: string; title: string; subtitle?: string }[];
};

const demoQuestions: Question[] = [
  {
    id: "q1",
    label: "Quel laboratoire financez-vous ?",
    options: [
      { id: "lab-a", title: "Laboratoire Atlas", subtitle: "IA appliquée" },
      { id: "lab-b", title: "Laboratoire Boreal", subtitle: "Énergie propre" },
      { id: "lab-c", title: "Laboratoire Cosmo", subtitle: "Sciences spatiales" },
    ],
  },
  {
    id: "q2",
    label: "Priorité d'investissement ?",
    options: [
      { id: "infra", title: "Infrastructure", subtitle: "Serveurs et réseau" },
      { id: "talent", title: "Recrutement", subtitle: "Chercheurs & ingénieurs" },
      { id: "open", title: "Open Science", subtitle: "Données ouvertes" },
    ],
  },
];

export function Ballot() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>("");
  const { encryptBallot } = useEncryptionPlaceholder();

  const select = (qid: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: optionId }));
  };

  const submit = async () => {
    setStatus("Chiffrement du bulletin...");
    const payload = { answers, timestamp: new Date().toISOString() };
    const result = await encryptBallot(payload);
    setStatus(`Bulletin enregistré (simulation). Code de suivi : ${result.trackingCode}`);
  };

  return (
    <section id="votant" className="space-y-6">
      <div>
        <p className="text-sm text-slate-400">Votant</p>
        <h2 className="text-2xl font-semibold text-white">Bulletin numérique</h2>
        <p className="text-sm text-slate-300">Sélectionnez vos options. Le chiffrement se fait localement (placeholder).</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {demoQuestions.map((q) => (
          <article key={q.id} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{q.label}</h3>
                <p className="text-sm text-slate-400">Choisissez une option</p>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">Question</span>
            </div>
            <div className="space-y-2">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => select(q.id, opt.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring focus-visible:ring-cyan-400 ${
                      selected
                        ? "border-cyan-400 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/20"
                        : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/60 hover:bg-white/10"
                    }`}
                    aria-pressed={selected}
                    aria-label={`${q.label} - ${opt.title}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold">{opt.title}</p>
                        {opt.subtitle && <p className="text-sm text-slate-400">{opt.subtitle}</p>}
                      </div>
                      <span className={`h-5 w-5 rounded-full border ${selected ? "border-cyan-300 bg-cyan-400/40" : "border-white/20"}`} aria-hidden />
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:scale-[1.01] focus:outline-none focus-visible:ring focus-visible:ring-cyan-400"
        >
          Soumettre le bulletin
        </button>
        <p className="text-sm text-slate-300" role="status" aria-live="polite">
          {status || "Aucune donnée envoyée. Le chiffrement reste local."}
        </p>
      </div>
    </section>
  );
}
