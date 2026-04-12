"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Space Mono', monospace",
    }}>
      <div style={{ marginBottom: "2rem", fontSize: "1.1rem", fontWeight: "700", letterSpacing: "0.15em", color: "#f0f0f0" }}>
        MOGGED<span style={{ color: "#eab308" }}>AI</span>
      </div>
      <SignIn forceRedirectUrl="/dashboard" appearance={{
        variables: {
          colorBackground: "#ffffff",
          colorText: "#111111",
          colorPrimary: "#eab308",
          colorInputBackground: "#f5f5f5",
          colorInputText: "#111111",
          colorNeutral: "#333333",
        },
      }} />
    </div>
  );
}
