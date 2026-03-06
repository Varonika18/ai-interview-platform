import React from "react";

function AnswerBox({ answer, setAnswer, submitAnswer }) {
  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
    }}>
      <h3>Your Answer</h3>

      <textarea
        rows="6"
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button
        onClick={submitAnswer}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Evaluate Answer
      </button>
    </div>
  );
}

export default AnswerBox;