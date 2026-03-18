"use client";

export function TerminalTitleBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        minWidth: 0,
      }}
    >
      <img
        src="/powershell.png"
        alt="PowerShell"
        style={{ width: "16px", height: "16px", flexShrink: 0 }}
      />
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Administrator: Taha Korkmaz
      </span>
    </div>
  );
}

export function TerminalApp() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#012456",
        color: "white",
        fontFamily: "Consolas, monospace",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "18px",
          margin: 0,
          fontSize: "18px",
          fontFamily: '"Segoe UI Variable", "Segoe UI", Arial, sans-serif',
          whiteSpace: "pre-wrap",
        }}
      >
        {`SuperShell [Version 1.0.0]

TJK Interactive Environment
Session initialized successfully.

Portfolio modules and media tools are available.
https://tj45677.ca/

Type 'help' to get started.`}
      </div>
    </div>
  );
}