"use client";
import { useState } from "react";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function handleLogin() {
    setErr("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        setErr("パスワードが正しくありません");
      }
    } catch {
      setErr("エラーが発生しました");
    }
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#fff"
    }}>
      <div style={{ width: "300px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>パスワードを入力</h2>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="パスワード"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "16px",
            marginBottom: "10px"
          }}
        />
        {err && <p style={{ color: "red", marginBottom: "10px" }}>{err}</p>}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            background: "#006400",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          ログイン
        </button>
      </div>
    </div>
  );
}
