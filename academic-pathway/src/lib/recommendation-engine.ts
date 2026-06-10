import type {
  AcademicPathway,
  FormData,
  ScoringResult,
} from "@/types/recommendation";

type PathwayScores = Record<AcademicPathway, number>;

function applyQualificationWeights(
  scores: PathwayScores,
  qualification: string
): void {
  switch (qualification) {
    case "High School":
      scores["Certification"] += 40;
      break;
    case "Bachelor":
      scores["Certification"] += 20;
      scores["DBA"] += 15;
      break;
    case "Master":
      scores["DBA"] += 35;
      scores["PhD"] += 25;
      break;
    case "Doctorate":
      scores["Honorary Doctorate"] += 20;
      break;
  }
}

function applyExperienceWeights(
  scores: PathwayScores,
  years: number
): void {
  if (years <= 2) {
    scores["Certification"] += 30;
  } else if (years <= 7) {
    scores["Certification"] += 20;
    scores["DBA"] += 15;
  } else if (years <= 15) {
    scores["DBA"] += 30;
    scores["PhD"] += 15;
  } else {
    scores["DBA"] += 40;
    scores["Honorary Doctorate"] += 25;
  }
}

function applyCareerGoalWeights(
  scores: PathwayScores,
  goal: string
): void {
  switch (goal) {
    case "Leadership":
      scores["DBA"] += 40;
      break;
    case "Research":
      scores["PhD"] += 50;
      break;
    case "Skill Development":
      scores["Certification"] += 40;
      break;
    case "Recognition":
      scores["Honorary Doctorate"] += 50;
      break;
  }
}

function normaliseToConfidence(scores: PathwayScores): Record<AcademicPathway, number> {
  const max = Math.max(...Object.values(scores));
  if (max === 0) {
    return { Certification: 0, DBA: 0, PhD: 0, "Honorary Doctorate": 0 };
  }
  return Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, Math.round((v / max) * 100)])
  ) as Record<AcademicPathway, number>;
}

export function computeRecommendation(data: FormData): ScoringResult {
  const scores: PathwayScores = {
    Certification: 0,
    DBA: 0,
    PhD: 0,
    "Honorary Doctorate": 0,
  };

  applyQualificationWeights(scores, data.highest_qualification);
  applyExperienceWeights(scores, data.work_experience);
  applyCareerGoalWeights(scores, data.career_goal);

  const normalised = normaliseToConfidence(scores);

  const sorted = (Object.entries(normalised) as [AcademicPathway, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  const [recommended, confidence] = sorted[0];
  const alternatives = sorted.slice(1).map(([path, score]) => ({ path, score }));

  return {
    recommended,
    confidence,
    alternatives,
    scores: normalised,
  };
}
