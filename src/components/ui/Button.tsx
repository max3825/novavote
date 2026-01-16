import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost" | "subtle";
  size?: "sm" | "md" | "lg"
};

export function Button({ 
  variant = "primary", 
  size = "md",
  className = "", 
  children, 
  ...rest 
}: Props) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold focus:outline-none focus-visible:ring focus-visible:ring-2 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const styles = {
    primary: "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-600/50 focus-visible:ring-blue-400 border border-blue-400/20",
    secondary: "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-slate-100 shadow-md hover:shadow-lg focus-visible:ring-slate-400 border border-slate-600/30 hover:border-slate-500/50",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:via-rose-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/40 hover:shadow-2xl hover:shadow-red-600/50 focus-visible:ring-red-400 border border-red-400/20",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:via-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/40 hover:shadow-2xl hover:shadow-green-600/50 focus-visible:ring-green-400 border border-green-400/20",
    ghost: "text-slate-300 hover:text-white hover:bg-white/10 focus-visible:ring-slate-400 border border-slate-500/20 hover:border-slate-400/40 transition-colors",
    subtle: "bg-white/10 text-white hover:bg-white/15 focus-visible:ring-white/20 border border-white/10 hover:border-white/20",
  };
  return (
    <button className={`${base} ${styles[variant]} ${sizeStyles[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
