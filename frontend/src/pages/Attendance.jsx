import React, { useState, useEffect } from 'react';
const API_URL = 'http://localhost:5000/api';

export default function AttendanceView({ token }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [attendanceState, setAttendanceState] = useState({});

  useEffect(() => { fetch(`${API_URL}/classes`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).then(setClasses); }, []);

  const activeClass = classes.find(c => c._id === selectedClassId);
  useEffect(() => {
    if (activeClass?.students) {
      const state = {}; activeClass.students.forEach(s => state[s._id] = 'Present'); setAttendanceState(state);
    }
  }, [activeClass]);

  const submitAttendance = async () => {
    const records = Object.keys(attendanceState).map(studentId => ({ studentId, status: attendanceState[studentId] }));
    await fetch(`${API_URL}/attendance`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ classId: selectedClassId, date: new Date().toISOString().split('T')[0], records })
    });
    alert('Attendance Committed!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Session Roll Call</h2>
      <div className="bg-[#111827] border border-white/5 p-6 rounded-2xl">
        <select className="w-full bg-[#0B0F19] text-white px-4 py-3 border border-white/10 rounded-xl outline-none mb-6" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
          <option value="">-- Target Cohort --</option>
          {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
        </select>
        {activeClass && (
          <div className="space-y-4">
            {activeClass.students.map(s => (
              <div key={s._id} className="flex justify-between items-center p-4 bg-[#0B0F19] border border-white/5 rounded-xl">
                <span className="font-medium text-gray-200">{s.name}</span>
                <div className="flex gap-2">
                  {['Present', 'Absent', 'Late'].map(status => (
                    <label key={status} className="cursor-pointer">
                      <input type="radio" className="peer hidden" checked={attendanceState[s._id] === status} onChange={() => setAttendanceState(prev => ({...prev, [s._id]: status}))} />
                      <span className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border border-white/10 text-slate-400 ${status === 'Present' ? 'peer-checked:text-teal-400 peer-checked:border-teal-500' : 'peer-checked:text-orange-400 peer-checked:border-orange-500'}`}>{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={submitAttendance} className="w-full mt-6 bg-teal-500/20 text-teal-400 border border-teal-500/50 py-3 rounded-xl font-bold">EXECUTE COMMIT</button>
          </div>
        )}
      </div>
    </div>
  );
}