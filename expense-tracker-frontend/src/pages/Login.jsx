import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiUser, FiLock, FiMail, FiArrowRight, FiShield } from 'react-icons/fi';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
            const res = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, form);
            login(res.data);
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.response?.data || 'Operation failed. Check credentials.';
            setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : String(errorMsg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card-wrapper">
                <div className="login-branding">
                    <div className="brand-logo">💰</div>
                    <h1 className="brand-name">ExpenseTracker</h1>
                    <p className="brand-tagline">Architectural Finance Optimization</p>
                </div>

                <div className="card login-card modern-shadow">
                    <div className="login-tabs">
                        <button 
                            className={`tab-btn ${isLogin ? 'active' : ''}`} 
                            onClick={() => setIsLogin(true)}
                        >
                            Node Login
                        </button>
                        <button 
                            className={`tab-btn ${!isLogin ? 'active' : ''}`} 
                            onClick={() => setIsLogin(false)}
                        >
                            Initialize User
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-field">
                            <FiUser className="input-icon" />
                            <input 
                                name="username"
                                type="text" 
                                placeholder="Quantum Identity (Username)"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="input-field">
                                <FiMail className="input-icon" />
                                <input 
                                    name="email"
                                    type="email" 
                                    placeholder="Communication Node (Email)"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="input-field">
                            <FiLock className="input-icon" />
                            <input 
                                name="password"
                                type="password" 
                                placeholder="Security Key (Password)"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <div className="login-error-pill"><FiShield /> {error}</div>}

                        <button 
                            type="submit" 
                            className="btn-pill btn-primary full-width mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <span>{isLogin ? 'Authorize Node' : 'Register Identity'}</span>
                                    <FiArrowRight />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="login-footer">
                    <p className="tiny text-dim">System Status: Protected by AES-256 Protocol</p>
                </div>
            </div>

            <style>{`
                .login-container {
                    min-height: 90vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at top right, rgba(159, 220, 86, 0.05), transparent);
                }

                .login-card-wrapper {
                    width: 100%;
                    max-width: 440px;
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                    padding: 2rem;
                }

                .login-branding { text-align: center; }
                .brand-logo { font-size: 3rem; margin-bottom: 1rem; }
                .brand-name { font-size: 2rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 0.5rem; color: white; }
                .brand-tagline { color: var(--text-dim); font-size: 0.9rem; font-weight: 500; }

                .login-card {
                    padding: 2.5rem;
                    border: 1px solid var(--border-subtle);
                    background: rgba(26, 28, 25, 0.8);
                    backdrop-filter: blur(20px);
                }

                .login-tabs {
                    display: flex;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 999px;
                    padding: 0.3rem;
                    margin-bottom: 2.5rem;
                    border: 1px solid var(--border-subtle);
                }

                .tab-btn {
                    flex: 1;
                    padding: 0.75rem;
                    border-radius: 999px;
                    border: none;
                    background: transparent;
                    color: var(--text-dim);
                    font-weight: 600;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .tab-btn.active {
                    background: #333;
                    color: white;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .input-field {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--accent-primary);
                    font-size: 1.1rem;
                }

                .input-field input {
                    padding-left: 3rem;
                }

                .login-error-pill {
                    background: rgba(255, 115, 102, 0.1);
                    color: var(--error);
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border: 1px solid rgba(255, 115, 102, 0.2);
                }

                .full-width { width: 100%; justify-content: center; padding: 1.1rem; border-radius: 14px; }
                .mt-2 { margin-top: 1.5rem; }

                .login-footer { text-align: center; }
            `}</style>
        </div>
    );
};

export default Login;
