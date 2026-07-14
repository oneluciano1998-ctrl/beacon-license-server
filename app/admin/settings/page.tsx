"use client";

import Link from "next/link";
import "./Settings.css";

export default function SettingsPage() {
  return (
    <main className="settings-page">
      <div className="settings-header">
        <div className="header-left">
          <Link
            href="/dashboard"
            className="back-btn"
          >
            ← Back to Dashboard
          </Link>

          <span className="page-tag">
            SETTINGS
          </span>

          <h1>
            ⚙️ Settings
          </h1>

          <p>
            Configure Beacon EA system settings and preferences.
          </p>
        </div>
      </div>

      <div className="coming-card">
        <h2>⚙️ Coming Soon</h2>
        <p>
          System settings are currently under development.
        </p>
      </div>
    </main>
  );
}