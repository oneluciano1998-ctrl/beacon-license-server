import Link from "next/link";
import "./brokers.css";

export default function BrokersPage() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <Link href="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>

        <h1>Brokers</h1>
        <p>Manage supported brokers for Beacon EA.</p>
      </div>

      {/* Coming Soon */}
      <div className="coming-card">
        <h2>🚧 Coming Soon</h2>
        <p>
          Broker management will be available in a future update.
        </p>
      </div>
    </div>
  );
}