import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, ReactNode } from 'react';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MarketsPage } from './pages/MarketsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen flex ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-900'}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen h-full w-full overflow-y-auto">
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
        {children}
      </div>
    </div>
  );
}

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes inside MainLayout */}
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/markets" element={<MarketsPage />} />
                <Route path="/portfolio" element={
                  <PrivateRoute>
                    <PortfolioPage />
                  </PrivateRoute>
                } />
                <Route path="/alerts" element={
                  <PrivateRoute>
                    <AlertsPage />
                  </PrivateRoute>
                } />
                <Route path="/settings" element={<SettingsPage theme={theme} onToggleTheme={toggleTheme} />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
