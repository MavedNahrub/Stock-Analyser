import { Video as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend = 'neutral', delay = 0 }: MetricCardProps) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-slate-400';
  };

  const getTrendBg = () => {
    if (trend === 'up') return 'bg-emerald-500/10 border-emerald-500/20';
    if (trend === 'down') return 'bg-red-500/10 border-red-500/20';
    return 'bg-blue-500/10 border-blue-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTrendBg()} border`}>
          <Icon className={`w-6 h-6 ${getTrendColor()}`} />
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <p className={`text-2xl font-bold mb-1 ${getTrendColor()}`}>{value}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </motion.div>
  );
};
