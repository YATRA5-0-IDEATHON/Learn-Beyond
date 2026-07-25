import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../auth.jsx";

// Shows all certificates for a student; the newest is rendered as a printable certificate.
export default function Certificate() {
  const { studentId } = useParams();
  const { user } = useAuth();
  const id = studentId || user?.id;
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/certifications/student/${id}/`)
      .then((res) => setCerts(res.data))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-3xl mx-auto px-6 py-12 text-ink-soft">Loading…</p>;

  if (!certs.length)
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="text-ink-soft">No certificate yet. Finish all stages and get verified by your mentor.</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex">Back to dashboard</Link>
      </div>
    );

  const cert = certs[0];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 print:py-0">
      <div className="flex justify-between items-center mb-4 print:hidden">
        <Link to="/dashboard" className="text-sm text-primary hover:underline">← Back</Link>
        <button onClick={() => window.print()} className="btn-ghost">🖨️ Print / Save PDF</button>
      </div>

      <div className="relative bg-surface border-4 border-primary rounded-2xl p-10 text-center overflow-hidden">
        <div className="absolute inset-0 border-[3px] border-accent/40 m-3 rounded-xl pointer-events-none" />

        <p className="text-[11px] font-semibold tracking-[0.3em] text-accent uppercase">LearnBeyond</p>
        <h1 className="mt-4 font-display text-3xl text-ink">Certificate of Completion</h1>
        <p className="mt-6 text-sm text-ink-soft">This certifies that</p>
        <p className="mt-2 font-display text-4xl text-primary">{cert.student_name}</p>
        <p className="mt-5 text-sm text-ink-soft max-w-md mx-auto">
          has successfully completed all stages of the
        </p>
        <p className="mt-1 text-xl font-semibold text-ink capitalize">
          {cert.chain_title || `${cert.skill} · ${cert.level}`}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          demonstrating verified, real-world skills through mentor-reviewed tasks and a live video assessment.
        </p>

        <div className="mt-8 flex items-end justify-between px-4">
          <div className="text-left">
            <p className="font-display text-lg text-ink border-b border-line pb-1">{cert.mentor_name}</p>
            <p className="text-[11px] text-ink-soft mt-1">Verifying Mentor · {cert.mentor_employer}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-ink-soft">Issued {new Date(cert.issued_at).toLocaleDateString()}</p>
            <p className="text-[11px] text-ink-soft mt-1">
              ID: <span className="font-mono text-ink">{cert.cert_unique_id}</span>
            </p>
            <span className="inline-block mt-2 text-[11px] font-semibold bg-success/15 text-success px-3 py-1 rounded-full">
              ✔ Blockchain-style Verified
            </span>
          </div>
        </div>
      </div>

      {/* Share / CV actions */}
      <div className="mt-6 card p-5 print:hidden">
        <p className="font-semibold text-ink">Share your achievement</p>
        <p className="text-sm text-ink-soft mt-1">
          Add this verified credential to your CV and LinkedIn. Employers can verify it with the ID above.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link to={`/passport/${id}`} className="btn-primary">View my Skill Passport</Link>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                `${window.location.origin}/passport/${id}`
              );
              alert("Shareable profile link copied to clipboard!");
            }}
            className="btn-ghost"
          >
            🔗 Copy profile link
          </button>
        </div>
      </div>

      {certs.length > 1 && (
        <div className="mt-6">
          <p className="font-semibold text-ink">Other certifications</p>
          <div className="mt-2 space-y-2">
            {certs.slice(1).map((c) => (
              <div key={c.id} className="flex justify-between bg-surface-muted rounded-md px-4 py-3 text-sm">
                <span className="capitalize text-ink">{c.chain_title || `${c.skill} · ${c.level}`}</span>
                <span className="font-mono text-xs text-ink-soft">{c.cert_unique_id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
