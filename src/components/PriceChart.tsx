import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { StockData } from '../data/mockData';

interface PriceChartProps {
  chartData: StockData['chartData'];
  symbol: string;
}

export const PriceChart = ({ chartData }: PriceChartProps) => {
  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const isPositive = lastPrice >= firstPrice;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Price Action</h3>
          <p className="text-sm text-slate-400">6 Month Performance</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${isPositive ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
          }`}>
          <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-emerald-400' : 'text-red-400 rotate-180'}`} />
          <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{((lastPrice - firstPrice) / firstPrice * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#94a3b8', fontSize: '12px' }}
              itemStyle={{ color: '#3b82f6', fontSize: '14px', fontWeight: 'bold' }}
              formatter={(value?: number | string) => [`$${Number(value ?? 0).toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorPrice)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between text-sm">
        <div>
          <p className="text-slate-500 mb-1">Period Start</p>
          <p className="text-white font-semibold">${firstPrice.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 mb-1">Current Price</p>
          <p className="text-white font-semibold">${lastPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
