import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { StockData } from '../data/mockData';

interface HealthChecklistProps {
  healthMetrics: StockData['healthMetrics'];
}

export const HealthChecklist = ({ healthMetrics }: HealthChecklistProps) => {
  const metrics = Object.values(healthMetrics);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Health Scorecard</h3>
          <p className="text-sm text-slate-400">5 Key Financial Metrics</p>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <span className="text-sm font-bold text-emerald-400">
            {metrics.filter((m) => m.isHealthy).length}/5
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              metric.isHealthy
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-red-500/5 border-red-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  metric.isHealthy ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}
              >
                {metric.isHealthy ? (
                  <Check className="w-5 h-5 text-emerald-400" strokeWidth={3} />
                ) : (
                  <X className="w-5 h-5 text-red-400" strokeWidth={3} />
                )}
              </motion.div>
              <div>
                <p className="text-sm font-medium text-white">{metric.label}</p>
                <p className="text-xs text-slate-500">
                  {metric.value}
                  {metric.label.includes('Growth') || metric.label.includes('Margin')
                    ? '%'
                    : metric.label.includes('Ratio')
                    ? 'x'
                    : '%'}
                </p>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-md text-xs font-semibold ${
                metric.isHealthy ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {metric.isHealthy ? 'Healthy' : 'Warning'}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Overall Health</span>
          <span className="font-bold text-emerald-400">
            {metrics.filter((m) => m.isHealthy).length >= 4 ? 'Strong' : 'Moderate'}
          </span>
        </div>
      </div>
    </div>
  );
};
