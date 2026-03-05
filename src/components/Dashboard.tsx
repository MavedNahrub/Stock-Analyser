import { DollarSign, TrendingUp, Building2, Percent, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStockData } from '../hooks/useStockData';
import { SearchBar } from './SearchBar';
import { StockHeader } from './StockHeader';
import { MetricCard } from './MetricCard';
import { HealthChecklist } from './HealthChecklist';
import { IntrinsicValueSlider } from './IntrinsicValueSlider';
import { RiskGauge } from './RiskGauge';
import { PriceChart } from './PriceChart';
import {
  SkeletonCard,
  SkeletonHealth,
  SkeletonChart,
  SkeletonSlider,
  SkeletonGauge,
} from './SkeletonLoader';

export const Dashboard = () => {
  const { currentStock, isLoading, error, searchStock, clearError } = useStockData();

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <SearchBar onSearch={searchStock} />
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300 flex-1">{error}</p>
              <button
                onClick={clearError}
                className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonCard />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <SkeletonHealth />
              <SkeletonChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <SkeletonSlider />
              <SkeletonGauge />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <StockHeader stock={currentStock} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <MetricCard
                title="P/E Ratio"
                value={currentStock.fundamentals.peRatio.toFixed(2)}
                subtitle="Price to Earnings"
                icon={DollarSign}
                trend={currentStock.fundamentals.peRatio < 25 ? 'up' : 'neutral'}
                delay={0}
              />
              <MetricCard
                title="P/B Ratio"
                value={currentStock.fundamentals.pbRatio.toFixed(2)}
                subtitle="Price to Book"
                icon={TrendingUp}
                trend={currentStock.fundamentals.pbRatio < 3 ? 'up' : 'neutral'}
                delay={0.1}
              />
              <MetricCard
                title="Market Cap"
                value={currentStock.fundamentals.marketCap}
                subtitle="Total Valuation"
                icon={Building2}
                trend="neutral"
                delay={0.2}
              />
              <MetricCard
                title="Dividend Yield"
                value={`${currentStock.fundamentals.dividendYield.toFixed(2)}%`}
                subtitle="Annual Dividend"
                icon={Percent}
                trend={currentStock.fundamentals.dividendYield > 0 ? 'up' : 'neutral'}
                delay={0.3}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-1">
                <HealthChecklist healthMetrics={currentStock.healthMetrics} />
              </div>
              <div className="lg:col-span-2">
                <PriceChart chartData={currentStock.chartData} symbol={currentStock.symbol} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <IntrinsicValueSlider intrinsicValue={currentStock.intrinsicValue} />
              <RiskGauge risk={currentStock.risk} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
