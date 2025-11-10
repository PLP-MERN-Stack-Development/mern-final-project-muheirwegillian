import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    TaskFlow
                </Link>

                {isAuthenticated && (
                    <div className="navbar-menu">
                        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                        <Link to="/projects" className="navbar-link">Projects</Link>
                        <Link to="/tasks" className="navbar-link">Tasks</Link>
                        <Link to="/teams" className="navbar-link">Teams</Link>
                        <div className="navbar-user">
                            <Link to="/profile" className="navbar-link">
                                {user?.name}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline">
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

