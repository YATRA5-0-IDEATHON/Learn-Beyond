import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../auth.jsx";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/chains/my/")
      .then((res) => setEnrollments(res.data))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Hi, {user?.name} 👋</h1>
          <p className="mt-1 text-ink-soft">Track your task chains and skill progress.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/chains" className="btn-primary">
            Browse chains
          </Link>
          <Link to={`/passport/${user?.id}`} className="btn-ghost">
            My Skill Passport
          </Link>
        </div>
      </div>

      <h2 className="mt-10 font-semibold text-ink">My Enrollments</h2>
      {loading && <p className="mt-4 text-ink-soft">Loading…</p>}
      {!loading && enrollments.length === 0 && (
        <div className="mt-4 card p-8 text-center">
          <p className="text-ink-soft">You haven't enrolled in any chains yet.</p>
          <Link to="/chains" className="btn-primary mt-4 inline-flex">
            Find your first chain
          </Link>
        </div>
      )}

      <div className="mt-4 grid md:grid-cols-2 gap-5">
        {enrollments.map((e) => (
          <Link key={e.id} to={`/chains/${e.chain.id}`} className="card p-6 hover:shadow-lg transition-shadow block">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full capitalize">
                {e.chain.skill}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                  e.status === "completed"
                    ? "bg-success/15 text-success"
                    : "bg-warning/15 text-warning"
                }`}
              >
                {e.status}
              </span>
            </div>
            <h3 className="mt-3 font-semibold text-ink">{e.chain.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">
              On task #{e.current_task_order} of {e.chain.task_count}
            </p>
            <div className="mt-3 h-2 rounded-full bg-line overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(((e.current_task_order - 1) / (e.chain.task_count || 1)) * 100)
                  )}%`,
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
