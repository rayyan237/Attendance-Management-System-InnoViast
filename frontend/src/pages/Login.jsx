import React, { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
const API_URL = 'http://localhost:5000/api';

export default function Login({ setToken, setUser }) {
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
      <div className="max-w-md w-full bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-teal-500/20 blur-3xl rounded-full"></div>
        <div className="text-center relative z-10">
          <Shield size={48} className="mx-auto text-teal-400 mb-4" />
          <h1 className="text-3xl font-bold text-white tracking-tight">System Login</h1>
        </div>
        {error && <div className="mt-4 bg-orange-500/10 border border-orange-500/30 text-orange-400 p-3 rounded-xl text-sm flex items-center gap-2 relative z-10"><AlertCircle size={16} /> {error}</div>}
        <form onSubmit={handleLogin} className="mt-6 space-y-5 relative z-10">
          <input type="email" required placeholder="Access Email" className="w-full bg-[#0B0F19] text-white px-4 py-3 border border-white/10 rounded-xl focus:border-teal-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" required placeholder="Security Key" className="w-full bg-[#0B0F19] text-white px-4 py-3 border border-white/10 rounded-xl focus:border-teal-500 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-white border border-teal-500/50 font-semibold py-3 rounded-xl transition-all">INITIALIZE CONNECTION</button>
        </form>
      </div>
    </div>
  );
}