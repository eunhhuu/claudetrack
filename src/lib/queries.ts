import { createServerSupabaseClient } from "./supabase-server";
import type {
  DailyUsage,
  DashboardStats,
  SessionWithProject,
  Profile,
} from "./types";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { total_cost_cents: 0, total_tokens: 0, session_count: 0, avg_daily_cost_cents: 0 };

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("sessions")
    .select("cost_cents, input_tokens, output_tokens, started_at")
    .eq("user_id", user.id)
    .gte("started_at", startOfMonth.toISOString());

  if (!data || data.length === 0) {
    return { total_cost_cents: 0, total_tokens: 0, session_count: 0, avg_daily_cost_cents: 0 };
  }

  const total_cost_cents = data.reduce((s, r) => s + r.cost_cents, 0);
  const total_tokens = data.reduce(
    (s, r) => s + r.input_tokens + r.output_tokens,
    0
  );
  const session_count = data.length;

  const days = new Set(
    data.map((r) => new Date(r.started_at).toDateString())
  ).size;
  const avg_daily_cost_cents = days > 0 ? Math.round(total_cost_cents / days) : 0;

  return { total_cost_cents, total_tokens, session_count, avg_daily_cost_cents };
}

export async function getDailyUsage(): Promise<DailyUsage[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("sessions")
    .select("cost_cents, input_tokens, output_tokens, started_at")
    .eq("user_id", user.id)
    .gte("started_at", startOfMonth.toISOString())
    .order("started_at", { ascending: true });

  if (!data) return [];

  const grouped = new Map<string, { cost_cents: number; total_tokens: number }>();
  for (const row of data) {
    const day = new Date(row.started_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const existing = grouped.get(day) ?? { cost_cents: 0, total_tokens: 0 };
    existing.cost_cents += row.cost_cents;
    existing.total_tokens += row.input_tokens + row.output_tokens;
    grouped.set(day, existing);
  }

  return Array.from(grouped.entries()).map(([day, v]) => ({
    day,
    cost_cents: v.cost_cents,
    total_tokens: v.total_tokens,
  }));
}

export async function getRecentSessions(
  limit = 20
): Promise<SessionWithProject[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("sessions")
    .select("*, projects(name)")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data.map((row) => ({
    ...row,
    project_name: (row.projects as { name: string } | null)?.name ?? null,
  }));
}
