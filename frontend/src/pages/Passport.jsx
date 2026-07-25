import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.js";

export default function Passport() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/passport/${userId}/`)
      .then((res) => setData(res.data))
      .catch(() => setError("Skill Passport not found."))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p className="max-w-3xl mx-auto px-6 py-12 text-ink-soft">Loading…</p>;
  if (error) return <p className="max-w-3xl mx-auto px-6 py-12 text-danger">{error}</p>;
  if (!data) return null;

  const initials = (data.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-primary-dark p-6 text-white">
          <p className="text-[11px] font-semibold tracking-widest text-accent uppercase">
            Skill Passport
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-xl font-bold">
              {initials}
            </span>
            <div>
              <h1 className="text-2xl font-bold">{data.name}</h1>
              <p className="text-white/70 text-sm">
                {data.headline || data.career_goal || "Learner at LearnBeyond"}
              </p>
              {data.location && (
                <p className="text-white/50 text-xs mt-0.5">{data.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {data.bio && <p className="text-sm text-ink-soft">{data.bio}</p>}

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {data.study_field && (
              <span className="text-ink-soft">
                <span className="font-semibold text-ink">Field:</span> {data.study_field}
              </span>
            )}
            {data.career_goal && (
              <span className="text-ink-soft">
                <span className="font-semibold text-ink">Goal:</span> {data.career_goal}
              </span>
            )}
          </div>

          {(data.linkedin_url || data.github_url) && (
            <div className="mt-3 flex gap-4 text-sm">
              {data.linkedin_url && (
                <a
                  href={data.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {data.github_url && (
                <a
                  href={data.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub
                </a>
              )}
            </div>
          )}

          <h2 className="mt-8 font-semibold text-ink">
            Verified Certifications {data.certifications?.length > 0 && `(${data.certifications.length})`}
          </h2>

          {(!data.certifications || data.certifications.length === 0) && (
            <div className="mt-3 bg-surface-muted rounded-md p-6 text-center text-sm text-ink-soft">
              No certifications earned yet. Complete a task chain to earn your first verified skill.
            </div>
          )}

          <div className="mt-3 space-y-2">
            {data.certifications?.map((cert) => (
              <div
                key={cert.id || cert.unique_id}
                className="flex items-center justify-between bg-surface-muted rounded-md px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-ink capitalize">
                    {cert.skill} · {cert.level}
                  </p>
                  {cert.chain_title && (
                    <p className="text-xs text-ink-soft">{cert.chain_title}</p>
                  )}
                </div>
                <span className="text-[11px] font-semibold bg-success/15 text-success px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/dashboard" className="text-sm text-primary hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
