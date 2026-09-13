import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        bio: "",
        location: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await api.get("/users/profile");

            setProfile({
                name: response.data.name || "",
                email: response.data.email || "",
                bio: response.data.bio || "",
                location: response.data.location || ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            setSaving(true);

            const response = await api.put("/users/profile", {
                name: profile.name,
                bio: profile.bio,
                location: profile.location
            });

            setProfile({
                name: response.data.user.name || "",
                email: response.data.user.email || "",
                bio: response.data.user.bio || "",
                location: response.data.user.location || ""
            });

            const storedUser = JSON.parse(
                localStorage.getItem("user")
            );

            if (storedUser) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...storedUser,
                        name: response.data.user.name
                    })
                );
            }

            setMessage("Profile updated successfully");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>My Profile</h1>
                <p>Manage your SkillSwap profile.</p>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="profile-card">

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={profile.email}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>

                        <input
                            type="text"
                            name="location"
                            placeholder="Enter your location"
                            value={profile.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio</label>

                        <textarea
                            name="bio"
                            placeholder="Tell others about yourself"
                            value={profile.bio}
                            onChange={handleChange}
                            rows="5"
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Update Profile"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Profile;