import React, { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Summary from '../components/Summary';
import ToastContainer, { useToast } from '../components/Toast';
import { FiGrid, FiDatabase, FiCloud } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';

const Home = () => {
    const { expenses, isGuest, refreshExpenses } = useExpenses();
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    const handleEdit = (expense) => {
        setExpenseToEdit(expense);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearEdit = () => setExpenseToEdit(null);

    return (
        <div className="app-container home-page">
            <header className="home-header">
                <div className="flex-between">
                    <div>
                        <p className="tiny text-dim flex-center gap-05 mb-05">
                            <FiGrid /> System Node v1.0.4
                        </p>
                        <h1 className="h1-modern">Asset Tracking</h1>
                    </div>
                    <div className="status-indicator">
                        <span className={`dot ${isGuest ? 'dot-guest' : 'pulse'}`}></span>
                        <span className="text-dim tiny flex-center gap-05">
                            {isGuest ? (
                                <>
                                    <FiDatabase /> Guest Mode — Demo Data
                                </>
                            ) : (
                                <>
                                    <FiCloud /> Real-time Cloud Sync
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </header>

            <div className="home-content-grid">
                <div className="side-column">
                    <ExpenseForm
                        onExpenseAdded={refreshExpenses}
                        expenseToEdit={expenseToEdit}
                        clearEdit={clearEdit}
                        showToast={showToast}
                    />
                </div>

                <div className="main-column">
                    <ExpenseList
                        expenses={expenses}
                        onDelete={refreshExpenses}
                        onEdit={handleEdit}
                        showToast={showToast}
                    />
                    <Summary refreshKey={expenses.length} />
                </div>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <style>{`
                .home-page { padding-top: 2rem; min-height: calc(100vh - 90px); display: flex; flex-direction: column; }
                .mb-05 { margin-bottom: 0.5rem; }
                .gap-05 { gap: 0.5rem; }
                
                .h1-modern { font-size: 2.8rem; letter-spacing: -0.04em; margin-bottom: 2rem; }

                .home-content-grid {
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    gap: 2.5rem;
                    align-items: stretch;
                    flex: 1;
                }

                .side-column {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .main-column {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    min-height: 100%;
                }

                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.5rem 1rem;
                    border-radius: 999px;
                    border: 1px solid var(--border-subtle);
                }

                .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-primary); }
                .dot-guest { background: #545FFF; }
                .pulse { animation: pulse-anim 2s infinite; }

                @keyframes pulse-anim {
                    0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(159, 220, 86, 0.4); }
                    70% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 0 10px rgba(159, 220, 86, 0); }
                    100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(159, 220, 86, 0); }
                }

                @media (max-width: 1024px) {
                    .home-content-grid { grid-template-columns: 1fr; }
                    .side-column { order: 2; width: 100%; max-width: none; }
                    .main-column { order: 1; }
                }
            `}</style>
        </div>
    );
};

export default Home;
