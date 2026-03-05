import { useState, useCallback } from 'react';
import { StockData, mockStockData } from '../data/mockData';

export const useStockData = () => {
  const [currentStock, setCurrentStock] = useState<StockData>(mockStockData.AAPL);
  const [isLoading, setIsLoading] = useState(false);

  const searchStock = useCallback((symbol: string) => {
    setIsLoading(true);

    setTimeout(() => {
      const stockData = mockStockData[symbol.toUpperCase()];
      if (stockData) {
        setCurrentStock(stockData);
      }
      setIsLoading(false);
    }, 800);
  }, []);

  return {
    currentStock,
    isLoading,
    searchStock,
  };
};
