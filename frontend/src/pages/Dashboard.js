import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
    const { user } = useAuth();

    const [incomingBookings, setIncomingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadIncomingBookings();
    }, []);

    const loadIncomingBookings = async () => {
        try {
            setLoading(true);

            const response = await api.get("/bookings/incoming");

            setIncomingBookings(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load bookings"
            );
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId, status) => {
        try {
            setError("");
            setMessage("");

            await api.put(`/bookings/${bookingId}/status`, {
                status
            });

            setMessage(
                status === "accepted"
                    ? "Booking accepted successfully"
                    : "Booking rejected successfully"
            );

            loadIncomingBookings();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update booking"
            );
        }
    };

    const completeBooking = async (bookingId) => {
        try {
            setError("");
            setMessage("");

            await api.put(`/bookings/${bookingId}/complete`);

            setMessage(
                "Session completed successfully"
            );

            loadIncomingBookings();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to complete session"
            );
        }
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>Dashboard</h1>

                <p>
                    Welcome back, {user?.name || "User"}!
                </p>
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

            <div className="dashboard-grid">

                <Link
                    to="/skills"
                    className="dashboard-card"
                >
                    <h2>Browse Skills</h2>

                    <p>
                        Find skills and connect with mentors.
                    </p>
                </Link>

                <Link
                    to="/add-skill"
                    className="dashboard-card"
                >
                    <h2>Teach a Skill</h2>

                    <p>
                        Add a skill that you can teach.
                    </p>
                </Link>

                <Link
                    to="/my-bookings"
                    className="dashboard-card"
                >
                    <h2>My Bookings</h2>

                    <p>
                        View your learning sessions.
                    </p>
                </Link>

                <Link
                    to="/profile"
                    className="dashboard-card"
                >
                    <h2>My Profile</h2>

                    <p>
                        View and update your profile.
                    </p>
                </Link>

                <Link
                    to="/reviews"
                    className="dashboard-card"
                >
                    <h2>Reviews</h2>

                    <p>
                        Review your completed sessions.
                    </p>
                </Link>

            </div>

            <div className="reviews-section">

                <h2>Incoming Booking Requests</h2>

                {loading ? (
                    <p>Loading bookings...</p>
                ) : incomingBookings.length === 0 ? (
                    <div className="empty-state">

                        <h3>No incoming bookings</h3>

                        <p>
                            Booking requests for your skills
                            will appear here.
                        </p>

                    </div>
                ) : (
                    <div className="booking-grid">

                        {incomingBookings.map((booking) => (
                            <div
                                className="booking-card"
                                key={booking.id}
                            >

                                <h2>
                                    {booking.skillName}
                                </h2>

                                <p>
                                    <strong>Date:</strong>{" "}
                                    {booking.date}
                                </p>

                                <p>
                                    <strong>Time:</strong>{" "}
                                    {booking.startTime} -{" "}
                                    {booking.endTime}
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

                                {booking.status === "pending" && (
                                    <div className="booking-actions">

                                        <button
                                            className="primary-button"
                                            onClick={() =>
                                                updateBookingStatus(
                                                    booking.id,
                                                    "accepted"
                                                )
                                            }
                                        >
                                            Accept
                                        </button>

                                        <button
                                            className="danger-button"
                                            onClick={() =>
                                                updateBookingStatus(
                                                    booking.id,
                                                    "rejected"
                                                )
                                            }
                                        >
                                            Reject
                                        </button>

                                    </div>
                                )}

                                {booking.status === "accepted" && (
                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            completeBooking(
                                                booking.id
                                            )
                                        }
                                    >
                                        Mark Completed
                                    </button>
                                )}

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Dashboard;