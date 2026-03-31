import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPieChart, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { pathname } = useLocation();
    const { user, logout, isAuthenticated } = useAuth();

    const isActive = (path) => pathname === path;

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar-container">
            <div className="navbar-content">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">💰</span>
                    <span className="logo-text">ExpenseTracker</span>
                </Link>

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

                <div className="navbar-user-section">
                    <div className="user-info">
                        <span className="tiny text-dim">Authorized Node</span>
                        <span className="user-name">{user?.username}</span>
                    </div>
                    <div className="profile-badge">
                        <FiUser />
                    </div>
                    <button className="icon-btn-nav logout" onClick={logout} title="Deauthorize Session">
                        <FiLogOut />
                    </button>
                </div>
            </div>

            <style>{`
                .navbar-container {
                    padding: 1.5rem 2rem;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: rgba(22, 24, 21, 0.8);
                    backdrop-filter: blur(12px);
                }

                .navbar-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--bg-secondary);
                    padding: 0.75rem 1.5rem;
                    border-radius: 999px;
                    border: 1px solid var(--border-subtle);
                }

                .navbar-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none;
                    color: white;
                }

                .logo-icon {
                    font-size: 1.5rem;
                }

                .logo-text {
                    font-weight: 700;
                    letter-spacing: -0.03em;
                    font-size: 1.1rem;
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
                    transition: all 0.3s ease;
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

                .navbar-user-section {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
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
            `}</style>
        </nav>
    );
};

export default Navbar;