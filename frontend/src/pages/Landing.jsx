import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth.jsx";

const STATS = [
  { value: "2,400+", label: "Verified Mentors", color: "text-accent" },
  { value: "15,000+", label: "Tasks Completed", color: "text-white" },
  { value: "340+", label: "Companies Hiring", color: "text-success" },
];

const PATHS = [
  {
    title: "For Students",
    steps: [
      "Pick a Task Chain in your field (Accounting, Web Dev, Business).",
      "Submit real-world deliverables for mentor review.",
      "Unlock your Skill Passport and apply to partner firms.",
    ],
  },
  {
    title: "For Mentors",
    steps: [
      "Register with your LinkedIn and industry experience.",
      "Review submissions and give actionable feedback.",
      "Earn professional points and discover future hires.",
    ],
  },
  {
    title: "For Employers",
    steps: [
      "Browse pre-vetted talent with proven skill metrics.",
      "Zero-risk hiring based on actual task performance.",
      "Integrate onboarding with custom task chains.",
    ],
  },
];

export default function Landing() {
  const { user } = useAuth();
  const primaryTo = user ? "/dashboard" : "/register";

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-surface border border-line rounded-full px-3 py-1 text-xs font-medium text-primary shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Nepal's First Task-Based Learning Platform
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl leading-tight text-ink">
              Learn by <span className="italic text-primary">Doing</span> Real Work.
              <br />
              Get Hired for <span className="text-accent">Real Skills.</span>
            </h1>
            <p className="mt-5 text-ink-soft text-base leading-relaxed max-w-md">
              Bridge the gap between campus and career. Master tasks assigned by
              industry experts and build a verified Skill Passport that local
              employers trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={primaryTo} className="btn-primary">
                {user ? "Go to Dashboard" : "Register as Student"}
              </Link>
              {!user && (
                <Link to="/register?role=mentor" className="btn-accent">
                  Join as Mentor
                </Link>
              )}
            </div>
          </div>

          <div className="card p-6">
            <p className="text-[11px] font-semibold tracking-widest text-accent uppercase">
              Your Journey in 4 Steps
            </p>
            <div className="mt-4 space-y-3">
              {[
                { n: "1", t: "Tell our AI what you study & love", d: "Get a personalized skill path" },
                { n: "2", t: "Pick a verified expert mentor", d: "Rated & LinkedIn-verified" },
                { n: "3", t: "Complete real project stages", d: "Video lessons + mentor reviews" },
                { n: "4", t: "Earn a verified certificate", d: "Share it on your CV & profile" },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-3 bg-surface-muted rounded-md px-3 py-2.5">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{s.t}</p>
                    <p className="text-xs text-ink-soft">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Paths */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-ink">Three Paths, One Goal</h2>
          <div className="mx-auto mt-3 w-14 h-0.5 bg-accent rounded-full" />
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {PATHS.map((path) => (
            <div key={path.title} className="card p-6">
              <h3 className="font-semibold text-ink">{path.title}</h3>
              <ol className="mt-4 space-y-3">
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

      {/* CTA */}
      <section className="bg-primary">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white">
            Ready to build your career brick by brick?
          </h2>
          <p className="mt-4 text-white/70 text-sm sm:text-base max-w-xl mx-auto">
            Join the community that values evidence over theory. Build your Skill
            Passport and get matched with employers hiring in Nepal today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to={primaryTo} className="btn-accent">
              {user ? "Go to Dashboard" : "Create Student Account"}
            </Link>
            {!user && (
              <Link
                to="/register?role=mentor"
                className="inline-flex items-center gap-2 bg-primary-light hover:bg-primary-light/80 text-white font-semibold text-sm px-6 py-3 rounded-full border border-white/20"
              >
                Join as Mentor
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-surface border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-ink-soft">© 2026 LearnBeyond. All rights reserved.</p>
          <span className="inline-flex items-center gap-2 text-xs font-medium bg-success/10 text-success px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Built for Nepal's future
          </span>
        </div>
      </footer>
    </div>
  );
}
