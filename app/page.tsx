import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const INTEGRATIONS = [
  { name: "Slack", icon: "💬", category: "Messaging" },
  { name: "GitHub", icon: "⚡", category: "Dev Tools" },
  { name: "Google Workspace", icon: "◈", category: "Productivity" },
  { name: "Notion", icon: "◻", category: "Knowledge" },
  { name: "Discord", icon: "◉", category: "Community" },
  { name: "Linear", icon: "◈", category: "Project" },
  { name: "Jira", icon: "◆", category: "Project" },
  { name: "Salesforce", icon: "◉", category: "CRM" },
];

const FEATURES = [
  {
    num: "01",
    title: "Universal Connectivity",
    body: "Connect any app through a unified protocol. 250+ native integrations with structured action schemas.",
  },
  {
    num: "02",
    title: "OAuth2 Orchestration",
    body: "Enterprise-grade auth flows handled automatically. Tokens refreshed, scopes managed, credentials secured.",
  },
  {
    num: "03",
    title: "Agent-Native API",
    body: "Designed from the ground up for LLM tool use. Function schemas, typed outputs, structured error handling.",
  },
];

export default function SquidLanding() {

  return (
    <div
      style={{
        fontFamily: '"DM Sans", system-ui, sans-serif',
        background: "#050505",
        color: "#e8e8e8",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::selection { background: #0ff3; color: #fff; }

        /* Hero */
        .hero {
          padding: 160px 48px 120px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .hero-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 400;
          color: #00ffcc;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hero-eyebrow::before {
          content: '';
          width: 32px;
          height: 1px;
          background: #00ffcc;
        }

        .hero-headline {
          font-size: clamp(48px, 7vw, 96px);
          font-weight: 200;
          line-height: 1.0;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 20px;
          max-width: 800px;
        }

        .hero-headline em {
          font-style: italic;
          font-weight: 300;
          color: #00ffcc;
        }

        .hero-sub {
          font-size: 16px;
          font-weight: 300;
          color: #666;
          line-height: 1.7;
          max-width: 480px;
          margin-bottom: 56px;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-primary {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #050505;
          background: #00ffcc;
          padding: 14px 32px;
          border-radius: 2px;
          text-decoration: none;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .btn-primary:hover { 
          opacity: 0.88; 
          transform: translateY(-1px); 
        }

        .btn-primary svg {
          transition: transform 0.2s ease;
        }

        .btn-primary:hover svg {
          transform: translateX(2px);
        }

        .btn-ghost {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: #666;
          background: transparent;
          border: 1px solid #222;
          padding: 14px 32px;
          border-radius: 2px;
          text-decoration: none;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .btn-ghost:hover { 
          border-color: #555; 
          color: #e8e8e8; 
        }

        .btn-ghost svg {
          transition: transform 0.2s ease;
        }

        .btn-ghost:hover svg {
          transform: translateX(2px) translateY(-2px) scale(1.15);
        }

        /* Grid bg */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(#ffffff04 1px, transparent 1px),
            linear-gradient(90deg, #ffffff04 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        /* Stats bar */
        .stats-bar {
          border-top: 1px solid #111;
          border-bottom: 1px solid #111;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .stat-item {
          padding: 40px 48px;
          position: relative;
        }

        .stat-item + .stat-item {
          border-left: 1px solid #111;
        }

        .stat-num {
          font-family: 'DM Mono', monospace;
          font-size: 48px;
          font-weight: 300;
          color: #fff;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-num span {
          color: #00ffcc;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 400;
          color: #444;
          letter-spacing: 0.02em;
        }

        /* Features */
        .section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 48px;
        }

        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #333;
          margin-bottom: 64px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #111;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid #111;
        }

        .feature-card {
          padding: 48px;
          border-right: 1px solid #111;
          transition: background 0.2s;
          cursor: default;
        }

        .feature-card:last-child { border-right: none; }

        .feature-card:hover { background: #0a0a0a; }

        .feature-num {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #00ffcc;
          letter-spacing: 0.1em;
          margin-bottom: 32px;
        }

        .feature-title {
          font-size: 20px;
          font-weight: 300;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .feature-body {
          font-size: 14px;
          color: #444;
          line-height: 1.7;
          font-weight: 300;
        }

        /* Code block section */
        .code-section {
          border-top: 1px solid #111;
          border-bottom: 1px solid #111;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .code-left {
          padding: 80px 48px;
          border-right: 1px solid #111;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .code-headline {
          font-size: 36px;
          font-weight: 200;
          letter-spacing: -0.03em;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .code-body {
          font-size: 14px;
          color: #444;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .capability-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .capability-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          font-size: 14px;
          color: #555;
          line-height: 1.5;
        }

        .capability-item::before {
          content: '';
          width: 4px;
          height: 4px;
          background: #00ffcc;
          border-radius: 50%;
          margin-top: 8px;
          flex-shrink: 0;
        }

        .code-right {
          padding: 48px;
          display: flex;
          align-items: center;
          background: #030303;
        }

        .code-block {
          font-family: 'DM Mono', monospace;
          font-size: 12.5px;
          line-height: 2;
          width: 100%;
        }

        .code-comment { color: #333; }
        .code-keyword { color: #00ffcc; }
        .code-string { color: #888; }
        .code-fn { color: #7eb8ff; }
        .code-var { color: #e8e8e8; }
        .code-bracket { color: #444; }

        /* Integrations */
        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid #111;
          margin-top: 0;
        }

        .integration-card {
          padding: 32px;
          border-right: 1px solid #111;
          border-bottom: 1px solid #111;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: background 0.2s;
          cursor: default;
        }

        .integration-card:hover { background: #0a0a0a; }
        .integration-card:nth-child(4n) { border-right: none; }
        .integration-card:nth-last-child(-n+4) { border-bottom: none; }

        .int-category {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #333;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .int-name {
          font-size: 15px;
          font-weight: 400;
          color: #888;
          transition: color 0.15s;
        }

        .integration-card:hover .int-name { color: #e8e8e8; }

        .int-arrow {
          font-size: 14px;
          color: #1a1a1a;
          margin-top: auto;
          transition: color 0.15s;
        }

        .integration-card:hover .int-arrow { color: #00ffcc; }

        /* CTA */
        .cta-section {
          border-top: 1px solid #111;
          padding: 120px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          gap: 80px;
        }

        .cta-left { flex: 1; }

        .cta-headline {
          font-size: clamp(32px, 4vw, 56px);
          font-weight: 200;
          letter-spacing: -0.04em;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .cta-sub {
          font-size: 14px;
          color: #444;
          line-height: 1.7;
        }

        .cta-right {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-shrink: 0;
        }

        /* Footer */
        .footer {
          border-top: 1px solid #0d0d0d;
          padding: 32px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-logo {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          color: #222;
          letter-spacing: -0.01em;
        }

        .footer-links {
          display: flex;
          gap: 32px;
        }

        .footer-link {
          font-size: 12px;
          color: #2a2a2a;
          text-decoration: none;
          transition: color 0.15s;
        }

        .footer-link:hover { color: #555; }

        .footer-right {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #1a1a1a;
          letter-spacing: 0.08em;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up { animation: fadeUp 0.8s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.25s; }
        .fade-up-3 { animation-delay: 0.4s; }
        .fade-up-4 { animation-delay: 0.55s; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .live-dot {
          width: 6px;
          height: 6px;
          background: #00ffcc;
          border-radius: 50%;
          display: inline-block;
          animation: pulse-dot 2s ease-in-out infinite;
        }
      `}</style>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div className="grid-bg" />
        <div
          className="glow-orb"
          style={{ width: 600, height: 600, background: "#00ffcc08", top: -100, right: -200 }}
        />
        <div
          className="glow-orb"
          style={{ width: 400, height: 400, background: "#0055ff06", bottom: -100, left: -100 }}
        />

        <div className="hero">
          <div className="hero-eyebrow fade-up fade-up-1">
            <span className="live-dot" style={{ marginRight: 4 }} />
            Powered by Composio · v2.4.1
          </div>
          <h1 className="hero-headline fade-up fade-up-2">
            Your AI agent,<br />
            <em>infinitely</em><br />
            connected.
          </h1>
          <p className="hero-sub fade-up fade-up-3">
            Squid gives AI agents structured access to every tool your team uses. 
            250+ integrations. One unified protocol.
          </p>
          <div className="hero-actions fade-up fade-up-4">
            <a href="/connections" className="btn-primary">
              START BUILDING
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/chat" className="btn-ghost">
              LIVE DEMO
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {[
          { num: "250", suffix: "+", label: "Native integrations" },
          { num: "99.9", suffix: "%", label: "Uptime SLA" },
          { num: "< 50", suffix: "ms", label: "Median tool latency" },
        ].map((s) => (
          <div className="stat-item" key={s.label}>
            <div className="stat-num">
              {s.num}<span>{s.suffix}</span>
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div className="section">
        <div className="section-label">Core capabilities</div>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.num}>
              <div className="feature-num">{f.num}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-body">{f.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CODE SECTION */}
      <div className="code-section">
        <div className="code-left">
          <h2 className="code-headline">
            Built for<br />
            how agents<br />
            actually work.
          </h2>
          <p className="code-body">
            Every integration exposes strongly-typed actions with JSON schemas. 
            No parsing. No guesswork. Just structured tool use.
          </p>
          <ul className="capability-list">
            <li className="capability-item">Automated token refresh &amp; credential rotation</li>
            <li className="capability-item">Real-time event triggers across all services</li>
            <li className="capability-item">OpenAI, Anthropic, and LangChain compatible</li>
            <li className="capability-item">Audit logging and per-action permissioning</li>
          </ul>
        </div>
        <div className="code-right">
          <pre className="code-block">
            <code>
              <span className="code-comment">{"// Connect Slack in 3 lines\n"}</span>
              <span className="code-keyword">import</span>
              <span className="code-var"> {"{ Squid }"} </span>
              <span className="code-keyword">from</span>
              <span className="code-string">&apos;@squid/sdk&apos;</span>
              {"\n\n"}
              <span className="code-keyword">const</span>
              <span className="code-var"> squid </span>
              <span className="code-bracket">= </span>
              <span className="code-keyword">new</span>
              <span className="code-fn"> Squid</span>
              <span className="code-bracket">{"({"}</span>
              {"\n"}
              {"  "}
              <span className="code-var">apiKey</span>
              <span className="code-bracket">: </span>
              <span className="code-string">process.env.SQUID_KEY</span>
              {"\n"}
              <span className="code-bracket">{"});"}</span>
              {"\n\n"}
              <span className="code-comment">{"// Execute any action\n"}</span>
              <span className="code-keyword">const</span>
              <span className="code-var"> result </span>
              <span className="code-bracket">= </span>
              <span className="code-keyword">await</span>
              <span className="code-var"> squid</span>
              <span className="code-bracket">.</span>
              <span className="code-fn">execute</span>
              <span className="code-bracket">{"({"}</span>
              {"\n"}
              {"  "}
              <span className="code-var">app</span>
              <span className="code-bracket">: </span>
              <span className="code-string">&apos;slack&apos;</span>
              <span className="code-bracket">,</span>
              {"\n"}
              {"  "}
              <span className="code-var">action</span>
              <span className="code-bracket">: </span>
              <span className="code-string">&apos;send_message&apos;</span>
              <span className="code-bracket">,</span>
              {"\n"}
              {"  "}
              <span className="code-var">params</span>
              <span className="code-bracket">: {"{ "}channel</span>
              <span className="code-bracket">: </span>
              <span className="code-string">&apos;#eng&apos;</span>
              <span className="code-bracket">{", text }"}</span>
              {"\n"}
              <span className="code-bracket">{"});"}</span>
              {"\n\n"}
              <span className="code-comment">{"// ✓ Authenticated. Typed. Done."}</span>
            </code>
          </pre>
        </div>
      </div>

      {/* INTEGRATIONS */}
      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="section-label">Integrations</div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 120px" }}>
        <div className="integrations-grid">
          {INTEGRATIONS.map((app) => (
            <div className="integration-card" key={app.name}>
              <div className="int-category">{app.category}</div>
              <div className="int-name">{app.name}</div>
              <div className="int-arrow"><ArrowRight className="w-4 h-4" /></div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            color: "#333",
            letterSpacing: "0.08em",
          }}
        >
          + 242 MORE INTEGRATIONS <ArrowRight className="w-3 h-3 inline" />
        </div>
      </div>

      {/* CTA */}
      <div style={{ borderTop: "1px solid #111" }}>
        <div className="cta-section">
          <div className="cta-left">
            <h2 className="cta-headline">
              Ship your first<br />
              AI workflow today.
            </h2>
            <p className="cta-sub">
              Free to start. No credit card. Full API access on day one.
            </p>
          </div>
          <div className="cta-right">
            <a href="/connections" className="btn-primary" style={{ textAlign: "center" }}>
              START BUILDING <ArrowRight className="w-4 h-4 inline" />
            </a>
            <a href="/chat" className="btn-ghost" style={{ textAlign: "center" }}>
              EXPLORE DEMO <ArrowUpRight className="w-3 h-3 inline" />
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">squid — by composio</div>
        <div className="footer-links">
          <a href="/connections" className="footer-link">Connections</a>
          <a href="/chat" className="footer-link">Chat Demo</a>
          <a href="#" className="footer-link">Docs</a>
          <a href="#" className="footer-link">Status</a>
        </div>
        <div className="footer-right">© 2026 SQUID</div>
      </footer>
    </div>
  );
}