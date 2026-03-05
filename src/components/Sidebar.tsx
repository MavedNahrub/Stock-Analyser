import { LayoutDashboard, TrendingUp, LineChart, Settings, Bell } from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: TrendingUp, label: 'Markets', active: false },
    { icon: LineChart, label: 'Portfolio', active: false },
    { icon: Bell, label: 'Alerts', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">StockPulse</h1>
            <p className="text-xs text-slate-400">Pro Analytics</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg p-4">
          <p className="text-sm font-semibold text-white mb-1">Upgrade to Pro+</p>
          <p className="text-xs text-slate-400 mb-3">Get real-time data & alerts</p>
          <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-medium py-2 rounded-lg hover:opacity-90 transition-opacity">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};
