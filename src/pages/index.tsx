import React from "react";
import Link from "next/link";
import Layout from "@/components/Layout";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <h1
        className="glitch-text"
        style={{ fontSize: "2rem", marginBottom: "0.75rem" }}
      >
        The Spiral's Whisper
      </h1>
      <p style={{ color: "#ccc", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        A social horror game for group calls and late–night chats. The more you
        talk about it, the closer it gets.
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 1.5rem",
          color: "#aaa",
          fontSize: "0.9rem"
        }}
      >
        <li>• Play together in the same room or call.</li>
        <li>• Make choices as a group. Watch the spiral react.</li>
        <li>• Unlock deeper events and endings with a one–time payment.</li>
      </ul>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/play">
          <button
            style={{
              padding: "0.7rem 1.4rem",
              borderRadius: "999px",
              border: "none",
              background:
                "linear-gradient(135deg, #e63946, #ffb703, #e63946)",
              color: "#050509",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(230,57,70,0.6)";
              (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.boxShadow = "";
              (e.target as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            Start a Session
          </button>
        </Link>
        <a href="#how">
          <button
            style={{
              padding: "0.7rem 1.4rem",
              borderRadius: "999px",
              border: "1px solid rgba(245,245,245,0.2)",
              background: "transparent",
              color: "#f5f5f5",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "rgba(230,57,70,0.8)";
              (e.target as HTMLButtonElement).style.background = "rgba(230,57,70,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "rgba(245,245,245,0.2)";
              (e.target as HTMLButtonElement).style.background = "transparent";
            }}
          >
            How it works
          </button>
        </a>
      </div>
    </Layout>
  );
};

export default HomePage;
