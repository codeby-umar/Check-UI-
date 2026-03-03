// src/components/Sidebar.jsx
import { Avatar, Btn } from "./UI";
import { T } from "../constants/theme";

const NAV = {
  teacher: [
    { icon: "◈", label: "Dashboard",    key: "dashboard" },
    { icon: "◎", label: "Vazifalar",    key: "tasks"     },
    { icon: "✦", label: "O'quvchilar",  key: "students"  },
    { icon: "◉", label: "Reyting",      key: "rating"    },
    { icon: "▣", label: "SMS",          key: "sms"       },
  ],
  admin: [
    { icon: "◈", label: "Admin Panel",  key: "dashboard" },
    { icon: "◎", label: "O'qituvchilar",key: "teachers"  },
    { icon: "✦", label: "O'quvchilar",  key: "students"  },
    { icon: "◉", label: "Vazifalar",    key: "tasks"     },
    { icon: "▣", label: "SMS",          key: "sms"       },
  ],
};

export default function Sidebar({ user, page, setPage, onLogout }) {
  const nav = NAV[user.role] || NAV.teacher;

  return (
    <aside style={{
      width: 220, minHeight: "100vh", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
      background: T.surface, borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column", padding: "24px 0",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 22px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{
          fontFamily: "'Clash Display', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: -1,
          background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Check UI</div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 2, letterSpacing: 0.5 }}>
          {user.role === "admin" ? "Admin panel" : "O'qituvchi portali"}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(item => {
          const active = page === item.key;
          return (
            <div key={item.key} onClick={() => setPage(item.key)} style={{
              display: "flex", alignItems: "center", gap: 11,
              padding: "10px 12px", borderRadius: 10, cursor: "pointer",
              fontSize: 13.5, fontWeight: active ? 600 : 400,
              color:      active ? T.accent : T.muted,
              background: active ? T.accent + "15" : "transparent",
              borderLeft: `2px solid ${active ? T.accent : "transparent"}`,
              transition: "all .15s",
            }}>
              <span style={{ fontSize: 15, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </nav>

      {/* User card */}
      <div style={{ margin: "0 10px 8px", borderRadius: 12, background: T.surface2, border: `1px solid ${T.border}`, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Avatar initials={user.avatar} color={user.color} size={34} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name.split(" ")[0]}</div>
            <div style={{ fontSize: 11, color: T.muted, textTransform: "capitalize" }}>
              {user.role === "admin" ? "Administrator" : `${user.subject} o'qituvchisi`}
            </div>
          </div>
        </div>
        <Btn variant="ghost" onClick={onLogout} style={{ width: "100%", padding: "7px", fontSize: 12 }}>
          Chiqish →
        </Btn>
      </div>
    </aside>
  );
}
