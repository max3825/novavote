"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * AuthForm Component - Modern SaaS Design
 * Glassmorphism card with professional styling
 */

export function AuthForm({ initialMode = "login" }: { initialMode?: "login" | "register" }) {
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
      if (initialMode === "register") {
        // Registration workflow
        await apiClient.register(email, password);
        // Redirect to login instead of changing mode
        router.push("/login");
        return;
      } else {
        // Login workflow
        await apiClient.login(email, password);
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Token not set after login");
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
        window.location.href = '/admin';
        return;
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      console.error("Auth error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Glassmorphism Card */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-slate-700/50 shadow-2xl p-8 sm:p-10 space-y-6 hover:border-slate-600/70 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block">
            <div className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>🔐</div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight h-10 flex items-center justify-center gap-1">
              {initialMode === "login" ? (
                <>
                  <span>Bienvenue</span>
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Admin
                  </span>
                </>
              ) : (
                <>
                  <span>Créer un</span>
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    compte
                  </span>
                </>
              )}
            </h1>
            <p className="text-slate-400 text-sm font-medium h-12 flex items-center justify-center leading-tight">
              {initialMode === "login"
                ? "Tableau de bord sécurisé"
                : "Rejoignez la plateforme"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full h-11 px-4 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 focus:bg-slate-700 disabled:opacity-50 hover:border-slate-500"
              placeholder="vous@example.com"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
              className="w-full h-11 px-4 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 focus:bg-slate-700 disabled:opacity-50 hover:border-slate-500"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                {initialMode === "login" ? "Connexion..." : "Inscription..."}
              </>
            ) : (
              <>
                {initialMode === "login" ? "🔓 Se Connecter" : "✨ Créer mon Compte"}
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/50" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-slate-800/80 text-slate-400 font-semibold">ou</span>
          </div>
        </div>

        {/* Toggle Mode Link */}
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            {initialMode === "login" ? (
              <>
                Pas de compte ?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline underline-offset-2"
                >
                  S'inscrire →
                </Link>
              </>
            ) : (
              <>
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline underline-offset-2"
                >
                  ← Se connecter
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <span>🔒</span>
        <span>Connexion sécurisée par RSA-2048 & TLS</span>
      </div>
    </div>
  );
}
