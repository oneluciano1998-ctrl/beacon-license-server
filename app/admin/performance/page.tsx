import Link from "next/link";
import "./performance.css";

export default function PerformancePage() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <Link href="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>

        <h1>Performance</h1>
        <p>Monitor trading performance, analytics, and overall system statistics.</p>
      </div>

      {/* Coming Soon */}
      <div className="coming-card">
        <h2>📊 Coming Soon</h2>
        <p>
          Performance analytics dashboard is currently under development.
        </p>
      </div>
    </div>
  );
}