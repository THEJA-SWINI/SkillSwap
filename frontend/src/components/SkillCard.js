import { Link } from "react-router-dom";

function SkillCard({ skill }) {
    return (
        <div className="skill-card">

            <h2>{skill.name}</h2>

            <p className="skill-category">
                {skill.category}
            </p>

            <p>
                {skill.description}
            </p>

            <div className="skill-info">
                <span>
                    ₹{skill.hourlyRate}/hour
                </span>

                <span>
                    ⭐ {skill.rating || 0}
                </span>
            </div>

            <Link
                to={`/skills/${skill.id}`}
                className="primary-button"
            >
                View Details
            </Link>

        </div>
    );
}

export default SkillCard;