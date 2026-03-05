import { Search, Command } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'];

  // Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  const handleSuggestionClick = (symbol: string) => {
    onSearch(symbol);
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border rounded-xl px-4 py-3 transition-all ${isFocused ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-700/50'
            }`}
        >
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search stocks... (Try AAPL, TSLA, MSFT, GOOGL, AMZN)"
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
          />
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-md">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </form>

      {isFocused && query.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 w-full bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl overflow-hidden z-50"
        >
          <div className="p-2">
            <p className="text-xs text-slate-500 px-3 py-2">Quick Results</p>
            {suggestions
              .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
              .map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleSuggestionClick(symbol)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-400">{symbol}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{symbol}</p>
                    <p className="text-xs text-slate-500">Stock Symbol</p>
                  </div>
                </button>
              ))}
            {suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase())).length === 0 && (
              <p className="px-3 py-2 text-sm text-slate-400">
                Press Enter to search for <span className="text-white font-medium">"{query}"</span>
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
