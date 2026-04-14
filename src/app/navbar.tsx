"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-green">
            <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <span className="text-base font-semibold text-white font-mono">
            ClaudeTrack
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 sm:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm transition ${
                  isDashboard ? "font-medium text-white" : "text-muted-strong hover:text-white"
                }`}
              >
                Dashboard
              </Link>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-card-border px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-card"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-green/20 text-accent-green text-xs font-bold font-mono">
                    {(user.email?.[0] ?? "U").toUpperCase()}
                  </div>
                  <span className="max-w-[140px] truncate text-xs font-mono">{user.email}</span>
                  <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-card-border bg-card shadow-xl shadow-black/40 py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-zinc-300 hover:bg-background hover:text-white transition"
                    >
                      Dashboard
                    </Link>
                    <div className="border-t border-card-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-background transition"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {!isDashboard && (
                <>
                  <Link href="/#how-it-works" className="text-sm text-muted-strong transition hover:text-white">
                    How It Works
                  </Link>
                  <Link href="/#pricing" className="text-sm text-muted-strong transition hover:text-white">
                    Pricing
                  </Link>
                </>
              )}
              <Link
                href="/auth/login"
                className="text-sm text-muted-strong transition hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-accent-green px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-accent-green/90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-1.5 text-zinc-400"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-card-border bg-card px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-xs text-muted font-mono mb-1">
                  <div className="h-5 w-5 rounded-full bg-accent-green/20 text-accent-green text-[10px] font-bold flex items-center justify-center">
                    {(user.email?.[0] ?? "U").toUpperCase()}
                  </div>
                  {user.email}
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-zinc-300 transition hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm text-red-400 transition hover:text-red-300"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm text-zinc-300 hover:text-white">
                  How It Works
                </Link>
                <Link href="/#pricing" onClick={() => setMobileOpen(false)} className="text-sm text-zinc-300 hover:text-white">
                  Pricing
                </Link>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-sm text-zinc-300 hover:text-white">
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-accent-green px-4 py-1.5 text-center text-sm font-semibold text-black transition hover:bg-accent-green/90"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
