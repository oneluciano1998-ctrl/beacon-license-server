"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./tickets.css";

type Ticket = {
  id: number;
  customer_name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export default function TicketsPage() {

  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [search, setSearch] =
    useState("");

    const [showModal,setShowModal] =
useState(false);

const [customerName,setCustomerName] =
useState("");

const [email,setEmail] =
useState("");

const [subject,setSubject] =
useState("");

const [message,setMessage] =
useState("");

const [editingId, setEditingId] =
useState<number | null>(null);

  useEffect(() => {

    fetch("/api/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
      });

  }, []);

const saveTicket = async () => {

  const url =
    editingId === null
      ? "/api/tickets"
      : `/api/tickets/edit/${editingId}`;

  const method =
    editingId === null
      ? "POST"
      : "PUT";

  const res =
    await fetch(url,{
      method,
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        customer_name:customerName,
        email,
        subject,
        message
      })
    });

  const data =
    await res.json();

  if(data.success){

    alert(
      editingId === null
      ? "Ticket Created"
      : "Ticket Updated"
    );
// saveTicket()
    location.reload();

  }

};

const editTicket = (
  ticket:Ticket
)=>{

  setEditingId(ticket.id);

  setCustomerName(
    ticket.customer_name
  );

  setEmail(
    ticket.email
  );

  setSubject(
    ticket.subject
  );

  setMessage(
    ticket.message
  );

  setShowModal(true);

};

const updateStatus =
async (
  id:number,
  status:string
)=>{

  const res =
  await fetch(
    `/api/tickets/${id}`,
    {
      method:"PUT",

      headers:{
        "Content-Type":
        "application/json"
      },

      body:JSON.stringify({
        status
      })
    }
  );

  const data =
  await res.json();

  if(data.success){
// updateStatus()
    location.reload();

  }

};

const deleteTicket =
async (
  id:number
)=>{

  if(
    !confirm(
      "Delete ticket?"
    )
  ) return;

  const res =
  await fetch(
    `/api/tickets/${id}`,
    {
      method:"DELETE"
    }
  );

  const data =
  await res.json();

  if(data.success){
// deleteTicket()
    location.reload();

  }

};

  const filteredTickets =
tickets.filter((ticket) => {

  const keyword =
  search.toLowerCase();

  return (

    ticket.customer_name
      ?.toLowerCase()
      .includes(keyword)

    ||

    ticket.email
      ?.toLowerCase()
      .includes(keyword)

    ||

    ticket.subject
      ?.toLowerCase()
      .includes(keyword)

  );

});

  return (

    <main
      className="customers-page"
    >

        <div className="customers-header">

        <div className="header-left">

            <Link
            href="/dashboard"
            className="back-btn"
            >
            ← Back to Dashboard
            </Link>

            <span className="page-tag">
            TICKETS
            </span>

            <h1>
            🎫 Ticket Management
            </h1>

            <p>
            Manage support tickets
            </p>

            <div
            style={{
                display:"flex",
                gap:"15px",
                flexWrap:"wrap",
                marginTop:"15px"
            }}
            >

            <div className="stat-card">
                Total Tickets
                <span>
                {tickets.length}
                </span>
            </div>

            <div className="stat-card">
                Open
                <span>
                {
                    tickets.filter(
                    t=>t.status==="open"
                    ).length
                }
                </span>
            </div>

            <div className="stat-card">
                Pending
                <span>
                {
                    tickets.filter(
                    t=>t.status==="pending"
                    ).length
                }
                </span>
            </div>

            <div className="stat-card">
                Closed
                <span>
                {
                    tickets.filter(
                    t=>t.status==="closed"
                    ).length
                }
                </span>
            </div>

            </div>

        </div>

        <div className="header-right">

            <input
            type="text"
            placeholder="🔍 Search customer..."
            value={search}
            onChange={(e)=>
                setSearch(
                e.target.value
                )
            }
            className="search-box"
            />

            <button
            className="add-user-btn"
            onClick={()=>
                setShowModal(true)
            }
            >
            + Add Ticket
            </button>

        </div>

        </div>

                   <div className="table-wrapper">

  <table>

    <thead>
      <tr>
        <th>ID</th>
        <th>Customer</th>
        <th>Email</th>
        <th>Subject</th>
        <th>Status</th>
        <th>Date</th>
        <th className="action-column">
    Action
</th>
      </tr>
    </thead>

    <tbody>

      {filteredTickets.length === 0 ? (

        <tr>
          <td
            colSpan={7}
            style={{
              textAlign:"center",
              padding:"30px"
            }}
          >
            No Tickets Found
          </td>
        </tr>

      ) : (

        filteredTickets.map(
          (ticket)=>(
            <tr key={ticket.id}>

              <td>{ticket.id}</td>

              <td>
                {ticket.customer_name}
              </td>

              <td>
                {ticket.email}
              </td>

              <td>
                {ticket.subject}
              </td>

              <td>

                <span
                className={
                    ticket.status === "open"
                    ? "status-active"
                    : ticket.status === "pending"
                    ? "status-pending"
                    : "status-inactive"
                }
                >
                {ticket.status}
                </span>

              </td>

              <td>
                {new Date(
                  ticket.created_at
                ).toLocaleDateString()}
              </td>

                <td>

                <div className="action-buttons">

                    <button
                    className="edit-btn"
                    onClick={()=>editTicket(ticket)}
                    >
                    Edit
                    </button>

                    <select
                    value={ticket.status}
                    onChange={(e)=>
                        updateStatus(
                        ticket.id,
                        e.target.value
                        )
                    }
                    >

                    <option value="open">
                        Open
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="closed">
                        Closed
                    </option>

                    </select>

                    <button
                    className="delete-btn"
                    onClick={()=>
                        deleteTicket(ticket.id)
                    }
                    >
                    Delete
                    </button>

                </div>

                </td>

            </tr>
          )
        )

      )}

    </tbody>

  </table>

</div>

        {showModal && (

<div className="modal-overlay">

  <div className="modal-box">

    <h2>
{
editingId===null
? "Add Ticket"
: "Edit Ticket"
}
</h2>

    <input
      placeholder="Customer Name"
      value={customerName}
      onChange={(e)=>
        setCustomerName(
          e.target.value
        )
      }
    />

    <input
      placeholder="Email"
      value={email}
      onChange={(e)=>
        setEmail(
          e.target.value
        )
      }
    />

    <input
      placeholder="Subject"
      value={subject}
      onChange={(e)=>
        setSubject(
          e.target.value
        )
      }
    />

    <textarea
      placeholder="Message"
      value={message}
      onChange={(e)=>
        setMessage(
          e.target.value
        )
      }
    />

    <div className="modal-actions">

      <button
        className="save-btn"
        onClick={saveTicket}
      >
        {
editingId===null
? "Save Ticket"
: "Update Ticket"
}
      </button>

      <button
        className="cancel-btn"
        onClick={()=>
          setShowModal(false)
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