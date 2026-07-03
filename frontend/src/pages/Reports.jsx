import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
const API_URL = 'https://attendance-management-system-innoviast.onrender.com/api';

export default function ReportsView({ token }) {
  const [reports, setReports] = useState([]);
  const [classes, setClasses] = useState([]);
  
  // Filter States
  const [filterClass, setFilterClass] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetch(`${API_URL}/classes`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setClasses); }, []);

  const fetchReports = () => {
    let url = `${API_URL}/reports/attendance?`;
    if (filterClass) url += `classId=${filterClass}&`;
    if (startDate && endDate) url += `startDate=${startDate}&endDate=${endDate}&`;
    if (statusFilter) url += `status=${statusFilter}&`;

    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setReports);
  };

  useEffect(() => { fetchReports(); }, [filterClass, startDate, endDate, statusFilter]);

  const exportUrl = `${API_URL}/reports/export?token=${token}${filterClass ? `&classId=${filterClass}` : ''}${startDate ? `&startDate=${startDate}&endDate=${endDate}` : ''}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Data Logs & Exports</h2>
        <a href={exportUrl} className="bg-teal-500/20 text-teal-400 border border-teal-500/50 px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium hover:bg-teal-500 hover:text-white transition-all"><Download size={18}/> Extract CSV</a>
      </div>
      
      {/* Advanced Filters */}
      <div className="bg-[#111827] border border-white/5 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
        <select className="bg-[#0B0F19] text-white p-2 rounded-xl border border-white/10 outline-none" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
          <option value="">All Cohorts</option>
          {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
        </select>
        <input type="date" className="bg-[#0B0F19] text-slate-400 p-2 rounded-xl border border-white/10 outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" className="bg-[#0B0F19] text-slate-400 p-2 rounded-xl border border-white/10 outline-none" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <select className="bg-[#0B0F19] text-white p-2 rounded-xl border border-white/10 outline-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Present">Present Only</option>
          <option value="Absent">Absent Only</option>
          <option value="Late">Late Only</option>
        </select>
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-200">
          <thead className="bg-white/5 text-slate-400"><tr><th className="p-4">Date</th><th className="p-4">Cohort</th><th className="p-4">Records</th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {reports.map((s, i) => (
              <tr key={i} className="hover:bg-white/5">
                <td className="p-4 font-mono text-xs">{new Date(s.date).toLocaleDateString()}</td>
                <td className="p-4">{s.classId?.className}</td>
                <td className="p-4 flex flex-wrap gap-2">
                  {s.records.map((r, idx) => (
                    <span key={idx} className={`px-2 py-1 rounded text-xs border ${r.status === 'Present' ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/30'}`}>
                      {r.studentId?.name || 'Unknown'}: {r.status}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}