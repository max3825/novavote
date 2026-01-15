import React from "react";
import { VoterHeader } from "@/components/layout/VoterHeader";

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VoterHeader />
      <main className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 min-h-screen">
        {children}
      </main>
    </>
  );
}
