import { X, Loader2, PlusCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { portfolioApi, alertsApi } from '../services/api';

interface QuickActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    symbol: string;
    currentPrice: number;
    companyName: string;
    type: 'portfolio' | 'alert';
}

export const QuickActionModal = ({ isOpen, onClose, symbol, currentPrice, companyName, type }: QuickActionModalProps) => {
    const [quantity, setQuantity] = useState('');
    const [targetPrice, setTargetPrice] = useState(currentPrice.toString());
    const [direction, setDirection] = useState<'above' | 'below'>('above');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            if (type === 'portfolio') {
                const qty = parseFloat(quantity);
                if (isNaN(qty) || qty <= 0) throw new Error('Enter a valid quantity');
                await portfolioApi.add({
                    symbol,
                    company_name: companyName,
                    quantity: qty,
                    purchase_price: currentPrice
                });
            } else {
                const target = parseFloat(targetPrice);
                if (isNaN(target) || target <= 0) throw new Error('Enter a valid target price');
                await alertsApi.create({
                    symbol,
                    target_price: target,
                    direction
                });
            }
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
                setQuantity('');
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Operation failed. Backend might be unavailable.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden relative"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {type === 'portfolio' ? <PlusCircle className="w-5 h-5 text-blue-400" /> : <Bell className="w-5 h-5 text-emerald-400" />}
                                {type === 'portfolio' ? 'Add to Portfolio' : 'Set Price Alert'}
                            </h3>
                            <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5">
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            {success ? (
                                <div className="py-8 text-center text-emerald-400 font-medium">
                                    Successfully added to your {type === 'portfolio' ? 'portfolio' : 'alerts'}!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg border border-slate-700/50">
                                        <div>
                                            <span className="text-white font-bold">{symbol}</span>
                                            <span className="text-slate-400 text-sm ml-2">{companyName}</span>
                                        </div>
                                        <span className="text-white font-semibold">${currentPrice.toFixed(2)}</span>
                                    </div>

                                    {type === 'portfolio' ? (
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Quantity</label>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                placeholder="e.g. 10"
                                                min="0"
                                                step="any"
                                                required
                                                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Target Price ($)</label>
                                                <input
                                                    type="number"
                                                    value={targetPrice}
                                                    onChange={(e) => setTargetPrice(e.target.value)}
                                                    placeholder="e.g. 150.00"
                                                    min="0"
                                                    step="any"
                                                    required
                                                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Alert Direction</label>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDirection('above')}
                                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${direction === 'above' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'}`}
                                                    >
                                                        Above
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDirection('below')}
                                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${direction === 'below' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'}`}
                                                    >
                                                        Below
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Confirm
                                    </button>
                                </div>
                            )}
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
