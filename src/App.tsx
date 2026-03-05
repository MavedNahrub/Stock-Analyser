import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default App;
