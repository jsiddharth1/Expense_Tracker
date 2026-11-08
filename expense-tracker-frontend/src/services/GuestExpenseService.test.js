import * as GuestExpenseService from './GuestExpenseService';

describe('GuestExpenseService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('initializes default demo expenses with isDemo: true and demo- prefix', () => {
        const expenses = GuestExpenseService.getGuestExpenses();
        expect(expenses.length).toBeGreaterThan(0);
        expenses.forEach((e) => {
            expect(e.isDemo).toBe(true);
            expect(e.clientId).toMatch(/^demo-/);
            expect(e.id).toBeDefined();
            expect(e.title).toBeDefined();
            expect(e.amount).toBeGreaterThan(0);
        });
    });

    test('adds user-created expense with isDemo: false and stable UUID clientId', () => {
        const newExpense = GuestExpenseService.addGuestExpense({
            title: 'Custom Coffee',
            amount: 180,
            category: 'Food',
            date: '2026-10-30',
            description: 'Afternoon coffee',
        });

        expect(newExpense.isDemo).toBe(false);
        expect(newExpense.clientId).toBeDefined();
        expect(newExpense.clientId).not.toMatch(/^demo-/);
        expect(newExpense.title).toBe('Custom Coffee');

        const all = GuestExpenseService.getGuestExpenses();
        expect(all.some((e) => e.id === newExpense.id)).toBe(true);
    });

    test('editing demo expense preserves isDemo: true to prevent entering real account', () => {
        const expenses = GuestExpenseService.getGuestExpenses();
        const demoItem = expenses.find((e) => e.isDemo === true);
        expect(demoItem).toBeDefined();

        const updated = GuestExpenseService.updateGuestExpense(demoItem.id, {
            title: 'Modified Demo Expense',
            amount: 999,
        });

        expect(updated.title).toBe('Modified Demo Expense');
        expect(updated.isDemo).toBe(true); // Must remain true!

        // Confirm it is NOT importable
        const importable = GuestExpenseService.getImportableGuestExpenses();
        expect(importable.some((e) => e.id === demoItem.id)).toBe(false);
    });

    test('getImportableGuestExpenses EXCLUDES all demo expenses strictly', () => {
        GuestExpenseService.getGuestExpenses(); // loads demo data

        // Add 2 user expenses
        const userExp1 = GuestExpenseService.addGuestExpense({
            title: 'My Dinner',
            amount: 450,
            category: 'Food',
            date: '2026-10-30',
        });
        const userExp2 = GuestExpenseService.addGuestExpense({
            title: 'Taxi Ride',
            amount: 220,
            category: 'Transport',
            date: '2026-10-30',
        });

        const importable = GuestExpenseService.getImportableGuestExpenses();

        // Must contain only the 2 user-created expenses
        expect(importable.length).toBe(2);
        expect(importable.every((e) => e.isDemo === false)).toBe(true);
        expect(importable.some((e) => e.id === userExp1.id)).toBe(true);
        expect(importable.some((e) => e.id === userExp2.id)).toBe(true);
    });

    test('deletes guest expense correctly from localStorage', () => {
        const exp = GuestExpenseService.addGuestExpense({
            title: 'Temporary item',
            amount: 100,
            category: 'Other',
            date: '2026-10-30',
        });

        expect(GuestExpenseService.getGuestExpenses().some((e) => e.id === exp.id)).toBe(true);

        GuestExpenseService.deleteGuestExpense(exp.id);

        expect(GuestExpenseService.getGuestExpenses().some((e) => e.id === exp.id)).toBe(false);
    });

    test('persists guest changes across simulated page refresh', () => {
        GuestExpenseService.addGuestExpense({
            title: 'Saved Item',
            amount: 550,
            category: 'Shopping',
            date: '2026-10-30',
        });

        // Simulate new page load reading directly from storage
        const loadedAfterRefresh = GuestExpenseService.getGuestExpenses();
        const found = loadedAfterRefresh.find((e) => e.title === 'Saved Item');
        expect(found).toBeDefined();
        expect(found.amount).toBe(550);
    });

    test('discardGuestData wipes guest storage', () => {
        GuestExpenseService.addGuestExpense({
            title: 'Wipe Me',
            amount: 120,
            category: 'Food',
            date: '2026-10-30',
        });

        GuestExpenseService.discardGuestData();

        expect(localStorage.getItem('guest_expenses')).toBeNull();
        expect(localStorage.getItem('guest_demo_initialized')).toBeNull();
    });
});
