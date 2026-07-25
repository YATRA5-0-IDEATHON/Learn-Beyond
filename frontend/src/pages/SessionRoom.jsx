import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../auth.jsx";

// Pull the Jitsi room name out of the stored meet.jit.si link.
function roomFromLink(link) {
  if (!link) return "";
  try {
    return new URL(link).pathname.replace(/^\//, "");
  } catch {
    return link.split("/").pop();
  }
}

function formatWhen(iso) {
  if (!iso) return "Not scheduled yet";
  return new Date(iso).toLocaleString([], {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function SessionRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/sessions/${id}/`)
      .then((res) => setSession(res.data))
      .catch(() => setError("Could not load this session."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-12 text-ink-soft">Loading…</p>;
  if (error) return <p className="max-w-4xl mx-auto px-6 py-12 text-danger">{error}</p>;
  if (!session) return null;

  const room = roomFromLink(session.video_link);
  const displayName = encodeURIComponent(user?.name || "Guest");
  // config overrides keep the embedded room clean & branded.
  const src =
    `https://meet.jit.si/${room}` +
    `#userInfo.displayName=%22${displayName}%22` +
    `&config.prejoinPageEnabled=false` +
    `&config.disableDeepLinking=true` +
    `&interfaceConfig.SHOW_JITSI_WATERMARK=false`;

  const other = user?.role === "mentor" ? session.student_name : session.mentor_name;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link to="/dashboard" className="text-sm text-primary hover:underline">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 font-display text-2xl text-ink">
            Video Session · {session.chain_title}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {session.task_title ? (
              <>Reviewing: <span className="font-medium text-ink">{session.task_title}</span> · </>
            ) : (
              <>Final certification review · </>
            )}
            with {other} · {formatWhen(session.scheduled_at)}
          </p>
        </div>
        <span className="text-[11px] font-semibold bg-accent/15 text-accent px-3 py-1 rounded-full">
          LearnBeyond Live
        </span>
      </div>

      <div className="mt-5 rounded-2xl overflow-hidden border border-line shadow-lg bg-ink">
        <iframe
          title="LearnBeyond video session"
          src={src}
          className="w-full"
          style={{ height: "70vh", minHeight: 480 }}
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
        />
      </div>

      <p className="mt-4 text-xs text-ink-soft text-center">
        Powered by Jitsi Meet · Share this page's link with {other} if they can't find the call.
      </p>
    </div>
  );
}
