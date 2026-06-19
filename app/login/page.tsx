"use client";

import Link from "next/link";
import { FaShieldAlt } from "react-icons/fa";
import { ImGithub } from "react-icons/im";
import "./login.css";

export default function LoginPage() {
  return (
    <div className="login-page">

      <div className="bg-glow-top"></div>
      <div className="bg-glow-bottom"></div>

      <div className="login-container">

        <div className="status-badge-wrapper">
          <span className="status-badge">
            <span className="status-dot"></span>
            EA Auth Server Online
          </span>
        </div>

<div className="header-section">

            <div className="logo-box">
                <img
                src="/logoea.png"
                alt="EA Beast Tamer"
                className="login-logo"
                />
            </div>

            <h1 className="main-title">
                EA Beast
                <span className="gradient-text"> Tamer</span>
            </h1>

            <p className="subtitle">
                ระบบควบคุมสิทธิ์และการใช้งาน EA บัญชี MT4/MT5
            </p>

            </div>

        <form>

          <div className="form-group">
            <label className="form-label">
              บัญชีผู้ใช้ / อีเมล
            </label>

            <div className="input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="กรอกชื่อผู้ใช้ หรือ อีเมลของคุณ"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              รหัสผ่าน
            </label>

            <div className="input-wrapper">
              <input
                type="password"
                className="form-input"
                placeholder="กรอกรหัสผ่านระบบความปลอดภัย"
              />
            </div>
          </div>

          <div className="options-row">

            <label className="checkbox-label">
              <input
                type="checkbox"
                className="hidden-checkbox"
              />
              <div className="custom-checkbox"></div>

              <span>
                จดจำการเข้าสู่ระบบ
              </span>
            </label>

            <a href="#" className="form-link">
              ลืมรหัสผ่าน?
            </a>

          </div>

          <button type="submit" className="submit-btn">
            เข้าสู่ระบบ Dashboard →
          </button>

          <div className="security-note-row">
            <span className="encryption-text">
            <FaShieldAlt className="shield-icon" />
            Protected by 256-bit Encryption
            </span>
          </div>

        </form>

        <div className="footer-divider">

            

          <p className="footer-text">
            ยังไม่มีบัญชีสมาชิกสำหรับใช้งาน EA?

            <Link href="/register">
              สมัครสมาชิกใหม่
            </Link>

          </p>

        </div>

      </div>
    </div>

  );
}