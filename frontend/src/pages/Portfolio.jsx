import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.js";

const REC_STYLE = {
  High: "bg-success/15 text-success",
  Medium: "bg-warning/15 text-warning",
  Low: "bg-danger/10 text-danger",
};

function gradeColor(grade) {
  const g = (grade || "").toUpperCase();
  if (g.startsWith("A")) return "text-success";
  if (g.startsWith("B")) return "text-primary";
  if (g.startsWith("C")) return "text-warning";
  return "text-danger";
}

function StatBox({ label, value, sub }) {
  return (
    <div className="bg-surface-muted rounded-lg px-4 py-3 text-center">
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      {sub && <p className="text-[11px] text-ink-soft mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Portfolio() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get(`/passport/p/${slug}/`)
      .then((res) => setData(res.data))
      .catch(() => setError("Portfolio not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-12 text-ink-soft">Loading…</p>;
  if (error) return <p className="max-w-4xl mx-auto px-6 py-12 text-danger">{error}</p>;
  if (!data) return null;

  const initials = (data.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const shareUrl = `learnbeyond.np/p/${data.slug}`;
  const latest = data.latest_certification;
  const reports = data.skill_reports || [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Shareable URL bar */}
      <div className="card p-3 flex items-center justify-between gap-3 flex-wrap mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">
            Public Portfolio
          </span>
          <span className="text-sm text-ink-soft truncate">{shareUrl}</span>
        </div>
        <button onClick={copyLink} className="btn-primary text-sm shrink-0">
          {copied ? "✓ Copied" : "Copy Link"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left identity column */}
        <aside className="md:col-span-1">
          <div className="card p-6 text-center">
            <div className="relative inline-block">
              <span className="w-24 h-24 rounded-full bg-accent text-white flex items-center justify-center text-3xl font-bold mx-auto">
                {initials}
              </span>
              <span
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-success text-white text-xs flex items-center justify-center ring-2 ring-white"
                title="Verified learner"
              >
                ✓
              </span>
            </div>
            <h1 className="mt-4 text-xl font-bold text-ink">{data.name}</h1>
            {data.headline && (
              <p className="text-sm text-primary font-medium">{data.headline}</p>
            )}
            {data.location && (
              <p className="text-xs text-ink-soft mt-0.5">{data.location}</p>
            )}
            {data.bio && <p className="mt-4 text-sm text-ink-soft">{data.bio}</p>}

            {data.mentor_recommendation && (
              <div className="mt-5 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                  Mentor Recommendation
                </p>
                <span
                  className={`mt-1 inline-block text-sm font-bold px-3 py-1 rounded-full ${
                    REC_STYLE[data.mentor_recommendation] || "bg-surface-muted text-ink"
                  }`}
                >
                  {data.mentor_recommendation}
                </span>
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <StatBox label="Verified Tasks" value={data.verified_tasks} />
              <StatBox label="Proficiency" value={`${data.overall_proficiency}%`} />
            </div>

            {data.project_earnings > 0 && (
              <div className="mt-3 bg-success/10 rounded-lg px-4 py-3 text-center">
                <p className="text-2xl font-bold text-success">
                  NPR {Number(data.project_earnings).toLocaleString()}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                  Earned from real projects
                </p>
              </div>
            )}

            {(data.linkedin_url || data.github_url) && (
              <div className="mt-5 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-1">
                  Connected Profiles
                </p>
                <div className="flex gap-3 text-sm">
                  {data.linkedin_url && (
                    <a href={data.linkedin_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      LinkedIn
                    </a>
                  )}
                  {data.github_url && (
                    <a href={data.github_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right content column */}
        <main className="md:col-span-2 space-y-6">
          {/* Latest certification banner */}
          {latest && (
            <div className="card overflow-hidden">
              <div className="bg-primary-dark text-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
                  Latest Certification
                </p>
                <h2 className="mt-1 text-lg font-bold capitalize">
                  {latest.skill} · {latest.level}
                </h2>
                {latest.chain_title && (
                  <p className="text-white/70 text-sm">{latest.chain_title}</p>
                )}
                {latest.mentor_name && (
                  <p className="text-white/50 text-xs mt-1">
                    Verified by {latest.mentor_name}
                    {latest.mentor_employer ? ` · ${latest.mentor_employer}` : ""}
                  </p>
                )}
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold bg-success/15 text-success px-2 py-0.5 rounded-full">
                  ✓ Verified · {latest.cert_unique_id}
                </span>
                <span className="text-xs text-ink-soft">
                  Issued {latest.issued_at ? new Date(latest.issued_at).toLocaleDateString() : ""}
                </span>
              </div>

            </div>
          )}

          {/* Skill performance report */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">Skill Performance Report</h2>
              <span className="text-sm font-bold text-ink">
                Overall Proficiency: <span className="text-success">{data.overall_proficiency}%</span>
              </span>
            </div>

            {reports.length === 0 && (
              <p className="mt-4 text-sm text-ink-soft">
                No mentor-graded skills yet.
              </p>
            )}

            <div className="mt-4 space-y-4">
              {reports.map((r) => {
                const pct = r.tasks_total
                  ? Math.round((r.tasks_completed / r.tasks_total) * 100)
                  : 0;
                return (
                  <div key={r.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">{r.skill_area}</p>
                      <span className={`text-lg font-bold ${gradeColor(r.grade)}`}>
                        {r.grade}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-ink-soft">
                      <span>⏱ {r.practical_hours} practical hrs</span>
                      <span>✓ {r.tasks_completed}/{r.tasks_total} tasks</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-line overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 bg-surface-muted rounded-md px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                Employer Trust Factor
              </p>
              <p className="text-sm text-ink mt-0.5">
                Every task and certification is mentor-verified through live video review.
              </p>
            </div>
          </div>

          {/* Mentor study comments */}
          {data.study_comments?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-ink">Mentor Study Notes</h2>
              <ul className="mt-3 space-y-3">
                {data.study_comments.map((c) => (
                  <li key={c.id} className="border-l-2 border-accent pl-3">
                    <p className="text-sm text-ink-soft">{c.text}</p>
                    <p className="text-[11px] text-ink-soft/70 mt-0.5">
                      — {c.mentor_name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
