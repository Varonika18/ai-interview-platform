import React from "react";

function ScoreCard({ score }) {

  if (score === null) return null;

  return (
    <div style={{
      marginTop: "20px",
      background: "#e9f5ff",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
    }}>
      <h2>Your Score</h2>
      <h1>{score} / 10</h1>
    </div>
  );
}

export default ScoreCard;