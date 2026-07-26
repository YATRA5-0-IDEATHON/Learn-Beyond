import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../auth.jsx";

const OUTPUT_TYPES = [
  { value: "text", label: "Written answer" },
  { value: "code", label: "Code" },
  { value: "file", label: "File upload" },
  { value: "image", label: "Image / Photo" },
  { value: "github_url", label: "GitHub URL" },
  { value: "live_url", label: "Live URL" },
];

const SKILLS = [
  "web_dev", "full_stack", "blockchain", "accounting", "business",
  "civil", "agriculture", "electrical", "finance",
];

const LEVELS = ["beginner", "intermediate", "expert"];

// A comma / newline separated string -> array helper for the topic & hint chips.
function toList(str) {
  return (str || "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ChainBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [skill, setSkill] = useState("web_dev");
  const [level, setLevel] = useState("beginner");
  const [notes, setNotes] = useState("");
  const [titleHint, setTitleHint] = useState("");

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(null);
  const [source, setSource] = useState("");
  const [notice, setNotice] = useState("");

  if (user?.role !== "mentor") {
    return (
      <p className="max-w-3xl mx-auto px-6 py-12 text-ink-soft">
        Only mentors can create task chains.
      </p>
    );
  }

  async function handleGenerate(e) {
    e.preventDefault();
    setGenerating(true);
    setNotice("");
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("pdfs", f));
      fd.append("skill", skill);
      fd.append("level", level);
      fd.append("title", titleHint);
      fd.append("notes", notes);
      const { data } = await api.post("/chains/generate/", fd);
      setSource(data.generated_by);
      setDraft(data.draft);
      if (data.generated_by === "template") {
        setNotice(
          data.pdf_text_found
            ? "AI was unavailable, so we drafted a starter chain you can edit."
            : "No readable PDF text found - here is a starter template to edit."
        );
      } else {
        setNotice("AI drafted your chain! Review and edit every task below.");
      }
    } catch (err) {
      setNotice(err.response?.data?.error || "Could not generate. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  function updateChain(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  function updateTask(idx, field, value) {
    setDraft((d) => {
      const tasks = [...d.tasks];
      tasks[idx] = { ...tasks[idx], [field]: value };
      return { ...d, tasks };
    });
  }

  function addTask() {
    setDraft((d) => ({
      ...d,
      tasks: [
        ...d.tasks,
        {
          title: "New task",
          description: "",
          expected_output_type: "text",
          learning_topics: [],
          hints: [],
        },
      ],
    }));
  }

  function removeTask(idx) {
    setDraft((d) => ({ ...d, tasks: d.tasks.filter((_, i) => i !== idx) }));
  }

  function moveTask(idx, dir) {
    setDraft((d) => {
      const tasks = [...d.tasks];
      const j = idx + dir;
      if (j < 0 || j >= tasks.length) return d;
      [tasks[idx], tasks[j]] = [tasks[j], tasks[idx]];
      return { ...d, tasks };
    });
  }

  async function handlePublish() {
    setSaving(true);
    setNotice("");
    try {
      const payload = {
        ...draft,
        tasks: draft.tasks.map((t) => ({
          ...t,
          learning_topics: Array.isArray(t.learning_topics)
            ? t.learning_topics
            : toList(t.learning_topics),
          hints: Array.isArray(t.hints) ? t.hints : toList(t.hints),
        })),
        is_published: true,
      };
      const { data } = await api.post("/chains/create/", payload);
      navigate(`/chains/${data.id}`);
    } catch (err) {
      setNotice(err.response?.data?.error || "Could not publish. Try again.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-2xl text-ink">Create a Task Chain with AI</h1>
      <p className="mt-2 text-ink-soft">
        Upload your problem brief or lecture notes (PDF). AI turns it into a
        structured, multi-stage task chain - you review and edit before publishing.
      </p>

      <form onSubmit={handleGenerate} className="mt-6 card p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-ink">Reference PDFs</label>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="mt-1 block w-full text-sm text-ink-soft file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-semibold"
          />
          {files.length > 0 && (
            <p className="mt-1 text-xs text-ink-soft">{files.length} file(s) selected</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-ink">Skill</label>
            <select className="field mt-1" value={skill} onChange={(e) => setSkill(e.target.value)}>
              {SKILLS.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">Level</label>
            <select className="field mt-1" value={level} onChange={(e) => setLevel(e.target.value)}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-ink">Chain title (optional)</label>
          <input
            className="field mt-1"
            placeholder="e.g. Responsive Pricing Page"
            value={titleHint}
            onChange={(e) => setTitleHint(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink">Extra guidelines (optional)</label>
          <textarea
            className="field mt-1 min-h-[80px] resize-y"
            placeholder="Any goals, constraints, or topics students must cover..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button type="submit" disabled={generating} className="btn-primary">
          {generating ? "Generating..." : "Generate task chain"}
        </button>
      </form>

      {notice && (
        <div className="mt-4 bg-primary/5 text-primary text-sm rounded-md px-4 py-2">
          {notice}
        </div>
      )}

      {draft && (
        <div className="mt-6 space-y-4">
          <div className="card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                {source === "ai" ? "AI draft" : "Template draft"}
              </span>
              <span className="text-[11px] text-ink-soft">Editable - review before publishing</span>
            </div>
            <div>
              <label className="text-sm font-semibold text-ink">Title</label>
              <input
                className="field mt-1"
                value={draft.title}
                onChange={(e) => updateChain("title", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink">Description</label>
              <textarea
                className="field mt-1 min-h-[70px] resize-y"
                value={draft.description}
                onChange={(e) => updateChain("description", e.target.value)}
              />
            </div>
          </div>

          {draft.tasks.map((task, idx) => (
            <div key={idx} className="card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ink">Task {idx + 1}</h3>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveTask(idx, -1)} className="btn-ghost text-xs px-2" title="Move up">Up</button>
                  <button onClick={() => moveTask(idx, 1)} className="btn-ghost text-xs px-2" title="Move down">Down</button>
                  <button onClick={() => removeTask(idx)} className="btn-ghost text-xs px-2 text-danger" title="Remove">Remove</button>
                </div>
              </div>

              <input
                className="field"
                value={task.title}
                onChange={(e) => updateTask(idx, "title", e.target.value)}
                placeholder="Task title"
              />
              <textarea
                className="field min-h-[60px] resize-y"
                value={task.description}
                onChange={(e) => updateTask(idx, "description", e.target.value)}
                placeholder="What should the student deliver?"
              />

              <div>
                <label className="text-xs font-semibold text-ink-soft">Expected output</label>
                <select
                  className="field mt-1"
                  value={task.expected_output_type}
                  onChange={(e) => updateTask(idx, "expected_output_type", e.target.value)}
                >
                  {OUTPUT_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-soft">
                  Topics the student must cover (comma separated)
                </label>
                <input
                  className="field mt-1"
                  value={Array.isArray(task.learning_topics) ? task.learning_topics.join(", ") : task.learning_topics}
                  onChange={(e) => updateTask(idx, "learning_topics", toList(e.target.value))}
                  placeholder="Semantic HTML, Flexbox, Media queries"
                />
                {Array.isArray(task.learning_topics) && task.learning_topics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {task.learning_topics.map((t, i) => (
                      <span key={i} className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-soft">Hints (comma separated)</label>
                <input
                  className="field mt-1"
                  value={Array.isArray(task.hints) ? task.hints.join(", ") : task.hints}
                  onChange={(e) => updateTask(idx, "hints", toList(e.target.value))}
                  placeholder="Use section per tier"
                />
              </div>
            </div>
          ))}

          <button onClick={addTask} className="btn-ghost w-full">+ Add another task</button>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={handlePublish} disabled={saving} className="btn-primary">
              {saving ? "Publishing..." : "Publish chain"}
            </button>
            <button onClick={() => setDraft(null)} className="btn-ghost">Discard</button>
          </div>
        </div>
      )}
    </div>
  );
}
