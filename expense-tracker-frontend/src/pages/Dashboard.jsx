import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getAllExpenses, getMonthlyTotal } from '../services/ExpenseService';
import { useAuth } from '../context/AuthContext';
import { FiTrendingUp, FiPieChart, FiActivity, FiDollarSign } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CATEGORY_COLORS = {
    Food:       '#9FDC56', // Lime Primary
    Transport:  '#545FFF', // Royal Blue
    Shopping:   '#FF7366', // Coral
    Bills:      '#EAFFD2', // Pale Green
    Health:     '#FFFFFF', // White
    Other:      '#888888', // Gray
};

const Dashboard = () => {
    const [expenses, setExpenses]     = useState([]);
    const [monthTotal, setMonthTotal] = useState(0);
    const [loading, setLoading]       = useState(true);

    const now        = new Date();
    const monthName  = now.toLocaleString('default', { month: 'long' });
    const year       = now.getFullYear();

    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;
        Promise.all([
            getAllExpenses(user.id),
            getMonthlyTotal(user.id, now.getMonth() + 1, year),
        ]).then(([expRes, totalRes]) => {
            setExpenses(expRes.data);
            setMonthTotal(totalRes.data || 0);
        }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const categoryTotals = expenses.reduce((acc, e) => {
        const cat = e.category || 'Other';
        acc[cat] = (acc[cat] || 0) + (e.amount || 0);
        return acc;
    }, {});

    const categories = Object.keys(categoryTotals);
    const amounts    = categories.map(c => categoryTotals[c]);
    const bgColors   = categories.map(c => CATEGORY_COLORS[c] || '#999');

    const barData = {
        labels: categories,
        datasets: [{
            label: 'Total Spent (₹)',
            data: amounts,
            backgroundColor: bgColors,
            borderRadius: 12,
            borderSkipped: false,
        }],
    };

    const doughnutData = {
        labels: categories,
        datasets: [{
            data: amounts,
            backgroundColor: bgColors,
            borderColor: '#161815',
            borderWidth: 4,
            hoverOffset: 12,
            hoverBorderColor: 'transparent',
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { 
                position: 'bottom',
                labels: { color: '#888', font: { family: 'Inter', size: 11, weight: '500' }, usePointStyle: true, padding: 20 }
            },
        },
        scales: {
            y: { display: false, grid: { display: false } },
            x: { 
                ticks: { color: '#888', font: { family: 'Inter', size: 10 } }, 
                grid: { display: false }
            }
        },
        cutout: '75%',
    };

    const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const allTotal = expenses.reduce((s, e) => s + (e.amount || 0), 0);

    if (loading) return (
        <div className="flex-center" style={{ height: '70vh', flexDirection: 'column', gap: '1rem' }}>
            <div className="loader"></div>
            <p className="text-dim">Analyzing your finances...</p>
            <style>{`
                .flex-center { display: flex; justify-content: center; align-items: center; }
                .loader { width: 30px; height: 30px; border: 3px solid rgba(159, 220, 86, 0.1); border-top-color: #9FDC56; border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );

    return (
        <div className="app-container dashboard-page">
            <header className="dashboard-header flex-between">
                <div>
                    <p className="text-dim mb-1">Performance Optimization</p>
                    <h1 className="h1-modern">Finance Analytics</h1>
                </div>
                <div className="date-picker-pills">
                    <span className="pill active">{monthName}</span>
                    <span className="pill">{year}</span>
                </div>
            </header>

            {/* Stat Cards Grid */}
            <div className="grid-metrics mb-3">
                <StatCard 
                    label="Monthly Spend" 
                    value={`₹ ${monthTotal.toLocaleString()}`} 
                    icon={<FiTrendingUp />} 
                    trend="+12%" 
                    primary 
                />
                <StatCard 
                    label="All-Time Total" 
                    value={`₹ ${allTotal.toLocaleString()}`} 
                    icon={<FiDollarSign />} 
                    trend="-5%" 
                />
                <StatCard 
                    label="Total Logs" 
                    value={expenses.length} 
                    icon={<FiActivity />} 
                    trend="+2.4%" 
                />
                <StatCard 
                    label="Active Categories" 
                    value={categories.length} 
                    icon={<FiPieChart />} 
                />
            </div>

            <div className="dashboard-grid">
                {/* Chart Section */}
                <div className="card chart-main">
                    <div className="flex-between mb-2">
                        <h3 className="card-title">Spending Architecture</h3>
                        <p className="text-dim tiny">Live Visualization</p>
                    </div>
                    <div className="chart-container">
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>

                <div className="card chart-breakdown">
                    <h3 className="card-title mb-2">Category Split</h3>
                    <div className="chart-container-donut">
                        <Doughnut data={doughnutData} options={chartOptions} />
                    </div>
                    <div className="donut-footer mt-2 text-center">
                        <p className="tiny text-dim uppercase">Architecture Total</p>
                        <p className="val-large text-accent">₹{allTotal.toLocaleString()}</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card table-card">
                    <div className="flex-between mb-2">
                        <h3 className="card-title">Recent Transactions</h3>
                        <button className="btn-secondary btn-pill tiny">View All</button>
                    </div>
                    {recent.length === 0 ? (
                        <p className="empty-text">Initialize tracking to see data split.</p>
                    ) : (
                        <div className="modern-table-wrapper">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Project / Item</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th className="text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent.map(e => (
                                        <tr key={e.id}>
                                            <td className="font-600">{e.title}</td>
                                            <td>
                                                <span className="cat-pill" style={{ background: CATEGORY_COLORS[e.category] || '#333' }}>
                                                    {e.category}
                                                </span>
                                            </td>
                                            <td className="text-accent font-700">₹{e.amount}</td>
                                            <td className="text-dim text-right tiny">{e.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .dashboard-page { padding-top: 1rem; }
                .mb-1 { margin-bottom: 0.5rem; }
                .mb-2 { margin-bottom: 1.5rem; }
                .mb-3 { margin-bottom: 2.5rem; }
                .tiny { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .font-600 { font-weight: 600; }
                .font-700 { font-weight: 700; }
                .text-right { text-align: right; }
                .uppercase { text-transform: uppercase; }

                .h1-modern { font-size: 2.5rem; margin: 0; line-height: 1; margin-bottom: 0.5rem; }

                .date-picker-pills { 
                    background: var(--bg-secondary); 
                    padding: 0.4rem; 
                    border-radius: 999px; 
                    display: flex; 
                    gap: 0.25rem; 
                    border: 1px solid var(--border-subtle);
                }
                .date-picker-pills .pill { 
                    padding: 0.5rem 1.25rem; 
                    border-radius: 999px; 
                    font-size: 0.85rem; 
                    cursor: pointer; 
                    color: var(--text-dim);
                    transition: all 0.3s ease;
                }
                .date-picker-pills .pill.active { background: #333; color: white; }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    grid-template-rows: auto auto;
                    gap: 1.5rem;
                }

                .chart-main { grid-column: span 1; }
                .chart-breakdown { grid-column: span 1; }
                .table-card { grid-column: span 2; }

                .card-title { font-size: 1.1rem; color: #FFFFFF; font-weight: 600; margin: 0; }
                .chart-container { height: 260px; }
                .chart-container-donut { height: 260px; position: relative; }
                
                .donut-footer { margin-top: 1rem; }
                .text-center { text-align: center; }
                .val-large { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; margin: 0.25rem 0; }
                .text-accent { color: var(--accent-primary); }

                .stat-card-modern {
                    position: relative;
                    overflow: hidden;
                }
                .stat-card-modern.primary { background: var(--accent-primary); color: var(--text-dark); }
                .stat-card-modern.primary .text-dim { color: rgba(0,0,0,0.5); }
                .stat-card-modern.primary .icon-box { background: rgba(0,0,0,0.1); color: var(--text-dark); }

                .icon-box {
                    width: 42px;
                    height: 42px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: var(--accent-primary);
                    margin-bottom: 1.5rem;
                }

                .stat-label { font-size: 0.85rem; font-weight: 500; margin-bottom: 0.5rem; }
                .stat-value { font-size: 1.8rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
                .stat-trend { font-size: 0.75rem; font-weight: 600; margin-top: 0.5rem; display: flex; gap: 0.25rem; }

                .modern-table-wrapper { margin-top: 1rem; overflow-x: auto; }
                .modern-table { width: 100%; border-collapse: collapse; }
                .modern-table th { text-align: left; padding: 1rem; color: var(--text-dim); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid var(--border-subtle); }
                .modern-table td { padding: 1.25rem 1rem; border-bottom: 1px solid var(--border-subtle); color: var(--text-main); font-size: 0.9rem; }
                .modern-table tr:last-child td { border-bottom: none; }
                
                .cat-pill { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; color: #000; }

                .empty-text { padding: 4rem 2rem; text-align: center; color: var(--text-dim); font-style: italic; }

                @media (max-width: 1024px) {
                    .dashboard-grid { grid-template-columns: 1fr; }
                    .table-card { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
};

const StatCard = ({ label, value, icon, trend, primary }) => (
    <div className={`card stat-card-modern ${primary ? 'primary' : ''}`}>
        <div className="icon-box">{icon}</div>
        <p className="text-dim stat-label">{label}</p>
        <h2 className="stat-value">{value}</h2>
        {trend && (
            <div className="stat-trend" style={{ color: trend.startsWith('+') ? (primary ? '#000' : '#9FDC56') : '#FF7366' }}>
                {trend} <span style={{ opacity: 0.6 }}>vs last month</span>
            </div>
        )}
    </div>
);

export default Dashboard;
