import React from "react";

type Props = { value: number };

export function Progress({ value }: Props) {
  return (
    <span className="block h-2 w-full rounded-full bg-white/10" aria-hidden>
      <span className="block h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${value}%` }} />
    </span>
  );
}
