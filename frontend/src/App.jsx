import React, { useState } from 'react';
import { BarChart3, Users, BookOpen, CheckSquare, Search, LogOut, Shield, UserPlus } from 'lucide-react';
import Login from './pages/Login';
import Dashboards from './pages/Dashboards';
import UsersView from './pages/Users';
import ClassesView from './pages/Classes';
import AttendanceView from './pages/Attendance';
import ReportsView from './pages/Reports';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setToken(null); setUser(null);
  };

  if (!token || !user) return <Login setToken={setToken} setUser={setUser} />;

  const NavItem = ({ icon, label, id }) => (
    <button onClick={() => setCurrentView(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium border ${currentView === id ? 'bg-teal-500/10 border-teal-500/30 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.1)]' : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-gray-200'}`}>
      {icon} {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-teal-500/30">
      <aside className="w-64 bg-[#111827] border-r border-white/5 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-teal-400 flex items-center gap-2"><Shield size={24} /> InnoViast</h1>
          <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-semibold bg-white/5 inline-block px-2 py-1 rounded">{user.role} Portal</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <NavItem icon={<BarChart3 />} label="Dashboard" id="dashboard" />
          {user.role === 'Admin' && <NavItem icon={<UserPlus />} label="Manage Users" id="users" />}
          {(user.role === 'Admin' || user.role === 'Instructor') && (
            <>
              <NavItem icon={<BookOpen />} label="Manage Classes" id="classes" />
              <NavItem icon={<CheckSquare />} label="Mark Attendance" id="attendance" />
              <NavItem icon={<Search />} label="Reports & Export" id="reports" />
            </>
          )}
        </nav>
        <div className="p-4 border-t border-white/5 bg-[#0B0F19]/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold">{user.name.charAt(0)}</div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate text-gray-200">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 border border-transparent hover:border-orange-500/30 rounded-xl transition-all text-sm font-medium"><LogOut size={16} /> Disconnect</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {currentView === 'dashboard' && <Dashboards token={token} user={user} />}
          {currentView === 'users' && <UsersView token={token} />}
          {currentView === 'classes' && <ClassesView token={token} user={user} />}
          {currentView === 'attendance' && <AttendanceView token={token} />}
          {currentView === 'reports' && <ReportsView token={token} />}
        </div>
      </main>
    </div>
  );
}