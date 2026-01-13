import React from "react";

type Props = { steps: string[]; current: string; onChange?: (step: string) => void };

export function StepPills({ steps, current, onChange }: Props) {
  const activeIndex = steps.indexOf(current);
  return (
    <div className="mb-4 flex items-center gap-2">
      {steps.map((step, i) => {
        const active = step === current;
        const done = i < activeIndex;
        return (
          <div key={step} className="flex items-center">
            <button
              type="button"
              onClick={() => onChange?.(step)}
              className={`rounded-full px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring focus-visible:ring-cyan-400 ${
                active
                  ? "bg-gradient-to-r from-indigo-500 to-cyan-400 text-white"
                  : done
                    ? "bg-white/10 text-white"
                    : "bg-white/5 text-slate-300"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {step}
            </button>
            {i < steps.length - 1 && <div className="mx-2 h-px w-6 bg-white/10" aria-hidden />}
          </div>
        );
      })}
    </div>
  );
}
