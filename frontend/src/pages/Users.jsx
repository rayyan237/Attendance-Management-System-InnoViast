import React, { useState, useEffect } from 'react';
const API_URL = 'http://localhost:5000/api';

export default function UsersView({ token }) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Student' });

  const fetchUsers = () => fetch(`${API_URL}/auth/users`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setUsers);
  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setFormData({ name: '', email: '', password: '', role: 'Student' });
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Identity Access Management</h2>
      <form onSubmit={handleCreate} className="bg-[#111827] border border-white/5 p-6 rounded-2xl grid grid-cols-2 gap-4">
        <input type="text" placeholder="Full Name" required className="bg-[#0B0F19] text-white p-3 border border-white/10 rounded-xl outline-none focus:border-teal-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="email" placeholder="Email" required className="bg-[#0B0F19] text-white p-3 border border-white/10 rounded-xl outline-none focus:border-teal-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" required className="bg-[#0B0F19] text-white p-3 border border-white/10 rounded-xl outline-none focus:border-teal-500" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
        <select className="bg-[#0B0F19] text-white p-3 border border-white/10 rounded-xl outline-none focus:border-teal-500" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
          <option>Student</option><option>Instructor</option><option>Admin</option>
        </select>
        <button className="col-span-2 bg-teal-500/20 text-teal-400 border border-teal-500/50 py-3 rounded-xl font-bold hover:bg-teal-500 hover:text-white transition-all">Provision User</button>
      </form>
      
      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-200">
          <thead className="bg-white/5 text-slate-400"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-white/5">
                <td className="p-4">{u.name}</td><td className="p-4">{u.email}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${u.role === 'Admin' ? 'bg-orange-500/20 text-orange-400' : 'bg-teal-500/20 text-teal-400'}`}>{u.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}