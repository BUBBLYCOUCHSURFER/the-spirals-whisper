import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import SpiralMeter from "@/components/SpiralMeter";
import EventCard from "@/components/EventCard";
import { allEvents } from "@/lib/gameData";
import type { GameEvent, Choice } from "@/lib/gameData";
import { isUnlocked } from "@/lib/unlockStore";
import { generateGumroadCheckoutUrl } from "@/lib/gumroad";

const PlayPage: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [corruption, setCorruption] = useState(0);
  const [index, setIndex] = useState(0);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [isEnded, setIsEnded] = useState(false);
  const [ending, setEnding] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  useEffect(() => {
    const u = isUnlocked();
    setUnlocked(u);
    setEvents(allEvents(u));
  }, []);

  const current = events[index];

  const handleChoice = (choice: Choice) => {
    const nextCorruption = Math.min(100, corruption + choice.corruptionDelta);
    setCorruption(nextCorruption);

    if (index + 1 < events.length) {
      setIndex(index + 1);
    } else {
      // game ending
      const ending =
        nextCorruption >= 70
          ? "The spiral notices you. It will remember this chat."
          : "For now, the spiral loosens its grip.";
      setEnding(ending);
      setIsEnded(true);
    }
  };

  const handleUnlock = () => {
    // Show email prompt (optional but recommended)
    setShowEmailPrompt(true);
  };

  const handleProceedToCheckout = () => {
    const username = process.env.NEXT_PUBLIC_GUMROAD_USERNAME || "your_username";
    const productId = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_ID || "your_product_id";
    
    const checkoutUrl = generateGumroadCheckoutUrl(username, productId, email);
    window.location.href = checkoutUrl;
  };

  const handleReset = () => {
    setIndex(0);
    setCorruption(0);
    setIsEnded(false);
    setEnding("");
  };

  return (
    <Layout>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/">
          <button
            style={{
              fontSize: "0.85rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "999px",
              border: "1px solid rgba(245,245,245,0.2)",
              background: "transparent",
              color: "#aaa",
              cursor: "pointer",
              marginBottom: "1rem"
            }}
          >
            ← Back to lobby
          </button>
        </Link>
        <h1
          className="glitch-text"
          style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}
        >
          Session Room
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#aaa", margin: 0 }}>
          Read the prompt aloud. Let the group vote. Tap the choice you agree
          on.
        </p>
      </div>

      <SpiralMeter value={corruption} />

      {isEnded ? (
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(230,57,70,0.3)",
            padding: "1.5rem",
            background:
              "radial-gradient(circle at top left, rgba(230,57,70,0.12), rgba(5,5,9,0.98))",
            marginBottom: "1rem"
          }}
        >
          <h2
            className="glitch-text"
            style={{ margin: "0 0 0.75rem", fontSize: "1.2rem" }}
          >
            Session Ended
          </h2>
          <p style={{ margin: "0 0 1rem", color: "#ddd", fontSize: "0.95rem" }}>
            {ending}
          </p>
          <p style={{ margin: 0, color: "#aaa", fontSize: "0.85rem" }}>
            Final Corruption: {corruption}%
          </p>
        </div>
      ) : current ? (
        <EventCard
          event={current}
          onChoose={handleChoice}
          locked={!unlocked}
        />
      ) : (
        <p style={{ color: "#aaa" }}>Loading the next whisper...</p>
      )}

      {isEnded && (
        <button
          onClick={handleReset}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "999px",
            border: "none",
            background:
              "linear-gradient(135deg, #e63946, #ffb703, #e63946)",
            color: "#050509",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "1rem",
            width: "100%"
          }}
        >
          Start New Session
        </button>
      )}

      {!unlocked && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "12px",
            border: "1px dashed rgba(245,245,245,0.2)",
            background: "rgba(5,5,9,0.9)"
          }}
        >
          {!showEmailPrompt ? (
            <>
              <p
                style={{
                  margin: "0 0 0.75rem",
                  fontSize: "0.9rem",
                  color: "#ddd"
                }}
              >
                You're playing the demo spiral. Unlock the full set of events,
                endings, and visual glitches with a one–time payment.
              </p>
              <button
                onClick={handleUnlock}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "999px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #e63946, #ffb703, #e63946)",
                  color: "#050509",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  width: "100%"
                }}
              >
                Unlock the Spiral
              </button>
            </>
          ) : (
            <>
              <p
                style={{
                  margin: "0 0 0.75rem",
                  fontSize: "0.9rem",
                  color: "#ddd"
                }}
              >
                Enter your email to receive your license key and unlock access.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid rgba(230,57,70,0.3)",
                  background: "rgba(5,5,9,0.9)",
                  color: "#f5f5f5",
                  marginBottom: "0.75rem",
                  fontSize: "0.9rem"
                }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <button
                  onClick={() => setShowEmailPrompt(false)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(245,245,245,0.2)",
                    background: "transparent",
                    color: "#f5f5f5",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToCheckout}
                  disabled={!email}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "999px",
                    border: "none",
                    background:
                      email
                        ? "linear-gradient(135deg, #e63946, #ffb703, #e63946)"
                        : "rgba(230,57,70,0.3)",
                    color: "#050509",
                    fontWeight: 600,
                    cursor: email ? "pointer" : "not-allowed",
                    fontSize: "0.9rem"
                  }}
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default PlayPage;
