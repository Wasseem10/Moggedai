"use client";
import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const FREQ_LABELS: Record<number, string> = {
  30: "Every 30 min",
  60: "Every hour",
  120: "Every 2 hours",
  180: "Every 3 hours",
};

type UserData = {
  phone: string;
  goal_text: string;
  frequency_minutes: number;
  start_time: string;
  end_time: string;
  active: boolean;
};

const navStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 2rem", borderBottom: "1px solid rgba(220,38,38,0.2)", background: "rgba(8,8,8,0.9)" };
const logoStyle: React.CSSProperties = { fontSize: "1.1rem", fontWeight: "700", letterSpacing: "0.15em", cursor: "pointer", color: "#f0f0f0", fontFamily: "'Space Mono', monospace" };
const bodyStyle: React.CSSProperties = { maxWidth: "600px", margin: "0 auto", padding: "4rem 2rem" };
const labelStyle: React.CSSProperties = { fontSize: "0.6rem", letterSpacing: "0.25em", color: "#555", marginBottom: "0.5rem", display: "block", fontFamily: "'Space Mono', monospace" };
const cardStyle: React.CSSProperties = { background: "#111", border: "1px solid #1e1e1e", padding: "1.5rem", marginBottom: "1rem" };
const valueStyle: React.CSSProperties = { fontSize: "1rem", color: "#f0f0f0", lineHeight: "1.6", fontFamily: "'Space Mono', monospace" };

export default function Dashboard() {
  const { isLoaded } = useUser();
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((d) => { setData(d.user); setLoading(false); });
  }, []);

  const toggleActive = async () => {
    if (!data) return;
    setToggling(true);
    await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !data.active }),
    });
    setData({ ...data, active: !data.active });
    setToggling(false);
  };

  const btnStyle = (primary: boolean): React.CSSProperties => ({
    background: primary ? "#dc2626" : "transparent",
    border: primary ? "none" : "1px solid #dc2626",
    color: primary ? "#fff" : "#dc2626",
    padding: "0.9rem 2rem",
    fontSize: "0.8rem",
    letterSpacing: "0.15em",
    cursor: "pointer",
    fontFamily: "'Space Mono', monospace",
    fontWeight: "700",
    width: "100%",
    marginTop: "0.5rem",
  });

  const mutedBtnStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #222",
    color: "#555",
    padding: "0.9rem 2rem",
    fontSize: "0.8rem",
    letterSpacing: "0.15em",
    cursor: "pointer",
    fontFamily: "'Space Mono', monospace",
    fontWeight: "700",
    width: "100%",
    marginTop: "0.5rem",
  };

  if (!isLoaded || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", color: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#f0f0f0" }}>
      <nav style={navStyle}>
        <div style={logoStyle} onClick={() => router.push("/")}>
          MOGGED<span style={{ color: "#dc2626" }}>AI</span>
        </div>
        <UserButton />
      </nav>
      <div style={bodyStyle}>
        <div style={{ marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", color: "#dc2626", border: "1px solid rgba(220,38,38,0.4)", padding: "0.3rem 0.8rem", fontFamily: "'Space Mono', monospace" }}>
            DASHBOARD
          </span>
        </div>

        {!data ? (
          <div>
            <p style={{ color: "#555", marginBottom: "2rem", fontSize: "0.85rem", fontFamily: "'Space Mono', monospace" }}>
              You haven&apos;t subscribed yet.
            </p>
            <button style={btnStyle(true)} onClick={() => router.push("/")}>GET STARTED →</button>
          </div>
        ) : (
          <>
            <div style={cardStyle}>
              <span style={labelStyle}>PHONE</span>
              <div style={valueStyle}>{data.phone}</div>
            </div>
            <div style={cardStyle}>
              <span style={labelStyle}>YOUR GOAL</span>
              <div style={valueStyle}>{data.goal_text}</div>
            </div>
            <div style={cardStyle}>
              <span style={labelStyle}>FREQUENCY</span>
              <div style={valueStyle}>{FREQ_LABELS[data.frequency_minutes] ?? `Every ${data.frequency_minutes} min`}</div>
            </div>
            <div style={cardStyle}>
              <span style={labelStyle}>ACTIVE HOURS</span>
              <div style={valueStyle}>{data.start_time} – {data.end_time}</div>
            </div>
            <div style={{ ...cardStyle, borderColor: data.active ? "rgba(220,38,38,0.3)" : "#333" }}>
              <span style={labelStyle}>STATUS</span>
              <div style={{ ...valueStyle, color: data.active ? "#dc2626" : "#555" }}>
                {data.active ? "ACTIVE — texts are sending" : "PAUSED — no texts"}
              </div>
            </div>
            <button style={btnStyle(!data.active)} onClick={toggleActive} disabled={toggling}>
              {toggling ? "..." : data.active ? "PAUSE TEXTS" : "RESUME TEXTS"}
            </button>
            <button style={mutedBtnStyle} onClick={() => router.push("/")}>
              UPDATE GOAL / SCHEDULE
            </button>
          </>
        )}
      </div>
    </div>
  );
}
