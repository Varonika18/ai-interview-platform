import React from "react";

function QuestionCard({ question }) {
  return (
    <div style={{
      background: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
    }}>
      <h3>Interview Question</h3>
      <p>{question}</p>
    </div>
  );
}

export default QuestionCard;