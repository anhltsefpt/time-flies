import { useState, useEffect, useMemo, useCallback } from "react";

const DEFAULT_SETTINGS = {
  birthYear: 1995,
  lifeExpectancy: 75,
  sleepStart: 23, // 11 PM
  sleepEnd: 6,    // 6 AM
  name: "",
  theme: "dark",
  notifications: true,
  notifyMilestones: true,
  notifyDaily: false,
  dailyNotifyTime: 8,
  showLifeTab: true,
  showSeconds: true,
  language: "vi",
};

function getTimeData(settings) {
  const now = new Date();
  const { birthYear, lifeExpectancy, sleepStart, sleepEnd } = settings;

  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
  const dayProgress = ((now - dayStart) / (dayEnd - dayStart)) * 100;
  const dayHoursLeft = (dayEnd - now) / 3600000;

  // Awake time calculation
  const sleepHours = sleepStart > sleepEnd ? (24 - sleepStart + sleepEnd) : (sleepEnd - sleepStart);
  const awakeHours = 24 - sleepHours;
  const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  let awakeElapsed = 0;
  if (sleepStart > sleepEnd) {
    // e.g. sleep 23-6
    if (currentHour >= sleepEnd && currentHour < sleepStart) {
      awakeElapsed = currentHour - sleepEnd;
    } else {
      awakeElapsed = awakeHours; // sleeping
    }
  } else {
    if (currentHour >= sleepStart || currentHour < sleepEnd) {
      awakeElapsed = awakeHours;
    } else {
      awakeElapsed = Math.max(0, currentHour - sleepEnd);
    }
  }
  const awakeProgress = Math.min((awakeElapsed / awakeHours) * 100, 100);
  const awakeLeft = Math.max(awakeHours - awakeElapsed, 0);

  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 7);
  const weekProgress = ((now - weekStart) / (weekEnd - weekStart)) * 100;
  const weekDaysLeft = (weekEnd - now) / 86400000;

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthProgress = ((now - monthStart) / (monthEnd - monthStart)) * 100;
  const monthDaysLeft = (monthEnd - now) / 86400000;

  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
  const yearProgress = ((now - yearStart) / (yearEnd - yearStart)) * 100;
  const yearDaysLeft = (yearEnd - now) / 86400000;

  const birthDate = new Date(birthYear, 0, 1);
  const lifeEnd = new Date(birthYear + lifeExpectancy, 0, 1);
  const lifeProgress = Math.min(((now - birthDate) / (lifeEnd - birthDate)) * 100, 100);
  const lifeYearsLeft = Math.max((lifeEnd - now) / (365.25 * 86400000), 0);

  return {
    day: { progress: dayProgress, left: dayHoursLeft, unit: "giờ" },
    awake: { progress: awakeProgress, left: awakeLeft, unit: "giờ", elapsed: awakeElapsed, total: awakeHours, leftSeconds: Math.round(awakeLeft * 3600) },
    week: { progress: weekProgress, left: weekDaysLeft, unit: "ngày" },
    month: { progress: monthProgress, left: monthDaysLeft, unit: "ngày" },
    year: { progress: yearProgress, left: yearDaysLeft, unit: "ngày" },
    life: { progress: lifeProgress, left: lifeYearsLeft, unit: "năm" },
    seconds: {
      today: now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(),
      todayLeft: 86400 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()),
    },
  };
}

const quotes = [
  { text: "Thời gian là thứ quý giá nhất mà con người có thể tiêu xài.", author: "Theophrastus" },
  { text: "Ngày hôm qua đã là lịch sử. Ngày mai là bí ẩn. Hôm nay là món quà.", author: "Eleanor Roosevelt" },
  { text: "Đừng đếm ngày, hãy làm cho mỗi ngày đều đáng đếm.", author: "Muhammad Ali" },
  { text: "Thời gian trôi qua dù bạn có tận dụng hay không.", author: "Henry David Thoreau" },
  { text: "Cuộc sống không được đo bằng số hơi thở, mà bằng những khoảnh khắc khiến ta ngừng thở.", author: "Maya Angelou" },
];

/* ---- Shared Components ---- */
function CircularRing({ progress, size, strokeWidth, color, glowColor, children }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 8px ${glowColor})` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

function ProgressBar({ label, progress, left, unit, color, glowColor, delay, icon }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)", letterSpacing: "0.5px" }}>{label}</span>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          còn {left < 1 && unit === "giờ" ? Math.round(left * 60) + " phút" : left.toFixed(1) + " " + unit}
        </span>
      </div>
      <div style={{ width: "100%", height: 8, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ width: `${progress}%`, height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${color}, ${glowColor})`, boxShadow: `0 0 16px ${glowColor}44`, transition: "width 1.5s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      <div style={{ textAlign: "right", marginTop: 6 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, color, letterSpacing: "-0.5px" }}>{progress.toFixed(2)}</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>%</span>
      </div>
    </div>
  );
}

/* ============================================================
   DAY HEATMAP
   ============================================================ */
function DayHeatmap({ currentHour, currentMinute, currentSecond, settings }) {
  const { sleepStart, sleepEnd } = settings;
  const isSleepHour = (h) => {
    if (sleepStart > sleepEnd) return h >= sleepStart || h < sleepEnd;
    return h >= sleepStart && h < sleepEnd;
  };

  const periods = [
    { label: "Ngủ", range: [0, 6], color: "#6366F1", icon: "🌙" },
    { label: "Sáng", range: [6, 12], color: "#F97316", icon: "🌅" },
    { label: "Chiều", range: [12, 18], color: "#22C55E", icon: "☀️" },
    { label: "Tối", range: [18, 24], color: "#8B5CF6", icon: "🌆" },
  ];
  const getCurrentPeriod = () => periods.find(p => currentHour >= p.range[0] && currentHour < p.range[1]);
  const currentPeriod = getCurrentPeriod();
  const minuteFillPct = ((currentMinute * 60 + (currentSecond || 0)) / 3600) * 100;

  const getHourColor = (h) => {
    if (h === currentHour) return "#F97316";
    if (isSleepHour(h) && h < currentHour) return "#4338CA";
    if (isSleepHour(h)) return "rgba(99,102,241,0.12)";
    if (h < currentHour) {
      const period = periods.find(p => h >= p.range[0] && h < p.range[1]);
      return period?.color || "#22c55e";
    }
    return "rgba(255,255,255,0.04)";
  };

  const getHourOpacity = (h) => {
    if (h === currentHour) return 1;
    if (isSleepHour(h)) return h < currentHour ? 0.45 : 0.3;
    if (h < currentHour) return 0.4 + ((currentHour - (currentHour - h)) / 24) * 0.5;
    return 0.6;
  };

  const rows = [
    { hours: [0,1,2,3,4,5], label: "🌙 00–05" },
    { hours: [6,7,8,9,10,11], label: "🌅 06–11" },
    { hours: [12,13,14,15,16,17], label: "☀️ 12–17" },
    { hours: [18,19,20,21,22,23], label: "🌆 18–23" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.6s ease 0.15s both" }}>
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "1.5px", textTransform: "uppercase" }}>24 GIỜ HÔM NAY</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 12 }}>{currentPeriod?.icon}</span>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: currentPeriod?.color }}>{currentPeriod?.label}</span>
          </div>
        </div>
        {rows.map((row, ri) => (
          <div key={ri} style={{ marginBottom: ri < 3 ? 6 : 0 }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.2)", width: 52, flexShrink: 0 }}>{row.label}</span>
              <div style={{ display: "flex", gap: 3, flex: 1 }}>
                {row.hours.map(h => {
                  const isCurrent = h === currentHour;
                  const isPast = h < currentHour;
                  const isSleep = isSleepHour(h);
                  return (
                    <div key={h} style={{
                      flex: 1, height: 28, borderRadius: 4,
                      background: isCurrent ? "rgba(249,115,22,0.15)" : getHourColor(h),
                      opacity: getHourOpacity(h),
                      boxShadow: isCurrent ? "none" : "none",
                      animation: isCurrent ? "hourPulse 2s ease-in-out infinite" : "none",
                      position: "relative", overflow: "hidden",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: isCurrent ? "1px solid rgba(249,115,22,0.4)" : "none",
                      transition: "all 0.5s ease",
                    }}>
                      {isCurrent && (
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${minuteFillPct}%`, background: "linear-gradient(90deg, #F97316, #FB923C)", borderRadius: 4, transition: "width 1s linear" }} />
                      )}
                      {/* Sleep indicator */}
                      {isSleep && !isCurrent && (
                        <span style={{ fontSize: 11, opacity: 0.5, position: "relative", zIndex: 1 }}>💤</span>
                      )}
                      {!isSleep && (
                        <span style={{
                          fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? "#fff" : isPast ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
                          position: "relative", zIndex: 1,
                        }}>{String(h).padStart(2, "0")}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   WEEK HEATMAP
   ============================================================ */
function WeekHeatmap({ data }) {
  const now = new Date();
  const currentDayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const dayNames = ["T2","T3","T4","T5","T6","T7","CN"];
  const fullDayNames = ["Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy","Chủ Nhật"];

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.06)", animation: "fadeUp 0.6s ease 0.3s both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "1.5px", textTransform: "uppercase" }}>TUẦN NÀY</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#3B82F6" }}>{data.week.progress.toFixed(1)}%</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {dayNames.map((day, i) => {
          const isPast = i < currentDayOfWeek;
          const isCurrent = i === currentDayOfWeek;
          const dayProgress = isCurrent ? (now.getHours() * 60 + now.getMinutes()) / 1440 * 100 : 0;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: "100%", height: 36, borderRadius: 6,
                background: isPast ? "#3B82F6" : isCurrent ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                opacity: isPast ? (0.4 + (i / Math.max(currentDayOfWeek, 1)) * 0.5) : !isCurrent ? 0.6 : 1,
                boxShadow: isCurrent ? "0 0 10px #3B82F6, 0 0 20px #3B82F633" : "none",
                border: isCurrent ? "1px solid rgba(59,130,246,0.4)" : "none",
                position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {isCurrent && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${dayProgress}%`, background: "linear-gradient(90deg, #3B82F6, #60A5FA)", borderRadius: 6, transition: "width 2s ease" }} />}
                {isPast && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.7)", position: "relative", zIndex: 1 }}>✓</span>}
                {isCurrent && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#fff", fontWeight: 700, position: "relative", zIndex: 1 }}>{dayProgress.toFixed(0)}%</span>}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: isCurrent ? 700 : 400, color: isCurrent ? "#3B82F6" : isPast ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)" }}>{day}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 10, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#3B82F6" }}>📍 {fullDayNames[currentDayOfWeek]}</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{currentDayOfWeek} / 7 ngày đã qua</span>
      </div>
    </div>
  );
}

/* ============================================================
   YEAR HEATMAP
   ============================================================ */
function YearHeatmap() {
  const now = new Date();
  const year = now.getFullYear();
  const yearStart = new Date(year, 0, 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const { weeks, monthLabels, daysPassed, totalDays } = useMemo(() => {
    const yearEnd = new Date(year, 11, 31);
    const total = Math.round((yearEnd - yearStart) / 86400000) + 1;
    const startDay = yearStart.getDay() === 0 ? 6 : yearStart.getDay() - 1;
    const passed = Math.round((today - yearStart) / 86400000) + 1;
    const allWeeks = []; let currentWeek = new Array(startDay).fill(null); const mLabels = []; let lastMonth = -1;
    for (let d = 0; d < total; d++) {
      const date = new Date(year, 0, 1 + d); const m = date.getMonth();
      if (m !== lastMonth) { mLabels.push({ month: m, weekIdx: allWeeks.length }); lastMonth = m; }
      currentWeek.push({ date, dayOfYear: d + 1, isPast: date <= today, isToday: date.getTime() === today.getTime(), month: m });
      if (currentWeek.length === 7) { allWeeks.push(currentWeek); currentWeek = []; }
    }
    if (currentWeek.length > 0) { while (currentWeek.length < 7) currentWeek.push(null); allWeeks.push(currentWeek); }
    return { weeks: allWeeks, monthLabels: mLabels, daysPassed: passed, totalDays: total };
  }, [year]);
  const monthNames = ["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"];
  const dayLabels = ["T2","T3","T4","T5","T6","T7","CN"];
  const getColor = (cell) => { if (!cell) return "transparent"; if (cell.isToday) return "#F97316"; if (!cell.isPast) return "rgba(255,255,255,0.04)"; const ratio = cell.dayOfYear / daysPassed; if (ratio > 0.85) return "#22c55e"; if (ratio > 0.6) return "#16a34a"; if (ratio > 0.35) return "#15803d"; return "#166534"; };
  const cs = 5.2, gp = 1.8;

  return (
    <div style={{ padding: "0 16px", paddingBottom: 100 }}>
      <div style={{ textAlign: "center", paddingTop: 16, marginBottom: 20, animation: "fadeDown 0.6s ease" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase", margin: 0, marginBottom: 8 }}>NĂM {year}</p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 40, fontWeight: 700, color: "#22c55e" }}>{daysPassed}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, color: "rgba(255,255,255,0.3)" }}>/ {totalDays} ngày</span>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", animation: "fadeUp 0.7s ease 0.2s both" }}>
        <div style={{ display: "flex", marginBottom: 4, marginLeft: 22 }}>
          {monthLabels.map((ml, i) => (<span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", position: "absolute", marginLeft: ml.weekIdx * (cs + gp) }}>{monthNames[ml.month]}</span>))}
        </div>
        <div style={{ display: "flex", gap: 0, marginTop: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: gp, marginRight: 4, flexShrink: 0 }}>
            {dayLabels.map((dl, i) => (<div key={i} style={{ height: cs, display: "flex", alignItems: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.2)", width: 16, justifyContent: "flex-end", paddingRight: 2 }}>{i % 2 === 0 ? dl : ""}</div>))}
          </div>
          <div style={{ display: "flex", gap: gp, overflow: "hidden" }}>
            {weeks.map((week, wi) => (<div key={wi} style={{ display: "flex", flexDirection: "column", gap: gp }}>{week.map((cell, di) => (<div key={di} style={{ width: cs, height: cs, borderRadius: 1.2, background: getColor(cell), boxShadow: cell?.isToday ? "0 0 6px #F97316, 0 0 12px #F9731644" : "none" }} />))}</div>))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, animation: "fadeUp 0.7s ease 0.4s both" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>TỪNG THÁNG</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {Array.from({ length: 12 }, (_, m) => {
            const mStart = new Date(year, m, 1); const mEnd = new Date(year, m + 1, 1);
            const totalD = Math.round((mEnd - mStart) / 86400000);
            const passedD = mStart > today ? 0 : Math.min(Math.round((today - mStart) / 86400000) + 1, totalD);
            const pct = (passedD / totalD) * 100; const isCurrent = now.getMonth() === m; const isPast = m < now.getMonth();
            return (<div key={m} style={{ background: isCurrent ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.02)", borderRadius: 12, padding: "10px 8px", border: isCurrent ? "1px solid rgba(249,115,22,0.2)" : "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: isCurrent ? "#F97316" : isPast ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)", margin: 0 }}>{monthNames[m]}</p>
              <div style={{ width: "100%", height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)", marginTop: 6, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: isCurrent ? "#F97316" : isPast ? "#22c55e" : "transparent" }} /></div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: isCurrent ? "#F97316" : "rgba(255,255,255,0.25)", margin: 0, marginTop: 4 }}>{pct.toFixed(0)}%</p>
            </div>);
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LIFE GRID
   ============================================================ */
function LifeGrid({ settings }) {
  const { birthYear, lifeExpectancy } = settings;
  const now = new Date();
  const currentAge = now.getFullYear() - birthYear + (now.getMonth() >= 6 ? 0.5 : 0);
  const livedYears = Math.floor(currentAge);
  const currentYearProgress = currentAge - livedYears;
  const phases = [
    { label: "Tuổi thơ", range: [0, 12], color: "#60A5FA" },
    { label: "Thiếu niên", range: [12, 18], color: "#A78BFA" },
    { label: "Trưởng thành", range: [18, 30], color: "#34D399" },
    { label: "Sung sức", range: [30, 50], color: "#FBBF24" },
    { label: "Chín chắn", range: [50, 65], color: "#F97316" },
    { label: "An hưởng", range: [65, lifeExpectancy], color: "#F472B6" },
  ];
  const getPhase = (yr) => phases.find(p => yr >= p.range[0] && yr < p.range[1]);
  const currentPhase = getPhase(livedYears);

  return (
    <div style={{ padding: "0 20px", paddingBottom: 100 }}>
      <div style={{ textAlign: "center", paddingTop: 16, marginBottom: 24, animation: "fadeDown 0.6s ease" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase", margin: 0, marginBottom: 6 }}>CUỘC ĐỜI BẠN</p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 44, fontWeight: 700, color: "#fff" }}>{livedYears}</span>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.3)" }}>/ {lifeExpectancy} năm</span>
        </div>
        {currentPhase && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, padding: "4px 14px", borderRadius: 99, background: `${currentPhase.color}15`, border: `1px solid ${currentPhase.color}30` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: currentPhase.color }} />
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: currentPhase.color }}>{currentPhase.label}</span>
          </div>
        )}
      </div>
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.06)", animation: "fadeUp 0.7s ease 0.2s both" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
          {Array.from({ length: lifeExpectancy }, (_, yr) => {
            const phase = getPhase(yr); const isLived = yr < livedYears; const isCurrent = yr === livedYears; const color = phase?.color || "#666";
            return (<div key={yr} style={{ width: 14, height: 14, borderRadius: 3, background: isLived ? color : isCurrent ? `${color}88` : "rgba(255,255,255,0.04)", opacity: isLived ? 0.85 : isCurrent ? 1 : 0.6, boxShadow: isCurrent ? `0 0 8px ${color}, 0 0 16px ${color}44` : "none", position: "relative" }}>
              {isCurrent && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${currentYearProgress * 100}%`, background: color, borderRadius: "0 0 3px 3px", opacity: 0.9 }} />}
            </div>);
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          {Array.from({ length: Math.ceil(lifeExpectancy / 10) + 1 }, (_, i) => i * 10).filter(d => d <= lifeExpectancy).map(d => (
            <span key={d} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{d}</span>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, justifyContent: "center" }}>
          {phases.map((p, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, opacity: 0.85 }} /><span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{p.label}</span></div>))}
        </div>
      </div>
      <div style={{ marginTop: 20, animation: "fadeUp 0.7s ease 0.4s both" }}>
        {phases.map((p, i) => {
          const duration = p.range[1] - p.range[0]; const lived = Math.max(0, Math.min(livedYears - p.range[0], duration)); const pct = (lived / duration) * 100; const isActive = livedYears >= p.range[0] && livedYears < p.range[1];
          return (<div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, opacity: isActive ? 1 : 0.5, boxShadow: isActive ? `0 0 6px ${p.color}` : "none" }} />
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? p.color : "rgba(255,255,255,0.4)" }}>{p.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>{p.range[0]}–{p.range[1]}</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: isActive ? p.color : "rgba(255,255,255,0.25)" }}>{Math.min(pct, 100).toFixed(0)}%</span>
            </div>
            <div style={{ width: "100%", height: 4, borderRadius: 99, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
              <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 99, background: p.color, opacity: pct >= 100 ? 0.5 : 0.85 }} />
            </div>
          </div>);
        })}
      </div>
    </div>
  );
}

/* ============================================================
   HOME SCREEN
   ============================================================ */
function HomeScreen({ data, currentTime, settings }) {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();

  // Format countdown HH:MM:SS
  const fmtCountdown = (totalSec) => {
    const hh = Math.floor(totalSec / 3600);
    const mm = Math.floor((totalSec % 3600) / 60);
    const ss = totalSec % 60;
    return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
  };

  return (
    <div style={{ padding: "0 20px", paddingBottom: 100 }}>
      {/* Hero: Day Countdown */}
      <div style={{ textAlign: "center", paddingTop: 20, paddingBottom: 8, animation: "fadeDown 0.8s ease" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "2px", textTransform: "uppercase", margin: 0, marginBottom: 10 }}>
          {settings.name ? `${settings.name}, HÔM NAY BẠN CÒN` : "HÔM NAY BẠN CÒN"}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <CircularRing progress={data.day.progress} size={72} strokeWidth={5} color="#F97316" glowColor="#F9731644">
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: "#F97316" }}>
              {data.day.progress.toFixed(1)}%
            </span>
          </CircularRing>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 36, fontWeight: 700, color: "#F97316", margin: 0, letterSpacing: "-1px", animation: "countPop 1s ease infinite" }}>
              {fmtCountdown(data.seconds.todayLeft)}
            </p>
          </div>
        </div>
      </div>

      {/* Awake time */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(167,139,250,0.04))",
        borderRadius: 16, padding: "14px 16px", marginBottom: 16,
        border: "1px solid rgba(139,92,246,0.1)", animation: "fadeUp 0.5s ease 0.1s both",
      }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0, marginBottom: 10, letterSpacing: "1.5px" }}>THỜI GIAN THỨC CÒN LẠI</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <CircularRing progress={data.awake.progress} size={64} strokeWidth={5} color="#8B5CF6" glowColor="#A78BFA44">
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: "#8B5CF6" }}>
              {data.awake.progress.toFixed(0)}%
            </span>
          </CircularRing>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 36, fontWeight: 700, color: "#8B5CF6" }}>
                {Math.floor(data.awake.left)}h
              </span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>
                / {data.awake.total}h
              </span>
            </div>
          </div>
        </div>
        {/* Awake hour dots */}
        <div style={{ display: "flex", gap: 4, marginTop: 12, justifyContent: "center" }}>
          {Array.from({ length: data.awake.total }, (_, i) => {
            const elapsedHours = Math.floor(data.awake.elapsed);
            const isCurrent = i === elapsedHours && data.awake.progress < 100;
            const isPast = i < elapsedHours;
            return (
              <div key={i} style={{
                flex: 1, height: 8, borderRadius: 2,
                background: isCurrent ? "#8B5CF6" : isPast ? "#8B5CF6" : "rgba(255,255,255,0.06)",
                opacity: isCurrent ? 1 : isPast ? 0.45 : 1,
                boxShadow: isCurrent ? "0 0 8px #8B5CF6, 0 0 16px #8B5CF644" : "none",
                transition: "all 0.5s ease",
              }} />
            );
          })}
        </div>
      </div>

      <DayHeatmap currentHour={h} currentMinute={m} currentSecond={s} settings={settings} />
      <div style={{ height: 16 }} />
      <WeekHeatmap data={data} />
      <div style={{ marginTop: 20 }}>
        <ProgressBar label="THÁNG NÀY" progress={data.month.progress} left={data.month.left} unit={data.month.unit} color="#8B5CF6" glowColor="#A78BFA" delay={400} icon="🗓️" />
        <ProgressBar label="NĂM NAY" progress={data.year.progress} left={data.year.left} unit={data.year.unit} color="#EC4899" glowColor="#F472B6" delay={550} icon="⏳" />
      </div>
      <div style={{ marginTop: 4, padding: 16, background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.06))", borderRadius: 16, border: "1px solid rgba(245,158,11,0.12)", animation: "fadeUp 0.8s ease 0.7s both" }}>
        <ProgressBar label="CUỘC ĐỜI" progress={data.life.progress} left={data.life.left} unit={data.life.unit} color="#F59E0B" glowColor="#FBBF24" delay={700} icon="🔥" />
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", margin: 0, marginTop: -8, fontStyle: "italic" }}>
          Dựa trên tuổi thọ trung bình {settings.lifeExpectancy} năm
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   QUOTE SCREEN
   ============================================================ */
function QuoteScreen() {
  const [idx, setIdx] = useState(Math.floor(Math.random() * quotes.length));
  const q = quotes[idx];
  return (
    <div style={{ padding: "0 28px", paddingBottom: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "65vh" }}>
      <div style={{ fontSize: 48, marginBottom: 32, opacity: 0.15, fontFamily: "Georgia,serif", color: "#fff" }}>"</div>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 300, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, textAlign: "center", margin: 0, animation: "fadeUp 0.8s ease" }}>{q.text}</p>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 20, letterSpacing: "1px" }}>— {q.author}</p>
      <button onClick={() => setIdx((idx + 1) % quotes.length)} style={{ marginTop: 40, padding: "10px 24px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: "pointer" }}
        onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.8)"; }}
        onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.color = "rgba(255,255,255,0.5)"; }}
      >Câu tiếp theo →</button>
    </div>
  );
}

/* ============================================================
   SETTINGS SCREEN
   ============================================================ */
function SettingSlider({ label, value, min, max, step, onChange, format, icon, color }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{label}</span>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 600, color: color || "#fff" }}>
          {format ? format(value) : value}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step || 1} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", height: 6, appearance: "none", background: "rgba(255,255,255,0.08)", borderRadius: 99, outline: "none", cursor: "pointer", accentColor: color || "#F97316" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{format ? format(min) : min}</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

function SettingToggle({ label, value, onChange, icon, description }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{label}</span>
          {description && <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0, marginTop: 2 }}>{description}</p>}
        </div>
      </div>
      <div onClick={onChange} style={{
        width: 44, height: 24, borderRadius: 99, padding: 2,
        background: value ? "#22c55e" : "rgba(255,255,255,0.1)",
        cursor: "pointer", transition: "all 0.3s ease",
        display: "flex", alignItems: "center",
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          transform: value ? "translateX(20px)" : "translateX(0)",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </div>
    </div>
  );
}

function SettingsScreen({ settings, setSettings }) {
  const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));
  const sleepHours = settings.sleepStart > settings.sleepEnd ? 24 - settings.sleepStart + settings.sleepEnd : settings.sleepEnd - settings.sleepStart;
  const awakeHours = 24 - sleepHours;
  const age = new Date().getFullYear() - settings.birthYear;

  return (
    <div style={{ padding: "0 20px", paddingBottom: 120 }}>
      <div style={{ textAlign: "center", paddingTop: 16, marginBottom: 24, animation: "fadeDown 0.6s ease" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>CÀI ĐẶT</p>
      </div>

      {/* Profile Section */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16, animation: "fadeUp 0.5s ease" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0, marginBottom: 14 }}>👤 HỒ SƠ</p>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6, display: "block" }}>Tên của bạn</label>
          <input type="text" value={settings.name} onChange={e => update("name", e.target.value)} placeholder="Nhập tên..."
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 14, outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
          />
        </div>
        <SettingSlider label="Năm sinh" value={settings.birthYear} min={1940} max={2015} onChange={v => update("birthYear", v)} format={v => `${v} (${new Date().getFullYear() - v} tuổi)`} icon="🎂" color="#60A5FA" />
        <SettingSlider label="Tuổi thọ dự kiến" value={settings.lifeExpectancy} min={50} max={120} onChange={v => update("lifeExpectancy", v)} format={v => `${v} năm`} icon="🎯" color="#34D399" />
      </div>

      {/* Sleep Section */}
      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(99,102,241,0.02))", borderRadius: 16, padding: 16, border: "1px solid rgba(99,102,241,0.12)", marginBottom: 16, animation: "fadeUp 0.5s ease 0.1s both" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0, marginBottom: 14 }}>😴 GIẤC NGỦ</p>

        <SettingSlider label="Giờ đi ngủ" value={settings.sleepStart} min={20} max={3} onChange={v => update("sleepStart", v < 4 ? v + 24 : v)} format={v => { const h = v > 23 ? v - 24 : v; return `${String(h).padStart(2,"0")}:00`; }} icon="🌙" color="#6366F1" />
        <SettingSlider label="Giờ thức dậy" value={settings.sleepEnd} min={4} max={12} onChange={v => update("sleepEnd", v)} format={v => `${String(v).padStart(2,"0")}:00`} icon="🌅" color="#F97316" />

        {/* Sleep visualization */}
        <div style={{ marginTop: 8, padding: "12px 0" }}>
          <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
            {Array.from({ length: 24 }, (_, h) => {
              const isSleep = settings.sleepStart > settings.sleepEnd
                ? (h >= settings.sleepStart || h < settings.sleepEnd)
                : (h >= settings.sleepStart && h < settings.sleepEnd);
              return (
                <div key={h} style={{
                  flex: 1, height: 16, borderRadius: 2,
                  background: isSleep ? "#6366F1" : "#F9731644",
                  opacity: isSleep ? 0.7 : 0.25,
                  transition: "all 0.3s ease",
                }} />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[0,6,12,18,23].map(h => (
              <span key={h} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{String(h).padStart(2,"0")}h</span>
            ))}
          </div>
        </div>

        {/* Sleep summary */}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1, padding: "8px 12px", borderRadius: 10, background: "rgba(99,102,241,0.1)", textAlign: "center" }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: "#6366F1", margin: 0 }}>{sleepHours}h</p>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, marginTop: 2 }}>Ngủ</p>
          </div>
          <div style={{ flex: 1, padding: "8px 12px", borderRadius: 10, background: "rgba(249,115,22,0.1)", textAlign: "center" }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: "#F97316", margin: 0 }}>{awakeHours}h</p>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, marginTop: 2 }}>Thức</p>
          </div>
          <div style={{ flex: 1, padding: "8px 12px", borderRadius: 10, background: "rgba(34,197,94,0.1)", textAlign: "center" }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: "#22c55e", margin: 0 }}>{(awakeHours * 365).toLocaleString()}h</p>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, marginTop: 2 }}>Thức/năm</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16, animation: "fadeUp 0.5s ease 0.2s both" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0, marginBottom: 6 }}>🔔 THÔNG BÁO</p>
        <SettingToggle label="Thông báo mốc thời gian" value={settings.notifyMilestones} onChange={() => update("notifyMilestones", !settings.notifyMilestones)} icon="🏁" description='"Năm 2026 đã qua 50% rồi!"' />
        <SettingToggle label="Nhắc nhở hàng ngày" value={settings.notifyDaily} onChange={() => update("notifyDaily", !settings.notifyDaily)} icon="⏰" description="Nhận thông báo mỗi ngày" />
        {settings.notifyDaily && (
          <div style={{ paddingLeft: 34, marginTop: 8 }}>
            <SettingSlider label="Giờ nhắc" value={settings.dailyNotifyTime} min={6} max={22} onChange={v => update("dailyNotifyTime", v)} format={v => `${String(v).padStart(2,"0")}:00`} icon="🕐" color="#FBBF24" />
          </div>
        )}
      </div>

      {/* Display */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16, animation: "fadeUp 0.5s ease 0.3s both" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0, marginBottom: 6 }}>🎨 HIỂN THỊ</p>
        <SettingToggle label="Hiện giây" value={settings.showSeconds} onChange={() => update("showSeconds", !settings.showSeconds)} icon="⏱" description="Hiện giây trong đồng hồ" />
        <SettingToggle label="Tab Cuộc đời" value={settings.showLifeTab} onChange={() => update("showLifeTab", !settings.showLifeTab)} icon="👤" description="Hiện tab cuộc đời ở thanh điều hướng" />
      </div>

      {/* Life stats */}
      <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(236,72,153,0.04))", borderRadius: 16, padding: 16, border: "1px solid rgba(245,158,11,0.1)", animation: "fadeUp 0.5s ease 0.4s both" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0, marginBottom: 14 }}>📊 THỐNG KÊ CUỘC ĐỜI</p>
        {[
          { label: "Đã sống", value: `${age} năm`, sub: `${(age * 365).toLocaleString()} ngày`, color: "#F59E0B" },
          { label: "Đã thức", value: `${(age * awakeHours * 365).toLocaleString()}h`, sub: `${((age * awakeHours * 365) / 24).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ngày`, color: "#F97316" },
          { label: "Đã ngủ", value: `${(age * sleepHours * 365).toLocaleString()}h`, sub: `${((age * sleepHours * 365) / 24).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ngày`, color: "#6366F1" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{s.label}</span>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 600, color: s.color }}>{s.value}</span>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* App info */}
      <div style={{ textAlign: "center", marginTop: 24, animation: "fadeUp 0.5s ease 0.5s both" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: 0 }}>⏳ Time Flies</p>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0, marginTop: 4 }}>v1.0.0 • Made with ❤️</p>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.15)", margin: 0, marginTop: 8 }}>Mỗi giây đều quý giá.</p>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function TimeFlyApp() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [data, setData] = useState(() => getTimeData(settings));
  const [currentTime, setCurrentTime] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const tick = () => {
      setData(getTimeData(settings));
      setCurrentTime(new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit", minute: "2-digit",
        ...(settings.showSeconds ? { second: "2-digit" } : {}),
      }));
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [settings]);

  const tabs = [
    { icon: "⏱", label: "Hôm nay" },
    { icon: "🟩", label: "Năm" },
    ...(settings.showLifeTab ? [{ icon: "👤", label: "Cuộc đời" }] : []),
    { icon: "💬", label: "Suy ngẫm" },
    { icon: "⚙️", label: "Cài đặt" },
  ];

  const renderTab = () => {
    const lifeIdx = settings.showLifeTab ? 2 : -1;
    const quoteIdx = settings.showLifeTab ? 3 : 2;
    const settingsIdx = settings.showLifeTab ? 4 : 3;

    if (activeTab === 0) return <HomeScreen data={data} currentTime={currentTime} settings={settings} />;
    if (activeTab === 1) return <YearHeatmap />;
    if (activeTab === lifeIdx) return <LifeGrid settings={settings} />;
    if (activeTab === quoteIdx) return <QuoteScreen />;
    if (activeTab === settingsIdx) return <SettingsScreen settings={settings} setSettings={setSettings} />;
    return null;
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start", background: "#0a0a0f", fontFamily: "'Outfit',sans-serif", padding: "20px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
        @keyframes colonBlink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
        @keyframes hourPulse { 0%,100% { box-shadow:0 0 6px rgba(249,115,22,0.4); } 50% { box-shadow:0 0 16px rgba(249,115,22,0.9), 0 0 30px rgba(249,115,22,0.3); } }
        @keyframes shimmerBar { 0% { transform:translateX(-100%); } 100% { transform:translateX(200%); } }
        @keyframes countPop { 0% { transform:scale(1); } 50% { transform:scale(1.08); } 100% { transform:scale(1); } }
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        ::-webkit-scrollbar { width:0; display:none; }
        input[type=range] { -webkit-appearance:none; appearance:none; height:6px; background:rgba(255,255,255,0.08); border-radius:99px; outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#fff; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.3); }
        input[type=range]::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#fff; cursor:pointer; border:none; }
      `}</style>

      <div style={{
        width: 375, minHeight: 720, maxHeight: "90vh",
        background: "linear-gradient(180deg, #0d0d14 0%, #111118 40%, #0f0f17 100%)",
        borderRadius: 40, border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 80px rgba(0,0,0,0.8), 0 0 200px rgba(100,50,200,0.05)",
        overflow: "hidden", position: "relative", display: "flex", flexDirection: "column",
      }}>
        {/* Status bar */}
        <div style={{ padding: "12px 28px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{currentTime.slice(0, 5)}</span>
          <div style={{ width: 100, height: 28, borderRadius: 99, background: "#000" }} />
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ width: 14, height: 9, borderRadius: 2, border: "1px solid rgba(255,255,255,0.4)" }}><div style={{ width: "70%", height: "100%", background: "rgba(255,255,255,0.5)", borderRadius: 1 }} /></div>
          </div>
        </div>

        {/* App title */}
        <div style={{ padding: "8px 24px 12px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 20 }}>⏳</span>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>Time Flies</h1>
          <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s ease infinite" }} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>LIVE</span>
        </div>

        {/* Content */}
        <div key={activeTab} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: 80 }}>
          {renderTab()}
        </div>

        {/* Bottom nav */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px 28px", background: "linear-gradient(transparent, #0d0d14 30%)", display: "flex", justifyContent: "space-around" }}>
          {tabs.map((tab, i) => (
            <button key={`${tab.label}-${i}`} onClick={() => setActiveTab(i)} style={{
              background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              cursor: "pointer", opacity: activeTab === i ? 1 : 0.35, transform: activeTab === i ? "scale(1.05)" : "scale(1)",
              transition: "all 0.3s ease", padding: "6px 8px",
            }}>
              <span style={{ fontSize: 16 }}>{tab.icon}</span>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 500, color: "#fff", letterSpacing: "0.3px" }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}