import { useEffect, useState } from "react";
import api from "../services/api";

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const [reviewsResponse, bookingsResponse] = await Promise.all([
                api.get("/reviews/my"),
                api.get("/bookings/my")
            ]);

            setReviews(reviewsResponse.data);

            const completedBookings = bookingsResponse.data.filter(
                booking => booking.status === "completed"
            );

            setBookings(completedBookings);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load reviews"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!selectedBooking || !comment.trim()) {
            setError("Select a completed booking and enter a comment");
            return;
        }

        try {
            setSubmitting(true);

            await api.post("/reviews", {
                bookingId: selectedBooking,
                rating: Number(rating),
                comment: comment.trim()
            });

            setMessage("Review submitted successfully");

            setSelectedBooking("");
            setRating(5);
            setComment("");

            loadData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to submit review"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <p>Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>Reviews</h1>
                <p>Rate your completed learning sessions.</p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {bookings.length > 0 && (
                <div className="form-card">

                    <h2>Write a Review</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Completed Session</label>

                            <select
                                value={selectedBooking}
                                onChange={(e) =>
                                    setSelectedBooking(e.target.value)
                                }
                            >
                                <option value="">
                                    Select a session
                                </option>

                                {bookings.map((booking) => (
                                    <option
                                        key={booking.id}
                                        value={booking.id}
                                    >
                                        {booking.skillName} -{" "}
                                        {booking.date}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Rating</label>

                            <select
                                value={rating}
                                onChange={(e) =>
                                    setRating(e.target.value)
                                }
                            >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Good</option>
                                <option value="2">2 - Average</option>
                                <option value="1">1 - Poor</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Comment</label>

                            <textarea
                                rows="4"
                                placeholder="Write your review..."
                                value={comment}
                                onChange={(e) =>
                                    setComment(e.target.value)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>

                    </form>
                </div>
            )}

            <div className="reviews-section">

                <h2>My Reviews</h2>

                {reviews.length === 0 ? (
                    <div className="empty-state">
                        <p>No reviews yet.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div
                            className="review-card"
                            key={review.id}
                        >
                            <h3>
                                ⭐ {review.rating}/5
                            </h3>

                            <p>{review.comment}</p>

                            <small>
                                {new Date(
                                    review.createdAt
                                ).toLocaleDateString()}
                            </small>
                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default Reviews;