import { useEffect, useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');`;
const COLORS = [
  "#F97316",
  "#3B82F6",
  "#22C55E",
  "#EC4899",
  "#8B5CF6",
  "#EF4444",
  "#F59E0B",
  "#6366F1",
];

let nextId = 10;
const getDaysLeft = (due) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(due);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d - today) / 86400000);
};
const getDaysSince = (created) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(created);
  d.setHours(0, 0, 0, 0);
  return Math.floor((today - d) / 86400000);
};

export default function FiniteEvents() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Launch Finite v1.0",
      due: "2026-04-15",
      color: "#F97316",
      createdAt: "2026-02-01",
    },
    {
      id: 2,
      name: "Sinh nhật mẹ",
      due: "2026-03-22",
      color: "#EC4899",
      createdAt: "2026-02-10",
    },
    {
      id: 3,
      name: "Deadline dự án ABC",
      due: "2026-03-05",
      color: "#3B82F6",
      createdAt: "2026-01-20",
    },
    {
      id: 4,
      name: "Chạy marathon Đà Nẵng",
      due: "2026-06-10",
      color: "#22C55E",
      createdAt: "2026-02-25",
    },
    {
      id: 5,
      name: "Gia hạn hộ chiếu",
      due: "2026-02-20",
      color: "#EF4444",
      createdAt: "2026-01-15",
    },
  ]);
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const saveEvent = (evt) => {
    if (evt.id) {
      setEvents((prev) => prev.map((e) => (e.id === evt.id ? evt : e)));
      setToast("Đã cập nhật ✓");
    } else {
      setEvents((prev) => [
        ...prev,
        {
          ...evt,
          id: nextId++,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      setToast("Đã thêm ✓");
    }
    setModal(null);
  };
  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
    setModal(null);
    setToast("Đã xóa ✓");
  };

  const sorted = [...events].sort(
    (a, b) => getDaysLeft(a.due) - getDaysLeft(b.due),
  );
  const upcoming = sorted.filter((e) => getDaysLeft(e.due) >= 0);
  const past = sorted.filter((e) => getDaysLeft(e.due) < 0);

  // ==================== EVENT ROW ====================
  const EventRow = ({ event, index }) => {
    const days = getDaysLeft(event.due);
    const daysSince = getDaysSince(event.createdAt);
    const isPast = days < 0;
    const isToday = days === 0;
    const totalSpan = daysSince + Math.max(days, 0);
    const progress =
      totalSpan > 0 ? Math.min((daysSince / totalSpan) * 100, 100) : 100;

    return (
      <button
        onClick={() => setModal(event)}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: 16,
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${event.color}20`,
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: 16,
          transition: "all 0.15s ease",
          opacity: isPast ? 0.45 : 1,
          animation: `fadeSlideIn 0.35s ease ${index * 0.06}s both`,
        }}
      >
        {/* Circle badge with label */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            flexShrink: 0,
            background: event.color,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: (isPast ? Math.abs(days) : days) > 99 ? 15 : 20,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {isToday ? "!" : isPast ? Math.abs(days) : days}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              marginTop: 2,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {isToday ? "today" : isPast ? "ago" : "days"}
          </span>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              margin: 0,
              color: isPast ? "rgba(255,255,255,0.4)" : "#fff",
              textDecoration: isPast ? "line-through" : "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {event.name}
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              margin: 0,
              marginTop: 3,
              color: isPast
                ? "rgba(255,255,255,0.15)"
                : "rgba(255,255,255,0.3)",
            }}
          >
            {event.due}
          </p>
          {/* Progress: elapsed / total */}
          <div
            style={{
              marginTop: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 3,
                borderRadius: 99,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.max(2, progress)}%`,
                  height: "100%",
                  borderRadius: 99,
                  background: event.color,
                  opacity: 0.6,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.2)",
                flexShrink: 0,
              }}
            >
              {daysSince}/{totalSpan}d
            </span>
          </div>
        </div>

        {/* Chevron */}
        <span
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.12)",
            flexShrink: 0,
          }}
        >
          ›
        </span>
      </button>
    );
  };

  // ==================== MODAL ====================
  const Modal = ({ event, onClose }) => {
    const isNew = !event.id;
    const [name, setName] = useState(event.name || "");
    const [due, setDue] = useState(
      event.due ||
        new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    );
    const [color, setColor] = useState(event.color || "#F97316");

    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
          }}
        />
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#1A1A22",
            borderRadius: "20px 20px 0 0",
            padding: "20px 20px 34px",
            position: "relative",
            zIndex: 1,
            animation: "slideUp 0.3s ease",
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 99,
              background: "rgba(255,255,255,0.15)",
              margin: "0 auto 18px",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 22,
            }}
          >
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {isNew ? "Sự kiện mới" : "Chỉnh sửa"}
            </span>
            {!isNew && (
              <button
                onClick={() => setDeleteConfirm(event.id)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#EF4444",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Xóa
              </button>
            )}
          </div>

          {deleteConfirm === event.id && (
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Xóa sự kiện này?
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    background: "#EF4444",
                    border: "none",
                    color: "#fff",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "1px",
                display: "block",
                marginBottom: 6,
              }}
            >
              TÊN SỰ KIỆN
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Deadline dự án, Sinh nhật..."
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "1px",
                display: "block",
                marginBottom: 6,
              }}
            >
              NGÀY ĐẾN HẠN
            </label>
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 15,
                outline: "none",
                colorScheme: "dark",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "1px",
                display: "block",
                marginBottom: 8,
              }}
            >
              MÀU SẮC
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: c,
                    border:
                      color === c ? "3px solid #fff" : "3px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    transform: color === c ? "scale(1.15)" : "scale(1)",
                    boxShadow: color === c ? `0 0 12px ${c}55` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (name.trim() && due) saveEvent({ ...event, name, due, color });
            }}
            disabled={!name.trim()}
            style={{
              width: "100%",
              padding: "15px 0",
              borderRadius: 14,
              border: "none",
              background: name.trim() ? color : "rgba(255,255,255,0.06)",
              color: name.trim() ? "#fff" : "rgba(255,255,255,0.2)",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              cursor: name.trim() ? "pointer" : "default",
            }}
          >
            {isNew ? "+ Tạo sự kiện" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    );
  };

  // ==================== MAIN ====================
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#0A0A0F",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <style>{FONTS}</style>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 20px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              Events
            </h1>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: "rgba(255,255,255,0.25)",
                margin: 0,
                marginTop: 2,
              }}
            >
              {upcoming.length} upcoming
            </p>
          </div>
          <button
            onClick={() => setModal({})}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              background: "#F97316",
              color: "#fff",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ padding: "20px 16px 40px" }}>
        {events.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <span
              style={{
                fontSize: 48,
                display: "block",
                marginBottom: 16,
                opacity: 0.15,
              }}
            >
              📅
            </span>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.3)",
                margin: "0 0 6px",
              }}
            >
              Chưa có sự kiện nào
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.15)",
                margin: 0,
              }}
            >
              Tạo sự kiện để đếm ngược
            </p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "1.5px",
                    margin: "0 0 12px",
                    paddingLeft: 4,
                  }}
                >
                  UPCOMING
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {upcoming.map((e, i) => (
                    <EventRow key={e.id} event={e} index={i} />
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.15)",
                    letterSpacing: "1.5px",
                    margin: "0 0 12px",
                    paddingLeft: 4,
                  }}
                >
                  PAST
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {past.map((e, i) => (
                    <EventRow key={e.id} event={e} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <Modal
          event={modal}
          onClose={() => {
            setModal(null);
            setDeleteConfirm(null);
          }}
        />
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            borderRadius: 99,
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.25)",
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            color: "#22C55E",
            animation: "toastIn 0.3s ease",
            zIndex: 200,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
