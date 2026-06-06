import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DisasterDashboard from './components/DisasterDashboard';
import VolunteersPage from './components/VolunteersPage';
import ResourcesPage from './components/ResourcesPage';
import GISMapPage from './components/GISMapPage';
import VolunteerTasksPage from './components/VolunteerTasksPage';
import DisasterTasksPage from "./components/DisasterTasksPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import ResourceDetailsPage from "./components/ResourceDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from './components/LoginPage';
import MyTasksPage from "./components/MyTasksPage";
import { clearAuth } from './api/authSync';


function logout() {
    clearAuth();
    window.location.href = '/login';
}

function App() {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);

    // Load auth from localStorage
    useEffect(() => {
        function syncAuth() {
            setToken(localStorage.getItem('token'));
            setRole(localStorage.getItem('role'));
            setUserId(localStorage.getItem('userId'));
        }

        syncAuth(); // initial load

        window.addEventListener('authChange', syncAuth);

        return () => window.removeEventListener('authChange', syncAuth);
    }, []);

    function logout() {
        clearAuth();
        window.location.href = '/login';
    }

    return (
        <Router>
            <div>

                {/* NAVBAR */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                    <div className="container-fluid">

                        <Link className="navbar-brand" to="/">
                            ReliefTrack
                        </Link>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarNav">

                            <ul className="navbar-nav ms-auto">

                                {/* Always visible */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        Disasters
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/gis">
                                        GIS Map
                                    </Link>
                                </li>

                                {/* ADMIN ONLY */}
                                {role === 'ADMIN' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/volunteers">
                                                Volunteers
                                            </Link>
                                        </li>

                                        <li className="nav-item">
                                            <Link className="nav-link" to="/resources">
                                                Resources
                                            </Link>
                                        </li>
                                    </>
                                )}

                                {/* VOLUNTEER ONLY */}
                                {role === 'VOLUNTEER' && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/my-tasks">
                                            My Tasks
                                        </Link>
                                    </li>
                                )}

                                {/* LOGIN / LOGOUT */}
                                {!token ? (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">
                                            Login
                                        </Link>
                                    </li>
                                ) : (
                                    <li className="nav-item">
                                        <button className="nav-link" onClick={logout}>
                                            Logout
                                        </button>
                                    </li>
                                )}

                            </ul>

                        </div>
                    </div>
                </nav>

                {/* PAGE CONTENT */}
                <div className="container mt-4 mb-5">

                    <Routes>

                        {/* Public */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={<DisasterDashboard />} />
                        <Route path="/gis" element={<GISMapPage />} />

                        {/* Admin protected */}
                        <Route
                            path="/volunteers"
                            element={
                                <ProtectedRoute>
                                    <VolunteersPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/resources"
                            element={
                                <ProtectedRoute>
                                    <ResourcesPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Tasks */}
                        <Route
                            path="/disaster-tasks/:id"
                            element={
                                <ProtectedRoute>
                                    <DisasterTasksPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/tasks/:volunteerId"
                            element={
                                <ProtectedRoute>
                                    <VolunteerTasksPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/resources/:id"
                            element={
                                <ProtectedRoute>
                                    <ResourceDetailsPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Volunteer */}
                        <Route
                            path="/my-tasks"
                            element={
                                <ProtectedRoute>
                                    <MyTasksPage />
                                </ProtectedRoute>
                            }
                        />

                    </Routes>

                </div>
            </div>
        </Router>
    );
}

export default App;