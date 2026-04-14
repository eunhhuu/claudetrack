"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { DashboardStats, DailyUsage, SessionWithProject } from "@/lib/types";

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatTokens(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

const MODEL_COLORS: Record<string, string> = {
  "claude-opus-4": "#22c55e",
  "claude-sonnet-4": "#f59e0b",
  "claude-haiku-3.5": "#6366f1",
};

function getModelColor(model: string, index: number): string {
  if (MODEL_COLORS[model]) return MODEL_COLORS[model];
  const fallback = ["#22c55e", "#f59e0b", "#6366f1", "#ec4899", "#06b6d4", "#8b5cf6"];
  return fallback[index % fallback.length];
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="shrink-0 rounded-md border border-card-border px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-card hover:text-white"
    >
      {copied ? "Copied!" : label ?? "Copy"}
    </button>
  );
}

function EmptyState({ userId }: { userId: string }) {
  const installCmd = `curl -s https://claudetrack.qucord.com/install/tracker.sh | bash -s -- ${userId}`;

  return (
    <div className="mt-8 rounded-xl border border-dashed border-card-border bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-green/10">
        <svg className="h-7 w-7 text-accent-green" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Install the tracker to get started</h3>
      <p className="text-sm text-muted mb-6 max-w-md mx-auto">
        Run this command in your terminal. It sets up a cron job that syncs your Claude Code usage every 5 minutes.
      </p>
      <div className="mx-auto max-w-2xl rounded-xl border border-card-border bg-background p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          <span className="ml-1 text-[10px] text-muted font-mono">terminal</span>
        </div>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-sm font-mono text-accent-green overflow-x-auto whitespace-nowrap">
            <span className="text-muted">$ </span>{installCmd}
          </code>
          <CopyButton text={installCmd} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-muted">Your API Key</p>
        <div className="mt-1 inline-flex items-center gap-2">
          <code className="rounded-md bg-background border border-card-border px-3 py-1 text-xs font-mono text-accent-amber">{userId}</code>
          <CopyButton text={userId} />
        </div>
      </div>
    </div>
  );
}

interface Props {
  stats: DashboardStats;
  dailyUsage: DailyUsage[];
  recentSessions: SessionWithProject[];
  userEmail: string;
  userId: string;
}

export default function DashboardContent({
  stats,
  dailyUsage,
  recentSessions,
  userEmail,
  userId,
}: Props) {
  const isEmpty = stats.session_count === 0;

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const chartData = dailyUsage.map((d) => ({
    date: d.day,
    cost: d.cost_cents / 100,
  }));

  const modelBreakdown = recentSessions.reduce<Record<string, { cost: number; tokens: number; count: number }>>((acc, s) => {
    const key = s.model;
    if (!acc[key]) acc[key] = { cost: 0, tokens: 0, count: 0 };
    acc[key].cost += s.cost_cents;
    acc[key].tokens += s.input_tokens + s.output_tokens;
    acc[key].count += 1;
    return acc;
  }, {});

  const modelData = Object.entries(modelBreakdown)
    .map(([model, data]) => ({ model, ...data }))
    .sort((a, b) => b.cost - a.cost);

  const maxModelCost = modelData.length > 0 ? modelData[0].cost : 1;

  const pieData = modelData.map(({ model, cost }) => ({ name: model, value: cost }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-muted font-mono">
            {monthLabel} &middot; {userEmail}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Cost", value: formatCents(stats.total_cost_cents), color: "text-accent-green" },
          { label: "Total Tokens", value: formatTokens(stats.total_tokens), color: "text-white" },
          { label: "Avg Daily", value: formatCents(stats.avg_daily_cost_cents), color: "text-accent-amber" },
          { label: "Sessions", value: stats.session_count.toString(), color: "text-white" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-card-border bg-card p-4">
            <p className="text-[11px] text-muted uppercase tracking-wider font-mono">{stat.label}</p>
            <span className={`mt-1.5 block text-2xl font-bold font-mono ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {isEmpty ? (
        <EmptyState userId={userId} />
      ) : (
        <>
          {/* Charts row */}
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {/* Daily cost chart */}
            <div className="lg:col-span-2 rounded-xl border border-card-border bg-card p-5">
              <h2 className="text-sm font-semibold text-white mb-1">Daily Cost</h2>
              <p className="text-xs text-muted mb-4">Cost per day in USD</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e2a3a" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111820",
                        border: "1px solid #1e2a3a",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#d4d4d8",
                      }}
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, "Cost"]}
                      cursor={{ fill: "rgba(34, 197, 94, 0.05)" }}
                    />
                    <Bar dataKey="cost" fill="#22c55e" radius={[3, 3, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Model breakdown */}
            <div className="rounded-xl border border-card-border bg-card p-5">
              <h2 className="text-sm font-semibold text-white mb-1">By Model</h2>
              <p className="text-xs text-muted mb-4">Cost per model this month</p>

              {pieData.length > 0 && (
                <div className="h-36 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} strokeWidth={0}>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={getModelColor(pieData[i].name, i)} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111820",
                          border: "1px solid #1e2a3a",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "#d4d4d8",
                        }}
                        formatter={(value) => [formatCents(Number(value)), "Cost"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-2.5">
                {modelData.map((m, i) => (
                  <div key={m.model}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ background: getModelColor(m.model, i) }} />
                        <span className="font-mono text-zinc-300">{m.model}</span>
                      </div>
                      <span className="font-mono text-accent-green">{formatCents(m.cost)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-background overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(m.cost / maxModelCost) * 100}%`,
                          background: getModelColor(m.model, i),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Setup tracker collapsed */}
          <details className="mt-6 rounded-xl border border-card-border bg-card group">
            <summary className="cursor-pointer px-5 py-4 flex items-center justify-between text-sm font-semibold text-white">
              <span>Tracker Setup</span>
              <svg className="h-4 w-4 text-muted transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>
            <div className="border-t border-card-border px-5 py-4 space-y-3">
              <div>
                <p className="text-xs text-muted mb-1.5">API Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-md border border-card-border bg-background px-3 py-1.5 text-xs font-mono text-accent-amber overflow-x-auto">{userId}</code>
                  <CopyButton text={userId} />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted mb-1.5">Install Command</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-md border border-card-border bg-background px-3 py-1.5 text-xs font-mono text-accent-green overflow-x-auto whitespace-nowrap">
                    curl -s https://claudetrack.qucord.com/install/tracker.sh | bash -s -- {userId}
                  </code>
                  <CopyButton text={`curl -s https://claudetrack.qucord.com/install/tracker.sh | bash -s -- ${userId}`} />
                </div>
              </div>
            </div>
          </details>

          {/* Recent Sessions */}
          <div className="mt-6 rounded-xl border border-card-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-card-border">
              <h2 className="text-sm font-semibold text-white">Recent Sessions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-card-border text-xs text-muted uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">Project</th>
                    <th className="px-5 py-3 font-medium">Model</th>
                    <th className="px-5 py-3 font-medium text-right">Tokens</th>
                    <th className="px-5 py-3 font-medium text-right">Cost</th>
                    <th className="px-5 py-3 font-medium text-right">Duration</th>
                    <th className="px-5 py-3 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((s) => (
                    <tr key={s.id} className="border-b border-card-border/50 transition hover:bg-background/50">
                      <td className="px-5 py-3 font-medium text-zinc-200 font-mono text-xs">
                        {s.project_name ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center rounded-md bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 text-[11px] font-mono font-medium text-accent-green">
                          {s.model}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-zinc-400 font-mono text-xs">
                        {formatTokens(s.input_tokens + s.output_tokens)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums font-medium text-accent-green font-mono text-xs">
                        {formatCents(s.cost_cents)}
                      </td>
                      <td className="px-5 py-3 text-right text-zinc-400 font-mono text-xs">
                        {formatDuration(s.duration_seconds)}
                      </td>
                      <td className="px-5 py-3 text-right text-muted text-xs">
                        {new Date(s.started_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
