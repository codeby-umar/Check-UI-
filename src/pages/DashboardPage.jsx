// src/pages/DashboardPage.jsx
import { T } from "../constants/theme";
import { STUDENTS, TASKS } from "../data/mockData";
import { Card } from "../components/UI";
import { Avatar } from "../components/UI";
import { Chip } from "../components/UI";

export default function DashboardPage({ user }) {
  const avgRating = (STUDENTS.reduce((a, b) => a + b.rating, 0) / STUDENTS.length).toFixed(1);
  const pendingTasks = TASKS.filter(t => t.status === "pending").length;
  const doneTasks    = TASKS.filter(t => t.status === "done").length;

  const stats = [
    { label: "JAMI O'QUVCHILAR", value: STUDENTS.length, color: T.accent  },
    { label: "O'RT. REYTING",    value: avgRating,        color: T.green   },
    { label: "FAOL VAZIFALAR",   value: pendingTasks,     color: T.amber   },
    { label: "BAJARILGAN",       value: doneTasks,        color: T.purple  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeUp 0.4s ease" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, fontFamily: "'Clash Display', sans-serif" }}>
            Salom, {user.name.split(" ")[0]} 👋
          </div>
          <div style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>
            {new Date().toLocaleDateString("uz-UZ", { weekday: "long", day: "numeric", month: "long" })}
          </div>
        </div>
        <Chip color={T.green}>● Faol sessiya</Chip>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: 22, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color }} />
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: 0.8, marginBottom: 12 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color, fontFamily: "'Clash Display', sans-serif", lineHeight: 1 }}>
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>

        {/* Top students */}
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Clash Display', sans-serif", marginBottom: 20 }}>
            Sinf reytingi — Fevral
          </div>
          {STUDENTS.map((s, i) => (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 0", borderBottom: i < STUDENTS.length - 1 ? `1px solid ${T.border}` : "none",
            }}>
              <div style={{
                width: 28, textAlign: "center", fontWeight: 700,
                fontSize: 15, fontFamily: "'Clash Display', sans-serif",
                color: i < 3 ? T.gold : T.muted,
              }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>
              <Avatar initials={s.avatar} color={s.color} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>Davomat: {s.attendance}% · Vazifa: {s.tasks}/21</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 80, height: 5, background: T.surface3, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.rating * 10}%`, background: s.color, borderRadius: 3 }} />
                </div>
                <div style={{
                  fontSize: 17, fontWeight: 700, color: s.color, minWidth: 32,
                  fontFamily: "'Clash Display', sans-serif",
                }}>
                  {s.rating}
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Tasks overview */}
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Clash Display', sans-serif", marginBottom: 20 }}>
            Vazifalar holati
          </div>
          {TASKS.map(task => (
            <div key={task.id} style={{
              padding: "13px 0", borderBottom: `1px solid ${T.border}`,
              display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                background: task.status === "done" ? T.green : task.status === "pending" ? T.amber : T.muted,
                boxShadow: task.status === "done" ? `0 0 6px ${T.green}` : "none",
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{task.subject} — {task.title}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>
                  {task.submitted}/{task.total} topshirdi · {task.teacher}
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
