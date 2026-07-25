import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api.js";

export default function Mentors() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const [mentors, setMentors] = useState(state.mentors || []);
  const [label] = useState(state.label || "");
  const [skill] = useState(state.skill || "");
  const [loading, setLoading] = useState(!state.mentors);
  const [payFor, setPayFor] = useState(null); // mentor being "paid"
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (state.mentors?.length) return;
    api
      .get("/mentors/")
      .then((res) => setMentors(res.data))
      .catch(() => setMentors([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function confirmAndStart(mentor) {
    setProcessing(true);
    try {
      // Find the chain for the recommended skill (fallback: this mentor's first chain).
      let chainId = null;
      if (skill) {
        const { data } = await api.get(`/chains/?skill=${skill}`);
        if (data.length) chainId = data[0].id;
      }
      if (!chainId) {
        const { data } = await api.get("/chains/");
        const match = data.find((c) => c.mentor_name === mentor.name) || data[0];
        chainId = match?.id;
      }
      if (!chainId) throw new Error("no chain");
      await api.post("/chains/enroll/", { chain_id: chainId });
      navigate(`/chains/${chainId}`);
    } catch {
      setProcessing(false);
      setPayFor(null);
      alert("Could not start the chain. Please try browsing chains.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink">
        {label ? `Top mentors for ${label}` : "Browse Mentors"}
      </h1>
      <p className="mt-1 text-ink-soft">
        Hand-picked, LinkedIn-verified industry experts. Choose one to start your task chain.
      </p>

      {loading && <p className="mt-6 text-ink-soft">Loading…</p>}

      <div className="mt-6 space-y-5">
        {mentors.map((m) => (
          <div key={m.id} className="card p-6">
            <div className="flex items-start gap-4 flex-wrap">
              <img src={m.avatar_url} alt={m.name} className="w-16 h-16 rounded-full bg-surface-muted" />
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-ink text-lg">{m.name}</h3>
                  {m.is_verified && (
                    <span className="text-[11px] font-semibold bg-success/15 text-success px-2 py-0.5 rounded-full">
                      ✔ LinkedIn Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-soft">{m.job_title} · {m.employer}</p>
                <div className="mt-1 flex items-center gap-3 text-sm">
                  <span className="text-accent font-semibold">★ {m.rating}</span>
                  <span className="text-ink-soft">{m.total_sessions} sessions</span>
                  <span className="text-ink-soft">{m.years_experience} yrs exp</span>
                  {m.linkedin_url && (
                    <a href={m.linkedin_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-ink">NPR {m.session_rate}</p>
                <p className="text-[11px] text-ink-soft">per verification session</p>
                <button onClick={() => setPayFor(m)} className="btn-primary mt-2">
                  Select & Pay
                </button>
              </div>
            </div>

            {m.bio && <p className="mt-4 text-sm text-ink-soft">{m.bio}</p>}

            {m.reviews?.length > 0 && (
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-xs font-semibold text-ink uppercase tracking-wide mb-2">Student Reviews</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {m.reviews.map((r, i) => (
                    <div key={i} className="bg-surface-muted rounded-md p-3">
                      <p className="text-[11px] text-accent">{"★".repeat(r.rating)}</p>
                      <p className="text-xs text-ink mt-1">"{r.text}"</p>
                      <p className="text-[11px] text-ink-soft mt-1">— {r.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mock payment modal */}
      {payFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6">
            <h3 className="font-display text-xl text-ink">Confirm Payment</h3>
            <p className="mt-1 text-sm text-ink-soft">
              You're booking <span className="font-semibold text-ink">{payFor.name}</span> to mentor and verify your journey.
            </p>
            <div className="mt-4 bg-surface-muted rounded-md p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-soft">Mentor session</span><span className="text-ink">NPR {payFor.session_rate}</span></div>
              <div className="flex justify-between"><span className="text-ink-soft">Platform fee</span><span className="text-ink">NPR 0</span></div>
              <div className="flex justify-between font-semibold border-t border-line pt-2"><span className="text-ink">Total</span><span className="text-ink">NPR {payFor.session_rate}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 inline-flex items-center justify-center gap-2 bg-[#5C2D91] text-white font-semibold text-sm py-3 rounded-full">
                🟣 eSewa
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 bg-[#5A2D82] text-white font-semibold text-sm py-3 rounded-full">
                Khalti
              </button>
            </div>
            <button
              onClick={() => confirmAndStart(payFor)}
              disabled={processing}
              className="btn-primary w-full mt-3"
            >
              {processing ? "Processing payment…" : `Pay NPR ${payFor.session_rate} & Start`}
            </button>
            <button onClick={() => setPayFor(null)} disabled={processing} className="w-full mt-2 text-sm text-ink-soft hover:underline">
              Cancel
            </button>
            <p className="mt-2 text-[11px] text-center text-ink-soft">Demo mode — payment is simulated.</p>
          </div>
        </div>
      )}
    </div>
  );
}
