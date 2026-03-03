// src/App.jsx
import { useState, useEffect } from "react";
import { T } from "./constants/theme";
import Sidebar from "./components/Sidebar";
import LoginPage    from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage  from "./pages/StudentsPage";
import TasksPage     from "./pages/TasksPage";

// Global styles injected once
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Instrument+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Instrument Sans', sans-serif; background: ${T.bg}; color: ${T.text}; }
  ::-webkit-scrollbar       { width: 6px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.3} }
`;

function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  const handleLogin  = (u) => { setUser(u); setPage("dashboard"); };
  const handleLogout = ()  => { setUser(null); setPage("dashboard"); };

  // ─── RENDER PAGE ────────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage user={user} />;
      case "students":  return <StudentsPage />;
      case "tasks":     return <TasksPage />;
      default:
        return (
          <div style={{ textAlign: "center", paddingTop: 80, color: T.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
            <div style={{ fontSize: 16 }}>Bu sahifa tez orada tayyor bo'ladi</div>
          </div>
        );
    }
  };

  // ─── NOT LOGGED IN ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <GlobalStyles />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  // ─── LOGGED IN ──────────────────────────────────────────────────────────────
  return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar
          user={user}
          page={page}
          setPage={setPage}
          onLogout={handleLogout}
        />
        <main style={{
          marginLeft: 220, flex: 1, padding: "36px 36px",
          minHeight: "100vh", background: T.bg,
          backgroundImage: `radial-gradient(ellipse 50% 40% at 70% 10%, ${T.accent}07 0%, transparent 60%)`,
          overflowY: "auto",
        }}>
          {renderPage()}
        </main>
      </div>
    </>
  );
}
