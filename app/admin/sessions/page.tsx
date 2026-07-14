"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./ActiveSessions.css";

type Session = {
  id: number;
  license_key: string;
  account_number: string;
  broker: string;
  server_name: string;
  mt5_login: string;
  last_heartbeat: string;
};

export default function ActiveSessionsPage() {
  const [sessions, setSessions] =
    useState<Session[]>([]);

  const loadSessions = async () => {
    try {
      const res = await fetch(
        "/api/licenses/sessions"
      );

      const data = await res.json();

      setSessions(
        data.sessions || []
      );

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    loadSessions();

    const interval =
      setInterval(
        loadSessions,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  const forceLogout =
    async (sessionId:number)=>{

      if(!confirm("Force Logout ?"))
        return;

      const res =
        await fetch(
          "/api/licenses/force-logout",
          {
            method:"POST",

            headers:{
              "Content-Type":"application/json"
            },

            body:JSON.stringify({
              session_id:sessionId
            })
          }
        );

      const data =
        await res.json();

      if(data.success){
        loadSessions();
      }

    };

  return (

    <main className="sessions-page">

      <div className="sessions-header">

        <div className="header-left">

          <Link
            href="/dashboard"
            className="back-btn"
          >
            ← Back to Dashboard
          </Link>

          <span className="page-tag">
            ACTIVE SESSIONS
          </span>

          <h1>
            🟢 Active Sessions
          </h1>

          <p>
            Monitor all connected EA sessions in real time.
          </p>

          <div className="stat-card">
            Active Sessions
            <span>
              {sessions.length}
            </span>
          </div>

        </div>

      </div>

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>ID</th>
              <th>License</th>
              <th>Account</th>
              <th>Broker</th>
              <th>Server</th>
              <th>Login</th>
              <th>Heartbeat</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {sessions.length===0 ? (

              <tr>

                <td
                  colSpan={8}
                  className="empty-row"
                >
                  No Active Sessions
                </td>

              </tr>

            ) : (

              sessions.map((s)=>(

                <tr key={s.id}>

                  <td>{s.id}</td>

                  <td>{s.license_key}</td>

                  <td>{s.account_number}</td>

                  <td>{s.broker}</td>

                  <td>{s.server_name}</td>

                  <td>{s.mt5_login}</td>

                  <td>
                    {new Date(
                      s.last_heartbeat
                    ).toLocaleString()}
                  </td>

                  <td>

                    <button
                      className="logout-btn"
                      onClick={()=>
                        forceLogout(s.id)
                      }
                    >
                      Force Logout
                    </button>

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