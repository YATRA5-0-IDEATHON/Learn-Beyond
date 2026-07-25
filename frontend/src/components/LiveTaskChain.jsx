import React from "react";

const LEVELS = [
  { level: "Level 1", title: "Excel Foundations & Data Cleaning", status: "Completed", progress: 100 },
  { level: "Level 2", title: "SQL for Business Insights", status: "32% Submitted", progress: 32 },
  { level: "Level 3", title: "Python for Data Viz", status: "Locked", progress: 0 },
  { level: "Level 4", title: "Advanced PowerBI Dashboard", status: "Locked", progress: 0 },
  { level: "Capstone", title: "Real Client Data Project", status: "Locked", progress: 0 },
];

export default function LiveTaskChain() {
  return (
    <section className="bg-surface-muted/60">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-accent uppercase">
              Live Task Chain
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl text-ink">
              Data Analyst Track
            </h2>
          </div>
          <a href="#" className="text-sm font-medium text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            Explore all chains
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {LEVELS.map((lvl) => {
            const locked = lvl.status === "Locked";
            const completed = lvl.status === "Completed";
            return (
              <div
                key={lvl.level}
                className={`rounded-lg border p-4 bg-surface shadow-card ${
                  locked ? "border-line opacity-60" : "border-primary/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                      completed
                        ? "bg-success/15 text-success"
                        : locked
                        ? "bg-line text-ink-soft"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {locked ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    ) : completed ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      "»"
                    )}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-ink-soft">
                    {lvl.level}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-ink leading-snug min-h-[2.5rem]">
                  {lvl.title}
                </p>

                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-line overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        completed ? "bg-success" : "bg-primary"
                      }`}
                      style={{ width: `${lvl.progress}%` }}
                    />
                  </div>
                  <p
                    className={`mt-2 text-[11px] font-medium ${
                      completed
                        ? "text-success"
                        : locked
                        ? "text-ink-soft"
                        : "text-primary"
                    }`}
                  >
                    {lvl.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
