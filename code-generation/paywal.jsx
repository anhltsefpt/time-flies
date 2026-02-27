import { useState, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');`;

export default function FinitePaywall() {
  const [showPricing, setShowPricing] = useState(false);
  const [selected, setSelected] = useState("yearly");
  const [daysLeft, setDaysLeft] = useState(16060);

  useEffect(() => {
    const birthYear = 1995;
    const lifeExp = 75;
    const endDate = new Date(birthYear + lifeExp, 0, 1);
    setDaysLeft(Math.floor((endDate - new Date()) / 86400000));
  }, []);

  const features = [
    { icon: "🔥", title: "Your Life, Mapped", desc: "Every phase from childhood to golden years" },
    { icon: "⏳", title: "Unlimited Countdowns", desc: "Track every deadline and milestone" },
    { icon: "📊", title: "Lifetime Stats", desc: "192,355h awake. 3,300 days asleep." },
    { icon: "🧩", title: "Home Widgets", desc: "Life countdown on every unlock" },
  ];

  const plans = [
    { id: "yearly", label: "Yearly", price: "$7.99", unit: "/year", perMonth: "$0.67/mo", trial: "7 days free", badge: "MOST POPULAR", save: "Save 67%" },
    { id: "monthly", label: "Monthly", price: "$1.99", unit: "/mo", perMonth: null, trial: "3 days free" },
    { id: "lifetime", label: "Lifetime", price: "$9.99", unit: "", perMonth: "Pay once, keep forever", trial: null },
  ];

  const ctaText = { yearly: "Start 7-Day Free Trial", monthly: "Start 3-Day Free Trial", lifetime: "Get Lifetime Access — $9.99" };
  const subText = { yearly: "Then $7.99/year. Cancel anytime.", monthly: "Then $1.99/month. Cancel anytime.", lifetime: "One-time payment. No subscription." };

  return (
    <div style={{
      width: "100%", maxWidth: 420, margin: "0 auto", height: "100vh",
      background: "#0A0A0F", fontFamily: "'Outfit', sans-serif",
      position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      <style>{FONTS}</style>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes slideSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249,115,22,0.12); }
          50% { box-shadow: 0 0 30px rgba(249,115,22,0.22); }
        }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* Background glow */}
      <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Close */}
      <div style={{ position: "absolute", top: 16, right: 20, zIndex: 10 }}>
        <button style={{
          width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.06)",
          border: "none", color: "rgba(255,255,255,0.25)", fontSize: 15, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
      </div>

      {/* ============ STEP 1: EMOTIONAL SCREEN ============ */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 24px", position: "relative", zIndex: 1,
      }}>
        {/* Label */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          color: "rgba(255,255,255,0.2)", letterSpacing: "3px", marginBottom: 14,
          textTransform: "uppercase",
        }}>you have</p>

        {/* THE NUMBER */}
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 72, fontWeight: 800,
          color: "#fff", lineHeight: 1, letterSpacing: "-3px",
        }}>{daysLeft.toLocaleString()}</p>

        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
          color: "rgba(255,255,255,0.25)", marginTop: 8,
        }}>days left to live</p>

        {/* Progress bar */}
        <div style={{
          width: "55%", height: 3, borderRadius: 99, marginTop: 20,
          background: "rgba(255,255,255,0.04)", overflow: "hidden",
        }}>
          <div style={{
            width: "41.5%", height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg, #F97316, #EF4444)",
          }} />
        </div>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: "rgba(255,255,255,0.12)", marginTop: 6,
        }}>41.5% gone</p>

        {/* Quote */}
        <div style={{ marginTop: 36, textAlign: "center" }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 17,
            color: "rgba(255,255,255,0.4)", lineHeight: 1.6,
          }}>You're not buying an app.</p>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700,
            color: "#F97316", lineHeight: 1.6, marginTop: 4,
          }}>You're buying the clock<br />that reminds you to live.</p>
        </div>

        {/* 2x2 Feature grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          marginTop: 32, width: "100%",
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: "14px 12px", borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
              <span style={{ fontSize: 18, display: "block", marginBottom: 6 }}>{f.icon}</span>
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700,
                color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.25,
              }}>{f.title}</p>
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 11,
                color: "rgba(255,255,255,0.25)", margin: 0, marginTop: 3, lineHeight: 1.35,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONTINUE BUTTON */}
      <div style={{ padding: "0 24px 44px", position: "relative", zIndex: 1 }}>
        <button onClick={() => setShowPricing(true)} style={{
          width: "100%", padding: "18px 0", borderRadius: 16, border: "none",
          background: "linear-gradient(135deg, #F97316, #EA580C)",
          cursor: "pointer", position: "relative", overflow: "hidden",
          animation: "glow 3s ease-in-out infinite",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            backgroundSize: "200% 100%", animation: "shimmer 3s ease-in-out infinite",
          }} />
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700,
            color: "#fff", position: "relative", zIndex: 1,
          }}>Continue</span>
        </button>
      </div>

      {/* ============ STEP 2: PRICING BOTTOM SHEET ============ */}
      {showPricing && (
        <>
          <div onClick={() => setShowPricing(false)} style={{
            position: "absolute", inset: 0, zIndex: 50,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            animation: "fadeOverlay 0.2s ease both",
          }} />

          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 60,
            background: "#111118", borderRadius: "24px 24px 0 0",
            padding: "16px 22px 40px",
            animation: "slideSheetUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.12)", margin: "0 auto 18px" }} />

            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 4 }}>Choose your plan</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", marginBottom: 18 }}>Cancel anytime. No commitment.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {plans.map((plan) => {
                const isSelected = selected === plan.id;
                const isYearly = plan.id === "yearly";
                return (
                  <button key={plan.id} onClick={() => setSelected(plan.id)} style={{
                    width: "100%", border: "none", cursor: "pointer", borderRadius: 14, position: "relative",
                    background: isSelected ? "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))" : "rgba(255,255,255,0.025)",
                    outline: isSelected ? "2px solid rgba(249,115,22,0.8)" : "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.15s ease", padding: "14px 16px", display: "flex", alignItems: "center",
                  }}>
                    {isYearly && (
                      <div style={{
                        position: "absolute", top: -9, left: 16, padding: "2px 9px", borderRadius: 5,
                        background: "linear-gradient(135deg, #F97316, #EA580C)",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.5px",
                      }}>{plan.badge}</div>
                    )}
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginRight: 12,
                      border: isSelected ? "none" : "2px solid rgba(255,255,255,0.1)",
                      background: isSelected ? "linear-gradient(135deg, #F97316, #EA580C)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease",
                    }}>{isSelected && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}</div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: isSelected ? "#fff" : "rgba(255,255,255,0.4)" }}>{plan.label}</span>
                        {plan.save && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#22C55E", background: "rgba(34,197,94,0.1)", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>{plan.save}</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                        {plan.perMonth && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: isSelected ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}>{plan.perMonth}</span>}
                        {plan.trial && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, color: "#F97316", background: "rgba(249,115,22,0.08)", padding: "2px 6px", borderRadius: 4 }}>{plan.trial}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, color: isSelected ? "#fff" : "rgba(255,255,255,0.3)" }}>{plan.price}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: isSelected ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)" }}>{plan.unit}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button style={{
              width: "100%", padding: "17px 0", borderRadius: 14, border: "none",
              background: "linear-gradient(135deg, #F97316, #EA580C)",
              cursor: "pointer", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)", backgroundSize: "200% 100%", animation: "shimmer 3s ease-in-out infinite" }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", position: "relative", zIndex: 1 }}>{ctaText[selected]}</span>
            </button>

            <p style={{ textAlign: "center", marginTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.12)" }}>{subText[selected]}</p>
            <button style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.12)", textDecoration: "underline", textUnderlineOffset: 3 }}>Restore purchases</button>
          </div>
        </>
      )}
    </div>
  );
}