import Link from "next/link";
import "./performance.css";

export default function PerformancePage() {
  return (
    <main className="main-layout">
    <>
      <nav>
        <Link href="/" className="floating-home">
          ← Home
        </Link>

      </nav>

      <section className="performance-hero">
        <h1>Performance</h1>

        <p>Real Trading Results & Statistics</p>
      </section>

    <main className="performance-page">

      <h1>Performance Report</h1>

      <div className="stats-grid">

        <div className="stat-card">
          <h2>95%</h2>
          <p>Win Rate</p>
        </div>

        <div className="stat-card">
          <h2>8%</h2>
          <p>Max Drawdown</p>
        </div>

        <div className="stat-card">
          <h2>125%</h2>
          <p>Total Growth</p>
        </div>

      </div>

    </main>
    <section className="proof-section">

    <h2 className="section-title">Trading Proof</h2>

  <div className="proof-grid">

    <img src="/ea.png" alt="myfxbook" />

    <img src="/ea.png" alt="fxblue" />

    <img src="/ea.png" alt="statement" />

  </div>

</section>

<section className="review-section">

  <h2 className="verified-reviews-title">Verified Trader Reviews</h2>

  <div className="review-gallery">

    <img src="/reviews/ea.png" />

    <img src="/reviews/ea.png" />

    <img src="/reviews/ea.png" />

  </div>

</section>

      <section className="growth">
        <h2 className="section-title">Account Growth</h2>

        <img
          src="/ea.png"
          alt="Account Growth"
          className="growth-chart"
        />
      </section>

      <section className="backtest">
        <h2 className="section-title">Backtest Results</h2>

        <img
          src="/backtest.jpg"
          alt="Backtest Results"
          className="backtest-image"
        />
      </section>

      <section className="myfxbook">
        <h2>Verified Trader Reviews</h2>

        <a
          href="performance-index.html"
          className="myfxbook-btn"
        >
          View Myfxbook
        </a>
      </section>
    </>
    </main>
  );
}