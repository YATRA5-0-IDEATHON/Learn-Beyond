import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function fillDemo(role) {
    if (role === "mentor") {
      setEmail("ramesh@learnbeyond.np");
    } else {
      setEmail("sita@learnbeyond.np");
    }
    setPassword("demo1234");
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="card p-8">
        <h1 className="font-display text-2xl text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-soft">Log in to continue your learning journey.</p>

        {error && (
          <div className="mt-4 bg-danger/10 text-danger text-sm rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="mt-6 border-t border-line pt-4">
          <p className="text-xs text-ink-soft mb-2">Quick demo logins (password: demo1234):</p>
          <div className="flex gap-2">
            <button onClick={() => fillDemo("student")} className="btn-ghost !px-3 !py-1.5 text-xs">
              Student
            </button>
            <button onClick={() => fillDemo("mentor")} className="btn-ghost !px-3 !py-1.5 text-xs">
              Mentor
            </button>
          </div>
        </div>

        <p className="mt-6 text-sm text-ink-soft text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
