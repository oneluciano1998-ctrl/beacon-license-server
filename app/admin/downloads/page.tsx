"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./downloads.css";

type Download = {
  id: number;
  title: string;
  version: string;
  category: string;
  file_name: string;
  file_path: string;
  file_size: string;
  download_count: number;
  status: string;
  created_at: string;
};

export default function DownloadsPage() {

const [downloads, setDownloads] =
useState<Download[]>([]);

const [search, setSearch] =
useState("");

const [showModal, setShowModal] =
useState(false);

const [editingDownload, setEditingDownload] =
useState<Download | null>(null);

const [title, setTitle] =
useState("");

const [version, setVersion] =
useState("");

const [category, setCategory] =
useState("Expert Advisor");

const [fileName, setFileName] =
useState("");

const [filePath, setFilePath] =
useState("");

const [fileSize, setFileSize] =
useState("");

const [selectedFile, setSelectedFile] =
useState<File | null>(null);

const [oldFileName, setOldFileName] =
useState("");

const [saving, setSaving] =
useState(false);

// =======================================
// Load Downloads
// =======================================

const loadDownloads = async () => {

    try {

        const res =
        await fetch("/api/downloads");

        const data =
        await res.json();

        if (Array.isArray(data)) {
    setDownloads(data);
}

    } catch (err) {

        console.error(err);

    }

};

useEffect(() => {

    loadDownloads();

}, []);

// =======================================
// Handle File
// =======================================

const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
) => {

    const file =
    e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    setFileName(file.name);

    setFileSize(
        (
            file.size /
            1024 /
            1024
        ).toFixed(2) + " MB"
    );

    setFilePath(
        "/uploads/" + file.name
    );

};

// =======================================
// Open Edit
// =======================================

const openEditModal = (
    download: Download
) => {

    setEditingDownload(download);

    setTitle(download.title);

    setVersion(download.version);

    setCategory(download.category);

    setFileName(download.file_name);

    setOldFileName(download.file_name);

    setFilePath(download.file_path);

    setFileSize(download.file_size);

    setSelectedFile(null);

    setShowModal(true);

};

// =======================================
// Save Download
// =======================================

const saveDownload = async () => {

      if (saving) return;

    setSaving(true);

    // EDIT

    if (editingDownload) {

        const res =
        await fetch(
            `/api/downloads/${editingDownload.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    title,

                    version,

                    category,

                    status:
                    editingDownload.status

                })

            }
        );

        const data =
        await res.json();

        if (data.success) {

            alert("Download Updated");

            await loadDownloads();

            setShowModal(false);

        }

        setSaving(false);

        return;

    }

    // CREATE

    if (!selectedFile) {

        alert("Please select a file");

        setSaving(false);

        return;

    }

    const uploadForm =
    new FormData();

    uploadForm.append(
        "file",
        selectedFile
    );

    const uploadRes =
    await fetch(
        "/api/downloads/upload",
        {
            method: "POST",
            body: uploadForm
        }
    );

    const uploadData =
    await uploadRes.json();

    if (!uploadData.success) {

        alert("Upload failed");

        setSaving(false);

        return;

    }

    const res =
    await fetch(
        "/api/downloads",
        {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                title,

                version,

                category,

                file_name:
                uploadData.file_name,

                file_path:
                uploadData.file_path,

                file_size:
                uploadData.file_size

            })

        }
    );

    const data =
    await res.json();

    if (data.success) {

        alert("Download Created");

        await loadDownloads();
        setTitle("");
        setVersion("");
        setCategory("Expert Advisor");
        setSelectedFile(null);

        setShowModal(false);

    }

    setSaving(false);

};

// =======================================
// Delete
// =======================================

const deleteDownload =
async (id: number) => {

    if (
        !confirm(
            "Delete download?"
        )
    ) return;

    const res =
    await fetch(
        `/api/downloads/${id}`,
        {
            method: "DELETE"
        }
    );

    const data =
    await res.json();

    if (data.success) {

        alert("Download Deleted");

        await loadDownloads();

    }

};

// =======================================
// Toggle Status
// =======================================

const toggleStatus =
async (
    download: Download
) => {

    const newStatus =
    download.status === "active"
        ? "inactive"
        : "active";

    const res =
    await fetch(
        `/api/downloads/${download.id}`,
        {

            method: "PUT",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
                status: newStatus
            })

        }
    );

    const data =
    await res.json();

    if (data.success) {

        await loadDownloads();

    }

};

// =======================================
// Filter
// =======================================

const filteredDownloads =
downloads.filter(
    (download) => {

        const keyword =
        search.toLowerCase();

        return (

            download.title
            ?.toLowerCase()
            .includes(keyword)

            ||

            download.version
            ?.toLowerCase()
            .includes(keyword)

        );

    }
);

// =======================================
// Stats
// =======================================

const activeCount =
downloads.filter(
    d => d.status === "active"
).length;

const inactiveCount =
downloads.filter(
    d => d.status === "inactive"
).length;

  return (
    <main className="downloads-page">

      <div className="downloads-header">

  <div className="downloads-header-left">

    <Link
      href="/dashboard"
      className="downloads-back-btn"
    >
      ← Back to Dashboard
    </Link>

    <span className="downloads-page-tag">
      DOWNLOADS
    </span>

    <h1>
      📦 Download Management
    </h1>

    <p>
      Manage EA files and downloads
    </p>

      <div className="downloads-stats-grid">  

      <div className="downloads-stat-card">

      <small>Total Files</small>

      <span>{downloads.length}</span>

      </div>

      <div className="downloads-stat-card">
          <small>Active</small>
          <span>{activeCount}</span>
      </div>

      <div className="downloads-stat-card">
          <small>Inactive</small>
          <span>{inactiveCount}</span>
      </div>

    </div>

  </div>

  <div className="downloads-header-right">

    <input
      type="text"
      placeholder="🔍 Search file..."
      value={search}
      onChange={(e) =>
        setSearch(
          e.target.value
        )
      }
      className="downloads-search-box"
    />

    <button
    className="downloads-add-btn"
    onClick={() => {

    setEditingDownload(null);

    setTitle("");

    setVersion("");

    setCategory("Expert Advisor");

    setFileName("");

    setFilePath("");

    setFileSize("");

    setSelectedFile(null);

    setOldFileName("");

    setSaving(false);

    setShowModal(true);

    }}
    >
    + Add Download
    </button>

  </div>

</div>

<div className="downloads-table-wrapper">

<table className="downloads-table">

<thead>
<tr>
<th>ID</th>
<th>Title</th>
<th>Version</th>
<th>Category</th>
<th>Size</th>
<th>Downloads</th>
<th>Status</th>
<th>Created</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{filteredDownloads.length === 0 ? (

<tr>

<td
colSpan={9}
style={{
textAlign:"center",
padding:"30px"
}}
>
📂 No Downloads Found
</td>

</tr>

) : (

filteredDownloads.map(
(download) => (

<tr key={download.id}>

<td>{download.id}</td>

<td>{download.title}</td>

<td>{download.version}</td>

<td>{download.category}</td>

<td>{download.file_size}</td>

<td>{download.download_count}</td>

<td>

<span
className={`downloads-status-${download.status}`}
>
{download.status}
</span>

</td>

<td>
{new Date(
download.created_at
).toLocaleDateString()}
</td>

<td>

<div className="downloads-action-buttons">

<button
    className="downloads-download-btn"
    onClick={() => {

        window.open(
            encodeURI(
                `/api/downloads/file/${download.file_name}`
            ),
            "_blank"
        );

    }}
>
    Download
</button>

<button
    className="downloads-edit-btn"
    onClick={() => {

        openEditModal(download);

    }}
>
    Edit
</button>

<button
    className={`downloads-status-btn ${
        download.status === "active"
            ? "active"
            : "inactive"
    }`}
    onClick={() => {

        toggleStatus(download);

    }}
>
    {download.status === "active"
        ? "Active"
        : "Inactive"}
</button>

<button
    className="downloads-delete-btn"
    onClick={() => {

        deleteDownload(download.id);

    }}
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

<div className="downloads-modal-overlay">

<div className="downloads-modal-box">

<h2>

{editingDownload
? "Edit Download"
: "Add Download"}

</h2>

<input
placeholder="Title"
value={title}
onChange={(e)=>
setTitle(
e.target.value
)
}
/>

<input
placeholder="Version"
value={version}
onChange={(e)=>
setVersion(
e.target.value
)
}
/>

<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="downloads-modal-select"
>
  <option value="Expert Advisor">Expert Advisor</option>
  <option value="SET File">SET File</option>
  <option value="PDF Guide">PDF Guide</option>
  <option value="ZIP Package">ZIP Package</option>
</select>

<div className="downloads-current-file">

Current File

<br/>

<strong>
    {oldFileName || "No file selected"}
</strong>

</div>

<input
  type="file"
  accept=".mq5,.ex5,.set,.zip,.pdf"
  onChange={handleFileChange}
/>

<div className="downloads-modal-actions">

<button
    className="downloads-save-btn"
    onClick={saveDownload}
    disabled={saving}
>
    {saving
        ? "Saving..."
        : editingDownload
            ? "Update Download"
            : "Save Download"}
</button>

<button
className="downloads-cancel-btn"
onClick={() => {

    setTitle("");

    setVersion("");

    setCategory("Expert Advisor");

    setSelectedFile(null);

    setOldFileName("");

    setEditingDownload(null);

    setSaving(false);

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
