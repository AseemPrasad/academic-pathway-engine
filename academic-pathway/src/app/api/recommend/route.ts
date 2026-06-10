import { NextRequest, NextResponse } from "next/server";
import { validateFormData } from "@/lib/validation";
import { computeRecommendation } from "@/lib/recommendation-engine";
import { generateAIExplanation } from "@/lib/ai-explanation";
import { supabase } from "@/lib/supabase";
import type { FormData } from "@/types/recommendation";

export async function POST(req: NextRequest) {
  try {
    const body: Partial<FormData> = await req.json();

    const errors = validateFormData(body);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const formData = body as FormData;
    const result = computeRecommendation(formData);
    const reasoning = await generateAIExplanation({ ...formData, result });

    const { error: dbError } = await supabase.from("submissions").insert({
      full_name: formData.full_name,
      email: formData.email,
      highest_qualification: formData.highest_qualification,
      work_experience: formData.work_experience,
      current_profession: formData.current_profession,
      career_goal: formData.career_goal,
      recommendation: result.recommended,
      confidence: result.confidence,
      reasoning,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    return NextResponse.json({ ...result, reasoning }, { status: 200 });
  } catch (err) {
    console.error("Recommend route error:", err);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
