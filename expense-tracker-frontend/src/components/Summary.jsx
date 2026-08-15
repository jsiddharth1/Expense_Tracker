import React, { useEffect, useState } from 'react';
import { getMonthlyTotal } from '../services/ExpenseService';
import { FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Summary = ({ refreshKey }) => {
    const [total, setTotal] = useState(0);
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();

    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;
        getMonthlyTotal(user.id, now.getMonth() + 1, now.getFullYear())
            .then(res => setTotal(res.data || 0))
            .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey, user]);

    return (
        <div className="card summary-card-modern">
            <header className="summary-header">
                <div className="summary-icon">
                    <FiTrendingUp />
                </div>
                <div>
                    <h2 className="summary-title">Monthly Focus</h2>
                    <p className="tiny text-dim flex-center gap-05">
                        <FiCalendar /> {monthName} {year}
                    </p>
                </div>
            </header>

            <div className="summary-box">
                <p className="summary-label">Capital Outflow</p>
                <h3 className="summary-amount">
                    <span className="currency">₹</span>
                    {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <div className="summary-badge">
                    Operational Efficiency 94%
                </div>
            </div>

            <style>{`
                .summary-card-modern {
                    width: 100%;
                    max-width: none;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                    padding: 1.25rem 2rem;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-subtle);
                    margin-top: 1.5rem;
                    flex: 1;
                    min-height: 0;
                }

                .summary-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .summary-icon {
                    width: 42px;
                    height: 42px;
                    background: rgba(159, 220, 86, 0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent-primary);
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }

                .summary-title {
                    font-size: 1.1rem;
                    margin: 0;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }

                .gap-05 { gap: 0.5rem; }
                .flex-center { display: flex; align-items: center; }

                .summary-box {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 16px;
                    padding: 0.75rem 1.5rem;
                    border: 1px solid var(--border-subtle);
                }

                .summary-label {
                    font-size: 0.7rem;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin: 0;
                    font-weight: 600;
                }

                .summary-amount {
                    font-size: 1.6rem;
                    color: var(--text-main);
                    margin: 0;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .currency {
                    color: var(--accent-primary);
                    font-size: 1.1rem;
                    opacity: 0.8;
                }

                .summary-badge {
                    display: inline-block;
                    padding: 0.3rem 0.8rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 999px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: var(--text-dim);
                    border: 1px solid var(--border-subtle);
                    white-space: nowrap;
                }

                @media (max-width: 768px) {
                    .summary-card-modern {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                    .summary-box {
                        width: 100%;
                        justify-content: space-between;
                    }
                }
            `}</style>
        </div>
    );
};

export default Summary;