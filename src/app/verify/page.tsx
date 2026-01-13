"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export default function VerifyPage() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <VerifyPageContent />
    </Suspense>
  );
}

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const [tracking, setTracking] = useState(searchParams.get("tracking") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiClient.verifyBallot(code.trim());
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Code invalide ou bulletin introuvable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = searchParams.get("tracking");
    if (initial) {
      setTracking(initial);
      handleVerify(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm text-slate-400">Vérification du bulletin</p>
          <h1 className="text-3xl font-bold text-white">Vérifier mon bulletin</h1>
          <p className="text-slate-400 text-sm">
            Saisissez votre code de suivi pour confirmer que votre bulletin est présent.
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-slate-300">Code de suivi</label>
          <input
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="Ex: 68B1141E916F99EB"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading && tracking.trim()) {
                handleVerify(tracking);
              }
            }}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handleVerify(tracking);
            }}
            disabled={loading || !tracking.trim()}
            type="button"
            className="w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Vérification..." : "Vérifier"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-4 space-y-2">
            <p className="text-sm text-slate-400">Bulletin trouvé</p>
            <p className="font-mono text-cyan-300 text-lg">{result.tracking_code}</p>
            <p className="text-xs text-slate-500">Horodatage : {new Date(result.timestamp).toLocaleString()}</p>
            <p className="text-sm text-green-400">✔️ Bulletin vérifié</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-4">
        <div className="h-4 w-1/3 bg-slate-800 animate-pulse rounded" />
        <div className="h-8 w-2/3 bg-slate-800 animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-10 w-full bg-slate-800 animate-pulse rounded" />
          <div className="h-10 w-full bg-slate-800 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
