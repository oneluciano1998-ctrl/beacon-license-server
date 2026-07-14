import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {

    // =========================
    // Dashboard Stats
    // =========================

    const [stats]: any = await pool.query(`
      SELECT
      (
        SELECT COUNT(*)
        FROM licenses
        WHERE status='active'
      ) AS active_licenses,

      (
        SELECT COUNT(*)
        FROM license_sessions
        WHERE status='active'
      ) AS active_sessions,

      (
        SELECT COUNT(*)
        FROM license_sessions
        WHERE status='active'
        AND TIMESTAMPDIFF(
          SECOND,
          last_heartbeat,
          NOW()
        ) <= 120
      ) AS online_sessions,

      (
        SELECT COUNT(*)
        FROM license_sessions
        WHERE status='active'
        AND TIMESTAMPDIFF(
          SECOND,
          last_heartbeat,
          NOW()
        ) > 120
      ) AS offline_sessions

      FROM DUAL
    `);

    // =========================
    // Live Sessions
    // =========================

    const [sessions]: any = await pool.query(`
      SELECT
        s.id,
        l.license_key,
        s.account_number,
        s.broker,
        s.server_name,
        s.mt5_login,
        s.started_at,
        s.last_heartbeat,

        TIMESTAMPDIFF(
          MINUTE,
          s.started_at,
          NOW()
        ) AS online_minutes

      FROM license_sessions s

      INNER JOIN licenses l
      ON l.id = s.license_id

      WHERE s.status='active'

      ORDER BY s.last_heartbeat DESC

      LIMIT 10
    `);

    // =========================
    // Audit Logs
    // =========================

    const [audits]: any = await pool.query(`
      SELECT
        a.action,
        a.details,
        l.license_key,
        a.created_at

      FROM audit_logs a

      LEFT JOIN licenses l
      ON l.id = a.license_id

      ORDER BY a.id DESC

      LIMIT 10
    `);

    // =========================
    // Alerts
    // =========================

    const [alerts]: any = await pool.query(`
      SELECT
        id,
        type,
        message,
        created_at

      FROM alerts

      ORDER BY id DESC

      LIMIT 10
    `);

    return NextResponse.json({
      success: true,

      stats: stats[0],

      sessions,

      audits,

      alerts,

      health: {

        license_server: "online",

        database: "online",

        api: "online",

        heartbeat:
          stats[0].online_sessions > 0
            ? "online"
            : "offline",

        mt5:
          stats[0].online_sessions > 0
            ? "online"
            : "offline",

      }

    });

  } catch (error) {
    
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );

  }
}