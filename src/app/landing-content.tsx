"use client";

import Link from "next/link";
import { useState } from "react";

interface Props {
  isLoggedIn: boolean;
}

function TerminalLine({ prompt, cmd, delay }: { prompt: string; cmd: string; delay?: string }) {
  return (
    <div className={`flex gap-2 font-mono text-sm ${delay ?? ""}`}>
      <span className="text-accent-green shrink-0">{prompt}</span>
      <span className="text-zinc-300">{cmd}</span>
    </div>
  );
}

function DashboardPreview() {
  const bars = [
    { label: "Mon", h: 32, cost: "$4.20" },
    { label: "Tue", h: 48, cost: "$6.80" },
    { label: "Wed", h: 24, cost: "$3.10" },
    { label: "Thu", h: 64, cost: "$8.90" },
    { label: "Fri", h: 56, cost: "$7.40" },
    { label: "Sat", h: 16, cost: "$1.90" },
    { label: "Sun", h: 40, cost: "$5.60" },
  ];

  return (
    <div className="rounded-xl border border-card-border bg-card p-5 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-3 rounded-full bg-red-500/60" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
        <div className="h-3 w-3 rounded-full bg-green-500/60" />
        <span className="ml-2 text-xs text-muted font-mono">dashboard</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-lg bg-background/60 border border-card-border p-3">
          <p className="text-[11px] text-muted uppercase tracking-wider">This Month</p>
          <p className="text-xl font-bold font-mono text-accent-green mt-1">$38.90</p>
        </div>
        <div className="rounded-lg bg-background/60 border border-card-border p-3">
          <p className="text-[11px] text-muted uppercase tracking-wider">Sessions</p>
          <p className="text-xl font-bold font-mono text-zinc-200 mt-1">142</p>
        </div>
        <div className="rounded-lg bg-background/60 border border-card-border p-3">
          <p className="text-[11px] text-muted uppercase tracking-wider">Tokens</p>
          <p className="text-xl font-bold font-mono text-zinc-200 mt-1">2.4M</p>
        </div>
      </div>

      <div className="flex items-end gap-1.5 h-20">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-accent-green/70 transition-all hover:bg-accent-green"
              style={{ height: `${b.h}px` }}
              title={b.cost}
            />
            <span className="text-[9px] text-muted font-mono">{b.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1.5">
        {[
          { model: "opus-4", tokens: "124K", cost: "$3.42", time: "2m ago" },
          { model: "sonnet-4", tokens: "89K", cost: "$0.86", time: "15m ago" },
          { model: "haiku-3.5", tokens: "201K", cost: "$0.12", time: "1h ago" },
        ].map((s) => (
          <div key={s.model} className="flex items-center justify-between rounded-md bg-background/40 px-3 py-1.5 text-xs font-mono">
            <span className="text-accent-amber">{s.model}</span>
            <span className="text-muted">{s.tokens}</span>
            <span className="text-accent-green">{s.cost}</span>
            <span className="text-muted">{s.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingContent({ isLoggedIn }: Props) {
  const ctaHref = isLoggedIn ? "/dashboard" : "/auth/signup";
  const [copied, setCopied] = useState(false);

  function copyInstall() {
    navigator.clipboard.writeText("curl -s https://claudetrack.qucord.com/install/tracker.sh | bash");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-green/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-4 py-1.5 text-sm font-mono text-accent-green">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
                127 developers tracking costs
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                Stop guessing what
                <br />
                <span className="text-accent-green">Claude Code</span>
                <br />
                costs you.
              </h1>
              <p className="mt-5 text-lg text-muted-strong leading-relaxed max-w-xl">
                Developers using ClaudeTrack save avg <span className="text-accent-amber font-semibold">23%</span> on AI costs.
                One install command. Real-time cost tracking. No config needed.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={ctaHref}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-accent-green px-6 text-sm font-semibold text-black transition hover:bg-accent-green/90"
                >
                  {isLoggedIn ? "Go to Dashboard" : "Start Tracking Free"}
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-card-border px-6 text-sm font-medium text-zinc-300 transition hover:bg-card hover:border-zinc-600"
                >
                  See How It Works
                </a>
              </div>
            </div>

            <div className="hidden lg:block">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl text-center">
            Three steps. Five minutes.
          </h2>
          <p className="mt-3 text-center text-muted-strong">
            No SDK. No code changes. Just a cron job that reads your local stats.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-card-border bg-card p-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent-green/10 text-accent-green font-mono font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-semibold text-white mb-2">Install one command</h3>
              <div className="rounded-lg bg-background border border-card-border p-3">
                <TerminalLine prompt="$" cmd="curl -s .../tracker.sh | bash" />
              </div>
              <p className="mt-3 text-sm text-muted">Sets up a cron job that runs every 5 minutes.</p>
            </div>

            <div className="rounded-xl border border-card-border bg-card p-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent-green/10 text-accent-green font-mono font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-semibold text-white mb-2">We parse your stats</h3>
              <div className="rounded-lg bg-background border border-card-border p-3">
                <TerminalLine prompt=">" cmd="~/.claude/stats-cache.json" />
              </div>
              <p className="mt-3 text-sm text-muted">Reads Claude Code&apos;s local usage file. Nothing else.</p>
            </div>

            <div className="rounded-xl border border-card-border bg-card p-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent-green/10 text-accent-green font-mono font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-semibold text-white mb-2">See real-time costs</h3>
              <div className="rounded-lg bg-background border border-card-border p-3 space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-accent-amber">opus-4</span>
                  <span className="text-accent-green">$3.42</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-accent-amber">sonnet-4</span>
                  <span className="text-accent-green">$0.86</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted">Per-model breakdown. Daily trends. Budget alerts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Install section */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-card-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-muted font-mono">terminal</span>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-sm font-mono text-accent-green overflow-x-auto">
                <span className="text-muted">$ </span>
                curl -s https://claudetrack.qucord.com/install/tracker.sh | bash
              </code>
              <button
                onClick={copyInstall}
                className="shrink-0 rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-background hover:text-white"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl text-center">
            Pricing
          </h2>
          <p className="mt-3 text-center text-muted-strong">
            Free forever for individual devs. Pay only when you need team features.
          </p>

          <div className="mt-12 overflow-hidden rounded-xl border border-card-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-card">
                  <th className="px-6 py-4 text-left font-medium text-muted"></th>
                  <th className="px-6 py-4 text-center font-medium text-zinc-300">Free</th>
                  <th className="px-6 py-4 text-center font-medium text-accent-green relative">
                    Pro
                    <span className="absolute -top-0 right-2 text-[10px] bg-accent-green text-black px-1.5 py-0.5 rounded-b font-bold">POPULAR</span>
                  </th>
                  <th className="px-6 py-4 text-center font-medium text-zinc-300">Team</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-card-border">
                  <td className="px-6 py-3 font-medium text-zinc-300">Price</td>
                  <td className="px-6 py-3 text-center font-mono text-white">$0</td>
                  <td className="px-6 py-3 text-center font-mono text-accent-green font-bold">$12<span className="text-muted font-normal">/mo</span></td>
                  <td className="px-6 py-3 text-center font-mono text-white">$9<span className="text-muted font-normal">/seat/mo</span></td>
                </tr>
                {[
                  ["Projects", "1", "Unlimited", "Unlimited"],
                  ["History", "7 days", "90 days", "1 year"],
                  ["Daily cost chart", "check", "check", "check"],
                  ["Model breakdown", "check", "check", "check"],
                  ["Budget alerts", "x", "check", "check"],
                  ["Team dashboards", "x", "x", "check"],
                  ["SSO / SAML", "x", "x", "check"],
                  ["API access", "x", "check", "check"],
                ].map(([feature, free, pro, team]) => (
                  <tr key={feature} className="border-b border-card-border last:border-0">
                    <td className="px-6 py-3 text-zinc-300">{feature}</td>
                    {[free, pro, team].map((val, i) => (
                      <td key={i} className="px-6 py-3 text-center">
                        {val === "check" ? (
                          <span className="text-accent-green">&#10003;</span>
                        ) : val === "x" ? (
                          <span className="text-zinc-600">&mdash;</span>
                        ) : (
                          <span className="font-mono">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href={ctaHref}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-accent-green px-6 text-sm font-semibold text-black transition hover:bg-accent-green/90"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-border px-6 py-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <p className="text-sm text-muted font-mono">
            ClaudeTrack &copy; {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted">
            <a
              href="https://github.com/eunhhuu/claudetrack"
              className="transition hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span className="text-zinc-700">|</span>
            <span>Built by eunhhuu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
