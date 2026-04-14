import Link from "next/link";

const features = [
  {
    title: "Usage Tracking",
    description:
      "Monitor token consumption, API calls, and costs across all your AI coding sessions in real time.",
    icon: (
      <svg
        className="h-7 w-7"
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
    ),
  },
  {
    title: "Session History",
    description:
      "Review every coding session with detailed breakdowns of model usage, duration, and token spend.",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    title: "Team Management",
    description:
      "Set budgets, track per-member usage, and get alerts before your team exceeds spending limits.",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For individual developers getting started",
    features: [
      "1 project",
      "7-day history",
      "Basic usage stats",
      "Email reports",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For power users who need full visibility",
    features: [
      "Unlimited projects",
      "90-day history",
      "Advanced analytics",
      "Budget alerts",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$9",
    period: "/member/mo",
    description: "For teams that need cost control at scale",
    features: [
      "Everything in Pro",
      "Team dashboards",
      "Per-member budgets",
      "SSO & SAML",
      "Audit logs",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent dark:from-indigo-500/10" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Now tracking Claude, GPT, Gemini & more
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-7xl dark:text-white">
            Track Your
            <br />
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              AI Coding Costs
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Know exactly how much you spend on AI-assisted development. Get
            real-time insights, set budgets, and optimize your AI tool usage
            across your entire team.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 px-8 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              Everything you need to manage AI costs
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              From individual tracking to enterprise-grade team management.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-200 bg-white p-8 transition hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800"
              >
                <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-indigo-500 bg-white shadow-xl shadow-indigo-500/10 dark:border-indigo-400 dark:bg-zinc-900"
                    : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      <svg
                        className="h-4 w-4 flex-none text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full rounded-full py-2.5 text-sm font-semibold transition ${
                    plan.highlighted
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500"
                      : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 px-6 py-12 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; 2026 ClaudeTrack. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a href="#" className="transition hover:text-zinc-900 dark:hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition hover:text-zinc-900 dark:hover:text-white">
              Terms
            </a>
            <a href="#" className="transition hover:text-zinc-900 dark:hover:text-white">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
