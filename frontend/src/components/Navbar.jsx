import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3L2 8l10 5 10-5-10-5z" fill="#2A1F7D" />
        <path d="M4 10.5v4.2c0 1.2 3.6 3.3 8 3.3s8-2.1 8-3.3v-4.2l-8 4-8-4z" fill="#332B96" />
      </svg>
      <span className="text-lg font-bold tracking-tight text-primary">
        Learn<span className="text-accent">Beyond</span>
      </span>
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-page/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5 text-sm font-medium">
          {user ? (
            <>
              <Link to="/chains" className="hidden sm:inline text-ink-soft hover:text-primary">
                Browse Chains
              </Link>
              <Link to="/dashboard" className="text-ink-soft hover:text-primary">
                Dashboard
              </Link>
              <span className="hidden sm:inline text-xs bg-surface-muted text-ink-soft px-2.5 py-1 rounded-full capitalize">
                {user.role}
              </span>
              <span className="hidden md:inline text-ink font-semibold">{user.name}</span>
              <button onClick={handleLogout} className="btn-ghost !px-4 !py-1.5">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ink-soft hover:text-primary">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
