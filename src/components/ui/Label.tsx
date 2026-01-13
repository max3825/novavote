import React from "react";

type Props = { children: React.ReactNode; htmlFor?: string; hint?: string };

export function Label({ children, htmlFor, hint }: Props) {
  return (
    <label htmlFor={htmlFor} className="block space-y-1">
      <span className="text-sm text-slate-200">{children}</span>
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}
