import React, { useState, useEffect } from 'react';
import ExpenseForm      from '../components/ExpenseForm';
import ExpenseList      from '../components/ExpenseList';
import Summary          from '../components/Summary';
import { getAllExpenses } from '../services/ExpenseService';
import ToastContainer, { useToast } from '../components/Toast';
import { FiChevronRight, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [expenses, setExpenses]           = useState([]);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [refreshKey, setRefreshKey]       = useState(0);
    const { toasts, showToast, removeToast } = useToast();
    const { user } = useAuth();

    const loadExpenses = async () => {
        if (!user?.id) return;
        try {
            const res = await getAllExpenses(user.id);
            setExpenses(res.data);
            setRefreshKey(k => k + 1);
        } catch (err) {
            showToast('Operational Failure: Connection to ledger lost.', 'error');
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadExpenses(); }, [user]);

    const handleEdit = (expense) => {
        setExpenseToEdit(expense);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearEdit = () => setExpenseToEdit(null);

    return (
        <div className="app-container home-page">
            <header className="home-header mb-3">
                <div className="flex-between">
                    <div>
                        <p className="tiny text-dim flex-center gap-05 mb-05"><FiGrid /> System Node v1.0.4</p>
                        <h1 className="h1-modern">Asset Tracking</h1>
                    </div>
                    <div className="status-indicator">
                        <span className="dot pulse"></span>
                        <span className="text-dim tiny">Real-time sync</span>
                    </div>
                </div>
            </header>

            <div className="home-content-grid">
                <div className="side-column">
                    <ExpenseForm
                        onExpenseAdded={loadExpenses}
                        expenseToEdit={expenseToEdit}
                        clearEdit={clearEdit}
                        showToast={showToast}
                    />
                    <Summary refreshKey={refreshKey} />
                </div>
                
                <div className="main-column">
                    <div className="audit-tools flex-between mb-1">
                        <div className="flex-center gap-05 text-dim tiny">
                            Home <FiChevronRight /> Records <FiChevronRight /> Financial Log
                        </div>
                    </div>
                    <ExpenseList
                        expenses={expenses}
                        onDelete={loadExpenses}
                        onEdit={handleEdit}
                        showToast={showToast}
                    />
                </div>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <style>{`
                .home-page { padding-top: 2rem; }
                .mb-05 { margin-bottom: 0.5rem; }
                .gap-05 { gap: 0.5rem; }
                
                .h1-modern { font-size: 2.8rem; letter-spacing: -0.04em; margin-bottom: 2rem; }

                .home-content-grid {
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    gap: 2.5rem;
                    align-items: start;
                }

                .side-column {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .main-column {
                    display: flex;
                    flex-direction: column;
                    min-width: 0; /* Fix flex layout overflow */
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