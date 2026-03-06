import { LayoutDashboard, TrendingUp, LineChart, Settings, Bell, X, LogOut, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: TrendingUp, label: 'Markets', path: '/markets' },
    { icon: LineChart, label: 'Portfolio', path: '/portfolio' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div>
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">StockPulse</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Pro Analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 border border-transparent'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {user && (
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-200 truncate">{user.email}</p>
              <p className="text-xs text-slate-500 truncate">Authenticated User</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
};
