import React from "react";

type Props = { children: React.ReactNode; gap?: string; className?: string };

export function Stack({ children, gap = "1rem", className = "" }: Props) {
  return (
    <div className={className} style={{ display: "grid", gap }}>
      {children}
    </div>
  );
}
