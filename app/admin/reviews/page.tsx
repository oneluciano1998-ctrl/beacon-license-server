"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./reviews.css";

type Review = {
  id:number;
  customer_name:string;
  rating:number;
  review_text:string;
  image_url:string;
  status:string;
  created_at:string;
};

export default function ReviewsPage(){

  const [reviews,setReviews] =
  useState<Review[]>([]);

  const [search,setSearch] =
  useState("");

  const [showModal,setShowModal] =
  useState(false);

  const [customerName,setCustomerName] =
  useState("");

  const [rating,setRating] =
  useState("5");

  const [reviewText,setReviewText] =
  useState("");

  const [imageUrl,setImageUrl] =
  useState("");

  const [saving, setSaving] =
  useState(false);

const loadReviews = async () => {

  try {

    const res = await fetch("/api/reviews");
    const data = await res.json();

    setReviews(data);

  } catch (err) {

    console.error("Failed to load reviews:", err);

  }

};

useEffect(() => {

  loadReviews();

}, []);

const saveReview = async () => {

    if (saving) return;

    if (
        !customerName.trim() ||
        !reviewText.trim()
    ) {
        alert("Please fill all required fields.");
        return;
    }

    setSaving(true);

    try {

        const res = await fetch(
            "/api/reviews",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customer_name: customerName,
                    rating: Number(rating),
                    review_text: reviewText,
                    image_url: imageUrl
                })
            }
        );

        const data = await res.json();

        if (data.success) {

            alert("Review Created");

            setCustomerName("");
            setRating("5");
            setReviewText("");
            setImageUrl("");

            setShowModal(false);

            await loadReviews();

        } else {

            alert("Failed to create review.");

        }

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");

    } finally {

        setSaving(false);

    }

};

const filteredReviews =
reviews.filter((review)=>{

    const keyword =
    search.toLowerCase();

    return (
        review.customer_name
        ?.toLowerCase()
        .includes(keyword)

        ||

        review.review_text
        ?.toLowerCase()
        .includes(keyword)

        ||

        review.status
        ?.toLowerCase()
        .includes(keyword)
    );

});

  const activeCount =
  reviews.filter(
    r=>r.status==="active"
  ).length;

  const inactiveCount =
  reviews.filter(
    r=>r.status==="inactive"
  ).length;

      const updateStatus =
async (
  id:number,
  status:string
)=>{

  const res =
  await fetch(
    `/api/reviews/${id}`,
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

  if (data.success) {

      await loadReviews();

  }

};

const deleteReview =
async (
  id:number
)=>{

  if(
    !confirm(
      "Delete this review permanently?"
    )
  ) return;

  const res =
  await fetch(
    `/api/reviews/${id}`,
    {
      method:"DELETE"
    }
  );

  const data =
  await res.json();

  if (data.success) {

      await loadReviews();

  }

};

  return(

    <main className="reviews-page">

      <div
        className="
        reviews-header
        "
      >

        <div
          className="
          reviews-header-left
          "
        >

          <Link
            href="/dashboard"
            className="reviews-back-btn"
          >
            ← Back to Dashboard
          </Link>

          <span
            className="reviews-page-tag"
          >
            REVIEWS
          </span>

          <h1>
            ⭐ Reviews
          </h1>

          <p>
            Manage customer
            reviews
          </p>

      <div className="reviews-stats-grid">

            <div
              className="reviews-stat-card"
            >
              Total Reviews
              <span>
                {reviews.length}
              </span>
            </div>

            <div
              className="reviews-stat-card"
            >
              Active
              <span>
                {activeCount}
              </span>
            </div>

            <div
              className="reviews-stat-card"
            >
              Inactive
              <span>
                {inactiveCount}
              </span>
            </div>

          </div>

        </div>

        <div
          className="
          reviews-header-right
          "
        >

          <input
            type="text"
            placeholder="
            🔍 Search review...
            "
            value={search}
            onChange={(e)=>
              setSearch(
                e.target.value
              )
            }
            className="
            reviews-search-box
            "
          />

          <button
            className="
            reviews-add-review-btn
            "
            onClick={()=>
              setShowModal(true)
            }
          >
            + Add Review
          </button>

        </div>

      </div>

      <div
        className="
        reviews-table-wrapper
        "
      >

        <table className="reviews-table">

          <thead>

            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {
              filteredReviews.length
              ===0 ?

              (
                <tr>
                  <td
                      colSpan={7}
                      className="reviews-empty-state"
                  >
                    No Reviews Found
                  </td>
                </tr>
              )

              :

              filteredReviews.map(
                (review)=>(
                  <tr
                    key={review.id}
                  >

                    <td>
                      {review.id}
                    </td>

                    <td>
                      {
                        review.customer_name
                      }
                    </td>

                    <td>
                      <span>⭐ {review.rating}</span>
                    </td>

                    <td>
                      {
                        review.review_text
                      }
                    </td>

                    <td>

                  <span
                    className={`reviews-status-${review.status}`}
                  >
                    {review.status}
                  </span>

                    </td>

                    <td>
                      {
                        new Date(
                          review.created_at
                        )
                        .toLocaleDateString("th-TH")
                      }
                    </td>

                    <td>
                      <div className="reviews-action-buttons">

                    <button
                        className="reviews-edit-btn"
                        onClick={() =>
                        updateStatus(
                            review.id,
                            review.status ===
                            "active"
                            ? "inactive"
                            : "active"
                        )
                        }
                    >
                        {
                        review.status ===
                        "active"
                        ? "Deactivate"
                        : "Activate"
                        }
                    </button>

                    <button
                        className="reviews-delete-btn"
                        onClick={() =>
                        deleteReview(
                            review.id
                        )
                        }
                    >
                        Delete
                    </button>

                      </div>
                    </td>

                  </tr>
                )
              )

            }

          </tbody>

        </table>

      </div>

      {
        showModal && (

              <div
                  className="reviews-modal-overlay"
                  onClick={()=>setShowModal(false)}
              >

              <div
                  className="reviews-modal-box"
                  onClick={(e)=>e.stopPropagation()}
              >

              <h2>
                Add Review
              </h2>

              <input
                placeholder="
                Customer Name
                "
                value={
                  customerName
                }
                onChange={(e)=>
                  setCustomerName(
                    e.target.value
                  )
                }
              />

              <select
                value={rating}
                onChange={(e)=>setRating(e.target.value)}
              >

              <option value="5">★★★★★ 5</option>
              <option value="4">★★★★☆ 4</option>
              <option value="3">★★★☆☆ 3</option>
              <option value="2">★★☆☆☆ 2</option>
              <option value="1">★☆☆☆☆ 1</option>

              </select>

              <textarea
                placeholder="
                Review Text
                "
                value={
                  reviewText
                }
                onChange={(e)=>
                  setReviewText(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="
                Image URL
                "
                value={
                  imageUrl
                }
                onChange={(e)=>
                  setImageUrl(
                    e.target.value
                  )
                }
              />

              {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="reviews-image-preview"
                  />
                )}

              <div
                className="
                reviews-modal-actions
                "
              >

                <button
                    className="reviews-save-btn"
                    onClick={saveReview}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Review"}
                </button>

                <button
                    className="reviews-cancel-btn"
                    onClick={() => setShowModal(false)}
                    disabled={saving}
                >
                    Cancel
                </button>

              </div>

            </div>

          </div>

        )
      }

    </main>

  );

}