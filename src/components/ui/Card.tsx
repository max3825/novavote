import React from "react";

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'gradient'
}

export function Card({ 
  children, 
  className = '',
  variant = 'default'
}: CardProps) {
  const variants = {
    default: 'rounded-2xl border-l-4 border-l-indigo-500 border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/50 hover:shadow-2xl hover:shadow-indigo-900/30 hover:border-slate-600/70 transition-all duration-300',
    elevated: 'rounded-2xl border-l-4 border-l-blue-500 border border-slate-600/30 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-6 shadow-2xl shadow-black/60 backdrop-blur-sm hover:border-slate-500/50 hover:border-l-blue-400 hover:shadow-blue-900/20 transition-all duration-300',
    gradient: 'rounded-2xl border-l-4 border-l-purple-500 border border-transparent bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-slate-950 p-6 shadow-2xl shadow-black/50 hover:border-slate-600/30 hover:border-l-purple-400 hover:shadow-purple-900/20 transition-all duration-300'
  }
  
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
