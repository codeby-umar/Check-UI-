// src/pages/LoginPage.jsx
import { useState } from "react";
import { Card, Btn, Input } from "../components/UI";

export default function LoginPage({ onLogin, error, setError }) {
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const hour = new Date().getHours();
  const isOpen = hour >= 8 && hour < 22;

  const handleSubmit = () => {
    if (!login || !pass) {
      setError("Login va parolni kiriting");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = onLogin(login, pass);
      if (!ok) setLoading(false);
    }, 700);
  };

  const hints = [
    { icon: "👨‍🏫", text: "nodira / 1234  — Matematika o'qituvchisi" },
    { icon: "👨‍🏫", text: "bahodur / 1234 — Fizika o'qituvchisi" },
    { icon: "⚙", text: "admin / root   — Administrator" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -right-40 top-16 h-[460px] w-[460px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-[420px] px-5 animate-[fadeUp_.45s_ease] relative">
        {/* Time status pill */}
        <div
          className={[
            "mx-auto mb-7 w-fit rounded-full px-4 py-2 text-xs font-semibold border flex items-center gap-2",
            isOpen
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
              : "bg-rose-500/10 text-rose-600 border-rose-500/25",
          ].join(" ")}
        >
          <span
            className={[
              "h-2 w-2 rounded-full",
              isOpen ? "bg-emerald-500" : "bg-rose-500",
              "animate-[blink_1.5s_infinite]",
            ].join(" ")}
          />
          {isOpen ? "Tizim faol · 22:00 da yopiladi" : "Tizim yopiq · 08:00 da ochiladi"}
        </div>

        <Card hover={false} className="p-9">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-1">
              Check UI
            </div>
            <div className="text-[13px] text-slate-500">O&apos;qituvchi va admin uchun</div>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-3.5">
            <Input
              label="LOGIN"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="loginni kiriting"
            />

            {/* Password with eye toggle */}
            <div>
              <label className="mb-2 block text-[11px] font-semibold tracking-[0.18em] text-slate-500">
                PAROL
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="parolni kiriting"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-violet-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-600 transition"
                  aria-label={showPass ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPass ? "◎" : "◉"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error ? (
              <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-600 animate-[fadeIn_.2s_ease]">
                ⚠ {error}
              </div>
            ) : null}

            <Btn
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 text-[15px] animate-[pulse_2s_infinite]"
            >
              {loading ? "Tekshirilmoqda..." : "Kirish →"}
            </Btn>
          </div>

          {/* Demo hints */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.12em] text-slate-500">
              DEMO KIRISH (faqat o&apos;qituvchi/admin)
            </div>

            <div className="space-y-1">
              {hints.map((h, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const [l, p] = h.text.split(" — ")[0].trim().split(" / ");
                    setLogin(l.trim());
                    setPass(p.trim());
                  }}
                  className="text-xs text-slate-500 cursor-pointer py-1 hover:text-violet-600 transition"
                >
                  {h.icon} {h.text}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Student block notice */}
        <div className="mt-4 text-center text-xs text-slate-500 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
          🚫 O&apos;quvchilar bu tizimga kira olmaydi
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes blink { 0%, 100% { opacity: .35 } 50% { opacity: 1 } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}