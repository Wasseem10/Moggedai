"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ marginBottom: "2rem", fontSize: "1.1rem", fontWeight: "700", letterSpacing: "0.15em", color: "#f0f0f0" }}>
        MOGGED<span style={{ color: "#dc2626" }}>AI</span>
      </div>
      <SignUp appearance={{
        variables: {
          colorBackground: "#ffffff",
          colorText: "#111111",
          colorPrimary: "#dc2626",
          colorInputBackground: "#f5f5f5",
          colorInputText: "#111111",
          colorNeutral: "#333333",
        },
      }} />
    </div>
  );
}
