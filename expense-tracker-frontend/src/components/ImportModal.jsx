import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { FiUploadCloud, FiX, FiCheck, FiAlertTriangle, FiTrash2, FiClock } from 'react-icons/fi';

const CATEGORY_COLORS = {
    Food: '#9FDC56',
    Transport: '#545FFF',
    Shopping: '#FF7366',
    Bills: '#EAFFD2',
    Health: '#FFFFFF',
    Other: '#888888',
};

const ImportModal = () => {
    const {
        showImportModal,
        setShowImportModal,
        importableExpenses,
        importGuestExpensesToAccount,
        discardGuestData,
        skipImport,
    } = useExpenses();

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [confirmDiscard, setConfirmDiscard] = useState(false);

    if (!showImportModal) return null;

    const handleImport = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await importGuestExpensesToAccount();
            setResult(res);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Import failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDiscardConfirmed = () => {
        discardGuestData();
        setConfirmDiscard(false);
        setShowImportModal(false);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-card">
                <header className="modal-header">
                    <div className="modal-header-icon">
                        <FiUploadCloud />
                    </div>
                    <div className="modal-header-text">
                        <h2 className="modal-title">Import Guest Expenses</h2>
                        <p className="tiny text-dim">Progressive Ledger Synchronization</p>
                    </div>
                    {!loading && (
                        <button className="icon-btn-close" onClick={skipImport} title="Close">
                            <FiX />
                        </button>
                    )}
                </header>

                <div className="modal-body">
                    {result ? (
                        <div className="result-container">
                            <div className="result-icon success">
                                <FiCheck />
                            </div>
                            <h3 className="result-heading">Import Complete</h3>
                            <p className="result-detail">
                                Successfully created <strong>{result.created}</strong> new expense(s).
                                {result.alreadyImported > 0 && (
                                    <> <strong>{result.alreadyImported}</strong> were already previously imported.</>
                                )}
                                {result.rejected > 0 && (
                                    <> <strong>{result.rejected}</strong> record(s) were rejected.</>
                                )}
                            </p>
                            <button
                                className="btn-pill btn-primary mt-3 full-width"
                                onClick={() => setShowImportModal(false)}
                            >
                                Done
                            </button>
                        </div>
                    ) : confirmDiscard ? (
                        <div className="discard-confirm-box">
                            <div className="result-icon warning">
                                <FiAlertTriangle />
                            </div>
                            <h3 className="result-heading">Discard Guest Expenses?</h3>
                            <p className="text-dim tiny mb-3">
                                Are you sure you want to permanently delete your {importableExpenses.length} guest expense(s)?
                                This action cannot be reversed.
                            </p>
                            <div className="modal-actions-row">
                                <button
                                    className="btn-pill btn-danger"
                                    onClick={handleDiscardConfirmed}
                                >
                                    <FiTrash2 /> Yes, Discard
                                </button>
                                <button
                                    className="btn-pill btn-secondary"
                                    onClick={() => setConfirmDiscard(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="modal-intro">
                                You created <strong>{importableExpenses.length}</strong> expense record(s) while using Guest Mode.
                                Would you like to import them into your authenticated account?
                            </p>

                            <div className="demo-notice">
                                <span className="demo-notice-dot"></span>
                                <span className="tiny text-dim">
                                    Built-in sample/demo expenses are automatically excluded. Only your custom entries will be transferred.
                                </span>
                            </div>

                            <div className="import-list-wrapper">
                                <div className="import-list">
                                    {importableExpenses.map((exp) => (
                                        <div key={exp.id || exp.clientId} className="import-item">
                                            <div className="import-item-main">
                                                <span className="import-item-title">{exp.title}</span>
                                                <div className="import-item-meta">
                                                    <span
                                                        className="cat-pill tiny"
                                                        style={{
                                                            background: CATEGORY_COLORS[exp.category] || '#999',
                                                        }}
                                                    >
                                                        {exp.category}
                                                    </span>
                                                    <span className="tiny text-dim flex-center gap-05">
                                                        <FiClock /> {exp.date}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="import-item-amount">
                                                ₹{Number(exp.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="modal-error-pill">
                                    <FiAlertTriangle /> {error}
                                </div>
                            )}

                            <div className="modal-footer-actions">
                                <button
                                    className="btn-pill btn-primary full-width"
                                    onClick={handleImport}
                                    disabled={loading}
                                >
                                    {loading ? 'Importing Ledger...' : `Import ${importableExpenses.length} Expense(s)`}
                                </button>

                                <div className="modal-secondary-actions">
                                    <button
                                        className="btn-pill btn-secondary tiny"
                                        onClick={skipImport}
                                        disabled={loading}
                                    >
                                        Skip for Now
                                    </button>
                                    <button
                                        className="btn-pill btn-text-danger tiny"
                                        onClick={() => setConfirmDiscard(true)}
                                        disabled={loading}
                                    >
                                        <FiTrash2 /> Discard Data
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .modal-backdrop {
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

                .modal-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    width: 100%;
                    max-width: 520px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    animation: modalFadeIn 0.25s ease-out;
                    overflow: hidden;
                }

                @keyframes modalFadeIn {
                    from { opacity: 0; transform: scale(0.96) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .modal-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid var(--border-subtle);
                    position: relative;
                }

                .modal-header-icon {
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

                .modal-header-text {
                    flex: 1;
                }

                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0;
                }

                .icon-btn-close {
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    cursor: pointer;
                    font-size: 1.25rem;
                    padding: 0.5rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s;
                }

                .icon-btn-close:hover {
                    color: var(--text-main);
                }

                .modal-body {
                    padding: 1.75rem 2rem;
                }

                .modal-intro {
                    font-size: 0.95rem;
                    color: var(--text-main);
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }

                .demo-notice {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    padding: 0.75rem 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.25rem;
                }

                .demo-notice-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    flex-shrink: 0;
                }

                .import-list-wrapper {
                    max-height: 220px;
                    overflow-y: auto;
                    margin-bottom: 1.5rem;
                    border-radius: var(--radius-md);
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid var(--border-subtle);
                }

                .import-list {
                    display: flex;
                    flex-direction: column;
                }

                .import-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .import-item:last-child {
                    border-bottom: none;
                }

                .import-item-main {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .import-item-title {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-main);
                }

                .import-item-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .import-item-amount {
                    font-weight: 600;
                    color: var(--accent-primary);
                    font-size: 0.95rem;
                }

                .modal-error-pill {
                    background: rgba(255, 115, 102, 0.1);
                    color: var(--error);
                    border: 1px solid rgba(255, 115, 102, 0.2);
                    border-radius: var(--radius-md);
                    padding: 0.75rem;
                    font-size: 0.85rem;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .modal-footer-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .modal-secondary-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .btn-text-danger {
                    background: transparent;
                    border: none;
                    color: var(--error);
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    transition: opacity 0.2s;
                }

                .btn-text-danger:hover {
                    opacity: 0.8;
                }

                .btn-danger {
                    background: var(--error);
                    color: white;
                }

                .btn-danger:hover {
                    opacity: 0.9;
                }

                .full-width {
                    width: 100%;
                    justify-content: center;
                }

                .result-container, .discard-confirm-box {
                    text-align: center;
                    padding: 1.5rem 0;
                }

                .result-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin: 0 auto 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                }

                .result-icon.success {
                    background: rgba(159, 220, 86, 0.15);
                    color: var(--accent-primary);
                }

                .result-icon.warning {
                    background: rgba(255, 115, 102, 0.15);
                    color: var(--error);
                }

                .result-heading {
                    font-size: 1.3rem;
                    margin-bottom: 0.5rem;
                }

                .result-detail {
                    color: var(--text-dim);
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .modal-actions-row {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }

                .mt-3 { margin-top: 1.5rem; }
                .mb-3 { margin-bottom: 1.5rem; }
            `}</style>
        </div>
    );
};

export default ImportModal;
