import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("submissions")
      .select("career_goal, recommendation, work_experience");

    if (error) {
      console.error("Supabase analytics error:", error);
      return NextResponse.json({ message: "Failed to fetch analytics." }, { status: 500 });
    }

    const total = data.length;

    const goalCounts: Record<string, number> = {};
    const pathwayCounts: Record<string, number> = {};
    let totalExperience = 0;

    for (const row of data) {
      goalCounts[row.career_goal] = (goalCounts[row.career_goal] ?? 0) + 1;
      pathwayCounts[row.recommendation] = (pathwayCounts[row.recommendation] ?? 0) + 1;
      totalExperience += row.work_experience ?? 0;
    }

    const mostCommonGoal =
      Object.entries(goalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const mostRecommendedPathway =
      Object.entries(pathwayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const averageExperience = total > 0 ? Math.round(totalExperience / total) : 0;

    return NextResponse.json({
      total_submissions: total,
      most_common_goal: mostCommonGoal,
      most_recommended_pathway: mostRecommendedPathway,
      average_experience: averageExperience,
    });
  } catch (err) {
    console.error("Analytics route error:", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
