import React from "react";

type Props = {
  children: React.ReactNode;
  tone?: "muted" | "info" | "success" | "warning" | "danger";
  className?: string;
};

export function Badge({ children, tone = "muted", className = "" }: Props) {
  const base = "rounded-full px-3 py-1 text-xs font-medium border";
  const styles = {
    muted: "bg-slate-100 text-slate-600 border-slate-200",
    info: "bg-indigo-50 text-indigo-700 border-indigo-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const selectedTone = styles[tone as keyof typeof styles] || styles.muted;

  return <span className={`${base} ${selectedTone} ${className}`}>{children}</span>;
}
