import type { FormData, ScoringResult } from "@/types/recommendation";

interface AIInput extends FormData {
  result: ScoringResult;
}

async function callGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 350,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq error: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

async function callOpenRouter(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 350,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

function buildPrompt(input: AIInput): string {
  return `You are an academic career advisor. Generate a professional 3–4 sentence explanation for why ${input.full_name} should pursue a ${input.result.recommended} based on their profile.

Profile:
- Highest Qualification: ${input.highest_qualification}
- Years of Experience: ${input.work_experience}
- Current Profession: ${input.current_profession}
- Career Goal: ${input.career_goal}
- Recommendation Confidence: ${input.result.confidence}%

Focus on how their background aligns with this pathway and the growth it will enable. Be specific, professional, and encouraging. Do not use bullet points.`;
}

export async function generateAIExplanation(input: AIInput): Promise<string> {
  const prompt = buildPrompt(input);

  const providers = [
    { name: "Groq", fn: () => callGroq(prompt) },
    { name: "OpenRouter", fn: () => callOpenRouter(prompt) },
  ];

  for (const provider of providers) {
    try {
      const result = await provider.fn();
      if (result) return result;
    } catch (err) {
      console.warn(`${provider.name} failed:`, err);
    }
  }

  // Fallback: deterministic explanation
  return `Based on your ${input.highest_qualification} qualification and ${input.work_experience} years of experience in ${input.current_profession}, the ${input.result.recommended} pathway aligns strongly with your goal of ${input.career_goal.toLowerCase()}. This recommendation reflects a ${input.result.confidence}% match with your academic and professional profile. Pursuing this pathway will position you for meaningful advancement in your field.`;
}
