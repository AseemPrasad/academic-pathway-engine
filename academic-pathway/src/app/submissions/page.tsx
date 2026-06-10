import { SubmissionTable } from "@/components/SubmissionTable";

export const metadata = { title: "Submissions — Pathway Engine" };

export default function SubmissionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Submissions</h1>
        <p className="text-slate-400 text-sm mt-1">
          All assessments submitted through the recommendation engine.
        </p>
      </div>
      <SubmissionTable />
    </div>
  );
}
