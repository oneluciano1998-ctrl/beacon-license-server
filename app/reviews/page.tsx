import Link from "next/link";
import "./reviews.css";

export default function ReviewsPage() {
  return (
    <>
      <nav>
        <Link href="/" className="floating-home">
          ← Home
        </Link>

        <div className="logo">
          <img src="/logoea.png" alt="Logo" />
          <span>BEAST TAMER</span>
        </div>
      </nav>

      <section className="reviews-hero">
        <h1>Client Reviews</h1>

        <p>ผลลัพธ์และความคิดเห็นจากผู้ใช้งานจริง</p>
      </section>

      <section className="review-section">
        <div className="review-card">
          <div className="stars">★★★★★</div>

          <h3>Forex Trader</h3>

          <p>ใช้งานง่ายมาก เซ็ตครั้งเดียวแล้วปล่อยรันได้เลย</p>
        </div>

        <div className="review-card">
          <div className="stars">★★★★★</div>

          <h3>Gold Trader</h3>

          <p>กำไรต่อเนื่องและ Drawdown ต่ำ</p>
        </div>

        <div className="review-card">
          <div className="stars">★★★★★</div>

          <h3>EA User</h3>

          <p>ทีมงานตอบไวและช่วยเหลือตลอด</p>
        </div>
      </section>

      <section className="review-gallery">
        <h2 className="section-title">Real Results</h2>

        <div className="gallery">
        <img src="/backtest.jpg" alt="Backtest" />
        <img src="/backtest.jpg" alt="Backtest" />
        <img src="/backtest.jpg" alt="Backtest" />
        </div>
      </section>

      <section className="video-review">
        <h2 className="section-title">Video Reviews</h2>

        <div className="video-box">
          <video controls autoPlay muted loop>
            <source src="/EA.mp4" type="video/mp4" />
            Browser ของคุณไม่รองรับวิดีโอ
          </video>
        </div>
      </section>

      <section className="contact-admin">
        <h2>Interested in Beast Tamer?</h2>

        <p>ติดต่อแอดมินเพื่อทดลองใช้งาน EA</p>

        <a
          href="https://lin.ee/PebN8DB"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-btn"
        >
          📱 Contact Admin
        </a>

        <div className="line-logo">
          <img src="/logoea.png" alt="LINE" />
        </div>
      </section>
    </>
  );
}