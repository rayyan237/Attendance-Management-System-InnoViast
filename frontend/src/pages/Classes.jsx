import React, { useState, useEffect } from 'react';
const API_URL = 'https://attendance-management-system-innoviast.onrender.com/api';

export default function ClassesView({ token, user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [className, setClassName] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  const fetchData = () => {
    fetch(`${API_URL}/classes`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setClasses);
    fetch(`${API_URL}/auth/users?role=Student`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setStudents);
    if(user.role === 'Admin') fetch(`${API_URL}/auth/users?role=Instructor`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setInstructors);
  };
  useEffect(() => { fetchData(); }, [token]);

  const toggleStudent = (id) => setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const handleEdit = (cls) => {
    setEditingId(cls._id);
    setClassName(cls.className);
    setInstructorId(cls.instructorId?._id || '');
    setSelectedStudents(cls.students.map(s => s._id));
  };

  const resetForm = () => { setEditingId(null); setClassName(''); setInstructorId(''); setSelectedStudents([]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/classes/${editingId}` : `${API_URL}/classes`;
    const method = editingId ? 'PUT' : 'POST';
    
    await fetch(url, {
      method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ className, students: selectedStudents, instructorId })
    });
    resetForm(); fetchData();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Cohort Management</h2>
      
      <form onSubmit={handleSubmit} className="bg-[#111827] border border-white/5 p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h3 className="text-lg font-medium text-teal-400">{editingId ? 'Modify Existing Cohort' : 'Initialize New Cohort'}</h3>
          {editingId && <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white text-sm">Cancel Edit</button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" required placeholder="Cohort Designation" className="w-full bg-[#0B0F19] text-white px-4 py-3 border border-white/10 rounded-xl outline-none focus:border-teal-500" value={className} onChange={e => setClassName(e.target.value)} />
          {user.role === 'Admin' && (
            <select required className="w-full bg-[#0B0F19] text-white px-4 py-3 border border-white/10 rounded-xl outline-none focus:border-teal-500" value={instructorId} onChange={e => setInstructorId(e.target.value)}>
              <option value="">-- Select Instructor --</option>
              {instructors.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
            </select>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-4 bg-[#0B0F19] border border-white/5 rounded-xl">
          {students.map(s => (
            <label key={s._id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${selectedStudents.includes(s._id) ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' : 'bg-white/5 border-white/5 text-slate-300'}`}>
              <input type="checkbox" className="hidden" checked={selectedStudents.includes(s._id)} onChange={() => toggleStudent(s._id)} />
              <span className="text-sm font-medium">{s.name}</span>
            </label>
          ))}
        </div>
        <button type="submit" className="bg-teal-500/20 text-teal-400 border border-teal-500/50 px-6 py-3 rounded-xl font-medium hover:bg-teal-500 hover:text-white transition-all w-full">
          {editingId ? 'Update Cohort Configuration' : 'Compile New Cohort'}
        </button>
      </form>

      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-200">
          <thead className="bg-white/5 text-slate-400"><tr><th className="p-4">Cohort</th><th className="p-4">Lead Instructor</th><th className="p-4">Enrolled</th><th className="p-4">Action</th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {classes.map(cls => (
              <tr key={cls._id} className="hover:bg-white/5">
                <td className="p-4 text-teal-400">{cls.className}</td>
                <td className="p-4">{cls.instructorId?.name || 'Self'}</td>
                <td className="p-4">{cls.students?.length || 0}</td>
                <td className="p-4"><button onClick={() => handleEdit(cls)} className="text-orange-400 hover:text-orange-300 text-xs font-bold uppercase">Configure</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}