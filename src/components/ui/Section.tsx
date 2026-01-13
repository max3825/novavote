import React from "react";

type Props = { id?: string; title: string; eyebrow?: string; description?: string; children: React.ReactNode };

export function Section({ id, title, eyebrow, description, children }: Props) {
  return (
    <section id={id} className="space-y-4">
      <div>
        {eyebrow && <p className="text-sm text-slate-400">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {description && <p className="text-sm text-slate-300">{description}</p>}
      </div>
      {children}
    </section>
  );
}
