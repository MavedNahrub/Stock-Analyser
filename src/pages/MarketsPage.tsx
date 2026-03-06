import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockStockData } from '../data/mockData';

export const MarketsPage = () => {
    const navigate = useNavigate();
    const stocks = Object.values(mockStockData);

    const gainers = [...stocks].filter((s) => s.change > 0).sort((a, b) => b.changePercent - a.changePercent);
    const losers = [...stocks].filter((s) => s.change < 0).sort((a, b) => a.changePercent - b.changePercent);

    const handleStockClick = (symbol: string) => {
        navigate(`/?symbol=${symbol}`);
    };

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-3xl font-bold text-white mb-2">Markets</h2>
                    <p className="text-slate-400 mb-8">Explore trending stocks and market movers</p>
                </motion.div>

                {/* Top Gainers */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-lg font-bold text-white">Top Gainers</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gainers.map((stock, index) => (
                            <motion.button
                                key={stock.symbol}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleStockClick(stock.symbol)}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-emerald-500/30 transition-all text-left group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="text-lg font-bold text-white">{stock.symbol}</h4>
                                        <p className="text-sm text-slate-400">{stock.companyName}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <p className="text-2xl font-bold text-white">${stock.currentPrice.toFixed(2)}</p>
                                    <div className="flex items-center gap-1 text-emerald-400">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="font-semibold">+{stock.changePercent.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Top Losers */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingDown className="w-5 h-5 text-red-400" />
                        <h3 className="text-lg font-bold text-white">Top Losers</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {losers.map((stock, index) => (
                            <motion.button
                                key={stock.symbol}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleStockClick(stock.symbol)}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-red-500/30 transition-all text-left group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="text-lg font-bold text-white">{stock.symbol}</h4>
                                        <p className="text-sm text-slate-400">{stock.companyName}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <p className="text-2xl font-bold text-white">${stock.currentPrice.toFixed(2)}</p>
                                    <div className="flex items-center gap-1 text-red-400">
                                        <TrendingDown className="w-4 h-4" />
                                        <span className="font-semibold">{stock.changePercent.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* All Stocks */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">All Stocks</h3>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    <th className="text-left text-xs text-slate-400 font-medium px-6 py-4">Symbol</th>
                                    <th className="text-left text-xs text-slate-400 font-medium px-6 py-4 hidden sm:table-cell">Company</th>
                                    <th className="text-right text-xs text-slate-400 font-medium px-6 py-4">Price</th>
                                    <th className="text-right text-xs text-slate-400 font-medium px-6 py-4">Change</th>
                                    <th className="text-right text-xs text-slate-400 font-medium px-6 py-4 hidden md:table-cell">Market Cap</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.map((stock, index) => (
                                    <motion.tr
                                        key={stock.symbol}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleStockClick(stock.symbol)}
                                        className="border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-white">{stock.symbol}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell">{stock.companyName}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-white">${stock.currentPrice.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-semibold ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-slate-400 hidden md:table-cell">
                                            {stock.fundamentals.marketCap}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
