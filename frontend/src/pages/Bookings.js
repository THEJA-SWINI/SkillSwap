import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function Bookings() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const skillId = searchParams.get("skillId");

    const [skill, setSkill] = useState(null);
    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        purpose: ""
    });

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (skillId) {
            loadSkill();
        } else {
            setPageLoading(false);
        }
    }, [skillId]);

    const loadSkill = async () => {
        try {
            const response = await api.get(`/skills/${skillId}`);
            setSkill(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load skill"
            );
        } finally {
            setPageLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.date ||
            !formData.startTime ||
            !formData.endTime ||
            !formData.purpose
        ) {
            setError("All booking details are required");
            return;
        }

        if (formData.startTime >= formData.endTime) {
            setError("End time must be after start time");
            return;
        }

        try {
            setLoading(true);

            await api.post("/bookings", {
                skillId,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                purpose: formData.purpose
            });

            setSuccess("Booking created successfully!");

            setFormData({
                date: "",
                startTime: "",
                endTime: "",
                purpose: ""
            });

            setTimeout(() => {
                navigate("/my-bookings");
            }, 1500);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create booking"
            );
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="page-container">
                <p>Loading...</p>
            </div>
        );
    }

    if (!skillId) {
        return (
            <div className="page-container">
                <div className="error-message">
                    Please select a skill before booking.
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>Book Learning Session</h1>

                {skill && (
                    <p>
                        Book a session for <strong>{skill.name}</strong>
                    </p>
                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            <div className="form-card">

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Date</label>

                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Start Time</label>

                        <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>End Time</label>

                        <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Purpose</label>

                        <textarea
                            name="purpose"
                            rows="4"
                            placeholder="What do you want to learn?"
                            value={formData.purpose}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Booking..."
                            : "Confirm Booking"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Bookings;