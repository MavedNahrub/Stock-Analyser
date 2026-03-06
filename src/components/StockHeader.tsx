import { TrendingUp, TrendingDown, PlusCircle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { StockData } from '../data/mockData';
import { QuickActionModal } from './QuickActionModal';

interface StockHeaderProps {
  stock: StockData;
}

export const StockHeader = ({ stock }: StockHeaderProps) => {
  const [modalType, setModalType] = useState<'portfolio' | 'alert' | null>(null);
  const isPositive = stock.change >= 0;

  // Simple market hours check (NYSE: M-F, 9:30 AM - 4:00 PM EST -> 14:30 - 21:00 UTC)
  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getUTCDay();
    const hours = now.getUTCHours();
    const mins = now.getUTCMinutes();
    const time = hours + mins / 60;

    // Weekend
    if (day === 0 || day === 6) return false;
    // Outside 14:30 - 21:00 UTC
    if (time < 14.5 || time >= 21) return false;

    return true;
  };

  const marketOpen = isMarketOpen();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-white">{stock.symbol}</h2>
              <span className={`px-3 py-1 border rounded-lg text-sm font-medium ${marketOpen
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                }`}>
                {marketOpen ? 'Market Open' : 'Market Closed'}
              </span>
            </div>
            <p className="text-slate-400 mb-4">{stock.companyName}</p>

            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold text-white">${stock.currentPrice.toFixed(2)}</p>
              <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-lg font-semibold">
                  {isPositive ? '+' : ''}
                  {stock.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalType('portfolio')}
                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-blue-400 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="w-4 h-4" /> Add to Portfolio
              </button>
              <button
                onClick={() => setModalType('alert')}
                className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Bell className="w-4 h-4" /> Set Alert
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">Last Updated</p>
              <p className="text-white font-medium">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <QuickActionModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType || 'portfolio'}
        symbol={stock.symbol}
        currentPrice={stock.currentPrice}
        companyName={stock.companyName}
      />
    </>
  );
};
