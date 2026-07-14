"use client";

import { useEffect, useState } from "react";
import "./license.css";
import Link from "next/link";

type License = {
  id: number;
  license_key: string;
  account_number: number;
  plan_name: string;
  full_name: string;
  status: string;

  created_at: string;
  expire_date: string;
};

type Customer = {
  id: number;
  full_name: string;
};

type Plan = {
  id: number;
  name: string;
};

export default function LicensesPage() {
const [licenses, setLicenses] = useState<License[]>([]);
const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);
const [customers, setCustomers] = useState<Customer[]>([]);
const [selectedCustomer, setSelectedCustomer] = useState("");
const [plans, setPlans] = useState<Plan[]>([]);
const [selectedPlan, setSelectedPlan] = useState("1");
const [accountNumber, setAccountNumber] = useState("");
const [editingLicense, setEditingLicense] =
  useState<License | null>(null);
const [viewLicense, setViewLicense] =
  useState<License | null>(null);

const [editAccount, setEditAccount] = useState("");
const [editStatus, setEditStatus] = useState("");

const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] =
  useState("all");

const [currentPage, setCurrentPage] =
  useState(1);

const licensesPerPage = 10;

const now = new Date().getTime();

    const getDaysLeft = (
  expireDate: string
) => {

  return Math.ceil(
    (
      new Date(expireDate).getTime() -
      now
    ) /
    (1000 * 60 * 60 * 24)
  );

};

const fetchLicenses = async () => {

  try {

    setLoading(true);

    const res = await fetch("/api/licenses");
    const data = await res.json();

    setLicenses(data.licenses ?? data);

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }

};

const fetchCustomers = async () => {

  try {

    const res = await fetch("/api/customers");
    const data = await res.json();

    setCustomers(data.customers ?? []);

    if (data.customers?.length > 0) {

      setSelectedCustomer(
        String(data.customers[0].id)
      );

    }

  } catch (err) {

    console.error(err);

  }

};

const fetchPlans = async () => {

    try {

        const res = await fetch("/api/plans");
        const data = await res.json();

        const planList = data.plans ?? data;

        setPlans(planList);

        if (planList.length > 0) {
            setSelectedPlan(String(planList[0].id));
        }

    } catch (err) {

        console.error(err);

    }

};

useEffect(() => {

  fetchLicenses();
  fetchCustomers();
  fetchPlans();

}, []);

const saveLicense = async () => {

    console.log({
  selectedCustomer,
  selectedPlan,
  accountNumber,
});

const res = await fetch(
    "/api/licenses",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: selectedCustomer,
        plan_id: selectedPlan,
        account_number: accountNumber,
      }),
    }
  );

const data = await res.json();

if (data.success) {

    alert("License Created");

    setShowModal(false);

    setAccountNumber("");

    await fetchLicenses();

} else {
    alert("Create Failed");
  }
};

const deleteLicense = async (
  id: number
) => {

const confirmDelete = confirm(
    "Delete this license?"
  );

  if (!confirmDelete) return;

const res = await fetch(
    `/api/licenses/${id}`,
    {
      method: "DELETE",
    }
  );

const data = await res.json();

if (data.success) {

    alert("License Deleted");

    await fetchLicenses();

} else {

    alert("Delete Failed");

  }
};

const openEditModal = (
  license: License
) => {

  setEditingLicense(license);

  setEditAccount(
    String(license.account_number)
  );

  setEditStatus(
    license.status
  );
};

const updateLicense = async () => {

  if (!editingLicense) return;

const res = await fetch(
    `/api/licenses/${editingLicense.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_number: editAccount,
        plan_id: selectedPlan,
        status: editStatus,
      }),
    }
  );

const data = await res.json();

if (data.success) {

    alert("License Updated");

    setEditingLicense(null);

    await fetchLicenses();

} else {

    alert("Update Failed");

  }
};

const filteredLicenses = licenses.filter(
  (license) => {

    const matchSearch =
      license.license_key
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      String(license.account_number)
        .includes(search) ||

      license.full_name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all"
        ? true
        : license.status ===
          statusFilter;

    return (
      matchSearch &&
      matchStatus
    );
  }
);

const activeCount = licenses.filter(
  (l) => l.status === "active"
).length;

const expiredCount = licenses.filter(
  (l) => l.status === "expired"
).length;

const disabledCount = licenses.filter(
  (l) => l.status === "disabled"
).length;

const expiringSoonCount =
  licenses.filter((license) => {

    if (!license.expire_date)
      return false;

    const daysLeft =
      getDaysLeft(
        license.expire_date
      );

    return (
      daysLeft <= 7 &&
      daysLeft >= 0
    );

  }).length;

const copyLicense = (
  id: number,
  licenseKey: string
) => {

  navigator.clipboard.writeText(
    licenseKey
  );

  setCopiedId(id);

  setTimeout(() => {
    setCopiedId(null);
  }, 2000);
};

const [copiedId, setCopiedId] =
  useState<number | null>(null);

const totalPages = Math.max(
  1,
  Math.ceil(
    filteredLicenses.length /
    licensesPerPage
  )
);

const startIndex =
  (currentPage - 1) *
  licensesPerPage;

const currentLicenses =
  filteredLicenses.slice(
    startIndex,
    startIndex + licensesPerPage
  );

  if (loading) {

  return (

    <main className="licenses-page">

      <div className="licenses-loading">
        Loading licenses...
      </div>

    </main>

  );

}

return (

<main className="licenses-page">

    {/* ==========================================================
        Header
    ========================================================== */}

    <div className="licenses-header">

        <div className="licenses-header-left">

            <div className="licenses-header-top">

                <Link
                    href="/dashboard"
                    className="licenses-back-btn"
                >
                    ← Back to Dashboard
                </Link>

                <div className="licenses-page-tag">
                    BEACON LICENSE SERVER
                </div>

            </div>

            <h1 className="licenses-page-title">
                🔑 License Management
            </h1>

            <p className="licenses-page-description">
                Manage all licenses, plans and account binding
            </p>

            {/* ==========================
                Statistics
            ========================== */}

            <div className="licenses-stats-grid">

                <div className="licenses-stat-card">
                    <h3>Total Licenses</h3>
                    <span>{licenses.length}</span>
                </div>

                <div className="licenses-stat-card">
                    <h3>Active</h3>
                    <span>{activeCount}</span>
                </div>

                <div className="licenses-stat-card">
                    <h3>Expired</h3>
                    <span>{expiredCount}</span>
                </div>

                <div className="licenses-stat-card">
                    <h3>Disabled</h3>
                    <span>{disabledCount}</span>
                </div>

                <div className="licenses-stat-card">
                    <h3>Expiring Soon</h3>
                    <span>{expiringSoonCount}</span>
                </div>

            </div>

        </div>

        {/* ==========================
            Header Right
        ========================== */}

        <div className="licenses-header-right">

            <input
                type="text"
                placeholder="🔍 Search license..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}
                className="licenses-search-box"
            />

            <select
                value={statusFilter}
                onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                }}
                className="licenses-status-filter"
            >
                <option value="all">
                    All Status
                </option>

                <option value="active">
                    Active
                </option>

                <option value="expired">
                    Expired
                </option>

                <option value="disabled">
                    Disabled
                </option>

            </select>

            <button
                className="licenses-create-btn"
                onClick={() => setShowModal(true)}
            >
                + Create License
            </button>

        </div>

    </div>

    {/* ==========================================================
        License Table
    ========================================================== */}

    <div className="licenses-table-wrapper">

        <table className="licenses-table">
            <thead>

                <tr>

                    <th>ID</th>
                    <th>License Key</th>
                    <th>Account</th>
                    <th>Plan</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Expire</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th>View</th>
                    <th>Copy</th>
                    <th>Days Left</th>

                </tr>

            </thead>

<tbody>

  {currentLicenses.length === 0 ? (

    <tr>

        <td
            colSpan={12}
            className="licenses-empty-state"
        >
            No licenses found.
        </td>

    </tr>

) : (

    currentLicenses.map((license) => {

        const daysLeft = license.expire_date
            ? getDaysLeft(license.expire_date)
            : null;

        return (

            <tr key={license.id}>

                <td>{license.id}</td>

                <td>{license.license_key}</td>

                <td>{license.account_number}</td>

                <td>{license.plan_name}</td>

                <td>{license.full_name}</td>

                <td>
                    {license.created_at
                        ? new Date(
                              license.created_at
                          ).toLocaleDateString()
                        : "-"}
                </td>

                <td>
                    {license.expire_date
                        ? new Date(
                              license.expire_date
                          ).toLocaleDateString()
                        : "-"}
                </td>

                {/* ==========================
                    Status
                ========================== */}

                <td>

                    <span
                        className={`licenses-status-badge licenses-status-${license.status}`}
                    >
                        {license.status}
                    </span>

                </td>

                {/* ==========================
                    Action
                ========================== */}

                <td>

                    <button
                        className="licenses-edit-btn"
                        onClick={() =>
                            openEditModal(license)
                        }
                    >
                        Edit
                    </button>

                    <button
                        className="licenses-delete-btn"
                        onClick={() =>
                            deleteLicense(license.id)
                        }
                    >
                        Delete
                    </button>

                </td>

                {/* ==========================
                    View
                ========================== */}

                <td>

                    <button
                        className="licenses-view-btn"
                        onClick={() =>
                            setViewLicense(license)
                        }
                    >
                        View
                    </button>

                </td>

                {/* ==========================
                    Copy
                ========================== */}

                <td>

                    <button
                        className="licenses-copy-btn"
                        onClick={() =>
                            copyLicense(
                                license.id,
                                license.license_key
                            )
                        }
                    >
                        {copiedId === license.id
                            ? "Copied!"
                            : "Copy"}
                    </button>

                </td>

                {/* ==========================
                    Days Left
                ========================== */}

                <td>

                    {!license.expire_date ? (

                        "-"

                    ) : daysLeft! < 0 ? (

                        <span className="licenses-expired-text">
                            Expired
                        </span>

                    ) : (

                        <span
                            className={
                                daysLeft! <= 3
                                    ? "licenses-danger-text"
                                    : "licenses-info-text"
                            }
                        >
                            {daysLeft} days
                        </span>

                    )}

                </td>

            </tr>

        );

    })

)}

</tbody>
</table>
</div>


{/* ==========================================================
    Pagination
========================================================== */}

<div className="licenses-pagination">

    <button
        className="licenses-pagination-btn"
        disabled={currentPage === 1}
        onClick={() =>
            setCurrentPage(currentPage - 1)
        }
    >
        Previous
    </button>

    <span className="licenses-pagination-info">
        Page {currentPage} / {totalPages}
    </span>

    <button
        className="licenses-pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() =>
            setCurrentPage(currentPage + 1)
        }
    >
        Next
    </button>

</div>

{/* ==========================================================
    Create License Modal
========================================================== */}

{showModal && (

    <div className="licenses-modal-overlay">

        <div className="licenses-modal-box">

            <h2>Create License</h2>

            <select
                className="licenses-form-input"
                value={selectedCustomer}
                onChange={(e) =>
                    setSelectedCustomer(e.target.value)
                }
            >

                <option value="">
                    Select Customer
                </option>

                {customers.map((customer) => (

                    <option
                        key={customer.id}
                        value={customer.id}
                    >
                        {customer.full_name}
                    </option>

                ))}

            </select>

            <select
                className="licenses-form-input"
                value={selectedPlan}
                onChange={(e) =>
                    setSelectedPlan(e.target.value)
                }
            >

                {plans.map((plan) => (

                    <option
                        key={plan.id}
                        value={plan.id}
                    >
                        {plan.name}
                    </option>

                ))}

            </select>

            <input
                className="licenses-form-input"
                placeholder="MT4/MT5 Account"
                value={accountNumber}
                onChange={(e) =>
                    setAccountNumber(e.target.value)
                }
            />

            <div className="licenses-modal-actions">

                <button
                    className="licenses-save-btn"
                    onClick={saveLicense}
                >
                    Save
                </button>

                <button
                    className="licenses-cancel-btn"
                    onClick={() => setShowModal(false)}
                >
                    Cancel
                </button>

            </div>

        </div>

    </div>

)}

{/* ==========================================================
    Edit License Modal
========================================================== */}

{editingLicense && (

    <div className="licenses-modal-overlay">

        <div className="licenses-modal-box">

            <h2>Edit License</h2>

            <input
                className="licenses-form-input"
                value={editAccount}
                onChange={(e) =>
                    setEditAccount(e.target.value)
                }
            />

            <select
                className="licenses-form-input"
                value={editStatus}
                onChange={(e) =>
                    setEditStatus(e.target.value)
                }
            >

                <option value="active">
                    Active
                </option>

                <option value="expired">
                    Expired
                </option>

                <option value="disabled">
                    Disabled
                </option>

            </select>

            <div className="licenses-modal-actions">

                <button
                    className="licenses-save-btn"
                    onClick={updateLicense}
                >
                    Save Changes
                </button>

                <button
                    className="licenses-cancel-btn"
                    onClick={() =>
                        setEditingLicense(null)
                    }
                >
                    Cancel
                </button>

            </div>

        </div>

    </div>

)}
{/* ==========================================================
    View License Modal
========================================================== */}

{viewLicense && (

    <div className="licenses-modal-overlay">

        <div className="licenses-modal-box licenses-modal-view">

            <h2>License Details</h2>

            <p>
                <strong>ID:</strong> {viewLicense.id}
            </p>

            <p>
                <strong>License Key:</strong> {viewLicense.license_key}
            </p>

            <p>
                <strong>Owner:</strong> {viewLicense.full_name}
            </p>

            <p>
                <strong>Account:</strong> {viewLicense.account_number}
            </p>

            <p>
                <strong>Plan:</strong> {viewLicense.plan_name}
            </p>

            <p>
                <strong>Status:</strong> {viewLicense.status}
            </p>

            <div className="licenses-modal-actions">

                <button
                    className="licenses-save-btn"
                    onClick={() => setViewLicense(null)}
                >
                    Close
                </button>

            </div>

        </div>

    </div>

)}

</main>

);
}