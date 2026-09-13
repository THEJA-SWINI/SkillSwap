import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddSkill() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        hourlyRate: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !formData.name ||
            !formData.description ||
            !formData.category ||
            formData.hourlyRate === ""
        ) {
            setError("All fields are required");
            return;
        }

        if (Number(formData.hourlyRate) < 0) {
            setError("Hourly rate cannot be negative");
            return;
        }

        try {
            setLoading(true);

            await api.post("/skills", {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                hourlyRate: Number(formData.hourlyRate)
            });

            navigate("/skills");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add skill"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>Add a Skill</h1>
                <p>Share a skill that you can teach to others.</p>
            </div>

            <div className="form-card">

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Skill Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Example: React.js"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            placeholder="Describe what you can teach"
                            rows="5"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select category
                            </option>
                            <option value="Programming">
                                Programming
                            </option>
                            <option value="Design">
                                Design
                            </option>
                            <option value="Cybersecurity">
                                Cybersecurity
                            </option>
                            <option value="Data Science">
                                Data Science
                            </option>
                            <option value="Business">
                                Business
                            </option>
                            <option value="Marketing">
                                Marketing
                            </option>
                            <option value="Languages">
                                Languages
                            </option>
                            <option value="Other">
                                Other
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Hourly Rate</label>

                        <input
                            type="number"
                            name="hourlyRate"
                            placeholder="Enter hourly rate"
                            min="0"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading ? "Adding Skill..." : "Add Skill"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddSkill;