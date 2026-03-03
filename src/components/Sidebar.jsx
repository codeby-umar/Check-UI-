// src/components/Sidebar.jsx
import { Avatar, Btn } from "./UI";

const NAV = {
  teacher: [
    { icon: "◈", label: "Dashboard", key: "dashboard" },
    { icon: "◎", label: "Vazifalar", key: "tasks" },
    { icon: "✦", label: "O'quvchilar", key: "students" },
    { icon: "◉", label: "Reyting", key: "rating" },
    { icon: "▣", label: "SMS", key: "sms" },
  ],
  admin: [
    { icon: "◈", label: "Admin Panel", key: "dashboard" },
    { icon: "◎", label: "O'qituvchilar", key: "teachers" },
    { icon: "✦", label: "O'quvchilar", key: "students" },
    { icon: "◉", label: "Vazifalar", key: "tasks" },
    { icon: "▣", label: "SMS", key: "sms" },
  ],
};

export default function Sidebar({ user, page, setPage, onLogout }) {
  const nav = NAV[user?.role] || NAV.teacher;
  const firstName = (user?.name || "User").split(" ")[0];

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-[220px] min-h-screen bg-white border-r border-slate-200 flex flex-col py-6">
      {/* Logo */}
      <div className="px-5 pb-5 border-b border-slate-200">
        <div className="text-[22px] font-extrabold tracking-tight bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Check UI
        </div>
        <div className="mt-1 text-[11px] text-slate-500 tracking-wide">
          {user?.role === "admin" ? "Admin panel" : "O'qituvchi portali"}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3.5 flex flex-col gap-1">
        {nav.map((item) => {
          const active = page === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setPage(item.key)}
              className={[
                "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition border-l-2 text-left",
                active
                  ? "text-violet-600 bg-violet-600/10 border-l-violet-600 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 border-l-transparent",
              ].join(" ")}
            >
              <span className={["text-[15px]", active ? "opacity-100" : "opacity-60"].join(" ")}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User card */}
      <div className="mx-2.5 mb-2 rounded-2xl bg-slate-50 border border-slate-200 p-3.5">
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar initials={user?.avatar} color={user?.color} size={34} />
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-slate-900 truncate">{firstName}</div>
            <div className="text-[11px] text-slate-500 capitalize truncate">
              {user?.role === "admin"
                ? "Administrator"
                : `${user?.subject || ""} o'qituvchisi`}
            </div>
          </div>
        </div>

        <Btn variant="ghost" onClick={onLogout} className="w-full px-3 py-2 text-xs">
          Chiqish →
        </Btn>
      </div>
    </aside>
  );
}