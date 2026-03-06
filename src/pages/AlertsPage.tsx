import { PlusCircle, Trash2, Bell, BellOff, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { alertsApi, type AlertEntry } from '../services/api';
import { mockStockData } from '../data/mockData';

export const AlertsPage = () => {
    const [alerts, setAlerts] = useState<AlertEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formSymbol, setFormSymbol] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formDirection, setFormDirection] = useState<'above' | 'below'>('above');
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchAlerts = useCallback(async () => {
        try {
            const data = await alertsApi.getAll();
            setAlerts(data);
            localStorage.setItem('stockpulse_alerts', JSON.stringify(data));
        } catch {
            console.log('Backend unavailable, trying offline cache');
            const cached = localStorage.getItem('stockpulse_alerts');
            if (cached) {
                setAlerts(JSON.parse(cached));
            } else {
                setAlerts([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    const checkTriggered = (alert: AlertEntry): boolean => {
        const stock = mockStockData[alert.symbol];
        if (!stock) return false;
        const target = Number(alert.target_price);
        if (alert.direction === 'above') return stock.currentPrice >= target;
        return stock.currentPrice <= target;
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const symbol = formSymbol.trim().toUpperCase();
        const price = parseFloat(formPrice);

        if (!symbol) { setFormError('Enter a stock symbol'); return; }
        if (isNaN(price) || price <= 0) { setFormError('Enter a valid target price'); return; }

        setSubmitting(true);
        try {
            const newAlert = await alertsApi.create({
                symbol,
                target_price: price,
                direction: formDirection,
            });
            setAlerts((prev) => {
                const updated = [newAlert, ...prev];
                localStorage.setItem('stockpulse_alerts', JSON.stringify(updated));
                return updated;
            });
            setFormSymbol('');
            setFormPrice('');
            setFormError('');
            setShowForm(false);
        } catch (err: any) {
            setFormError(err.message || 'Failed to create alert');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await alertsApi.remove(id);
            setAlerts((prev) => {
                const updated = prev.filter((a) => a.id !== id);
                localStorage.setItem('stockpulse_alerts', JSON.stringify(updated));
                return updated;
            });
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const triggeredCount = alerts.filter((a) => a.is_triggered || checkTriggered(a)).length;

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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Price Alerts</h2>
                        <p className="text-slate-400">
                            {alerts.length === 0 ? 'Set price alerts for your favorite stocks' : `${triggeredCount} of ${alerts.length} alerts triggered`}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <PlusCircle className="w-5 h-5" />
                        New Alert
                    </button>
                </motion.div>

                {/* Add Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <form onSubmit={handleAdd} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Create Price Alert</h3>
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
                                        <label className="block text-sm text-slate-400 mb-1">Target Price ($)</label>
                                        <input
                                            type="number"
                                            value={formPrice}
                                            onChange={(e) => setFormPrice(e.target.value)}
                                            placeholder="e.g. 200.00"
                                            min="0"
                                            step="any"
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Trigger When</label>
                                        <div className="flex gap-2">
                                            <button type="button"
                                                onClick={() => setFormDirection('above')}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${formDirection === 'above'
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                    : 'bg-slate-700/50 border-slate-600/50 text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                <ArrowUp className="w-4 h-4" /> Above
                                            </button>
                                            <button type="button"
                                                onClick={() => setFormDirection('below')}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${formDirection === 'below'
                                                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                                    : 'bg-slate-700/50 border-slate-600/50 text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                <ArrowDown className="w-4 h-4" /> Below
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Create Alert
                                    </button>
                                    <button type="button" onClick={() => { setShowForm(false); setFormError(''); }} className="px-6 py-2.5 bg-slate-700/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Alerts List */}
                {alerts.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center"
                    >
                        <BellOff className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No Alerts Set</h3>
                        <p className="text-slate-400 text-sm">Create price alerts to get notified when stocks hit your targets.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {alerts.map((alert, index) => {
                            const stock = mockStockData[alert.symbol];
                            const currentPrice = stock?.currentPrice;
                            const triggered = alert.is_triggered || checkTriggered(alert);

                            return (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-5 ${triggered ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700/50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Bell className={`w-5 h-5 ${triggered ? 'text-emerald-400' : 'text-slate-500'}`} />
                                            <h4 className="font-bold text-white">{alert.symbol}</h4>
                                            {triggered && (
                                                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 rounded-md">
                                                    TRIGGERED
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={() => handleDelete(alert.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-400">Target</span>
                                            <div className="flex items-center gap-1">
                                                {alert.direction === 'above' ? (
                                                    <ArrowUp className="w-3 h-3 text-emerald-400" />
                                                ) : (
                                                    <ArrowDown className="w-3 h-3 text-red-400" />
                                                )}
                                                <span className="font-semibold text-white">${Number(alert.target_price).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        {currentPrice !== undefined && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-400">Current</span>
                                                <span className="font-semibold text-white">${currentPrice.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
