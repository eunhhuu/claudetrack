import { createServerSupabaseClient } from "@/lib/supabase-server";
import LandingContent from "./landing-content";

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LandingContent isLoggedIn={!!user} />;
}
