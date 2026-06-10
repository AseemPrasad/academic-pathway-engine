export type AcademicPathway = "Certification" | "DBA" | "PhD" | "Honorary Doctorate";

export type Qualification =
  | "High School"
  | "Bachelor"
  | "Master"
  | "Doctorate";

export type CareerGoal =
  | "Leadership"
  | "Research"
  | "Skill Development"
  | "Recognition";

export interface FormData {
  full_name: string;
  email: string;
  highest_qualification: Qualification;
  work_experience: number;
  current_profession: string;
  career_goal: CareerGoal;
}

export interface AlternativePathway {
  path: AcademicPathway;
  score: number;
}

export interface ScoringResult {
  recommended: AcademicPathway;
  confidence: number;
  alternatives: AlternativePathway[];
  scores: Record<AcademicPathway, number>;
}

export interface RecommendationResult extends ScoringResult {
  reasoning: string;
}

export interface Submission {
  id: string;
  full_name: string;
  email: string;
  highest_qualification: string;
  work_experience: number;
  current_profession: string;
  career_goal: string;
  recommendation: string;
  confidence: number;
  reasoning: string;
  created_at: string;
}

export interface AnalyticsData {
  total_submissions: number;
  most_common_goal: string;
  most_recommended_pathway: string;
  average_experience: number;
}

export interface ValidationError {
  field: string;
  message: string;
}
