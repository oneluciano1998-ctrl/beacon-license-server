"use client";

import { useState } from "react";
import Link from "next/link";
import "./styles/home.css";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="main-layout">
      <nav>
        <div className="logo">
          <img src="/logoea.png" alt="Beast Tamer Logo" />
          <span>BEAST TAMER</span>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <Link href="/">Home</Link>
          <Link href="/performance">Performance</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/support">Support</Link>

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

          <p>Smart Gold Trading System
Built for Consistency & Growth ระบบเทรดทองคำอัตโนมัติ
ออกแบบสำหรับเทรดเดอร์ที่ต้องการผลลัพธ์ระยะยาว</p>
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

      <section className="contact">

        <h2 className="section-title">
          Get Started Today
        </h2>

        <p>
          ติดต่อเพื่อรับ EA และคำแนะนำการใช้งาน
        </p>

        <div className="hero-buttons">

          <a
            href="https://line.me/..."
            className="primary-btn"
          >
            LINE OA
          </a>

          <a
            href="https://t.me/..."
            className="secondary-btn"
          >
            Telegram
          </a>

        </div>

      </section>
    </main>
  );
}