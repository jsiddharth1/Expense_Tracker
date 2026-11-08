import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock chart.js so tests don't fail on canvas rendering
jest.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="mock-bar-chart">Bar Chart</div>,
    Doughnut: () => <div data-testid="mock-doughnut-chart">Doughnut Chart</div>,
}));

describe('App Guest Mode & Progressive Auth', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('renders guest dashboard on default route / without requiring login', async () => {
        render(<App />);

        await waitFor(() => {
            // Guest mode badge should be present (in navbar and/or header)
            const badges = screen.getAllByText(/Guest Mode — Demo Data/i);
            expect(badges.length).toBeGreaterThan(0);
        });

        // Header shows Asset Tracking immediately
        expect(screen.getByText('Asset Tracking')).toBeInTheDocument();

        // Transaction Ledger is visible with demo data
        expect(screen.getByText('Transaction Ledger')).toBeInTheDocument();

        // Header has Login and Sign Up available
        expect(screen.getByText('Log In')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();

        // Form is present and functional for guest
        expect(screen.getByPlaceholderText(/e\.g\. Server Infrastructure/i)).toBeInTheDocument();
    });

    test('shows sample demo records on initial load', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Weekly Groceries')).toBeInTheDocument();
            expect(screen.getByText('Metro Transit Pass')).toBeInTheDocument();
        });
    });
});
