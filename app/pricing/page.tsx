
import Link from "next/link";
import "./pricing.css";

export default function PricingPage() {
  return (
    <>
 <nav>
  <Link href="/" className="floating-home">
    ← Home
  </Link>

  <div className="logo">
    <img src="/logoea.png" alt="Beast Tamer Logo" />
    <span>BEAST TAMER</span>
  </div>
</nav>

      <section className="pricing-section">
        <h1>Choose Your Beast</h1>

        <p>
          ปลดล็อกพลัง EA Beast Tamer
          ให้เหมาะกับสไตล์การเทรดของคุณ
        </p>

        <div className="pricing-grid">
          <div className="price-card">
            <span className="plan-name">TRIAL</span>

            <h2>FREE</h2>

            <ul>
              <li>✓ ทดลองใช้งาน 14 วัน</li>
              <li>✓ ใช้ได้ 1 MT5 Account</li>
              <li>✓ Full EA Features</li>
              <li>✓ Basic Support</li>
            </ul>

            <a href="/register" className="price-btn">
              Start Free Trial
            </a>
          </div>

          <div className="price-card featured">
            <span className="popular-badge">
              Most Popular
            </span>

            <span className="plan-name">
              STANDARD
            </span>

            <h2>฿2,990</h2>

            <ul>
              <li>✓ Lifetime License</li>
              <li>✓ 1 MT5 Account</li>
              <li>✓ Free Updates</li>
              <li>✓ Priority Support</li>
              <li>✓ Gold & Forex Trading</li>
            </ul>

            <a href="#" className="price-btn featured-btn">
              Buy Now
            </a>
          </div>

          <div className="price-card">
            <span className="plan-name">
              VIP
            </span>

            <h2>฿5,990</h2>

            <ul>
              <li>✓ Lifetime License</li>
              <li>✓ Multi Accounts</li>
              <li>✓ Premium Updates</li>
              <li>✓ VIP Support</li>
              <li>✓ Future EA Included</li>
            </ul>

            <a href="#" className="price-btn">
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </>
  );
}