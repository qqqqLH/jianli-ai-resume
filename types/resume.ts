export type ResumeInsert = {
  user_id: string;
  full_name: string;
  email: string;
  summary: string;
  phone?: string | null;
  experience?: Record<string, unknown>[] | null;
  education?: Record<string, unknown>[] | null;
};
