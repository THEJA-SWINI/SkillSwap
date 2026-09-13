function BookingCard({ booking, onCancel, onStatusChange, onComplete }) {
    return (
        <div className="booking-card">

            <h2>{booking.skillName}</h2>

            <p>
                <strong>Date:</strong> {booking.date}
            </p>

            <p>
                <strong>Time:</strong>{" "}
                {booking.startTime} - {booking.endTime}
            </p>

            <p>
                <strong>Purpose:</strong> {booking.purpose}
            </p>

            <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${booking.status}`}>
                    {booking.status}
                </span>
            </p>

            {booking.status === "pending" && onStatusChange && (
                <div className="booking-actions">
                    <button
                        className="primary-button"
                        onClick={() =>
                            onStatusChange(booking.id, "accepted")
                        }
                    >
                        Accept
                    </button>

                    <button
                        className="danger-button"
                        onClick={() =>
                            onStatusChange(booking.id, "rejected")
                        }
                    >
                        Reject
                    </button>
                </div>
            )}

            {booking.status === "accepted" && onComplete && (
                <button
                    className="primary-button"
                    onClick={() => onComplete(booking.id)}
                >
                    Mark Completed
                </button>
            )}

            {booking.status !== "completed" &&
                booking.status !== "cancelled" &&
                booking.status !== "rejected" &&
                onCancel && (
                    <button
                        className="danger-button"
                        onClick={() => onCancel(booking.id)}
                    >
                        Cancel
                    </button>
                )}

        </div>
    );
}

export default BookingCard;