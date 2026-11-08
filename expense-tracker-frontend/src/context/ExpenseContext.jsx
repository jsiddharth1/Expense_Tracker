import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import * as ExpenseApiService from '../services/ExpenseService';
import * as GuestExpenseService from '../services/GuestExpenseService';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [importResult, setImportResult] = useState(null);

    // Compute whether importable guest expenses exist
    const importableExpenses = useMemo(() => {
        return GuestExpenseService.getImportableGuestExpenses();
    }, [expenses]);

    const hasImportableExpenses = importableExpenses.length > 0;

    // Load expenses based on authentication state
    const loadExpenses = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (!isAuthenticated || !user?.id) {
            // GUEST MODE: read from localStorage
            try {
                const guestData = GuestExpenseService.getGuestExpenses();
                setExpenses(guestData);
            } catch (err) {
                console.error('Error loading guest expenses:', err);
                setError('Failed to load local expenses.');
            } finally {
                setLoading(false);
            }
            return;
        }

        // AUTHENTICATED MODE: fetch from backend API
        try {
            const res = await ExpenseApiService.getAllExpenses(user.id);
            setExpenses(res.data || []);
            
            // Check if there are user-created guest expenses eligible for import
            const pendingGuestExpenses = GuestExpenseService.getImportableGuestExpenses();
            if (pendingGuestExpenses.length > 0) {
                setShowImportModal(true);
            }
        } catch (err) {
            console.error('Error loading authenticated expenses:', err);
            setError('Failed to load expenses from cloud ledger.');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user?.id]);

    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

    // Handle logout or auth change: clear authenticated state from memory
    useEffect(() => {
        if (!isAuthenticated) {
            // When user logs out, reset in-memory state and load fresh guest data
            const guestData = GuestExpenseService.getGuestExpenses();
            setExpenses(guestData);
            setImportResult(null);
        }
    }, [isAuthenticated]);

    // ADD EXPENSE
    const addExpense = async (expenseData) => {
        if (!isAuthenticated || !user?.id) {
            // Guest mode
            const created = GuestExpenseService.addGuestExpense(expenseData);
            setExpenses((prev) => [created, ...prev]);
            return created;
        }

        // Authenticated mode
        const clientUuid = GuestExpenseService.generateUUID();
        const payload = {
            ...expenseData,
            clientId: clientUuid,
            user: { id: user.id },
        };
        const res = await ExpenseApiService.createExpense(payload);
        const created = res.data;
        setExpenses((prev) => [created, ...prev]);
        return created;
    };

    // UPDATE EXPENSE
    const updateExpense = async (id, updatedData) => {
        if (!isAuthenticated || !user?.id) {
            // Guest mode
            const updated = GuestExpenseService.updateGuestExpense(id, updatedData);
            setExpenses((prev) =>
                prev.map((item) => (item.id === id ? updated : item))
            );
            return updated;
        }

        // Authenticated mode: pass user.id for server-side ownership verification
        const payload = {
            ...updatedData,
            id,
            user: { id: user.id },
        };
        const res = await ExpenseApiService.updateExpense(id, payload, user.id);
        const updated = res.data;
        setExpenses((prev) =>
            prev.map((item) => (item.id === id ? updated : item))
        );
        return updated;
    };

    // DELETE EXPENSE
    const deleteExpense = async (id) => {
        if (!isAuthenticated || !user?.id) {
            // Guest mode
            GuestExpenseService.deleteGuestExpense(id);
            setExpenses((prev) => prev.filter((item) => item.id !== id));
            return true;
        }

        // Authenticated mode: pass user.id for server-side ownership verification
        await ExpenseApiService.deleteExpense(id, user.id);
        setExpenses((prev) => prev.filter((item) => item.id !== id));
        return true;
    };

    // GET MONTHLY TOTAL
    const getMonthlyTotal = useCallback(async (month, year) => {
        const targetMonth = month || new Date().getMonth() + 1;
        const targetYear = year || new Date().getFullYear();

        if (!isAuthenticated || !user?.id) {
            // Compute from local guest expenses
            const currentGuest = GuestExpenseService.getGuestExpenses();
            const summary = GuestExpenseService.calculateGuestSummary(currentGuest, targetMonth, targetYear);
            return summary.monthTotal;
        }

        try {
            const res = await ExpenseApiService.getMonthlyTotal(user.id, targetMonth, targetYear);
            return res.data || 0;
        } catch (err) {
            // Fallback calculation from local state if API fails
            let total = 0;
            expenses.forEach((e) => {
                if (e.date) {
                    const [y, m] = String(e.date).slice(0, 10).split('-').map(Number);
                    if (y === targetYear && m === targetMonth) {
                        total += Number(e.amount) || 0;
                    }
                }
            });
            return total;
        }
    }, [isAuthenticated, user?.id, expenses]);

    // GET SUMMARY
    const getExpenseSummary = useCallback(() => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        let monthTotal = 0;
        const categoryTotals = {};

        expenses.forEach((item) => {
            const amt = Number(item.amount) || 0;
            const cat = item.category || 'Other';
            categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;

            if (item.date) {
                const dateStr = String(item.date).slice(0, 10);
                const [y, m] = dateStr.split('-').map(Number);
                if (y === currentYear && m === currentMonth) {
                    monthTotal += amt;
                }
            }
        });

        const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

        return {
            totalExpenses,
            monthTotal,
            categoryTotals,
            count: expenses.length,
        };
    }, [expenses]);

    // IMPORT GUEST EXPENSES INTO AUTHENTICATED ACCOUNT
    const importGuestExpensesToAccount = async () => {
        if (!isAuthenticated || !user?.id) {
            throw new Error('You must be logged in to import expenses.');
        }

        const eligible = GuestExpenseService.getImportableGuestExpenses();
        if (eligible.length === 0) {
            return { created: 0, alreadyImported: 0, rejected: 0 };
        }

        // Validate and prepare records with stable client IDs
        const validatedExpenses = eligible.map((exp) => ({
            title: exp.title,
            amount: Number(exp.amount),
            category: exp.category || 'Other',
            description: exp.description || '',
            date: exp.date,
            clientId: exp.clientId || GuestExpenseService.generateUUID(),
        }));

        try {
            const res = await ExpenseApiService.importGuestExpenses(user.id, validatedExpenses);
            const result = res.data;
            setImportResult(result);

            // Clean up imported guest expenses from localStorage
            GuestExpenseService.discardGuestData();

            // Refresh account expenses to include newly imported records
            await loadExpenses();

            return result;
        } catch (err) {
            console.error('Import failed:', err);
            throw err;
        }
    };

    // DISCARD GUEST DATA
    const discardGuestData = () => {
        GuestExpenseService.discardGuestData();
        setShowImportModal(false);
    };

    // SKIP IMPORT
    const skipImport = () => {
        setShowImportModal(false);
    };

    return (
        <ExpenseContext.Provider
            value={{
                expenses,
                loading,
                error,
                isGuest: !isAuthenticated,
                addExpense,
                updateExpense,
                deleteExpense,
                getMonthlyTotal,
                getExpenseSummary,
                refreshExpenses: loadExpenses,
                importGuestExpensesToAccount,
                discardGuestData,
                skipImport,
                importableExpenses,
                hasImportableExpenses,
                showImportModal,
                setShowImportModal,
                showAuthModal,
                setShowAuthModal,
                importResult,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenses must be used within an ExpenseProvider');
    }
    return context;
};
