"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

interface Stats {
  election_id: string;
  votes_received: number;
  voters_invited: number;
  participation_rate: number;
  results_by_question?: Array<{
    question: string;
    type: string;
    options: Array<{ option: string; votes: number; percentage: number }>;
  }>;
}

interface Election {
  id: string;
  title: string;
  status: string;
}

export default function ResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const electionId = params?.id as string;
  const trackingCode = searchParams.get("tracking") || undefined;

  const [stats, setStats] = useState<Stats | null>(null);
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!electionId) return;
      setLoading(true);
      setError(null);
      try {
        const [electionResp, statsResp] = await Promise.all([
          apiClient.getElection(electionId) as Promise<Election>,
          apiClient.getElectionStats(electionId) as Promise<Stats>,
        ]);
        setElection({ id: electionResp.id, title: electionResp.title, status: electionResp.status });
        setStats(statsResp);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Impossible de charger les résultats";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [electionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-3xl">⏳</div>
          <p className="text-slate-400">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  if (error || !stats || !election) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="text-4xl">❌</div>
          <h1 className="text-2xl font-bold">Lien invalide ou résultats indisponibles</h1>
          <p className="text-slate-400">{error || "Merci de vérifier l'URL ou de réessayer."}</p>
        </div>
      </div>
    );
  }

  const participationText = `${stats.votes_received} / ${stats.voters_invited || 0}`;
  const status = election.status?.toLowerCase();
  const isFinished = status === "closed" || status === "tallied";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Résultats</p>
            <h1 className="text-2xl font-bold text-white">{election.title}</h1>
            <p className="text-slate-400 text-sm mt-1">État : {election.status}</p>
          </div>
          {trackingCode && (
            <div className="bg-slate-800/70 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200">
              Code de suivi : <span className="font-mono text-cyan-300">{trackingCode}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Participation</p>
            <p className="text-2xl font-bold text-white mt-1">{participationText}</p>
            <p className="text-xs text-slate-500">Taux : {stats.participation_rate.toFixed(1)}%</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">État</p>
            <p className="text-lg font-semibold text-white mt-1">{election.status}</p>
            {!isFinished && (
              <p className="text-xs text-amber-400 mt-1">Résultats complets disponibles à la clôture.</p>
            )}
          </div>
          {trackingCode ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm">Suivi du bulletin</p>
              <p className="text-sm text-white mt-1">
                Conservez ce code pour vérifier votre vote une fois l'élection terminée.
              </p>
              <Link
                href={`/verify?tracking=${trackingCode}`}
                className="text-cyan-300 text-sm mt-2 inline-flex items-center hover:text-cyan-200"
              >
                Vérifier mon bulletin →
              </Link>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm">Suivi du bulletin</p>
              <p className="text-sm text-white mt-1">
                Aucun code fourni. Gardez le mail de confirmation pour retrouver votre code.
              </p>
            </div>
          )}
        </div>

        {!isFinished && (
          <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Election en cours</h2>
            <p className="text-slate-300">
              Les résultats détaillés seront disponibles à la clôture. Vous pouvez déjà suivre la participation
              de manière anonyme.
            </p>
          </div>
        )}

        {isFinished && stats.results_by_question && stats.results_by_question.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Résultats</h2>
            <div className="space-y-4">
              {stats.results_by_question.map((q, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold text-white">Question {idx + 1} : {q.question}</p>
                    <span className="text-xs text-slate-400 uppercase">{q.type}</span>
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, oidx) => (
                      <div key={oidx} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
                        <span className="text-slate-100">{opt.option}</span>
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                          <span>{opt.votes} vote(s)</span>
                          <span className="text-cyan-300">{opt.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isFinished && (!stats.results_by_question || stats.results_by_question.length === 0) && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-slate-300">
            Aucun résultat disponible pour le moment.
          </div>
        )}
      </main>
    </div>
  );
}
