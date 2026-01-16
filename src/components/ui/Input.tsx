import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...rest }: Props) {
  return (
    <input
      className={`w-full rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2.5 text-white placeholder:text-slate-500 transition-all duration-300 focus:border-indigo-400 focus:bg-white/10 focus:shadow-lg focus:shadow-indigo-500/20 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500/50 ${className}`}
      {...rest}
    />
  );
}
