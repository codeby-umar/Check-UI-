// src/pages/LoginPage.jsx
import { useState } from "react";
import { T } from "../constants/theme";
import { Card, Btn, Input } from "../components/UI";

export default function LoginPage({ onLogin, error, setError }) {
  const [login, setLogin]   = useState("");
  const [pass, setPass]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const now  = new Date();
  const hour = now.getHours();
  const isOpen = hour >= 8 && hour < 22;

  const handleSubmit = () => {
    if (!login || !pass) { setError("Login va parolni kiriting"); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = onLogin(login, pass);
      if (!ok) setLoading(false);
    }, 700);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: T.bg,
      backgroundImage: `
        radial-gradient(ellipse 60% 50% at 15% 50%, ${T.accent}0c 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 85% 30%, ${T.purple}0a 0%, transparent 60%)
      `,
    }}>
      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `linear-gradient(${T.text} 1px,transparent 1px),linear-gradient(90deg,${T.text} 1px,transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      <div style={{ width: "100%", maxWidth: 400, padding: 20, animation: "fadeUp 0.45s ease" }}>

        {/* Time status pill */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "7px 18px", borderRadius: 50, width: "fit-content", margin: "0 auto 28px",
          background: isOpen ? T.green + "15" : T.red + "15",
          border: `1px solid ${isOpen ? T.green + "40" : T.red + "40"}`,
          fontSize: 12, fontWeight: 600,
          color: isOpen ? T.green : T.red,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: isOpen ? T.green : T.red,
            animation: "blink 1.5s infinite",
          }} />
          {isOpen ? "Tizim faol · 22:00 da yopiladi" : "Tizim yopiq · 08:00 da ochiladi"}
        </div>

        <Card hover={false} style={{ padding: "36px 32px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 34, fontWeight: 700, letterSpacing: -1,
              background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 6,
            }}>Check UI</div>
            <div style={{ fontSize: 13, color: T.muted }}>O'qituvchi va admin uchun</div>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input
              label="LOGIN"
              value={login}
              onChange={e => setLogin(e.target.value)}
              placeholder="loginni kiriting"
            />

            {/* Password with eye toggle */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: T.muted, display: "block", marginBottom: 7 }}>
                PAROL
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={pass} onChange={e => setPass(e.target.value)}
                  placeholder="parolni kiriting"
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  style={{
                    width: "100%", padding: "13px 44px 13px 16px",
                    background: T.surface2, border: `1px solid ${T.border}`,
                    borderRadius: 12, color: T.text, fontSize: 14,
                    fontFamily: "'Instrument Sans', sans-serif", outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor  = T.border}
                />
                <button onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: T.muted, fontSize: 16,
                }}>{showPass ? "◎" : "◉"}</button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: T.red + "15", border: `1px solid ${T.red}33`,
                borderRadius: 10, padding: "10px 14px", fontSize: 13, color: T.red,
                animation: "fadeIn .2s",
              }}>⚠ {error}</div>
            )}

            <Btn
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", padding: 13, fontSize: 15, marginTop: 4, animation: "pulse 2s infinite" }}
            >
              {loading ? "Tekshirilmoqda..." : "Kirish →"}
            </Btn>
          </div>

          {/* Demo hints */}
          <div style={{ marginTop: 22, padding: 14, background: T.surface2, borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>
              DEMO KIRISH (faqat o'qituvchi/admin)
            </div>
            {[
              { icon: "👨‍🏫", text: "nodira / 1234  — Matematika o'qituvchisi" },
              { icon: "👨‍🏫", text: "bahodur / 1234 — Fizika o'qituvchisi"     },
              { icon: "⚙",   text: "admin / root   — Administrator"           },
            ].map((h, i) => (
              <div key={i} onClick={() => {
                const [l, p] = h.text.split(" — ")[0].trim().split(" / ");
                setLogin(l.trim()); setPass(p.trim());
              }} style={{
                fontSize: 12, color: T.muted, cursor: "pointer",
                padding: "3px 0", transition: "color .15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = T.accent}
                onMouseLeave={e => e.currentTarget.style.color = T.muted}
              >
                {h.icon} {h.text}
              </div>
            ))}
          </div>
        </Card>

        {/* Student block notice */}
        <div style={{
          marginTop: 16, textAlign: "center", fontSize: 12, color: T.muted,
          padding: "10px 16px", borderRadius: 10,
          background: T.red + "08", border: `1px solid ${T.red}20`,
        }}>
          🚫 O'quvchilar bu tizimga kira olmaydi
        </div>
      </div>
    </div>
  );
}
