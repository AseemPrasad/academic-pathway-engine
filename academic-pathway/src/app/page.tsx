import { UserForm } from "@/components/UserForm";

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          AI-Powered Assessment
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          Find the academic pathway
          <br />
          <span className="text-amber-400">that fits your career.</span>
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Answer six questions about your background and goals. Our scoring
          engine and AI advisor will recommend the most suitable pathway —
          Certification, DBA, PhD, or Honorary Doctorate — with a confidence
          score and detailed reasoning.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <UserForm />
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-slate-600 text-center">
        Your data is stored securely and never shared. Recommendations are
        advisory; consult an academic counsellor for formal decisions.
      </p>
    </div>
  );
}
