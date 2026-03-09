"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle, Plug, ArrowRight } from "lucide-react";
import { useAuth, UserButton, SignUpButton } from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { userId } = useAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .squid-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #050505e6;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid #ffffff0d;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .squid-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .squid-nav-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        /* Logo */
        .squid-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .squid-logo-mark {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }

        .squid-logo-mark img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .squid-logo-text {
          font-family: 'DM Mono', monospace;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          letter-spacing: -0.01em;
        }

        /* Nav links */
        .squid-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .squid-nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 2px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.01em;
          color: #555;
          transition: color 0.15s, background 0.15s;
          border: 1px solid transparent;
        }

        .squid-nav-link:hover {
          color: #e8e8e8;
          background: #ffffff06;
          border-color: #ffffff0a;
        }

        .squid-nav-link.active {
          color: #050505;
          background: #00ffcc;
          border-color: #00ffcc;
        }

        .squid-nav-link.active svg {
          color: #050505;
        }

        .squid-nav-link svg {
          width: 14px;
          height: 14px;
          color: #444;
          transition: color 0.15s;
          flex-shrink: 0;
        }

        .squid-nav-link:hover svg {
          color: #555;
        }

        .squid-nav-link-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Right side */
        .squid-nav-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .squid-nav-meta {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #777;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .squid-status-dot {
          width: 5px;
          height: 5px;
          background: #00ffcc;
          border-radius: 50%;
          animation: statusPulse 2.5s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }

        .squid-nav-cta {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #050505;
          background: #00ffcc;
          padding: 7px 16px;
          border-radius: 2px;
          text-decoration: none;
          transition: opacity 0.15s, transform 0.15s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .squid-nav-cta:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .squid-nav-cta svg {
          width: 12px;
          height: 12px;
          transition: transform 0.15s ease;
        }

        .squid-nav-cta:hover svg {
          transform: translateX(2px);
        }

        /* Mobile */
        .squid-nav-mobile {
          display: none;
          border-top: 1px solid #0d0d0d;
          padding: 8px 24px 10px;
          gap: 4px;
        }

        .squid-nav-mobile-link {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 2px;
          text-decoration: none;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #444;
          border: 1px solid transparent;
          transition: all 0.15s;
        }

        .squid-nav-mobile-link svg {
          width: 13px;
          height: 13px;
          flex-shrink: 0;
        }

        .squid-nav-mobile-link:hover {
          color: #e8e8e8;
          background: #0a0a0a;
          border-color: #1a1a1a;
        }

        .squid-nav-mobile-link.active {
          color: #050505;
          background: #00ffcc;
          border-color: #00ffcc;
        }

        @media (max-width: 768px) {
          .squid-nav-inner {
            padding: 0 24px;
          }

          .squid-nav-links,
          .squid-nav-meta,
          .squid-nav-cta {
            display: none;
          }

          .squid-nav-mobile {
            display: flex;
            padding-left: 24px;
            padding-right: 24px;
          }
        }
      `}</style>

      <nav className="squid-nav">
        <div className="squid-nav-inner">
          {/* Left: logo + links */}
          <div className="squid-nav-left">
            <Link href="/" className="squid-logo">
              <div className="squid-logo-mark">
                <Image src="/squid-logo.svg" alt="Squid Logo" width={32} height={32} />
              </div>
              <span className="squid-logo-text">squid</span>
            </Link>

            <div className="squid-nav-links">

              <Link
                href="/chat"
                className={`squid-nav-link${isActive("/chat") ? " active" : ""}`}
              >
                <MessageCircle />
                <span className="squid-nav-link-label">Chat</span>
              </Link>

              <Link
                href="/connections"
                className={`squid-nav-link${isActive("/connections") ? " active" : ""}`}
              >
                <Plug />
                <span className="squid-nav-link-label">Connections</span>
              </Link>
            </div>
          </div>

          {/* Right: status + CTA */}
          <div className="squid-nav-right">
            <div className="squid-nav-meta">
              <div className="squid-status-dot" />
              All systems operational
            </div>
            {userId ? (
              <UserButton />
            ) : (
              <SignUpButton mode="modal">
                <Link href="/connections" className="squid-nav-cta">
                  Get started
                  <ArrowRight />
                </Link>
              </SignUpButton>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="squid-nav-mobile">
          <Link
            href="/"
            className={`squid-nav-mobile-link${isActive("/") ? " active" : ""}`}
          >
            <MessageCircle />
            Dashboard
          </Link>
          <Link
            href="/chat"
            className={`squid-nav-mobile-link${isActive("/chat") ? " active" : ""}`}
          >
            <MessageCircle />
            Chat
          </Link>
          <Link
            href="/connections"
            className={`squid-nav-mobile-link${isActive("/connections") ? " active" : ""}`}
          >
            <Plug />
            Connections
          </Link>
        </div>
      </nav>
    </>
  );
}