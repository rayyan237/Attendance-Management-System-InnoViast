import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, X } from 'lucide-react';
const API_URL = 'https://attendance-management-system-innoviast.onrender.com/api';

export default function UsersView({ token }) {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // Unified form state for both Creating and Updating
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Student' });

  const fetchUsers = () => {
    fetch(`${API_URL}/auth/users`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(setUsers);
  };
  
  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (user) => {
    setEditingId(user._id);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', role: 'Student' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/auth/users/${editingId}` : `${API_URL}/auth/register`;
    const method = editingId ? 'PUT' : 'POST';

    // If editing and password is left blank, remove it from payload so it isn't overwritten
    const payload = { ...formData };
    if (editingId && !payload.password) delete payload.password;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    
    resetForm();
    fetchUsers();
  };

  const handleDelete = async (id, role) => {
    if (role === 'Admin') {
      alert("System Rule Violation: Cannot delete fellow Administrators.");
      return;
    }
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      await fetch(`${API_URL}/auth/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white tracking-tight">Identity Access Management</h2>
      
      {/* Creation / Edit Form Bento */}
      <form onSubmit={handleSubmit} className="bg-[#111827] border border-white/5 p-6 rounded-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-medium ${editingId ? 'text-orange-400' : 'text-teal-400'}`}>
            {editingId ? 'Modify Access Credentials' : 'Provision New Identity'}
          </h3>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
              <X size={16} /> Cancel Modification
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" required className="bg-[#0B0F19] text-white p-3 border border-white/10 rounded-xl outline-none focus:border-teal-500 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email Address" required className="bg-[#0B0F19] text-white p-3 border border-white/10 rounded-xl outline-none focus:border-teal-500 transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          
          <input type="password" placeholder={editingId ? "New Password (Leave blank to keep current)" : "Initial Password"} required={!editingId} className="bg-[#0B0F19] text-white p-3 border border-white/10 rounded-xl outline-none focus:border-teal-500 transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <select className="bg-[#0B0F19] text-white p-3 border border-white/10 rounded-xl outline-none focus:border-teal-500 transition-all" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="Student">Student Access</option>
            <option value="Instructor">Instructor Access</option>
            <option value="Admin">Administrator Access</option>
          </select>
          
          <button type="submit" className={`col-span-1 md:col-span-2 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 hover:bg-orange-500 hover:text-white' : 'bg-teal-500/20 text-teal-400 border border-teal-500/50 hover:bg-teal-500 hover:text-white'}`}>
            {editingId ? <Edit2 size={18} /> : <UserPlus size={18} />}
            {editingId ? 'Commit Modifications' : 'Initialize Identity'}
          </button>
        </div>
      </form>
      
      {/* Data Table */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-200">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="p-4">Identity</th>
              <th className="p-4">Contact Protocol</th>
              <th className="p-4">Authorization Level</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 font-mono text-xs">{u.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                    u.role === 'Admin' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                    u.role === 'Instructor' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 
                    'bg-teal-500/10 text-teal-400 border-teal-500/30'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => handleEdit(u)} className="text-slate-400 hover:text-teal-400 transition-colors" title="Modify Identity">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(u._id, u.role)} className={`transition-colors ${u.role === 'Admin' ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-red-400'}`} title="Terminate Identity">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}