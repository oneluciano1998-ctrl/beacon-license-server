          import Link from "next/link";
          import "./home.css";

          export default function Home() {
  return (
    <main>
      <nav>
        <div className="logo">
    <img src="/logoea.png" alt="Beast Tamer Logo" />        
    <span>BEAST TAMER</span>
        </div>

        <div className="navbar-menu">
          <Link href="/">Home</Link>
          <Link href="/performance">Performance</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/support">Support</Link>
        </div>

        <div className="auth-buttons">
          <a href="/login" className="login-btn">
            Login
          </a>

          <a href="/register" className="register-btn">
            Register
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <img
            src="/logoea.png"
            className="hero-logo"
            alt="Beast Tamer"
          />

          <h1>
            EA <span>BEAST TAMER</span>
          </h1>

          <p>ระบบเทรดอัตโนมัติสำหรับ Forex และ Gold</p>
        </div>
      </section>

      <section className="stats">
        <div className="card">
          <h2>95%</h2>
          <p>Win Rate</p>
        </div>

        <div className="card">
          <h2>24/7</h2>
          <p>Auto Trading</p>
        </div>

        <div className="card">
          <h2>+125%</h2>
          <p>Growth</p>
        </div>
      </section>

      <section className="brokers">
        <h2>Open Account With Our Partner</h2>

        <div className="broker-grid">
          <a href="https://2s75kgxed.plusiaa.com" className="broker-box">
            KVB
          </a>

          <a href="https://2s75kgxed.plusiaa.com" className="broker-box">
            โบรก2
          </a>

          <a href="https://2s75kgxed.plusiaa.com" className="broker-box">
            โบรก3
          </a>

          <a href="https://2s75kgxed.plusiaa.com" className="broker-box">
            โบรก4
          </a>
        </div>
      </section>

      <footer>
        <h3>Contact Us</h3>

        <p>Facebook</p>
        <p>LINE OA</p>
        <p>Telegram</p>
      </footer>
    </main>
  );
}