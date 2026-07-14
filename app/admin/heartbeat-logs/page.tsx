"use client";

import Link from "next/link";
import "./HeartbeatLogs.css";

import { useEffect, useState } from "react";

export default function HeartbeatLogsPage() {

  const [logs, setLogs] =
    useState<any[]>([]);

  const loadLogs = async () => {

    const res =
      await fetch(
        "/api/admin/heartbeat-logs"
      );

    const data =
      await res.json();

    setLogs(data.logs || []);

  };

  useEffect(() => {

    loadLogs();

    const interval =
      setInterval(
        loadLogs,
        10000
      );

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <main className="heartbeat-page">

      <div className="heartbeat-header">

        <div className="header-left">

          <Link
            href="/dashboard"
            className="back-btn"
          >
            ← Back to Dashboard
          </Link>

          <span className="page-tag">
            HEARTBEAT LOGS
          </span>

          <h1>
            ❤️ Heartbeat Logs
          </h1>

          <p>
            Monitor every heartbeat received from connected EA clients.
          </p>

        </div>

      </div>

      <div className="stats-grid">

        <div className="stat-card">

          <h3>Total Logs</h3>

          <p>
            {logs.length}
          </p>

        </div>

      </div>

      <div className="table-wrapper">

        <table className="heartbeat-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>License</th>
              <th>Account</th>
              <th>Broker</th>
              <th>Server</th>
              <th>Login</th>
              <th>Heartbeat</th>

            </tr>

          </thead>

          <tbody>

            {logs.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="empty-row"
                >
                  No Heartbeat Logs
                </td>

              </tr>

            ) : (

              logs.map((log) => (

                <tr key={log.id}>

                  <td>{log.id}</td>

                  <td>{log.license_key}</td>

                  <td>{log.account_number}</td>

                  <td>{log.broker}</td>

                  <td>{log.server_name}</td>

                  <td>{log.mt5_login}</td>

                  <td>
                    {
                      new Date(
                        log.heartbeat_time
                      ).toLocaleString("th-TH")
                    }
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