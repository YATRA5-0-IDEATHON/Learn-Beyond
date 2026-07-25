import React from "react";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 pb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left copy */}
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
            <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold text-sm px-6 py-3 rounded-full shadow-card transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L2 8l10 5 10-5-10-5z" fill="currentColor" />
                <path d="M4 10.5v4.2c0 1.2 3.6 3.3 8 3.3s8-2.1 8-3.3v-4.2" stroke="currentColor" strokeWidth="1.6" fill="none" />
              </svg>
              Register as Student
            </button>
            <button className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold text-sm px-6 py-3 rounded-full shadow-card transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6L5.7 21l2.3-7.1-6-4.5h7.6L12 2z" fill="currentColor" />
              </svg>
              Join as Mentor
            </button>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden shadow-card">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
              alt="Mentor working with student"
              className="w-full h-72 object-cover"
            />
          </div>

          {/* Phone mockup */}
          <div className="absolute -right-2 -bottom-8 w-40 sm:w-44 rounded-3xl border-4 border-primary-dark bg-primary-dark shadow-2xl overflow-hidden rotate-3">
            <div className="bg-primary-dark px-3 py-2 text-center">
              <p className="text-[9px] text-accent font-semibold tracking-wide">
                My Skill Passport
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1580894742597-87bc8789db3d?auto=format&fit=crop&w=400&q=80"
              alt="Skill passport preview"
              className="w-full h-52 object-cover opacity-95"
            />
          </div>

          {/* Verified badge */}
          <div className="absolute left-2 -bottom-4 bg-surface rounded-lg shadow-card px-3 py-2 flex items-center gap-2 border border-line">
            <span className="w-6 h-6 rounded-full bg-success/15 text-success flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold text-ink">Skill Verified</p>
              <p className="text-[9px] text-ink-soft">by Expert at Nepal Rastra Bank</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
