"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";
import { ToolCallDisplay } from "../../components/ToolCallDisplay";
import { Send, Bot, User, Zap, CornerDownLeft, ArrowBigUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

const SUGGESTIONS = [
  "Star the composio repo on GitHub",
  "Send a message to #general in Slack",
  "List my open GitHub issues",
  "Connect my Google account",
];

export default function Chat() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@300;400;500&display=swap');

        .chat-root {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #050505;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          color: #e8e8e8;
        }

        /* Layout */
        .chat-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 860px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 24px 0;
        }

        /* Header */
        .chat-header {
          padding-bottom: 32px;
          border-bottom: 1px solid #111;
          margin-bottom: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .chat-header-left h1 {
          font-size: 22px;
          font-weight: 300;
          letter-spacing: -0.03em;
          color: #fff;
          line-height: 1;
          margin-bottom: 6px;
        }

        .chat-header-left p {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #333;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .chat-model-badge {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #333;
          border: 1px solid #1a1a1a;
          padding: 6px 12px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .badge-dot {
          width: 5px;
          height: 5px;
          background: #00ffcc;
          border-radius: 50%;
          animation: badgePulse 2.5s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Message list */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 32px 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
          scrollbar-width: thin;
          scrollbar-color: #1a1a1a transparent;
        }

        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 2px; }

        /* Empty state */
        .chat-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          gap: 32px;
        }

        .chat-empty-icon {
          width: 56px;
          height: 56px;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
        }

        .chat-empty-text {
          text-align: center;
        }

        .chat-empty-text h2 {
          font-size: 18px;
          font-weight: 300;
          color: #555;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .chat-empty-text p {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #2a2a2a;
          letter-spacing: 0.06em;
        }

        .chat-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          max-width: 560px;
        }

        .suggestion-pill {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #444;
          background: transparent;
          border: 1px solid #1a1a1a;
          padding: 8px 14px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.04em;
          text-align: left;
        }

        .suggestion-pill:hover {
          border-color: #00ffcc33;
          color: #00ffcc;
          background: #00ffcc08;
        }

        /* Message rows */
        .msg-row {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          animation: msgIn 0.3s cubic-bezier(.22,1,.36,1) both;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .msg-row.user { flex-direction: row-reverse; }

        .msg-avatar {
          width: 28px;
          height: 28px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .msg-avatar.assistant {
          border: 1px solid #1a1a1a;
          color: #00ffcc;
          background: transparent;
        }

        .msg-avatar.user {
          background: #00ffcc;
          color: #050505;
        }

        .msg-avatar svg { width: 13px; height: 13px; }

        .msg-content {
          max-width: 75%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .msg-role-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #333;
          margin-bottom: 6px;
        }

        .msg-row.user .msg-role-label { text-align: right; }

        .msg-bubble {
          border-radius: 2px;
          padding: 14px 18px;
          font-size: 14px;
          line-height: 1.7;
          font-weight: 300;
        }

        .msg-bubble.assistant {
          background: #0a0a0a;
          border: 1px solid #141414;
          color: #c8c8c8;
        }

        .msg-bubble.user {
          background: #e8e8e8;
          color: #050505;
          font-weight: 400;
        }

        /* Prose inside assistant bubble */
        .msg-prose p { margin-bottom: 10px; }
        .msg-prose p:last-child { margin-bottom: 0; }
        .msg-prose ul { list-style: none; padding: 0; margin-bottom: 10px; }
        .msg-prose ul li { padding-left: 16px; position: relative; margin-bottom: 4px; color: #999; }
        .msg-prose ul li::before { content: '–'; position: absolute; left: 0; color: #333; }
        .msg-prose ol { padding-left: 20px; margin-bottom: 10px; color: #999; }
        .msg-prose li { margin-bottom: 4px; }
        .msg-prose h1, .msg-prose h2, .msg-prose h3 {
          font-weight: 400;
          color: #e8e8e8;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
          margin-top: 16px;
        }
        .msg-prose h1 { font-size: 18px; }
        .msg-prose h2 { font-size: 16px; }
        .msg-prose h3 { font-size: 14px; }
        .msg-prose a { color: #00ffcc; text-underline-offset: 3px; }
        .msg-prose a:hover { opacity: 0.75; }
        .msg-prose code {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          background: #111;
          color: #00ffcc;
          padding: 2px 6px;
          border-radius: 2px;
        }
        .msg-prose pre {
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          padding: 16px;
          overflow-x: auto;
          margin: 12px 0;
        }
        .msg-prose pre code {
          background: transparent;
          padding: 0;
          color: #888;
        }

        /* User bubble prose */
        .msg-prose-user a { color: #050505; text-decoration: underline; }

        /* Loading indicator */
        .thinking-bubble {
          background: #0a0a0a;
          border: 1px solid #141414;
          border-radius: 2px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .thinking-dots {
          display: flex;
          gap: 4px;
        }

        .thinking-dot {
          width: 4px;
          height: 4px;
          background: #333;
          border-radius: 50%;
          animation: dotBounce 1.2s ease-in-out infinite;
        }

        .thinking-dot:nth-child(2) { animation-delay: 0.15s; }
        .thinking-dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); background: #333; }
          30% { transform: translateY(-6px); background: #00ffcc; }
        }

        .thinking-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #2a2a2a;
          letter-spacing: 0.08em;
        }

        /* Input area */
        .chat-input-wrap {
          position: sticky;
          bottom: 0;
          background: linear-gradient(to top, #050505 80%, transparent);
          padding: 16px 0 28px;
        }

        .chat-input-box {
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          background: #080808;
          transition: border-color 0.15s;
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow: hidden;
        }

        .chat-input-box:focus-within {
          border-color: #00ffcc33;
        }

        .chat-textarea {
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          width: 100%;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: #e8e8e8;
          line-height: 1.6;
          padding: 16px 18px 8px;
          min-height: 56px;
          max-height: 180px;
          caret-color: #00ffcc;
        }

        .chat-textarea::placeholder { color: #2a2a2a; }
        .chat-textarea:disabled { opacity: 0.4; cursor: not-allowed; }

        .chat-input-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px 12px;
        }

        .chat-input-hint {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #666;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hint-icon {
          width: 11px;
          height: 11px;
          transition: transform 0.15s ease;
        }

        .hint-group:hover .hint-icon {
          transform: translateX(1px);
        }

        .hint-shift {
          width: 12px;
          height: 12px;
          opacity: 0.7;
        }

        .chat-send-btn {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #050505;
          background: #00ffcc;
          border: none;
          padding: 8px 18px;
          border-radius: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.15s, transform 0.15s;
        }

        .chat-send-btn:hover:not(:disabled) {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .chat-send-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
          transform: none;
        }

        .chat-send-btn svg { width: 12px; height: 12px; }
      `}</style>

      <main className="chat-root">
        <div className="chat-layout">

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <h1>Agent Chat</h1>
              <p>Connected via Composio</p>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <div className="chat-empty-icon">
                  <Zap size={22} />
                </div>
                <div className="chat-empty-text">
                  <h2>What should I do for you?</h2>
                  <p>Shift+Enter for new line · Enter to send</p>
                </div>
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="suggestion-pill"
                      onClick={() => setInput(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`msg-row ${m.role === "user" ? "user" : "assistant"}`}
                >
                  <div className={`msg-avatar ${m.role === "user" ? "user" : "assistant"}`}>
                    {m.role === "user" ? <User /> : <Bot />}
                  </div>

                  <div className="msg-content">
                    <div className="msg-role-label">
                      {m.role === "user" ? "You" : "Squid"}
                    </div>
                    <div className={`msg-bubble ${m.role === "user" ? "user" : "assistant"}`}>
                      {m.parts.map((part, i) => {
                        if (part.type === "text") {
                          return (
                            <div
                              key={i}
                              className={m.role === "user" ? "msg-prose-user" : "msg-prose"}
                            >
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                                components={{
                                  a: ({ href, children }) => (
                                    <a href={href} target="_blank" rel="noopener noreferrer">
                                      {children}
                                    </a>
                                  ),
                                  p: ({ children }) => <p>{children}</p>,
                                  ul: ({ children }) => <ul>{children}</ul>,
                                  ol: ({ children }) => <ol>{children}</ol>,
                                  li: ({ children }) => <li>{children}</li>,
                                  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
                                    const isInline = !className?.includes("language-");
                                    return isInline ? (
                                      <code {...props}>{children}</code>
                                    ) : (
                                      <code className={className} {...props}>{children}</code>
                                    );
                                  },
                                  pre: ({ children }) => <pre>{children}</pre>,
                                  h1: ({ children }) => <h1>{children}</h1>,
                                  h2: ({ children }) => <h2>{children}</h2>,
                                  h3: ({ children }) => <h3>{children}</h3>,
                                }}
                              >
                                {part.text}
                              </ReactMarkdown>
                            </div>
                          );
                        }
                        if (isToolUIPart(part)) {
                          return (
                            <div key={part.toolCallId} style={{ marginTop: 10 }}>
                              <ToolCallDisplay
                                toolName={getToolName(part)}
                                input={part.input}
                                output={
                                  part.state === "output-available"
                                    ? part.output
                                    : undefined
                                }
                                isLoading={part.state !== "output-available"}
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="msg-row assistant">
                <div className="msg-avatar assistant">
                  <Bot />
                </div>
                <div className="msg-content">
                  <div className="msg-role-label">Squid</div>
                  <div className="thinking-bubble">
                    <div className="thinking-dots">
                      <div className="thinking-dot" />
                      <div className="thinking-dot" />
                      <div className="thinking-dot" />
                    </div>
                    <span className="thinking-label">Processing…</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-input-wrap">
            <div className="chat-input-box">
              <textarea
                ref={inputRef}
                className="chat-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything or give a command…"
                disabled={isLoading}
                rows={1}
              />
              <div className="chat-input-footer">
                <span className="chat-input-hint">
                  <span className="hint-group" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <CornerDownLeft className="hint-icon" />
                    <span>Send</span>
                  </span>
                  <span>·</span>
                  <span className="hint-group" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <ArrowBigUp className="hint-shift" />
                    <CornerDownLeft className="hint-icon" />
                    <span>New line</span>
                  </span>
                </span>
                <button
                  className="chat-send-btn"
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
                >
                  <Send />
                  Send
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}