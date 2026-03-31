import React, { useState } from 'react';
import { deleteExpense } from '../services/ExpenseService';
import { FiEdit3, FiTrash2, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';

const CATEGORY_COLORS = {
    Food:       '#9FDC56',
    Transport:  '#545FFF',
    Shopping:   '#FF7366',
    Bills:      '#EAFFD2',
    Health:     '#FFFFFF',
    Other:      '#888888',
};

const ExpenseList = ({ expenses, onDelete, onEdit, showToast }) => {
    const [confirmId, setConfirmId] = useState(null);

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            setConfirmId(null);
            onDelete();
            showToast('Expense deleted from records.', 'success');
        } catch (error) {
            showToast('Failed to delete: ' + (error.response?.data || error.message), 'error');
        }
    };

    return (
        <div className="card list-card-modern">
            <header className="list-header flex-between mb-2">
                <div>
                    <h2 className="card-title">Transaction Ledger</h2>
                    <p className="tiny text-dim">Audit Trail Enabled</p>
                </div>
                <div className="list-stats text-dim tiny">
                    Showing {expenses.length} records
                </div>
            </header>

            <div className="modern-table-wrapper">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-text">
                                    <FiAlertCircle style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} />
                                    <p>No transactions found in this workspace.</p>
                                </td>
                            </tr>
                        ) : (
                            expenses.map(e => (
                                <tr key={e.id} className="list-row">
                                    <td className="font-600">
                                        <div className="title-desc">
                                            <p className="m-0">{e.title}</p>
                                            <p className="tiny text-dim m-0 font-400">{e.description || 'No notes attached'}</p>
                                        </div>
                                    </td>
                                    <td className="text-accent font-700">₹{Number(e.amount).toLocaleString()}</td>
                                    <td>
                                        <span className="cat-pill" style={{ background: CATEGORY_COLORS[e.category] || '#333' }}>
                                            {e.category || 'Other'}
                                        </span>
                                    </td>
                                    <td className="text-dim tiny">{e.date}</td>
                                    <td className="text-right">
                                        {confirmId === e.id ? (
                                            <div className="confirm-actions">
                                                <button className="icon-btn-confirm yes" onClick={() => handleDelete(e.id)} title="Confirm Delete">
                                                    <FiCheck />
                                                </button>
                                                <button className="icon-btn-confirm no"  onClick={() => setConfirmId(null)} title="Cancel">
                                                    <FiX />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="row-actions">
                                                <button className="icon-btn edit" onClick={() => onEdit(e)} title="Edit Record">
                                                    <FiEdit3 />
                                                </button>
                                                <button className="icon-btn delete" onClick={() => setConfirmId(e.id)} title="Delete Record">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                .list-card-modern { width: 100%; min-width: 600px; }
                
                .title-desc { display: flex; flex-direction: column; gap: 0.1rem; }
                .list-row { transition: background 0.3s ease; }
                .list-row:hover { background: rgba(255, 255, 255, 0.02); }

                .row-actions, .confirm-actions { 
                    display: flex; 
                    gap: 0.75rem; 
                    justify-content: flex-end; 
                }

                .icon-btn {
                    background: transparent;
                    border: 1px solid var(--border-subtle);
                    color: var(--text-dim);
                    width: 34px;
                    height: 34px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 1rem;
                }

                .icon-btn.edit:hover { background: var(--accent-secondary); color: white; border-color: var(--accent-secondary); }
                .icon-btn.delete:hover { background: var(--error); color: white; border-color: var(--error); }

                .icon-btn-confirm {
                    background: transparent;
                    border: 1px solid var(--border-subtle);
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .icon-btn-confirm.yes { color: var(--error); border-color: var(--error); }
                .icon-btn-confirm.yes:hover { background: var(--error); color: white; }
                .icon-btn-confirm.no { color: var(--text-dim); }
                .icon-btn-confirm.no:hover { background: rgba(255,255,255,0.1); color: white; }

                .empty-text {
                    text-align: center;
                    padding: 5rem 2rem;
                    color: var(--text-dim);
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    );
};

export default ExpenseList;