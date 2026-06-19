import Link from "next/link";
import "./performance.css";

export default function PerformancePage() {
  return (
    <>
      <nav>
        <Link href="/" className="floating-home">
          ← Home
        </Link>

        <div className="logo">
          <img src="/logoea.png" alt="Beast Tamer" />
          <span>BEAST TAMER</span>
        </div>
      </nav>

      <section className="performance-hero">
        <h1>Performance</h1>

        <p>Real Trading Results & Statistics</p>
      </section>

      <section className="statistics">
        <div className="stat-box">
          <h2>95%</h2>
          <span>Win Rate</span>
        </div>

        <div className="stat-box">
          <h2>1.85</h2>
          <span>Profit Factor</span>
        </div>

        <div className="stat-box">
          <h2>8%</h2>
          <span>Max Drawdown</span>
        </div>

        <div className="stat-box">
          <h2>5,243</h2>
          <span>Total Trades</span>
        </div>
      </section>

      <section className="growth">
        <h2>Account Growth</h2>

        <img
          src="/ea.png"
          alt="Account Growth"
          className="growth-chart"
        />
      </section>

      <section className="backtest">
        <h2>Backtest Results</h2>

        <img
          src="/backtest.jpg"
          alt="Backtest Results"
          className="backtest-image"
        />
      </section>

      <section className="myfxbook">
        <h2>Verified Results</h2>

        <a
          href="performance-index.html"
          className="myfxbook-btn"
        >
          View Myfxbook
        </a>
      </section>
    </>
  );
}