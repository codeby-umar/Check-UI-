import { STUDENTS, TASKS } from "../data/mockData";

const COLORS = {
  accent: "#6D5EF3",
  green: "#22C55E",
  amber: "#F59E0B",
  purple: "#A855F7",
  gold: "#FBBF24",
  text: "#0F172A",
  muted: "#64748B",
  border: "rgba(15, 23, 42, 0.10)",
  surface: "#FFFFFF",
  surface2: "rgba(15, 23, 42, 0.04)",
};

function Card({ children, style }) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Avatar({ name, initials, color = COLORS.accent, size = 36 }) {
  const text =
    initials ||
    (name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "grid",
        placeItems: "center",
        color: "#fff",
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: 0.8,
        flexShrink: 0,
      }}
      title={name}
    >
      {text}
    </div>
  );
}

export default function DashboardPage({ user }) {
  const safeStudents = Array.isArray(STUDENTS) ? STUDENTS : [];
  const safeTasks = Array.isArray(TASKS) ? TASKS : [];

  const avgRating =
    safeStudents.length > 0
      ? (
          safeStudents.reduce((sum, s) => sum + (Number(s.rating) || 0), 0) /
          safeStudents.length
        ).toFixed(1)
      : "0.0";

  const pendingTasks = safeTasks.filter((t) => t.status === "pending").length;
  const doneTasks = safeTasks.filter((t) => t.status === "done").length;

  const stats = [
    { label: "JAMI O'QUVCHILAR", value: safeStudents.length, color: COLORS.accent },
    { label: "O'RT. REYTING", value: avgRating, color: COLORS.green },
    { label: "FAOL VAZIFALAR", value: pendingTasks, color: COLORS.amber },
    { label: "BAJARILGAN", value: doneTasks, color: COLORS.purple },
  ];

  const firstName = (user?.name || "User").split(" ")[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: COLORS.text }}>
            Salom, {firstName} 👋
          </div>
          <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>
            {new Date().toLocaleDateString("uz-UZ", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 999,
            border: `1px solid ${COLORS.border}`,
            background: "rgba(34,197,94,0.10)",
            color: COLORS.green,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>●</span>
          Faol sessiya
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
            <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 800, letterSpacing: 0.8, marginBottom: 10 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
        {/* Rating */}
        <Card>
          <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 16, color: COLORS.text }}>
            Sinf reytingi — Fevral
          </div>

          {safeStudents.map((s, i) => (
            <div
              key={s.id ?? i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderBottom: i < safeStudents.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}
            >
              <div
                style={{
                  width: 34,
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: 14,
                  color: i < 3 ? COLORS.gold : COLORS.muted,
                }}
              >
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>

              <Avatar name={s.name} initials={s.avatar} color={s.color || COLORS.accent} size={36} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
                  Davomat: {s.attendance}% · Vazifa: {s.tasks}/21
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 90, height: 6, background: COLORS.surface2, borderRadius: 999, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(Number(s.rating) || 0) * 10}%`,
                      background: s.color || COLORS.accent,
                    }}
                  />
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, minWidth: 34, textAlign: "right", color: s.color || COLORS.accent }}>
                  {s.rating}
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Tasks */}
        <Card>
          <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 16, color: COLORS.text }}>
            Vazifalar holati
          </div>

          {safeTasks.map((task, i) => {
            const dot =
              task.status === "done" ? COLORS.green : task.status === "pending" ? COLORS.amber : COLORS.muted;

            return (
              <div
                key={task.id ?? i}
                style={{
                  padding: "12px 0",
                  borderBottom: i < safeTasks.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    marginTop: 5,
                    background: dot,
                    boxShadow: task.status === "done" ? `0 0 10px rgba(34,197,94,0.6)` : "none",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>
                    {task.subject} — {task.title}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
                    {task.submitted}/{task.total} topshirdi · {task.teacher}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
} 