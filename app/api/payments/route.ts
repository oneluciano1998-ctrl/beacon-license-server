import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ==============================
// GET ALL PAYMENTS
// ==============================
export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT
        p.id,
        u.full_name,
        u.email,
        pl.name AS plan_name,
        p.amount,
        p.payment_method,
        p.transaction_ref,
        p.slip_url,
        p.status,
        p.created_at
      FROM payments p
      LEFT JOIN users u
        ON p.user_id = u.id
      LEFT JOIN plans pl
        ON p.plan_id = pl.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json(rows);

  } catch (error: any) {

    console.error("Payments API Error");
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {

    try{

        const body = await req.json();

        const {

            user_id,
            plan_id,
            amount,
            payment_method,
            slip_url,
            transaction_ref,
            status

        } = body;

        const [result]:any = await pool.query(

            `INSERT INTO payments
            (
                user_id,
                plan_id,
                amount,
                payment_method,
                slip_url,
                transaction_ref,
                status
            )

            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )`,

            [

                user_id,
                plan_id,
                amount,
                payment_method,
                slip_url,
                transaction_ref,
                status

            ]

        );

        return NextResponse.json({

            success:true,
            id:result.insertId

        });

    }
    catch(error){

        console.log(error);

        return NextResponse.json(

            {error:"Create payment failed"},

            {status:500}

        );

    }

}