import React from "react";

function AnswerBox({ answer, setAnswer, submitAnswer, loading, submitted }) {
  return (
    <div style={{
      background: "#fff",
      padding: "24px",
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      marginBottom: "20px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#374151", margin: 0 }}>
          Your Answer
        </h3>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
          {answer.length} chars
        </span>
      </div>

      <textarea
        rows="7"
        placeholder="Type your answer here. Be as detailed as possible — the AI evaluates based on semantic similarity to ideal answers."
        style={{
          width: "100%",
          padding: "14px",
          fontSize: "15px",
          borderRadius: "10px",
          border: "1.5px solid #e5e7eb",
          outline: "none",
          resize: "vertical",
          fontFamily: "inherit",
          lineHeight: "1.6",
          color: "#111827",
          background: "#f9fafb",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onFocus={(e) => e.target.style.borderColor = "#6366f1"}
        onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
        disabled={submitted}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
        <button
          onClick={submitAnswer}
          disabled={loading || !answer.trim() || submitted}
          style={{
            padding: "11px 24px",
            backgroundColor: loading || submitted ? "#a5b4fc" : "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: loading || !answer.trim() || submitted ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "background 0.2s",
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: "14px", height: "14px",
                border: "2px solid rgba(255,255,255,0.4)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.8s linear infinite",
              }} />
              Evaluating...
            </>
          ) : submitted ? "✓ Evaluated" : "Evaluate Answer →"}
        </button>

        {submitted && (
          <button
            onClick={() => {}}
            style={{
              padding: "11px 16px",
              background: "#f3f4f6",
              color: "#374151",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              cursor: "default",
              fontSize: "13px",
            }}
          >
            Click "Next Question" below to continue
          </button>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default AnswerBox;
