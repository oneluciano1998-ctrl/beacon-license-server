"use client";

import Link from "next/link";
import "./dashboard.css";
import { useEffect, useState } from "react";

export default function DashboardPage() {

    console.log("Render", new Date().toLocaleTimeString());

  function heartbeatAge(date: string) {

    if (!date) return "-";

    const sec = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    if (sec < 60) return `${sec}s`;

    if (sec < 3600) return `${Math.floor(sec / 60)}min`;

    return `${Math.floor(sec / 3600)}hr`;
  }

  const [data, setData] = useState<any>({
    health: {
      license_server: "offline",
      database: "offline",
      api: "offline",
      heartbeat: "offline",
      mt5: "offline",
    },
    stats: {
      active_licenses: 0,
      active_sessions: 0,
      online_sessions: 0,
      offline_sessions: 0,
    },
    sessions: [],
    alerts: [],
    audits: [],
  });

  const [loading, setLoading] = useState(true);

  const [lastRefresh, setLastRefresh] =
    useState(new Date());

  const loadDashboard = async () => {

    try {

      const res =
        await fetch("/api/admin/dashboard");

        if (!res.ok) {

            console.error(
                "Dashboard API Failed"
            );

            return;
        }

      const json =
        await res.json();
        
        console.log(json);

      console.log("Dashboard:", json);

        if (
            json.health &&
            json.stats
        ){

            setData(json);

            setLastRefresh(
                new Date()
            );

        }

      setLastRefresh(new Date());

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadDashboard();

    const timer =
      setInterval(loadDashboard, 5000);

    return () => clearInterval(timer);

  }, []);

  if (loading) {

    return (
      <div className="page">
        Loading...
      </div>
    );

  }

  return(

<div className="page">

<div className="page-header">

  <div>

  <div className="header-top">

        <Link
            href="/dashboard"
            className="dashboard-back-btn"
        >
          ← Back to Dashboard
      </Link>

      <div className="dashboard-page-tag">
          BEACON LICENSE SERVER
      </div>

  </div>

  <h1 className="page-title">
      Command Center
  </h1>

    <p className="page-description">
      Real-time License Monitoring Center
    </p>

  </div>

  <div className="refresh-box">

    <div className="refresh-title">
      Last Refresh
    </div>

    <div className="refresh-time">
      {lastRefresh.toLocaleTimeString("th-TH")}
    </div>

  </div>

</div>

  {/* ===================== */}
  {/* Server Health */}
  {/* ===================== */}

  <h2 className="section-title">
    Server Health
  </h2>

  <div className="health-grid">

    <div className="health-card">
      <h3>License Server</h3>
      <span className={
        data?.health?.license_server === "online"
          ? "online"
          : "offline"
      }>
        {data?.health?.license_server}
      </span>
    </div>

    <div className="health-card">
      <h3>Database</h3>
      <span className={
        data?.health?.database === "online"
          ? "online"
          : "offline"
      }>
        {data?.health?.database}
      </span>
    </div>

    <div className="health-card">
      <h3>API</h3>
      <span className={
        data?.health.api === "online"
          ? "online"
          : "offline"
      }>
        {data?.health?.api}
      </span>
    </div>

    <div className="health-card">
      <h3>Heartbeat</h3>
      <span className={
        data?.health?.heartbeat === "online"
          ? "online"
          : "offline"
      }>
        {data?.health?.heartbeat}
      </span>
    </div>

    <div className="health-card">
      <h3>MT5</h3>
      <span className={
        data?.health?.mt5 === "online"
          ? "online"
          : "offline"
      }>
        {data?.health?.mt5}
      </span>
    </div>

  </div>

  {/* ===================== */}
  {/* Summary */}
  {/* ===================== */}

  <h2 className="section-title">
    System Summary
  </h2>

  <div className="stats-grid">

    <div className="card">
      <h3>Active Licenses</h3>
      <p>{data?.stats?.active_licenses}</p>
    </div>

    <div className="card">
      <h3>Active Sessions</h3>
      <p>{data?.stats?.active_sessions}</p>
    </div>

    <div className="card">
      <h3>Online EA</h3>
      <p>{data?.stats?.online_sessions}</p>
    </div>

    <div className="card">
      <h3>Offline EA</h3>
      <p>{data?.stats?.offline_sessions}</p>
    </div>

  </div>

<h2>
Live Sessions
</h2>

<div className="table-wrapper">

<table>

<thead>

<tr>
<th>Online</th>

<th>License</th>

<th>Account</th>

<th>Broker</th>

<th>Server</th>

<th>Heartbeat</th>

</tr>

</thead>

<tbody>

{data?.sessions?.map((s:any)=>(

<tr key={s.id}>
<td>{s.online_minutes} min</td>

<td>{s.license_key}</td>

<td>{s.account_number}</td>

<td>{s.broker}</td>

<td>{s.server_name}</td>

<td>

{heartbeatAge(
s.last_heartbeat
)}

</td>

</tr>

))}

</tbody>

</table>

</div>

<h2>
Recent Alerts
</h2>

<div className="table-wrapper">

<table>

<thead>

<tr>

<th>Type</th>
<th>Message</th>
<th>Time</th>

</tr>

</thead>

<tbody>

{data?.alerts?.length ? (

data?.alerts?.map((a:any,index:number)=>(

<tr key={index}>

<td>{a.type}</td>

<td>{a.message}</td>

<td>
{
new Date(a.created_at)
.toLocaleString("th-TH")
}
</td>

</tr>

))

):(

<tr>

<td
colSpan={3}
style={{
textAlign:"center",
padding:"20px"
}}
>

No Alerts

</td>

</tr>

)}

</tbody>

</table>

</div>

<h2>
Latest Activity
</h2>

<div className="table-wrapper">

<table>

<thead>

<tr>

<th>License</th>

<th>Action</th>

<th>Details</th>

<th>Time</th>

</tr>

</thead>

<tbody>

{data?.audits?.map((a:any,index:number)=>(

<tr key={index}>

<td>{a.license_key}</td>

<td>{a.action}</td>

<td>{a.details}</td>

<td>
{new Date(
a.created_at
).toLocaleString("th-TH")}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

  );

}