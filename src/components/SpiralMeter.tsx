import React from "react";

type Props = {
  value: number; // 0–100
};

const SpiralMeter: React.FC<Props> = ({ value }) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.8rem",
          color: "#bbb",
          marginBottom: "0.25rem"
        }}
      >
        <span>Spiral Corruption</span>
        <span>{clamped}%</span>
      </div>
      <div
        style={{
          height: "8px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            background:
              "linear-gradient(90deg, #e63946, #ffb703, #e63946)",
            boxShadow: "0 0 12px rgba(230,57,70,0.8)"
          }}
        />
      </div>
    </div>
  );
};

export default SpiralMeter;
