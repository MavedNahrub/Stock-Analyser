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

function generateDailyData(basePrice: number, volatility: number, days: number): Array<{ date: string; price: number }> {
  const data: Array<{ date: string; price: number }> = [];
  let price = basePrice * (1 - volatility * 0.3);
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.45) * volatility * basePrice * 0.02;
    price = Math.max(price + change, basePrice * 0.7);
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
    });
  }

  // Ensure last point matches current price
  if (data.length > 0) {
    data[data.length - 1].price = basePrice;
  }

  return data;
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
    chartData: generateDailyData(178.45, 0.8, 30),
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
    chartData: generateDailyData(245.67, 1.5, 30),
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
    chartData: generateDailyData(415.23, 0.6, 30),
  },
  GOOGL: {
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    currentPrice: 141.80,
    change: 1.56,
    changePercent: 1.11,
    fundamentals: {
      peRatio: 24.5,
      pbRatio: 6.8,
      marketCap: '$1.76T',
      dividendYield: 0.0,
    },
    healthMetrics: {
      revenueGrowth: { value: 13.5, isHealthy: true, label: 'Revenue Growth' },
      profitMargin: { value: 25.7, isHealthy: true, label: 'Profit Margin' },
      debtToEquity: { value: 0.1, isHealthy: true, label: 'Debt/Equity' },
      roe: { value: 29.8, isHealthy: true, label: 'Return on Equity' },
      currentRatio: { value: 2.1, isHealthy: true, label: 'Current Ratio' },
    },
    intrinsicValue: {
      current: 141.80,
      intrinsic: 155.0,
      percentage: -8.5,
    },
    risk: {
      maxDrawdown: -20.3,
      riskLevel: 'Medium',
    },
    chartData: generateDailyData(141.80, 0.9, 30),
  },
  AMZN: {
    symbol: 'AMZN',
    companyName: 'Amazon.com, Inc.',
    currentPrice: 178.25,
    change: -0.87,
    changePercent: -0.49,
    fundamentals: {
      peRatio: 58.3,
      pbRatio: 8.4,
      marketCap: '$1.86T',
      dividendYield: 0.0,
    },
    healthMetrics: {
      revenueGrowth: { value: 12.6, isHealthy: true, label: 'Revenue Growth' },
      profitMargin: { value: 7.8, isHealthy: true, label: 'Profit Margin' },
      debtToEquity: { value: 0.6, isHealthy: true, label: 'Debt/Equity' },
      roe: { value: 22.4, isHealthy: true, label: 'Return on Equity' },
      currentRatio: { value: 1.05, isHealthy: true, label: 'Current Ratio' },
    },
    intrinsicValue: {
      current: 178.25,
      intrinsic: 165.0,
      percentage: 8.0,
    },
    risk: {
      maxDrawdown: -25.1,
      riskLevel: 'Medium',
    },
    chartData: generateDailyData(178.25, 1.1, 30),
  },
};
