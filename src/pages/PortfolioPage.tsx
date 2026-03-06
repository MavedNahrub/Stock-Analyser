import { PlusCircle, Trash2, Briefcase, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useCallback } from 'react';
import { portfolioApi, type PortfolioEntry } from '../services/api';
import { mockStockData } from '../data/mockData';

export const PortfolioPage = () => {
    const [entries, setEntries] = useState<PortfolioEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formSymbol, setFormSymbol] = useState('');
    const [formQuantity, setFormQuantity] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchPortfolio = useCallback(async () => {
        try {
            const data = await portfolioApi.getAll();
            setEntries(data);
            localStorage.setItem('stockpulse_portfolio', JSON.stringify(data));
        } catch (err) {
            console.log('Backend unavailable, trying offline cache');
            const cached = localStorage.getItem('stockpulse_portfolio');
            if (cached) {
                setEntries(JSON.parse(cached));
            } else {
                setEntries([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const symbol = formSymbol.trim().toUpperCase();
        const qty = parseFloat(formQuantity);
        const price = parseFloat(formPrice);

        if (!symbol) { setFormError('Enter a stock symbol'); return; }
        if (isNaN(qty) || qty <= 0) { setFormError('Enter a valid quantity'); return; }
        if (isNaN(price) || price <= 0) { setFormError('Enter a valid price'); return; }

        setSubmitting(true);
        try {
            const stock = mockStockData[symbol];
            const newEntry = await portfolioApi.add({
                symbol,
                company_name: stock?.companyName || symbol,
                quantity: qty,
                purchase_price: price,
            });
            setEntries((prev) => {
                const updated = [newEntry, ...prev];
                localStorage.setItem('stockpulse_portfolio', JSON.stringify(updated));
                return updated;
            });
            setFormSymbol('');
            setFormQuantity('');
            setFormPrice('');
            setFormError('');
            setShowForm(false);
        } catch (err: any) {
            setFormError(err.message || 'Failed to add stock');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await portfolioApi.remove(id);
            setEntries((prev) => {
                const updated = prev.filter((e) => e.id !== id);
                localStorage.setItem('stockpulse_portfolio', JSON.stringify(updated));
                return updated;
            });
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const getPortfolioStats = () => {
        let totalInvested = 0;
        let totalCurrent = 0;

        entries.forEach((entry) => {
            const qty = Number(entry.quantity);
            const purchasePrice = Number(entry.purchase_price);
            totalInvested += qty * purchasePrice;
            const stock = mockStockData[entry.symbol];
            const currentPrice = stock?.currentPrice || purchasePrice;
            totalCurrent += qty * currentPrice;
        });

        const totalGain = totalCurrent - totalInvested;
        const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
        return { totalInvested, totalCurrent, totalGain, totalGainPercent };
    };

    const getAllocationData = () => {
        const data = entries.map((entry) => {
            const qty = Number(entry.quantity);
            const stock = mockStockData[entry.symbol];
            const currentPrice = stock?.currentPrice || Number(entry.purchase_price);
            return { name: entry.symbol, value: qty * currentPrice };
        });
        return data.sort((a, b) => b.value - a.value);
    };

    const stats = getPortfolioStats();
    const allocationData = getAllocationData();
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Portfolio</h2>
                        <p className="text-slate-400">Track your investments and performance</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Stock
                    </button>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5"
                    >
                        <p className="text-sm text-slate-400 mb-1">Total Invested</p>
                        <p className="text-2xl font-bold text-white">${stats.totalInvested.toFixed(2)}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5"
                    >
                        <p className="text-sm text-slate-400 mb-1">Current Value</p>
                        <p className="text-2xl font-bold text-white">${stats.totalCurrent.toFixed(2)}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5"
                    >
                        <p className="text-sm text-slate-400 mb-1">Total Gain/Loss</p>
                        <div className="flex items-center gap-2">
                            <p className={`text-2xl font-bold ${stats.totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {stats.totalGain >= 0 ? '+' : ''}${stats.totalGain.toFixed(2)}
                            </p>
                            <span className={`text-sm font-semibold ${stats.totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                ({stats.totalGain >= 0 ? '+' : ''}{stats.totalGainPercent.toFixed(2)}%)
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Add Stock Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <form onSubmit={handleAdd} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Add Stock to Portfolio</h3>
                                {formError && (
                                    <p className="text-sm text-red-400 mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{formError}</p>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Symbol</label>
                                        <input
                                            type="text"
                                            value={formSymbol}
                                            onChange={(e) => setFormSymbol(e.target.value)}
                                            placeholder="e.g. AAPL"
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            value={formQuantity}
                                            onChange={(e) => setFormQuantity(e.target.value)}
                                            placeholder="e.g. 10"
                                            min="0"
                                            step="any"
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Purchase Price ($)</label>
                                        <input
                                            type="number"
                                            value={formPrice}
                                            onChange={(e) => setFormPrice(e.target.value)}
                                            placeholder="e.g. 150.00"
                                            min="0"
                                            step="any"
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Add to Portfolio
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowForm(false); setFormError(''); }}
                                        className="px-6 py-2.5 bg-slate-700/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Holdings / Empty State */}
                {entries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center"
                    >
                        <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No Holdings Yet</h3>
                        <p className="text-slate-400 text-sm">Add stocks to your portfolio to start tracking your investments.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Donut Chart */}
                        <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Allocation</h3>
                            <div className="h-64 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={allocationData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {allocationData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Value']}
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#f8fafc'
                                            }}
                                            itemStyle={{ color: '#e2e8f0' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xs text-slate-400">Total Value</span>
                                    <span className="text-lg font-bold text-white">${stats.totalCurrent.toFixed(0)}</span>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                {allocationData.map((item, index) => (
                                    <div key={item.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-slate-300 font-medium">{item.name}</span>
                                        </div>
                                        <span className="text-slate-400">
                                            {((item.value / stats.totalCurrent) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Holdings Table */}
                        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden self-start">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700/50">
                                        <th className="text-left text-xs text-slate-400 font-medium px-6 py-4">Stock</th>
                                        <th className="text-right text-xs text-slate-400 font-medium px-6 py-4 hidden sm:table-cell">Qty</th>
                                        <th className="text-right text-xs text-slate-400 font-medium px-6 py-4">Avg Cost</th>
                                        <th className="text-right text-xs text-slate-400 font-medium px-6 py-4">Current</th>
                                        <th className="text-right text-xs text-slate-400 font-medium px-6 py-4 hidden md:table-cell">P/L</th>
                                        <th className="text-right text-xs text-slate-400 font-medium px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((entry) => {
                                        const purchasePrice = Number(entry.purchase_price);
                                        const qty = Number(entry.quantity);
                                        const stock = mockStockData[entry.symbol];
                                        const currentPrice = stock?.currentPrice || purchasePrice;
                                        const pl = (currentPrice - purchasePrice) * qty;
                                        const plPercent = ((currentPrice - purchasePrice) / purchasePrice) * 100;

                                        return (
                                            <motion.tr
                                                key={entry.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-white">{entry.symbol}</p>
                                                    <p className="text-xs text-slate-500">{entry.company_name}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right text-white hidden sm:table-cell">{qty}</td>
                                                <td className="px-6 py-4 text-right text-white">${purchasePrice.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right text-white">${currentPrice.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right hidden md:table-cell">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {pl >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                                                        <span className={`font-semibold ${pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                            {pl >= 0 ? '+' : ''}${pl.toFixed(2)} ({plPercent >= 0 ? '+' : ''}{plPercent.toFixed(1)}%)
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(entry.id)}
                                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
