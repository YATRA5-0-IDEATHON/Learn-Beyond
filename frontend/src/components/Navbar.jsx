import React from "react";
import Logo from "./Logo.jsx";

const NAV_LINKS = ["Browse Mentors", "Task Chains", "Skill Passport", "Dashboard"];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-page/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Logo />

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href="#"
              className={`transition-colors hover:text-primary ${
                i === 0 ? "text-primary font-semibold" : "text-ink-soft"
              }`}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-surface border border-line rounded-full px-3 py-1.5 text-sm text-ink-soft w-44">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Search...</span>
          </div>

          <button
            className="relative text-ink-soft hover:text-primary transition-colors"
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.7 21a2 2 0 01-3.4 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent" />
          </button>

          <img
            src="https://i.pravatar.cc/64?img=68"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-line"
          />
        </div>
      </div>
    </header>
  );
}
