"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGitHubLogin() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Left side - value prop */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 border-r border-card-border">
        <div className="max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-green">
              <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white font-mono">ClaudeTrack</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight">
            Know exactly what
            <br />
            AI coding costs you.
          </h2>
          <p className="mt-4 text-muted-strong leading-relaxed">
            Real-time cost tracking for Claude Code. Per-model breakdown, daily trends, and budget alerts.
          </p>

          {/* Mini dashboard preview */}
          <div className="mt-8 rounded-xl border border-card-border bg-card p-4">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "Today", value: "$4.20", color: "text-accent-green" },
                { label: "Sessions", value: "12", color: "text-white" },
                { label: "Tokens", value: "340K", color: "text-white" },
              ].map((s) => (
                <div key={s.label} className="rounded-md bg-background border border-card-border p-2.5">
                  <p className="text-[9px] text-muted uppercase tracking-wider">{s.label}</p>
                  <p className={`text-lg font-bold font-mono mt-0.5 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {[
                { model: "opus-4", cost: "$3.42" },
                { model: "sonnet-4", cost: "$0.78" },
              ].map((m) => (
                <div key={m.model} className="flex items-center justify-between rounded-md bg-background/50 px-2.5 py-1 text-[11px] font-mono">
                  <span className="text-accent-amber">{m.model}</span>
                  <span className="text-accent-green">{m.cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-2xl font-bold text-white">
            Sign in
          </h1>
          <p className="mt-2 text-center text-sm text-muted">
            Welcome back to ClaudeTrack
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-950/50 border border-red-900/50 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-white placeholder-muted focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-white placeholder-muted focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent-green px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-accent-green/90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-card-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-3 text-muted">or</span>
              </div>
            </div>

            <button
              onClick={handleGitHubLogin}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-card-border bg-card px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-background hover:border-zinc-600"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-accent-green hover:text-accent-green/80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
