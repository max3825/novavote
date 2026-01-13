"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await apiClient.register(email, password);
        setMode("login");
        setError("Registration successful! Please login.");
      } else {
        await apiClient.login(email, password);
        // Utiliser window.location pour forcer un reload complet
        // et s'assurer que le cookie est envoyé au serveur
        window.location.href = "/admin";
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-8 rounded-3xl card-glass p-10 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-3xl font-extrabold tracking-tight gradient-text">
          {mode === "login" ? "Connexion Admin" : "Créer un Compte"}
        </h2>
        <p className="text-base text-slate-400 font-medium">
          {mode === "login"
            ? "Accédez à votre tableau de bord"
            : "Enregistrez-vous comme administrateur"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-100 uppercase tracking-wide mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-modern"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-100 uppercase tracking-wide mb-2">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="input-modern"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border-2 border-red-500/20 px-5 py-3 text-sm font-semibold text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Chargement..." : mode === "login" ? "Se Connecter" : "S'inscrire"}
        </button>
      </form>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-sm font-semibold text-indigo-400 hover:text-purple-400 transition-colors"
        >
          {mode === "login"
            ? "Pas de compte ? S'inscrire"
            : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}
