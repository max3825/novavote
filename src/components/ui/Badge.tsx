import React from "react";

type Props = { children: React.ReactNode; tone?: "muted" | "info" };

export function Badge({ children, tone = "muted" }: Props) {
  const base = "rounded-full px-3 py-1 text-xs";
  const styles = {
    muted: "bg-white/10 text-slate-200",
    info: "bg-gradient-to-r from-indigo-500/40 to-cyan-400/40 text-white",
  };
  return <span className={`${base} ${styles[tone]}`}>{children}</span>;
}
