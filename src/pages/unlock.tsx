import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { setUnlocked } from "@/lib/unlockStore";

const UnlockPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.success === "1") {
      setUnlocked();
      // Redirect to play page after 3 seconds
      const timer = setTimeout(() => {
        router.push("/play");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [router.query.success, router]);

  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        <h1
          className="glitch-text"
          style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}
        >
          The Spiral Opens
        </h1>
        <p style={{ color: "#ccc", marginBottom: "1rem", fontSize: "0.95rem" }}>
          Your payment was received. The spiral will now show you everything it
          has been hiding.
        </p>
        <p style={{ color: "#777", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Redirecting to the full game in 3 seconds...
        </p>
        <button
          onClick={() => router.push("/play")}
          style={{
            padding: "0.7rem 1.4rem",
            borderRadius: "999px",
            border: "none",
            background:
              "linear-gradient(135deg, #e63946, #ffb703, #e63946)",
            color: "#050509",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Return to Session Now
        </button>
      </div>
    </Layout>
  );
};

export default UnlockPage;
