import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../auth.jsx";
import PortfolioReport from "../components/PortfolioReport.jsx";


function formatWhen(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString([], {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function MentorDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");
  const [ready, setReady] = useState([]);
  const [certifiedId, setCertifiedId] = useState(null);
  const [msessions, setMsessions] = useState([]);
  const [when, setWhen] = useState({});

  function load() {
    return Promise.all([
      api.get("/submissions/pending/").then((res) => setPending(res.data)).catch(() => {}),
      api.get("/certifications/ready/").then((res) => setReady(res.data)).catch(() => {}),
      api.get("/sessions/mentor/").then((res) => setMsessions(res.data)).catch(() => {}),
    ]);
  }

  async function schedule(sess) {
    const dt = when[sess.id];
    if (!dt) {
      setNotice("Pick a date and time first.");
      return;
    }
    setBusyId(sess.id);
    setNotice("");
    try {
      await api.patch(`/sessions/${sess.id}/schedule/`, {
        scheduled_at: new Date(dt).toISOString(),
      });
      setNotice(`Session scheduled with ${sess.student_name}.`);
      await load();
    } catch {
      setNotice("Could not schedule the session.");
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  async function certify(item) {
    setBusyId(item.enrollment_id);
    setNotice("");
    try {
      const { data } = await api.post("/certifications/complete/", {
        chain_id: item.chain_id,
        student_id: item.student_id,
      });
      setCertifiedId(data.cert_unique_id);
      setNotice(`🎓 Certificate issued to ${item.student_name}! ID: ${data.cert_unique_id}`);
      await load();
    } catch {
      setNotice("Could not issue certificate.");
    } finally {
      setBusyId(null);
    }
  }


  async function review(sub, status) {
    setBusyId(sub.id);
    setNotice("");
    try {
      await api.patch(`/submissions/${sub.id}/review/`, {
        status,
        mentor_feedback: feedback[sub.id] || "",
      });
      setNotice(
        status === "approved"
          ? "Approved — student unlocked the next task."
          : "Feedback sent to student."
      );
      await load();
    } catch {
      setNotice("Could not submit review.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Mentor Dashboard</h1>
          <p className="mt-1 text-ink-soft">
            Welcome, {user?.name}. Review student submissions below.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <a href="/projects" className="btn-ghost">
            💼 Paid Projects
          </a>
          <a href="/chains/new" className="btn-primary">
            🤖 Create Chain with AI
          </a>
        </div>
      </div>


      {notice && (
        <div className="mt-4 bg-primary/5 text-primary text-sm rounded-md px-4 py-2">{notice}</div>
      )}
      {error && <p className="mt-4 text-danger">{error}</p>}

      {/* Students ready for the final video session + certification */}
      {ready.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-ink">🎥 Ready for Final Video Session ({ready.length})</h2>
          <p className="text-sm text-ink-soft mt-1">
            These students finished every stage. Run a quick video call, verify their work is original, then certify them.
          </p>
          <div className="mt-4 space-y-4">
            {ready.map((item) => (
              <div key={item.enrollment_id} className="card p-6 border-2 border-accent/30">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-ink">{item.student_name}</h3>
                    <p className="text-xs text-ink-soft capitalize">{item.chain_title}</p>
                  </div>
                  <span className="text-[11px] font-semibold bg-success/15 text-success px-2 py-0.5 rounded-full">
                    All stages passed
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={item.video_link} target="_blank" rel="noreferrer" className="btn-ghost">
                    🎥 Start video session
                  </a>
                  <button
                    onClick={() => certify(item)}
                    disabled={busyId === item.enrollment_id}
                    className="btn-primary"
                  >
                    {busyId === item.enrollment_id ? "Issuing…" : "✅ Verify & Issue Certificate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-task video session requests */}
      {(() => {
        const active = msessions.filter(
          (s) => s.task && ["requested", "scheduled"].includes(s.session_status)
        );
        if (active.length === 0) return null;
        return (
          <div className="mt-8">
            <h2 className="font-semibold text-ink">📅 Video Session Requests ({active.length})</h2>
            <p className="text-sm text-ink-soft mt-1">
              Students want to discuss a task with you. Pick a time, then meet them on the call.
            </p>
            <div className="mt-4 space-y-4">
              {active.map((s) => (
                <div key={s.id} className="card p-6 border-2 border-accent/20">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-ink">{s.student_name}</h3>
                      <p className="text-xs text-ink-soft">
                        {s.task_title} · {s.chain_title}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        s.session_status === "scheduled"
                          ? "bg-accent/15 text-accent"
                          : "bg-warning/15 text-warning"
                      }`}
                    >
                      {s.session_status === "scheduled" ? "Scheduled" : "Awaiting time"}
                    </span>
                  </div>

                  {s.session_status === "scheduled" ? (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <p className="text-sm text-ink">
                        📅 <span className="font-semibold">{formatWhen(s.scheduled_at)}</span>
                      </p>
                      <a href={`/session/${s.id}`} className="btn-primary text-sm">
                        🎥 Join call
                      </a>
                      <button
                        onClick={() => setMsessions((m) => m.map((x) =>
                          x.id === s.id ? { ...x, session_status: "requested" } : x))}
                        className="btn-ghost text-sm"
                      >
                        Reschedule
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <input
                        type="datetime-local"
                        className="field max-w-xs"
                        value={when[s.id] || ""}
                        onChange={(e) => setWhen((w) => ({ ...w, [s.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => schedule(s)}
                        disabled={busyId === s.id}
                        className="btn-primary text-sm"
                      >
                        {busyId === s.id ? "Scheduling…" : "Confirm time"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Portfolio report editor — mentor-submitted skills, recommendation, notes */}
      <PortfolioReport />

      <h2 className="mt-8 font-semibold text-ink">
        Pending reviews {pending.length > 0 && `(${pending.length})`}
      </h2>


      {loading && <p className="mt-4 text-ink-soft">Loading…</p>}
      {!loading && pending.length === 0 && (
        <div className="mt-4 card p-8 text-center text-ink-soft">
          🎉 All caught up! No pending submissions.
        </div>
      )}

      <div className="mt-4 space-y-5">
        {pending.map((sub) => (
          <div key={sub.id} className="card p-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-semibold text-ink">{sub.task_title}</h3>
              <span className="text-xs text-ink-soft">
                {sub.student_name} · attempt {sub.attempt_number}
              </span>
            </div>

            <div className="mt-3 bg-surface-muted rounded-md p-4 text-sm text-ink">
              {sub.image_upload ? (
                <a href={sub.image_upload} target="_blank" rel="noreferrer">
                  <img src={sub.image_upload} alt="submission" className="max-h-64 rounded-lg border border-line" />
                </a>
              ) : sub.file_upload ? (
                <a href={sub.file_upload} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  📎 Download submitted file
                </a>
              ) : sub.code_content ? (
                <pre className="whitespace-pre-wrap font-mono text-xs overflow-x-auto">{sub.code_content}</pre>
              ) : sub.github_url || sub.live_url ? (
                <a href={sub.github_url || sub.live_url} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">
                  {sub.github_url || sub.live_url}
                </a>
              ) : (
                <span className="whitespace-pre-wrap">{sub.text_content || "(no content)"}</span>
              )}
            </div>


            <textarea
              className="field mt-4 min-h-[80px] resize-y"
              placeholder="Feedback for the student (optional)…"
              value={feedback[sub.id] || ""}
              onChange={(e) => setFeedback((f) => ({ ...f, [sub.id]: e.target.value }))}
            />

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                onClick={() => review(sub, "approved")}
                disabled={busyId === sub.id}
                className="btn-primary"
              >
                {busyId === sub.id ? "Saving…" : "Approve"}
              </button>
              <button
                onClick={() => review(sub, "revision_requested")}
                disabled={busyId === sub.id}
                className="btn-ghost"
              >
                Request revision
              </button>
              <button
                onClick={() => review(sub, "rejected")}
                disabled={busyId === sub.id}
                className="inline-flex items-center gap-2 bg-danger/10 text-danger font-semibold text-sm px-6 py-3 rounded-full hover:bg-danger/20 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
