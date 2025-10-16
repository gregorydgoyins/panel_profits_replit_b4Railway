import React from "react";

export default function App() {
  return (
    <div style={{padding: 24, fontFamily: "ui-sans-serif"}}>
      <h1>🧠 Panel Profits — Minimal Boot</h1>
      <p>Alias <code>@</code> is configured. Re-enable full app after basic boot is verified.</p>
      <ul>
        <li>Health route: <code>/__health</code></li>
        <li>Dev proxy: Express@$PORT → Vite@5173</li>
      </ul>
    </div>
  );
}
