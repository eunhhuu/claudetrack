export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  plan: "free" | "pro" | "team";
  monthly_budget_cents: number | null;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  project_id: string | null;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_cents: number;
  duration_seconds: number;
  started_at: string;
  ended_at: string | null;
}

export interface DailyUsage {
  day: string;
  cost_cents: number;
  total_tokens: number;
}

export interface DashboardStats {
  total_cost_cents: number;
  total_tokens: number;
  session_count: number;
  avg_daily_cost_cents: number;
}

export interface SessionWithProject extends Session {
  project_name: string | null;
}
