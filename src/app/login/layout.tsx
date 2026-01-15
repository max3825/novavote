import React from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      {children}
    </main>
  );
}
