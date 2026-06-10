"use client";

import { useState } from "react";
import type {
  FormData,
  RecommendationResult,
  ValidationError,
} from "@/types/recommendation";
import { LoadingState } from "./LoadingState";
import { RecommendationCard } from "./RecommendationCard";

const qualifications = ["High School", "Bachelor", "Master", "Doctorate"] as const;
const goals = ["Leadership", "Research", "Skill Development", "Recognition"] as const;

const defaultForm: FormData = {
  full_name: "",
  email: "",
  highest_qualification: "Bachelor",
  work_experience: 0,
  current_profession: "",
  career_goal: "Leadership",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-rose-400">{message}</p>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-colors";

export function UserForm() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [serverError, setServerError] = useState("");

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function handleSubmit() {
    setServerError("");
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 422 && data.errors) {
        const fieldErrors: Record<string, string> = {};
        (data.errors as ValidationError[]).forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }

      if (!res.ok) {
        setServerError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(data);
    } catch {
      setServerError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState />;
  if (result)
    return (
      <RecommendationCard
        result={result}
        onReset={() => {
          setResult(null);
          setForm(defaultForm);
        }}
      />
    );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Full Name</Label>
          <input
            className={inputClass}
            placeholder="Dr. Jane Smith"
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
          />
          <FieldError message={errors.full_name} />
        </div>
        <div>
          <Label>Email Address</Label>
          <input
            className={inputClass}
            type="email"
            placeholder="jane@university.edu"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <FieldError message={errors.email} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Highest Qualification</Label>
          <select
            className={inputClass}
            value={form.highest_qualification}
            onChange={(e) =>
              set("highest_qualification", e.target.value as FormData["highest_qualification"])
            }
          >
            {qualifications.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          <FieldError message={errors.highest_qualification} />
        </div>
        <div>
          <Label>Years of Experience</Label>
          <input
            className={inputClass}
            type="number"
            min={0}
            placeholder="8"
            value={form.work_experience}
            onChange={(e) => set("work_experience", parseInt(e.target.value) || 0)}
          />
          <FieldError message={errors.work_experience} />
        </div>
      </div>

      <div>
        <Label>Current Profession</Label>
        <input
          className={inputClass}
          placeholder="Senior Engineer, Professor, Consultant…"
          value={form.current_profession}
          onChange={(e) => set("current_profession", e.target.value)}
        />
        <FieldError message={errors.current_profession} />
      </div>

      <div>
        <Label>Primary Career Goal</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {goals.map((g) => (
            <button
              key={g}
              onClick={() => set("career_goal", g)}
              className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                form.career_goal === g
                  ? "border-amber-400 bg-amber-400/10 text-amber-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <FieldError message={errors.career_goal} />
      </div>

      {serverError && (
        <div className="rounded-xl bg-rose-400/10 border border-rose-400/30 px-4 py-3 text-sm text-rose-300">
          {serverError}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-sm tracking-wide transition-colors"
      >
        Find my academic pathway →
      </button>
    </div>
  );
}
