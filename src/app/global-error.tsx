"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          color: "#F5F0E8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Something went wrong
          </h2>
          <p style={{ color: "#999", marginBottom: "2rem", fontSize: "0.875rem" }}>
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#C5972C",
              color: "#0A0A0A",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
              marginRight: "1rem",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "transparent",
              color: "#C5972C",
              border: "1px solid #C5972C",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Go Home
          </button>
        </div>
      </body>
    </html>
  );
}
