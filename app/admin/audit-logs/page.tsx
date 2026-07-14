"use client";

import Link from "next/link";
import "./AuditLogs.css";

import { useEffect, useState } from "react";

type AuditLog = {
  id: number;
  license_key: string;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
};

export default function AuditLogsPage() {

  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  const loadLogs = async () => {

    const res =
      await fetch(
        "/api/admin/audit-logs"
      );

    const data =
      await res.json();

    setLogs(
      data.logs || []
    );

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

    <main className="audit-page">

      <div className="audit-header">

        <div className="header-left">

          <Link
            href="/dashboard"
            className="back-btn"
          >
            ← Back to Dashboard
          </Link>

          <span className="page-tag">
            AUDIT LOGS
          </span>

          <h1>
            📜 Audit Logs
          </h1>

          <p>
            Track every important action performed by the License Server.
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

        <table className="audit-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>License</th>
              <th>Action</th>
              <th>Details</th>
              <th>IP Address</th>
              <th>Created</th>

            </tr>

          </thead>

          <tbody>

            {logs.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="empty-row"
                >
                  No Audit Logs
                </td>

              </tr>

            ) : (

              logs.map((log) => (

                <tr key={log.id}>

                  <td>{log.id}</td>

                  <td>{log.license_key}</td>

                  <td>

                    <span
                      className={
                        log.action === "VERIFY_SUCCESS"
                          ? "log-success"
                          : log.action === "SESSION_REPLACED"
                          ? "log-warning"
                          : "log-danger"
                      }
                    >
                      {log.action}
                    </span>

                  </td>

                  <td>{log.details}</td>

                  <td>{log.ip_address}</td>

                  <td>
                    {
                      new Date(
                        log.created_at
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