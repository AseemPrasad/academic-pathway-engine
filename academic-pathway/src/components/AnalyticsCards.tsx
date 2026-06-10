"use client";

import { useEffect, useState } from "react";
import type { AnalyticsData } from "@/types/recommendation";

const cards = [
  {
    key: "total_submissions" as keyof AnalyticsData,
    label: "Total Submissions",
    icon: "📋",
    format: (v: number | string) => String(v),
  },
  {
    key: "most_recommended_pathway" as keyof AnalyticsData,
    label: "Top Recommended Pathway",
    icon: "🎓",
    format: (v: number | string) => String(v),
  },
  {
    key: "most_common_goal" as keyof AnalyticsData,
    label: "Most Common Goal",
    icon: "🎯",
    format: (v: number | string) => String(v),
  },
  {
    key: "average_experience" as keyof AnalyticsData,
    label: "Avg. Years Experience",
    icon: "⏱",
    format: (v: number | string) => `${v} yrs`,
  },
];

export function AnalyticsCards() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setError("Unable to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="rounded-xl bg-rose-400/10 border border-rose-400/30 px-4 py-3 text-sm text-rose-300">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {card.label}
            </span>
            <span className="text-xl">{card.icon}</span>
          </div>
          {loading ? (
            <div className="h-8 w-24 bg-slate-700 rounded-lg animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-slate-100 tracking-tight">
              {data ? card.format(data[card.key]) : "—"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
