import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <form 
        onSubmit={(e) => { 
          e.preventDefault();
          setError('');
          setLoading(true);
          login(form.email, form.password)
            .then(() => navigate('/dashboard'))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        }} 
        className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full space-y-4 border border-purple-100"
      >
        <h2 className="text-2xl font-black text-slate-900 text-center">Login</h2>
        <input 
          type="email" 
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600" 
          required 
        />
        <button 
          type="submit" 
          className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        {error && <p className="text-xs text-center text-rose-600 font-bold">{error}</p>}
        <p className="text-[11px] text-center text-slate-500">
          Don't have an account? <Link to="/register" className="text-purple-700 font-bold hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;