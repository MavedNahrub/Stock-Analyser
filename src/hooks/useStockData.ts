import { useState, useCallback } from 'react';
import { StockData, mockStockData } from '../data/mockData';
import { stocksApi } from '../services/api';

export const useStockData = () => {
  const [currentStock, setCurrentStock] = useState<StockData>(mockStockData.AAPL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchStock = useCallback(async (symbol: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Try backend API first
      const response = await stocksApi.getStock(symbol);
      if (response.data) {
        setCurrentStock(response.data as StockData);
        setIsLoading(false);
        return;
      }
    } catch {
      // Backend not available or API not configured — fall back to mock data
      console.log('Backend unavailable, using mock data');
    }

    // Fallback to mock data
    setTimeout(() => {
      const stockData = mockStockData[symbol.toUpperCase()];
      if (stockData) {
        setCurrentStock(stockData);
        setError(null);
      } else {
        setError(`Stock symbol "${symbol.toUpperCase()}" not found. Try AAPL, TSLA, MSFT, GOOGL, or AMZN.`);
      }
      setIsLoading(false);
    }, 300);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentStock,
    isLoading,
    error,
    searchStock,
    clearError,
  };
};
