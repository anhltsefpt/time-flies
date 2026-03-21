import { useState, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');`;
const COLORS = ["#F97316", "#3B82F6", "#22C55E", "#EC4899", "#8B5CF6", "#EF4444", "#F59E0B", "#6366F1"];

let nextId = 10;
const getDaysLeft = (due) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const d = new Date(due); d.setHours(0, 0, 0, 0);
    return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
};

export default function FiniteEvents() {
    const [events, setEvents] = useState([
        { id: 1, name: "Launch Finite v1.0", due: "2026-04-15", color: "#F97316" },
        { id: 2, name: "Sinh nhật mẹ", due: "2026-03-22", color: "#EC4899" },
        { id: 3, name: "Deadline dự án ABC", due: "2026-03-05", color: "#3B82F6" },
        { id: 4, name: "Chạy marathon Đà Nẵng", due: "2026-06-10", color: "#22C55E" },
        { id: 5, name: "Gia hạn hộ chiếu", due: "2026-02-20", color: "#EF4444" },
    ]);
    const [modal, setModal] = useState(null); // null=closed, {}=new, {id,...}=edit
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t); } }, [toast]);

    const saveEvent = (evt) => {
        if (evt.id) {
            setEvents(prev => prev.map(e => e.id === evt.id ? evt : e));
            setToast("Đã cập nhật ✓");
        } else {
            setEvents(prev => [...prev, { ...evt, id: nextId++ }]);
            setToast("Đã thêm ✓");
        }
        setModal(null);
    };
    const deleteEvent = (id) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        setDeleteConfirm(null); setModal(null); setToast("Đã xóa ✓");
    };

    const sorted = [...events].sort((a, b) => getDaysLeft(a.due) - getDaysLeft(b.due));
    const upcoming = sorted.filter(e => getDaysLeft(e.due) >= 0);
    const past = sorted.filter(e => getDaysLeft(e.due) < 0);

    // ==================== EVENT CARD ====================
    const EventCard = ({ event, index }) => {
        const days = getDaysLeft(event.due);
        const isPast = days < 0;
        const isUrgent = days >= 0 && days <= 3;
        const isToday = days === 0;
        const dueDate = new Date(event.due);
        const totalDays = Math.max(1, Math.ceil((new Date(event.due) - new Date(2026, 0, 1)) / 86400000));
        const elapsed = totalDays - Math.max(days, 0);
        const progress = Math.min((elapsed / totalDays) * 100, 100);

        return (
            <button onClick={() => setModal(event)} style={{
                width: "100%", padding: "14px 14px", borderRadius: 16,
                background: isPast ? "rgba(255,255,255,0.02)" : `${event.color}06`,
                border: `1px solid ${isPast ? "rgba(255,255,255,0.04)" : isUrgent ? event.color + "40" : event.color + "15"}`,
                cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.15s ease", opacity: isPast ? 0.5 : 1,
                animation: `fadeSlideIn 0.4s ease ${index * 0.05}s both`,
            }}
                onMouseEnter={e => { if (!isPast) e.currentTarget.style.borderColor = `${event.color}50`; }}
                onMouseLeave={e => { if (!isPast) e.currentTarget.style.borderColor = isUrgent ? `${event.color}40` : `${event.color}15`; }}
            >
                {/* Countdown badge */}
                <div style={{
                    width: 60, height: 60, borderRadius: 14, flexShrink: 0,
                    background: isPast ? "rgba(255,255,255,0.03)" : `${event.color}12`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    boxShadow: isUrgent && !isPast ? `0 0 16px ${event.color}20` : "none",
                    position: "relative", overflow: "hidden",
                }}>
                    {/* Mini progress ring behind number */}
                    {!isPast && (
                        <svg width="60" height="60" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)", opacity: 0.2 }}>
                            <circle cx="30" cy="30" r="26" stroke={event.color} strokeWidth="2" fill="none"
                                strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 - (progress / 100) * 2 * Math.PI * 26} strokeLinecap="round" />
                        </svg>
                    )}
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: isToday ? 13 : 24, fontWeight: 800,
                        color: isPast ? "rgba(255,255,255,0.2)" : event.color, lineHeight: 1, position: "relative",
                    }}>
                        {isToday ? "HÔM" : isPast ? Math.abs(days) : days}
                    </span>
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600,
                        color: isPast ? "rgba(255,255,255,0.12)" : `${event.color}77`, marginTop: 1, position: "relative",
                    }}>
                        {isToday ? "NAY" : "ngày"}
                    </span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, margin: 0, marginBottom: 4,
                        color: isPast ? "rgba(255,255,255,0.25)" : "#fff",
                        textDecoration: isPast ? "line-through" : "none",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{event.name}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: isPast ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.3)", margin: 0 }}>
                        {dueDate.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {/* Progress bar */}
                    {!isPast && (
                        <div style={{ width: "100%", height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)", marginTop: 6, overflow: "hidden" }}>
                            <div style={{ width: `${progress}%`, height: "100%", borderRadius: 99, background: event.color, opacity: 0.5, transition: "width 0.3s ease" }} />
                        </div>
                    )}
                </div>

                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.12)", flexShrink: 0 }}>✎</span>
            </button>
        );
    };

    // ==================== MODAL ====================
    const Modal = ({ event, onClose }) => {
        const isNew = !event.id;
        const [name, setName] = useState(event.name || "");
        const [due, setDue] = useState(event.due || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]);
        const [color, setColor] = useState(event.color || "#F97316");

        return (
            <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
                <div onClick={e => e.stopPropagation()} style={{
                    width: "100%", maxWidth: 420, background: "#1A1A22", borderRadius: "20px 20px 0 0",
                    padding: "20px 20px 32px", position: "relative", zIndex: 1, animation: "slideUp 0.3s ease",
                }}>
                    <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }} />

                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, color: "#fff" }}>{isNew ? "Sự kiện mới" : "Chỉnh sửa"}</span>
                        {!isNew && (
                            <button onClick={() => setDeleteConfirm(event.id)} style={{
                                padding: "6px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444",
                                fontFamily: "'Outfit', sans-serif", fontSize: 13, cursor: "pointer",
                            }}>🗑 Xóa</button>
                        )}
                    </div>

                    {/* Delete confirm */}
                    {deleteConfirm === event.id && (
                        <div style={{ padding: 12, borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Xóa sự kiện này?</span>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => setDeleteConfirm(null)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif", fontSize: 12, cursor: "pointer" }}>Hủy</button>
                                <button onClick={() => deleteEvent(event.id)} style={{ padding: "6px 12px", borderRadius: 8, background: "#EF4444", border: "none", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Xóa</button>
                            </div>
                        </div>
                    )}

                    {/* Name */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 6 }}>TÊN SỰ KIỆN</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="VD: Deadline dự án, Sinh nhật..."
                            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 15, outline: "none" }} />
                    </div>

                    {/* Due date */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 6 }}>NGÀY ĐẾN HẠN</label>
                        <input type="date" value={due} onChange={e => setDue(e.target.value)}
                            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 15, outline: "none", colorScheme: "dark" }} />
                    </div>

                    {/* Color */}
                    <div style={{ marginBottom: 22 }}>
                        <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 8 }}>MÀU SẮC</label>
                        <div style={{ display: "flex", gap: 10 }}>
                            {COLORS.map(c => (
                                <button key={c} onClick={() => setColor(c)} style={{
                                    width: 36, height: 36, borderRadius: 10, background: c,
                                    border: color === c ? "2.5px solid #fff" : "2.5px solid transparent",
                                    cursor: "pointer", transition: "all 0.15s ease",
                                    boxShadow: color === c ? `0 0 14px ${c}66` : "none",
                                    transform: color === c ? "scale(1.15)" : "scale(1)",
                                }} />
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    {name.trim() && (
                        <div style={{
                            padding: "10px 14px", borderRadius: 10, background: `${color}10`, border: `1px solid ${color}25`,
                            marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
                        }}>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, color }}>
                                {getDaysLeft(due)}
                            </span>
                            <div>
                                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{name}</span>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.25)", display: "block" }}>
                                    {getDaysLeft(due) > 0 ? `còn ${getDaysLeft(due)} ngày` : getDaysLeft(due) === 0 ? "hôm nay!" : `${Math.abs(getDaysLeft(due))} ngày trước`}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Save */}
                    <button onClick={() => { if (name.trim() && due) saveEvent({ ...event, name, due, color }); }} disabled={!name.trim()} style={{
                        width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                        background: name.trim() ? `linear-gradient(135deg, ${color}, ${color}CC)` : "rgba(255,255,255,0.06)",
                        color: name.trim() ? "#fff" : "rgba(255,255,255,0.2)",
                        fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600,
                        cursor: name.trim() ? "pointer" : "default",
                    }}>{isNew ? "+ Tạo sự kiện" : "Lưu thay đổi"}</button>
                </div>
            </div>
        );
    };

    // ==================== MAIN ====================
    return (
        <div style={{
            width: "100%", maxWidth: 420, margin: "0 auto", minHeight: "100vh",
            background: "#0A0A0F", fontFamily: "'Outfit', sans-serif",
            display: "flex", flexDirection: "column",
        }}>
            <style>{FONTS}</style>
            <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

            {/* Header */}
            <div style={{
                padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
                <div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>📅 Sự kiện</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0, marginTop: 2 }}>
                        {upcoming.length} sắp tới • {past.length} đã qua
                    </p>
                </div>
                <button onClick={() => setModal({})} style={{
                    padding: "10px 16px", borderRadius: 10, border: "none",
                    background: "linear-gradient(135deg, #F97316, #FB923C)", color: "#fff",
                    fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5,
                }}>+ Thêm</button>
            </div>

            {/* List */}
            <div style={{ flex: 1, padding: "16px 16px 32px", overflowY: "auto" }}>
                {events.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: 80 }}>
                        <span style={{ fontSize: 56, display: "block", marginBottom: 16, opacity: 0.2 }}>📅</span>
                        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.35)", margin: "0 0 6px" }}>Chưa có sự kiện nào</p>
                        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.18)", margin: "0 0 20px" }}>Tạo sự kiện để đếm ngược đến ngày quan trọng</p>
                        <button onClick={() => setModal({})} style={{
                            padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(249,115,22,0.3)",
                            background: "rgba(249,115,22,0.08)", color: "#F97316",
                            fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer",
                        }}>+ Tạo sự kiện đầu tiên</button>
                    </div>
                ) : (
                    <>
                        {upcoming.length > 0 && (
                            <div style={{ marginBottom: 24 }}>
                                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", margin: "0 0 10px" }}>
                                    SẮP TỚI
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {upcoming.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
                                </div>
                            </div>
                        )}

                        {past.length > 0 && (
                            <div>
                                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.15)", letterSpacing: "1.5px", margin: "0 0 10px" }}>
                                    ĐÃ QUA
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {past.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            {modal && <Modal event={modal} onClose={() => { setModal(null); setDeleteConfirm(null); }} />}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)",
                    padding: "10px 20px", borderRadius: 99,
                    background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
                    fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#22C55E",
                    animation: "toastIn 0.3s ease", zIndex: 200,
                }}>{toast}</div>
            )}
        </div>
    );
}