import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../auth.jsx";

// Turn a YouTube watch URL into an embeddable URL.
function embed(url) {
  const m = url?.match(/[?&]v=([^&]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

function formatWhen(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString([], {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function ChainDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [chain, setChain] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [sessions, setSessions] = useState([]);
  const [busyTask, setBusyTask] = useState(null);

  async function load() {
    const [chainRes, enrollRes, sessRes] = await Promise.all([
      api.get(`/chains/${id}/`),
      api.get("/chains/my/").catch(() => ({ data: [] })),
      api.get("/sessions/my/").catch(() => ({ data: [] })),
    ]);
    setChain(chainRes.data);
    const mine = (enrollRes.data || []).find((e) => e.chain?.id === id);
    setEnrollment(mine || null);
    setSessions(sessRes.data || []);
  }

  // Latest per-task session for this student (task-linked, not certification).
  function sessionForTask(taskId) {
    return sessions.find((s) => s.task === taskId);
  }

  async function requestSession(task) {
    setBusyTask(task.id);
    setNotice("");
    try {
      await api.post("/sessions/request/", { task_id: task.id });
      setNotice("Video review requested! Your mentor will pick a time.");
      await load();
    } catch {
      setNotice("Could not request a session. Please try again.");
    } finally {
      setBusyTask(null);
    }
  }

  useEffect(() => {
    setLoading(true);
    load()
      .catch(() => setError("Could not load this chain."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleEnroll() {
    setNotice("");
    try {
      await api.post("/chains/enroll/", { chain_id: id });
      await load();
      setNotice("Enrolled! You can now start the first task.");
    } catch {
      setError("Could not enroll. Please try again.");
    }
  }

  async function handleSubmit(task) {
    setSubmitting(true);
    setNotice("");
    try {
      await api.post("/submissions/", {
        task_id: task.id,
        submission_type: "text",
        text_content: answer,
      });
      setAnswer("");
      setNotice("Submitted! Your mentor will review it soon.");
      await load();
    } catch (err) {
      setNotice(err.response?.data?.error || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-12 text-ink-soft">Loading…</p>;
  if (error) return <p className="max-w-4xl mx-auto px-6 py-12 text-danger">{error}</p>;
  if (!chain) return null;

  const isStudent = user?.role === "student";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/chains" className="text-sm text-primary hover:underline">
        ← Back to chains
      </Link>

      <div className="mt-4 card p-6">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full capitalize">
            {chain.skill}
          </span>
          <span className="text-[11px] text-ink-soft capitalize">{chain.level}</span>
          {chain.mentor_verified && (
            <span className="text-[11px] font-semibold bg-success/15 text-success px-2 py-0.5 rounded-full">
              Verified Mentor
            </span>
          )}
        </div>
        <h1 className="mt-3 font-display text-2xl text-ink">{chain.title}</h1>
        <p className="mt-2 text-ink-soft">{chain.description}</p>
        <p className="mt-3 text-sm text-ink-soft">Mentor: {chain.mentor_name}</p>

        {isStudent && !enrollment && (
          <button onClick={handleEnroll} className="btn-primary mt-5">
            Enroll in this chain
          </button>
        )}
        {enrollment && (
          <div className="mt-5">
            <div className="h-2 rounded-full bg-line overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{ width: `${Math.round((chain.progress || 0) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              {Math.round((chain.progress || 0) * 100)}% complete
            </p>
          </div>
        )}
      </div>

      {notice && (
        <div className="mt-4 bg-primary/5 text-primary text-sm rounded-md px-4 py-2">{notice}</div>
      )}

      <div className="mt-6 space-y-4">
        {chain.tasks.map((task) => {
          const locked = task.status === "locked";
          const completed = task.status === "completed";
          const current = task.status === "current";
          return (
            <div
              key={task.id}
              className={`card p-5 ${locked ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ink">
                  {task.order_number}. {task.title}
                </h3>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    completed
                      ? "bg-success/15 text-success"
                      : current
                      ? "bg-primary/10 text-primary"
                      : "bg-line text-ink-soft"
                  }`}
                >
                  {completed ? "Completed" : current ? "Current" : "Locked"}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{task.description}</p>

              {task.video_url && !locked && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-primary mb-1">🎬 Watch your mentor's lesson</p>
                  <div className="aspect-video rounded-lg overflow-hidden border border-line">
                    <iframe
                      className="w-full h-full"
                      src={embed(task.video_url)}
                      title={task.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {task.hints?.length > 0 && !locked && (
                <ul className="mt-3 space-y-1">
                  {task.hints.map((h, i) => (
                    <li key={i} className="text-xs text-ink-soft flex gap-2">
                      <span className="text-accent">💡</span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {isStudent && current && (
                <div className="mt-4">
                  <textarea
                    className="field min-h-[120px] resize-y"
                    placeholder="Write your answer / deliverable here…"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <button
                    onClick={() => handleSubmit(task)}
                    disabled={submitting || !answer.trim()}
                    className="btn-primary mt-3"
                  >
                    {submitting ? "Submitting…" : "Submit for review"}
                  </button>
                </div>
              )}

              {/* Per-task video review call */}
              {isStudent && !locked && (() => {
                const sess = sessionForTask(task.id);
                if (!sess) {
                  return (
                    <button
                      onClick={() => requestSession(task)}
                      disabled={busyTask === task.id}
                      className="btn-ghost mt-3 text-sm"
                    >
                      {busyTask === task.id ? "Requesting…" : "🎥 Request a video review with your mentor"}
                    </button>
                  );
                }
                if (sess.session_status === "requested") {
                  return (
                    <div className="mt-3 rounded-lg bg-warning/10 px-4 py-3 text-sm text-ink">
                      ⏳ Video review requested — waiting for your mentor to pick a time.
                    </div>
                  );
                }
                if (sess.session_status === "scheduled") {
                  return (
                    <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
                      <p className="text-sm text-ink">
                        📅 Video session scheduled for{" "}
                        <span className="font-semibold">{formatWhen(sess.scheduled_at)}</span> with{" "}
                        {chain.mentor_name}.
                      </p>
                      <Link to={`/session/${sess.id}`} className="btn-primary mt-2 inline-flex text-sm">
                        🎥 Join call
                      </Link>
                    </div>
                  );
                }
                if (sess.session_status === "completed") {
                  return (
                    <div className="mt-3 rounded-lg bg-success/10 px-4 py-3 text-sm text-success font-medium">
                      ✅ Video review completed with {chain.mentor_name}.
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          );
        })}
      </div>

      {enrollment && (chain.progress >= 1 || enrollment.status === "certified") && (
        <div className="mt-6 card p-6 text-center border-2 border-success/40 bg-success/5">
          <p className="text-2xl">🎉</p>
          <h3 className="mt-2 font-display text-xl text-ink">All stages complete!</h3>
          {enrollment.status === "certified" ? (
            <>
              <p className="mt-1 text-sm text-ink-soft">
                Your mentor has verified your work. Your certificate is ready.
              </p>
              <Link to={`/certificate/${user?.id}`} className="btn-primary mt-4 inline-flex">
                🎓 View my Certificate
              </Link>
            </>
          ) : (
            <p className="mt-1 text-sm text-ink-soft">
              Waiting for your mentor to run the final video session and issue your certificate.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
