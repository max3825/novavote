import React from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata = {
  title: "Admin - NovaVote",
  description: "Tableau de bord administrateur",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-white dark:bg-slate-950 overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}
