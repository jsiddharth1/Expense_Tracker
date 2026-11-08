import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import { FiCloud, FiX, FiShield, FiRefreshCw, FiArrowRight } from 'react-icons/fi';

const AuthPromptModal = () => {
    const { showAuthModal, setShowAuthModal } = useExpenses();
    const navigate = useNavigate();

    if (!showAuthModal) return null;

    const handleNavigate = (path) => {
        setShowAuthModal(false);
        navigate(path);
    };

    return (
        <div className="auth-prompt-backdrop">
            <div className="auth-prompt-card">
                <header className="auth-prompt-header">
                    <div className="auth-prompt-icon">
                        <FiCloud />
                    </div>
                    <div className="auth-prompt-title-box">
                        <h2 className="auth-prompt-title">Unlock Cloud Ledger</h2>
                        <p className="tiny text-dim">Permanent Synchronization & Backup</p>
                    </div>
                    <button
                        className="icon-btn-close"
                        onClick={() => setShowAuthModal(false)}
                        title="Close"
                    >
                        <FiX />
                    </button>
                </header>

                <div className="auth-prompt-body">
                    <p className="auth-prompt-desc">
                        You are currently operating in <strong>Guest Mode</strong>. Your transactions are stored locally
                        on this browser. Connect or initialize a free account to activate:
                    </p>

                    <div className="features-list">
                        <div className="feature-item">
                            <FiShield className="feature-icon" />
                            <div>
                                <h4 className="feature-title">Permanent Cloud Backup</h4>
                                <p className="tiny text-dim">Never lose transactions when browser storage is cleared.</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <FiRefreshCw className="feature-icon" />
                            <div>
                                <h4 className="feature-title">Multi-Device Synchronization</h4>
                                <p className="tiny text-dim">Access your expense ledger across your phone, laptop, and tablet.</p>
                            </div>
                        </div>
                    </div>

                    <div className="auth-prompt-actions">
                        <button
                            className="btn-pill btn-primary full-width"
                            onClick={() => handleNavigate('/login')}
                        >
                            <span>Sign In or Register</span>
                            <FiArrowRight />
                        </button>
                        <button
                            className="btn-pill btn-secondary full-width"
                            onClick={() => setShowAuthModal(false)}
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .auth-prompt-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1.5rem;
                }

                .auth-prompt-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    width: 100%;
                    max-width: 480px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    animation: promptSlideIn 0.25s ease-out;
                    overflow: hidden;
                }

                @keyframes promptSlideIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .auth-prompt-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid var(--border-subtle);
                    position: relative;
                }

                .auth-prompt-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: rgba(159, 220, 86, 0.1);
                    color: var(--accent-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                }

                .auth-prompt-title-box {
                    flex: 1;
                }

                .auth-prompt-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin: 0;
                }

                .auth-prompt-body {
                    padding: 1.75rem 2rem;
                }

                .auth-prompt-desc {
                    font-size: 0.95rem;
                    color: var(--text-main);
                    line-height: 1.5;
                    margin-bottom: 1.25rem;
                }

                .features-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.75rem;
                }

                .feature-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    padding: 0.75rem 1rem;
                }

                .feature-icon {
                    color: var(--accent-primary);
                    font-size: 1.2rem;
                    margin-top: 0.2rem;
                    flex-shrink: 0;
                }

                .feature-title {
                    margin: 0 0 0.25rem 0;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .auth-prompt-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
            `}</style>
        </div>
    );
};

export default AuthPromptModal;
