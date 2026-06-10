"use client";

import type { RecommendationResult } from "@/types/recommendation";

interface Props {
  result: RecommendationResult;
  onReset: () => void;
}

const pathwayColors: Record<string, string> = {
  Certification: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  DBA: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  PhD: "text-violet-400 border-violet-400/30 bg-violet-400/5",
  "Honorary Doctorate": "text-rose-400 border-rose-400/30 bg-rose-400/5",
};

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function RecommendationCard({ result, onReset }: Props) {
  const colour = pathwayColors[result.recommended] ?? pathwayColors["DBA"];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Primary recommendation */}
      <div className={`rounded-2xl border p-6 ${colour}`}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1 opacity-60">
          Recommended Pathway
        </p>
        <h2 className="text-3xl font-bold tracking-tight">{result.recommended}</h2>
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="opacity-60">Confidence score</span>
            <span>{result.confidence}%</span>
          </div>
          <ConfidenceBar value={result.confidence} />
        </div>
      </div>

      {/* AI Reasoning */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Why this pathway
        </p>
        <p className="text-slate-300 leading-relaxed text-sm">{result.reasoning}</p>
      </div>

      {/* Alternatives */}
      {result.alternatives.length > 0 && (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Alternative Pathways
          </p>
          <div className="space-y-3">
            {result.alternatives.map((alt) => (
              <div key={alt.path} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">{alt.path}</span>
                  <span className="text-slate-500">{alt.score}%</span>
                </div>
                <ConfidenceBar value={alt.score} />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
      >
        Start a new assessment
      </button>
    </div>
  );
}
