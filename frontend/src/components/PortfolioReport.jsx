import React, { useEffect, useState } from "react";
import api from "../api.js";

const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
const RECOMMENDATIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const emptyReport = {
  skill_area: "",
  grade: "B+",
  practical_hours: "",
  tasks_completed: "",
  tasks_total: "",
};

/**
 * Mentor-facing panel to submit the parameters shown on a student's public
 * portfolio: graded skill areas, a recommendation level, and study notes.
 */
export default function PortfolioReport() {
  const [students, setStudents] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [form, setForm] = useState(emptyReport);
  const [comment, setComment] = useState("");
  const [rec, setRec] = useState("");
  const [headline, setHeadline] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    return api
      .get("/passport/mentor/students/")
      .then((res) => setStudents(res.data))
      .catch(() => setStudents([]));
  }

  useEffect(() => {
    load();
  }, []);

  const active = students.find((s) => s.student_id === activeId);

  useEffect(() => {
    if (active) {
      setRec(active.mentor_recommendation || "");
      setHeadline(active.headline || "");
    }
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveReport() {
    if (!activeId || !form.skill_area.trim()) {
      setNotice("Pick a student and enter a skill area.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      await api.post("/passport/report/", {
        student_id: activeId,
        skill_area: form.skill_area.trim(),
        grade: form.grade,
        practical_hours: Number(form.practical_hours) || 0,
        tasks_completed: Number(form.tasks_completed) || 0,
        tasks_total: Number(form.tasks_total) || 0,
      });
      setNotice("Skill report saved.");
      setForm(emptyReport);
      await load();
    } catch {
      setNotice("Could not save the skill report.");
    } finally {
      setBusy(false);
    }
  }

  async function saveComment() {
    if (!activeId || !comment.trim()) {
      setNotice("Pick a student and write a note.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      await api.post("/passport/comment/", { student_id: activeId, text: comment.trim() });
      setNotice("Study note added.");
      setComment("");
      await load();
    } catch {
      setNotice("Could not add the note.");
    } finally {
      setBusy(false);
    }
  }

  async function saveRecommendation() {
    if (!activeId) return;
    setBusy(true);
    setNotice("");
    try {
      await api.patch("/passport/recommendation/", {
        student_id: activeId,
        mentor_recommendation: rec,
        headline,
      });
      setNotice("Recommendation updated.");
      await load();
    } catch {
      setNotice("Could not update the recommendation.");
    } finally {
      setBusy(false);
    }
  }

  if (students.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-ink">📊 Student Portfolio Report</h2>
      <p className="text-sm text-ink-soft mt-1">
        Grade skills, set a recommendation, and log study notes. This is what employers
        see on the student's public portfolio.
      </p>

      <div className="mt-4 card p-6">
        {notice && (
          <div className="mb-4 bg-primary/5 text-primary text-sm rounded-md px-4 py-2">
            {notice}
          </div>
        )}

        <label className="block text-sm font-semibold text-ink mb-1">Student</label>
        <select
          className="field max-w-sm"
          value={activeId}
          onChange={(e) => setActiveId(e.target.value)}
        >
          <option value="">Select a student…</option>
          {students.map((s) => (
            <option key={s.student_id} value={s.student_id}>
              {s.student_name}
            </option>
          ))}
        </select>

        {active && (
          <>
            {active.slug && (
              <a
                href={`/p/${active.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 text-sm text-primary hover:underline"
              >
                🔗 View public portfolio →
              </a>
            )}

            {/* Recommendation + headline */}
            <div className="mt-6 border-t border-line pt-5">
              <h3 className="font-semibold text-ink text-sm">Recommendation & Headline</h3>
              <div className="mt-3 flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs text-ink-soft mb-1">Recommendation</label>
                  <select className="field" value={rec} onChange={(e) => setRec(e.target.value)}>
                    <option value="">None</option>
                    {RECOMMENDATIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs text-ink-soft mb-1">Headline / tag</label>
                  <input
                    className="field w-full"
                    placeholder="e.g. Aspiring Full-Stack Developer"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>
                <button onClick={saveRecommendation} disabled={busy} className="btn-ghost text-sm">
                  Save
                </button>
              </div>
            </div>

            {/* Skill report */}
            <div className="mt-6 border-t border-line pt-5">
              <h3 className="font-semibold text-ink text-sm">Add / update a graded skill</h3>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <input
                  className="field"
                  placeholder="Skill area (e.g. Frontend Development)"
                  value={form.skill_area}
                  onChange={(e) => setForm((f) => ({ ...f, skill_area: e.target.value }))}
                />
                <select
                  className="field"
                  value={form.grade}
                  onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>Grade: {g}</option>
                  ))}
                </select>
                <input
                  type="number"
                  className="field"
                  placeholder="Practical hours"
                  value={form.practical_hours}
                  onChange={(e) => setForm((f) => ({ ...f, practical_hours: e.target.value }))}
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="field w-full"
                    placeholder="Tasks done"
                    value={form.tasks_completed}
                    onChange={(e) => setForm((f) => ({ ...f, tasks_completed: e.target.value }))}
                  />
                  <input
                    type="number"
                    className="field w-full"
                    placeholder="Tasks total"
                    value={form.tasks_total}
                    onChange={(e) => setForm((f) => ({ ...f, tasks_total: e.target.value }))}
                  />
                </div>
              </div>
              <button onClick={saveReport} disabled={busy} className="btn-primary text-sm mt-3">
                {busy ? "Saving…" : "Save skill report"}
              </button>

              {active.skill_reports?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {active.skill_reports.map((r) => (
                    <span
                      key={r.id}
                      className="text-[11px] bg-surface-muted rounded-full px-3 py-1 text-ink-soft"
                    >
                      {r.skill_area}: <span className="font-semibold text-ink">{r.grade}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Study note */}
            <div className="mt-6 border-t border-line pt-5">
              <h3 className="font-semibold text-ink text-sm">Log a study note</h3>
              <textarea
                className="field mt-3 min-h-[70px] resize-y w-full"
                placeholder="What did the student work on or need to improve?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={saveComment} disabled={busy} className="btn-ghost text-sm mt-2">
                Add note
              </button>

              {active.study_comments?.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {active.study_comments.slice(0, 3).map((c) => (
                    <li key={c.id} className="text-xs text-ink-soft border-l-2 border-accent pl-2">
                      {c.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
