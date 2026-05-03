import React from "react";

function Navbar() {
  return (
    <div style={{
      background: "#fff",
      borderBottom: "1px solid #e5e7eb",
      padding: "0 24px",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "32px", height: "32px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px",
        }}>
          🎯
        </div>
        <span style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>
          InterviewAI
        </span>
      </div>
      <span style={{
        fontSize: "12px",
        background: "#f0f0ff",
        color: "#6366f1",
        padding: "4px 12px",
        borderRadius: "20px",
        fontWeight: "600",
      }}>
        Practice Mode
      </span>
    </div>
  );
}

export default Navbar;
