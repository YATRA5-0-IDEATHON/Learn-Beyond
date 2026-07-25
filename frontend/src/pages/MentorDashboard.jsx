import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../auth.jsx";

export default function MentorDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");

  function load() {
    return api
      .get("/submissions/pending/")
      .then((res) => setPending(res.data))
      .catch(() => setError("Could not load pending submissions."));
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

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
      <h1 className="font-display text-3xl text-ink">Mentor Dashboard</h1>
      <p className="mt-1 text-ink-soft">
        Welcome, {user?.name}. Review student submissions below.
      </p>

      {notice && (
        <div className="mt-4 bg-primary/5 text-primary text-sm rounded-md px-4 py-2">{notice}</div>
      )}
      {error && <p className="mt-4 text-danger">{error}</p>}

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

            <div className="mt-3 bg-surface-muted rounded-md p-4 text-sm text-ink whitespace-pre-wrap">
              {sub.text_content || sub.github_url || sub.live_url || "(no text content)"}
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
