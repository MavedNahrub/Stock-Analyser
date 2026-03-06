import { useState, useCallback } from 'react';
import { StockData, mockStockData } from '../data/mockData';
import { stocksApi } from '../services/api';

export const useStockData = () => {
  const [currentStock, setCurrentStock] = useState<StockData>(mockStockData.AAPL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchStock = useCallback(async (symbol: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Try backend API first
      const response = await stocksApi.getStock(symbol);
      if (response.data) {
        setCurrentStock(response.data as StockData);
        setIsLoading(false);
        setHasSearched(true);
        return;
      }
    } catch (err: any) {
      // If the error has a message from the backend, show it directly
      const backendMsg: string = err?.message || '';

      // Network error = backend not running → try mock data
      const isNetworkError = backendMsg.includes('Failed to fetch') || backendMsg.includes('NetworkError') || backendMsg.includes('ECONNREFUSED');

      if (!isNetworkError) {
        // Backend returned a real error (e.g. symbol not found, rate limited)
        setError(`Could not load "${symbol.toUpperCase()}": ${backendMsg}`);
        setIsLoading(false);
        return;
      }

      // Backend not available — fall back to mock data silently
      console.log('Backend unavailable, using mock data');
    }

    // Fallback to mock data (only reached if backend is unreachable)
    setTimeout(() => {
      const stockData = mockStockData[symbol.toUpperCase()];
      if (stockData) {
        setCurrentStock(stockData);
        setError(null);
        setHasSearched(true);
      } else {
        setError(`Stock "${symbol.toUpperCase()}" not found. With the backend offline, only AAPL, TSLA, MSFT, GOOGL, and AMZN are available as demo data.`);
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
    hasSearched,
    searchStock,
    clearError,
  };
};
