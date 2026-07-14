"use client";

import { useEffect, useState } from "react";
import "./customers.css";
import Link from "next/link";

interface Customer {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(4);
  const [editingCustomer, setEditingCustomer] =
  useState<Customer | null>(null);

const [editName, setEditName] = useState("");
const [editEmail, setEditEmail] = useState("");

const fetchCustomers = async () => {
  try {
    const res = await fetch("/api/customers");
    const data = await res.json();

    if (data.success) {
      setCustomers(data.customers);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchCustomers();
}, []);

    const saveCustomer = async () => {

    const res = await fetch("/api/customers", {
        method: "POST",

        headers: {
        "Content-Type": "application/json",
        },

        body: JSON.stringify({
        full_name: fullName,
        email,
        password_hash: password,
        role_id: roleId,
        status: "active",
        }),
    });

const data = await res.json();

console.log("Response:", data);

if (data.success) {

    alert("Customer Created");

    setShowModal(false);

    fetchCustomers();

    setFullName("");
    setEmail("");
    setPassword("");
    setRoleId(4);

} else {

    alert(data.message || "Create Failed");
    console.log(data);

}
    }

    const openEditModal = (customer: Customer) => {
  setEditingCustomer(customer);

  setEditName(customer.full_name);
  setEditEmail(customer.email);
};

const updateCustomer = async () => {
  if (!editingCustomer) return;

  const res = await fetch(
    `/api/customers/${editingCustomer.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: editName,
        email: editEmail,
      }),
    }
  );

  const data = await res.json();

if (data.success) {

    alert("Customer Updated");

    setEditingCustomer(null);

    fetchCustomers();

} else {
    alert("Update Failed");
  }
};

const deleteCustomer = async (id: number) => {

  const confirmDelete = confirm(
    "Delete this customer?"
  );

  if (!confirmDelete) return;

  const res = await fetch(
    `/api/customers/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json();

if (data.success) {

    alert("Customer Deleted");

    fetchCustomers();

} else {
    alert("Delete Failed");
  }
};

  return (
    
<main className="customers-page">

  <div className="customers-header">

    {/* ==========================
        Left
    ========================== */}

    <div className="customers-header-left">

      <div className="customers-header-top">

        <Link
          href="/dashboard"
          className="customers-back-btn"
        >
          ← Back to Dashboard
        </Link>

        <div className="customers-page-tag">
          BEACON LICENSE SERVER
        </div>

      </div>

      <h1 className="customers-page-title">
        👥 Customer Management
      </h1>

      <p className="customers-page-description">
        Manage all customers, licenses and account status
      </p>

      <div className="customers-stat-card">
        <h3>Total Customers</h3>
        <span>{customers.length}</span>
      </div>

    </div>

    {/* ==========================
        Right
    ========================== */}

    <div className="customers-header-right">

      <input
        type="text"
        placeholder="🔍 Search customer..."
        className="customers-search-box"
      />

      <button
        className="customers-add-btn"
        onClick={() => setShowModal(true)}
      >
        + Add Customer
      </button>

    </div>

  </div>

      <div className="customers-table-wrapper">
      <table className="customers-table">
        <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
        </thead>
        

<tbody>

{customers.length === 0 ? (

<tr>

<td
    colSpan={6}
    className="customers-empty-state"
>
    No Customers Found
</td>

</tr>

) : (

customers.map((customer) => (

<tr key={customer.id}>

    <td>{customer.id}</td>

    <td>{customer.full_name}</td>

    <td>{customer.email}</td>

    <td>{customer.role}</td>

    <td>
        <span className="customers-status-active">
            Active
        </span>
    </td>

    <td>

        <button
            className="customers-edit-btn"
            onClick={() => openEditModal(customer)}
        >
            Edit
        </button>

        <button
            className="customers-delete-btn"
            onClick={() => deleteCustomer(customer.id)}
        >
            Delete
        </button>

    </td>

</tr>

))

)}

</tbody>

      </table>
      </div>

      {showModal && (

<div className="customers-modal-overlay">

  <div className="customers-modal-box">

    <h2>Add Customer</h2>

    <input
      placeholder="Full Name"
      value={fullName}
      onChange={(e) =>
        setFullName(e.target.value)
      }
    />

    <input
      placeholder="Email"
      value={email}
      onChange={(e) =>
        setEmail(e.target.value)
      }
    />

    <input
      placeholder="Password"
      value={password}
      onChange={(e) =>
        setPassword(e.target.value)
      }
    />

    <div className="customers-modal-actions">

    <select
        value={roleId}
        onChange={(e) =>
        setRoleId(Number(e.target.value))
        }
    >
        <option value={1}>CEO</option>
        <option value={2}>Developer</option>
        <option value={3}>Admin</option>
        <option value={4}>Customer</option>
    </select>

    <button
        className="customers-save-btn"
        onClick={saveCustomer}
    >
        Save Customer
    </button>

    <button
        className="customers-cancel-btn"
        onClick={() => setShowModal(false)}
    >
        Cancel
    </button>

    </div>

  </div>

</div>

)}

{editingCustomer && (
  <div className="customers-modal-overlay">
    <div className="customers-modal-box">

      <h2>Edit Customer</h2>

      <input
        value={editName}
        onChange={(e) =>
          setEditName(e.target.value)
        }
      />

      <input
        value={editEmail}
        onChange={(e) =>
          setEditEmail(e.target.value)
        }
      />
      <div className="customers-modal-actions">

      <button
        className="customers-save-btn"
        onClick={updateCustomer}
      >
        Save Changes
      </button>

      <button
        className="customers-cancel-btn"
        onClick={() =>
          setEditingCustomer(null)
        }
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
