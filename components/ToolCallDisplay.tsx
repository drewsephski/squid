"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, Loader2 } from "lucide-react";

export function ToolCallDisplay({
  toolName,
  input,
  output,
  isLoading,
}: {
  toolName: string;
  input: unknown;
  output?: unknown;
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasOutput = output != null;
  const displayData = hasOutput ? output : input;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

        .tool-call-wrap {
          display: inline-flex;
          flex-direction: column;
          gap: 0;
          max-width: 100%;
        }

        .tool-call-trigger {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          padding: 7px 12px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          font-family: 'DM Mono', monospace;
          text-align: left;
          max-width: 100%;
        }

        .tool-call-trigger:hover:not(.loading) {
          border-color: #2a2a2a;
          background: #111;
        }

        .tool-call-trigger.loading {
          cursor: default;
          opacity: 0.7;
        }

        .tool-call-trigger.done {
          border-color: #00ffcc18;
        }

        .tool-call-trigger.done:hover {
          border-color: #00ffcc33;
          background: #00ffcc05;
        }

        .tool-status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 14px;
          height: 14px;
        }

        .tool-status-icon svg {
          width: 12px;
          height: 12px;
        }

        .tool-status-icon.done svg { color: #00ffcc; }
        .tool-status-icon.loading svg { color: #444; }

        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }

        .tool-status-icon.loading svg {
          animation: spinSlow 1s linear infinite;
        }

        .tool-divider {
          width: 1px;
          height: 12px;
          background: #1a1a1a;
          flex-shrink: 0;
        }

        .tool-name {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 400;
          color: #666;
          letter-spacing: 0.04em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 260px;
        }

        .tool-name em {
          font-style: normal;
          color: #00ffcc;
          font-weight: 500;
        }

        .tool-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #222;
          flex-shrink: 0;
        }

        .tool-label.done { color: #00ffcc44; }

        .tool-toggle-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          color: #2a2a2a;
          margin-left: 2px;
        }

        .tool-toggle-icon svg { width: 11px; height: 11px; }

        /* Expanded panel */
        .tool-panel {
          margin-top: 1px;
          border: 1px solid #1a1a1a;
          border-top: none;
          border-radius: 0 0 2px 2px;
          background: #070707;
          overflow: hidden;
          animation: panelOpen 0.18s cubic-bezier(.22,1,.36,1) both;
        }

        @keyframes panelOpen {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .tool-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 14px;
          border-bottom: 1px solid #111;
          background: #0a0a0a;
        }

        .tool-panel-tab {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 2px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.12s;
          background: transparent;
          color: #777;
        }

        .tool-panel-tab.active {
          color: #00ffcc;
          border-color: #00ffcc22;
          background: #00ffcc0a;
        }

        .tool-panel-tab:hover:not(.active) {
          color: #999;
          border-color: #1a1a1a;
        }

        .tool-panel-tabs {
          display: flex;
          gap: 4px;
        }

        .tool-panel-lines {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #1e1e1e;
          letter-spacing: 0.06em;
        }

        .tool-panel-body {
          overflow: auto;
          max-height: 220px;
          padding: 16px;
          scrollbar-width: thin;
          scrollbar-color: #1a1a1a transparent;
        }

        .tool-panel-body::-webkit-scrollbar { width: 3px; height: 3px; }
        .tool-panel-body::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 2px; }

        .tool-panel-pre {
          font-family: 'DM Mono', monospace;
          font-size: 11.5px;
          line-height: 1.8;
          color: #444;
          white-space: pre;
          margin: 0;
        }

        /* JSON token coloring */
        .json-key   { color: #7eb8ff; }
        .json-str   { color: #888; }
        .json-num   { color: #00ffcc; }
        .json-bool  { color: #ff9966; }
        .json-null  { color: #555; }
        .json-punct { color: #2a2a2a; }
      `}</style>

      <div className="tool-call-wrap mb-2">
        <button
          className={`tool-call-trigger ${isLoading ? "loading" : "done"}`}
          onClick={() => !isLoading && setExpanded((v) => !v)}
          disabled={isLoading}
        >
          {/* Status */}
          <span className={`tool-status-icon ${isLoading ? "loading" : "done"}`}>
            {isLoading ? <Loader2 /> : <CheckCircle />}
          </span>

          <span className="tool-divider" />

          {/* Label */}
          <span className={`tool-label ${isLoading ? "" : "done"}`}>
            {isLoading ? "Running" : "Tool"}
          </span>

          {/* Name */}
          <span className="tool-name">
            <HighlightedToolName name={toolName} />
          </span>

          {/* Expand toggle */}
          {!isLoading && (
            <span className="tool-toggle-icon">
              {expanded ? <ChevronUp /> : <ChevronDown />}
            </span>
          )}
        </button>

        {expanded && !isLoading && (
          <ToolPanel
            input={input}
            output={output}
            hasOutput={hasOutput}
            displayData={displayData}
          />
        )}
      </div>
    </>
  );
}

/* Highlight the last segment of tool name (e.g. GITHUB_STAR_REPO → star_repo) */
function HighlightedToolName({ name }: { name: string }) {
  const parts = name.split("_");
  if (parts.length <= 2) return <>{name.toLowerCase()}</>;
  const prefix = parts.slice(0, -2).join("_").toLowerCase();
  const action = "_" + parts.slice(-2).join("_").toLowerCase();
  return <>{prefix}<em>{action}</em></>;
}

function ToolPanel({
  input,
  output,
  hasOutput,
  displayData,
}: {
  input: unknown;
  output: unknown;
  hasOutput: boolean;
  displayData: unknown;
}) {
  const [tab, setTab] = useState<"output" | "input">(hasOutput ? "output" : "input");
  const data = tab === "output" ? output : input;
  const formatted = JSON.stringify(data, null, 2);
  const lines = formatted.split("\n").length;

  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <div className="tool-panel-tabs">
          {hasOutput && (
            <button
              className={`tool-panel-tab ${tab === "output" ? "active" : ""}`}
              onClick={() => setTab("output")}
            >
              Output
            </button>
          )}
          <button
            className={`tool-panel-tab ${tab === "input" ? "active" : ""}`}
            onClick={() => setTab("input")}
          >
            Input
          </button>
        </div>
        <span className="tool-panel-lines">{lines}L</span>
      </div>
      <div className="tool-panel-body">
        <pre className="tool-panel-pre">
          <code dangerouslySetInnerHTML={{ __html: colorizeJson(formatted) }} />
        </pre>
      </div>
    </div>
  );
}

/* Minimal JSON syntax highlighter */
function colorizeJson(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\],:])/g,
      (match) => {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) return `<span class="json-key">${match}</span>`;
          return `<span class="json-str">${match}</span>`;
        }
        if (/true|false/.test(match)) return `<span class="json-bool">${match}</span>`;
        if (/null/.test(match))       return `<span class="json-null">${match}</span>`;
        if (/[{}[\],:]/.test(match))  return `<span class="json-punct">${match}</span>`;
        return `<span class="json-num">${match}</span>`;
      }
    );
}