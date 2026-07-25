import React from "react";

const PATHS = [
  {
    title: "For Students",
    icon: (
      <path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 3 3 6 3s6-2 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    steps: [
      'Pick a "Task Chain" in your field (Finance, Tech, HR).',
      "Submit real-world deliverables for mentor review.",
      "Unlock your Skill Passport and apply to partner firms.",
    ],
  },
  {
    title: "For Mentors",
    icon: (
      <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6L5.7 21l2.3-7.1-6-4.5h7.6L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    steps: [
      "Create industry-aligned task chains for fresh talent.",
      "Review submissions and provide actionable feedback.",
      "Earn professional points and discover future hires.",
    ],
  },
  {
    title: "For Employers",
    icon: (
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    steps: [
      "Browse pre-vetted talent with proven skill metrics.",
      "Zero-risk hiring based on actual task performance.",
      "Integrate your onboarding with custom task chains.",
    ],
  },
];

export default function Paths() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="font-display text-2xl sm:text-3xl text-ink">Three Paths, One Goal</h2>
        <div className="mx-auto mt-3 w-14 h-0.5 bg-accent rounded-full" />
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {PATHS.map((path) => (
          <div
            key={path.title}
            className="bg-surface border border-line rounded-lg p-6 shadow-card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-md bg-primary/5 text-primary flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {path.icon}
                </svg>
              </span>
              <h3 className="font-semibold text-ink">{path.title}</h3>
            </div>

            <ol className="mt-5 space-y-4">
              {path.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink-soft leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
