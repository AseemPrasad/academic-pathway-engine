import { AnalyticsCards } from "@/components/AnalyticsCards";

export const metadata = { title: "Analytics — Pathway Engine" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">
          Aggregated insights across all pathway assessments.
        </p>
      </div>
      <AnalyticsCards />
    </div>
  );
}
