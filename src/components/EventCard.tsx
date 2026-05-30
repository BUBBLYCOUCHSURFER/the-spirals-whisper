import React from "react";
import type { GameEvent, Choice } from "@/lib/gameData";

type Props = {
  event: GameEvent;
  onChoose: (choice: Choice) => void;
  locked?: boolean;
};

const EventCard: React.FC<Props> = ({ event, onChoose, locked }) => {
  return (
    <div
      style={{
        borderRadius: "12px",
        border: "1px solid rgba(245,245,245,0.12)",
        padding: "1.25rem",
        marginBottom: "1rem",
        background:
          "radial-gradient(circle at top left, rgba(230,57,70,0.12), rgba(5,5,9,0.98))"
      }}
    >
      <h2
        className="glitch-text"
        style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}
      >
        {event.title}
        {event.premium && (
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              color: "#e63946"
            }}
          >
            Premium
          </span>
        )}
      </h2>
      <p style={{ margin: "0 0 1rem", color: "#ddd", fontSize: "0.95rem" }}>
        {event.prompt}
      </p>
      {locked && event.premium ? (
        <p style={{ fontSize: "0.85rem", color: "#e63946" }}>
          This vision is locked. Unlock the full spiral to see what happens.
        </p>
      ) : (
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {event.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoose(choice)}
              style={{
                padding: "0.6rem 0.8rem",
                borderRadius: "999px",
                border: "1px solid rgba(245,245,245,0.16)",
                background: "rgba(5,5,9,0.9)",
                color: "#f5f5f5",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "0.9rem",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = "rgba(230,57,70,0.2)";
                (e.target as HTMLButtonElement).style.borderColor = "rgba(230,57,70,0.6)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = "rgba(5,5,9,0.9)";
                (e.target as HTMLButtonElement).style.borderColor = "rgba(245,245,245,0.16)";
              }}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCard;
