import React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...rest }: Props) {
  return (
    <textarea
      className={`w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus-visible:ring focus-visible:ring-cyan-500 ${className}`}
      {...rest}
    />
  );
}
