import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../auth.jsx";

// A friendly scripted chatbot that collects study field + interests,
// then calls the AI backend to recommend a path and matching mentors.
export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: "bot", text: `Hi ${user?.name?.split(" ")[0] || "there"}! 👋 I'm your LearnBeyond AI guide. Let's find the perfect skill path for you.` },
    { from: "bot", text: "First — what are you currently studying?" },
  ]);
  const [step, setStep] = useState("study"); // study -> interests -> done
  const [study, setStudy] = useState("");
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, result]);

  function push(from, text) {
    setMessages((m) => [...m, { from, text }]);
  }

  async function handleSend() {
    const value = input.trim();
    if (!value || thinking) return;
    push("user", value);
    setInput("");

    if (step === "study") {
      setStudy(value);
      setStep("interests");
      setTimeout(() => push("bot", "Great! And what are you most interested in or excited to build?"), 400);
      return;
    }

    if (step === "interests") {
      setStep("done");
      setThinking(true);
      try {
        const { data } = await api.post("/auth/ai/onboard/", {
          study_field: study,
          interests: value,
        });
        // Save the answers to the student's profile (best-effort).
        api.patch("/auth/student/profile/", {
          current_study_field: study,
          career_goal: data.recommended_label,
          onboarding_complete: true,
        }).catch(() => {});
        setThinking(false);
        push("bot", data.message);
        setTimeout(
          () => push("bot", `Here are the top mentors for **${data.recommended_label}** — pick one to begin your journey:`),
          300
        );
        setResult(data);
      } catch {
        setThinking(false);
        push("bot", "Sorry, I had trouble reaching my brain just now. You can browse all mentors instead.");
        setResult({ mentors: [], recommended_label: "" });
      }
    }
  }

  function choose(mentor) {
    // Carry the chosen mentor + recommendation into the mentor selection page.
    navigate("/mentors", {
      state: {
        skill: result.recommended_skill,
        label: result.recommended_label,
        mentors: result.mentors,
        focusMentorId: mentor.id,
      },
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="card overflow-hidden">
        <div className="bg-primary-dark px-6 py-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-lg">🤖</span>
          <div>
            <p className="text-white font-semibold text-sm">LearnBeyond AI Guide</p>
            <p className="text-white/60 text-xs">Powered by Gemini</p>
          </div>
        </div>

        <div className="p-5 space-y-3 max-h-[52vh] overflow-y-auto bg-surface-muted/30">
          {messages.map((m, i) => (
            <Bubble key={i} from={m.from} text={m.text} />
          ))}
          {thinking && <Bubble from="bot" text="Thinking…" />}

          {result?.mentors?.length > 0 && (
            <div className="space-y-3 pt-2">
              {result.mentors.map((mentor) => (
                <div key={mentor.id} className="bg-surface border border-line rounded-xl p-4 flex items-center gap-4">
                  <img src={mentor.avatar_url} alt={mentor.name} className="w-12 h-12 rounded-full bg-surface-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-sm">{mentor.name}</p>
                    <p className="text-xs text-ink-soft truncate">{mentor.job_title} · {mentor.employer}</p>
                    <p className="text-xs text-accent mt-0.5">★ {mentor.rating} · {mentor.total_sessions} sessions · NPR {mentor.session_rate}</p>
                  </div>
                  <button onClick={() => choose(mentor)} className="btn-primary text-xs !px-4 !py-2 whitespace-nowrap">
                    Choose
                  </button>
                </div>
              ))}
              <div className="text-center pt-1">
                <Link to="/mentors" state={{ skill: result.recommended_skill, label: result.recommended_label, mentors: result.mentors }} className="text-xs text-primary hover:underline">
                  See full mentor profiles →
                </Link>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {step !== "done" && (
          <div className="p-4 border-t border-line flex gap-2">
            <input
              className="field flex-1"
              placeholder={step === "study" ? "e.g. Computer Engineering" : "e.g. Full-stack web development"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              autoFocus
            />
            <button onClick={handleSend} disabled={!input.trim()} className="btn-primary">
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Bubble({ from, text }) {
  const isBot = from === "bot";
  // Render **bold** markdown lightly.
  const html = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot ? "bg-surface border border-line text-ink" : "bg-primary text-white"
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
