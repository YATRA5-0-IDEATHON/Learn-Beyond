import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "mentor" ? "mentor" : "student";

  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    linkedin_url: "",
    job_title: "",
    employer: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
      };
      if (role === "mentor") {
        payload.linkedin_url = form.linkedin_url.trim();
        payload.job_title = form.job_title.trim();
        payload.employer = form.employer.trim();
      } else if (form.linkedin_url.trim()) {
        payload.linkedin_url = form.linkedin_url.trim();
      }
      const created = await register(payload);
      navigate(created.role === "student" ? "/onboarding" : "/dashboard");

    } catch (err) {
      const data = err.response?.data;
      let msg = "Registration failed. Please check your details.";
      if (data) {
        if (data.email) msg = `Email: ${data.email[0]}`;
        else if (data.password) msg = `Password: ${data.password[0]}`;
        else if (data.linkedin_url) msg = `LinkedIn URL: ${data.linkedin_url[0]}`;
        else if (typeof data === "object") {
          const first = Object.values(data)[0];
          if (first) msg = Array.isArray(first) ? first[0] : String(first);
        }
      }
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-14">
      <div className="card p-8">
        <h1 className="font-display text-2xl text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Join LearnBeyond and start building real, verified skills.
        </p>

        {/* Role selector */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { key: "student", title: "I'm a Student", desc: "Learn by doing real tasks" },
            { key: "mentor", title: "I'm a Mentor", desc: "Guide and verify talent" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setRole(opt.key)}
              className={`text-left rounded-md border p-4 transition-colors ${
                role === opt.key
                  ? "border-primary bg-primary/5"
                  : "border-line hover:border-primary/40"
              }`}
            >
              <p className="font-semibold text-ink text-sm">{opt.title}</p>
              <p className="text-xs text-ink-soft mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-5 bg-danger/10 text-danger text-sm rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input
              type="text"
              required
              className="field"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="field"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="field"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          {role === "mentor" && (
            <div className="space-y-4 rounded-md bg-surface-muted/60 border border-line p-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                Mentor details
              </p>
              <div>
                <label className="label">LinkedIn profile URL</label>
                <input
                  type="url"
                  required
                  className="field"
                  value={form.linkedin_url}
                  onChange={(e) => update("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                />
                <p className="mt-1 text-[11px] text-ink-soft">
                  Used to verify your professional identity.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Job title</label>
                  <input
                    type="text"
                    className="field"
                    value={form.job_title}
                    onChange={(e) => update("job_title", e.target.value)}
                    placeholder="e.g. Chartered Accountant"
                  />
                </div>
                <div>
                  <label className="label">Employer</label>
                  <input
                    type="text"
                    className="field"
                    value={form.employer}
                    onChange={(e) => update("employer", e.target.value)}
                    placeholder="e.g. Deloitte Nepal"
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Creating account…" : `Register as ${role === "mentor" ? "Mentor" : "Student"}`}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-soft text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
