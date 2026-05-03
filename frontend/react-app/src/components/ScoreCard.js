import React from "react";

function ScoreCard({ score, onNext }) {
  if (score === null) return null;

  const getGrade = (s) => {
    if (s >= 8) return { label: "Excellent", color: "#16a34a", bg: "#f0fdf4", border: "#86efac", emoji: "🏆" };
    if (s >= 6) return { label: "Good", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", emoji: "👍" };
    if (s >= 4) return { label: "Average", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", emoji: "📝" };
    return { label: "Needs Work", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", emoji: "💪" };
  };

  const getFeedback = (s) => {
    if (s >= 8) return "Great answer! You demonstrated strong understanding of the concept.";
    if (s >= 6) return "Good answer. Consider adding more specific examples or technical depth.";
    if (s >= 4) return "Decent attempt. Try to be more precise and cover key technical terms.";
    return "Keep practicing! Review the core concepts and try to structure your answer more clearly.";
  };

  const grade = getGrade(score);
  const pct = (score / 10) * 100;

  return (
    <div style={{
      background: grade.bg,
      border: `1px solid ${grade.border}`,
      borderRadius: "16px",
      padding: "24px",
      marginTop: "4px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
        <span style={{ fontSize: "32px" }}>{grade.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: grade.color }}>
              {grade.label}
            </span>
            <span style={{ fontSize: "22px", fontWeight: "700", color: grade.color }}>
              {score} / 10
            </span>
          </div>
          <div style={{ height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "4px" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: grade.color,
              borderRadius: "4px",
              transition: "width 0.8s ease",
            }} />
          </div>
        </div>
      </div>

      <p style={{ fontSize: "14px", color: "#374151", margin: "0 0 16px", lineHeight: "1.6" }}>
        {getFeedback(score)}
      </p>

      <button
        onClick={onNext}
        style={{
          padding: "10px 20px",
          background: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        Next Question →
      </button>
    </div>
  );
}

export default ScoreCard;
