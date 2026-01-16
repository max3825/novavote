import React from "react";

type HeaderButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "home";
  icon?: string;
  label: string;
};

export function HeaderButton({
  variant = "secondary",
  icon = "",
  label,
  className = "",
  ...rest
}: HeaderButtonProps) {
  const baseClasses =
    "flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/60 hover:-translate-y-0.5",
    secondary:
      "bg-slate-100 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700",
    danger:
      "bg-gradient-to-r from-red-500/20 to-rose-500/20 dark:from-red-600/20 dark:to-rose-600/20 border border-red-300/50 dark:border-red-700/50 hover:border-red-400 dark:hover:border-red-600 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-100/50 dark:hover:bg-red-900/20 hover:shadow-red-500/20",
    home: "bg-blue-100 dark:bg-blue-900/40 border border-blue-300/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-600 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-900/30 hover:shadow-blue-500/20",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...rest}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
