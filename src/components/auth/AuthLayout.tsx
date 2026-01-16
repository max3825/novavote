"use client";

import React from "react";

/**
 * AuthLayout Component - Wrapper partagé pour login/register
 * Contient toute la structure visuelle commune (background, branding)
 * Les pages ne doivent injecter que le formulaire comme children
 */

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      {/* Animated background blobs - FIXE pour ne jamais bouger */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Left Side - Branding & Value Prop - FIXE et identique */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-12 relative z-10">
        <div className="max-w-md space-y-8">
          {/* Logo/Icon */}
          <div className="flex items-center gap-4">
            <div className="text-6xl">🗳️</div>
            <div>
              <h1 className="text-5xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  NovaVote
                </span>
              </h1>
              <p className="text-slate-400 text-sm font-semibold">
                Démocratie Numérique Sécurisée
              </p>
            </div>
          </div>

          {/* Value Props */}
          <div className="space-y-6 pt-8 border-t border-slate-700/50">
            <div className="flex gap-4">
              <div className="text-3xl">🔐</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Chiffrement Militaire
                </h3>
                <p className="text-slate-400 text-sm">
                  RSA-2048 & ElGamal pour une sécurité maximale
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">✨</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Vérifiable
                </h3>
                <p className="text-slate-400 text-sm">
                  Preuves Zero-Knowledge pour la transparence
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">📋</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Auditabilité Complète
                </h3>
                <p className="text-slate-400 text-sm">
                  Tous les votes publiquement vérifiables
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-12 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
            <p className="text-slate-300 italic text-sm mb-3">
              "Une plateforme de vote qui change la confiance en la démocratie numérique"
            </p>
            <p className="text-slate-400 text-xs font-semibold">
              — Admin Grenoble INP
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form Container - IDENTIQUE pour les deux pages */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-8 py-12 lg:py-0 relative z-10 min-h-screen lg:min-h-auto">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
