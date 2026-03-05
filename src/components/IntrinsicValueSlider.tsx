import { motion } from 'framer-motion';
import { StockData } from '../data/mockData';

interface IntrinsicValueSliderProps {
  intrinsicValue: StockData['intrinsicValue'];
}

export const IntrinsicValueSlider = ({ intrinsicValue }: IntrinsicValueSliderProps) => {
  const percentage = Math.max(-50, Math.min(50, intrinsicValue.percentage));
  const position = ((percentage + 50) / 100) * 100;
  const isUnderpriced = percentage < 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-1">Valuation Analysis</h3>
        <p className="text-sm text-slate-400">Current vs Intrinsic Value</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 mb-1">Current Price</p>
            <p className="text-2xl font-bold text-white">${intrinsicValue.current.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Intrinsic Value</p>
            <p className="text-2xl font-bold text-blue-400">${intrinsicValue.intrinsic.toFixed(2)}</p>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-between mb-2 text-xs font-medium">
            <span className="text-emerald-400">Underpriced</span>
            <span className="text-slate-500">Fair</span>
            <span className="text-red-400">Overpriced</span>
          </div>

          <div className="relative h-3 bg-gradient-to-r from-emerald-500/20 via-slate-700/50 to-red-500/20 rounded-full overflow-hidden border border-slate-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-red-500/10" />

            <motion.div
              initial={{ left: '50%' }}
              animate={{ left: `${position}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-6 h-6 rounded-full ${
                    isUnderpriced ? 'bg-emerald-400' : 'bg-red-400'
                  } shadow-lg`}
                  style={{
                    boxShadow: `0 0 20px ${isUnderpriced ? 'rgba(52, 211, 153, 0.6)' : 'rgba(248, 113, 113, 0.6)'}`,
                  }}
                />
              </div>
            </motion.div>

            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-600" />
          </div>

          <div className="flex justify-center mt-4">
            <div
              className={`px-4 py-2 rounded-xl border ${
                isUnderpriced
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <p className="text-sm font-semibold text-center">
                <span className={isUnderpriced ? 'text-emerald-400' : 'text-red-400'}>
                  {isUnderpriced ? 'Underpriced by' : 'Overpriced by'} {Math.abs(percentage).toFixed(1)}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
