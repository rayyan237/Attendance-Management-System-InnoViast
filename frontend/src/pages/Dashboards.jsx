import React, { useState, useEffect } from 'react';
import { Users, BookOpen, CheckSquare } from 'lucide-react';
const API_URL = 'http://localhost:5000/api';

export default function Dashboards({ token, user }) {
  const [stats, setStats] = useState({ totalStudents: 0, totalClasses: 0, todaySessions: 0 });
  const [studentReports, setStudentReports] = useState([]);

  useEffect(() => {
    if (user.role !== 'Student') {
      fetch(`${API_URL}/reports/summary`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json()).then(setStats);
    } else {
      fetch(`${API_URL}/reports/attendance?studentId=${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json()).then(setStudentReports);
    }
  }, [token, user]);

  if (user.role === 'Student') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">My Attendance Hub</h2>
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
          {studentReports.length === 0 ? <p className="text-slate-400">No data recorded.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentReports.map((session, i) => {
                const myRecord = session.records?.[0]; 
                if (!myRecord) return null; // FIX: Prevents the white screen crash!
                
                const statusColor = myRecord.status === 'Present' ? 'text-teal-400 border-teal-400/30' : myRecord.status === 'Absent' ? 'text-orange-400 border-orange-400/30' : 'text-yellow-400 border-yellow-400/30';
                return (
                  <div key={i} className={`p-4 rounded-xl border bg-white/5 flex justify-between items-center ${statusColor}`}>
                    <div><p className="text-sm text-slate-400">{new Date(session.date).toLocaleDateString()}</p><p className="font-medium text-white">{session.classId?.className}</p></div>
                    <span className="font-bold tracking-wider uppercase">{myRecord.status}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard title="Students" value={stats.totalStudents} icon={<Users size={28} className="text-teal-400"/>} />
        <BentoCard title="Cohorts" value={stats.totalClasses} icon={<BookOpen size={28} className="text-teal-400"/>} />
        <BentoCard title="Today's Sessions" value={stats.todaySessions} icon={<CheckSquare size={28} className="text-teal-400"/>} />
      </div>
    </div>
  );
}

function BentoCard({ title, value, icon }) {
  return (
    <div className="bg-[#111827] border border-white/5 p-6 rounded-2xl flex items-center gap-5">
      <div className="bg-[#0B0F19] border border-white/10 p-4 rounded-xl">{icon}</div>
      <div>
        <h4 className="text-slate-400 text-sm font-medium uppercase">{title}</h4>
        <p className="text-4xl font-bold text-white mt-1">{value || 0}</p>
      </div>
    </div>
  );
}