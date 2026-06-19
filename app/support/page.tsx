import Link from "next/link";
import "./support.css";

export default function SupportPage() {
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

      <section className="support-hero">
        <h1>Support Center</h1>

        <p>
          ทีมงาน Beast Tamer พร้อมช่วยเหลือคุณตลอดการใช้งาน
        </p>
      </section>

      <section className="support-grid">
        <div className="support-card">
          <h3>📱 LINE OA</h3>

          <p>ติดต่อแอดมินและรับการช่วยเหลืออย่างรวดเร็ว</p>
        </div>

        <div className="support-card">
          <h3>💬 Telegram</h3>

          <p>รับข่าวสารและอัปเดตล่าสุดของ EA</p>
        </div>

        <div className="support-card">
          <h3>📘 Facebook</h3>

          <p>ติดตามผลการเทรด รีวิว และโปรโมชั่น</p>
        </div>
      </section>

      <section className="support-hours">
        <h2>Support Hours</h2>

        <p>Monday - Sunday</p>

        <p>09:00 - 22:00 (GMT+7)</p>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-card">
          <h3>EA ใช้งานกับ Broker อะไรได้บ้าง?</h3>

          <p>รองรับ MT5 ทุกโบรกเกอร์หลัก</p>
        </div>

        <div className="faq-card">
          <h3>มีทดลองใช้งานไหม?</h3>

          <p>มี Trial 14 วันสำหรับลูกค้าใหม่</p>
        </div>

        <div className="faq-card">
          <h3>มีอัปเดตฟรีหรือไม่?</h3>

          <p>ลูกค้า Standard และ VIP ได้รับอัปเดตฟรี</p>
        </div>
      </section>

      <section className="contact-admin">
        <h2>Need Help?</h2>

        <p>ติดต่อทีมงาน Beast Tamer ได้ทันที</p>

        <a
          href="https://lin.ee/PebN8DB"
          target="_blank"
          className="contact-btn"
        >
          Contact Admin
        </a>
      </section>
    </>
  );
}