"use client";

import "./dashboard.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {

    const [ticketsCount,setTicketsCount] =
useState(0);


    const [stats, setStats] = useState({
  users: 0,
  licenses: 0,
  payments: 0,
  plans: 0,
});

useEffect(() => {
  fetch("/api/admin/dashboard/stats")
    .then((res) => res.json())
    .then((data) => {
      setStats({
        users: data.users,
        licenses: data.licenses,
        payments: data.payments,
        plans: data.plans,
      });
    });

fetch("/api/tickets")
  .then((res) => res.json())
  .then((data) => {

    console.log("Tickets API:", data);

    if (Array.isArray(data)) {
      setTicketsCount(data.length);

    } else if (Array.isArray(data.tickets)) {
      setTicketsCount(data.tickets.length);

    } else if (Array.isArray(data.data)) {
      setTicketsCount(data.data.length);

    } else {
      setTicketsCount(0);
    }

  })
  .catch((err) => {
    console.error("Tickets API Error:", err);
    setTicketsCount(0);
  });

}, []);

  return (
    <main className="dashboard-layout">

      <aside className="dashboard-sidebar">

<div className="dashboard-sidebar-brand">

    <Image
        src="/beaconlogo.png"
        alt="Beacon Logo"
        width={64}
        height={64}
        className="dashboard-sidebar-logo-image"
    />

    <div className="dashboard-sidebar-brand-content">

        <span className="dashboard-sidebar-brand-title">
            Beacon
        </span>

        <span className="dashboard-sidebar-brand-subtitle">
            LICENSE SERVER
        </span>

    </div>

</div>

<span className="dashboard-sidebar-tag">
    BEACON PLATFORM
</span>

<h2 className="dashboard-sidebar-title">
    Command Center
</h2>

<p className="dashboard-sidebar-description">
    Manage licenses, monitoring and trading infrastructure.
</p>

<span className="dashboard-sidebar-version">
    v1.0.0
</span>

        <nav className="dashboard-sidebar-nav">

          <div className="dashboard-sidebar-section">
          MANAGEMENT
          </div>

          <Link href="/admin/dashboard"className="dashboard-sidebar-link dashboard-sidebar-link-active">
            📊 Command Center
          </Link>

          <Link href="/admin/customers" className="dashboard-sidebar-link">
            👥 Customers
          </Link>

          <Link href="/admin/licenses" className="dashboard-sidebar-link">
            🔑 Licenses
          </Link>

          <Link href="/admin/payments" className="dashboard-sidebar-link">
            💳 Payments
          </Link>

          <Link href="/admin/reviews" className="dashboard-sidebar-link">
            ⭐ Reviews
          </Link>

          <Link href="/admin/downloads" className="dashboard-sidebar-link">
            📦 Downloads
          </Link>

          <Link href="/admin/brokers" className="dashboard-sidebar-link">
            🤝 Brokers
          </Link>

          <Link href="/admin/performance" className="dashboard-sidebar-link">
            📈 Performance
          </Link>

          <Link href="/admin/tickets" className="dashboard-sidebar-link">
            🎫 Support
          </Link>

          <Link href="/admin/settings" className="dashboard-sidebar-link">
            ⚙️ Settings
          </Link>

          <hr className="dashboard-sidebar-divider" />

          <div className="dashboard-sidebar-section">
          MONITORING
          </div>

          <Link href="/admin/sessions" className="dashboard-sidebar-link">
            🟢 Active Sessions
          </Link>

          <Link href="/admin/session-history" className="dashboard-sidebar-link">
            📜 Session History
          </Link>

          <Link href="/admin/heartbeat-logs" className="dashboard-sidebar-link">
            ❤️ Heartbeat Logs
          </Link>

          <Link href="/admin/online-monitor" className="dashboard-sidebar-link">
            🖥️ Online Monitor
          </Link>

          <Link href="/admin/audit-logs" className="dashboard-sidebar-link">
            📋 Audit Logs
          </Link>

        </nav>

      </aside>

      <section className="dashboard-main">

<span className="dashboard-page-tag">
    BEACON LICENSE SERVER
</span>

<h1 className="dashboard-main-title">
    Command Center
</h1>

<p className="dashboard-main-description">
    Manage licenses, monitoring and trading infrastructure.
</p>

<div className="dashboard-cards">

  <div className="dashboard-card">
    <h3 className="dashboard-card-title">👥 Users</h3>
    <span className="dashboard-card-value">{stats.users}</span>
  </div>

  <div className="dashboard-card">
    <h3 className="dashboard-card-title">🔑 Licenses</h3>
    <span className="dashboard-card-value">{stats.licenses}</span>
  </div>

  <div className="dashboard-card">
    <h3 className="dashboard-card-title">💳 Payments</h3>
    <span className="dashboard-card-value">{stats.payments}</span>
  </div>

  <div className="dashboard-card">
    <h3 className="dashboard-card-title">📋 Plans</h3>
    <span className="dashboard-card-value">{stats.plans}</span>
  </div>

  <div className="dashboard-card">
    <h3 className="dashboard-card-title">🎫 Tickets</h3>
    <span className="dashboard-card-value">{ticketsCount}</span>
  </div>

</div>

      </section>

    </main>
  );
}