"use client";

import Link from "next/link";
import "./OnlineMonitor.css";

import { useEffect, useState } from "react";

export default function OnlineMonitorPage() {

  const [sessions, setSessions] =
    useState<any[]>([]);

  const [stats, setStats] =
    useState<any>({});

  const load = async () => {

    const res =
      await fetch(
        "/api/admin/online-monitor"
      );

    const data =
      await res.json();

    setSessions(
      data.sessions || []
    );

    setStats(
      data.stats || {}
    );

  };

  useEffect(() => {

    load();

    const timer =
      setInterval(
        load,
        5000
      );

    return () =>
      clearInterval(timer);

  }, []);

  return (

    <main className="monitor-page">

      <div className="monitor-header">

        <div className="header-left">

          <Link
            href="/dashboard"
            className="back-btn"
          >
            ← Back to Dashboard
          </Link>

          <span className="page-tag">
            ONLINE MONITOR
          </span>

          <h1>
            🟢 Online Monitor
          </h1>

          <p>
            Monitor real-time connection status of all EA clients.
          </p>

        </div>

      </div>

      <div className="stats-grid">

        <div className="stat-card">

          <h3>Total Sessions</h3>

          <p>
            {stats.total || 0}
          </p>

        </div>

        <div className="stat-card">

          <h3>Online</h3>

          <p>
            {stats.online || 0}
          </p>

        </div>

        <div className="stat-card">

          <h3>Offline</h3>

          <p>
            {stats.offline || 0}
          </p>

        </div>

      </div>

      <div className="table-wrapper">

        <table className="monitor-table">

          <thead>

            <tr>

              <th>License</th>
              <th>Account</th>
              <th>Broker</th>
              <th>Server</th>
              <th>Login</th>
              <th>Last Heartbeat</th>
              <th>Offline</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {sessions.length === 0 ? (

              <tr>

                <td
                  colSpan={8}
                  className="empty-row"
                >
                  No Active Sessions
                </td>

              </tr>

            ) : (

              sessions.map((s) => (

                <tr key={s.id}>

                  <td>{s.license_key}</td>

                  <td>{s.account_number}</td>

                  <td>{s.broker}</td>

                  <td>{s.server_name}</td>

                  <td>{s.mt5_login}</td>

                  <td>
                    {new Date(
                      s.last_heartbeat
                    ).toLocaleString("th-TH")}
                  </td>

                  <td>
                    {s.offline_seconds}s
                  </td>

                  <td>

                    <span
                      className={
                        s.monitor_status === "online"
                          ? "status-online"
                          : "status-offline"
                      }
                    >
                      {s.monitor_status}
                    </span>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </main>

  );

}