<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Finite — Your Life in Perspective</title>
<meta name="description" content="Watch time fly in real-time. See your day, year, and entire life as beautiful progress bars, GitHub-style heatmaps, and life grids. Every second counts.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #08080d;
    --bg2: #0c0c14;
    --bg3: #10101a;
    --orange: #F97316;
    --orange-glow: rgba(249,115,22,0.15);
    --gold: #FBBF24;
    --green: #22c55e;
    --blue: #3B82F6;
    --purple: #8B5CF6;
    --pink: #EC4899;
    --text: #ffffff;
    --text-dim: rgba(255,255,255,0.5);
    --text-muted: rgba(255,255,255,0.25);
    --border: rgba(255,255,255,0.06);
  }

  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Outfit', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* ============ GLOBAL ============ */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .mono { font-family: 'JetBrains Mono', monospace; }
  .section { padding: 120px 0; position: relative; }
  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--orange); margin-bottom: 16px; display: block;
  }
  .section-title {
    font-size: clamp(32px, 5vw, 52px); font-weight: 800;
    line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px;
  }
  .section-subtitle {
    font-size: clamp(16px, 2vw, 20px); font-weight: 300;
    color: var(--text-dim); line-height: 1.6; max-width: 560px;
  }
  .gradient-text {
    background: linear-gradient(135deg, #F97316, #FBBF24);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .fade-in { opacity: 0; transform: translateY(30px); animation: fadeIn 0.8s ease forwards; }
  .fade-in-d1 { animation-delay: 0.1s; }
  .fade-in-d2 { animation-delay: 0.2s; }
  .fade-in-d3 { animation-delay: 0.3s; }
  .fade-in-d4 { animation-delay: 0.4s; }
  .fade-in-d5 { animation-delay: 0.5s; }
  .fade-in-d6 { animation-delay: 0.6s; }

  @keyframes fadeIn { to { opacity:1; transform:translateY(0); } }
  @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
  @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
  @keyframes shimmer { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
  @keyframes countUp { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
  @keyframes gradientShift { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
  @keyframes grain { 0%,100% { transform:translate(0,0); } 10% { transform:translate(-5%,-10%); } 30% { transform:translate(3%,-15%); } 50% { transform:translate(12%,9%); } 70% { transform:translate(9%,4%); } 90% { transform:translate(-1%,7%); } }

  /* Grain overlay */
  body::after {
    content: ''; position: fixed; inset: -50%; z-index: 9999;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.015; pointer-events: none;
    animation: grain 8s steps(10) infinite;
  }

  /* ============ NAV ============ */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 16px 0; backdrop-filter: blur(20px);
    background: rgba(8,8,13,0.7);
    border-bottom: 1px solid var(--border);
    transition: all 0.3s ease;
  }
  nav .container {
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; color: var(--text);
  }
  .nav-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--orange-glow), rgba(251,191,36,0.1));
    border: 1px solid rgba(249,115,22,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .nav-logo span { font-weight: 700; font-size: 18px; letter-spacing: -0.5px; }
  .nav-links { display: flex; align-items: center; gap: 32px; }
  .nav-links a {
    color: var(--text-dim); text-decoration: none; font-size: 14px;
    font-weight: 400; transition: color 0.2s; letter-spacing: 0.2px;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-cta {
    padding: 10px 24px; border-radius: 99px; border: none;
    background: linear-gradient(135deg, var(--orange), var(--gold));
    color: #000; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer;
    text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
  }
  .nav-cta:hover { transform: scale(1.03); box-shadow: 0 4px 20px rgba(249,115,22,0.3); }

  /* ============ HERO ============ */
  .hero {
    min-height: 100vh; display: flex; align-items: center;
    padding-top: 80px; position: relative; overflow: hidden;
  }
  .hero-bg-glow {
    position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
    width: 800px; height: 800px; border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-bg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  }
  .hero .container {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 60px; align-items: center; position: relative; z-index: 1;
  }
  .hero-content { max-width: 560px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px; border-radius: 99px;
    background: rgba(249,115,22,0.06); border: 1px solid rgba(249,115,22,0.12);
    margin-bottom: 28px;
  }
  .hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green); animation: pulse 2s ease infinite;
  }
  .hero-badge span { font-size: 12px; color: var(--text-dim); font-weight: 500; }
  .hero-badge strong { color: var(--orange); }
  .hero h1 {
    font-size: clamp(40px, 6vw, 72px); font-weight: 800;
    line-height: 1.05; letter-spacing: -2.5px; margin-bottom: 24px;
  }
  .hero p {
    font-size: 18px; color: var(--text-dim); line-height: 1.7;
    font-weight: 300; margin-bottom: 40px; max-width: 480px;
  }
  .hero-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 16px 32px; border-radius: 14px; border: none;
    background: linear-gradient(135deg, var(--orange), var(--gold));
    color: #000; font-family: 'Outfit', sans-serif;
    font-size: 16px; font-weight: 600; cursor: pointer;
    text-decoration: none; position: relative; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(249,115,22,0.25);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(249,115,22,0.35); }
  .btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: shimmer 3s ease infinite;
  }
  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 16px 28px; border-radius: 14px;
    border: 1px solid var(--border); background: rgba(255,255,255,0.03);
    color: var(--text-dim); font-family: 'Outfit', sans-serif;
    font-size: 16px; font-weight: 400; cursor: pointer;
    text-decoration: none; transition: all 0.2s;
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.06); color: var(--text); border-color: rgba(255,255,255,0.12); }
  .hero-stores {
    display: flex; gap: 10px; margin-top: 16px;
  }
  .hero-stores span { font-size: 12px; color: var(--text-muted); }

  /* Phone mockup */
  .hero-visual { display: flex; justify-content: center; position: relative; }
  .phone-mockup {
    width: 280px; height: 570px;
    background: linear-gradient(180deg, #0d0d14, #111118, #0f0f17);
    border-radius: 36px; border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 0 80px rgba(0,0,0,0.6), 0 0 160px rgba(249,115,22,0.05);
    overflow: hidden; position: relative;
    animation: float 6s ease-in-out infinite;
  }
  .phone-notch {
    width: 80px; height: 24px; background: #000;
    border-radius: 0 0 16px 16px; margin: 0 auto;
  }
  .phone-content { padding: 12px 16px; }
  .phone-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: 28px; font-weight: 700; text-align: center;
    margin: 12px 0 4px; letter-spacing: -1px;
  }
  .phone-date {
    font-size: 11px; color: var(--text-dim); text-align: center;
    margin-bottom: 16px;
  }
  .phone-progress { margin-bottom: 12px; }
  .phone-progress-label {
    display: flex; justify-content: space-between; margin-bottom: 4px;
  }
  .phone-progress-label span {
    font-size: 10px; color: var(--text-dim);
    font-family: 'Outfit', sans-serif;
  }
  .phone-progress-label strong {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600;
  }
  .phone-bar {
    width: 100%; height: 6px; border-radius: 99px;
    background: rgba(255,255,255,0.06); overflow: hidden;
  }
  .phone-bar-fill {
    height: 100%; border-radius: 99px;
    transition: width 2s cubic-bezier(0.16,1,0.3,1);
  }

  /* Mini heatmap in phone */
  .phone-heatmap {
    display: grid; grid-template-columns: repeat(7,1fr); gap: 2px;
    margin-top: 16px; padding: 10px;
    background: rgba(255,255,255,0.02); border-radius: 10px;
    border: 1px solid var(--border);
  }
  .heatmap-cell {
    aspect-ratio: 1; border-radius: 2px;
    transition: background 0.3s ease;
  }
  .phone-glow {
    position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%);
    width: 300px; height: 120px;
    background: radial-gradient(ellipse, rgba(249,115,22,0.12), transparent);
    pointer-events: none;
  }

  /* ============ STATS BAR ============ */
  .stats-bar {
    padding: 48px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
  }
  .stats-bar .container {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;
  }
  .stat { text-align: center; }
  .stat-number {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(28px, 4vw, 40px); font-weight: 700;
    letter-spacing: -1px; animation: countUp 0.8s ease forwards;
  }
  .stat-label { font-size: 14px; color: var(--text-muted); margin-top: 4px; font-weight: 400; }

  /* ============ FEATURES ============ */
  .features { background: var(--bg); }
  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-top: 60px;
  }
  .feature-card {
    padding: 32px; border-radius: 20px;
    background: rgba(255,255,255,0.015);
    border: 1px solid var(--border);
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    position: relative; overflow: hidden;
  }
  .feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--orange), transparent);
    opacity: 0; transition: opacity 0.4s;
  }
  .feature-card:hover { background: rgba(255,255,255,0.03); transform: translateY(-4px); border-color: rgba(255,255,255,0.1); }
  .feature-card:hover::before { opacity: 0.5; }
  .feature-icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 20px;
  }
  .feature-card h3 {
    font-size: 18px; font-weight: 600; margin-bottom: 8px;
    letter-spacing: -0.3px;
  }
  .feature-card p {
    font-size: 14px; color: var(--text-dim); line-height: 1.6; font-weight: 300;
  }

  /* ============ SHOWCASE ============ */
  .showcase { background: var(--bg2); overflow: hidden; }
  .showcase-tabs {
    display: flex; gap: 8px; margin-bottom: 48px; flex-wrap: wrap;
  }
  .showcase-tab {
    padding: 10px 20px; border-radius: 99px; border: 1px solid var(--border);
    background: transparent; color: var(--text-dim); font-family: 'Outfit', sans-serif;
    font-size: 14px; cursor: pointer; transition: all 0.3s;
  }
  .showcase-tab.active {
    background: var(--orange); color: #000; border-color: var(--orange); font-weight: 600;
  }
  .showcase-tab:hover:not(.active) { border-color: rgba(255,255,255,0.15); color: var(--text); }
  .showcase-display {
    display: flex; justify-content: center; align-items: center;
    min-height: 500px; position: relative;
  }
  .showcase-phone {
    width: 300px; height: 610px;
    background: linear-gradient(180deg, #0d0d14, #111118, #0f0f17);
    border-radius: 40px; border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 0 100px rgba(0,0,0,0.5), 0 0 200px rgba(249,115,22,0.04);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; color: var(--text-muted); text-align: center;
    padding: 40px; line-height: 1.6;
  }
  .showcase-phone .showcase-inner {
    width: 100%;
  }
  .showcase-heatmap-grid {
    display: grid; grid-template-columns: repeat(14, 1fr); gap: 2px;
    padding: 8px;
  }
  .showcase-heatmap-cell {
    aspect-ratio: 1; border-radius: 2px;
  }
  .showcase-life-grid {
    display: flex; flex-wrap: wrap; gap: 2px;
    justify-content: center; padding: 8px;
  }
  .showcase-life-cell {
    width: 10px; height: 10px; border-radius: 2px;
  }
  .showcase-caption {
    text-align: center; margin-top: 32px;
    font-size: 16px; color: var(--text-dim); font-weight: 300;
    max-width: 400px; margin-left: auto; margin-right: auto;
  }

  /* ============ HOW IT WORKS ============ */
  .how-it-works { background: var(--bg); }
  .steps {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 40px; margin-top: 60px; position: relative;
  }
  .steps::before {
    content: ''; position: absolute; top: 36px; left: 15%; right: 15%;
    height: 1px; background: linear-gradient(90deg, transparent, var(--border), var(--border), transparent);
  }
  .step { text-align: center; position: relative; }
  .step-number {
    width: 72px; height: 72px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 24px; font-weight: 700;
    margin: 0 auto 24px; position: relative; z-index: 1;
  }
  .step h3 { font-size: 20px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.3px; }
  .step p { font-size: 14px; color: var(--text-dim); line-height: 1.6; font-weight: 300; }

  /* ============ TESTIMONIALS ============ */
  .testimonials { background: var(--bg2); }
  .testimonials-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-top: 60px;
  }
  .testimonial-card {
    padding: 28px; border-radius: 20px;
    background: rgba(255,255,255,0.015); border: 1px solid var(--border);
    transition: all 0.3s;
  }
  .testimonial-card:hover { background: rgba(255,255,255,0.03); }
  .testimonial-stars { display: flex; gap: 2px; margin-bottom: 16px; }
  .testimonial-stars span { color: var(--gold); font-size: 14px; }
  .testimonial-text {
    font-size: 15px; color: var(--text-dim); line-height: 1.7;
    font-weight: 300; margin-bottom: 20px; font-style: italic;
  }
  .testimonial-author { display: flex; align-items: center; gap: 10px; }
  .testimonial-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; color: #fff;
  }
  .testimonial-name { font-size: 14px; font-weight: 600; }
  .testimonial-role { font-size: 12px; color: var(--text-muted); }

  /* ============ PRICING ============ */
  .pricing { background: var(--bg); }
  .pricing-cards {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-top: 60px; max-width: 900px; margin-left: auto; margin-right: auto;
  }
  .pricing-card {
    padding: 32px 28px; border-radius: 20px;
    background: rgba(255,255,255,0.015); border: 1px solid var(--border);
    text-align: center; position: relative; transition: all 0.3s;
  }
  .pricing-card:hover { background: rgba(255,255,255,0.03); }
  .pricing-card.featured {
    border-color: var(--orange);
    background: linear-gradient(135deg, rgba(249,115,22,0.06), rgba(251,191,36,0.03));
    transform: scale(1.05);
  }
  .pricing-card.featured:hover { transform: scale(1.07); }
  .pricing-badge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    padding: 4px 16px; border-radius: 99px;
    background: linear-gradient(90deg, var(--orange), var(--gold));
    font-size: 11px; font-weight: 700; color: #000;
    letter-spacing: 0.5px; text-transform: uppercase;
  }
  .pricing-tier { font-size: 14px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .pricing-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 40px; font-weight: 700; letter-spacing: -1px; margin-bottom: 4px;
  }
  .pricing-price span { font-size: 16px; font-weight: 400; color: var(--text-dim); }
  .pricing-period { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }
  .pricing-features { list-style: none; text-align: left; margin-bottom: 28px; }
  .pricing-features li {
    font-size: 14px; color: var(--text-dim); padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    display: flex; align-items: center; gap: 10px;
  }
  .pricing-features li::before { content: '✓'; color: var(--green); font-weight: 700; font-size: 12px; }
  .pricing-btn {
    width: 100%; padding: 14px; border-radius: 12px; border: none;
    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .pricing-btn.primary {
    background: linear-gradient(135deg, var(--orange), var(--gold));
    color: #000; box-shadow: 0 4px 20px rgba(249,115,22,0.2);
  }
  .pricing-btn.primary:hover { box-shadow: 0 8px 32px rgba(249,115,22,0.35); transform: translateY(-1px); }
  .pricing-btn.secondary {
    background: rgba(255,255,255,0.05); color: var(--text-dim);
    border: 1px solid var(--border);
  }
  .pricing-btn.secondary:hover { background: rgba(255,255,255,0.08); color: var(--text); }
  .pricing-savings { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--green); font-weight: 600; margin-top: 8px; }

  /* ============ CTA ============ */
  .cta {
    padding: 140px 0; text-align: center;
    background: var(--bg2); position: relative; overflow: hidden;
  }
  .cta-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta h2 {
    font-size: clamp(36px, 5vw, 56px); font-weight: 800;
    line-height: 1.1; letter-spacing: -2px; margin-bottom: 16px;
    position: relative; z-index: 1;
  }
  .cta p {
    font-size: 18px; color: var(--text-dim); font-weight: 300;
    margin-bottom: 40px; position: relative; z-index: 1;
  }
  .cta .btn-primary { position: relative; z-index: 1; font-size: 18px; padding: 18px 40px; }

  /* ============ FOOTER ============ */
  footer {
    padding: 60px 0 40px; border-top: 1px solid var(--border);
    background: var(--bg);
  }
  footer .container {
    display: flex; justify-content: space-between; align-items: flex-start;
    flex-wrap: wrap; gap: 40px;
  }
  .footer-brand { max-width: 280px; }
  .footer-brand p { font-size: 13px; color: var(--text-muted); margin-top: 12px; line-height: 1.6; }
  .footer-links { display: flex; gap: 60px; }
  .footer-col h4 { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; }
  .footer-col a { display: block; font-size: 14px; color: var(--text-dim); text-decoration: none; padding: 4px 0; transition: color 0.2s; }
  .footer-col a:hover { color: var(--text); }
  .footer-bottom {
    margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted);
  }

  /* ============ RESPONSIVE ============ */
  @media (max-width: 900px) {
    .hero .container { grid-template-columns: 1fr; text-align: center; }
    .hero-content { max-width: 100%; margin: 0 auto; }
    .hero-actions { justify-content: center; }
    .hero-visual { margin-top: 40px; }
    .section-subtitle { margin-left: auto; margin-right: auto; }
    .features-grid, .testimonials-grid, .pricing-cards, .steps { grid-template-columns: 1fr; }
    .stats-bar .container { grid-template-columns: repeat(2, 1fr); }
    .nav-links a:not(.nav-cta) { display: none; }
    .footer-links { gap: 32px; }
    .footer-bottom { flex-direction: column; gap: 8px; }
    .pricing-card.featured { transform: scale(1); }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <div class="container">
    <a href="#" class="nav-logo">
      <div class="nav-logo-icon">⏳</div>
      <span>Finite</span>
    </a>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#showcase">Preview</a>
      <a href="#pricing">Pricing</a>
      <a href="#download" class="nav-cta">Download Free</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg-glow"></div>
  <div class="hero-bg-grid"></div>
  <div class="container">
    <div class="hero-content">
      <div class="hero-badge fade-in">
        <div class="hero-badge-dot"></div>
        <span>Your life is <strong>ticking</strong> right now</span>
      </div>
      <h1 class="fade-in fade-in-d1">
        Time doesn't<br>wait. <span class="gradient-text">Neither<br>should you.</span>
      </h1>
      <p class="fade-in fade-in-d2">
        Watch your day, year, and entire life slip away in real-time.
        Beautiful progress bars, GitHub-style heatmaps, and a life grid
        that will change how you see every second.
      </p>
      <div class="hero-actions fade-in fade-in-d3">
        <a href="#download" class="btn-primary">
          <span>Download Free</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <a href="#showcase" class="btn-secondary">See it in action</a>
      </div>
      <div class="hero-stores fade-in fade-in-d4">
        <span>Available on iOS & Android — Free to start</span>
      </div>
    </div>
    <div class="hero-visual fade-in fade-in-d3">
      <div class="phone-mockup" id="phoneMockup">
        <div class="phone-notch"></div>
        <div class="phone-content">
          <div class="phone-time" id="phoneTime">--:--</div>
          <div class="phone-date" id="phoneDate">Loading...</div>

          <div class="phone-progress">
            <div class="phone-progress-label">
              <span>⚡ Awake Time</span>
              <strong id="awakeVal" style="color:#F97316">--%</strong>
            </div>
            <div class="phone-bar"><div class="phone-bar-fill" id="awakeFill" style="background:linear-gradient(90deg,#F97316,#FB923C);width:0%;box-shadow:0 0 8px rgba(249,115,22,0.3)"></div></div>
          </div>
          <div class="phone-progress">
            <div class="phone-progress-label">
              <span>📅 This Week</span>
              <strong id="weekVal" style="color:#3B82F6">--%</strong>
            </div>
            <div class="phone-bar"><div class="phone-bar-fill" id="weekFill" style="background:linear-gradient(90deg,#3B82F6,#60A5FA);width:0%;box-shadow:0 0 8px rgba(59,130,246,0.3)"></div></div>
          </div>
          <div class="phone-progress">
            <div class="phone-progress-label">
              <span>📆 This Year</span>
              <strong id="yearVal" style="color:#EC4899">--%</strong>
            </div>
            <div class="phone-bar"><div class="phone-bar-fill" id="yearFill" style="background:linear-gradient(90deg,#EC4899,#F472B6);width:0%;box-shadow:0 0 8px rgba(236,72,153,0.3)"></div></div>
          </div>
          <div class="phone-progress">
            <div class="phone-progress-label">
              <span>🔥 Your Life</span>
              <strong id="lifeVal" style="color:#F59E0B">--%</strong>
            </div>
            <div class="phone-bar"><div class="phone-bar-fill" id="lifeFill" style="background:linear-gradient(90deg,#F59E0B,#FBBF24);width:0%;box-shadow:0 0 8px rgba(245,158,11,0.3)"></div></div>
          </div>

          <div class="phone-heatmap" id="phoneHeatmap"></div>
        </div>
        <div class="phone-glow"></div>
      </div>
    </div>
  </div>
</section>

<!-- STATS -->
<section class="stats-bar">
  <div class="container">
    <div class="stat">
      <div class="stat-number gradient-text">24,500+</div>
      <div class="stat-label">Downloads</div>
    </div>
    <div class="stat">
      <div class="stat-number" style="color:#22c55e">4.8★</div>
      <div class="stat-label">App Store Rating</div>
    </div>
    <div class="stat">
      <div class="stat-number" style="color:#3B82F6">50K+</div>
      <div class="stat-label">Daily Active Users</div>
    </div>
    <div class="stat">
      <div class="stat-number" style="color:#8B5CF6">12M+</div>
      <div class="stat-label">Moments Tracked</div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="features section" id="features">
  <div class="container">
    <span class="section-label fade-in">Features</span>
    <h2 class="section-title fade-in fade-in-d1">Every feature designed to<br><span class="gradient-text">make you feel something.</span></h2>
    <p class="section-subtitle fade-in fade-in-d2">Not just another clock. Finite is a mirror that reflects how you spend the only resource you can never earn back.</p>

    <div class="features-grid">
      <div class="feature-card fade-in fade-in-d2">
        <div class="feature-icon" style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.15)">⏱</div>
        <h3>Real-Time Progress</h3>
        <p>Watch your day, week, month, year, and life tick away second by second. Live-updating progress bars that never stop.</p>
      </div>
      <div class="feature-card fade-in fade-in-d3">
        <div class="feature-icon" style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.15)">🟩</div>
        <h3>GitHub Year Heatmap</h3>
        <p>365 days visualized in a beautiful grid — just like GitHub contributions. Watch the green squares fill up as your year passes.</p>
      </div>
      <div class="feature-card fade-in fade-in-d4">
        <div class="feature-icon" style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.15)">👤</div>
        <h3>Life Grid</h3>
        <p>Each box is one year of your life. Color-coded by life phase: childhood, teenage, prime, golden years. See exactly where you are.</p>
      </div>
      <div class="feature-card fade-in fade-in-d3">
        <div class="feature-icon" style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.15)">📱</div>
        <h3>Home Screen Widgets</h3>
        <p>Five beautiful widget styles that update in real-time. See time fly every single time you unlock your phone.</p>
      </div>
      <div class="feature-card fade-in fade-in-d4">
        <div class="feature-icon" style="background:rgba(236,72,153,0.1);border:1px solid rgba(236,72,153,0.15)">😴</div>
        <h3>Awake Time Tracker</h3>
        <p>Set your sleep schedule and see how much waking time you truly have left today. It's less than you think.</p>
      </div>
      <div class="feature-card fade-in fade-in-d5">
        <div class="feature-icon" style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.15)">📤</div>
        <h3>Share Cards</h3>
        <p>Generate stunning cards to share on Instagram, Twitter, and TikTok. "My 2026 is 67% over" — watch it go viral.</p>
      </div>
    </div>
  </div>
</section>

<!-- SHOWCASE -->
<section class="showcase section" id="showcase">
  <div class="container">
    <span class="section-label">Preview</span>
    <h2 class="section-title">See what your life<br><span class="gradient-text">actually looks like.</span></h2>
    <p class="section-subtitle">Three powerful visualizations that reframe how you think about time.</p>

    <div class="showcase-tabs" style="margin-top:40px">
      <button class="showcase-tab active" onclick="showShowcase('heatmap',this)">Year Heatmap</button>
      <button class="showcase-tab" onclick="showShowcase('life',this)">Life Grid</button>
      <button class="showcase-tab" onclick="showShowcase('today',this)">Today View</button>
    </div>

    <div class="showcase-display">
      <div class="showcase-phone">
        <div class="showcase-inner" id="showcaseContent">
          <div style="margin-bottom:16px">
            <span class="mono" style="font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:2px">YEAR 2026</span>
            <div style="margin-top:6px"><span class="mono" style="font-size:32px;font-weight:700;color:#22c55e" id="showcaseDays">51</span><span class="mono" style="font-size:14px;color:rgba(255,255,255,0.3)"> / 365 days</span></div>
          </div>
          <div class="showcase-heatmap-grid" id="showcaseGrid"></div>
          <div style="display:flex;justify-content:flex-end;gap:4px;margin-top:8px;align-items:center">
            <span style="font-size:8px;color:rgba(255,255,255,0.2)" class="mono">Past</span>
            <div style="width:8px;height:8px;border-radius:2px;background:#166534"></div>
            <div style="width:8px;height:8px;border-radius:2px;background:#22c55e"></div>
            <span style="font-size:8px;color:rgba(255,255,255,0.2)" class="mono">Recent</span>
            <div style="width:8px;height:8px;border-radius:2px;background:#F97316;box-shadow:0 0 4px #F97316"></div>
            <span style="font-size:8px;color:rgba(255,255,255,0.2)" class="mono">Today</span>
          </div>
        </div>
      </div>
    </div>
    <p class="showcase-caption">Your year, day by day. Each square is one day — watch them light up as time passes.</p>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="how-it-works section">
  <div class="container">
    <div style="text-align:center">
      <span class="section-label">How It Works</span>
      <h2 class="section-title">Three seconds to a<br><span class="gradient-text">perspective shift.</span></h2>
    </div>
    <div class="steps">
      <div class="step fade-in fade-in-d1">
        <div class="step-number" style="background:rgba(249,115,22,0.1);border:2px solid rgba(249,115,22,0.2);color:var(--orange)">1</div>
        <h3>Download & Set</h3>
        <p>Enter your birth year and sleep schedule. Takes 10 seconds. That's it — no account needed.</p>
      </div>
      <div class="step fade-in fade-in-d2">
        <div class="step-number" style="background:rgba(59,130,246,0.1);border:2px solid rgba(59,130,246,0.2);color:var(--blue)">2</div>
        <h3>Add the Widget</h3>
        <p>Place Finite on your home screen. Every time you pick up your phone, you'll see time passing.</p>
      </div>
      <div class="step fade-in fade-in-d3">
        <div class="step-number" style="background:rgba(34,197,94,0.1);border:2px solid rgba(34,197,94,0.2);color:var(--green)">3</div>
        <h3>Live Differently</h3>
        <p>The awareness changes everything. Users report spending less time scrolling and more time living.</p>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="testimonials section">
  <div class="container">
    <div style="text-align:center">
      <span class="section-label">Testimonials</span>
      <h2 class="section-title">People call it a<br><span class="gradient-text">wake-up call.</span></h2>
    </div>
    <div class="testimonials-grid">
      <div class="testimonial-card fade-in fade-in-d1">
        <div class="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
        <p class="testimonial-text">"The Life Grid stopped me cold. Seeing 38% of my life filled in made me close Instagram and call my mom. That's never happened from an app before."</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar" style="background:var(--orange)">S</div>
          <div><div class="testimonial-name">Sarah M.</div><div class="testimonial-role">Product Designer, NYC</div></div>
        </div>
      </div>
      <div class="testimonial-card fade-in fade-in-d2">
        <div class="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
        <p class="testimonial-text">"I put the widget on my home screen and my average screen time dropped 40 minutes per day in the first week. It's like a gentle punch in the gut every time I unlock."</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar" style="background:var(--blue)">J</div>
          <div><div class="testimonial-name">Jake R.</div><div class="testimonial-role">Software Engineer, SF</div></div>
        </div>
      </div>
      <div class="testimonial-card fade-in fade-in-d3">
        <div class="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
        <p class="testimonial-text">"Shared my Year Heatmap on Twitter and got 500+ likes. People kept asking what app this was. It sparks the most interesting conversations about time."</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar" style="background:var(--green)">E</div>
          <div><div class="testimonial-name">Emily L.</div><div class="testimonial-role">Content Creator, LA</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section class="pricing section" id="pricing">
  <div class="container" style="text-align:center">
    <span class="section-label">Pricing</span>
    <h2 class="section-title">Free to start.<br><span class="gradient-text">Worth every penny to unlock.</span></h2>
    <p class="section-subtitle" style="margin:0 auto 0">The free version already changes your perspective. Premium takes it to another level.</p>

    <div class="pricing-cards">
      <div class="pricing-card">
        <div class="pricing-tier">Monthly</div>
        <div class="pricing-price">$1<span>.99</span></div>
        <div class="pricing-period">per month</div>
        <ul class="pricing-features">
          <li>Year Heatmap</li>
          <li>Life Grid</li>
          <li>5 Widget Styles</li>
          <li>Event Countdowns</li>
          <li>Share Cards</li>
          <li>All Themes</li>
        </ul>
        <button class="pricing-btn secondary">Get Started</button>
      </div>
      <div class="pricing-card featured">
        <div class="pricing-badge">Most Popular</div>
        <div class="pricing-tier">Yearly</div>
        <div class="pricing-price" style="color:var(--orange)">$9<span>.99</span></div>
        <div class="pricing-period">per year</div>
        <ul class="pricing-features">
          <li>Everything in Monthly</li>
          <li>7-day free trial</li>
          <li>Priority new features</li>
          <li>Annual recap report</li>
          <li>Exclusive themes</li>
          <li>Ad-free forever</li>
        </ul>
        <button class="pricing-btn primary">Start Free Trial</button>
        <div class="pricing-savings">Save 58% vs monthly</div>
      </div>
      <div class="pricing-card">
        <div class="pricing-tier">Lifetime</div>
        <div class="pricing-price">$19<span>.99</span></div>
        <div class="pricing-period">one-time payment</div>
        <ul class="pricing-features">
          <li>Everything, forever</li>
          <li>All future updates</li>
          <li>All future themes</li>
          <li>Founding member badge</li>
          <li>Beta feature access</li>
          <li>Support the creator</li>
        </ul>
        <button class="pricing-btn secondary">Buy Forever</button>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta" id="download">
  <div class="cta-glow"></div>
  <div class="container">
    <h2 class="fade-in">Every second you wait<br>is a second <span class="gradient-text">you'll never get back.</span></h2>
    <p class="fade-in fade-in-d1">Join 24,500+ people who stopped watching time pass and started making it count.</p>
    <a href="#" class="btn-primary fade-in fade-in-d2" style="font-size:18px;padding:18px 40px">
      Download Finite — It's Free
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-brand">
      <a href="#" class="nav-logo" style="margin-bottom:8px">
        <div class="nav-logo-icon">⏳</div>
        <span>Finite</span>
      </a>
      <p>Your life in perspective. Made with care in San Francisco.</p>
    </div>
    <div class="footer-links">
      <div class="footer-col">
        <h4>Product</h4>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#download">Download</a>
        <a href="#">Changelog</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="#">About</a>
        <a href="#">Blog</a>
        <a href="#">Press Kit</a>
        <a href="#">Contact</a>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Cookie Policy</a>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="footer-bottom">
      <span>&copy; 2026 Finite. All rights reserved.</span>
      <span>Every second counts.</span>
    </div>
  </div>
</footer>

<script>
// Live phone mockup
function updatePhone() {
  const now = new Date();
  const h = now.getHours(); const m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  document.getElementById('phoneTime').textContent = `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
  document.getElementById('phoneDate').textContent = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  // Awake (assuming 23-6 sleep)
  const cur = h + m / 60;
  const awakeH = cur >= 6 && cur < 23 ? cur - 6 : 17;
  const awakePct = Math.min((awakeH / 17) * 100, 100);
  document.getElementById('awakeVal').textContent = awakePct.toFixed(1) + '%';
  document.getElementById('awakeFill').style.width = awakePct + '%';

  // Week
  const dow = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const weekPct = ((dow * 1440 + h * 60 + m) / (7 * 1440)) * 100;
  document.getElementById('weekVal').textContent = weekPct.toFixed(1) + '%';
  document.getElementById('weekFill').style.width = weekPct + '%';

  // Year
  const ys = new Date(now.getFullYear(), 0, 1);
  const ye = new Date(now.getFullYear() + 1, 0, 1);
  const yearPct = ((now - ys) / (ye - ys)) * 100;
  document.getElementById('yearVal').textContent = yearPct.toFixed(1) + '%';
  document.getElementById('yearFill').style.width = yearPct + '%';

  // Life (assume born 1995, 78 yrs)
  const bd = new Date(1995, 0, 1);
  const le = new Date(1995 + 78, 0, 1);
  const lifePct = Math.min(((now - bd) / (le - bd)) * 100, 100);
  document.getElementById('lifeVal').textContent = lifePct.toFixed(2) + '%';
  document.getElementById('lifeFill').style.width = lifePct + '%';
}

// Phone mini heatmap
function buildPhoneHeatmap() {
  const el = document.getElementById('phoneHeatmap');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ys = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.round((today - ys) / 86400000) + 1;

  for (let i = 0; i < 49; i++) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    const dayNum = dayOfYear - 48 + i;
    if (dayNum <= 0) {
      cell.style.background = 'rgba(255,255,255,0.02)';
    } else if (i === 48) {
      cell.style.background = '#F97316';
      cell.style.boxShadow = '0 0 4px #F97316';
    } else {
      const ratio = i / 48;
      if (ratio > 0.8) cell.style.background = '#22c55e';
      else if (ratio > 0.5) cell.style.background = '#16a34a';
      else if (ratio > 0.3) cell.style.background = '#15803d';
      else cell.style.background = '#166534';
      cell.style.opacity = 0.5 + ratio * 0.5;
    }
    el.appendChild(cell);
  }
}

// Showcase tabs
function showShowcase(type, btn) {
  document.querySelectorAll('.showcase-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('showcaseContent');
  const caption = document.querySelector('.showcase-caption');

  if (type === 'heatmap') {
    const now = new Date();
    const ys = new Date(now.getFullYear(), 0, 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysPassed = Math.round((today - ys) / 86400000) + 1;

    let grid = '';
    for (let i = 0; i < 182; i++) {
      const isToday = i === daysPassed - 1;
      const isPast = i < daysPassed;
      let bg = 'rgba(255,255,255,0.04)';
      if (isToday) bg = '#F97316';
      else if (isPast) {
        const r = (i + 1) / daysPassed;
        bg = r > 0.8 ? '#22c55e' : r > 0.5 ? '#16a34a' : r > 0.3 ? '#15803d' : '#166534';
      }
      const shadow = isToday ? 'box-shadow:0 0 4px #F97316;' : '';
      grid += `<div class="showcase-heatmap-cell" style="background:${bg};${shadow}"></div>`;
    }
    content.innerHTML = `
      <div style="margin-bottom:16px">
        <span class="mono" style="font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:2px">YEAR 2026</span>
        <div style="margin-top:6px"><span class="mono" style="font-size:32px;font-weight:700;color:#22c55e">${daysPassed}</span><span class="mono" style="font-size:14px;color:rgba(255,255,255,0.3)"> / 365 days</span></div>
      </div>
      <div class="showcase-heatmap-grid">${grid}</div>
      <div style="display:flex;justify-content:flex-end;gap:4px;margin-top:8px;align-items:center">
        <span style="font-size:8px;color:rgba(255,255,255,0.2)" class="mono">Past</span>
        <div style="width:8px;height:8px;border-radius:2px;background:#166534"></div>
        <div style="width:8px;height:8px;border-radius:2px;background:#22c55e"></div>
        <span style="font-size:8px;color:rgba(255,255,255,0.2)" class="mono">Recent</span>
        <div style="width:8px;height:8px;border-radius:2px;background:#F97316;box-shadow:0 0 4px #F97316"></div>
        <span style="font-size:8px;color:rgba(255,255,255,0.2)" class="mono">Today</span>
      </div>`;
    caption.textContent = "Your year, day by day. Each square is one day — watch them light up as time passes.";

  } else if (type === 'life') {
    const phases = [
      { label:'Childhood', range:[0,12], color:'#60A5FA' },
      { label:'Teenage', range:[12,18], color:'#A78BFA' },
      { label:'Young Adult', range:[18,30], color:'#34D399' },
      { label:'Prime', range:[30,50], color:'#FBBF24' },
      { label:'Mature', range:[50,65], color:'#F97316' },
      { label:'Golden', range:[65,78], color:'#F472B6' },
    ];
    const age = 30;
    let cells = '';
    for (let y = 0; y < 78; y++) {
      const p = phases.find(ph => y >= ph.range[0] && y < ph.range[1]);
      const c = p ? p.color : '#666';
      const isLived = y < age;
      const isCur = y === age;
      const bg = isLived ? c : isCur ? c+'88' : 'rgba(255,255,255,0.04)';
      const op = isLived ? '0.85' : isCur ? '1' : '0.5';
      const shadow = isCur ? `box-shadow:0 0 6px ${c};` : '';
      cells += `<div class="showcase-life-cell" style="background:${bg};opacity:${op};${shadow}"></div>`;
    }
    let legend = phases.map(p => `<span style="display:inline-flex;align-items:center;gap:3px;margin-right:8px"><span style="display:inline-block;width:6px;height:6px;border-radius:2px;background:${p.color}"></span><span style="font-size:8px;color:rgba(255,255,255,0.3)">${p.label}</span></span>`).join('');

    content.innerHTML = `
      <div style="margin-bottom:16px;text-align:center">
        <span class="mono" style="font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:2px">YOUR LIFE</span>
        <div style="margin-top:6px"><span class="mono" style="font-size:32px;font-weight:700">${age}</span><span class="mono" style="font-size:14px;color:rgba(255,255,255,0.3)"> / 78 years</span></div>
      </div>
      <div class="showcase-life-grid">${cells}</div>
      <div style="text-align:center;margin-top:10px">${legend}</div>`;
    caption.textContent = "Each box is one year of your life. The glowing one? That's where you are right now.";

  } else if (type === 'today') {
    const now = new Date();
    const h = now.getHours();
    const hrs = Array.from({length:24}, (_,i) => {
      const isCur = i === h;
      const isPast = i < h;
      const isSleep = i >= 23 || i < 6;
      let bg = 'rgba(255,255,255,0.04)';
      if (isCur) bg = '#F97316';
      else if (isPast && isSleep) bg = '#4338CA';
      else if (isPast) bg = i < 12 ? '#F97316' : i < 18 ? '#22c55e' : '#8B5CF6';
      const op = isCur ? '1' : isPast ? '0.5' : isSleep ? '0.25' : '0.4';
      const shadow = isCur ? 'box-shadow:0 0 6px #F97316;border:1px solid rgba(249,115,22,0.4);' : '';
      const label = isSleep && !isCur ? '💤' : (i > 12 ? i-12 : i===0 ? 12 : i) + (i<12?'a':'p');
      return `<div style="flex:1;height:24px;border-radius:3px;background:${bg};opacity:${op};${shadow}display:flex;align-items:center;justify-content:center;font-size:7px;color:rgba(255,255,255,${isCur?'1':'0.4'});font-family:'JetBrains Mono',monospace;font-weight:${isCur?'700':'400'}">${isSleep && !isCur ? '<span style="font-size:7px">💤</span>' : label}</div>`;
    });
    const row1 = hrs.slice(0,6).join('');
    const row2 = hrs.slice(6,12).join('');
    const row3 = hrs.slice(12,18).join('');
    const row4 = hrs.slice(18,24).join('');

    content.innerHTML = `
      <div style="margin-bottom:16px;text-align:center">
        <span class="mono" style="font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:2px">TODAY</span>
        <div style="margin-top:6px"><span class="mono" style="font-size:28px;font-weight:700">${h}</span><span class="mono" style="font-size:14px;color:rgba(255,255,255,0.3)"> / 24 hours</span></div>
      </div>
      <div style="padding:8px">
        <div style="display:flex;gap:2px;margin-bottom:3px;align-items:center"><span style="font-size:7px;width:28px;color:rgba(255,255,255,0.2)" class="mono">🌙</span><div style="display:flex;gap:2px;flex:1">${row1}</div></div>
        <div style="display:flex;gap:2px;margin-bottom:3px;align-items:center"><span style="font-size:7px;width:28px;color:rgba(255,255,255,0.2)" class="mono">🌅</span><div style="display:flex;gap:2px;flex:1">${row2}</div></div>
        <div style="display:flex;gap:2px;margin-bottom:3px;align-items:center"><span style="font-size:7px;width:28px;color:rgba(255,255,255,0.2)" class="mono">☀️</span><div style="display:flex;gap:2px;flex:1">${row3}</div></div>
        <div style="display:flex;gap:2px;align-items:center"><span style="font-size:7px;width:28px;color:rgba(255,255,255,0.2)" class="mono">🌆</span><div style="display:flex;gap:2px;flex:1">${row4}</div></div>
      </div>`;
    caption.textContent = "24 hours, laid out. The glowing block is right now. Sleep hours are dimmed.";
  }
}

// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});

// Init
updatePhone();
buildPhoneHeatmap();
setInterval(updatePhone, 1000);

// Showcase init
const now = new Date();
const ys = new Date(now.getFullYear(), 0, 1);
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const daysPassed = Math.round((today - ys) / 86400000) + 1;
document.getElementById('showcaseDays').textContent = daysPassed;

let grid = '';
for (let i = 0; i < 182; i++) {
  const isToday = i === daysPassed - 1;
  const isPast = i < daysPassed;
  let bg = 'rgba(255,255,255,0.04)';
  if (isToday) bg = '#F97316';
  else if (isPast) {
    const r = (i + 1) / daysPassed;
    bg = r > 0.8 ? '#22c55e' : r > 0.5 ? '#16a34a' : r > 0.3 ? '#15803d' : '#166534';
  }
  const shadow = isToday ? 'box-shadow:0 0 4px #F97316;' : '';
  grid += `<div class="showcase-heatmap-cell" style="background:${bg};${shadow}"></div>`;
}
document.getElementById('showcaseGrid').innerHTML = grid;
</script>

</body>
</html>