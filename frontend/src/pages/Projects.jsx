import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../auth.jsx";

const NPR = (n) => `NPR ${Number(n || 0).toLocaleString()}`;

function Notice({ text }) {
  if (!text) return null;
  return (
    <div className="mt-4 bg-primary/5 text-primary text-sm rounded-md px-4 py-2">{text}</div>
  );
}

/* ============================================================ MENTOR VIEW */
function MentorProjects() {
  const [projects, setProjects] = useState([]);
  const [eligible, setEligible] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: "", skill: "", description: "", budget: "" });
  const [invite, setInvite] = useState({}); // {projectId: {student_id, pay_share}}

  function load() {
    return Promise.all([
      api.get("/collaborations/projects/mine/").then((r) => setProjects(r.data)).catch(() => {}),
      api.get("/collaborations/eligible-students/").then((r) => setEligible(r.data)).catch(() => {}),
    ]);
  }
  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  async function createProject(e) {
    e.preventDefault();
    if (!form.title || !form.skill) {
      setNotice("Title and skill are required.");
      return;
    }
    setBusy(true);
    try {
      await api.post("/collaborations/projects/", {
        title: form.title,
        skill: form.skill,
        description: form.description,
        budget: Number(form.budget) || 0,
      });
      setForm({ title: "", skill: "", description: "", budget: "" });
      setNotice("Project created. Now invite a certified student below.");
      await load();
    } catch {
      setNotice("Could not create project.");
    } finally {
      setBusy(false);
    }
  }

  async function sendInvite(project) {
    const data = invite[project.id] || {};
    if (!data.student_id) {
      setNotice("Pick a certified student to invite.");
      return;
    }
    setBusy(true);
    try {
      await api.post(`/collaborations/${project.id}/invite/`, {
        student_id: data.student_id,
        role: data.role || "Contributor",
        pay_share: Number(data.pay_share) || 0,
      });
      setNotice("Invitation sent!");
      await load();
    } catch (err) {
      setNotice(err.response?.data?.error || "Could not invite student.");
    } finally {
      setBusy(false);
    }
  }

  async function reviewContribution(c, status) {
    setBusy(true);
    try {
      await api.patch(`/collaborations/contribution/${c.id}/review/`, { status });
      setNotice(status === "approved" ? "Contribution approved." : "Revision requested.");
      await load();
    } catch {
      setNotice("Could not review contribution.");
    } finally {
      setBusy(false);
    }
  }

  async function completeProject(project) {
    setBusy(true);
    try {
      await api.post(`/collaborations/${project.id}/complete/`);
      setNotice("Project completed — payouts released to collaborators! 💸");
      await load();
    } catch {
      setNotice("Could not complete project.");
    } finally {
      setBusy(false);
    }
  }

  // Eligible students for a given project's skill.
  const eligibleFor = (skill) => eligible.filter((s) => s.skill === skill);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-ink">💼 Paid Projects</h1>
      <p className="mt-1 text-ink-soft">
        Hire the students you certified for real, paid work. They contribute, you review,
        and earnings are split automatically.
      </p>
      <Notice text={notice} />

      {/* Create project */}
      <form onSubmit={createProject} className="card p-6 mt-8 space-y-3">
        <h2 className="font-semibold text-ink">Post a new project</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="field" placeholder="Project title"
            value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <input
            className="field" placeholder="Skill (e.g. blockchain, full_stack)"
            value={form.skill} onChange={(e) => setForm((f) => ({ ...f, skill: e.target.value }))}
          />
        </div>
        <textarea
          className="field min-h-[70px]" placeholder="What needs to be built?"
          value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <div className="flex items-center gap-3">
          <input
            type="number" className="field max-w-[200px]" placeholder="Budget (NPR)"
            value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
          />
          <button disabled={busy} className="btn-primary">
            {busy ? "Saving…" : "Create project"}
          </button>
        </div>
      </form>

      {/* Existing projects */}
      <h2 className="mt-10 font-semibold text-ink">My projects</h2>
      {loading && <p className="mt-4 text-ink-soft">Loading…</p>}
      {!loading && projects.length === 0 && (
        <p className="mt-4 text-ink-soft">No projects yet — post one above.</p>
      )}

      <div className="mt-4 space-y-6">
        {projects.map((p) => (
          <div key={p.id} className="card p-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <p className="text-xs text-ink-soft capitalize">
                  {p.skill} · budget {NPR(p.budget)}
                </p>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                p.status === "completed" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
              }`}>
                {p.status.replace("_", " ")}
              </span>
            </div>
            {p.description && <p className="mt-2 text-sm text-ink-soft">{p.description}</p>}

            {/* Collaborators */}
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                Collaborators ({p.collaborators.length})
              </p>
              {p.collaborators.length === 0 && (
                <p className="text-sm text-ink-soft mt-1">No one invited yet.</p>
              )}
              <div className="mt-2 space-y-3">
                {p.collaborators.map((c) => (
                  <div key={c.id} className="bg-surface-muted rounded-md p-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-sm font-semibold text-ink">
                        {c.student_name} <span className="text-ink-soft font-normal">· {c.role || "Contributor"}</span>
                      </span>
                      <span className="text-xs text-ink-soft">
                        {c.paid
                          ? `Paid ${NPR(c.net_earnings)} (−${NPR(c.platform_commission)} fee)`
                          : `${NPR(c.pay_share)} · ${c.status}`}
                      </span>
                    </div>
                    {/* Their contributions */}
                    {c.contributions.map((ct) => (
                      <div key={ct.id} className="mt-2 border-l-2 border-accent pl-3">
                        <p className="text-sm text-ink">{ct.title || "Contribution"}</p>
                        {ct.text_content && <p className="text-xs text-ink-soft">{ct.text_content}</p>}
                        {ct.github_url && (
                          <a href={ct.github_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline break-all">
                            {ct.github_url}
                          </a>
                        )}
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                            ct.status === "approved" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                          }`}>
                            {ct.status}
                          </span>
                          {ct.status !== "approved" && (
                            <button
                              onClick={() => reviewContribution(ct, "approved")}
                              disabled={busy}
                              className="text-[11px] text-primary hover:underline"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Invite + complete actions */}
            {p.status !== "completed" && (
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-2">
                  Invite a certified {p.skill} student
                </p>
                {eligibleFor(p.skill).length === 0 ? (
                  <p className="text-sm text-ink-soft">
                    No certified students for “{p.skill}” yet. Certify one first.
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="field max-w-[220px]"
                      value={(invite[p.id]?.student_id) || ""}
                      onChange={(e) => setInvite((v) => ({ ...v, [p.id]: { ...v[p.id], student_id: e.target.value } }))}
                    >
                      <option value="">Select student…</option>
                      {eligibleFor(p.skill).map((s) => (
                        <option key={s.student_id} value={s.student_id}>
                          {s.student_name} ({s.level})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number" className="field max-w-[150px]" placeholder="Pay (NPR)"
                      value={(invite[p.id]?.pay_share) || ""}
                      onChange={(e) => setInvite((v) => ({ ...v, [p.id]: { ...v[p.id], pay_share: e.target.value } }))}
                    />
                    <button onClick={() => sendInvite(p)} disabled={busy} className="btn-ghost text-sm">
                      Invite
                    </button>
                  </div>
                )}
                {p.collaborators.some((c) => c.status === "accepted") && (
                  <button
                    onClick={() => completeProject(p)}
                    disabled={busy}
                    className="btn-primary text-sm mt-3"
                  >
                    ✅ Complete project & release payouts
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================== STUDENT VIEW */
function StudentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState({}); // {projectId: {title, text_content, github_url}}

  function load() {
    return api.get("/collaborations/invited/").then((r) => setProjects(r.data)).catch(() => {});
  }
  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const totalEarned = projects
    .filter((p) => p.paid)
    .reduce((sum, p) => sum + (p.net_earnings || 0), 0);

  async function respond(p, status) {
    setBusy(true);
    try {
      await api.patch(`/collaborations/collaborator/${p.collaborator_id}/respond/`, { status });
      setNotice(status === "accepted" ? "Invitation accepted!" : "Invitation declined.");
      await load();
    } catch {
      setNotice("Could not respond.");
    } finally {
      setBusy(false);
    }
  }

  async function submitContribution(p) {
    const d = draft[p.project_id] || {};
    if (!d.title && !d.text_content && !d.github_url) {
      setNotice("Add something to your contribution first.");
      return;
    }
    setBusy(true);
    try {
      await api.post(`/collaborations/${p.project_id}/contribute/`, {
        title: d.title || "",
        text_content: d.text_content || "",
        github_url: d.github_url || "",
      });
      setDraft((v) => ({ ...v, [p.project_id]: {} }));
      setNotice("Contribution submitted for mentor review!");
      await load();
    } catch {
      setNotice("Could not submit contribution.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">💼 My Paid Projects</h1>
          <p className="mt-1 text-ink-soft">
            Certified skills unlock real, paid work from your mentors.
          </p>
        </div>
        <div className="bg-success/10 text-success rounded-lg px-5 py-3 text-center">
          <p className="text-2xl font-bold">{NPR(totalEarned)}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide">Total Earned</p>
        </div>
      </div>
      <Notice text={notice} />

      {loading && <p className="mt-6 text-ink-soft">Loading…</p>}
      {!loading && projects.length === 0 && (
        <div className="mt-6 card p-8 text-center text-ink-soft">
          No project invitations yet. Get certified and your mentor can invite you to paid work!
        </div>
      )}

      <div className="mt-6 space-y-5">
        {projects.map((p) => (
          <div key={p.collaborator_id} className="card p-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <p className="text-xs text-ink-soft capitalize">
                  {p.skill} · with {p.mentor_name} · pays {NPR(p.pay_share)}
                </p>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                p.my_status === "accepted" ? "bg-success/15 text-success"
                  : p.my_status === "declined" ? "bg-danger/10 text-danger"
                  : "bg-warning/15 text-warning"
              }`}>
                {p.my_status}
              </span>
            </div>
            {p.description && <p className="mt-2 text-sm text-ink-soft">{p.description}</p>}

            {p.paid && (
              <div className="mt-3 bg-success/10 text-success rounded-md px-4 py-2 text-sm font-semibold">
                💸 Earned {NPR(p.net_earnings)} from this project
              </div>
            )}

            {/* Invited → accept / decline */}
            {p.my_status === "invited" && (
              <div className="mt-4 flex gap-3">
                <button onClick={() => respond(p, "accepted")} disabled={busy} className="btn-primary text-sm">
                  Accept invitation
                </button>
                <button onClick={() => respond(p, "declined")} disabled={busy} className="btn-ghost text-sm">
                  Decline
                </button>
              </div>
            )}

            {/* Accepted → contribute */}
            {p.my_status === "accepted" && p.project_status !== "completed" && (
              <div className="mt-4 border-t border-line pt-4 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                  Submit a contribution
                </p>
                <input
                  className="field" placeholder="Title (e.g. Implemented token contract)"
                  value={draft[p.project_id]?.title || ""}
                  onChange={(e) => setDraft((v) => ({ ...v, [p.project_id]: { ...v[p.project_id], title: e.target.value } }))}
                />
                <textarea
                  className="field min-h-[60px]" placeholder="Describe your work…"
                  value={draft[p.project_id]?.text_content || ""}
                  onChange={(e) => setDraft((v) => ({ ...v, [p.project_id]: { ...v[p.project_id], text_content: e.target.value } }))}
                />
                <input
                  className="field" placeholder="GitHub URL (optional)"
                  value={draft[p.project_id]?.github_url || ""}
                  onChange={(e) => setDraft((v) => ({ ...v, [p.project_id]: { ...v[p.project_id], github_url: e.target.value } }))}
                />
                <button onClick={() => submitContribution(p)} disabled={busy} className="btn-primary text-sm">
                  Submit contribution
                </button>
              </div>
            )}

            {/* Existing contributions */}
            {p.contributions?.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                  My contributions
                </p>
                <ul className="mt-2 space-y-2">
                  {p.contributions.map((ct) => (
                    <li key={ct.id} className="text-sm border-l-2 border-accent pl-3">
                      <span className="text-ink">{ct.title || "Contribution"}</span>
                      <span className={`ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        ct.status === "approved" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                      }`}>
                        {ct.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const { user } = useAuth();
  return user?.role === "mentor" ? <MentorProjects /> : <StudentProjects />;
}
