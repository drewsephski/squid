/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { Plug, CheckCircle, XCircle, Shield } from "lucide-react";

type Toolkit = {
  slug: string;
  name: string;
  logo?: string;
  isConnected: boolean;
  connectedAccountId?: string;
};

export default function Dashboard() {
  const [toolkits, setToolkits] = useState<Toolkit[]>([]);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchConnections() {
    setLoading(true);
    try {
      const res = await fetch("/api/connections", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched toolkits:", data.toolkits.length);
      setToolkits(data.toolkits);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConnections();
  }, []);

  async function connect(slug: string) {
    setConnecting(slug);
    const res = await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolkit: slug }),
    });
    const { redirectUrl } = await res.json();
    window.location.href = redirectUrl;
  }

  async function disconnect(connectedAccountId: string) {
    setDisconnecting(connectedAccountId);
    await fetch("/api/connections/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connectedAccountId }),
    });
    await fetchConnections();
    setDisconnecting(null);
  }

  const connected = toolkits.filter((t) => t.isConnected);
  const available = toolkits.filter((t) => !t.isConnected);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@300;400;500&display=swap');

        .conn-root {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #050505;
          min-height: 100vh;
          color: #e8e8e8;
        }

        .conn-layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 48px 80px;
        }

        /* Header */
        .conn-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 40px;
          border-bottom: 1px solid #111;
          margin-bottom: 56px;
        }

        .conn-header-left h1 {
          font-size: 28px;
          font-weight: 200;
          letter-spacing: -0.04em;
          color: #fff;
          line-height: 1;
          margin-bottom: 8px;
        }

        .conn-header-left p {
          font-size: 13px;
          font-weight: 300;
          color: #3a3a3a;
          max-width: 420px;
          line-height: 1.6;
        }

        .conn-stats {
          display: flex;
          gap: 1px;
          border: 1px solid #111;
          border-radius: 2px;
          overflow: hidden;
        }

        .conn-stat {
          padding: 14px 24px;
          background: #080808;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          min-width: 100px;
        }

        .conn-stat + .conn-stat {
          border-left: 1px solid #111;
        }

        .conn-stat-num {
          font-family: 'DM Mono', monospace;
          font-size: 22px;
          font-weight: 300;
          color: #fff;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .conn-stat-num.accent { color: #00ffcc; }

        .conn-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #2a2a2a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Section label */
        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #2a2a2a;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #0d0d0d;
        }

        .section-label .section-count {
          color: #00ffcc;
          margin-left: -8px;
        }

        /* Grid */
        .conn-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid #111;
          margin-bottom: 48px;
        }

        @media (max-width: 1024px) {
          .conn-grid { grid-template-columns: repeat(3, 1fr); }
          .conn-layout { padding: 32px 24px 60px; }
          .conn-header { flex-direction: column; align-items: flex-start; gap: 24px; }
        }

        @media (max-width: 640px) {
          .conn-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Cards */
        .toolkit-card {
          position: relative;
          padding: 28px 24px;
          border-right: 1px solid #111;
          border-bottom: 1px solid #111;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: background 0.15s;
          cursor: default;
        }

        .toolkit-card:hover { background: #080808; }

        /* Remove right border on last in row — simplified: just let grid handle it */
        .toolkit-card:nth-child(4n) { border-right: none; }

        .toolkit-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .toolkit-logo-wrap {
          width: 44px;
          height: 44px;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080808;
          overflow: hidden;
          flex-shrink: 0;
        }

        .toolkit-logo-wrap img {
          width: 28px;
          height: 28px;
          object-fit: contain;
          border-radius: 2px;
        }

        .toolkit-logo-wrap.connected {
          border-color: #00ffcc22;
          background: #00ffcc08;
        }

        .toolkit-status-badge {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }

        .toolkit-status-badge.connected {
          color: #00ffcc;
          background: #00ffcc10;
          border: 1px solid #00ffcc22;
        }

        .toolkit-status-badge.available {
          color: #2a2a2a;
          background: transparent;
          border: 1px solid #141414;
        }

        .toolkit-status-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .toolkit-status-dot.connected {
          background: #00ffcc;
          animation: statusPulse 2.5s ease-in-out infinite;
        }

        .toolkit-status-dot.available { background: #2a2a2a; }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .toolkit-name {
          font-size: 14px;
          font-weight: 400;
          color: #888;
          letter-spacing: -0.01em;
          transition: color 0.15s;
        }

        .toolkit-card:hover .toolkit-name { color: #e8e8e8; }
        .toolkit-name.connected { color: #c8c8c8; }

        /* Buttons */
        .toolkit-btn {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          padding: 9px 14px;
          border-radius: 2px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.15s;
        }

        .toolkit-btn svg { width: 11px; height: 11px; flex-shrink: 0; }

        .toolkit-btn.connect {
          background: #00ffcc;
          color: #050505;
        }

        .toolkit-btn.connect:hover:not(:disabled) {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .toolkit-btn.connect:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .toolkit-btn.disconnect {
          background: transparent;
          color: #333;
          border: 1px solid #1a1a1a;
        }

        .toolkit-btn.disconnect:hover:not(:disabled) {
          border-color: #ff4444;
          color: #ff4444;
          background: #ff444408;
        }

        .toolkit-btn.disconnect:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Empty state */
        .conn-empty {
          border: 1px solid #0d0d0d;
          border-radius: 2px;
          padding: 80px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }

        .conn-empty-icon {
          width: 48px;
          height: 48px;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2a2a2a;
        }

        .conn-empty h3 {
          font-size: 16px;
          font-weight: 300;
          color: #444;
          letter-spacing: -0.02em;
        }

        .conn-empty p {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #222;
          letter-spacing: 0.06em;
          max-width: 360px;
          line-height: 1.8;
        }

        /* Loading skeleton */
        .toolkit-skeleton {
          padding: 28px 24px;
          border-right: 1px solid #111;
          border-bottom: 1px solid #111;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skeleton-bar {
          background: #0d0d0d;
          border-radius: 2px;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Security footer note */
        .security-note {
          display: flex;
          align-items: center;
          gap: 10px;
          border-top: 1px solid #0d0d0d;
          padding-top: 24px;
          margin-top: 8px;
        }

        .security-note svg {
          color: #00ffcc;
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }

        .security-note p {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #777;
          letter-spacing: 0.04em;
          line-height: 1.5;
        }
      `}</style>

      <main className="conn-root">
        <div className="conn-layout">

          {/* Header */}
          <div className="conn-header">
            <div className="conn-header-left">
              <h1>Connections</h1>
              <p>
                Connect your AI agent with {toolkits.length} available external services.
                OAuth2 credentials are encrypted and never stored in plaintext.
              </p>
            </div>
            <div className="conn-stats">
              <div className="conn-stat">
                <div className="conn-stat-num accent">{connected.length}</div>
                <div className="conn-stat-label">Active</div>
              </div>
              <div className="conn-stat">
                <div className="conn-stat-num">{toolkits.length}</div>
                <div className="conn-stat-label">Total</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="conn-empty">
              <div className="conn-empty-icon">
                <Plug size={20} />
              </div>
              <h3>Loading integrations...</h3>
              <p>
                Fetching all available Composio integrations.
              </p>
            </div>
          ) : toolkits.length === 0 ? (
            <div className="conn-empty">
              <div className="conn-empty-icon">
                <Plug size={20} />
              </div>
              <h3>No integrations available</h3>
              <p>
                Check back later or contact support
                if you think this is an error.
              </p>
            </div>
          ) : (
            <>
              {/* Connected */}
              {connected.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <div className="section-label">
                    Connected
                    <span className="section-count">({connected.length})</span>
                  </div>
                  <div className="conn-grid">
                    {connected.map((t) => (
                      <ToolkitCard
                        key={t.slug}
                        toolkit={t}
                        onConnect={connect}
                        onDisconnect={disconnect}
                        isConnecting={connecting === t.slug}
                        isDisconnecting={disconnecting === t.connectedAccountId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Available */}
              {available.length > 0 && (
                <div>
                  <div className="section-label">
                    Available
                    <span className="section-count">({available.length})</span>
                  </div>
                  <div className="conn-grid">
                    {available.map((t) => (
                      <ToolkitCard
                        key={t.slug}
                        toolkit={t}
                        onConnect={connect}
                        onDisconnect={disconnect}
                        isConnecting={connecting === t.slug}
                        isDisconnecting={disconnecting === t.connectedAccountId}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="security-note">
            <Shield />
            <p>
              All credentials are stored with AES-256 encryption via Composio&apos;s secure vault.
              Tokens are never logged or exposed to Squid&apos;s servers.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}

function ToolkitCard({
  toolkit: t,
  onConnect,
  onDisconnect,
  isConnecting,
  isDisconnecting,
}: {
  toolkit: Toolkit;
  onConnect: (slug: string) => void;
  onDisconnect: (id: string) => void;
  isConnecting: boolean;
  isDisconnecting: boolean;
}) {
  const busy = isConnecting || isDisconnecting;

  return (
    <div className="toolkit-card">
      <div className="toolkit-card-top">
        <div className={`toolkit-logo-wrap ${t.isConnected ? "connected" : ""}`}>
          {t.logo ? (
            <img src={t.logo} alt={t.name} />
          ) : (
            <Plug size={16} style={{ color: "#333" }} />
          )}
        </div>
        <div className={`toolkit-status-badge ${t.isConnected ? "connected" : "available"}`}>
          <div className={`toolkit-status-dot ${t.isConnected ? "connected" : "available"}`} />
          {t.isConnected ? "Live" : "Off"}
        </div>
      </div>

      <div className={`toolkit-name ${t.isConnected ? "connected" : ""}`}>
        {t.name}
      </div>

      {t.isConnected ? (
        <button
          className="toolkit-btn disconnect"
          onClick={() => onDisconnect(t.connectedAccountId!)}
          disabled={busy}
        >
          <XCircle />
          {isDisconnecting ? "Removing…" : "Disconnect"}
        </button>
      ) : (
        <button
          className="toolkit-btn connect"
          onClick={() => onConnect(t.slug)}
          disabled={busy}
        >
          <CheckCircle />
          {isConnecting ? "Connecting…" : "Connect"}
        </button>
      )}
    </div>
  );
}