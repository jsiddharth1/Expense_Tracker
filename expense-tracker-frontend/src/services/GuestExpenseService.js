// GuestExpenseService.js
// Manages local guest expenses, sample demo data, and localStorage persistence.

export const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const STORAGE_KEY = 'guest_expenses';
const DEMO_INITIALIZED_KEY = 'guest_demo_initialized';

export const getGuestExpenses = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const initialized = localStorage.getItem(DEMO_INITIALIZED_KEY);

    if (!raw && !initialized) {
        // Demo data disabled: return empty list
        return [];
    }

    try {
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Failed to parse guest expenses from localStorage', e);
        return [];
    }
};

export const saveGuestExpenses = (expenses) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    localStorage.setItem(DEMO_INITIALIZED_KEY, 'true');
};

export const addGuestExpense = (expenseData) => {
    const current = getGuestExpenses();
    const newId = generateUUID();
    const newClientId = generateUUID();

    const newExpense = {
        ...expenseData,
        id: newId,
        clientId: newClientId,
        amount: Number(expenseData.amount) || 0,
        isDemo: false, // Explicitly user-created, eligible for import
        createdAt: new Date().toISOString(),
    };

    const updated = [newExpense, ...current];
    saveGuestExpenses(updated);
    return newExpense;
};

export const updateGuestExpense = (id, updatedData) => {
    const current = getGuestExpenses();
    let updatedItem = null;

    const updated = current.map((item) => {
        if (item.id === id) {
            updatedItem = {
                ...item,
                ...updatedData,
                id: item.id,
                clientId: item.clientId || generateUUID(),
                amount: Number(updatedData.amount !== undefined ? updatedData.amount : item.amount) || 0,
                // Critical rule: Editing a demo expense keeps isDemo=true so it cannot silently enter a real account
                isDemo: item.isDemo === true,
            };
            return updatedItem;
        }
        return item;
    });

    saveGuestExpenses(updated);
    return updatedItem;
};

export const deleteGuestExpense = (id) => {
    const current = getGuestExpenses();
    const updated = current.filter((item) => item.id !== id);
    saveGuestExpenses(updated);
    return true;
};

export const getImportableGuestExpenses = () => {
    const current = getGuestExpenses();
    // Exclude all built-in sample/demo records strictly via explicit metadata
    return current.filter((item) => item.isDemo !== true);
};

export const hasImportableGuestExpenses = () => {
    return getImportableGuestExpenses().length > 0;
};

export const discardGuestData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DEMO_INITIALIZED_KEY);
};

export const resetGuestDataToDemo = () => {
    discardGuestData();
    return getGuestExpenses();
};

export const calculateGuestSummary = (expenses, month, year) => {
    const targetMonth = month !== undefined ? month : new Date().getMonth() + 1;
    const targetYear = year !== undefined ? year : new Date().getFullYear();

    let monthTotal = 0;
    const categoryTotals = {};

    expenses.forEach((item) => {
        const amt = Number(item.amount) || 0;
        const cat = item.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;

        if (item.date) {
            const [y, m] = item.date.split('-').map(Number);
            if (y === targetYear && m === targetMonth) {
                monthTotal += amt;
            }
        }
    });

    return {
        monthTotal,
        categoryTotals,
        totalExpenses: Object.values(categoryTotals).reduce((a, b) => a + b, 0),
    };
};
