import React from "react";
import "../styles/globals.css";
import { SimpleThemeProvider } from "@/components/providers/SimpleThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

/**
 * Root Layout (Next.js App Router)
 * - UNIQUEMENT les Providers (SimpleThemeProvider, ToastProvider)
 * - UNIQUEMENT HTML/Body/Metadata
 * - AUCUNE UI (Header, Footer, etc.)
 * Les Layouts des route groups gèrent le header/layout spécifique
 */

export const metadata = {
  title: "NovaVote",
  description: "Plateforme de vote électronique sécurisée, vérifiable, confidentielle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className="dark">
      <body className="min-h-screen antialiased">
        <SimpleThemeProvider>
          <ToastProvider />
          {children}
        </SimpleThemeProvider>
      </body>
    </html>
  );
}
