import React, { useState } from "react";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import AnswerBox from "../components/AnswerBox";
import ScoreCard from "../components/ScoreCard";

const questions = [
  "Explain the difference between stack and queue.",
  "What is Python GIL and why does it matter?",
  "What is Docker and how does it differ from a VM?",
  "What is overfitting in machine learning?",
  "What is supervised learning?",
  "What is a React component?",
  "What is Kubernetes and what problem does it solve?",
];

function InterviewPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/evaluate-answer", {
        answer: answer,
      });
      const newScore = Math.round(res.data.score * 10) / 10;
      setScore(newScore);
      setHistory((prev) => [
        ...prev,
        { question: questions[currentQ], answer, score: newScore },
      ]);
    } catch (err) {
      setError("Could not connect to backend. Make sure FastAPI is running.");
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    setCurrentQ((prev) => (prev + 1) % questions.length);
    setAnswer("");
    setScore(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 20px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
      }}>
        <span style={{ fontSize: "13px", color: "#6b7280" }}>
          Question {currentQ + 1} of {questions.length}
        </span>
        <span style={{ fontSize: "13px", color: "#6b7280" }}>
          {history.length} answered
        </span>
      </div>

      <div style={{
        height: "4px",
        background: "#e5e7eb",
        borderRadius: "2px",
        marginBottom: "28px",
      }}>
        <div style={{
          height: "100%",
          width: `${((currentQ + 1) / questions.length) * 100}%`,
          background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
          borderRadius: "2px",
          transition: "width 0.4s ease",
        }} />
      </div>

      <QuestionCard question={questions[currentQ]} index={currentQ} />

      <AnswerBox
        answer={answer}
        setAnswer={setAnswer}
        submitAnswer={submitAnswer}
        loading={loading}
        submitted={score !== null}
      />

      {error && (
        <div style={{
          marginTop: "16px",
          padding: "12px 16px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "10px",
          color: "#dc2626",
          fontSize: "14px",
        }}>
          ⚠️ {error}
        </div>
      )}

      <ScoreCard score={score} onNext={nextQuestion} />

      {history.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
            Session History
          </h3>
          {history.map((h, i) => (
            <div key={i} style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 4px" }}>Q{i + 1}</p>
                <p style={{ fontSize: "14px", color: "#111827", margin: 0 }}>{h.question}</p>
              </div>
              <div style={{
                minWidth: "52px",
                textAlign: "center",
                background: h.score >= 7 ? "#f0fdf4" : h.score >= 4 ? "#fffbeb" : "#fef2f2",
                border: `1px solid ${h.score >= 7 ? "#86efac" : h.score >= 4 ? "#fcd34d" : "#fca5a5"}`,
                borderRadius: "8px",
                padding: "6px 10px",
              }}>
                <span style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: h.score >= 7 ? "#16a34a" : h.score >= 4 ? "#d97706" : "#dc2626",
                }}>
                  {h.score}
                </span>
                <span style={{ fontSize: "11px", color: "#9ca3af", display: "block" }}>/10</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewPage;
