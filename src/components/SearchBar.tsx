import { Search, Command, Loader2, TrendingUp, TrendingDown, Building2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchApi, type SearchSuggestion } from '../services/api';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Debounced search for suggestions
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchApi.suggestions(query);
        setSuggestions(results || []);
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setSuggestions([]);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (symbol: string) => {
    onSearch(symbol);
    setQuery('');
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div className="relative z-50 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow Effect behind search bar on focus */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`}></div>

        <div
          className={`relative flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl border rounded-2xl px-5 py-3.5 transition-all duration-300 ${isFocused
              ? 'border-blue-500/50 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]'
              : 'border-slate-700/50'
            }`}
        >
          <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-blue-400' : 'text-slate-400'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search markets (e.g., Apple, Tesla, Reliance)..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-base outline-none w-full"
          />
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 border border-slate-700/50 px-2.5 py-1.5 rounded-lg shadow-inner">
            <Command className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider">K</span>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {isFocused && query.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-3 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="max-h-[28rem] overflow-y-auto overscroll-contain custom-scrollbar">
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 z-10 px-4 py-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isLoading ? 'Searching Markets...' : 'Search Results'}
                </p>
                {isLoading && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
              </div>

              <div className="p-2 space-y-1">
                {!isLoading && suggestions.length === 0 && query.length >= 2 && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                      <Search className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="text-sm text-slate-300 font-medium">No assets found</p>
                    <p className="text-xs text-slate-500 mt-1">We couldn't find anything matching "{query}"</p>
                  </div>
                )}

                {suggestions.map((suggestion, index) => (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={`${suggestion.symbol}-${suggestion.exchange}`}
                    onClick={() => handleSuggestionClick(suggestion.symbol)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Building2 className="w-5 h-5 text-blue-400/80 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[15px] font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                          {suggestion.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-blue-400 tracking-wide">
                            {suggestion.symbol}
                          </span>
                          {suggestion.exchange && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {suggestion.exchange}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {suggestion.type && (
                        <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-400 tracking-wide uppercase shrink-0">
                          {suggestion.type}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
