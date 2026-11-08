import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiPieChart, FiUser, FiLogOut, FiCreditCard, FiLogIn, FiUserPlus, FiCloud } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import UserProfile from './UserProfile';

const Navbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const { setShowAuthModal } = useExpenses();
    const [showProfile, setShowProfile] = useState(false);

    const isActive = (path) => pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className="navbar-container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-logo">
                        <FiCreditCard className="logo-icon" />
                        <span className="logo-text">ExpenseTracker</span>
                    </Link>

                    <div className="navbar-center-section">
                        <div className="navbar-pills">
                            <Link
                                to="/"
                                className={`nav-pill ${isActive('/') ? 'active' : ''}`}
                            >
                                <FiHome className="pill-icon" />
                                <span>Home</span>
                            </Link>
                            <Link
                                to="/dashboard"
                                className={`nav-pill ${isActive('/dashboard') ? 'active' : ''}`}
                            >
                                <FiPieChart className="pill-icon" />
                                <span>Dashboard</span>
                            </Link>
                        </div>

                        {!isAuthenticated && (
                            <div className="guest-badge" title="You are in Guest Mode with local storage">
                                <span className="guest-badge-dot pulse"></span>
                                <span className="guest-badge-text">Guest Mode — Demo Data</span>
                            </div>
                        )}
                    </div>

                    <div className="navbar-user-section">
                        {isAuthenticated ? (
                            <>
                                <div className="user-info">
                                    <span className="tiny text-dim">Authorized Node</span>
                                    <span className="user-name">{user?.fullName || user?.username}</span>
                                </div>
                                <div
                                    className="profile-badge clickable"
                                    onClick={() => setShowProfile(true)}
                                    title="View Profile"
                                    id="navbar-profile-badge"
                                >
                                    {user?.profilePicture ? (
                                        <img
                                            src={user.profilePicture}
                                            alt="Profile"
                                            className="navbar-avatar-img"
                                        />
                                    ) : (
                                        <FiUser />
                                    )}
                                </div>
                                <button className="icon-btn-nav logout" onClick={handleLogout} title="Deauthorize Session">
                                    <FiLogOut />
                                </button>
                            </>
                        ) : (
                            <div className="guest-nav-actions">
                                <button
                                    className="btn-pill btn-secondary tiny flex-center gap-05"
                                    onClick={() => setShowAuthModal(true)}
                                    title="Learn about cloud sync"
                                >
                                    <FiCloud />
                                    <span className="hide-mobile">Cloud Sync</span>
                                </button>
                                <Link to="/login" className="nav-pill" style={{ padding: '0.45rem 1rem' }}>
                                    <FiLogIn className="pill-icon" />
                                    <span>Log In</span>
                                </Link>
                                <Link to="/login" className="btn-pill btn-primary tiny" style={{ padding: '0.45rem 1.1rem' }}>
                                    <FiUserPlus />
                                    <span>Sign Up</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <style>{`
                    .navbar-container {
                        padding: 1.25rem 2rem;
                        position: sticky;
                        top: 0;
                        z-index: 100;
                        background: rgba(22, 24, 21, 0.85);
                        backdrop-filter: blur(14px);
                    }

                    .navbar-content {
                        max-width: 1400px;
                        margin: 0 auto;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: var(--bg-secondary);
                        padding: 0.65rem 1.5rem;
                        border-radius: 999px;
                        border: 1px solid var(--border-subtle);
                        gap: 1rem;
                    }

                    .navbar-logo {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        text-decoration: none;
                        color: white;
                        flex-shrink: 0;
                    }

                    .logo-icon {
                        font-size: 1.5rem;
                        color: var(--accent-primary);
                    }

                    .logo-text {
                        font-weight: 700;
                        letter-spacing: -0.03em;
                        font-size: 1.1rem;
                    }

                    .navbar-center-section {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }

                    .navbar-pills {
                        display: flex;
                        gap: 0.5rem;
                        background: rgba(255, 255, 255, 0.03);
                        padding: 0.25rem;
                        border-radius: 999px;
                    }

                    .nav-pill {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.5rem 1.25rem;
                        border-radius: 999px;
                        text-decoration: none;
                        color: var(--text-dim);
                        font-size: 0.9rem;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    }

                    .nav-pill:hover {
                        color: white;
                        background: rgba(255, 255, 255, 0.05);
                    }

                    .nav-pill.active {
                        background: var(--accent-primary);
                        color: var(--text-dark);
                    }

                    .pill-icon {
                        font-size: 1.1rem;
                    }

                    .guest-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        background: rgba(159, 220, 86, 0.08);
                        border: 1px solid rgba(159, 220, 86, 0.2);
                        padding: 0.35rem 0.85rem;
                        border-radius: 999px;
                        font-size: 0.75rem;
                        font-weight: 500;
                        color: var(--accent-primary);
                    }

                    .guest-badge-dot {
                        width: 7px;
                        height: 7px;
                        border-radius: 50%;
                        background: var(--accent-primary);
                    }

                    .pulse {
                        box-shadow: 0 0 0 0 rgba(159, 220, 86, 0.7);
                        animation: pulseGlow 2s infinite;
                    }

                    @keyframes pulseGlow {
                        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(159, 220, 86, 0.7); }
                        70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(159, 220, 86, 0); }
                        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(159, 220, 86, 0); }
                    }

                    .navbar-user-section {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        flex-shrink: 0;
                    }

                    .guest-nav-actions {
                        display: flex;
                        align-items: center;
                        gap: 0.65rem;
                    }

                    .user-info {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        gap: 0.1rem;
                    }

                    .user-name {
                        font-size: 0.9rem;
                        font-weight: 700;
                        color: white;
                    }

                    .profile-badge {
                        width: 38px;
                        height: 38px;
                        border-radius: 50%;
                        background: var(--accent-secondary);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        overflow: hidden;
                    }

                    .profile-badge.clickable {
                        cursor: pointer;
                        transition: all 0.3s ease;
                        border: 2px solid transparent;
                    }

                    .profile-badge.clickable:hover {
                        transform: scale(1.1);
                        border-color: var(--accent-primary);
                        box-shadow: 0 0 15px rgba(159, 220, 86, 0.25);
                    }

                    .navbar-avatar-img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 50%;
                    }

                    .icon-btn-nav {
                        background: transparent;
                        border: 1px solid var(--border-subtle);
                        color: var(--text-dim);
                        width: 38px;
                        height: 38px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-size: 1.1rem;
                    }

                    .icon-btn-nav:hover {
                        color: var(--error);
                        border-color: var(--error);
                        background: rgba(255, 115, 102, 0.05);
                    }

                    .tiny { font-size: 0.75rem; }
                    .flex-center { display: inline-flex; align-items: center; }
                    .gap-05 { gap: 0.5rem; }

                    @media (max-width: 900px) {
                        .hide-mobile { display: none; }
                        .guest-badge-text { display: none; }
                        .guest-badge { padding: 0.4rem; }
                    }
                `}</style>
            </nav>

            <UserProfile
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
            />
        </>
    );
};

export default Navbar;
