import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

const SKILL_LABELS = {
  accounting: "Accounting",
  web_dev: "Web Development",
  business: "Business",
};

export default function BrowseChains() {
  const [chains, setChains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/chains/")
      .then((res) => setChains(res.data))
      .catch(() => setError("Could not load task chains."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Task Chains</h1>
      <p className="mt-2 text-ink-soft">
        Pick a chain and start completing real, mentor-reviewed tasks.
      </p>

      {loading && <p className="mt-8 text-ink-soft">Loading chains…</p>}
      {error && <p className="mt-8 text-danger">{error}</p>}
      {!loading && !error && chains.length === 0 && (
        <p className="mt-8 text-ink-soft">No published chains yet. Check back soon.</p>
      )}

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chains.map((chain) => (
          <Link
            key={chain.id}
            to={`/chains/${chain.id}`}
            className="card p-6 hover:shadow-lg transition-shadow block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {SKILL_LABELS[chain.skill] || chain.skill}
              </span>
              <span className="text-[11px] text-ink-soft capitalize">{chain.level}</span>
            </div>
            <h3 className="mt-4 font-semibold text-ink">{chain.title}</h3>
            <p className="mt-2 text-sm text-ink-soft line-clamp-3">{chain.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
              <span>By {chain.mentor_name}</span>
              <span>{chain.task_count} tasks</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
