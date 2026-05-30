import React, { ReactNode } from "react";
import Head from "next/head";
import "../styles/globals.css";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>The Spiral's Whisper</title>
        <meta
          name="description"
          content="A social horror game where the more you talk about it, the closer it gets."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main
        className="spiral-bg"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            width: "100%",
            borderRadius: "16px",
            border: "1px solid rgba(245,245,245,0.08)",
            background:
              "radial-gradient(circle at top, rgba(230,57,70,0.12), rgba(5,5,9,0.98))",
            padding: "2rem",
            boxShadow: "0 0 40px rgba(0,0,0,0.8)"
          }}
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
