"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dailyUsage = [
  { date: "Apr 1", cost: 4.2, tokens: 182000 },
  { date: "Apr 2", cost: 6.8, tokens: 295000 },
  { date: "Apr 3", cost: 3.1, tokens: 134000 },
  { date: "Apr 4", cost: 8.5, tokens: 369000 },
  { date: "Apr 5", cost: 5.4, tokens: 234000 },
  { date: "Apr 6", cost: 2.9, tokens: 126000 },
  { date: "Apr 7", cost: 7.2, tokens: 312000 },
  { date: "Apr 8", cost: 9.1, tokens: 395000 },
  { date: "Apr 9", cost: 4.7, tokens: 204000 },
  { date: "Apr 10", cost: 6.3, tokens: 273000 },
  { date: "Apr 11", cost: 5.8, tokens: 251000 },
  { date: "Apr 12", cost: 11.2, tokens: 486000 },
  { date: "Apr 13", cost: 3.6, tokens: 156000 },
  { date: "Apr 14", cost: 7.9, tokens: 343000 },
];

const recentSessions = [
  {
    id: "sess_01",
    project: "claudetrack",
    model: "Claude Opus 4.6",
    tokens: 48200,
    cost: 3.42,
    duration: "34m",
    time: "Today, 09:14",
  },
  {
    id: "sess_02",
    project: "api-gateway",
    model: "Claude Sonnet 4.6",
    tokens: 31500,
    cost: 0.95,
    duration: "22m",
    time: "Today, 08:01",
  },
  {
    id: "sess_03",
    project: "ml-pipeline",
    model: "GPT-5.3",
    tokens: 62300,
    cost: 4.18,
    duration: "47m",
    time: "Yesterday, 21:30",
  },
  {
    id: "sess_04",
    project: "claudetrack",
    model: "Claude Haiku 4.5",
    tokens: 15800,
    cost: 0.24,
    duration: "12m",
    time: "Yesterday, 18:45",
  },
  {
    id: "sess_05",
    project: "dashboard-v2",
    model: "Claude Opus 4.6",
    tokens: 89100,
    cost: 6.33,
    duration: "58m",
    time: "Yesterday, 14:10",
  },
  {
    id: "sess_06",
    project: "auth-service",
    model: "Claude Sonnet 4.6",
    tokens: 22400,
    cost: 0.67,
    duration: "18m",
    time: "Apr 12, 16:22",
  },
];

const totalCost = dailyUsage.reduce((sum, d) => sum + d.cost, 0);
const totalTokens = dailyUsage.reduce((sum, d) => sum + d.tokens, 0);
const avgDaily = totalCost / dailyUsage.length;
const sessionsCount = 47;

const stats = [
  {
    label: "Total Cost (Apr)",
    value: `$${totalCost.toFixed(2)}`,
    change: "+12%",
    up: true,
  },
  {
    label: "Total Tokens",
    value: `${(totalTokens / 1_000_000).toFixed(2)}M`,
    change: "+8%",
    up: true,
  },
  {
    label: "Avg Daily Cost",
    value: `$${avgDaily.toFixed(2)}`,
    change: "-3%",
    up: false,
  },
  {
    label: "Sessions",
    value: sessionsCount.toString(),
    change: "+5%",
    up: true,
  },
];

export default function DashboardContent() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        April 2026 usage overview
      </p>

      {/* Stats Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stat.value}
              </span>
              <span
                className={`text-xs font-medium ${
                  stat.up
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Usage Chart */}
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Daily Cost
        </h2>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          Cost per day in USD
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyUsage}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
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
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Cost"]}
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

      {/* Recent Sessions */}
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
              {recentSessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-zinc-50 transition hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-6 py-3 font-medium text-zinc-900 dark:text-white">
                    {session.project}
                  </td>
                  <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">
                      {session.model}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                    {session.tokens.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums font-medium text-zinc-900 dark:text-white">
                    ${session.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right text-zinc-600 dark:text-zinc-400">
                    {session.duration}
                  </td>
                  <td className="px-6 py-3 text-right text-zinc-500 dark:text-zinc-500">
                    {session.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
