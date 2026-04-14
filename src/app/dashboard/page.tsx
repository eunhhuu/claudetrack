import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getDashboardStats, getDailyUsage, getRecentSessions, getProfile } from "@/lib/queries";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [stats, dailyUsage, recentSessions, profile] = await Promise.all([
    getDashboardStats(),
    getDailyUsage(),
    getRecentSessions(),
    getProfile(),
  ]);

  return (
    <DashboardContent
      stats={stats}
      dailyUsage={dailyUsage}
      recentSessions={recentSessions}
      userEmail={user.email ?? ""}
      userId={user.id}
      plan={profile?.plan ?? "free"}
    />
  );
}
