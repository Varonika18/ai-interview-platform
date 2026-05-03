import React from "react";

function QuestionCard({ question, index }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      padding: "28px",
      borderRadius: "16px",
      marginBottom: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "-20px", right: "-20px",
        width: "100px", height: "100px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute", bottom: "-30px", left: "60%",
        width: "140px", height: "140px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "50%",
      }} />
      <span style={{
        display: "inline-block",
        background: "rgba(255,255,255,0.2)",
        color: "#fff",
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "4px 10px",
        borderRadius: "20px",
        marginBottom: "14px",
      }}>
        Interview Question
      </span>
      <p style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#ffffff",
        margin: 0,
        lineHeight: "1.5",
        position: "relative",
        zIndex: 1,
      }}>
        {question}
      </p>
    </div>
  );
}

export default QuestionCard;
