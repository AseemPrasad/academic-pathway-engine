import type { FormData, ValidationError } from "@/types/recommendation";

export function validateFormData(data: Partial<FormData>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.full_name?.trim()) {
    errors.push({ field: "full_name", message: "Full name is required." });
  }

  if (!data.email?.trim()) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: "email", message: "Enter a valid email address." });
  }

  if (!data.highest_qualification) {
    errors.push({ field: "highest_qualification", message: "Select your highest qualification." });
  }

  if (data.work_experience === undefined || data.work_experience === null) {
    errors.push({ field: "work_experience", message: "Years of experience is required." });
  } else if (data.work_experience < 0) {
    errors.push({ field: "work_experience", message: "Experience cannot be negative." });
  }

  if (!data.current_profession?.trim()) {
    errors.push({ field: "current_profession", message: "Current profession is required." });
  }

  if (!data.career_goal) {
    errors.push({ field: "career_goal", message: "Select your primary career goal." });
  }

  return errors;
}
