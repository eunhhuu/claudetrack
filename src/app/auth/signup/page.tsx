"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/10">
            <svg className="h-6 w-6 text-accent-green" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Check your email</h1>
          <p className="mt-2 text-sm text-muted">
            We sent a confirmation link to <strong className="text-zinc-300">{email}</strong>. Click the link to activate your account.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block text-sm font-medium text-accent-green hover:text-accent-green/80"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
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
            Stop guessing.
            <br />
            Start tracking.
          </h2>
          <p className="mt-4 text-muted-strong leading-relaxed">
            Join 127+ developers who know exactly what their AI coding sessions cost. Setup takes less than 2 minutes.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "One curl command to install",
              "Automatic usage tracking every 5 minutes",
              "Per-model cost breakdown (Opus, Sonnet, Haiku)",
              "Budget alerts before you overspend",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="text-accent-green">&#10003;</span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-2xl font-bold text-white">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-muted">
            Free forever for individual developers
          </p>

          <form onSubmit={handleSignup} className="mt-8 space-y-4">
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-white placeholder-muted focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent-green px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-accent-green/90 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-accent-green hover:text-accent-green/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
