import React, { useState } from "react";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import AnswerBox from "../components/AnswerBox";
import ScoreCard from "../components/ScoreCard";

const SUBJECTS = [
  { id: "python",  label: "Python",  icon: "🐍" },
  { id: "java",    label: "Java",    icon: "☕" },
  { id: "c",       label: "C",       icon: "⚙️" },
  { id: "cpp",     label: "C++",     icon: "➕" },
  { id: "oops",    label: "OOPs",    icon: "🧩" },
  { id: "os",      label: "OS",      icon: "💻" },
  { id: "cn",      label: "CN",      icon: "🌐" },
  { id: "dbms",    label: "DBMS",    icon: "🗄️" },
  { id: "sql",     label: "SQL",     icon: "📊" },
  { id: "mix",     label: "Mix All", icon: "🎯" },
];

const DIFFICULTIES = [
  { id: "easy",   label: "Easy",   color: "#16a34a", bg: "#f0fdf4", border: "#86efac", desc: "Basic concepts" },
  { id: "medium", label: "Medium", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", desc: "Intermediate" },
  { id: "hard",   label: "Hard",   color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", desc: "Advanced" },
];

export default function InterviewPage() {
  const [screen, setScreen] = useState("select");
  const [subject, setSubject] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const startQuiz = async () => {
    if (!subject || !difficulty) return;
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/questions?subject=${subject}&difficulty=${difficulty}`
      );
      setQuestions(res.data.questions);
      setCurrentQ(0);
      setAnswer("");
      setScore(null);
      setHistory([]);
      setError(null);
      setScreen("quiz");
    } catch (err) {
      setError("Could not connect to backend. Make sure FastAPI is running.");
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/evaluate-answer", { answer });
      const newScore = Math.round(res.data.score * 10) / 10;
      setScore(newScore);
      setHistory((prev) => [...prev, { question: questions[currentQ], answer, score: newScore }]);
    } catch (err) {
      setError("Could not connect to backend. Make sure FastAPI is running.");
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) { setScreen("results"); return; }
    setCurrentQ((p) => p + 1);
    setAnswer("");
    setScore(null);
    setError(null);
  };

  const restart = () => {
    setScreen("select"); setSubject(null); setDifficulty(null);
    setQuestions([]); setHistory([]); setScore(null); setAnswer(""); setError(null);
  };

  // SELECTION SCREEN
  if (screen === "select") {
    return (
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "36px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>Choose Your Subject</h1>
          <p style={{ color: "#6b7280", fontSize: "15px", margin: 0 }}>Select a subject and difficulty to begin your interview practice</p>
        </div>

        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Subject</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px", marginBottom: "32px" }}>
          {SUBJECTS.map((s) => (
            <button key={s.id} onClick={() => setSubject(s.id)} style={{
              padding: "16px 10px", borderRadius: "12px",
              border: subject === s.id ? "2px solid #6366f1" : "1.5px solid #e5e7eb",
              background: subject === s.id ? "#eef2ff" : "#fff",
              cursor: "pointer", textAlign: "center", transition: "all 0.15s",
              boxShadow: subject === s.id ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
            }}>
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: subject === s.id ? "#6366f1" : "#374151" }}>{s.label}</div>
            </button>
          ))}
        </div>

        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Difficulty</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "36px" }}>
          {DIFFICULTIES.map((d) => (
            <button key={d.id} onClick={() => setDifficulty(d.id)} style={{
              padding: "20px 16px", borderRadius: "12px",
              border: difficulty === d.id ? `2px solid ${d.color}` : "1.5px solid #e5e7eb",
              background: difficulty === d.id ? d.bg : "#fff",
              cursor: "pointer", textAlign: "center", transition: "all 0.15s",
            }}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: difficulty === d.id ? d.color : "#374151", marginBottom: "4px" }}>{d.label}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>{d.desc}</div>
            </button>
          ))}
        </div>

        {error && (
          <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", color: "#dc2626", fontSize: "14px", marginBottom: "16px" }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={startQuiz} disabled={!subject || !difficulty} style={{
          width: "100%", padding: "16px",
          background: subject && difficulty ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e5e7eb",
          color: subject && difficulty ? "#fff" : "#9ca3af",
          border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700",
          cursor: subject && difficulty ? "pointer" : "not-allowed",
        }}>
          {subject && difficulty
            ? `Start ${SUBJECTS.find(s => s.id === subject)?.label} — ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} →`
            : "Select subject and difficulty to start"}
        </button>
      </div>
    );
  }

  // RESULTS SCREEN
  if (screen === "results") {
    const avg = history.length ? Math.round((history.reduce((a, b) => a + b.score, 0) / history.length) * 10) / 10 : 0;
    const subjectLabel = SUBJECTS.find(s => s.id === subject)?.label;
    return (
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "36px 20px" }}>
        <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "16px", padding: "32px", textAlign: "center", marginBottom: "28px", color: "#fff" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>{avg >= 8 ? "🏆" : avg >= 6 ? "👍" : avg >= 4 ? "📝" : "💪"}</div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 8px" }}>Session Complete!</h2>
          <p style={{ margin: "0 0 16px", opacity: 0.85 }}>{subjectLabel} · {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} · {history.length} questions</p>
          <div style={{ fontSize: "48px", fontWeight: "800" }}>{avg}<span style={{ fontSize: "24px" }}>/10</span></div>
          <p style={{ margin: "8px 0 0", opacity: 0.8, fontSize: "14px" }}>Average Score</p>
        </div>
        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>Question Breakdown</h3>
        {history.map((h, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px 16px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 4px" }}>Q{i + 1}</p>
              <p style={{ fontSize: "14px", color: "#111827", margin: 0 }}>{h.question}</p>
            </div>
            <div style={{ minWidth: "52px", textAlign: "center", background: h.score >= 7 ? "#f0fdf4" : h.score >= 4 ? "#fffbeb" : "#fef2f2", border: `1px solid ${h.score >= 7 ? "#86efac" : h.score >= 4 ? "#fcd34d" : "#fca5a5"}`, borderRadius: "8px", padding: "6px 10px" }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: h.score >= 7 ? "#16a34a" : h.score >= 4 ? "#d97706" : "#dc2626" }}>{h.score}</span>
              <span style={{ fontSize: "11px", color: "#9ca3af", display: "block" }}>/10</span>
            </div>
          </div>
        ))}
        <button onClick={restart} style={{ marginTop: "20px", width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
          ← Try Another Subject
        </button>
      </div>
    );
  }

  // QUIZ SCREEN
  const subjectLabel = SUBJECTS.find(s => s.id === subject)?.label;
  const diffObj = DIFFICULTIES.find(d => d.id === difficulty);
  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 10px", background: "#eef2ff", color: "#6366f1", borderRadius: "20px" }}>{subjectLabel}</span>
          <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 10px", background: diffObj.bg, color: diffObj.color, border: `1px solid ${diffObj.border}`, borderRadius: "20px" }}>{diffObj.label}</span>
        </div>
        <span style={{ fontSize: "13px", color: "#6b7280" }}>{currentQ + 1} / {questions.length}</span>
      </div>
      <div style={{ height: "4px", background: "#e5e7eb", borderRadius: "2px", marginBottom: "24px" }}>
        <div style={{ height: "100%", width: `${((currentQ + 1) / questions.length) * 100}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: "2px", transition: "width 0.4s ease" }} />
      </div>
      <QuestionCard question={questions[currentQ]} />
      <AnswerBox answer={answer} setAnswer={setAnswer} submitAnswer={submitAnswer} loading={loading} submitted={score !== null} />
      {error && (
        <div style={{ marginTop: "16px", padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", color: "#dc2626", fontSize: "14px" }}>
          ⚠️ {error}
        </div>
      )}
      <ScoreCard score={score} onNext={nextQuestion} isLast={currentQ + 1 >= questions.length} />
      <button onClick={restart} style={{ marginTop: "20px", background: "none", border: "none", color: "#9ca3af", fontSize: "13px", cursor: "pointer", padding: 0 }}>
        ← Change subject
      </button>
    </div>
  );
}
