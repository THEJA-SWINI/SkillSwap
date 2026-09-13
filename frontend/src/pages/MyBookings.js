import { useEffect, useState } from "react";
import api from "../services/api";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/bookings/my");

            setBookings(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load bookings"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await api.put(`/bookings/${bookingId}/cancel`);

            setMessage("Booking cancelled successfully");

            loadBookings();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to cancel booking"
            );
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <p>Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>My Bookings</h1>
                <p>View and manage your learning sessions.</p>
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

            {bookings.length === 0 ? (
                <div className="empty-state">
                    <h2>No bookings yet</h2>
                    <p>
                        Browse skills and book a learning session.
                    </p>
                </div>
            ) : (
                <div className="booking-grid">

                    {bookings.map((booking) => (
                        <div
                            className="booking-card"
                            key={booking.id}
                        >

                            <h2>{booking.skillName}</h2>

                            <p>
                                <strong>Date:</strong>{" "}
                                {booking.date}
                            </p>

                            <p>
                                <strong>Time:</strong>{" "}
                                {booking.startTime} - {booking.endTime}
                            </p>

                            <p>
                                <strong>Purpose:</strong>{" "}
                                {booking.purpose}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`status ${booking.status}`}
                                >
                                    {booking.status}
                                </span>
                            </p>

                            {booking.status !== "completed" &&
                                booking.status !== "cancelled" &&
                                booking.status !== "rejected" && (
                                    <button
                                        className="danger-button"
                                        onClick={() =>
                                            handleCancel(booking.id)
                                        }
                                    >
                                        Cancel Booking
                                    </button>
                                )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default MyBookings;