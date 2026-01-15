"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

/**
 * AuthForm Component
 * Gère login/register avec redirection async correcte
 * IMPORTANT: useRouter doit être importé de 'next/navigation' pour App Router
 */

export function AuthForm({ initialMode = "login" }: { initialMode?: "login" | "register" }) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        // Registration workflow
        await apiClient.register(email, password);
        setMode("login");
        setEmail("");
        setPassword("");
        setError(""); // Clear error on success
      } else {
        // Login workflow - ROBUSTE SUR TOUS LES NAVIGATEURS
        // 1. Execute login API call
        await apiClient.login(email, password);
        
        // 2. Verify token was set
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Token not set after login");
        }

        // 3. Small delay to ensure cookie is processed
        await new Promise((resolve) => setTimeout(resolve, 200));
        
        // 4. HARD REDIRECT - Force page reload pour garantir que les cookies sont lus
        // Cela force le middleware à vérifier le nouveau cookie
        window.location.href = '/admin';
        
        // Don't clear loading - let redirect happen
        return;
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      console.error("Auth error:", err);
    } finally {
      if (mode === "register") {
        setLoading(false);
      }
      // For login, keep loading true until redirect happens
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-8 rounded-3xl bg-white dark:bg-slate-900/60 backdrop-blur p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
      <div className="text-center space-y-2">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-300">
          {mode === "login" ? "Connexion Admin" : "Créer un Compte"}
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
          {mode === "login"
            ? "Accédez à votre tableau de bord"
            : "Enregistrez-vous comme administrateur"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 px-5 py-3 text-sm font-semibold text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading
            ? mode === "login"
              ? "Connexion en cours..."
              : "Inscription en cours..."
            : mode === "login"
              ? "Se Connecter"
              : "S'inscrire"}
        </button>
      </form>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          disabled={loading}
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors disabled:opacity-50"
        >
          {mode === "login"
            ? "Pas de compte ? S'inscrire"
            : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}
