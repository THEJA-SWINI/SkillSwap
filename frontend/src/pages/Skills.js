import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Skills() {
    const [skills, setSkills] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadSkills();
    }, [search, category, sort]);

    const loadSkills = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/skills", {
                params: {
                    search: search || undefined,
                    category: category || undefined,
                    sort: sort || undefined
                }
            });

            setSkills(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load skills"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>Browse Skills</h1>
                <p>Find a skill and connect with a mentor.</p>
            </div>

            <div className="filter-section">

                <input
                    type="text"
                    placeholder="Search skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Languages">Languages</option>
                    <option value="Other">Other</option>
                </select>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="">Sort By</option>
                    <option value="rating">Highest Rating</option>
                    <option value="priceLow">Lowest Price</option>
                    <option value="priceHigh">Highest Price</option>
                </select>

            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <p>Loading skills...</p>
            ) : skills.length === 0 ? (
                <div className="empty-state">
                    <h2>No skills found</h2>
                    <p>Try changing your search or category.</p>
                </div>
            ) : (
                <div className="skill-grid">

                    {skills.map((skill) => (
                        <div className="skill-card" key={skill.id}>

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
                                View Skill
                            </Link>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default Skills;