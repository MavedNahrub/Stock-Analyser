import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MarketsPage } from './pages/MarketsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-900'} flex`}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center gap-3 p-4 bg-slate-800/50 border-b border-slate-700/50">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-white">StockPulse</h1>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<SettingsPage theme={theme} onToggleTheme={toggleTheme} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
