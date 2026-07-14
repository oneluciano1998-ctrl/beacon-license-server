"use client";

import Link from "next/link";
import "./SessionHistory.css";
import { useEffect, useState } from "react";

export default function SessionHistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    terminated: 0,
    expired: 0
  });

  useEffect(() => {
    loadSessions();

    const interval = setInterval(() => {
      loadSessions();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    const res = await fetch(
      "/api/admin/session-history"
    );

    const data = await res.json();

    setSessions(data.sessions || []);

    if (data.stats) {
      setStats({
        total: data.stats.total || 0,
        active: data.stats.active || 0,
        terminated: data.stats.terminated || 0,
        expired: data.stats.expired || 0
      });
    }
  };

  const forceLogout = async (
    sessionId: number
  ) => {
    if (
      !confirm(
        "Force Logout Session ?"
      )
    )
      return;

    await fetch(
      "/api/licenses/force-logout",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          session_id: sessionId
        })
      }
    );

    loadSessions();
  };

 return (
  <main className="session-history-page">

    <div className="session-history-header">

      <div className="header-left">

        <Link
          href="/dashboard"
          className="back-btn"
        >
          ← Back to Dashboard
        </Link>

        <span className="page-tag">
          SESSION HISTORY
        </span>

        <h1>
          📜 Session History
        </h1>

        <p>
          View all active and historical EA sessions.
        </p>

      </div>

    </div>

    <div className="stats-grid">

      <div className="stat-card">
        <h3>Total Sessions</h3>
        <p>{stats.total}</p>
      </div>

      <div className="stat-card">
        <h3>Active</h3>
        <p>{stats.active}</p>
      </div>

      <div className="stat-card">
        <h3>Terminated</h3>
        <p>{stats.terminated}</p>
      </div>

      <div className="stat-card">
        <h3>Expired</h3>
        <p>{stats.expired}</p>
      </div>

    </div>

    <div className="table-wrapper">

      <table className="session-table">

        <thead>

          <tr>

            <th>ID</th>
            <th>License</th>
            <th>Account</th>
            <th>Broker</th>
            <th>Server</th>
            <th>Login</th>
            <th>Started</th>
            <th>Heartbeat</th>
            <th>Status</th>
            <th>Last Seen</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {sessions.map((row) => (

            <tr key={row.id}>

              <td>{row.id}</td>

              <td>{row.license_key}</td>

              <td>{row.account_number}</td>

              <td>{row.broker}</td>

              <td>{row.server_name}</td>

              <td>{row.mt5_login}</td>

              <td>
                {new Date(row.started_at).toLocaleString("th-TH")}
              </td>

              <td>
                {new Date(row.last_heartbeat).toLocaleString("th-TH")}
              </td>

              <td>
                <span
                  className={
                    row.status === "active"
                      ? "status-active"
                      : row.status === "expired"
                      ? "status-expired"
                      : "status-terminated"
                  }
                >
                  {row.status}
                </span>
              </td>

              <td>
                {Math.floor(
                  (new Date().getTime() -
                    new Date(row.last_heartbeat).getTime()) /
                    1000
                )}
                s ago
              </td>

              <td>

                {row.status === "active" ? (

                  <button
                    className="logout-btn"
                    onClick={() =>
                      forceLogout(row.id)
                    }
                  >
                    Force Logout
                  </button>

                ) : (
                  "-"
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </main>
);
}