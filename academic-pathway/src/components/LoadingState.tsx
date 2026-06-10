"use client";

const steps = [
  "Analysing your academic profile…",
  "Evaluating pathway alignment…",
  "Generating personalised reasoning…",
];

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-amber-200/30" />
        <div className="absolute inset-0 rounded-full border-t-2 border-amber-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-t-2 border-slate-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
      </div>
      <div className="text-center space-y-2">
        {steps.map((step, i) => (
          <p
            key={step}
            className="text-sm text-slate-400 animate-pulse"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {step}
          </p>
        ))}
      </div>
    </div>
  );
}
