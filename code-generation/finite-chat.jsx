import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');`;

const CATEGORIES = {
  deep_work: { icon: "🎯", label: "Deep Work", color: "#F97316" },
  work: { icon: "💼", label: "Work", color: "#FB923C" },
  exercise: { icon: "🏃", label: "Exercise", color: "#22C55E" },
  learning: { icon: "📚", label: "Learning", color: "#3B82F6" },
  relationships: { icon: "👥", label: "Relationships", color: "#EC4899" },
  rest: { icon: "☕", label: "Rest", color: "#8B5CF6" },
  entertainment: { icon: "🎬", label: "Entertainment", color: "#6366F1" },
  wasted: { icon: "📱", label: "Wasted", color: "#EF4444" },
  health: { icon: "🍎", label: "Health", color: "#10B981" },
  family: { icon: "🏠", label: "Family", color: "#F472B6" },
  commute: { icon: "🚗", label: "Commute", color: "#64748B" },
};
const CAT_KEYS = Object.keys(CATEGORIES);

const INITIAL_BLOCKS = [
  { id: 1, start: 6, end: 6.5, cat: "exercise", note: "Chạy bộ" },
  { id: 2, start: 6.5, end: 7, cat: "health", note: "Ăn sáng" },
  { id: 3, start: 7, end: 7.5, cat: "commute", note: "Di chuyển" },
  { id: 4, start: 7.5, end: 11.5, cat: "deep_work", note: "Code feature mới" },
  { id: 5, start: 11.5, end: 12.5, cat: "relationships", note: "Ăn trưa với đồng nghiệp" },
  { id: 6, start: 12.5, end: 14, cat: "work", note: "Họp + review PR" },
  { id: 7, start: 14, end: 16, cat: "wasted", note: "Lướt mạng, không tập trung" },
  { id: 8, start: 16, end: 17.5, cat: "deep_work", note: "Fix bug production" },
  { id: 9, start: 17.5, end: 18, cat: "commute", note: "Di chuyển" },
  { id: 10, start: 18, end: 19, cat: "family", note: "Ăn tối với gia đình" },
  { id: 11, start: 19, end: 20, cat: "entertainment", note: "Xem phim" },
  { id: 12, start: 20, end: 21, cat: "learning", note: "Đọc sách" },
];

const SCORES = { focus: 72, balance: 85, intention: 64 };

const fmtTime = (h) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

const timeToHours = (str) => {
  const [hh, mm] = str.split(":").map(Number);
  return hh + mm / 60;
};

let nextId = 100;

export default function FiniteChat() {
  const [screen, setScreen] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const [showParsed, setShowParsed] = useState(false);
  const [scoreRevealed, setScoreRevealed] = useState(false);
  const [animatedScores, setAnimatedScores] = useState({ focus: 0, balance: 0, intention: 0 });
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [editBlock, setEditBlock] = useState(null);
  const [addGap, setAddGap] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const chatEndRef = useRef(null);

  const userReplies = [
    "Sáng dậy 6h chạy bộ 30 phút, rồi đi làm. Code feature mới từ 7:30 đến 11:30, khá tập trung.",
    "Trưa ăn với mấy đứa đồng nghiệp, rồi chiều họp review PR tầm 1 tiếng rưỡi. Sau đó lười quá lướt mạng tầm 2 tiếng 😅",
    "4h chiều tỉnh lại fix bug production đến 5:30. Tối ăn cơm với gia đình, xem phim 1 tiếng rồi đọc sách trước khi ngủ.",
  ];
  const systemReplies = [
    "Chạy bộ buổi sáng, nice! 💪 Rồi 4 tiếng deep work — ngày bắt đầu tốt đó. Buổi chiều thế nào?",
    "Haha 2 tiếng lướt mạng — mình note lại nhé 📱 Buổi tối bạn làm gì?",
    null,
  ];

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => setMessages([{ role: "system", text: "Hôm nay của bạn thế nào? Kể cho mình nghe đi 🙂" }]), 800);
    }
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  useEffect(() => {
    if (screen === "score" && !scoreRevealed) {
      setScoreRevealed(true);
      const duration = 1500, start = Date.now();
      const animate = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setAnimatedScores({ focus: Math.round(SCORES.focus * ease), balance: Math.round(SCORES.balance * ease), intention: Math.round(SCORES.intention * ease) });
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [screen]);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2500); return () => clearTimeout(t); } }, [toast]);

  const getGaps = () => {
    const sorted = [...blocks].sort((a, b) => a.start - b.start);
    const gaps = [];
    let cursor = 6;
    sorted.forEach(b => {
      if (b.start > cursor + 0.25) gaps.push({ start: cursor, end: b.start });
      cursor = Math.max(cursor, b.end);
    });
    if (cursor < 23) gaps.push({ start: cursor, end: 23 });
    return gaps;
  };

  const updateBlock = (id, updates) => { setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b)); setEditBlock(null); setToast("Đã cập nhật ✓"); };
  const deleteBlockFn = (id) => { setBlocks(prev => prev.filter(b => b.id !== id)); setDeleteConfirm(null); setEditBlock(null); setToast("Đã xóa ✓"); };
  const addBlockFn = (nb) => { setBlocks(prev => [...prev, { ...nb, id: nextId++ }].sort((a, b) => a.start - b.start)); setAddGap(null); setToast("Đã thêm ✓"); };
  const splitBlock = (block, at) => {
    setBlocks(prev => {
      const w = prev.filter(b => b.id !== block.id);
      return [...w, { ...block, end: at, id: nextId++ }, { ...block, start: at, note: block.note + " (2)", id: nextId++ }].sort((a, b) => a.start - b.start);
    });
    setEditBlock(null); setToast("Đã tách ✓");
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const idx = messages.filter(m => m.role === "user").length;
    setMessages(prev => [...prev, { role: "user", text: inputVal }]);
    setInputVal(""); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      if (systemReplies[idx]) setMessages(prev => [...prev, { role: "system", text: systemReplies[idx] }]);
      else { setMessages(prev => [...prev, { role: "system", text: "Mình đã hiểu rồi! Đây là ngày của bạn 👇" }]); setTimeout(() => setShowParsed(true), 600); }
    }, 1500);
  };

  const handleDemo = () => { const idx = messages.filter(m => m.role === "user").length; if (idx < userReplies.length) setInputVal(userReplies[idx]); };

  const catSummary = {};
  blocks.forEach(b => { catSummary[b.cat] = (catSummary[b.cat] || 0) + (b.end - b.start); });
  const totalLogged = Object.values(catSummary).reduce((a, b) => a + b, 0);
  const sortedCats = Object.entries(catSummary).sort((a, b) => b[1] - a[1]);

  // ==================== EDIT MODAL ====================
  const EditModal = ({ block, onClose }) => {
    const [cat, setCat] = useState(block.cat);
    const [note, setNote] = useState(block.note);
    const [startStr, setStartStr] = useState(fmtTime(block.start));
    const [endStr, setEndStr] = useState(fmtTime(block.end));
    const dur = block.end - block.start;
    const mid = block.start + dur / 2;

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 420, background: "#1A1A22", borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", position: "relative", zIndex: 1, animation: "slideUp 0.3s ease" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600, color: "#fff" }}>Chỉnh sửa</span>
            <div style={{ display: "flex", gap: 8 }}>
              {dur >= 1 && <button onClick={() => splitBlock(block, mid)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit', sans-serif", fontSize: 12, cursor: "pointer" }}>✂️ Tách</button>}
              <button onClick={() => setDeleteConfirm(block.id)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontFamily: "'Outfit', sans-serif", fontSize: 12, cursor: "pointer" }}>🗑 Xóa</button>
            </div>
          </div>

          {deleteConfirm === block.id && (
            <div style={{ padding: 12, borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Xóa hoạt động này?</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setDeleteConfirm(null)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif", fontSize: 12, cursor: "pointer" }}>Hủy</button>
                <button onClick={() => deleteBlockFn(block.id)} style={{ padding: "6px 12px", borderRadius: 8, background: "#EF4444", border: "none", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Xóa</button>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 6 }}>GHI CHÚ</label>
            <input value={note} onChange={e => setNote(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 14, outline: "none" }} />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 6 }}>BẮT ĐẦU</label>
              <input type="time" value={startStr} onChange={e => setStartStr(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, outline: "none", colorScheme: "dark" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 6 }}>KẾT THÚC</label>
              <input type="time" value={endStr} onChange={e => setEndStr(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, outline: "none", colorScheme: "dark" }} />
            </div>
          </div>

          <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 8 }}>PHÂN LOẠI</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
            {CAT_KEYS.map(k => {
              const c = CATEGORIES[k], sel = k === cat;
              return (<button key={k} onClick={() => setCat(k)} style={{ padding: "6px 10px", borderRadius: 8, cursor: "pointer", background: sel ? `${c.color}20` : "rgba(255,255,255,0.04)", border: `1.5px solid ${sel ? c.color : "rgba(255,255,255,0.06)"}`, color: sel ? c.color : "rgba(255,255,255,0.35)", fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: sel ? 600 : 400, display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s ease" }}><span style={{ fontSize: 13 }}>{c.icon}</span> {c.label}</button>);
            })}
          </div>

          <button onClick={() => updateBlock(block.id, { cat, note, start: timeToHours(startStr), end: timeToHours(endStr) })} style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #F97316, #FB923C)", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Lưu thay đổi</button>
        </div>
      </div>
    );
  };

  // ==================== ADD MODAL ====================
  const AddModal = ({ gap, onClose }) => {
    const [cat, setCat] = useState("deep_work");
    const [note, setNote] = useState("");
    const [startStr, setStartStr] = useState(fmtTime(gap.start));
    const [endStr, setEndStr] = useState(fmtTime(gap.end));

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 420, background: "#1A1A22", borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", position: "relative", zIndex: 1, animation: "slideUp 0.3s ease" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }} />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600, color: "#fff", display: "block", marginBottom: 16 }}>Thêm hoạt động</span>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 6 }}>GHI CHÚ</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Bạn đã làm gì?" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 14, outline: "none" }} />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 6 }}>BẮT ĐẦU</label>
              <input type="time" value={startStr} onChange={e => setStartStr(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, outline: "none", colorScheme: "dark" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 6 }}>KẾT THÚC</label>
              <input type="time" value={endStr} onChange={e => setEndStr(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, outline: "none", colorScheme: "dark" }} />
            </div>
          </div>

          <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", display: "block", marginBottom: 8 }}>PHÂN LOẠI</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
            {CAT_KEYS.map(k => {
              const c = CATEGORIES[k], sel = k === cat;
              return (<button key={k} onClick={() => setCat(k)} style={{ padding: "6px 10px", borderRadius: 8, cursor: "pointer", background: sel ? `${c.color}20` : "rgba(255,255,255,0.04)", border: `1.5px solid ${sel ? c.color : "rgba(255,255,255,0.06)"}`, color: sel ? c.color : "rgba(255,255,255,0.35)", fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: sel ? 600 : 400, display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s ease" }}><span style={{ fontSize: 13 }}>{c.icon}</span> {c.label}</button>);
            })}
          </div>

          <button onClick={() => { if (note.trim()) addBlockFn({ start: timeToHours(startStr), end: timeToHours(endStr), cat, note }); }} disabled={!note.trim()} style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", background: note.trim() ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.06)", color: note.trim() ? "#fff" : "rgba(255,255,255,0.2)", fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, cursor: note.trim() ? "pointer" : "default" }}>+ Thêm hoạt động</button>
        </div>
      </div>
    );
  };

  // ==================== SCORE RING ====================
  const ScoreRing = ({ score, size, strokeWidth, color, label, icon }) => {
    const r = (size - strokeWidth) / 2, circ = 2 * Math.PI * r;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ width: size, height: size, position: "relative" }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} fill="none" />
            <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={strokeWidth} fill="none" strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)", filter: `drop-shadow(0 0 8px ${color}66)` }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: size * 0.28, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>{score}</span>
          </div>
        </div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif" }}>{icon} {label}</span>
      </div>
    );
  };

  // ==================== CHAT SCREEN ====================
  const ChatScreen = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #F97316, #FB923C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⏳</div>
          <div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>Finite</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>Daily Reflection</p>
          </div>
        </div>
        <div style={{ padding: "4px 10px", borderRadius: 99, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#22C55E" }}>Online</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.04)", padding: "4px 12px", borderRadius: 99 }}>
            Hôm nay • {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10, animation: "fadeSlideIn 0.3s ease" }}>
            <div style={{
              maxWidth: "82%", padding: "10px 14px", borderRadius: 16,
              borderBottomRightRadius: msg.role === "user" ? 4 : 16, borderBottomLeftRadius: msg.role === "system" ? 4 : 16,
              background: msg.role === "user" ? "linear-gradient(135deg, #F97316, #FB923C)" : "rgba(255,255,255,0.06)",
              border: msg.role === "system" ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0, color: msg.role === "user" ? "#fff" : "rgba(255,255,255,0.8)" }}>{msg.text}</p>
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: "flex", marginBottom: 10 }}>
            <div style={{ padding: "12px 18px", borderRadius: 16, borderBottomLeftRadius: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => (<div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.3)", animation: `typingDot 1.4s ease ${i * 0.2}s infinite` }} />))}
            </div>
          </div>
        )}

        {showParsed && (
          <div style={{ margin: "8px 0 12px", padding: 14, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", animation: "fadeSlideIn 0.5s ease" }}>
            <div style={{ display: "flex", height: 24, borderRadius: 6, overflow: "hidden", gap: 2, marginBottom: 12 }}>
              {sortedCats.map(([key, hours]) => (
                <div key={key} style={{ flex: hours, background: CATEGORIES[key].color, opacity: 0.7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {hours >= 1.5 && <span style={{ fontSize: 11 }}>{CATEGORIES[key].icon}</span>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {sortedCats.map(([key, hours]) => {
                const cat = CATEGORIES[key];
                return (<div key={key} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, background: `${cat.color}12`, border: `1px solid ${cat.color}25` }}><span style={{ fontSize: 12 }}>{cat.icon}</span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: cat.color }}>{hours >= 1 ? `${hours}h` : `${Math.round(hours * 60)}m`}</span></div>);
              })}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={() => setScreen("timeline")} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.1)", color: "#F97316", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Xem & sửa →</button>
              <button onClick={() => setScreen("score")} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #F97316, #FB923C)", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Xem điểm ✨</button>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {!showParsed && messages.filter(m => m.role === "user").length < 3 && (
          <button onClick={handleDemo} style={{ marginBottom: 8, padding: "6px 12px", borderRadius: 99, border: "1px dashed rgba(249,115,22,0.3)", background: "transparent", color: "rgba(249,115,22,0.5)", fontFamily: "'Outfit', sans-serif", fontSize: 12, cursor: "pointer" }}>💡 Tap to auto-fill demo reply</button>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "10px 16px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Kể về ngày hôm nay..." style={{ width: "100%", background: "none", border: "none", outline: "none", fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#fff" }} />
          </div>
          <button onClick={handleSend} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: inputVal.trim() ? "linear-gradient(135deg, #F97316, #FB923C)" : "rgba(255,255,255,0.06)", color: inputVal.trim() ? "#fff" : "rgba(255,255,255,0.2)", fontSize: 18, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>↑</button>
        </div>
      </div>
    </div>
  );

  // ==================== TIMELINE SCREEN ====================
  const TimelineScreen = () => {
    const sorted = [...blocks].sort((a, b) => a.start - b.start);
    const gaps = getGaps();
    const timeline = [];
    let cursor = 6;
    sorted.forEach(b => {
      const gap = gaps.find(g => g.start >= cursor && g.end <= b.start && (b.start - g.start) > 0.2);
      if (gap) timeline.push({ type: "gap", ...gap });
      timeline.push({ type: "block", ...b });
      cursor = b.end;
    });
    const trailing = gaps.find(g => g.start >= cursor);
    if (trailing) timeline.push({ type: "gap", ...trailing });

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setScreen("chat")} style={{ background: "none", border: "none", color: "#F97316", fontFamily: "'Outfit', sans-serif", fontSize: 14, cursor: "pointer", padding: 0 }}>← Chat</button>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff" }}>Timeline</span>
          <button onClick={() => setScreen("score")} style={{ background: "none", border: "none", color: "#F97316", fontFamily: "'Outfit', sans-serif", fontSize: 14, cursor: "pointer", padding: 0 }}>Score →</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px" }}>
          {/* Stacked bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px" }}>17 GIỜ THỨC</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>{totalLogged.toFixed(1)}h logged</span>
            </div>
            <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", gap: 2 }}>
              {sortedCats.map(([key, hours]) => (
                <div key={key} style={{ flex: hours, background: CATEGORIES[key].color, opacity: 0.8, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                  <span style={{ fontSize: 12 }}>{CATEGORIES[key].icon}</span>
                  {hours >= 1.5 && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#fff", fontWeight: 600 }}>{hours}h</span>}
                </div>
              ))}
              {17 - totalLogged > 0.25 && (
                <div style={{ flex: 17 - totalLogged, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{(17 - totalLogged).toFixed(1)}h</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit hint */}
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.1)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>👆</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Nhấn hoạt động để sửa • Nhấn khoảng trống để thêm</span>
          </div>

          {/* Timeline */}
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", margin: "0 0 4px" }}>CHI TIẾT</p>

          {timeline.map((item, i) => {
            if (item.type === "gap") {
              const dur = item.end - item.start;
              return (
                <button key={`g-${i}`} onClick={() => setAddGap({ start: item.start, end: item.end })} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "6px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.15)", width: 52, flexShrink: 0 }}>{fmtTime(item.start)}</span>
                  <div style={{ flex: 1, height: 28, borderRadius: 6, border: "1.5px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"; e.currentTarget.style.background = "rgba(34,197,94,0.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: 14, color: "rgba(34,197,94,0.5)" }}>+</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>{dur >= 1 ? `${dur}h trống` : `${Math.round(dur * 60)}m trống`}</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.1)", width: 32, textAlign: "right" }}>{dur >= 1 ? `${dur}h` : `${Math.round(dur * 60)}m`}</span>
                </button>
              );
            }
            const cat = CATEGORIES[item.cat];
            const dur = item.end - item.start;
            return (
              <button key={item.id} onClick={() => setEditBlock(item)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", animation: `fadeSlideIn 0.4s ease ${i * 0.04}s both` }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.25)", width: 52, flexShrink: 0 }}>{fmtTime(item.start)}</span>
                <div style={{ flex: 1, height: 32, borderRadius: 6, background: `${cat.color}15`, border: `1px solid ${cat.color}30`, display: "flex", alignItems: "center", gap: 6, padding: "0 10px", transition: "all 0.15s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${cat.color}25`; e.currentTarget.style.borderColor = `${cat.color}50`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${cat.color}15`; e.currentTarget.style.borderColor = `${cat.color}30`; }}
                >
                  <span style={{ fontSize: 14 }}>{cat.icon}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: cat.color, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{item.note}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.15)" }}>✎</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.2)", width: 32, textAlign: "right" }}>{dur >= 1 ? `${dur}h` : `${Math.round(dur * 60)}m`}</span>
              </button>
            );
          })}

          {/* Summary */}
          <div style={{ marginTop: 20, padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", margin: "0 0 10px" }}>TỔNG KẾT</p>
            {sortedCats.map(([key, hours]) => {
              const cat = CATEGORIES[key];
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, width: 20 }}>{cat.icon}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", width: 90 }}>{cat.label}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{ width: `${(hours / 17) * 100}%`, height: "100%", borderRadius: 99, background: cat.color, opacity: 0.7 }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: cat.color, width: 36, textAlign: "right" }}>{hours >= 1 ? `${hours}h` : `${Math.round(hours * 60)}m`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ==================== SCORE SCREEN ====================
  const ScoreScreen = () => {
    const overall = Math.round((animatedScores.focus + animatedScores.balance + animatedScores.intention) / 3);
    const oc = overall >= 80 ? "#22C55E" : overall >= 60 ? "#F97316" : "#EF4444";
    const ol = overall >= 80 ? "Ngày tuyệt vời!" : overall >= 60 ? "Khá ổn, có thể tốt hơn" : "Cần cải thiện";
    const c62 = 2 * Math.PI * 62;
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setScreen("timeline")} style={{ background: "none", border: "none", color: "#F97316", fontFamily: "'Outfit', sans-serif", fontSize: 14, cursor: "pointer", padding: 0 }}>← Timeline</button>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff" }}>Daily Score</span>
          <button onClick={() => setScreen("chat")} style={{ background: "none", border: "none", color: "#F97316", fontFamily: "'Outfit', sans-serif", fontSize: 14, cursor: "pointer", padding: 0 }}>Done ✓</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 140, height: 140, margin: "0 auto", position: "relative" }}>
              <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="70" cy="70" r="62" stroke="rgba(255,255,255,0.06)" strokeWidth="7" fill="none" />
                <circle cx="70" cy="70" r="62" stroke={oc} strokeWidth="7" fill="none" strokeDasharray={c62} strokeDashoffset={c62 - (overall / 100) * c62} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)", filter: `drop-shadow(0 0 12px ${oc}66)` }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 42, fontWeight: 800, color: oc }}>{overall}</span>
              </div>
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>{ol}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 32 }}>
            <ScoreRing score={animatedScores.focus} size={80} strokeWidth={5} color="#F97316" label="Focus" icon="🎯" />
            <ScoreRing score={animatedScores.balance} size={80} strokeWidth={5} color="#8B5CF6" label="Balance" icon="⚖️" />
            <ScoreRing score={animatedScores.intention} size={80} strokeWidth={5} color="#3B82F6" label="Intention" icon="🧭" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", margin: 0 }}>NHẬN XÉT</p>
            {[
              { icon: "💪", text: "5.5h deep work — trên trung bình tuần của bạn (4.2h)", color: "#22C55E" },
              { icon: "📱", text: "2h lướt mạng — buổi chiều là điểm yếu, thử đặt timer?", color: "#EF4444" },
              { icon: "⚖️", text: "Có thể dục, gia đình, học tập — ngày cân bằng tốt!", color: "#8B5CF6" },
              { icon: "🧭", text: "Chỉ hoàn thành 64% kế hoạch sáng — thử plan ít hơn?", color: "#3B82F6" },
            ].map((ins, i) => (
              <div key={i} style={{ padding: "12px 14px", borderRadius: 12, background: `${ins.color}08`, border: `1px solid ${ins.color}18`, display: "flex", gap: 10, alignItems: "flex-start", animation: `fadeSlideIn 0.4s ease ${0.3 + i * 0.1}s both` }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{ins.icon}</span>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.65)", margin: 0 }}>{ins.text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", margin: "0 0 10px" }}>TUẦN NÀY</p>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
              {[68, 75, 82, 59, 71, 73, overall].map((sc, i) => {
                const t = i === 6, bc = sc >= 80 ? "#22C55E" : sc >= 60 ? "#F97316" : "#EF4444";
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: t ? bc : "rgba(255,255,255,0.2)" }}>{sc}</span>
                    <div style={{ width: "100%", height: `${sc * 0.5}px`, borderRadius: 4, background: t ? bc : `${bc}40`, boxShadow: t ? `0 0 8px ${bc}44` : "none" }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: t ? "#fff" : "rgba(255,255,255,0.2)" }}>{["T2","T3","T4","T5","T6","T7","CN"][i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== MAIN ====================
  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "0 auto", height: "100vh", background: "#0A0A0F", fontFamily: "'Outfit', sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{FONTS}</style>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes typingDot { 0%, 60%, 100% { opacity: 0.2; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-4px); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      <div style={{ padding: "8px 20px", display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
        <span>{String(new Date().getHours()).padStart(2,"0")}:{String(new Date().getMinutes()).padStart(2,"0")}</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "2px" }}>FINITE</span>
        <span>⚡ 82%</span>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {screen === "chat" && <ChatScreen />}
        {screen === "timeline" && <TimelineScreen />}
        {screen === "score" && <ScoreScreen />}
      </div>

      <div style={{ padding: "8px 20px 12px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          {[{ label: "Chat", icon: "💬", s: "chat" }, { label: "Timeline", icon: "📊", s: "timeline" }, { label: "Score", icon: "✨", s: "score" }].map(tab => (
            <button key={tab.s} onClick={() => setScreen(tab.s)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 18, opacity: screen === tab.s ? 1 : 0.3 }}>{tab.icon}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: screen === tab.s ? "#F97316" : "rgba(255,255,255,0.2)" }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {editBlock && <EditModal block={editBlock} onClose={() => { setEditBlock(null); setDeleteConfirm(null); }} />}
      {addGap && <AddModal gap={addGap} onClose={() => setAddGap(null)} />}

      {toast && (
        <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", padding: "10px 20px", borderRadius: 99, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#22C55E", animation: "toastIn 0.3s ease", zIndex: 200 }}>{toast}</div>
      )}
    </div>
  );
}
