import React from "react";
import Logo from "./Logo.jsx";

const COLUMNS = [
  { title: "Platform", links: ["Browse Mentors", "Tasks", "Companies"] },
  { title: "Community", links: ["Mentors", "Success Stories"] },
  { title: "Support", links: ["FAQ", "Contact"] },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-ink-soft max-w-[14rem]">
            Learn by Doing Real Work. Get Hired for Real Skills.
          </p>
          <div className="mt-4 flex items-center gap-3 text-ink-soft">
            <a href="#" aria-label="Share" className="hover:text-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" />
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" />
                <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </a>
            <a href="#" aria-label="Community" className="hover:text-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#" aria-label="Feed" className="hover:text-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 11a9 9 0 019 9M4 4a16 16 0 0116 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="5" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-ink">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-ink-soft hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-ink-soft">
            © 2024 LearnBeyond. All rights reserved.
          </p>
          <span className="inline-flex items-center gap-2 text-xs font-medium bg-success/10 text-success px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Built for Nepal's future
          </span>
        </div>
      </div>
    </footer>
  );
}
