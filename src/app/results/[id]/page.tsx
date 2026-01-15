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
  const hasAnyVotes = stats.votes_received > 0;
  const canShowDetails = !!stats.results_by_question?.length && (isFinished || hasAnyVotes);

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
            <h2 className="text-xl font-bold text-white mb-2">Élection en cours</h2>
            <p className="text-slate-300">
              Les résultats détaillés seront disponibles à la clôture. Vous pouvez suivre la participation en temps réel.
            </p>
          </div>
        )}

        {isFinished && stats.results_by_question && stats.results_by_question.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Résultats {isFinished ? 'finalisés' : 'provisoires'}</h2>
              {!isFinished && (
                <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                  En cours
                </span>
              )}
            </div>
            <div className="space-y-6">
              {stats.results_by_question.map((q, idx) => {
                const questionType = q.type?.toLowerCase() || 'single';
                const questionHasVotes = q.options.some(opt => opt.votes > 0);
                
                return (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                    {/* En-tête de la question */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          Question {idx + 1} : {q.question}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                            questionType === 'single' ? 'bg-blue-500/20 text-blue-300' :
                            questionType === 'multiple' ? 'bg-purple-500/20 text-purple-300' :
                            questionType === 'ranking' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-slate-500/20 text-slate-300'
                          }`}>
                            {questionType === 'single' ? '⭕ Vote unique' :
                             questionType === 'multiple' ? '☑️ Choix multiple' :
                             questionType === 'ranking' ? '🏆 Classement' :
                             q.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Aucun vote */}
                    {!questionHasVotes && (
                      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                        <p className="text-slate-400 text-sm">
                          📭 Aucun vote enregistré pour cette question
                        </p>
                      </div>
                    )}
                    
                    {/* Visualisation selon le type */}
                    {questionHasVotes && (
                      <>
                        {/* VOTE UNIQUE (Single) → PIE CHART (Simulé avec barres circulaires) */}
                        {questionType === 'single' && (
                          <div className="space-y-2">
                            {q.options
                              .sort((a, b) => b.percentage - a.percentage)
                              .map((opt, oidx) => (
                              <div key={oidx} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-100 font-medium">{opt.option}</span>
                                  <span className="text-cyan-300 font-bold">{opt.percentage.toFixed(1)}%</span>
                                </div>
                                <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                                    style={{ width: `${opt.percentage}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-slate-400">{opt.votes} vote(s)</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* CHOIX MULTIPLE (Multiple) → BAR CHART (Barres horizontales) */}
                        {questionType === 'multiple' && (
                          <div className="space-y-3">
                            {q.options
                              .sort((a, b) => b.votes - a.votes)
                              .map((opt, oidx) => (
                              <div key={oidx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-slate-100 font-semibold">{opt.option}</span>
                                  <div className="flex items-center gap-3 text-sm">
                                    <span className="text-purple-300 font-bold">{opt.votes} sélection(s)</span>
                                    <span className="text-slate-400">({opt.percentage.toFixed(1)}%)</span>
                                  </div>
                                </div>
                                <div className="h-4 bg-slate-900/50 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                                    style={{ width: `${opt.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* CLASSEMENT (Ranking) → LEADERBOARD (Podium sans %) */}
                        {questionType === 'ranking' && (
                          <div className="space-y-3">
                            <div className="bg-blue-900/10 border border-blue-800/50 rounded-lg p-3 mb-4">
                              <p className="text-sm text-blue-300">
                                🏆 Classement basé sur les <strong>premiers choix</strong> uniquement
                              </p>
                            </div>
                            {q.options
                              .sort((a, b) => b.votes - a.votes)
                              .map((opt, oidx) => {
                                const position = oidx + 1;
                                const medal = oidx === 0 ? '🥇' : oidx === 1 ? '🥈' : oidx === 2 ? '🥉' : `${position}.`;
                                const bgColor = oidx === 0 ? 'bg-yellow-500/10 border-yellow-500/30' :
                                                oidx === 1 ? 'bg-slate-400/10 border-slate-400/30' :
                                                oidx === 2 ? 'bg-orange-500/10 border-orange-500/30' :
                                                'bg-slate-800/50 border-slate-700';
                                const textColor = oidx === 0 ? 'text-yellow-300' :
                                                  oidx === 1 ? 'text-slate-300' :
                                                  oidx === 2 ? 'text-orange-300' :
                                                  'text-slate-400';
                                
                                return (
                                  <div key={oidx} className={`flex items-center justify-between border rounded-lg px-5 py-4 ${bgColor} transition-all hover:scale-[1.02]`}>
                                    <div className="flex items-center gap-4">
                                      <span className="text-3xl">{medal}</span>
                                      <div>
                                        <span className="text-slate-100 font-bold text-lg">{opt.option}</span>
                                        <p className="text-xs text-slate-500 mt-0.5">Position #{position}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className={`text-2xl font-bold ${textColor}`}>
                                        {opt.votes}
                                      </div>
                                      <p className="text-xs text-slate-500">
                                        {opt.votes === 0 ? 'aucun vote' : opt.votes === 1 ? '1er choix' : 'premiers choix'}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isFinished && (!stats.results_by_question || stats.results_by_question.length === 0) && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-slate-300">
            Aucun résultat disponible pour le moment.
          </div>
        )}

        {!isFinished && hasAnyVotes && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-slate-400 text-sm">
              💡 Les résultats détaillés s'afficheront automatiquement à la clôture de l'élection.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
