import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ExpenseProvider, useExpenses } from './ExpenseContext';
import { AuthProvider } from './AuthContext';
import * as GuestExpenseService from '../services/GuestExpenseService';

const wrapper = ({ children }) => (
    <AuthProvider>
        <ExpenseProvider>{children}</ExpenseProvider>
    </AuthProvider>
);

describe('ExpenseContext - Shared Data Layer in Guest Mode', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('operates in guest mode by default with sample data', () => {
        const { result } = renderHook(() => useExpenses(), { wrapper });

        expect(result.current.isGuest).toBe(true);
        expect(result.current.expenses.length).toBeGreaterThan(0);
        expect(result.current.hasImportableExpenses).toBe(false); // Only demo data initialized
    });

    test('adds user-created expense and updates summary immediately', async () => {
        const { result } = renderHook(() => useExpenses(), { wrapper });

        await act(async () => {
            await result.current.addExpense({
                title: 'New Guest Book',
                amount: 350.0,
                category: 'Shopping',
                date: '2026-10-30',
                description: 'Technical reading',
            });
        });

        // Newly added expense should be in state
        const added = result.current.expenses.find((e) => e.title === 'New Guest Book');
        expect(added).toBeDefined();
        expect(added.isDemo).toBe(false);
        expect(added.clientId).toBeDefined();

        // hasImportableExpenses should now be true
        expect(result.current.hasImportableExpenses).toBe(true);
        expect(result.current.importableExpenses.length).toBe(1);

        // Summary should include the new amount
        const summary = result.current.getExpenseSummary();
        expect(summary.categoryTotals['Shopping']).toBeGreaterThanOrEqual(350);
    });

    test('updates an existing guest expense', async () => {
        const { result } = renderHook(() => useExpenses(), { wrapper });

        let created;
        await act(async () => {
            created = await result.current.addExpense({
                title: 'Lunch',
                amount: 150.0,
                category: 'Food',
                date: '2026-10-30',
            });
        });

        await act(async () => {
            await result.current.updateExpense(created.id, {
                title: 'Business Lunch',
                amount: 250.0,
            });
        });

        const updated = result.current.expenses.find((e) => e.id === created.id);
        expect(updated.title).toBe('Business Lunch');
        expect(updated.amount).toBe(250.0);
    });

    test('deletes a guest expense and updates list immediately', async () => {
        const { result } = renderHook(() => useExpenses(), { wrapper });

        let created;
        await act(async () => {
            created = await result.current.addExpense({
                title: 'To Be Deleted',
                amount: 50.0,
                category: 'Other',
                date: '2026-10-30',
            });
        });

        expect(result.current.expenses.some((e) => e.id === created.id)).toBe(true);

        await act(async () => {
            await result.current.deleteExpense(created.id);
        });

        expect(result.current.expenses.some((e) => e.id === created.id)).toBe(false);
    });

    test('built-in demo expenses are strictly never included in importableExpenses', async () => {
        const { result } = renderHook(() => useExpenses(), { wrapper });

        // Currently only demo expenses exist
        expect(result.current.importableExpenses.length).toBe(0);

        // Edit a demo expense
        const demoItem = result.current.expenses.find((e) => e.isDemo === true);
        expect(demoItem).toBeDefined();

        await act(async () => {
            await result.current.updateExpense(demoItem.id, {
                title: 'Edited Demo Item',
                amount: 999.0,
            });
        });

        // Even after editing, demo expense remains isDemo=true and excluded from importable
        expect(result.current.importableExpenses.length).toBe(0);
        expect(result.current.hasImportableExpenses).toBe(false);
    });

    test('discardGuestData removes local expenses', async () => {
        const { result } = renderHook(() => useExpenses(), { wrapper });

        await act(async () => {
            await result.current.addExpense({
                title: 'Temporary Data',
                amount: 100,
                category: 'Food',
                date: '2026-10-30',
            });
        });

        expect(result.current.hasImportableExpenses).toBe(true);

        act(() => {
            result.current.discardGuestData();
        });

        expect(localStorage.getItem('guest_expenses')).toBeNull();
    });
});
