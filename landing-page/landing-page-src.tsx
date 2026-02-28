< !DOCTYPE html >
  <html lang="en">
    <head>
      <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Finite — Your time is counting</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
            <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
              <style>
                :root {
                  --bg: #0A0A0F;
                --surface: rgba(255,255,255,0.03);
                --border: rgba(255,255,255,0.06);
                --text: #fff;
                --muted: rgba(255,255,255,0.5);
                --dim: rgba(255,255,255,0.2);
                --orange: #F97316;
                --orange-dark: #EA580C;
                --red: #EF4444;
                --green: #22C55E;
  }
                * {margin: 0; padding: 0; box-sizing: border-box; }
                html {scroll - behavior: smooth; }
                body {
                  background: var(--bg); color: var(--text);
                font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased;
                overflow-x: hidden;
  }
                ::selection {background: rgba(249,115,22,0.3); }

                /* NAV */
                nav {
                  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                padding: 14px 24px; background: rgba(10,10,15,0.85);
                backdrop-filter: blur(20px); border-bottom: 1px solid var(--border);
                display: flex; align-items: center; justify-content: space-between;
  }
                .nav-logo {font - size: 20px; font-weight: 800; color: var(--orange); text-decoration: none; letter-spacing: -0.5px; }
                .nav-links {display: flex; gap: 24px; align-items: center; }
                .nav-links a {font - size: 14px; color: var(--muted); text-decoration: none; transition: color 0.2s; }
                .nav-links a:hover {color: var(--text); }
                .nav-cta {
                  padding: 8px 20px; border-radius: 8px; border: none;
                background: var(--orange); color: #fff; font-family: 'Outfit'; font-size: 14px;
                font-weight: 600; cursor: pointer; text-decoration: none; transition: opacity 0.2s;
  }
                .nav-cta:hover {opacity: 0.9; }

                /* HERO */
                .hero {
                  min - height: 100vh; display: flex; flex-direction: column;
                align-items: center; justify-content: center; text-align: center;
                padding: 120px 24px 80px; position: relative;
  }
                .hero-glow {
                  position: absolute; top: -250px; left: 50%; transform: translateX(-50%);
                width: 900px; height: 900px; border-radius: 50%;
                background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 50%);
                pointer-events: none;
  }
                .hero-label {
                  font - family: 'JetBrains Mono', monospace; font-size: 12px;
                color: var(--orange); letter-spacing: 3px; text-transform: uppercase;
                margin-bottom: 24px; padding: 6px 16px; border-radius: 20px;
                border: 1px solid rgba(249,115,22,0.2); background: rgba(249,115,22,0.05);
                position: relative;
  }
                .hero-number {
                  font - family: 'Outfit', sans-serif; font-size: clamp(64px, 12vw, 110px);
                font-weight: 800; color: var(--text); letter-spacing: -4px;
                line-height: 1; position: relative;
  }
                .hero-number-label {
                  font - family: 'JetBrains Mono', monospace; font-size: 15px;
                color: var(--dim); margin: 10px 0 24px; position: relative;
  }
                .hero-bar {width: 180px; height: 4px; border-radius: 99px; background: rgba(255,255,255,0.04); margin: 0 auto 10px; overflow: hidden; position: relative; }
                .hero-bar-fill {width: 41.5%; height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--orange), var(--red)); }
                .hero-bar-label {font - family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.1); margin-bottom: 36px; position: relative; }
                .hero h1 {
                  font - size: clamp(36px, 6vw, 60px); font-weight: 800;
                line-height: 1.1; letter-spacing: -2px; margin-bottom: 18px;
                max-width: 650px; position: relative;
  }
                .hero h1 .accent {color: var(--orange); }
                .hero-sub {
                  font - size: 17px; color: var(--muted); line-height: 1.6;
                max-width: 460px; margin-bottom: 36px; position: relative;
  }
                .hero-cta {
                  display: inline-flex; padding: 16px 40px; border-radius: 14px; border: none;
                background: linear-gradient(135deg, var(--orange), var(--orange-dark));
                color: #fff; font-family: 'Outfit'; font-size: 17px; font-weight: 700;
                cursor: pointer; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 0 30px rgba(249,115,22,0.15); position: relative;
  }
                .hero-cta:hover {transform: translateY(-2px); box-shadow: 0 0 50px rgba(249,115,22,0.25); }
                .hero-store {margin - top: 14px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--dim); position: relative; }

                /* SECTIONS */
                section {padding: 90px 24px; max-width: 960px; margin: 0 auto; }
                .section-label {
                  font - family: 'JetBrains Mono', monospace; font-size: 12px;
                color: var(--orange); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;
  }
                .section-title {font - size: clamp(26px, 4.5vw, 38px); font-weight: 700; line-height: 1.2; margin-bottom: 14px; letter-spacing: -1px; }
                .section-desc {font - size: 16px; color: var(--muted); line-height: 1.6; max-width: 520px; margin-bottom: 48px; }

                /* SCREENSHOTS */
                .screenshots-wrap {padding: 60px 0; max-width: 100%; overflow: hidden; }
                .screenshots {
                  display: flex; gap: 20px; padding: 0 24px 20px; overflow-x: auto;
                scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
                max-width: 960px; margin: 0 auto;
  }
                .screenshots::-webkit-scrollbar {height: 0; }
                .screenshot-item {
                  flex - shrink: 0; width: 200px; border-radius: 24px; overflow: hidden;
                border: 1px solid var(--border); scroll-snap-align: start;
                background: #111; box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                transition: transform 0.3s;
  }
                .screenshot-item:hover {transform: translateY(-4px); }
                .screenshot-item img {width: 100%; height: auto; display: block; }
                .screenshot-label {
                  text - align: center; padding: 10px 0 14px;
                font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--dim);
  }

                /* FEATURES */
                .features-grid {display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
                .feature-card {
                  padding: 26px 22px; border-radius: 16px;
                background: var(--surface); border: 1px solid var(--border);
                transition: border-color 0.2s;
  }
                .feature-card:hover {border - color: rgba(249,115,22,0.15); }
                .feature-icon {font - size: 26px; margin-bottom: 12px; display: block; }
                .feature-card h3 {font - size: 16px; font-weight: 700; margin-bottom: 6px; }
                .feature-card p {font - size: 13px; color: var(--muted); line-height: 1.5; }

                /* PRICING */
                .pricing-grid {display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
                .pricing-card {
                  padding: 26px 20px; border-radius: 16px;
                background: var(--surface); border: 1px solid var(--border);
                position: relative; text-align: center;
  }
                .pricing-card.featured {
                  border - color: rgba(249,115,22,0.4);
                background: linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02));
  }
                .pricing-badge {
                  position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
                padding: 3px 12px; border-radius: 6px;
                background: linear-gradient(135deg, var(--orange), var(--orange-dark));
                font-family: 'JetBrains Mono', monospace; font-size: 9px;
                font-weight: 700; color: #fff; letter-spacing: 0.5px; white-space: nowrap;
  }
                .pricing-name {font - size: 15px; font-weight: 600; color: var(--muted); margin-bottom: 8px; }
                .pricing-price {font - size: 32px; font-weight: 800; margin-bottom: 4px; }
                .pricing-unit {font - family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--dim); margin-bottom: 14px; }
                .pricing-detail {font - family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--dim); line-height: 1.8; }
                .pricing-trial {
                  display: inline-block; margin-top: 10px; padding: 3px 10px; border-radius: 6px;
                background: rgba(249,115,22,0.08); font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600; color: var(--orange);
  }
                .pricing-save {
                  display: inline-block; margin-top: 8px; padding: 3px 10px; border-radius: 6px;
                background: rgba(34,197,94,0.08); font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600; color: var(--green);
  }

                /* QUOTE SECTION */
                .quote-section {
                  padding: 80px 24px; text-align: center;
                border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  }
                .quote-text {
                  font - size: clamp(22px, 4vw, 32px); font-weight: 300; color: var(--muted);
                max-width: 600px; margin: 0 auto; line-height: 1.5;
  }
                .quote-text strong {color: var(--orange); font-weight: 700; }

                /* LEGAL */
                .legal-section {padding: 80px 24px; max-width: 760px; margin: 0 auto; }
                .legal-section h2 {font - size: 28px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.5px; }
                .legal-updated {font - family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--dim); margin-bottom: 28px; }
                .legal-section h3 {font - size: 17px; font-weight: 700; margin-top: 28px; margin-bottom: 10px; color: var(--text); }
                .legal-section p, .legal-section li {font - size: 14px; color: var(--muted); line-height: 1.7; margin-bottom: 10px; }
                .legal-section ul {padding - left: 20px; margin-bottom: 14px; }
                .legal-section li {margin - bottom: 6px; }
                .legal-section a {color: var(--orange); text-decoration: underline; text-underline-offset: 3px; }
                .legal-divider {width: 100%; max-width: 760px; height: 1px; background: var(--border); margin: 0 auto; }

                /* FOOTER */
                footer {padding: 40px 24px 60px; text-align: center; border-top: 1px solid var(--border); }
                .footer-logo {font - size: 18px; font-weight: 800; color: var(--orange); margin-bottom: 16px; }
                .footer-links {display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
                .footer-links a {font - size: 13px; color: var(--dim); text-decoration: none; transition: color 0.2s; }
                .footer-links a:hover {color: var(--muted); }
                .footer-copy {font - family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.08); }

                /* RESPONSIVE */
                @media (max-width: 768px) {
    .nav - links a:not(.nav-cta) {display: none; }
                .features-grid {grid - template - columns: 1fr; }
                .pricing-grid {grid - template - columns: 1fr 1fr; }
                .screenshot-item {width: 170px; }
  }
                @media (max-width: 480px) {
    .pricing - grid {grid - template - columns: 1fr; max-width: 300px; margin: 0 auto; }
                nav {padding: 12px 16px; }
  }
              </style>
            </head>
            <body>

              <!-- NAV -->
              <nav>
                <a href="#" class="nav-logo">Finite</a>
                <div class="nav-links">
                  <a href="#features">Features</a>
                  <a href="#pricing">Pricing</a>
                  <a href="#terms">Terms</a>
                  <a href="#privacy">Privacy</a>
                  <a href="#" class="nav-cta">Download</a>
                </div>
              </nav>

              <!-- HERO -->
              <div class="hero">
                <div class="hero-glow"></div>
                <div class="hero-label">Time awareness app</div>
                <div class="hero-number">16,060</div>
                <div class="hero-number-label">days left in your life</div>
                <div class="hero-bar"><div class="hero-bar-fill"></div></div>
                <div class="hero-bar-label">41.5% gone</div>
                <h1>Your time is <span class="accent">finite</span>.<br>Start acting like it.</h1>
                <p class="hero-sub">Not another clock app. Finite shows you how much time you actually have — today, this year, and in your entire life. So you spend it on what matters.</p>
                <a href="#" class="hero-cta">Download for iOS</a>
                <p class="hero-store">Free on the App Store · Premium available</p>
              </div>

              <!-- SCREENSHOTS -->
              <div class="screenshots-wrap">
                <div class="screenshots">
                  <div class="screenshot-item">
                    <img src="screen-today.png" alt="Today — day countdown, awake time, week and month progress">
                      <div class="screenshot-label">Today</div>
                  </div>
                  <div class="screenshot-item">
                    <img src="screen-year.png" alt="Year — 365 day heatmap and monthly progress cards">
                      <div class="screenshot-label">Year</div>
                  </div>
                  <div class="screenshot-item">
                    <img src="screen-events.png" alt="Events — countdown to deadlines and milestones">
                      <div class="screenshot-label">Events</div>
                  </div>
                  <div class="screenshot-item">
                    <img src="screen-life.png" alt="Life — your entire life mapped in phases">
                      <div class="screenshot-label">Life</div>
                  </div>
                  <div class="screenshot-item">
                    <img src="screen-settings.png" alt="Settings — birth year, sleep schedule, life expectancy">
                      <div class="screenshot-label">Settings</div>
                  </div>
                </div>
              </div>

              <!-- QUOTE -->
              <div class="quote-section">
                <p class="quote-text">You're not buying an app.<br><strong>You're buying the clock that reminds you to live.</strong></p>
              </div>

              <!-- FEATURES -->
              <section id="features">
                <div class="section-label">Features</div>
                <h2 class="section-title">Every scale of time,<br>one honest look.</h2>
                <p class="section-desc">From the hours left today to the years left in your life. Finite makes time awareness feel real — not abstract.</p>
                <div class="features-grid">
                  <div class="feature-card">
                    <span class="feature-icon">⏰</span>
                    <h3>Day Countdown</h3>
                    <p>Hours, minutes, seconds remaining in your day. A live clock that drains as time passes.</p>
                  </div>
                  <div class="feature-card">
                    <span class="feature-icon">💤</span>
                    <h3>Awake Hours</h3>
                    <p>Based on your sleep schedule — how many waking hours you actually have left today.</p>
                  </div>
                  <div class="feature-card">
                    <span class="feature-icon">📅</span>
                    <h3>Week · Month · Year</h3>
                    <p>Progress bars for every time scale. 82.3% of your week gone. 99.15% of your month. Numbers that make you think.</p>
                  </div>
                  <div class="feature-card">
                    <span class="feature-icon">🟢</span>
                    <h3>Year Heatmap</h3>
                    <p>365 dots. One for every day. Watch the year fill up day by day. Months labeled, today glowing.</p>
                  </div>
                  <div class="feature-card">
                    <span class="feature-icon">⏳</span>
                    <h3>Event Countdowns</h3>
                    <p>Track deadlines, birthdays, trips. Color-coded cards with progress showing how close each event is.</p>
                  </div>
                  <div class="feature-card">
                    <span class="feature-icon">🔥</span>
                    <h3>Life Map</h3>
                    <p>Your entire life in phases — Childhood to Golden Years. Every year as a colored block. See how much is left.</p>
                  </div>
                </div>
              </section>

              <!-- PRICING -->
              <section id="pricing">
                <div class="section-label">Pricing</div>
                <h2 class="section-title">Simple, honest pricing.</h2>
                <p class="section-desc">The core experience is free. Premium unlocks your full life view, unlimited countdowns, lifetime stats, and home screen widgets.</p>
                <div class="pricing-grid">
                  <div class="pricing-card">
                    <div class="pricing-name">Free</div>
                    <div class="pricing-price">$0</div>
                    <div class="pricing-unit">forever</div>
                    <div class="pricing-detail">Day countdown<br>Week / Month / Year<br>Year heatmap<br>3 event countdowns</div>
                    </div>
                      <div class="pricing-card featured">
                        <div class="pricing-badge">MOST POPULAR</div>
                        <div class="pricing-name">Yearly</div>
                        <div class="pricing-price">$7.99</div>
                        <div class="pricing-unit">per year</div>
                        <div class="pricing-detail">Everything in Free, plus:<br>Life Map · Unlimited events<br>Stats · Widgets · Seconds</div>
                          <div class="pricing-save">Save 67%</div>
                          <div class="pricing-trial">7 days free</div>
                        </div>
                        <div class="pricing-card">
                          <div class="pricing-name">Monthly</div>
                          <div class="pricing-price">$1.99</div>
                          <div class="pricing-unit">per month</div>
                          <div class="pricing-detail">All premium features<br>Cancel anytime</div>
                          <div class="pricing-trial">3 days free</div>
                        </div>
                        <div class="pricing-card">
                          <div class="pricing-name">Lifetime</div>
                          <div class="pricing-price">$9.99</div>
                          <div class="pricing-unit">one-time</div>
                          <div class="pricing-detail">All premium features<br>Pay once, keep forever</div>
                        </div>
                      </div>
                    </section>

                      <!-- ============================================================ -->
                      <!-- TERMS OF SERVICE -->
                      <!-- ============================================================ -->
                      <div class="legal-divider"></div>
                      <div class="legal-section" id="terms">
                        <h2>Terms of Service</h2>
                        <p class="legal-updated">Last updated: February 28, 2026</p>

                        <p>By downloading, installing, or using the Finite application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the App.</p>

                        <h3>1. Description of Service</h3>
                        <p>Finite is a time awareness application that displays countdowns and progress indicators based on user-provided data (birth year, life expectancy, sleep schedule). The App is for personal, informational, and motivational purposes only.</p>

                        <h3>2. Eligibility</h3>
                        <p>You must be at least 13 years old to use this App. If you are under 18, you must have consent from a parent or legal guardian.</p>

                        <h3>3. User Accounts</h3>
                        <p>Finite does not require account creation. All personal data (birth year, sleep schedule, events) is stored locally on your device unless you opt in to iCloud sync.</p>

                        <h3>4. Subscriptions and In-App Purchases</h3>
                        <p>Finite offers free and premium tiers. Premium features are available through auto-renewable subscriptions and a one-time lifetime purchase, processed entirely through Apple's App Store.</p>

                        <p><strong>Subscription Plans:</strong></p>
                        <ul>
                          <li><strong>Monthly:</strong> $1.99 USD per month, with a 3-day free trial for first-time subscribers.</li>
                          <li><strong>Yearly:</strong> $7.99 USD per year, with a 7-day free trial for first-time subscribers.</li>
                          <li><strong>Lifetime:</strong> $9.99 USD one-time purchase (non-subscription, no trial).</li>
                        </ul>

                        <p><strong>Billing and Renewal:</strong></p>
                        <ul>
                          <li>Payment is charged to your Apple ID account at confirmation of purchase.</li>
                          <li>Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current billing period.</li>
                          <li>Your account will be charged for renewal within 24 hours prior to the end of the current period at the rate of the selected plan.</li>
                          <li>Prices are in USD and may vary by country based on App Store regional pricing.</li>
                        </ul>

                        <p><strong>Free Trials:</strong></p>
                        <ul>
                          <li>Free trial periods are offered to first-time subscribers only.</li>
                          <li>If you do not cancel before the free trial ends, your subscription will automatically convert to a paid subscription and your Apple ID account will be charged.</li>
                          <li>Any unused portion of a free trial period will be forfeited when you purchase a subscription.</li>
                        </ul>

                        <p><strong>Managing and Cancelling Subscriptions:</strong></p>
                        <ul>
                          <li>You can manage or cancel your subscription at any time through your device's <strong>Settings → Apple ID → Subscriptions</strong>.</li>
                          <li>Cancellation takes effect at the end of the current billing period. You retain access to premium features until the end of your paid period.</li>
                          <li>Deleting the App does not cancel your subscription. You must cancel through your Apple ID settings.</li>
                        </ul>

                        <p><strong>Refunds:</strong></p>
                        <p>All purchases and subscriptions are processed by Apple. Refund requests must be submitted through Apple at <a href="https://reportaproblem.apple.com" target="_blank">reportaproblem.apple.com</a>. We do not process refunds directly.</p>

                        <h3>5. Acceptable Use</h3>
                        <p>You agree not to:</p>
                        <ul>
                          <li>Reverse-engineer, decompile, or disassemble the App.</li>
                          <li>Use the App for any unlawful purpose.</li>
                          <li>Attempt unauthorized access to any part of the App or its related systems.</li>
                          <li>Redistribute, sublicense, or resell access to the App.</li>
                        </ul>

                        <h3>6. Intellectual Property</h3>
                        <p>All content, design, code, graphics, and trademarks within the App are owned by Finite and protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the App for personal, non-commercial purposes.</p>

                        <h3>7. Health Disclaimer</h3>
                        <p>Finite's life countdown and life expectancy features are based on general statistical averages and user-provided data. They are <strong>not</strong> medical predictions, health assessments, or guarantees of lifespan. The App is intended for motivational purposes only and should not be interpreted as medical or health advice. Consult a qualified healthcare professional for health-related concerns.</p>

                        <h3>8. Disclaimer of Warranties</h3>
                        <p>The App is provided "as is" and "as available" without warranties of any kind, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the App will be uninterrupted, error-free, or free of harmful components.</p>

                        <h3>9. Limitation of Liability</h3>
                        <p>To the maximum extent permitted by law, Finite and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, use, or profits arising from your use of the App.</p>

                        <h3>10. Changes to Terms</h3>
                        <p>We may update these Terms from time to time. Changes will be reflected by updating the "Last updated" date. Continued use of the App after changes constitutes acceptance of the updated Terms.</p>

                        <h3>11. Governing Law</h3>
                        <p>These Terms shall be governed by and construed in accordance with the laws of Vietnam.</p>

                        <h3>12. Contact</h3>
                        <p>For questions about these Terms: <a href="mailto:support@finitetime.app">support@finitetime.app</a></p>
                      </div>

                      <!-- ============================================================ -->
                      <!-- PRIVACY POLICY -->
                      <!-- ============================================================ -->
                      <div class="legal-divider"></div>
                      <div class="legal-section" id="privacy">
                        <h2>Privacy Policy</h2>
                        <p class="legal-updated">Last updated: February 28, 2026</p>

                        <p>Your privacy is fundamental to Finite. This policy explains how we collect, use, and protect your information.</p>

                        <h3>1. Information We Collect</h3>

                        <p><strong>Information you provide:</strong></p>
                        <ul>
                          <li><strong>Profile data:</strong> Name (optional), birth year, life expectancy preference.</li>
                          <li><strong>Sleep schedule:</strong> Bedtime and wake-up time.</li>
                          <li><strong>Events:</strong> Event names, dates, and display colors you create.</li>
                        </ul>

                        <p><strong>Information collected automatically:</strong></p>
                        <ul>
                          <li><strong>Device info:</strong> Device model, OS version, app version — used only for crash reporting and compatibility.</li>
                          <li><strong>Anonymized analytics:</strong> Feature usage data that cannot be used to identify you personally, used solely to improve the App.</li>
                        </ul>

                        <p><strong>Information we do NOT collect:</strong></p>
                        <ul>
                          <li>We do not collect your email address, phone number, or any government-issued identification.</li>
                          <li>We do not collect location data.</li>
                          <li>We do not collect health or medical data.</li>
                          <li>We do not access your contacts, photos, camera, or microphone.</li>
                        </ul>

                        <h3>2. Data Storage</h3>
                        <p>All personal data you enter into Finite is stored <strong>locally on your device</strong>. We do not transmit your personal content to any external servers.</p>
                        <p>If you enable iCloud sync, your data is synced via Apple's iCloud infrastructure, governed by <a href="https://www.apple.com/legal/privacy/" target="_blank">Apple's Privacy Policy</a>. We do not have access to your iCloud data.</p>

                        <h3>3. How We Use Information</h3>
                        <ul>
                          <li>Provide app functionality — displaying countdowns and progress based on your settings.</li>
                          <li>Improve the App through anonymized usage analytics.</li>
                          <li>Diagnose and fix technical issues through crash reports.</li>
                        </ul>

                        <h3>4. Third-Party Services</h3>
                        <ul>
                          <li><strong>Apple App Store:</strong> Payment processing for subscriptions and purchases. Governed by <a href="https://www.apple.com/legal/internet-services/itunes/" target="_blank">Apple's Terms</a>.</li>
                          <li><strong>Apple Analytics:</strong> Anonymized app performance data through App Store Connect.</li>
                          <li><strong>RevenueCat (if applicable):</strong> Subscription management service. Processes transaction data only. See <a href="https://www.revenuecat.com/privacy" target="_blank">RevenueCat Privacy Policy</a>.</li>
                        </ul>
                        <p>We do <strong>not</strong> sell, rent, or share your personal data with third parties for advertising or marketing.</p>

                        <h3>5. Data Retention</h3>
                        <p>Your data is stored locally on your device and persists as long as the App is installed. Deleting the App removes all locally stored data. Anonymized analytics may be retained for up to 24 months.</p>

                        <h3>6. Children's Privacy</h3>
                        <p>Finite is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal information, contact us and we will delete it.</p>

                        <h3>7. Your Rights</h3>
                        <ul>
                          <li><strong>Access:</strong> Request a copy of data we hold about you.</li>
                          <li><strong>Deletion:</strong> Delete your data by removing the App from your device.</li>
                          <li><strong>Opt out:</strong> Disable analytics sharing via your device's Settings → Privacy → Analytics.</li>
                        </ul>

                        <h3>8. Security</h3>
                        <p>Local data is protected by your device's built-in security (passcode, Face ID, Touch ID). No method of electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

                        <h3>9. International Users</h3>
                        <p>Finite is available worldwide. Anonymized analytics may be processed in countries with different data protection laws than your own.</p>

                        <h3>10. Changes to This Policy</h3>
                        <p>We may update this policy from time to time. Changes will be reflected by updating the "Last updated" date. Continued use constitutes acceptance.</p>

                        <h3>11. Contact</h3>
                        <p>For privacy questions or data rights requests: <a href="mailto:privacy@finitetime.app">privacy@finitetime.app</a></p>
                      </div>

                      <!-- FOOTER -->
                      <footer>
                        <div class="footer-logo">Finite</div>
                        <div class="footer-links">
                          <a href="#features">Features</a>
                          <a href="#pricing">Pricing</a>
                          <a href="#terms">Terms of Service</a>
                          <a href="#privacy">Privacy Policy</a>
                          <a href="mailto:support@finitetime.app">Contact</a>
                        </div>
                        <p class="footer-copy">© 2026 Finite. All rights reserved.</p>
                      </footer>

                    </body>
                  </html>