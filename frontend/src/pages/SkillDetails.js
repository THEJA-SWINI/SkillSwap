import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function SkillDetails() {
    const { id } = useParams();

    const [skill, setSkill] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadSkill();
        loadReviews();
    }, [id]);

    const loadSkill = async () => {
        try {
            const response = await api.get(`/skills/${id}`);
            setSkill(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load skill"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadReviews = async () => {
        try {
            const response = await api.get(`/reviews/skill/${id}`);
            setReviews(response.data);
        } catch (error) {
            console.error("Failed to load reviews");
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <p>Loading skill...</p>
            </div>
        );
    }

    if (error || !skill) {
        return (
            <div className="page-container">
                <div className="error-message">
                    {error || "Skill not found"}
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="skill-details-card">

                <div className="page-header">
                    <h1>{skill.name}</h1>

                    <p className="skill-category">
                        {skill.category}
                    </p>
                </div>

                <div className="skill-details">

                    <div>
                        <h3>Description</h3>
                        <p>{skill.description}</p>
                    </div>

                    <div>
                        <h3>Hourly Rate</h3>
                        <p>₹{skill.hourlyRate} / hour</p>
                    </div>

                    <div>
                        <h3>Rating</h3>
                        <p>
                            ⭐ {skill.rating || 0}
                            {" "}
                            ({skill.reviewsCount || 0} reviews)
                        </p>
                    </div>

                </div>

                <Link
                    to={`/bookings?skillId=${skill.id}`}
                    className="primary-button"
                >
                    Book Learning Session
                </Link>

            </div>

            <div className="reviews-section">

                <h2>Reviews</h2>

                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
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

export default SkillDetails;