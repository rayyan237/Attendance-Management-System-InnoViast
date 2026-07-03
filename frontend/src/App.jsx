import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, CheckSquare, BarChart3, LogOut, 
  Plus, Search, Download, AlertCircle, CheckCircle2, UserPlus, Shield
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null); setUser(null);
  };

  if (!token || !user) return <LoginScreen setToken={setToken} setUser={setUser} />;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-teal-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-white/5 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-teal-400 flex items-center gap-2">
            <Shield size={24} /> InnoViast
          </h1>
          <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-semibold bg-white/5 inline-block px-2 py-1 rounded">
            {user.role} Portal
          </p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <NavItem icon={<BarChart3 />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          {user.role === 'Admin' && <NavItem icon={<UserPlus />} label="Manage Users" active={currentView === 'users'} onClick={() => setCurrentView('users')} />}
          {(user.role === 'Admin' || user.role === 'Instructor') && (
            <>
              <NavItem icon={<BookOpen />} label="Manage Classes" active={currentView === 'classes'} onClick={() => setCurrentView('classes')} />
              <NavItem icon={<CheckSquare />} label="Mark Attendance" active={currentView === 'attendance'} onClick={() => setCurrentView('attendance')} />
              <NavItem icon={<Search />} label="Reports & Export" active={currentView === 'reports'} onClick={() => setCurrentView('reports')} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/5 bg-[#0B0F19]/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate text-gray-200">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 border border-transparent hover:border-orange-500/30 rounded-xl transition-all text-sm font-medium">
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {currentView === 'dashboard' && (user.role === 'Student' ? <StudentDashboard token={token} user={user}/> : <AdminDashboard token={token} user={user} />)}
          {currentView === 'users' && <UsersView token={token} />}
          {currentView === 'classes' && <ClassesView token={token} user={user} />}
          {currentView === 'attendance' && <AttendanceView token={token} />}
          {currentView === 'reports' && <ReportsView token={token} />}
        </div>
      </main>
    </div>
  );
}

// --- AUTHENTICATION ---
function LoginScreen({ setToken, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token); setUser(data.user);
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4 font-sans text-gray-100">
      <div className="max-w-md w-full bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6 relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-teal-500/20 blur-3xl rounded-full"></div>
        
        <div className="text-center relative z-10">
          <Shield size={48} className="mx-auto text-teal-400 mb-4" />
          <h1 className="text-3xl font-bold text-white tracking-tight">System Login</h1>
          <p className="text-slate-400 mt-2 text-sm">Authenticate to access the portal</p>
        </div>

        {error && <div className="bg-orange-500/10 border border-orange-500/30 text-orange-400 p-3 rounded-xl text-sm flex items-center gap-2 relative z-10"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Access Email</label>
            <input type="email" required className="w-full bg-[#0B0F19] text-white px-4 py-3 border border-white/10 rounded-xl focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Security Key</label>
            <input type="password" required className="w-full bg-[#0B0F19] text-white px-4 py-3 border border-white/10 rounded-xl focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-white border border-teal-500/50 font-semibold py-3 rounded-xl transition-all tracking-wide">
            INITIALIZE CONNECTION
          </button>
        </form>
      </div>
    </div>
  );
}

// --- STUDENT DASHBOARD (New Feature) ---
function StudentDashboard({ token, user }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Reusing the report endpoint, but passing the student's ID as a filter
    fetch(`${API_URL}/reports/attendance?studentId=${user.id}`, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    }).then(res => res.ok && res.json()).then(setReports);
  }, [token, user.id]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white tracking-tight">My Attendance Hub</h2>
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 glass-panel">
        {reports.length === 0 ? <p className="text-slate-400">No attendance data recorded yet.</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((session, i) => {
              // Since we filtered by studentId, the records array only contains their specific record
              const myRecord = session.records[0]; 
              const statusColor = myRecord.status === 'Present' ? 'text-teal-400 border-teal-400/30' : myRecord.status === 'Absent' ? 'text-orange-400 border-orange-400/30' : 'text-yellow-400 border-yellow-400/30';
              
              return (
                <div key={i} className={`p-4 rounded-xl border bg-white/5 flex justify-between items-center ${statusColor}`}>
                  <div>
                    <p className="text-sm text-slate-400">{new Date(session.date).toLocaleDateString()}</p>
                    <p className="font-medium text-white">{session.classId?.className}</p>
                  </div>
                  <span className="font-bold tracking-wider uppercase text-sm">{myRecord.status}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// --- ADMIN/INSTRUCTOR DASHBOARD ---
function AdminDashboard({ token, user }) {
  const [stats, setStats] = useState({ totalStudents: 0, totalClasses: 0, todaySessions: 0 });

  useEffect(() => {
    fetch(`${API_URL}/reports/summary`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.ok && res.json()).then(setStats);
  }, [token]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white tracking-tight">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard title="Enrolled Students" value={stats.totalStudents || 0} icon={<Users size={28} className="text-teal-400"/>} />
        <BentoCard title="Active Cohorts" value={stats.totalClasses || 0} icon={<BookOpen size={28} className="text-teal-400"/>} />
        <BentoCard title="Sessions Today" value={stats.todaySessions || 0} icon={<CheckSquare size={28} className="text-teal-400"/>} />
      </div>
    </div>
  );
}

// --- MANAGE CLASSES (Logic Fixed) ---
function ClassesView({ token, user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  
  const [newClassName, setNewClassName] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/classes`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setClasses);
    fetch(`${API_URL}/auth/users?role=Student`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setStudents);
    if(user.role === 'Admin') {
      fetch(`${API_URL}/auth/users?role=Instructor`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setInstructors);
    }
  }, [token, user.role]);

  const toggleStudent = (id) => setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/classes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ className: newClassName, students: selectedStudents, instructorId: selectedInstructor })
    });
    window.location.reload(); // Quick refresh to show new data
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white tracking-tight">Cohort Management</h2>
      
      <form onSubmit={handleCreate} className="bg-[#111827] border border-white/5 p-6 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Cohort Designation</label>
            <input type="text" required className="w-full bg-[#0B0F19] text-white px-4 py-3 border border-white/10 rounded-xl focus:border-teal-500 outline-none" value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="e.g. BWD-04" />
          </div>
          {user.role === 'Admin' && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Assign Instructor</label>
              <select required className="w-full bg-[#0B0F19] text-white px-4 py-3 border border-white/10 rounded-xl focus:border-teal-500 outline-none" value={selectedInstructor} onChange={e => setSelectedInstructor(e.target.value)}>
                <option value="">-- Select Instructor --</option>
                {instructors.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
              </select>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Select Roster (Enroll Students)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-4 bg-[#0B0F19] border border-white/5 rounded-xl">
            {students.length === 0 ? <p className="text-slate-500 text-sm">No students registered in system.</p> : students.map(s => (
              <label key={s._id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedStudents.includes(s._id) ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/20'}`}>
                <input type="checkbox" className="hidden" checked={selectedStudents.includes(s._id)} onChange={() => toggleStudent(s._id)} />
                <span className="text-sm font-medium truncate">{s.name}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-teal-500/20 hover:bg-teal-500 text-teal-400 hover:text-white border border-teal-500/50 px-6 py-3 rounded-xl font-medium transition-all">Compile Cohort</button>
      </form>

      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/5 text-slate-400">
            <tr><th className="p-4">Cohort Name</th><th className="p-4">Lead Instructor</th><th className="p-4">Enrolled count</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-200">
            {classes.map(cls => (
              <tr key={cls._id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-teal-400">{cls.className}</td>
                <td className="p-4">{cls.instructorId?.name || 'Self'}</td>
                <td className="p-4">{cls.students?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- MARK ATTENDANCE (Logic Fixed) ---
function AttendanceView({ token }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [attendanceState, setAttendanceState] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => { fetch(`${API_URL}/classes`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setClasses); }, [token]);

  const activeClass = classes.find(c => c._id === selectedClassId);

  useEffect(() => {
    if (activeClass?.students) {
      const state = {};
      activeClass.students.forEach(s => state[s._id] = 'Present');
      setAttendanceState(state);
    }
  }, [activeClass]);

  const submitAttendance = async () => {
    const records = Object.keys(attendanceState).map(studentId => ({ studentId, status: attendanceState[studentId] }));
    const res = await fetch(`${API_URL}/attendance`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ classId: selectedClassId, date: new Date().toISOString().split('T')[0], records })
    });
    setMsg(res.ok ? 'Data securely committed.' : 'Commit failed.');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white tracking-tight">Session Roll Call</h2>
      {msg && <div className="p-4 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-xl">{msg}</div>}
      
      <div className="bg-[#111827] border border-white/5 p-6 rounded-2xl">
        <select className="w-full bg-[#0B0F19] text-white px-4 py-3 border border-white/10 rounded-xl focus:border-teal-500 outline-none mb-6" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
          <option value="">-- Initialize Target Cohort --</option>
          {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
        </select>

        {activeClass && (
          <div className="space-y-4">
            {activeClass.students.length === 0 ? <p className="text-slate-500">No targets found in this cohort.</p> : activeClass.students.map(s => (
              <div key={s._id} className="flex justify-between items-center p-4 bg-[#0B0F19] border border-white/5 rounded-xl">
                <span className="font-medium text-gray-200">{s.name}</span>
                <div className="flex gap-2">
                  {['Present', 'Absent', 'Late'].map(status => {
                    const isSelected = attendanceState[s._id] === status;
                    const colorClasses = status === 'Present' ? 'peer-checked:bg-teal-500/20 peer-checked:text-teal-400 peer-checked:border-teal-500/50' 
                                     : status === 'Absent' ? 'peer-checked:bg-orange-500/20 peer-checked:text-orange-400 peer-checked:border-orange-500/50' 
                                     : 'peer-checked:bg-yellow-500/20 peer-checked:text-yellow-400 peer-checked:border-yellow-500/50';
                    return (
                      <label key={status} className="relative cursor-pointer">
                        <input type="radio" name={s._id} className="peer hidden" checked={isSelected} onChange={() => setAttendanceState(prev => ({...prev, [s._id]: status}))} />
                        <span className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-white/10 text-slate-400 transition-all ${colorClasses}`}>
                          {status}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
            <button onClick={submitAttendance} className="w-full mt-6 bg-teal-500/20 hover:bg-teal-500 text-teal-400 hover:text-white border border-teal-500/50 py-3 rounded-xl font-bold tracking-wide transition-all">EXECUTE COMMIT</button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- REPORTS & EXPORT (Logic Fixed) ---
function ReportsView({ token }) {
  const [reports, setReports] = useState([]);
  useEffect(() => { fetch(`${API_URL}/reports/attendance`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setReports); }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Data Logs</h2>
        {/* EXPORT LOGIC FIXED: Token sent as URL Parameter */}
        <a href={`${API_URL}/reports/export?token=${token}`} className="bg-teal-500/20 text-teal-400 border border-teal-500/50 hover:bg-teal-500 hover:text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all">
          <Download size={18}/> Extract CSV
        </a>
      </div>
      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-200">
          <thead className="bg-white/5 border-b border-white/5 text-slate-400"><tr><th className="p-4">Timestamp</th><th className="p-4">Cohort</th><th className="p-4">Status Distribution</th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {reports.map((s, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-xs">{new Date(s.date).toLocaleDateString()}</td>
                <td className="p-4">{s.classId?.className}</td>
                <td className="p-4 flex gap-3">
                  <span className="text-teal-400">P: {s.records.filter(r => r.status === 'Present').length}</span>
                  <span className="text-orange-400">A: {s.records.filter(r => r.status === 'Absent').length}</span>
                  <span className="text-yellow-400">L: {s.records.filter(r => r.status === 'Late').length}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- USERS (Admin Only) ---
function UsersView() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white tracking-tight">Identity Access Management</h2>
      <p className="text-slate-400">Use Postman for user registration in this build. (Logic exists in backend, omitted from UI to save space).</p>
    </div>
  );
}

// --- UTILITIES ---
function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium border ${active ? 'bg-teal-500/10 border-teal-500/30 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.1)]' : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-gray-200'}`}>
      {icon} {label}
    </button>
  );
}
function BentoCard({ title, value, icon }) {
  return (
    <div className="bg-[#111827] border border-white/5 p-6 rounded-2xl flex items-center gap-5 hover:border-white/10 transition-colors">
      <div className="bg-[#0B0F19] border border-white/10 p-4 rounded-xl shadow-inner">{icon}</div>
      <div>
        <h4 className="text-slate-400 text-sm font-medium tracking-wide uppercase">{title}</h4>
        <p className="text-4xl font-bold text-white tracking-tight mt-1">{value}</p>
      </div>
    </div>
  );
}