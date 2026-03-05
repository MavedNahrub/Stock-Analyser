import { Key, Info, Trash2, CheckCircle2, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const API_KEY_STORAGE = 'stockpulse_api_key';

interface SettingsPageProps {
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
}

export const SettingsPage = ({ theme, onToggleTheme }: SettingsPageProps) => {
    const [apiKey, setApiKey] = useState('');
    const [savedKey, setSavedKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(API_KEY_STORAGE) || '';
        setSavedKey(stored);
        setApiKey(stored);
    }, []);

    const handleSaveKey = () => {
        localStorage.setItem(API_KEY_STORAGE, apiKey.trim());
        setSavedKey(apiKey.trim());
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

    const handleClearData = () => {
        if (confirm('Clear all cached stock data, portfolio, and alerts? This cannot be undone.')) {
            localStorage.removeItem('stockpulse_portfolio');
            localStorage.removeItem('stockpulse_alerts');
            localStorage.removeItem(API_KEY_STORAGE);
            setApiKey('');
            setSavedKey('');
        }
    };

    const maskKey = (key: string) => {
        if (key.length <= 4) return '•'.repeat(key.length);
        return '•'.repeat(key.length - 4) + key.slice(-4);
    };

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
                    <p className="text-slate-400 mb-8">Configure your StockPulse experience</p>
                </motion.div>

                <div className="space-y-6">
                    {/* Theme Toggle */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                    {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Appearance</h3>
                                    <p className="text-sm text-slate-400">
                                        {theme === 'dark' ? 'Dark mode is active' : 'Light mode is active'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onToggleTheme}
                                className={`relative w-14 h-7 rounded-full transition-colors ${theme === 'light' ? 'bg-blue-500' : 'bg-slate-600'
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${theme === 'light' ? 'translate-x-7' : 'translate-x-0.5'
                                        }`}
                                />
                            </button>
                        </div>
                    </motion.div>

                    {/* API Key Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Key className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Alpha Vantage API Key</h3>
                                <p className="text-sm text-slate-400">Required for live stock data</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <input
                                    type={showKey ? 'text' : 'password'}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter your API key"
                                    className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                                />
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
                                >
                                    {showKey ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSaveKey}
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                                >
                                    {saveSuccess ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : 'Save Key'}
                                </button>
                                {savedKey && (
                                    <p className="text-xs text-slate-500">
                                        Current: <span className="font-mono">{maskKey(savedKey)}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                            <p className="text-xs text-slate-400">
                                Get your free API key at{' '}
                                <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    alphavantage.co
                                </a>
                                . Free tier allows 25 requests per day.
                            </p>
                        </div>
                    </motion.div>

                    {/* Data Management */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Clear All Data</h3>
                                <p className="text-sm text-slate-400">Remove portfolio, alerts, and cached data</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClearData}
                            className="px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/20 transition-colors"
                        >
                            Clear All Data
                        </button>
                    </motion.div>

                    {/* About */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
                                <Info className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">About StockPulse</h3>
                                <p className="text-sm text-slate-400">Version 1.0.0</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-400">
                            <p>A professional stock analysis dashboard for evaluating investments through fundamental analysis.</p>
                            <p className="text-xs text-slate-500 pt-2">
                                Built with React, TypeScript, TailwindCSS, Recharts, Framer Motion, Express.js, and PostgreSQL.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
