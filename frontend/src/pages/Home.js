import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user } = useAuth();

    return (
        <div className="home-page">

            <section className="hero-section">
                <div className="hero-content">

                    <h1>
                        Learn. Teach. <span>Swap Skills.</span>
                    </h1>

                    <p>
                        SkillSwap connects learners with skilled mentors.
                        Share your knowledge, learn new skills, and grow together.
                    </p>

                    <div className="hero-buttons">
                        {user ? (
                            <>
                                <Link
                                    to="/skills"
                                    className="primary-button"
                                >
                                    Explore Skills
                                </Link>

                                <Link
                                    to="/add-skill"
                                    className="secondary-button"
                                >
                                    Teach a Skill
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="primary-button"
                                >
                                    Get Started
                                </Link>

                                <Link
                                    to="/login"
                                    className="secondary-button"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </section>

            <section className="features-section">

                <h2>Why SkillSwap?</h2>

                <div className="feature-grid">

                    <div className="feature-card">
                        <h3>Learn New Skills</h3>
                        <p>
                            Find mentors and learn practical skills
                            from people with real experience.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Share Your Knowledge</h3>
                        <p>
                            Offer your skills and help others
                            achieve their learning goals.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Book Sessions</h3>
                        <p>
                            Schedule learning sessions with mentors
                            at a convenient date and time.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Build Your Reputation</h3>
                        <p>
                            Receive ratings and reviews after
                            successfully completing sessions.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;