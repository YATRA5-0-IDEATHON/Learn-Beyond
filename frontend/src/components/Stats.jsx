import React from "react";

const STATS = [
  { value: "2,400+", label: "Verified Mentors", color: "text-accent" },
  { value: "15,000+", label: "Tasks Completed", color: "text-white" },
  { value: "340+", label: "Companies Hiring", color: "text-success" },
];

export default function Stats() {
  return (
    <section className="bg-primary-dark">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-3 gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-widest text-white/60">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
