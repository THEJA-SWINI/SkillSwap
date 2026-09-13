import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BrowseSkills from "./pages/BrowseSkills";
import AddSkill from "./pages/AddSkill";
import SkillDetails from "./pages/SkillDetails";
import Bookings from "./pages/Bookings";
import MyBookings from "./pages/MyBookings";
import Reviews from "./pages/Reviews";

import "./App.css";

function App() {
    return (
        <AuthProvider>

            <BrowserRouter>

                <Navbar />

                <Routes>

                    {/* HOME */}
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    {/* AUTHENTICATION */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    {/* DASHBOARD */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* PROFILE */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* BROWSE SKILLS */}
                    <Route
                        path="/skills"
                        element={
                            <ProtectedRoute>
                                <BrowseSkills />
                            </ProtectedRoute>
                        }
                    />

                    {/* ADD SKILL */}
                    <Route
                        path="/add-skill"
                        element={
                            <ProtectedRoute>
                                <AddSkill />
                            </ProtectedRoute>
                        }
                    />

                    {/* SKILL DETAILS */}
                    <Route
                        path="/skills/:id"
                        element={
                            <ProtectedRoute>
                                <SkillDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* BOOKING */}
                    <Route
                        path="/bookings"
                        element={
                            <ProtectedRoute>
                                <Bookings />
                            </ProtectedRoute>
                        }
                    />

                    {/* MY BOOKINGS */}
                    <Route
                        path="/my-bookings"
                        element={
                            <ProtectedRoute>
                                <MyBookings />
                            </ProtectedRoute>
                        }
                    />

                    {/* REVIEWS */}
                    <Route
                        path="/reviews"
                        element={
                            <ProtectedRoute>
                                <Reviews />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </BrowserRouter>

        </AuthProvider>
    );
}

export default App;