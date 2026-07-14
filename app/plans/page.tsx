"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Plan = {
  id: number;
  name: string;
  description: string;
  duration_days: number;
  price: number;
  max_accounts: number;
  status: string;
  created_at: string;
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] =
  useState(false);

  const [editingPlan, setEditingPlan] =
  useState<Plan | null>(null);

const [planName, setPlanName] =
  useState("");

const [description, setDescription] =
  useState("");

const [durationDays, setDurationDays] =
  useState("");

const [price, setPrice] =
  useState("");

const [maxAccounts, setMaxAccounts] =
  useState("1");

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
      });
  }, []);

  const openEditModal = (
  plan: Plan
) => {

  setEditingPlan(plan);

  setPlanName(plan.name);

  setDescription(
    plan.description
  );

  setDurationDays(
    plan.duration_days.toString()
  );

  setPrice(
    plan.price.toString()
  );

  setMaxAccounts(
    plan.max_accounts.toString()
  );

  setShowModal(true);
};

const savePlan = async () => {

  const url = editingPlan
    ? `/api/plans/${editingPlan.id}`
    : "/api/plans";

  const method =
    editingPlan
      ? "PUT"
      : "POST";

  const res = await fetch(
    url,
    {
      method,
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        name: planName,
        description,
        duration_days:
          Number(durationDays),
        price:
          Number(price),
        max_accounts:
          Number(maxAccounts),
      }),
    }
  );

  const data =
    await res.json();

  if (data.success) {

    alert(
      editingPlan
        ? "Plan Updated"
        : "Plan Created"
    );

    location.reload();

  } else {

    alert("Failed");

  }
};

const deletePlan = async (
  id: number
) => {

  const ok = confirm(
    "Delete this plan?"
  );

  if (!ok) return;

  const res = await fetch(
    `/api/plans/${id}`,
    {
      method: "DELETE",
    }
  );

  const data =
    await res.json();

    if (data.success) {

    alert("Deleted");

    location.reload();

    } else {

    alert(
        data.message ||
        "Delete Failed"
    );

    }
}

const togglePlanStatus =
async (
  id: number,
  status: string
) => {

const newStatus =
  status === "active"
    ? "inactive"
    : "active";

  const res = await fetch(
    `/api/plans/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    }
  );

  const data =
    await res.json();

    if (data.success) {

    alert("Updated");

    location.reload();

    } else {

    console.log(data);

    alert(
        data.error ||
        "Failed"
    );

    }
};

const filteredPlans =
  plans.filter((plan) =>
    plan.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );

  const activePlans = plans.filter(
    (p) => p.status === "active"
  ).length;

  const freePlans = plans.filter(
    (p) => Number(p.price) === 0
  ).length;

  const paidPlans = plans.filter(
    (p) => Number(p.price) > 0
  ).length;

  const inactivePlans = plans.filter(
  (p) => p.status === "inactive"
).length;

const sortedPlans =
  [...filteredPlans].sort(
    (a, b) => a.id - b.id
  );

  return (
    <div
      style={{
        padding: "25px",
        color: "white",
      }}
    >
      {/* HEADER */}

      <Link
        href="/dashboard"
        style={{
          color: "#00c3ff",
          textDecoration: "none",
          border: "1px solid #00c3ff",
          padding: "10px 18px",
          borderRadius: "10px",
          display: "inline-block",
          marginBottom: "15px",
        }}
      >
        ← Back to Dashboard
      </Link>

      <div
        style={{
          display: "inline-block",
          marginLeft: "15px",
          background: "#06203d",
          color: "#00c3ff",
          padding: "8px 15px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        PLANS
      </div>

      <h1
        style={{
          marginTop: "20px",
          fontSize: "42px",
        }}
      >
        📦 Plan Management
      </h1>

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "25px",
        }}
      >
        Manage all subscription plans
      </p>

      {/* STAT CARDS */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div className="stat-card">
          Total Plans
          <span>{plans.length}</span>
        </div>

        <div className="stat-card">
          Active Plans
          <span>{activePlans}</span>
        </div>

        <div className="stat-card">
          Free Plans
          <span>{freePlans}</span>
        </div>

        <div className="stat-card">
          Paid Plans
          <span>{paidPlans}</span>
        </div>

        <div className="stat-card">
        Inactive Plans
        <span>{inactivePlans}</span>
        </div>
      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search plan..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "320px",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #1e3a5f",
          background: "#081628",
          color: "white",
          marginBottom: "20px",
        }}
      />

      <button
  onClick={() =>
    setShowModal(true)
  }
  style={{
    marginLeft: "15px",
    background: "#00c3ff",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  + Create Plan
</button>

      {/* TABLE */}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#0c1f3f",
            }}
          >
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Plan</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Duration</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Accounts</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Created</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedPlans.map((plan) => (
            <tr key={plan.id}>
              <td style={tdStyle}>{plan.id}</td>

              <td style={tdStyle}>
                {plan.name}
              </td>

              <td style={tdStyle}>
                {plan.description}
              </td>

            <td style={tdStyle}>
            {plan.duration_days >= 99999
                ? "Lifetime"
                : `${plan.duration_days} Days`}
            </td>

              <td style={tdStyle}>
                ${plan.price}
              </td>

              <td style={tdStyle}>
                {plan.max_accounts}
              </td>

              <td style={tdStyle}>
                <span
                  style={{
                    background:
                      plan.status === "active"
                        ? "#00aa55"
                        : "#ff8800",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                  }}
                >
                  {plan.status}
                </span>
              </td>

              <td style={tdStyle}>
                {new Date(
                    plan.created_at
                ).toLocaleDateString()}
                </td>

              <td style={tdStyle}>
                <button
                onClick={() =>
                    openEditModal(plan)
                }
                style={{
                    background:"#00c3ff",
                    color:"white",
                    border:"none",
                    padding:"8px 14px",
                    borderRadius:"8px",
                    marginRight:"8px",
                    cursor:"pointer",
                }}
                >
                Edit
                </button>

                <button
                onClick={() =>
                    togglePlanStatus(
                    plan.id,
                    plan.status
                    )
                }
                style={{
                    background:
                    plan.status === "active"
                        ? "#f59e0b"
                        : "#00aa55",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginRight: "8px",
                }}
                >
                {plan.status === "active"
                ? "Deactivate"
                : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background:
        "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        width: "500px",
        background: "#081628",
        border:
          "1px solid #1e3a5f",
        borderRadius: "15px",
        padding: "25px",
      }}
    >
      <h2>
  {editingPlan
    ? "Edit Plan"
    : "Create Plan"}
</h2>

      <input
        placeholder="Plan Name"
        value={planName}
        onChange={(e) =>
          setPlanName(
            e.target.value
          )
        }
        style={inputStyle}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
        style={{
          ...inputStyle,
          height: "90px",
        }}
      />

      <input
        placeholder="Duration Days"
        value={durationDays}
        onChange={(e) =>
          setDurationDays(
            e.target.value
          )
        }
        style={inputStyle}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(
            e.target.value
          )
        }
        style={inputStyle}
      />

      <input
        placeholder="Max Accounts"
        value={maxAccounts}
        onChange={(e) =>
          setMaxAccounts(
            e.target.value
          )
        }
        style={inputStyle}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <button
        onClick={savePlan}
        style={{
            background:"#00c3ff",
            border:"none",
            padding:"10px 20px",
            borderRadius:"8px",
            color:"white",
        }}
        >
        {editingPlan
            ? "Update"
            : "Save"}
        </button>

        <button
          onClick={() =>
            setShowModal(false)
          }
          style={{
            background:
              "#666",
            border: "none",
            padding:
              "10px 20px",
            borderRadius: "8px",
            color: "white",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      <style jsx>{`
        .stat-card {
          min-width: 170px;
          padding: 25px;
          border-radius: 15px;
          background: #081628;
          border: 1px solid #1e3a5f;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stat-card span {
          color: #00c3ff;
          font-size: 34px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

const thStyle = {
  padding: "14px",
  textAlign: "left" as const,
  borderBottom: "1px solid #1e3a5f",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #1e3a5f",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #1e3a5f",
  background: "#06111f",
  color: "white",
};