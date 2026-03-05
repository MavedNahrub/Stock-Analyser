export interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  fundamentals: {
    peRatio: number;
    pbRatio: number;
    marketCap: string;
    dividendYield: number;
  };
  healthMetrics: {
    revenueGrowth: { value: number; isHealthy: boolean; label: string };
    profitMargin: { value: number; isHealthy: boolean; label: string };
    debtToEquity: { value: number; isHealthy: boolean; label: string };
    roe: { value: number; isHealthy: boolean; label: string };
    currentRatio: { value: number; isHealthy: boolean; label: string };
  };
  intrinsicValue: {
    current: number;
    intrinsic: number;
    percentage: number;
  };
  risk: {
    maxDrawdown: number;
    riskLevel: 'Low' | 'Medium' | 'High';
  };
  chartData: Array<{ date: string; price: number }>;
}

export const mockStockData: Record<string, StockData> = {
  AAPL: {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    currentPrice: 178.45,
    change: 2.34,
    changePercent: 1.33,
    fundamentals: {
      peRatio: 29.8,
      pbRatio: 45.2,
      marketCap: '$2.78T',
      dividendYield: 0.52,
    },
    healthMetrics: {
      revenueGrowth: { value: 11.2, isHealthy: true, label: 'Revenue Growth' },
      profitMargin: { value: 25.3, isHealthy: true, label: 'Profit Margin' },
      debtToEquity: { value: 1.8, isHealthy: true, label: 'Debt/Equity' },
      roe: { value: 147.3, isHealthy: true, label: 'Return on Equity' },
      currentRatio: { value: 0.98, isHealthy: false, label: 'Current Ratio' },
    },
    intrinsicValue: {
      current: 178.45,
      intrinsic: 195.0,
      percentage: -8.5,
    },
    risk: {
      maxDrawdown: -15.2,
      riskLevel: 'Low',
    },
    chartData: [
      { date: '2024-09', price: 165.2 },
      { date: '2024-10', price: 168.5 },
      { date: '2024-11', price: 172.3 },
      { date: '2024-12', price: 175.8 },
      { date: '2025-01', price: 171.4 },
      { date: '2025-02', price: 174.9 },
      { date: '2025-03', price: 178.45 },
    ],
  },
  TSLA: {
    symbol: 'TSLA',
    companyName: 'Tesla, Inc.',
    currentPrice: 245.67,
    change: -3.21,
    changePercent: -1.29,
    fundamentals: {
      peRatio: 62.4,
      pbRatio: 12.8,
      marketCap: '$778.5B',
      dividendYield: 0.0,
    },
    healthMetrics: {
      revenueGrowth: { value: 18.8, isHealthy: true, label: 'Revenue Growth' },
      profitMargin: { value: 14.7, isHealthy: true, label: 'Profit Margin' },
      debtToEquity: { value: 0.5, isHealthy: true, label: 'Debt/Equity' },
      roe: { value: 28.5, isHealthy: true, label: 'Return on Equity' },
      currentRatio: { value: 1.73, isHealthy: true, label: 'Current Ratio' },
    },
    intrinsicValue: {
      current: 245.67,
      intrinsic: 210.0,
      percentage: 17.0,
    },
    risk: {
      maxDrawdown: -43.7,
      riskLevel: 'High',
    },
    chartData: [
      { date: '2024-09', price: 238.5 },
      { date: '2024-10', price: 252.3 },
      { date: '2024-11', price: 268.9 },
      { date: '2024-12', price: 245.2 },
      { date: '2025-01', price: 228.7 },
      { date: '2025-02', price: 241.3 },
      { date: '2025-03', price: 245.67 },
    ],
  },
  MSFT: {
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    currentPrice: 415.23,
    change: 5.67,
    changePercent: 1.38,
    fundamentals: {
      peRatio: 36.2,
      pbRatio: 13.5,
      marketCap: '$3.09T',
      dividendYield: 0.72,
    },
    healthMetrics: {
      revenueGrowth: { value: 15.7, isHealthy: true, label: 'Revenue Growth' },
      profitMargin: { value: 36.7, isHealthy: true, label: 'Profit Margin' },
      debtToEquity: { value: 0.4, isHealthy: true, label: 'Debt/Equity' },
      roe: { value: 42.8, isHealthy: true, label: 'Return on Equity' },
      currentRatio: { value: 1.25, isHealthy: true, label: 'Current Ratio' },
    },
    intrinsicValue: {
      current: 415.23,
      intrinsic: 440.0,
      percentage: -5.6,
    },
    risk: {
      maxDrawdown: -18.5,
      riskLevel: 'Low',
    },
    chartData: [
      { date: '2024-09', price: 385.4 },
      { date: '2024-10', price: 392.1 },
      { date: '2024-11', price: 398.7 },
      { date: '2024-12', price: 407.3 },
      { date: '2025-01', price: 402.8 },
      { date: '2025-02', price: 410.5 },
      { date: '2025-03', price: 415.23 },
    ],
  },
};
