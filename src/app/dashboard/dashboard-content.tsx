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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
      <svg
        className="mb-4 h-10 w-10 text-zinc-300 dark:text-zinc-600"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        No sessions yet
      </p>
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
        Start an AI coding session to see your usage data here.
      </p>
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
  const [copied, setCopied] = useState(false);
  const installCmd = `curl -s https://claudetrack.qucord.com/install/tracker.sh | bash -s -- ${userId}`;

  const isEmpty = stats.session_count === 0;

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const statCards = [
    { label: `Total Cost (${now.toLocaleDateString("en-US", { month: "short" })})`, value: formatCents(stats.total_cost_cents) },
    { label: "Total Tokens", value: formatTokens(stats.total_tokens) },
    { label: "Avg Daily Cost", value: formatCents(stats.avg_daily_cost_cents) },
    { label: "Sessions", value: stats.session_count.toString() },
  ];

  const chartData = dailyUsage.map((d) => ({
    date: d.day,
    cost: d.cost_cents / 100,
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {monthLabel} &middot; {userEmail}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>
            <span className="mt-2 block text-2xl font-bold text-zinc-900 dark:text-white">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* API Key & Setup */}
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Setup Tracker
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Install the tracker to automatically sync your Claude Code usage.
        </p>
        <div className="mt-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Your API Key
          </label>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              {userId}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(userId);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Install Command
          </label>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              {installCmd}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(installCmd);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="shrink-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="mt-8">
          <EmptyState />
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Daily Cost
            </h2>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              Cost per day in USD
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-zinc-800"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    className="text-zinc-500"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                    className="text-zinc-500"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-background, #fff)",
                      border: "1px solid #e4e4e7",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    formatter={(value) => [
                      `$${Number(value).toFixed(2)}`,
                      "Cost",
                    ]}
                  />
                  <Bar
                    dataKey="cost"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sessions table */}
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Recent Sessions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    <th className="px-6 py-3 font-medium">Project</th>
                    <th className="px-6 py-3 font-medium">Model</th>
                    <th className="px-6 py-3 font-medium text-right">Tokens</th>
                    <th className="px-6 py-3 font-medium text-right">Cost</th>
                    <th className="px-6 py-3 font-medium text-right">Duration</th>
                    <th className="px-6 py-3 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-zinc-50 transition hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-6 py-3 font-medium text-zinc-900 dark:text-white">
                        {s.project_name ?? "—"}
                      </td>
                      <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">
                          {s.model}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                        {formatTokens(s.input_tokens + s.output_tokens)}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums font-medium text-zinc-900 dark:text-white">
                        {formatCents(s.cost_cents)}
                      </td>
                      <td className="px-6 py-3 text-right text-zinc-600 dark:text-zinc-400">
                        {formatDuration(s.duration_seconds)}
                      </td>
                      <td className="px-6 py-3 text-right text-zinc-500 dark:text-zinc-500">
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
