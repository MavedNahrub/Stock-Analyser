import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { StockData } from '../data/mockData';

interface RiskGaugeProps {
  risk: StockData['risk'];
}

export const RiskGauge = ({ risk }: RiskGaugeProps) => {
  const drawdownPercentage = Math.abs(risk.maxDrawdown);
  const angle = Math.min(drawdownPercentage / 50 * 180, 180);

  const getRiskColor = () => {
    if (risk.riskLevel === 'Low') return { color: 'emerald', glow: 'rgba(52, 211, 153, 0.3)' };
    if (risk.riskLevel === 'Medium') return { color: 'yellow', glow: 'rgba(250, 204, 21, 0.3)' };
    return { color: 'red', glow: 'rgba(248, 113, 113, 0.3)' };
  };

  const riskColor = getRiskColor();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Risk Assessment</h3>
          <p className="text-sm text-slate-400">Maximum Drawdown Analysis</p>
        </div>
        <div
          className={`px-3 py-1 rounded-lg border ${risk.riskLevel === 'Low'
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : risk.riskLevel === 'Medium'
                ? 'bg-yellow-500/10 border-yellow-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}
        >
          <span
            className={`text-sm font-bold ${risk.riskLevel === 'Low'
                ? 'text-emerald-400'
                : risk.riskLevel === 'Medium'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
          >
            {risk.riskLevel}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="relative w-64 h-32">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="rgb(250, 204, 21)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(248, 113, 113)" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="12"
              strokeLinecap="round"
            />

            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="rgb(51, 65, 85)"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.3"
            />

            <motion.g
              initial={{ rotate: -90 }}
              animate={{ rotate: angle - 90 }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              style={{ originX: "100px", originY: "90px" }}
            >
              <line
                x1="100"
                y1="90"
                x2="100"
                y2="30"
                stroke={`rgb(${risk.riskLevel === 'Low' ? '52, 211, 153' : risk.riskLevel === 'Medium' ? '250, 204, 21' : '248, 113, 113'
                  })`}
                strokeWidth="3"
                strokeLinecap="round"
              />

              <motion.circle
                cx="100"
                cy="90"
                r="8"
                fill={`rgb(${risk.riskLevel === 'Low' ? '52, 211, 153' : risk.riskLevel === 'Medium' ? '250, 204, 21' : '248, 113, 113'
                  })`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ filter: `drop-shadow(0 0 8px ${riskColor.glow})` }}
              />
            </motion.g>
          </svg>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle
              className={`w-5 h-5 ${risk.riskLevel === 'Low'
                  ? 'text-emerald-400'
                  : risk.riskLevel === 'Medium'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
            />
            <p className="text-3xl font-bold text-white">{Math.abs(risk.maxDrawdown).toFixed(1)}%</p>
          </div>
          <p className="text-sm text-slate-400">Maximum Drawdown</p>
        </div>

        <div className="mt-6 w-full pt-4 border-t border-slate-700/50">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-xs text-slate-500 mb-1">Risk Level</p>
              <p
                className={`text-sm font-bold ${risk.riskLevel === 'Low'
                    ? 'text-emerald-400'
                    : risk.riskLevel === 'Medium'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
              >
                {risk.riskLevel}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <p className="text-sm font-bold text-white">
                {risk.riskLevel === 'Low' ? 'Stable' : risk.riskLevel === 'Medium' ? 'Moderate' : 'Volatile'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
