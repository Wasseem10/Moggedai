"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Space Mono', monospace",
    }}>
      <SignIn appearance={{
        variables: {
          colorBackground: "#111",
          colorText: "#f0f0f0",
          colorPrimary: "#dc2626",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#f0f0f0",
        },
      }} />
    </div>
  );
}
