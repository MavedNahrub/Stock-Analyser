import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { StockData } from '../data/mockData';

interface StockHeaderProps {
  stock: StockData;
}

export const StockHeader = ({ stock }: StockHeaderProps) => {
  const isPositive = stock.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white">{stock.symbol}</h2>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-400 font-medium">
              Active
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

        <div className="text-right">
          <p className="text-sm text-slate-400 mb-2">Last Updated</p>
          <p className="text-white font-medium">{new Date().toLocaleTimeString()}</p>
          <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </motion.div>
  );
};
