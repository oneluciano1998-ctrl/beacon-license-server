"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./payments.css";

type Payment = {
  id: number;
  user_id: number;
  plan_id: number;
  full_name: string;
  plan_name: string;
  amount: number;
  payment_method: string;
  transaction_ref: string;
  slip_url: string;
  status: string;
  created_at: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [userId, setUserId] = useState("");
  const [planId, setPlanId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("promptpay");

  const loadPayments = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/payments");
      const data = await res.json();

      setPayments(data);
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const keyword = search.toLowerCase();

    return payments.filter((payment) => {
      return (
        payment.full_name?.toLowerCase().includes(keyword) ||
        payment.plan_name?.toLowerCase().includes(keyword) ||
        String(payment.amount).includes(search)
      );
    });
  }, [payments, search]);

  const {
    pendingCount,
    approvedCount,
    rejectedCount,
  } = useMemo(() => {
    return {
      pendingCount: payments.filter(
        (p) => p.status === "pending"
      ).length,

      approvedCount: payments.filter(
        (p) => p.status === "approved"
      ).length,

      rejectedCount: payments.filter(
        (p) => p.status === "rejected"
      ).length,
    };
  }, [payments]);

  const resetForm = () => {
    setUserId("");
    setPlanId("");
    setAmount("");
    setMethod("promptpay");
  };

  const savePayment = async () => {
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: Number(userId),
        plan_id: Number(planId),
        amount: Number(amount),
        payment_method: method,
        slip_url: "",
        transaction_ref: "",
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Payment Created");

      resetForm();

      setShowModal(false);

      await loadPayments();
    }
  };

  const updateStatus = async (
    id: number,
    status: string
  ) => {
    const res = await fetch(
      `/api/payments/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      await loadPayments();
    }
  };

  const deletePayment = async (
    id: number
  ) => {
    if (!confirm("Delete payment?")) return;

    const res = await fetch(
      `/api/payments/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (data.success) {
      await loadPayments();
    }
  };

    return (
    <main className="payments-page">
      <div className="payments-header">
        <div className="payments-header-left">
          <Link
            href="/dashboard"
            className="payments-back-btn"
          >
            ← Back to Dashboard
          </Link>

          <span className="payments-page-tag">
            PAYMENTS
          </span>

          <h1>
            💳 Payment Management
          </h1>

          <p>
            Manage customer payments and
            approvals
          </p>

          <div className="payments-stats-grid">
            <div className="payments-stat-card">
              <small>Total Payments</small>
              <span>{payments.length}</span>
            </div>

            <div className="payments-stat-card">
              <small>Pending</small>
              <span>{pendingCount}</span>
            </div>

            <div className="payments-stat-card">
              <small>Approved</small>
              <span>{approvedCount}</span>
            </div>

            <div className="payments-stat-card">
              <small>Rejected</small>
              <span>{rejectedCount}</span>
            </div>
          </div>
        </div>

        <div className="payments-header-right">
          <input
            type="text"
            className="payments-search-box"
            placeholder="🔍 Search payment..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button
            className="payments-add-user-btn"
            onClick={() =>
              setShowModal(true)
            }
          >
            + Add Payment
          </button>
        </div>
      </div>

      <div className="payments-table-wrapper">
        <table className="payments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="payments-empty-state"
                >
                  Loading payments...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="payments-empty-state"
                >
                  No payments found.
                </td>
              </tr>
            ) : (

                            filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>

                  <td>{payment.full_name}</td>

                  <td>{payment.plan_name}</td>

                  <td>${payment.amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
})}</td>

                  <td>{payment.payment_method}</td>

                  <td>
                    <span
                      className={`payments-status-${payment.status}`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      payment.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="payments-action-buttons">
                      <button
                        className="payments-edit-btn"
                        disabled={
                          payment.status ===
                          "approved"
                        }
                        onClick={() =>
                          updateStatus(
                            payment.id,
                            "approved"
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="payments-reject-btn"
                        disabled={
                          payment.status ===
                          "rejected"
                        }
                        onClick={() =>
                          updateStatus(
                            payment.id,
                            "rejected"
                          )
                        }
                      >
                        Reject
                      </button>

                      <button
                        className="payments-delete-btn"
                        onClick={() =>
                          deletePayment(
                            payment.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="payments-modal-overlay">
          <div className="payments-modal-box">
            <h2>Add Payment</h2>

            <input
              placeholder="User ID"
              value={userId}
              onChange={(e) =>
                setUserId(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Plan ID"
              value={planId}
              onChange={(e) =>
                setPlanId(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Payment Method"
              value={method}
              onChange={(e) =>
                setMethod(
                  e.target.value
                )
              }
            />

                        <div className="payments-modal-actions">
              <button
                className="payments-save-btn"
                onClick={savePayment}
              >
                Save Payment
              </button>

              <button
                className="payments-cancel-btn"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}