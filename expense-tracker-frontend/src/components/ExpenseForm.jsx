import React, { useState, useEffect } from 'react';
import { createExpense, updateExpense } from '../services/ExpenseService';
import { FiPlus, FiSave, FiX, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Other'];

const toDateString = (d) => {
    if (!d) return '';
    if (Array.isArray(d)) {
        const [y, m, day] = d;
        return `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    }
    return String(d).slice(0, 10);
};

const ExpenseForm = ({ onExpenseAdded, expenseToEdit, clearEdit, showToast }) => {
    const emptyForm = { title: '', amount: '', category: '', date: '', description: '' };
    const [form, setForm]       = useState(emptyForm);
    const [saving, setSaving]   = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        setForm(expenseToEdit
            ? {
                title:       expenseToEdit.title       || '',
                amount:      expenseToEdit.amount      || '',
                category:    expenseToEdit.category    || '',
                date:        toDateString(expenseToEdit.date),
                description: expenseToEdit.description || '',
              }
            : emptyForm
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expenseToEdit]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!form.title || !form.amount || !form.date) {
            showToast('Please fill Title, Amount and Date!', 'error');
            return;
        }
        setSaving(true);
        try {
            if (expenseToEdit) {
                await updateExpense(expenseToEdit.id, { ...form, id: expenseToEdit.id, user: { id: user.id } });
                showToast('Expense updated successfully!', 'success');
                clearEdit();
            } else {
                await createExpense({ ...form, user: { id: user.id } });
                showToast('Expense added successfully!', 'success');
            }
            setForm(emptyForm);
            onExpenseAdded();
        } catch (error) {
            showToast('Error: ' + (error.response?.data || error.message), 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card expense-form-card">
            <header className="form-header">
                <div className="icon-badge">
                    {expenseToEdit ? <FiSave /> : <FiPlus />}
                </div>
                <div>
                    <h2 className="form-title">
                        {expenseToEdit ? 'Edit Transaction' : 'Record Expense'}
                    </h2>
                    <p className="tiny text-dim">Optimization engine active</p>
                </div>
            </header>

            <div className="form-fields">
                <div className="field-group">
                    <label className="field-label"><FiInfo /> Title</label>
                    <input 
                        name="title"
                        placeholder="e.g. Server Infrastructure"
                        value={form.title} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="field-row">
                    <div className="field-group">
                        <label className="field-label">Amount (₹)</label>
                        <input 
                            name="amount"
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="0.00"
                            value={form.amount} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="field-group">
                        <label className="field-label">Category</label>
                        <select name="category" value={form.category} onChange={handleChange}>
                            <option value="">Select...</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="field-group">
                    <label className="field-label">Date</label>
                    <input 
                        name="date"
                        type="date"
                        value={form.date} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="field-group">
                    <label className="field-label">Note</label>
                    <textarea 
                        name="description"
                        placeholder="Additional architectural notes..."
                        rows="2"
                        value={form.description} 
                        onChange={handleChange} 
                    />
                </div>
            </div>

            <div className="form-actions">
                <button
                    className="btn-pill btn-primary full-width"
                    onClick={handleSubmit}
                    disabled={saving}
                >
                    {saving ? 'Processing...' : (
                        <>
                            <FiCheckCircle />
                            <span>{expenseToEdit ? 'Finalize Changes' : 'Initialize Record'}</span>
                        </>
                    )}
                </button>

                {expenseToEdit && (
                    <button className="btn-pill btn-secondary full-width mt-1" onClick={clearEdit}>
                        <FiX /> Cancel
                    </button>
                )}
            </div>

            <style>{`
                .expense-form-card {
                    width: 100%;
                    max-width: 400px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-subtle);
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .form-header {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }

                .icon-badge {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: var(--accent-primary);
                    border: 1px solid var(--border-subtle);
                }

                .form-title {
                    font-size: 1.25rem;
                    margin: 0;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }

                .form-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .field-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .field-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .field-label svg {
                    font-size: 0.9rem;
                    color: var(--accent-primary);
                }

                textarea, select {
                    background: #1a1c19;
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    padding: 0.75rem 1rem;
                    color: var(--text-main);
                    outline: none;
                    width: 100%;
                    font-family: inherit;
                }

                textarea { resize: none; }
                textarea:focus, select:focus { border-color: var(--accent-primary); }

                select option {
                    background: #1a1c19;
                    color: white;
                }

                .form-actions { margin-top: 0.5rem; }
                .full-width { width: 100%; justify-content: center; padding: 1rem; }
                .mt-1 { margin-top: 0.75rem; }
            `}</style>
        </div>
    );
};

export default ExpenseForm;