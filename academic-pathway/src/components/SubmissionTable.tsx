"use client";

import { useEffect, useState, useCallback } from "react";
import type { Submission } from "@/types/recommendation";

const pathwayBadge: Record<string, string> = {
  Certification: "bg-emerald-400/10 text-emerald-400",
  DBA: "bg-amber-400/10 text-amber-400",
  PhD: "bg-violet-400/10 text-violet-400",
  "Honorary Doctorate": "bg-rose-400/10 text-rose-400",
};

export function SubmissionTable() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const limit = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        search,
        sort,
        order,
        page: String(page),
      });
      const res = await fetch(`/api/submissions?${params}`);
      if (!res.ok) throw new Error("Failed to load.");
      const data = await res.json();
      setSubmissions(data.data ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError("Unable to load submissions. Check your database connection.");
    } finally {
      setLoading(false);
    }
  }, [search, sort, order, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function toggleSort(field: string) {
    if (sort === field) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSort(field); setOrder("asc"); }
    setPage(1);
  }

  function SortIcon({ field }: { field: string }) {
    if (sort !== field) return <span className="opacity-20">↕</span>;
    return <span>{order === "asc" ? "↑" : "↓"}</span>;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-colors"
          placeholder="Search by name, email, or pathway…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {error && (
        <div className="rounded-xl bg-rose-400/10 border border-rose-400/30 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/60">
              {[
                { label: "Name", field: "full_name" },
                { label: "Email", field: "email" },
                { label: "Goal", field: "career_goal" },
                { label: "Pathway", field: "recommendation" },
                { label: "Confidence", field: "confidence" },
                { label: "Date", field: "created_at" },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  onClick={() => toggleSort(field)}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-200 select-none whitespace-nowrap"
                >
                  {label} <SortIcon field={field} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  No submissions found.
                </td>
              </tr>
            ) : (
              submissions.map((s, i) => (
                <tr
                  key={s.id}
                  className={`border-b border-slate-800 hover:bg-slate-800/40 transition-colors ${
                    i % 2 === 0 ? "" : "bg-slate-800/20"
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">{s.full_name}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{s.email}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{s.career_goal}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pathwayBadge[s.recommendation] ?? "bg-slate-700 text-slate-300"}`}>
                      {s.recommendation}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{s.confidence}%</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{total} total</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-30 hover:bg-slate-800 transition-colors"
            >
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-slate-300">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-30 hover:bg-slate-800 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
